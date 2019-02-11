
"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class PlayRequest extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }
    /**
     * Get a list of play requests
     * 
     * @param {type} user_id
     * @param {type} game_name
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async get(user_id, game_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
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

        var c = this.sObj.db.collection(this.sObj.col.play_requests);
        
        
        var query = {
                $and: [
                    {
                        game_name: game_name,
                        'players.user_id': user_id
                    }
                ]
            };

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            play_requests: []
        };

        if (!total) {
            return data;
        }


        data.play_requests = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }
    
    /**
     * 
     * @param {type} initiator_id - id of user who made the request
     * @param {type} opponent_ids - id of the user or users requested. Can be
     *  an array of user ids for game of more than two players e.g ludo , whot
     * @param {type} game_name - the name of the game e.g chess, draughts , ludo e.t.c
     * @param {type} rules - (optional) the rules to apply in the game. If not provided
     *  then the default game rules is used when the game starts
     * @param {type} group_name - the name of the user's group where he selected
     * a player to play with. The client should set this value to the group
     * name if the user picks a player in his group profile page to play with.
     * @param {type} sets_count - number of games to play to make a complete match
     * @returns {undefined}
     */
    async sendRequest(initiator_id, opponent_ids, game_name, rules, group_name, sets_count) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            initiator_id = arguments[0].initiator_id;
            opponent_ids = arguments[0].opponent_ids;
            game_name = arguments[0].game_name;
            rules = arguments[0].rules;
            group_name = arguments[0].group_name;
            sets_count = arguments[0].sets_count;
             
        }

        try {

            if (!Array.isArray(opponent_ids)) {
                opponent_ids = [opponent_ids]; //convert to array
            }

            for (var i = 0; i < opponent_ids.length; i++) {
                if (initiator_id === opponent_ids[i]) {
                    return this.error('You cannot send play request to yourself!');
                }
            }

            var game = this.sObj.game.get(game_name);
            if (!game) {
                return this.error('Unknown game -' + game_name);
            }

            if (game.maxPlayers() > opponent_ids.length + 1) {//plus the initiator
                return this.error(game_name + " requires " + game.maxPlayers() + " players maximum!.");
            }

            var c = this.sObj.db.collection(this.sObj.col.matches);

            //check if the request user is playing game and terminate the request if true
            //but if the use game is paused the play request can still go on. Only live
            //game can stop the request

            var players_ids = [];
            var opponents_online = [];
            players_ids.push(initiator_id);// push in the initiator as the first player
            
            var user = new User(this.sObj, this.util, this.evt);
            
            for (var i = 0; i < opponent_ids.length; i++) {
                
                if(await user.isOnline(opponent_ids[i]) === true){
                    opponents_online.push(opponent_ids[i]);
                }
                
                players_ids.push(opponent_ids[i]);// push the other players in
            }
            
                        
            if (players_ids.length <= 3) {
                //ok for few opponents run the query individually - not much load wil be experienced  
                for (var i = 0; i < players_ids.length; i++) {
                    var match = await c.findOne(
                            {
                                $and: [
                                    {game_status: 'live'},
                                    {'players.user_id': players_ids[i]}
                                ]});

                    if (match) {
                        return {
                            opponents_online : opponents_online,
                            msg: "Player already engaged in another match.",
                            engaged_user_id: players_ids[i], //so that the client can specify which user is actually engaged
                            match: match
                        };
                    }
                }
            } else {//for many opponents
                //run a combined query - we do not want to over load the server
                //if the query is much
                var combined_query = {$or: []};
                for (var i = 0; i < players_ids.length; i++) {
                    combined_query.$or.push({
                        $and: [
                            {game_status: 'live'},
                            {'players.user_id': players_ids[i]}
                        ]});
                }
                var match = await c.findOne(combined_query);
                if (match) {
                    var fnd_player_id;
                    for(var k=0; k<match.players.length; k++){
                        if(players_ids.indexOf(match.players[k].user_id) > -1){
                            fnd_player_id = match.players[k].user_id;
                            break;
                        }
                    }
                    return {
                        opponents_online : opponents_online,
                        msg: players_ids.length === 1 ? "Player already engaged in another match." : "One or more players already engaged in another match.",
                        engaged_user_id: fnd_player_id,
                        match: match
                    };
                }
            }

            //At this point the player is free so send the request

            var c = this.sObj.db.collection(this.sObj.col.play_requests);

            var game_id = this.sObj.UniqueNumber; //assign unique number to the game id

            var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
            var user = new User(this.sObj, this.util, this.evt);
            var players = await user.getInfoList(players_ids, required_fields);
            
            
            if (user.lastError) {
                return this.error('Could not send play request.');
            }

            if(!Array.isArray(players)){
                console.log('This should not happen! user info list must return an array if no error was caught!');
                return this.error('Could not send play request.');
            }
            
            
            //check if the player info list is complete - ie match  the number requested for
            
            var missing = this.util.findMissing(players_ids, players, function(p_id, p_info){
                return p_id === p_info.user_id;
            });

            if(missing){
                //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
                return this.error('Could not find player with user id - ' + missing);
            }

            var data = {
                group_name : group_name? group_name : "",    
                game_id: game_id,
                game_name: game_name,
                rules: rules,
                sets_count: sets_count,
                opponents_online : opponents_online,
                expire_after_secs: this.sObj.GAME_MAX_WAIT_IN_SEC,
                notification_type: 'play_request',
                notification_time : new Date(),
                players: players
            };

            await c.insertOne(data);

            //notify the other user(s)
            this.broadcast(this.evt.play_request, data, opponent_ids, true);
            
            //set the expiry of the play request
            var expiry = this.sObj.GAME_MAX_WAIT_IN_SEC * 1000;
            this.sObj.task.later(expiry, 'game/PlayRequest/_expire', game_id);

        } catch (e) {
            console.log(e);
            this.error('Could not send play request.');
            return this;
        }

        return data;

    }

    /**
     * Cancel the play request. The user sending the play request
     * can abort the request in the process before the other user
     * accepts
     * 
     * @param {type} game_id
     * @returns {undefined}
     */
    async abort(game_id) {

        var c = this.sObj.db.collection(this.sObj.col.play_requests);
        try {
            var r = await c.deleteOne({game_id: game_id});//delete and return the doc
            
            if(r.result.n === 0){
               return 'play request not found!'; 
            }
        } catch (e) {
            console.log(e);
            return this.error('Could not abort the play request!');
        }

        return 'Play request aborted.';
    }

    /**
     * The play request can be rejected by the user.
     * However this option may not be enabled by default
     * since the play request expires after some time.
     * 
     * 
     * @param {type} game_id
     * @returns {undefined}
     */
    async reject(game_id) {

        var c = this.sObj.db.collection(this.sObj.col.play_requests);
        try {
            var r = await c.findOneAndDelete({game_id: game_id},  {projection: {_id: 0}});//delete and return the doc
            if(!r.value){
               return 'play request not found!'; 
            }
        } catch (e) {
            console.log(e);
            return this.error('Could not reject the play request!');
        }
        
        var play_request_doc = r.value;
        //notify the initiator that his request is rejected
        var initiator_id = play_request_doc.players[0].uer_id;
        this.send(this.evt.play_request_rejected, play_request_doc, initiator_id, true);

        return 'Play request rejected.';
    }

        
    _expire(game_id) {
        
        console.log('_expire', game_id);
        
        var me = this;
        var c = this.sObj.db.collection(this.sObj.col.play_requests);
        c.findOneAndDelete({game_id: game_id},  {projection: {_id: 0}})//delete and return the doc
                .then(function (result) {
                    var play_request = result.value;
                    if(!play_request){
                        return;//no play request found - possibly  cancelled , rejected or the game is already started!
                    }
                    //notify the initiator  and his opponent that the request has expire.
                    //Normally the client iu is updated to reflect the expiration
                    var users_ids = [];
                    for (var i = 0; i < play_request.players.length; i++) {
                        users_ids[i] = play_request.players[i].user_id;
                    }
                    me.broadcast(me.evt.play_request_expired, play_request, users_ids);
                })
                .catch(function (err) {
                    console.log("please seriouly address the error - could not expire the play request!");
                    console.log(err);
                });

    }

}

module.exports = PlayRequest;