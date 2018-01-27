
"use strict";

var User = require('../info/user');
var WebApplication = require('../web-application');

class Tournament extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    async _isTournamentOfficial(user_id, tournament_name) {
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var official = await c.findOne(
                {
                    name: tournament_name,
                    'officials.user_id': user_id
                });

        return typeof official === 'object';
    }

    async seasonNew(user_id, tournament_name, slots_count, players_count, start_time) {

        if (!user_id) {
            return 'No username';
        }

        if (!tournament_name) {
            return 'No tournament name';
        }

        slots_count = slots_count - 0;
        if (isNaN(slots_count) || slots_count < 1) {
            return 'Invalid number of slots - must be a number greater than 0';
        }

        players_count = players_count - 0;
        if (isNaN(players_count) || players_count < 1) {
            return 'Invalid number of players - must be a number greater than 0';
        }

        if (players_count > this.sObj.MAX_TOURNAMENT_PLAYERS) {
            return `Number of players cannot exceed max. of ${this.sObj.MAX_TOURNAMENT_PLAYERS}`;
        }

        if (isNaN(new Date(start_time).getTime())) {
            return `Invalid season start time - ${start_time}`;
        }

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


        var last_season = tourn.seasons[tourn.seasons.length - 1];
        if (last_season) {

            //check if the last season has ended - a new season be created only if
            //the last season has ended

            if (last_season.status !== 'end' && last_season.status !== 'cancel') {
                return "Can not create new season when the last season has not yet ended!";
            }

            //check if the start time is valid - must be after the last season's end time
            var last_end_time = new Date(last_season.end_time).getTime();

            if (isNaN(last_end_time)) {
                console.log(`WARNING!!! This should not be - ${tournament_name} tournament 
                                last season (seanson ${last_season.sn}) end time is invalid.`);

                return `Invalid last season end time - ${last_end_time}`;
            }
            var _24_hour = 24 * 60 * 60 * 1000;
            if (new Date(start_time).getTime() < last_end_time + _24_hour) {
                return `Invalid season start time - must be at least 24 hours after the last seanson ended`;
            }
        }

        var new_season = {
            sn: tourn.seasons.length++, //next season number
            start_time: start_time,
            end_time: '', //will be set automatically when the final game of the season is concluded or when the seanson is cancelled
            winner: '', //will be set automatically when the final game of the season is concluded.
            status: 'before-start', //before-start, start, end, cancel
            rounds: [],
            slots: []
        };

        //Create the dummy rounds of the season. By dummy we mean all the
        //rounds fixtures will be created with empty player id which will be
        //modified eventually.
        var rounds;
        if (tourn.type === 'round-robin') {
            rounds = this._roundRobinRounds(players_count, tourn.sets_count);
        } else if (tourn.type === 'single-elimination') {
            rounds = this._singleEleminationRounds(players_count, tourn.sets_count);
        } else {
            return `Unknown type of tournament - ${tourn.type}`;
        }

        if (!isArray(rounds)) {
            return rounds; // returns the error msg
        }




        //Create the empty slots of the season



        //add the season to seasons list of the tournament
        tourn.seasons.push(new_season);


        //update the tournament



    }

    _fixturesStruct() {

    }

    _roundRobinRounds(players_count, sets_count) {

        var rounds = [];
        for (var i = 0; i < players_count; i++) {
            var num = i + 1;
            var rd = {
                sn: num,
                fixtures: this._fixturesStruct(num, sets_count)
            };

            rounds.push(rd);
        }

        return rounds;

    }

    _singleEleminationRounds(players_count, sets_count) {

        if (players_count !== 4
                && players_count !== 8
                && players_count !== 16
                && players_count !== 32
                && players_count !== 64) {

            return 'Invalid number of players of singel elimination tournament - expected 4, 8, 16, 32, 64';
        }

        var size = players_count;
        while( size >= 4 ){
            
            for(var i=0; i<size; i++){
                
            }
            
            size /= 2; 
        }



    }

    async seasonAddPlayer(user_id, tournament_name, seanson_number, player_id, slot) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


    }

    async seasonRemovePlayer(user_id, tournament_name, seanson_number, player_id, slot) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


    }

    async seasonGetPlayers(user_id, tournament_name, seanson_number) {


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


    }

    async seasonTrimSlots(user_id, tournament_name, seanson_number) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }



        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


    }

    async seasonClear(user_id, tournament_name, seanson_number) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }



        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

    }

    async seasonClearSlots(user_id, tournament_name, seanson_number) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

    }

    async seasonSetSlots(user_id, tournament_name, seanson_number, slots_count) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }



        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

    }

    async seasonSetStartTime(user_id, tournament_name, seanson_number) {

        if (!this._isTournamentOfficial(user_id, tournament_name)) {
            return "Not authorized!";
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

    }

    async seasonCount(user_id, tournament_name) {



        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

    }

    /**
     * 
     * 
     * 
     * 
     * 
     * @param {type} user_id
     * @param {type} tournament_name
     * @param {type} game
     * @param {type} type
     * @param {type} sets_count
     * @param {type} status_message
     * @param {type} photo_url
     * @returns {Tournament@call;error|String}
     */
    async createTournament(user_id, tournament_name, game, type, sets_count, status_message, photo_url) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            game = arguments[0].game;
            type = arguments[0].type;
            sets_count = arguments[0].sets_count;
            status_message = arguments[0].status_message;
            photo_url = arguments[0].photo_url;
        }


        if (type !== 'round-robin' && type !== 'single-elimination') {
            return 'Tournament type must be round-robin or single-elimination.';
        }

        if (!tournament_name) {
            return 'No tournament name.';
        }

        if (typeof tournament_name !== 'string') {
            return 'Invalid tournament name.';
        }


        if (!game) {
            return 'No game name.';
        }

        if (typeof game !== 'string') {
            return 'Invalid game name.';
        }


        if (!sets_count || sets_count < 1) {
            return 'number of sets must be at least 1.';
        }

        if (!status_message) {
            status_message = '';
        }

        try {

            var c = this.sObj.db.collection(this.sObj.col.tournaments);
            var tourn = await c.findOne({name: tournament_name});

            if (tourn) {
                return 'Tournament name already exist!';
            }


            var insObj = {
                name: tournament_name,
                game: game,
                type: type, //round-robin and single-elimination 
                sets_count: sets_count, // number of times two player will play each other before a winner is determined - max is 5
                user_id: user_id,
                status_message: status_message,
                photo_url: photo_url,
                officials: [],
                registered_players: [],
                seasons: []
            };

            var r = await c.insertOne(insObj);
            if (r.result.n === 1) {
                return 'Tournament created successfully!';
            } else if (r.result.n > 1) {
                console.log('This should not happen! inserting more than one specified document when creating tournament!');
                return 'Tournament created!';
            } else {
                return 'Tournament was not creadted!';
            }
        } catch (e) {
            console.log(e);
            return this.error('Could not create tournament!');
        }

    }

    /**
     * As in multiple change of tournament info
     * 
     * @param {type} user_id
     * @returns {undefined}
     */
    async editTournament(obj) {

    }

    async setTournamentIcon(user_id) {

    }

    async _getInfo(user_id) {

        var u = new User(this.sObj, this.util, this.evt);
        var required_fields = ['first_name', 'last_name', 'email', 'photo_url'];
        var user = await u.getInfo(user_id, required_fields);

        var ofc = {
            user_id: user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            photo_url: user.photo_url
        };

        return ofc;
    }

    async setTournamentStatus(user_id, tournament_name, status_message, photo_url) {
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            status_message = arguments[0].status_message;
            photo_url = arguments[0].photo_url;
        }

        //first check if the user is authorize to edit the tournament
        try {


            if (!this._isTournamentOfficial(user_id, tournament_name)) {
                return "Not authorized!";
            }

            //at this point the user is authorized

            var setObj = {};
            if (status_message) {
                setObj.status_message = status_message;
            }

            if (photo_url) {
                setObj.photo_url = photo_url;
            }


            var c = this.sObj.db.collection(this.sObj.col.tournaments);
            await c.updateOne(
                    {name: tournament_name},
                    {
                        $set: setObj
                    });

        } catch (e) {

            console.log(e);

            return this.error('Could not set tournament status');
        }

        return "Tournament status updated successfully";
    }

    async addOfficial(user_id, tournament_name, new_official_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            new_official_user_id = arguments[0].new_official_user_id;
        }


        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return 'Tournament not found - ' + tournament_name;
        }

        var is_official = false;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === new_official_user_id) {
                    return 'Already an official!';
                }
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        } else {
            tourn.officials = [];
        }

        //check if the user is authized
        if (!is_official) {
            return 'Not authorized!';
        }

        //check if the maximum official the tournament can have has exceeded
        if (tourn.officials.length > this.sObj.MAX_TOURNAMENT_OFFICIALS) {
            return 'Cannot add more official! Maximum exceeded - ' + this.sObj.MAX_TOURNAMENT_OFFICIALS;
        }

        //at this point the user is authorized

        var officialInfo = await this._getInfo(new_official_user_id);
        tourn.officials.push(officialInfo);

        //update the officials
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {officials: tourn.officials}});

        //set tournament belong of new official
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: new_official_user_id}, {$addToSet: {tournaments_belong: tournament_name}}, {w: 'majority'});

        return 'official added successfully.';
    }

    async removeOfficial(user_id, tournament_name, official_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            official_user_id = arguments[0].official_user_id;
        }

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return 'Tournament not found - ' + tournament_name;
        }

        var is_official = false;
        var index_found = -1;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === official_user_id) {
                    index_found = i;
                }
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        } else {
            tourn.officials = [];
        }

        //check if the user is authized
        if (!is_official) {
            return 'Not authorized!';
        }

        if (index_found === -1) {
            return 'Official not found!';
        }

        //now remove
        tourn.officials.splice(index_found, 1);

        //update the officials
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {officials: tourn.officials}});

        //remove from tournament belong of the official
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: official_user_id}, {$pull: {tournaments_belong: tournament_name}}, {w: 'majority'});

        return 'Official removed successfully.';

    }

    async registerPlayer(user_id, tournament_name, player_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            player_user_id = arguments[0].player_user_id;
        }


        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return 'Tournament not found - ' + tournament_name;
        }

        var is_official = false;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        }

        if (!is_official) {
            return 'No authorized';
        }

        var is_player = false;
        if (Array.isArray(tourn.registered_players)) {
            for (var i = 0; i < tourn.registered_players.length; i++) {
                if (tourn.registered_players[i].user_id === user_id) {
                    is_player = true;
                }
            }
        } else {
            tourn.registered_players = [];
        }

        if (is_player) {
            return 'Already a player in this tournament.';
        }

        if (tourn.registered_players.length > this.sObj.MAX_TOURNAMENT_PLAYERS) {
            return 'Cannot add more players! Maximum exceeded - ' + this.sObj.MAX_TOURNAMENT_PLAYERS;
        }

        var playerInfo = await this._getInfo(player_user_id);
        tourn.registered_players.push(playerInfo);

        //update the registered_players
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {registered_players: tourn.registered_players}});

        //set tournament belong of new player
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: player_user_id}, {$addToSet: {tournaments_belong: tournament_name}}, {w: 'majority'});

        return 'Player added successfully.';
    }

    async removePlayer(user_id, tournament_name, player_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            player_user_id = arguments[0].player_user_id;
        }


        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return 'Tournament not found - ' + tournament_name;
        }

        var is_official = false;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        }

        if (!is_official) {
            return 'No authorized';
        }

        var index_found = -1;
        if (Array.isArray(tourn.registered_players)) {
            for (var i = 0; i < tourn.registered_players.length; i++) {
                if (tourn.registered_players[i].user_id === user_id) {
                    index_found = i;
                }
            }
        } else {
            tourn.registered_players = [];
        }

        if (index_found === -1) {
            return 'Player not found!';
        }


        //remove the player
        tourn.registered_players.splice(index_found, 1);

        //update the registered_players
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {registered_players: tourn.registered_players}});

        //remove from tournament belong of the player
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: player_user_id}, {$pull: {tournaments_belong: tournament_name}}, {w: 'majority'});

        return 'Player removed successfully.';
    }

    async getTournamentInfo(tournament_name) {

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name}, {_id: 0});

        if (!tourn) {
            return this.error('Tournament not found - ' + tournament_name);
        }

        return tourn;
    }

    async getTournamentsInfoList(tournament_names_arr) {

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var query = {$or: []};
        for (var i = 0; i < tournament_names_arr.length; i++) {
            query.$or.push({name: tournament_names_arr[i]});
        }
        var tourns = await c.find(query, {_id: 0}).toArray();

        if (!tourns || !tourns.length) {
            return [];
        }

        return tourns;
    }

    /**
     * Get the list of tournaments belong to by this user. The list consist of 
     * the tournament info.
     * 
     * @param {type} user_id - id of the user
     * @returns {Array|nm$_tournament.Tournament|Tournament.getTournamentsInfoList.tourns|nm$_tournament.Tournament.getTournamentsInfoList.tourns}
     */
    async getUserTournamentsInfoList(user_id) {
        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var user = await c.findOne({user_id: user_id}, {_id: 0});
            if (!user || !user.tournaments_belong) {
                return [];
            }
            return this.getTournamentsInfoList(user.tournaments_belong);

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION

            this.error('Could not get user Tournaments info');
            return this;
        }
    }

    /**
     * Search for tournaments whose name begins with the specified
     * input string. The search is case-insensitive
     * 
     * @param {type} str_search - search string
     * @param {type} limit - max record to return
     * @returns {Array|Tournament.searchTournamentsInfoList.tourns|nm$_tournament.Tournament.searchTournamentsInfoList.tourns}
     */
    async searchTournamentsInfoList(str_search, limit) {

        //NOTE: ideally the limit should not be more than 10 in many cases
        //in the client app

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);

        var tourns = await c.find({name: {$regex: '^' + str_search, $options: 'i'}}, {_id: 0})
                .limit(limit)
                .toArray();

        if (!tourns || !tourns.length) {
            return [];
        }

        return tourns;
    }

    /**
     * Radomly selects the given number of tournament docs 
     * from the tournaments collection
     * 
     * @param {type} size - the number of tournaments to selects
     * @returns {Array|nm$_tournament.Tournament.getRandomTournamentsInfoList.tourns|Tournament.getRandomTournamentsInfoList.tourns}
     */
    async randomTournamentsInfoList(size) {

        if (size > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            size = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        //NOTE: according to mongodb doc, the sample can return duplicate docs
        //occasionaly. However we do not care about that at this time anyway.
        var tourns = await c.aggregate([{$sample: {size: size}}]).toArray();

        if (!tourns || !tourns.length) {
            return [];
        }

        return tourns;
    }

}

module.exports = Tournament;
