
"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');
var PlayerRank = require('../info/player-ranks');


class Match extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Stores the move and send it to the opponent.
     * 
     * The game move coordination is as follows:
     * 
     * - The first play makes a move and send it to opponent
     *   with a serial number of 1
     * - Then the second play upon receiving the move, makes his
     *   move, increasing move serial number by one and sends it
     *   to the opponent. And so on in that fashion
     *   
     * So, 
     *   player_1 --> move.serial_no === 1 (ie start) 
     *   player_2 --> move.serial_no === 2 (ie move.serial_no++ of player_1)
     *   player_1 --> move.serial_no === 3 (ie move.serial_no++ of player_2) 
     *   player_2 --> move.serial_no === 4 (ie move.serial_no++ of player_1) 
     *   player_1 --> move.serial_no === 5 (ie move.serial_no++ of player_2) 
     *   and so on...
     *   
     * The client side is expected to do this coordination.
     * 
     * Client must also make sure that it increase the serial number
     * of the opponent move object to obtain its own move serial number
     * Such care will avoid bug. An except will be in the case where the opponent
     * loses his turn that the client move serial number will be exactly that
     * of the opponent serial number - client make be very careful in this 
     * move coordination and consider all scenarios to avoid bug of any kind.
     * 
     * 
     *   
     * 
     * @param {type} user_id
     * @param {type} opponent_ids - array of opponent ids. for two player games like 
     * chess and draft it can be a single string. 
     * @param {type} game_id
     * @param {type} move - the move. It must contain the serial_no field
     * @returns {String}
     */
    async sendMove(user_id, opponent_ids, game_id, move) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            opponent_ids = arguments[0].opponent_ids;
            game_id = arguments[0].game_id;
            move = arguments[0].move; // one main use for this is to obtain the zip code
        }

        if (!Array.isArray(opponent_ids)) {
            opponent_ids = [opponent_ids];
        }

        //make user only opponents ids are in the list
        for (var i = 0; i < opponent_ids.length; i++) {
            if (user_id === opponent_ids[i]) {
                return this.error(`invalid input- expected only opponent id(s) but found user id - ${user_id}`);
            }
        }

        //check if the move contains the serial_no field
        if (!('serial_no' in move)) {
            return this.error('invalid input - missing serial_no field in move object!');
        }

        if (!isFinite(move.serial_no) || move.serial_no < 1) {
            return this.error('invalid input - move serial number must be a positive integer number!');
        }

        //first quickly forward the move to the opponenct
        var data = {
            game_id: game_id,
            move: move
        };

        this.broadcast(this.evt.game_move, data, opponent_ids, true);//forward move to the opponents

        //save the move in the server asynchronously
        var c = this.sObj.db.collection(this.sObj.col.matches);
        var me = this;


        c.updateOne({game_id: game_id}, {$push: {moves: move}})//moves array is the game position of the the game. it holds all the move of the game
                .then(function (result) {
                    if (!result) {
                        return;
                    }
                    //Acknowlege move sent by notifying the player that
                    //the sever has receive the move and sent it to the opponents
                    data.move_sent = true;
                    return me.send(me.evt.game_move_sent, data, user_id, true);
                })
                .catch(function (err) {

                    if (~err.message.indexOf('11000')) {
                        //move already stored hence the duplicate key exception!
                    } else {
                        console.log(err);
                    }
                });


        //next, broadcast to the game spectators.

        //so lets get the spectators viewing this game
        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        var spectators = await sc.find({game_id: game_id}, {_id: 0}).toArray();

        var spectators_ids = [];
        for (var i = 0; i < spectators.length; i++) {
            spectators_ids[i] = spectators[i].user_id;
        }

        //now broadcast to the spectators
        this.broadcast(this.evt.game_move, data, spectators_ids);

    }

    /**
     * The game position is all the array of moves for the
     * specified game id.
     * 
     * Client is expected to use the array of moves to refresh
     * the playing area (e.g game board) and determine the player
     * whose turn is to play.
     * 
     * @param {type} game_id
     * @returns {undefined}
     */
    async getGamePosition(game_id) {
        try {

            var c = this.sObj.db.collection(this.sObj.col.matches);

            var match = await c.findOne({game_id: game_id});

        } catch (e) {
            console.log(e);
            this.error('could not get game position');
            return this;
        }

        if (!match) {
            return [];
        }

        var game_position = match.moves; // array of moves

        return game_position;
    }

    async _findOneAndDeletMatchFixture(game_id) {
        var sc = this.sObj.db.collection(this.sObj.col.match_fixtures);
        var r = await sc.findOneAndDelete({game_id: game_id}, {projection: {_id: 0}});
        return r.value;
    }

    async _findOneAndDeletePlayRequest(game_id) {
        var sc = this.sObj.db.collection(this.sObj.col.play_requests);
        var r = await sc.findOneAndDelete({game_id: game_id}, {projection: {_id: 0}});
        console.log(r);
        return r.value;
    }
    /**
     * This method check when any of the specified players engaged in another game
     * and invalidates the  process if a player is found to be engaged.
     * 
     * @param {type} user
     * @param {type} players
     * @returns {Match@call;error}
     */
    async _validatePlayersBegin(user, players) {
        var was_idle = [];
        var player_engaged;

        for (var i = 0; i < players.length; i++) {

            if (players[i].available) {
                if (players[i].playing) {//already playing
                    player_engaged = players[i];
                    break;
                }
                var play_status_obj = await user._setPlaying(players[i].user_id);
                if (play_status_obj.lastError) {//
                    return this.error('could not begin game');
                }
                was_idle.push({
                    player: players[i],
                    marked_time: play_status_obj.play_begin_time
                });
            }

        }

        if (!player_engaged) {
            return true;
        }

        //at this point a player is engaged so roll back any changes made already

        for (var i = 0; i < was_idle.length; i++) {
            var was_idle_player = was_idle[i].player;
            var marked_time = was_idle[i].marked_time;
            //making sure the play status did not change between the time will
            //marked it and now
            if (was_idle_player.play_begin_time === marked_time) {
                await user._unsetPlaying(was_idle_player.user_id);
            }
        }

        //send the error
        return this.error({//clent should take note of this error object
            player: player_engaged, //so we can access the player info
            play_status: true //already engaged
        });

    }

    /**
     * broadcast the watch_game_start or watch_game_resume event to users related in one way
     * or the other to any of the players - ie via contacts or group.
     * 
     * If the match is a contact match the event is broadcasted to all the
     * contacts of all the players.
     * 
     * If the match is a group match the event is broadcasted to all the members
     * of the group and also all the contacts off all the players
     * 
     * If the match is a tournament match the event is broadcasted to all the
     * other players and officials and also all the contacts off all the players
     *
     * @param {type} match
     * @param {type} event_name
     * @returns {undefined}
     */

    async _broadcastWatchGame(match, event_name) {

        var players = match.players;
        var related_user_ids = [];
        var players_ids = [];
        for (var i = 0; i < players.length; i++) {
            players_ids.push(players[i].user_id);
            var contacts = players[i].contacts;
            for (var i = 0; i < contacts.length; i++) {
                related_user_ids.push(contacts[i]);
            }
        }


        if (match.group_name) {
            try {
                var c = this.sObj.db.collection(this.sObj.col.groups);
                var group = await c.findOne({name: match.group_name}, {_id: 0, members: 1});
                if (group) {
                    //add the group members user ids to the related_user_ids array
                    for (var i = 0; i < group.members.length; i++) {
                        if (group.members[i].committed) {
                            if (players_ids.indexOf(group.members[i].user_id) > -1) {
                                continue;//skip the players themselves
                            }
                            related_user_ids.push(group.members[i].user_id);

                        }
                    }
                }

            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION
            }

        }


        if (match.tournament_name) {
            try {
                var c = this.sObj.db.collection(this.sObj.col.tournaments);
                var tourn = await c.findOne({name: match.tournament_name}, {_id: 0, officials: 1, players: 1});
                if (tourn) {
                    //add the tournament officials user ids to the related_user_ids array
                    for (var i = 0; i < tourn.officials.length; i++) {
                        if (players_ids.indexOf(tourn.officials[i].user_id) > -1) {
                            continue;//skip the players themselves
                        }
                        related_user_ids.push(tourn.officials[i].user_id);
                    }

                    //add the tournament players user ids to the related_user_ids array
                    for (var i = 0; i < tourn.players.length; i++) {
                        if (players_ids.indexOf(tourn.players[i].user_id) > -1) {
                            continue;//skip the players themselves
                        }
                        related_user_ids.push(tourn.players[i].user_id);
                    }

                }

            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION
            }

        }

        //ensure no duplicate
        this.util.toSet(related_user_ids);

        //now broadcast to the related users
        this.broadcast(event_name, match, related_user_ids, true, this.sObj.GAME_MAX_WAIT_IN_SEC);

    }

    /**
     * Starts the game by broadcasting the game start event to 
     * the players. The game id provided is used to find the 
     * game document object in 'play_requests' and 'match_fixtures'
     * collections. And then relocated to 'matches' collections.
     * If the second parameter is provided then only the 
     * oppropriate collection is searched. This is useful to
     * reduce search load when you already know where to search
     * 
     * For a two players game like chess and draft
     * the first player in the players array is the white ahd
     * the second is the black.
     * 
     * @param {type} game_id - id of the game to start
     * @param {type} fixture_type - (optional) whether it is play request or group or tournament match fixture.
     * valid if paramater if provided are 'play request' and ' match fixture'
     * @returns {undefined}
     */
    async start(game_id, fixture_type) {
        var mtcObj;
        if (fixture_type === 'match fixture') {
            mtcObj = await this._findOneAndDeletMatchFixture(game_id);
        } else if (fixture_type === 'play request') {
            mtcObj = await this._findOneAndDeletePlayRequest(game_id);
        } else {
            mtcObj = await this._findOneAndDeletMatchFixture(game_id);
            if (!mtcObj) {
                mtcObj = await this._findOneAndDeletePlayRequest(game_id);
            }
        }

        if (!mtcObj) {
            return 'Not available!';
        }

        //modify accordingly and relocate the match obect to the 'matches' colllection

        //but first add some more player info
        var user = new User(this.sObj, this.util, this.evt);
        var players_ids = mtcObj.players;
        for (var i = 0; i < mtcObj.players.length; i++) {
            if (typeof mtcObj.players[i] === 'object') {//just in case
                players_ids[i] = mtcObj.players[i].user_id;
            }
        }

        //include  contacts and groups_belong in the required_fields - important! see their use below for broadcasting to related users
        var required_fields = ['contacts', 'groups_belong', 'user_id', 'first_name', 'last_name', 'email', 'photo_url'];
        var players = await user.getInfoList(players_ids, required_fields);

        //check if the player info list is complete - ie match  the number requested for
        var missing = this.util.findMissing(players_ids, players, function (p_id, p_info) {
            return p_id === p_info.user_id;
        });

        if (missing) {
            //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
            return this.error('could not find player with user id - ' + missing);
        }

        var default_rules = this.sObj.game.get(mtcObj.game_name).getDefautRules();

        //set the players as available
        for (var i = 0; i < players.length; i++) {
            players[i].available = true;//important! used to determine when a player abandons a game in which case it is set to false
        }

        var v = await this._validatePlayersBegin(user, players);
        if (v.lastError) {
            return v.lastEror;
        }

        var match = {
            group_name: mtcObj.group_name ? mtcObj.group_name : '',
            tournament_name: mtcObj.tournament_name ? mtcObj.tournament_name : '',
            game_id: mtcObj.game_id,
            game_name: mtcObj.game_name,
            game_rules: mtcObj.game_rules ? mtcObj.game_rules : default_rules,
            game_status: 'live',
            game_score: '',
            game_start_time: new Date(),
            moves: [], //game position
            players: players
        };

        var c = this.sObj.db.collection(this.sObj.col.matches);
        var r = await c.insertOne(match, {w: 'majority'});

        if (!r.result.n) {
            return 'could not start game';
        }

        //broadcast the game start event to all the players concern
        match.players = players;
        this.broadcast(this.evt.game_start, match, players_ids, true, this.sObj.GAME_MAX_WAIT_IN_SEC);

        //broadcast the watch_game_start event to users related in one way
        //or the other to any of the players - ie via contacts or group
        this._broadcastWatchGame(match, this.evt.watch_game_start);

        return 'game started successfully';
    }

    /**
     * Resume a game that was pause/suspended.
     * 
     * @param {type} user_id - user id of the player attempting to resume the 
     * game. This can be set to null if not resume by a player but by say
     * an automatic operation. 
     * @param {type} game_id
     * @returns {undefined}
     */
    async resume(user_id, game_id) {

        var c = this.sObj.db.collection(this.sObj.col.matches);
        try {
            var match = await c.findOne({game_id: game_id});
            if (!match) {
                return 'no game to resume';
            }
        } catch (e) {
            console.log(e);
            this.error('could not resume game');
            return this;
        }

        if (match.game_status === 'live') {
            return  'game is already live!';
        }
        //broadcast the game resume event

        var user = new User(this.sObj, this.util, this.evt);
        var users_ids = [];
        var players_ids = [];
        for (var i = 0; i < match.players.length; i++) {
            //exclude players that might have abandon the game
            if (match.players[i].available) {
                players_ids[i] = match.players[i].user_id;
            }
        }

        //include  contacts and groups_belong in the required_fields - important! see their use below for broadcasting to related users
        var required_fields = ['contacts', 'groups_belong', 'user_id', 'first_name', 'last_name', 'email', 'photo_url'];
        var players = await user.getInfoList(players_ids, required_fields);

        //check if the player info list is complete - ie match the numbers requested for
        var missing = this.util.findMissing(players_ids, players, function (p_id, p_info) {
            return p_id === p_info.user_id;
        });

        if (missing) {
            //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
            return this.error('could not find player with user id - ' + missing);
        }

        for (var i = 0; i < players.length; i++) {
            //set the players as available since we know they are available from the check above
            players[i].available = true;//important! used to determine when a player abandons a game in which case it is set to false

            if (players[i].user_id === user_id) {//yes skip, we will send his own separately
                continue;
            }
            users_ids.push(players[i].user_id);
        }

        var v = await this._validatePlayersBegin(user, players);
        if (v.lastError) {
            return v.lastEror;
        }

        try {
            //update the game status
            var r = await c.findOneAndUpdate(
                    {game_id: game_id},
                    {$set: {pause_time: 0, game_status: 'live'}},
                    {
                        projection: {_id: 0},
                        returnOriginal: false, //return the updated document
                        w: 'majority'
                    });

        } catch (e) {
            console.log(e);
            this.error('could not resume game');
            return this;
        }
        var updated_match = r.value;

        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        var spectators = await sc.find({game_id: game_id}, {_id: 0}).toArray();

        for (var i = 0; i < spectators.length; i++) {
            users_ids.push(spectators[i].user_id);
        }

        console.log('users_ids', users_ids);

        //broadcast to players except user_id
        this.broadcast(this.evt.game_resume, updated_match, users_ids, true, this.sObj.GAME_MAX_WAIT_IN_SEC);

        //broadcast the watch_game_resume event to users related in one way
        //or the other to any of the players - ie via contacts or group
        this._broadcastWatchGame(match, this.evt.watch_game_resume);

        return updated_match; //sent to player of user_id
    }

    async pause(user_id, game_id) {

        var c = this.sObj.db.collection(this.sObj.col.matches);
        try {
            var r = await c.findOneAndUpdate(
                    {game_id: game_id},
                    {$set: {pause_time: new Date(), game_status: 'pause'}},
                    {
                        projection: {_id: 0},
                        returnOriginal: false, //return the updated document
                        w: 'majority'
                    });

            var match = r.value;

            if (!match) {
                return 'no game to pause';
            }
        } catch (e) {
            this.error('could not pause game');
            return this;
        }

        //broadcast the game pause event

        var users_ids = [];
        for (var i = 0; i < match.players.length; i++) {
            if (match.players[i].user_id === user_id) {//yes skip, we will send his own separately
                continue;
            }
            users_ids.push(match.players[i].user_id);
        }

        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        var spectators = await sc.find({game_id: game_id}, {_id: 0}).toArray();

        for (var i = 0; i < spectators.length; i++) {
            users_ids.push(spectators[i].user_id);
        }

        var data = {
            pause_by: user_id,
            match: match
        };

        var user = new User(this.sObj, this.util, this.evt);
        user._unsetPlaying(user_id);

        this.broadcast(this.evt.game_pause, data, users_ids, true); //broadcast to players except user_id

        return data; //sent to player of user_id
    }

    async abandon(user_id, game_id) {

        var c = this.sObj.db.collection(this.sObj.col.matches);
        try {
            //count available players
            var match = await c.findOne({game_id: game_id});

            if (!match) {
                return 'no game to abandon';
            }

            var available_count = 0;
            for (var i = 0; i < match.players.length; i++) {
                if (match.players[i].user_id === user_id) {
                    match.players[i].available = false;
                }
                if (match.players[i].available) {
                    available_count++;
                }
            }

            var terminated = false; //signify the game is terminated after too many player have abandon the game

            var game = this.sObj.game.get(match.game_name);

            if (available_count < game.minPlayers()) {//below minimum players that will keep the game still on so end the game now.

                await c.deleteOne({game_id: game_id}, {w: 'majority'});

                //relocate the match document to the match_history collection
                match.game_status = 'abandon'; //set the status to abandon
                await c.insertOne(match);
                terminated = true;
            }

            var user = new User(this.sObj, this.util, this.evt);
            user._unsetPlaying(user_id);

        } catch (e) {
            this.error('could not abandon game');
            return this;
        }

        //broadcast the game abandon event

        var data = {
            abandon_by: user_id,
            terminated: terminated, //signify that the game is terminated because too many players have abandon the game
            terminate_reason: terminated ? "insufficient players available" : "", //particularly useful in multi player games like ludo, whot e.t.c
            match: match
        };

        var users_ids = [];
        for (var i = 0; i < match.players.length; i++) {
            if (match.players[i].user_id === user_id) {//yes skip, we will send his own separately
                continue;
            }
            users_ids.push(match.players[i].user_id);
        }

        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        var spectators = await sc.find({game_id: game_id}, {_id: 0}).toArray();

        for (var i = 0; i < spectators.length; i++) {
            users_ids.push(spectators[i].user_id);
        }

        this.broadcast(this.evt.game_abandon, data, users_ids, true); //broadcast to players except user_id

        return data;
    }
    /**
     * 
     * @param {type} game_id - the game id
     * @param {type} score - the game score
     * @param {type} winner_user_id - the user id of the winner if there is
     * a winner in the game. If not specified or a value of 0 or null will
     * mean that the game ended in a draw
     * @returns {String|nm$_match.Match}
     */
    async finish(game_id, score, winner_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            game_id = arguments[0].game_id;
            score = arguments[0].score;
            winner_user_id = arguments[0].winner_user_id;
        }

        var c = this.sObj.db.collection(this.sObj.col.matches);
        try {

            var r = await c.findOneAndDelete({game_id: game_id}, {w: 'majority'});
            var match = r.value;
            if (!match) {
                return 'no game to finish';
            }
            //relocate the match document to the match_history collection
            match.game_status = 'finish'; //set the status to finish 
            match.game_end_time = new Date();//set the time the match ended
            match.score = score;
            match.is_draw = winner_user_id ? false : true;
            if (winner_user_id) {
                match.winner = winner_user_id;
            }

            var c = this.sObj.db.collection(this.sObj.col.match_history);
            await c.insertOne(match);

        } catch (e) {
            this.error('could not finish game');
            return this;
        }
        //broadcast the game finish event to the players and spectators
        var users_ids = [];
        var user = new User(this.sObj, this.util, this.evt);
        for (var i = 0; i < match.players.length; i++) {
            users_ids.push(match.players[i].user_id);
            if (match.players[i].available) {
                user._unsetPlaying(match.players[i].user_id);
            }
        }

        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        var spectators = await sc.find({game_id: game_id}, {_id: 0}).toArray();

        for (var i = 0; i < spectators.length; i++) {
            users_ids.push(spectators[i].user_id);
        }

        this.broadcast(this.evt.game_finish, match, users_ids, true); //broadcast to all (players and spectators)

        //update the players ranking
        var rank = new PlayerRank(this.sObj, this.util, this.evt);
        rank.updateRanking(match.players, winner_user_id);
    }

    /**
     * Get matches played by the specified user contacts
     * 
     * @param {type} user_id - id of user whose contacts match will be searched for
     * @param {type} game_name - the specified game
     * @param {type} skip
     * @param {type} limit
     * @returns {Array|nm$_match.Match.getContantsMatchList.data}
     */
    async getContactsMatchList(user_id, game_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            game_name = arguments[0].game_name;
            skip = arguments[0].skip;
            limit = arguments[0].limit;
        }

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            matches: []
        };

        var c = this.sObj.db.collection(this.sObj.col.users);
        var user = await c.findOne({user_id: user_id}, {_id: 0});


        if (!Array.isArray(user.contacts) || user.contacts.length === 0) {
            return data;
        }

        c = this.sObj.db.collection(this.sObj.col.matches);
        var allQuery = {
            $or: []
        };
        for (var i = 0; i < user.contacts.length; i++) {
            var contact_user_id = user.contacts[i];

            var query = {
                $and: [
                    {
                        game_name: game_name
                    },
                    {
                        game_status: 'live' //where game_status is live
                    },
                    {
                        'players.user_id': contact_user_id //and contact_user_id is equal to user_id field in a document in players array
                    }
                ]
            };
            allQuery.$or.push(query);
        }

        if (skip !== undefined && limit !== undefined) {
            skip = skip - 0;
            limit = limit - 0;
        } else {
            skip = 0;
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.matches);

        var total = await c.count(allQuery);

        data.total = total;

        if (!total) {
            return data;
        }


        data.matches = await c.find(allQuery, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    /**
     * Get matches played in the specified group
     * 
     * @param {type} group_name
     * @param {type} game_name
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_match.Match.getGroupMatchList.data}
     */
    async getGroupMatchList(group_name, game_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            group_name = arguments[0].group_name;
            game_name = arguments[0].game_name;
            skip = arguments[0].skip;
            limit = arguments[0].limit;
        }

        if (skip !== undefined && limit !== undefined) {
            skip = skip - 0;
            limit = limit - 0;
        } else {
            skip = 0;
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.matches);

        var query = {
            group_name: group_name,
            game_name: game_name,
            game_status: 'live'
        };

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    /**
     * Get matches played in the specified tournament
     * 
     * @param {type} tournament_name
     * @param {type} game_name
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_match.Match.getTournamentMatchList.data}
     */
    async getTournamentMatchList(tournament_name, game_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            tournament_name = arguments[0].tournament_name;
            game_name = arguments[0].game_name;
            skip = arguments[0].skip;
            limit = arguments[0].limit;
        }

        if (skip !== undefined && limit !== undefined) {
            skip = skip - 0;
            limit = limit - 0;
        } else {
            skip = 0;
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.matches);

        var query = {
            tournament_name: tournament_name,
            game_name: game_name,
            game_status: 'live'
        };

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;

    }

    /**
     * Get match history of the specified user. To filter match based on
     * contact, group and tournament, specify the filter in the second
     * paramenter. If no filter or a value of all is specified then all
     * match history is searched
     * 
     * @param {type} user_id - the id of the user whose match history will be 
     * searched for
     * @param {type} filter - filter to determine where search should be made.
     * valid values are contact, group, tournament. If none of the valid values
     * is provided then all search is made.
     * @param {type} is_include_abandoned_matches - used to determine if abandon matches
     * should be included in the search
     * @param {type} skip - numbers of records to skip in the search
     * @param {type} limit - maximum record to retrive
     * @returns {nm$_match.Match.getUserMatchHistory.data}
     */
    async getUserMatchHistory(user_id, filter, is_include_abandoned_matches, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            filter = arguments[0].filter;
            is_include_abandoned_matches = arguments[0].is_include_abandoned_matches;
            skip = arguments[0].skip;
            limit = arguments[0].limit;
        }

        if (skip !== undefined && limit !== undefined) {
            skip = skip - 0;
            limit = limit - 0;
        } else {
            skip = 0;
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.match_history);

        var query = {
            game_status: 'finish',
            'players.user_id': user_id
        };

        if (filter === 'contact') {
            query.group_name = '';
            query.tournament_name = '';
        }

        if (filter === 'group') {
            query.group_name = {$ne: ''};
        }

        if (filter === 'tournament') {
            query.tournament_name = {$ne: ''};
        }

        if (is_include_abandoned_matches === true) {
            query.game_status = 'abandon';
        }

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;

    }
}

module.exports = Match;

