


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
     * players games.
     * 
     * @param {type} user_id - the spectator user id
     * @param {type} game_id -  the game id
     * @param {type} prev_game_id -  the game id of the previous game watch. If null or undefined the server delete all
     * @returns {Match}
     */
    async join(user_id, game_id, prev_game_id) {


        try {

            var required_fields = ['first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
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

                //mark that the spectator has left by set the joined_time to null and left_time to current time
                await sc.updateOne({user_id: user_id, game_id: prev_game_id},
                        {$set: {joined_time: null, left_time: new Date()}});

                //mark that the spectator has joine by set the joined_time to current time and left_time to null
                await sc.updateOne({user_id: user_id, game_id: game_id},
                        {$set: {joined_time: new Date(), left_time: null}});


            } else {
                await sc.insertOne({
                    user_id: user_id,
                    game_id: game_id,
                    joined_time: new Date(),
                    left_time: null,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    full_name: user.full_name,
                    small_photo_url: user.small_photo_url,
                    large_photo_url: user.large_photo_url,
                    comment_count: 0
                });
            }


        } catch (e) {
            this.error('Could not join in spectator');
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
     * NOTE: do not broadcast events of spectators joining or leaving a match
     * as doing so may be too expensive in terms of bandwith. As a workaround
     * instead, the client can periodically refresh the available specatators
     * by calling the get() method.
     * 
     * @param {type} user_id
     * @param {type} game_ids - array of game_ids representing games the spectator should leave - it is possible to be more than one if there happened to be network failure in the client end
     * @returns {.sc@call;findOneAndDelete.value|Spectator.leave.spectator|Spectator@call;error}
     */
    async delete(user_id, game_ids) {

        var result = this._doDelete(user_id, game_ids);
        if (result === true) {
            return 'Succesful';
        } else {
            return this.error({
                delete_failures: result
            });
        }
    }

    /**
     * Remove a spectator from the list of spectators of the game specified
     * by the given game id.
     * 
     * NOTE: do not broadcast events of spectators joining or leaving a match
     * as doing so may be too expensive in terms of bandwith. As a workaround
     * instead, the client can periodically refresh the available specatators
     * by calling the get() method.
     * 
     * @param {type} user_id
     * @param {type} game_ids - array of game_ids representing games the spectator should leave - it is possible to be more than one if there happened to be network failure in the client end
     * @returns {.sc@call;findOneAndDelete.value|Spectator.leave.spectator|Spectator@call;error}
     */
    async _doDelete(user_id, game_ids) {

        if (!Array.isArray(game_ids)) {
            game_ids = [game_ids];
        }

        var remaining = game_ids.length;

        try {

            var sc = this.sObj.db.collection(this.sObj.col.spectators);

            for (var i = 0; i < game_ids.length; i++) {
                await sc.deleteOne({
                    game_id: game_ids[i],
                    user_id: user_id
                });
                --remaining;
            }


        } catch (e) {
            console.log(e);

            var fail_game_ids = [];

            if (remaining !== 0) {
                var from_index = game_ids.length - remaining;
                //copy the ones to deleted
                for (var i = from_index; i < game_ids.length; i++) {
                    fail_game_ids.push(game_ids[i]);
                }
            }

            return fail_game_ids;
        }



        // NOTE: do not broadcast events of spectators joining or leaving a match
        // as doing so may be too expensive in terms of bandwith. As a workaround
        //instead, the client can periodically refresh the available specatators
        // by calling the get() method.


        return true;
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
        if (arguments.length === 1 && typeof arguments[0] === 'object') {
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