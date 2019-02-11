
"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Comment extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    async _normalizeComments(user_id, comments) {

        //the the users info
        var user_ids = [];
        for (var i = 0; i < comments.length; i++) {
            user_ids.push(comments[i].user_id);
        }

        var user = new User(this.sObj, this.util);
        var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
        var users = await user.getInfoList(user_ids, required_fields);
        if(users.lastError){
            return this.error(users.lastError);
        }
        //map the user info to thier corresponding comments
        if (Array.isArray(users)) {
            for (var i = 0; i < comments.length; i++) {
                for (var k = 0; k < users.length; k++) {
                    if (users[k].user_id === comments[i].user_id) {
                        comments[i].user = users[k]; // set the user property on the comment object
                        break;
                    }
                }
            }
        }


        for (var i = 0; i < comments.length; i++) {
            
            //set the number of likes and dislikes
            comments[i].likes_count = comments[i].likes.length;
            comments[i].dislikes_count = comments[i].dislikes.length;

            //set whether the user has has liked or disliked the comment
            comments[i].has_user_liked = comments[i].likes.indexOf(user_id) > 0;
            comments[i].has_user_disliked = comments[i].dislikes.indexOf(user_id) > 0;

            //remove the likes and dislikes array to reduce payload
            delete comments[i].likes;
            delete comments[i].dislikes;

        }
        return comments;
    }

    /**
     * The delete the comment for the specified user
     * 
     * @param {type} user_id
     * @param {type} msg_ids
     * @returns {Boolean}
     */
    async deleteFor(user_id, msg_ids) {

        var c = this.sObj.db.collection(this.sObj.col.comments);

        if (!Array.isArray(msg_ids)) {
            msg_ids = [msg_ids];
        }

        var query = {
            $or: []
        };
        for (var i = 0; i < msg_ids.length; i++) {
            query.$or.push({msg_id: msg_ids[i]});
        }

        var r = await c.updateMany(query, {$addToSet: {delete_for: user_id}});


        return 'Successful';
    }

    async _getRepliedComments(comments) {

        var replied_arr = [];
        
        if (!Array.isArray(comments)) {
            return replied_arr;
        }

        var missing_replied_ids = [];
        

        for (var i = 0; i < comments.length; i++) {
            var c = comments[i];
            if (c.msg_replied_id) {
                var found = false;
                for (var k = 0; k < comments.length; k++) {
                    if (comments[k].msg_id === c.msg_replied_id) {
                        if (replied_arr.indexOf(comments[k]) === -1) {
                            replied_arr.push(comments[k]);
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    missing_replied_ids.push(c.msg_replied_id);
                }
            }
        }

        var query = {
            $or: []
        };

        if (missing_replied_ids.length > 0) {
            for (var i = 0; i < missing_replied_ids.length; i++) {
                var q = {
                    msg_id: missing_replied_ids[i]
                };
                query.$or.push(q);
            }

            var c = this.sObj.db.collection(this.sObj.col.comments);
            
            var rep_msgs = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                    .toArray();

            if (!rep_msgs && rep_msgs.length > 0) {
                replied_arr = replied_arr.concat(rep_msgs);//append the messages
            }

        }
        
        return replied_arr;
    }

    /**
     * Get the comments of the specified game id
     * 
     * @param {type} user_id
     * @param {type} game_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_comment.Comment.getGameComments.data}
     */
    async getGameComments(user_id, game_id, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
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


        var query = {
            game_id: game_id,
            delete_for: {$nin: [user_id]}
        };

        var c = this.sObj.db.collection(this.sObj.col.comments);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            comments: [],
            replied_comments: []
        };

        if (!total) {
            return data;
        }


        data.comments = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                .limit(limit)
                .skip(skip)
                .toArray();

        data.comments = await this._normalizeComments(user_id, data.comments);

        data.replied_comments = await this._getRepliedComments(data.comments);

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
            user_id: user_id,
            delete_for: {$nin: [user_id]}
        };

        var c = this.sObj.db.collection(this.sObj.col.comments);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            comments: [],
            replied_comments: []
        };

        if (!total) {
            return data;
        }


        data.comments = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        data.comments = await this._normalizeComments(user_id, data.comments);
        
        data.replied_comments = await this._getRepliedComments(data.comments);

        if(this.lastError){
            return this.error(this.lastError);
        }
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
     * @param {type} content - comment or the audio url if the content_type is audio
     * @param {type} content_type - valid value are: text ; audio
     * @param {type} msg_replied_id - id of the comment message replied to
     * @returns {String}
     */
    sendGameComment(user_id, game_id, content, content_type, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            game_id = arguments[0].game_id;
            content = arguments[0].msg_content; //text message or audio url if the comment is audio type (voice)
            content_type = arguments[0].content_type;
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
            content: content, //text message or audio url if the comment is audio type (voice)
            content_type: content_type,
            status: 'sent', // sent status
            likes: [], //holds user_ids of users who liked the comment
            dislikes: [], //holds user_ids of users who disliked the comment
            delete_for: [], //holds user_ids of users who deleted the comment
            time: now.getTime()
        };


        c.insertOne(msg);

        var me = this;

        //broadcast to the players except the user that sent the message
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
                        if (user_id !== match.players[i].user_id) {//except the user
                            players_ids.push(match.players[i].user_id);
                        }
                    }
                    me.broadcast(me.evt.comment, msg, players_ids);
                })
                .catch(function (err) {
                    console.log(err);
                });

        //broadcast to the spectators
        var sc = this.sObj.db.collection(this.sObj.col.spectators);
        sc.find({game_id: game_id, left_time: null}, {_id: 0})
                .toArray()
                .then(function (spectators) {
                    if (!spectators) {
                        return;//leave
                    }

                    var spectators_ids = [];
                    for (var i = 0; i < spectators.length; i++) {
                        if (user_id !== spectators[i].user_id) {//except the user
                            spectators_ids.push(spectators[i].user_id);
                        }
                    }
                    this.broadcast(this.evt.comment, msg, spectators_ids);
                })
                .catch(function (err) {
                    console.log(err);
                });

        //increment the spectator comment count
        sc.updateOne({user_id: user_id, game_id: game_id},
                {$inc: {comment_count: 1}})
                .then(function (result) {
                    //do nothing
                })
                .catch(function (err) {
                    console.log(err);
                });
        ;

        return msg;
    }

    /**
     * adds the user id to the 'likes' array.
     * 
     * If the user_id is already in the array then is undoes the 'like'
     * 
     * @param {type} user_id
     * @param {type} msg_id
     * @returns {Boolean}
     */
    async like(user_id, msg_id) {

        var c = this.sObj.db.collection(this.sObj.col.comments);

        var r = await c.updateOne({msg_id: msg_id}, {$set: {likes: user_id}});
        if (r.result.nModified === 0) {//undo like
            r = await c.updateOne({msg_id: msg_id}, {$pull: {likes: user_id}});
        }

        var comment = await c.findOne({msg_id: msg_id}, {_id: 0});
        var comments = [];
        comments.push(comment);
        comments =  await this._normalizeComments(user_id, comments);
        if(this.lastError){
            return this.error(this.lastError);
        }
        return comments[0];//we know it is only one comment we normalized
    }

    /**
     * adds the user id to the 'dislikes' array.
     * 
     * If the user_id is already in the array then is undoes the 'dislike'
     * 
     * @param {type} user_id
     * @param {type} msg_id
     * @returns {Boolean}
     */
    async dislike(user_id, msg_id) {

        var c = this.sObj.db.collection(this.sObj.col.comments);

        var r = await c.updateOne({msg_id: msg_id}, {$set: {dislikes: user_id}});
        if (r.result.nModified === 0) {//undo like
            r = await c.updateOne({msg_id: msg_id}, {$pull: {dislikes: user_id}});
        }

        var comment = await c.findOne({msg_id: msg_id}, {_id: 0});
        var comments = [];
        comments.push(comment);
        comments =  await this._normalizeComments(user_id, comments);
        if(this.lastError){
            return this.error(this.lastError);
        }
        return comments[0];//we know it is only one comment we normalized
    }

}

module.exports = Comment;

