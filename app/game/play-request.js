
"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class PlayRequest extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }
    /**
     * 
     * @param {type} initiator_id - id of user who made the request
     * @param {type} opponent_ids - id of the user or users requested. Can be
     *  an array of user ids for game of more than two players e.g ludo , whot
     * @param {type} game_name - the name of the game e.g chess, draft , ludo e.t.c
     * @param {type} game_rules - (optional) the rules to apply in the game. If not provided
     *  then the default game rules is used when the game starts
     * @returns {undefined}
     */
    async sendRequest(initiator_id, opponent_ids, game_name, game_rules) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            initiator_id = arguments[0].initiator_id;
            opponent_ids = arguments[0].opponent_ids;
            game_name = arguments[0].game_name;
            game_rules = arguments[0].game_rules;
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
                return 'unknown game -' + game_name;
            }

            if (game.maxPlayers() > opponent_ids.length + 1) {//plus the initiator
                return this.error(game_name + " requires " + game.maxPlayers() + " players maximum!.");
            }

            var c = this.sObj.db.collection(this.sObj.col.matches);

            //check if the request user is playing game and terminate the request if true
            //but if the use game is paused the play request can still go on. Only live
            //game can stop the request

            var players_ids = [];

            players_ids.push(initiator_id);// push in the initiator as the first player

            for (var i = 0; i < opponent_ids.length; i++) {
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
                            msg: "Player already engaged in a match.",
                            engaged_user_id: opponent_ids[i], //so that the client can specify which user is actually engaged
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
                    return {
                        msg: players_ids.length === 1 ? "Player already engaged in a match." : "One or more players already engaged in a match.",
                        engaged_user_id: null, //in this case it is not provided - so the client must check  for null
                        match: match
                    };
                }
            }

            //At this point the player is free so send the request

            var c = this.sObj.db.collection(this.sObj.col.play_requests);

            var game_id = this.sObj.UniqueNumber; //assign unique number to the game id

            var required_fields = ['first_name', 'last_name', 'photo_url'];
            var user = new User(this.sObj, this.util, this.evt);
            var players = await user.getInfoList(players_ids, required_fields);

            if (user.lastError) {
                return this.error('could not send play request.');
            }

            if(!Array.isArray(players)){
                console.log('This should not happen! user info list must return an array if no error was caught!');
                return this.error('could not send play request.');
            }

            //check if the player info list is complete - ie match  the number requested for
            
            var missing = this.util.findMissing(players_ids, players, function(p_id, p_info){
                return p_id === p_info.user_id;
            });

            if(missing){
                //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
                return this.error('could not find player with user id - ' + missing);
            }

            var data = {
                game_id: game_id,
                game_name: game_name,
                game_rules: game_rules,
                players: players
            };

            await c.insertOne(data);

            //notify the other user(s)
            this.broadcast(this.evt.play_request, data, opponent_ids, true);

            //set the expiry of the play request
            var expiry = 5 * 60 * 60 * 1000;
            this.sObj.task.later('EXPIRE_PLAY_REQUEST', expiry, game_id);

        } catch (e) {
            console.log(e);
            this.error('could not send play request.');
            return this;
        }

        return 'play request sent successfully.';

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
            await c.deleteOne({game_id: game_id});//delete and return the doc
        } catch (e) {
            console.log(e);
            return this.error('could not abort the play request!');
        }

        return 'play request aborted successfully.';
    }

    /**
     * The play request can be rejected by the user.
     * However this option may not be enabled by default
     * since the play request expires after some time it
     * 
     * 
     * @param {type} game_id
     * @returns {undefined}
     */
    async reject(game_id) {

        var c = this.sObj.db.collection(this.sObj.col.play_requests);
        try {
            var play_request = await c.findOneAndDelete({game_id: game_id}, {_id: 0});//delete and return the doc
        } catch (e) {
            console.log(e);
            return this.error('could not reject the play request!');
        }

        //notify the initiator that his request is rejected
        var initiator_id = play_request.players[0].uer_id;
        this.send(this.evt.play_request_rejected, play_request, initiator_id);

        return 'play request rejected successfully.';
    }

    _expire(game_id) {

        var me = this;
        var c = this.sObj.db.collection(this.sObj.col.play_requests);
        c.findOneAndDelete({game_id: game_id}, {_id: 0})//delete and return the doc
                .then(function (err, play_request) {
                    //notify the initiator  and his opponent that the request has expire.
                    //Normally the client iu is updated to reflect the expiration
                    var users_ids = [];
                    for (var i = 0; i < play_request.players.length; i++) {
                        users_ids[i] = play_request.players[i].user_id;
                    }
                    this.broadcast(me.evt.play_request_expired, play_request, users_ids);
                })
                .catch(function (err) {
                    console.log("please seriouly address the error - could not expire the play request!");
                    console.log(err);
                });

    }

}

module.exports = PlayRequest;