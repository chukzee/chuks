
"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Comment extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Get the comments of the specified game id
     * 
     * @param {type} game_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_comment.Comment.getGameComments.data}
     */
    async getGameComments(game_id, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            game_id = arguments[0].user_id;
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


        var query = {
            game_id: game_id
        };

        var c = this.sObj.db.collection(this.sObj.col.comments);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            comments: []
        };

        if (!total) {
            return data;
        }


        data.comments = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();


        //the the users info
        var user_ids = [];
        for (var i = 0; i < data.comments.length; i++) {
            user_ids.push(data.comments[i].user_id);
        }

        var user = new User(this.sObj, this.util);
        var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'photo_url'];
        var users = await user.getInfoList(user_ids, required_fields);

        //map the user info to thier corresponding comments
        if (Array.isArray(users)) {
            for (var i = 0; i < data.comments.length; i++) {
                for (var k = 0; k < users.length; k++) {
                    if (users[k].user_id === data.comments[i].user_id) {
                        data.comments[i].user = users[k]; // set the user property on the comment object
                        break;
                    }
                }
            }
        }

        return data;
    }
    
    /**
     * Get the comments of the specified user
     * 
     * @param {type} user_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_comment.Comment.getUserComments.data}
     */
    async getUserComments(user_id, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
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


        var query = {
            user_id: user_id
        };

        var c = this.sObj.db.collection(this.sObj.col.comments);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            comments: []
        };

        if (!total) {
            return data;
        }


        data.comments = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    /**
     * Add comment for for the match and broadcast to the players and 
     * spectators. The comment is a reply if the comment message replied 
     * to is provided.
     * This method will not use async/await features since each operation
     * will not depend on each other.
     * This method is expected to return immediately because
     * the write concerns are low
     * 
     * 
     * @param {type} user_id - user making the comment
     * @param {type} game_id - game id 
     * @param {type} msg_content - comment
     * @param {type} msg_replied_id - id of the comment message replied to
     * @returns {String}
     */
    add(user_id, game_id, msg_content, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            game_id = arguments[0].game_id;
            msg_content = arguments[0].msg_content;
            msg_replied_id = arguments[0].msg_replied_id;
        }
        
        var c = this.sObj.db.collection(this.sObj.col.comments);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var msg = {
            is_reply: msg_replied_id ? true : false,
            msg_replied_id: msg_replied_id, //id of the comment message replied to
            game_id: game_id,
            user_id: user_id,
            msg_id: msg_id,
            msg: msg_content,
            status: 'sent', // e.g sent , delivered, seen
            like: 0,
            dislike: 0,
            time: now.getTime()
        };


        c.insertOne(msg);

        //broadcast to the players
        var mc = this.sObj.db.collection(this.sObj.col.matches);
        mc.findOne({game_id: game_id}, {_id: 0})
                .then(function (match) {
                    if (!match) {
                        return;//leave
                    }

                    if (!match.players) {
                        return;
                    }
                    var players_ids = [];
                    for (var i = 0; i < match.players.length; i++) {
                        players_ids.push(match.players[i].user_id);
                    }
                    this.broadcast(this.evt.comment, players_ids, msg);
                })
                .catch(function (err) {
                    console.log(err);
                });

        //broadcast to the spectators
        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        sc.find({game_id: game_id}, {_id: 0})
                .toArray()
                .then(function (spectators) {
                    if (!spectators) {
                        return;//leave
                    }

                    var spectators_ids = [];
                    for (var i = 0; i < spectators.length; i++) {
                        spectators_ids.push(spectators[i].user_id);
                    }
                    this.broadcast(this.evt.comment, msg, spectators_ids);
                })
                .catch(function (err) {
                    console.log(err);
                });



        return 'sent successfully';
    }

    /**
     * Like a comment by increasing the number of likes.
     * This method is expected to return immediately because
     * the write concerns are low
     * 
     * @param {type} msg_id
     * @returns {Boolean}
     */
    like(msg_id) {

        var c = this.sObj.db.collection(this.sObj.col.comments);

        c.updateOne({msg_id: msg_id}, {$inc: {like: 1}})
                .then(function (result) {
                    //do nothing       
                })
                .catch(function (err) {
                    console.log(err);
                });

        return true;
    }

    /**
     * Dislike a comment by increasing the number of dislikes.
     * This method is expected to return immediately because
     * the write concerns are low
     * 
     * @param {type} msg_id
     * @returns {Boolean}
     */
    async dislike(msg_id) {

        var c = this.sObj.db.collection(this.sObj.col.comments);

        c.updateOne({msg_id: msg_id}, {$inc: {dislike: 1}})
                .then(function (result) {
                    //do nothing       
                })
                .catch(function (err) {
                    console.log(err);
                });

        return true;
    }

    /**
     * This method is just a simulation
     * 
     * @param {type} gameId
     * @returns {nm$_comment.Comment.simulateHistory.obj}
     */
    simulateHistory(gameId) {
        var obj = [];

        for (var i = 0; i < 10; i++) {
            var content = {
                user_id: i % 3 === 0 ? '07038428492' : '07022840304', //phone number
                full_name: 'full_name',
                profile_photo_url: '/user_photo_url.png', //the profile photo url of the user
                reply_user_id: '08043839429', //the id of the user replied - (optional) ie available only if the message is a reply
                reply_full_name: 'replied_user_full_name', //(optional) ie available only if the message is a reply
                likes: 345, //number of likes
                dislikes: 5, //number of dislikes
                time: new Date().getTime(),
                msg: "this is a simulated message " + i,
                content_type: 'text', //e.g text or voice (as in WhatsApp)
                vioce_data_url: 'path/voice_data', //the url of the voice data to download the voice from (as in WhatsApp)
                vioce_data_byte_size: '2MB'
            };

            obj.push(content);
        }

        return obj;
    }

}

module.exports = Comment;

