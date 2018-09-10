


"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Spectator extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Add the spectator to this match. Only spectators who are members of the either of the player's group 
     * or contact list can be added. An exception to the rule may be given to 
     * certain users (e.g Premium Users) who may have the privilege to watch top ranked 
     * players games. However there is going to be a hard limit of visible spectators 
     * per game. This therefore introduces two type of spectators: Visible and hidden.
     * The hard limit will only affect the hidden spectators. That is, if the total
     * number of spectators is greater than the maximum allowed then the rest will be 
     * regarded as hidden spectators. 
     * The main differenc between visible and hidden spectators is that the former will
     * receive realtime game session events while the later will not. The reason is that the hidden
     * spectator will not be stored in the datababase.
     * When a legitimate spectator joins the match late, his spectator type is marked as 'hidden'
     * and the status sent to the client. So periodically the hidden spectator will query
     * the game status. Upon quering, if it is detected that the number of spectators is fallen
     * below maximum then the hidden spectator wiil be promoted to 'visible'.
     * 
     * 
     * NOTE: do not broacdcast events of spectators joining or leaving a match
     * as doing so may be too expensive in terms of bandwith. As a workaround
     * instead, the client can periodically refresh the available specatators
     * by calling the get() method.
     * 
     * @param {type} user_id - the spectator user id
     * @param {type} game_id -  the game id
     * @param {type} game_start_time - used to expire the spectator document from the collection
     * @returns {Match}
     */
    async join(user_id, game_id, game_start_time) {

        if (isNaN(new Date(game_start_time).getTime())) {
            return this.error("Invalid input - game start time must be provided and a valid date.");
        }

        try {

            var required_fields = ['first_name', 'last_name', 'email', 'photo_url'];
            var user = await new User(this.sObj, this.util, this.evt).getInfo(user_id, required_fields);
            if (!user) {
                return this.error('Unknown user');
            }

            var sc = this.sObj.db.collection(this.sObj.col.spectators);
            var f = await sc.findOne({
                user_id: user_id,
                game_id: game_id
            });

            if (f) {
                return 'already joined';
            }

            await sc.insertOne({
                game_id: game_id,
                game_start_time: new Date(game_start_time),
                user_id: user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: user.full_name,
                photo_url: user.photo_url
            });
        } catch (e) {
            this.error('Could not join spectator');
            return this;
        }


        // NOTE: do not broacdcast events of spectators joining or leaving a match
        // as doing so may be too expensive in terms of bandwith. As a workaround
        //instead, the client can periodically refresh the available specatators
        // by calling the get() method.


        return 'Joined successfully';
    }

    /**
     * Remove a spectator from the list of spectators of the game specified
     * by the given game id.
     * 
     * NOTE: do not broacdcast events of spectators joining or leaving a match
     * as doing so may be too expensive in terms of bandwith. As a workaround
     * instead, the client can periodically refresh the available specatators
     * by calling the get() method.
     * 
     * @param {type} user_id
     * @param {type} game_id
     * @returns {.sc@call;findOneAndDelete.value|Spectator.leave.spectator|Spectator@call;error}
     */
    async leave(user_id, game_id) {
        try {
            var sc = this.sObj.db.collection(this.sObj.col.spectators);
            var r = await sc.findOneAndDelete({
                game_id: game_id,
                user_id: user_id
            }, {projection: {_id: 0}});
        } catch (e) {
            console.log(e);
            return this.error('Could not delete spectator');
        }

        var spectator = r.value;
        if (!spectator) {
            return this.error('No spectator');
        }


        // NOTE: do not broacdcast events of spectators joining or leaving a match
        // as doing so may be too expensive in terms of bandwith. As a workaround
        //instead, the client can periodically refresh the available specatators
        // by calling the get() method.


        return spectator;
    }

    /**
     * Get a list of spectators viewing the game with the specified game_id
     * 
     * @param {type} game_id
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async get(game_id, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            game_id = arguments[0].game_id;
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

        var c = this.sObj.db.collection(this.sObj.col.spectators);

        var query = {
            game_id: game_id
        };

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            spectators: []
        };

        if (!total) {
            return data;
        }


        data.spectators = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

}

module.exports = Spectator;