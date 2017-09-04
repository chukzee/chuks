
"use strict";

var Result = require('../result');

class Match extends Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;
    }

    async sendMove(user_id, opponent_id, game_id, move) {

        //first quickly forward the move to the opponenct
        var data = {
            user_id: user_id,
            opponent_id: opponent_id,
            game_id: game_id,
            move: move
        };

        this.sOb.redis.publish(this.sOb.PUBSUB_FORWARD_MOVE, data);

        //save the move in the server asynchronously
        var c = this.sObj.db.collection(this.sObj.col.moves);
        c.updateOne({game_id: game_id}, {$push: {moves: move}})
                .then(function (result) {
                    //Acknowlege move sent by notifying the player that
                    //the sever has receive the move and sent it to the
                    return this.sOb.redis.publish(this.sOb.PUBSUB_ACKNOWLEGE_MOVE_SENT, data);
                })
                .catch(function (err) {
                    console.log(err);
                });

        //next broadcast to the game spectators.

        //so lets get the spectators view this game
        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        var spectators = await sc.findOne({game_id: game_id}, {_id : 0}).toArray();

        var spectators_ids = [];
        for (var i = 0; i < spectators.length; i++) {
            spectators_ids[i] = spectators[i].user_id;
        }

        //now broadcast to the spectators
        this.sOb.redis.publish(this.sObj.PUBSUB_BROADCAST_MOVE, {
            game_id: game_id,
            spectators_ids: spectators_ids,
            move: move
        });



    }

    getGamePosition(game_id) {


    }

    /**
     * 
     * @param {type} user_id - id of user who made the request
     * @param {type} opponent_id - id of the user requested
     * @returns {undefined}
     */
    addRequest(user_id, opponent_id) {

    }

    start(user_id, opponent_id) {

    }

    resume(game_id) {

    }

    pause(game_id) {

    }

    end(user_id, opponent_id) {

    }

    async getContantsMatchList(obj) {
        var game_name = obj.game_name;
        var user_id = obj.user_id;
        var skip = obj.skip - 0;
        var limit = obj.limit - 0;


        var c = this.sObj.db.collection(this.sObj.col.users);
        var user = await c.findOne({user_id: user_id}, {_id : 0});
        if (!Array.isArray(user.contacts)) {
            return [];
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
        var total = await c.count(allQuery);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            matches: []
        };

        if (!total) {
            return data;
        }

        if (!Number.isInteger(skip) && !Number.isInteger(limit)) {
            var cursor = await c.find(allQuery, {_id : 0});
            var m;
            while (await cursor.hasNext()) {
                m = await cursor.next();
                data.matches.push(m);
                if (data.matches.length >= this.sObj.MAX_ALLOW_QUERY_SIZE) {
                    break;
                }
            }

        } else {
            if (!Number.isInteger(skip)) {
                skip = 0;
            }
            if (!Number.isInteger(limit)) {
                limit = 0;
            }
            data.matches = await c.find(allQuery, {_id : 0})
                    .limit(limit)
                    .skip(skip)
                    .toArray();

        }

        return data;
    }

    async getGroupMatchList(obj) {
        var game_name = obj.game_name;
        var group_name = obj.group_name;
        var skip = obj.skip - 0;
        var limit = obj.limit - 0;

        var query = {
            group_name: group_name,
            game_name: game_name,
            game_status: 'live'
        };
        
        var c = this.sObj.db.collection(this.sObj.col.groups);
        
        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            matches: []
        };

        if (!total) {
            return data;
        }

        if (!Number.isInteger(skip) && !Number.isInteger(limit)) {
            var cursor = await c.find(query, {_id : 0});
            var m;
            while (await cursor.hasNext()) {
                m = await cursor.next();
                data.matches.push(m);
                if (data.matches.length >= this.sObj.MAX_ALLOW_QUERY_SIZE) {
                    break;
                }
            }

        } else {
            if (!Number.isInteger(skip)) {
                skip = 0;
            }
            if (!Number.isInteger(limit)) {
                limit = 0;
            }
            data.matches = await c.find(query, {_id : 0})
                    .limit(limit)
                    .skip(skip)
                    .toArray();

        }

        return data;

    }

    async getTournamentMatchList(obj) {
        var game_name = obj.game_name;
        var tournament_name = obj.tournament_name;
        var skip = obj.skip - 0;
        var limit = obj.limit - 0;

        var query = {
            tournament_name: tournament_name,
            game_name: game_name,
            game_status: 'live'
        };

        var c = this.sObj.db.collection(this.sObj.col.groups);
        
        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            matches: []
        };

        if (!total) {
            return data;
        }

        if (!Number.isInteger(skip) && !Number.isInteger(limit)) {
            var cursor = await c.find(query, {_id : 0});
            var m;
            while (await cursor.hasNext()) {
                m = await cursor.next();
                data.matches.push(m);
                if (data.matches.length >= this.sObj.MAX_ALLOW_QUERY_SIZE) {
                    break;
                }
            }

        } else {
            if (!Number.isInteger(skip)) {
                skip = 0;
            }
            if (!Number.isInteger(limit)) {
                limit = 0;
            }
            data.matches = await c.find(query, {_id : 0})
                    .limit(limit)
                    .skip(skip)
                    .toArray();

        }

        return data;

    }
}

module.exports = Match;

