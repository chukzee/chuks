


"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Spectator extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Add the spectator to this match and notify all users viewing this match
     * Only spectators who are members of the either of the player's group 
     * or contact list can be added. An exception to the rule may be given to 
     * certain users (e.g Premium Users) who may have the privilege to watch top ranked 
     * players games. However there is going to be a hard limit of visible spectators 
     * per game. This therefore introduces two type of spectators: Visible and Invisible.
     * The hard limit will only affect the invisible spectators. That is, if the total
     * number of spectators is greater the the maximum allowed then the rest will be 
     * regarded as invisible spectators. 
     * The main differenc between visible and invisible spectators is that the former will
     * receive realtime game session events while the later will not. The reason is that the invisible
     * spectator will not be stored in the datababase.
     * When a legitimate spectator joins the match late, his spectator type is marked as 'invisible'
     * and the status sent to the client. So periodically the invisible spectator will query
     * the game status. Upon quering, if it is detected that the number of spectators is fallen
     * below maximum thath the invisible spectator wiil be promoted to 'visible'.
     * 
     * 
     * @param {type} user_id - the spectator user id
     * @param {type} game_id -  the game id
     * @param {type} game_start_time - used to expire the spectator document from the collection
     * @returns {Match}
     */
    async join(user_id, game_id, game_start_time) {

        if (isNaN(new Date(game_start_time).getTime())) {
            error("invalid input - game start time must be provided and a valid date.");
            return this;
        }

        try {
            
            var required_fields = ['first_name', 'last_name', 'photo_url'];
            var user = await new User(this.sObj, this.util, this.evt).getInfo(user_id, required_fields);
            if (!user) {
                return 'unknown user';
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
                game_start_time: game_start_time,
                user_id: user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: user.full_name,
                photo_url: user.photo_url
            });
        } catch (e) {
            this.error('could not join spectator');
            return this;
        }

        return 'joined successfully';
    }

    async leave(user_id, game_id) {
        try {
            var r = await sc.findOneAndDelete({
                game_id: game_id,
                user_id: user_id
            }, {projection: {_id: 0}});
        } catch (e) {
            console.log(e);
            return this.error('could not delete spectator');
        }
        
        var spectator = r.value;
        if(!spectator){
            return this.error('no spectator');
        }
        
        return spectator;
    }

    /**
     * Get a list of spectators view the game with the specified game_id
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
            total: 0,
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