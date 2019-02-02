
"use strict";

var WebApplication = require('../web-application');


class Chat extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * The delete the chat for the specified user
     * 
     * @param {type} user_id
     * @param {type} msg_ids
     * @returns {Boolean}
     */
    async deleteFor(user_id, msg_ids) {

        var c = this.sObj.db.collection(this.sObj.col.chats);

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

    async _getRepliedChats(chats) {

        var replied_arr = [];
        
        if (!Array.isArray(chats)) {
            return replied_arr;
        }

        var missing_replied_ids = [];
        

        for (var i = 0; i < chats.length; i++) {
            var c = chats[i];
            if (c.msg_replied_id) {
                var found = false;
                for (var k = 0; k < chats.length; k++) {
                    if (chats[k].msg_id === c.msg_replied_id) {
                        if (replied_arr.indexOf(chats[k]) === -1) {
                            replied_arr.push(chats[k]);
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
     * Get the chat messages of the specified game id
     * 
     * @param {type} user_id
     * @param {type} game_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_chat.Chat.getGameChats.data}
     */
    async getGameChats(user_id, game_id, skip, limit) {


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

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            chats: [],
            replied_chats: []
        };

        if (!total) {
            return data;
        }

        data.chats = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                .limit(limit)
                .skip(skip)
                .toArray();

        data.replied_chats = await this._getRepliedChats(data.chats);

        return data;
    }

    /**
     * Get the chat messages of the specified user contact id
     * 
     * @param {type} user_id
     * @param {type} contact_user_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_chat.Chat.getContactChats.data}
     */
    async getContactChats(user_id, contact_user_id, skip, limit) {


        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            contact_user_id = arguments[0].contact_user_id;
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
            $and: [
                {game_id: {$exists: false}},
                {delete_for: {$nin: [user_id]}},
                {$or: [
                        {$and: [
                                {user_id: user_id},
                                {contact_user_id: contact_user_id}]},
                        {$and: [
                                {user_id: contact_user_id},
                                {contact_user_id: user_id}]}
                    ]}
            ]
        };


        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            chats: [],
            replied_chats: []
        };

        if (!total) {
            return data;
        }

        data.chats = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                .limit(limit)
                .skip(skip)
                .toArray();

        data.replied_chats = await this._getRepliedChats(data.chats);

        return data;
    }

    async getGroupChats(user_id, group_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
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
            game_id: {$exists: false},
            group_name: group_name,
            delete_for: {$nin: [user_id]}
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            chats: [],
            replied_chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                .limit(limit)
                .skip(skip)
                .toArray();

        data.replied_chats = await this._getRepliedChats(data.chats);

        return data;
    }

    async getTournamentInhouseChats(user_id, tournament_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
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
            game_id: {$exists: false},
            tournament_name: tournament_name,
            chat_type: 'inhouse',
            delete_for: {$nin: [user_id]}
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            chats: [],
            replied_chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                .limit(limit)
                .skip(skip)
                .toArray();

        data.replied_chats = await this._getRepliedChats(data.chats);

        return data;
    }

    async getTournamentGeneralChats(user_id, tournament_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
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
            game_id: {$exists: false},
            tournament_name: tournament_name,
            chat_type: 'general',
            delete_for: {$nin: [user_id]}
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            chats: [],
            replied_chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0, delete_for: 0}) //reduce payload by excluding 'delete_for' field
                .limit(limit)
                .skip(skip)
                .toArray();

        data.replied_chats = await this._getRepliedChats(data.chats);

        return data;
    }

    /**
     * Get chat messages of the specified user
     * 
     * @param {Object} searchObj - object format is <br>
     * var obj = {  <br>
     *      user_id: the_user_id,  <br>
     *      period: {month: 1},  <br>
     *      tournaments: [],  <br>
     *      groups: [],  <br>
     *      contacts:[],  <br>
     *      game_ids:[]  <br>
     *  }  <br>
     *  
     * @param {Number} skip
     * @param {Number} limit
     * @returns {nm$_chat.Chat.searchChats.data}
     */
    async searchChats(searchObj, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            searchObj = arguments[0].searchObj;
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

        var time_ago = new Date().getTime();

        if (searchObj.period.second > 0) {
            time_ago -= searchObj.period.second * 1000;
        } else if (searchObj.period.minute > 0) {
            time_ago -= searchObj.period.minute * 1000 * 60;
        } else if (searchObj.period.hour > 0) {
            time_ago -= searchObj.period.hour * 1000 * 60 * 60;
        } else if (searchObj.period.day > 0) {
            time_ago -= searchObj.period.day * 1000 * 60 * 60 * 24;
        } else if (searchObj.period.week > 0) {
            time_ago -= searchObj.period.week * 1000 * 60 * 60 * 24 * 7;
        } else if (searchObj.period.month > 0) {
            time_ago -= searchObj.period.month * 1000 * 60 * 60 * 24 * 30;
        } else if (searchObj.period.year > 0) {
            time_ago -= searchObj.period.year * 1000 * 60 * 60 * 24 * 30 * 12;
        }

        var query = {time: {$lte: time_ago}, $or: []};

        for (var n in searchObj) {
            var p = searchObj[n];
            if (Array.isArray(p)) {
                for (var i = 0; i < p.length; i++) {
                    var pObj = {};
                    if (n === 'tournaments') {
                        pObj = {tournament_name: p[i]};
                        query.$or.push(pObj);
                    }
                    if (n === 'groups') {
                        pObj = {group_name: p[i]};
                        query.$or.push(pObj);
                    }
                    if (n === 'contacts') {
                        //message from user himself
                        pObj = {$and: {user_id: searchObj.user_id, contact_user_id: p[i]}};
                        query.$or.push(pObj);
                        // message to user by his contact
                        pObj = {$and: {contact_user_id: searchObj.user_id, user_id: p[i]}};
                        query.$or.push(pObj);
                    }

                    if (n === 'game_ids') {
                        pObj = {game_id: p[i]};
                        query.$or.push(pObj);
                    }
                }
            }


        }



        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            chats: [],
            replied_chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        data.replied_chats = await this._getRepliedChats(data.chats);

        return data;
    }

    async sendGameChat(user_id, opponent_id, game_id, content, content_type, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            opponent_id = arguments[0].opponent_id;
            game_id = arguments[0].game_id;
            content = arguments[0].content; //text message or audio url if the content is audio type (voice)
            content_type = arguments[0].content_type;
            msg_replied_id = arguments[0].msg_replied_id;
        }

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            is_reply: msg_replied_id ? true : false,
            msg_replied_id: msg_replied_id, //id of the chat message replied to
            game_id: game_id,
            user_id: user_id,
            opponent_id: opponent_id,
            msg_id: msg_id,
            content: content, //text message or audio url if the content is audio type (voice)
            content_type: content_type,
            status: 'sent', // e.g sent , delivered, seen
            delete_for: [], //holds user_ids of users who deleted the chat
            time: now.getTime()
        };

        c.insertOne(chat_msg);

        //forward to the other user        
        this.send(this.evt.game_chat, chat_msg, opponent_id, true);

        return chat_msg;
    }

    async sendContactChat(user_id, contact_user_id, content, content_type, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            contact_user_id = arguments[0].contact_user_id;
            content = arguments[0].content; //text message or audio url if the content is audio type (voice)
            content_type = arguments[0].content_type;//whether it is text, photo, audio or video
            msg_replied_id = arguments[0].msg_replied_id;
        }

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            is_reply: msg_replied_id ? true : false,
            msg_replied_id: msg_replied_id, //id of the chat message replied to
            user_id: user_id,
            contact_user_id: contact_user_id,
            msg_id: msg_id,
            content: content, //text message or audio url if the content is audio type (voice)
            content_type: content_type,
            status: 'sent', // e.g sent , delivered, seen
            delete_for: [], //holds user_ids of users who deleted the chat
            time: now.getTime(),
            notification_type: "contact_chat",
            notification_time: now.getTime()
        };

        c.insertOne(chat_msg);

        //forward to the other user        
        this.send(this.evt.contact_chat, chat_msg, contact_user_id, true);

        return chat_msg;
    }

    async sendGroupChat(user_id, group_name, content, content_type, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
            content = arguments[0].content; //text message or audio url if the content is audio type (voice)
            content_type = arguments[0].content_type;
            msg_replied_id = arguments[0].msg_replied_id;
        }

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            is_reply: msg_replied_id ? true : false,
            msg_replied_id: msg_replied_id, //id of the chat message replied to
            group_name: group_name,
            user_id: user_id,
            msg_id: msg_id,
            content: content, //text message or audio url if the content is audio type (voice)
            content_type: content_type,
            status: 'sent', // e.g sent , delivered, seen
            delete_for: [], //holds user_ids of users who deleted the chat
            time: now.getTime(),
            notification_type: "group_chat",
            notification_time: now.getTime()
        };

        c.insertOne(chat_msg);

        //broadcast message to the group members except the user who sent the message      

        c = this.sObj.db.collection(this.sObj.col.groups);
        var group = await c.findOne({name: group_name});

        var members_ids = [];
        for (var i = 0; i < group.members.length; i++) {
            if (user_id !== group.members[i].user_id) {
                members_ids[i] = group.members[i].user_id;
            }

        }

        this.broadcast(this.evt.group_chat, chat_msg, members_ids, true);

        return chat_msg;
    }

    async sendTournamentInhouseChat(user_id, tournament_name, content, content_type, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            content = arguments[0].content; //text message or audio url if the content is audio type (voice)
            content_type = arguments[0].content_type;
            msg_replied_id = arguments[0].msg_replied_id;
        }

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            is_reply: msg_replied_id ? true : false,
            msg_replied_id: msg_replied_id, //id of the chat message replied to
            tournament_name: tournament_name,
            chat_type: 'inhouse',
            user_id: user_id,
            msg_id: msg_id,
            content: content, //text message or audio url if the content is audio type (voice)
            content_type: content_type,
            status: 'sent', // e.g sent , delivered, seen
            delete_for: [], //holds user_ids of users who deleted the chat
            time: now.getTime(),
            notification_type: "tournament_inhouse_chat",
            notification_time: now.getTime()
        };

        c.insertOne(chat_msg);

        //forward to the other user        
        //this.send('tournament_inhouse_chat', opponent_id, chat_msg);

        //broadcast message to the tournament members - officials and players except the user who sent the message     

        c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        var members_ids = [];
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (user_id !== tourn.officials[i].user_id) {
                    members_ids.push(tourn.officials[i].user_id);
                }
            }
        }

        if (Array.isArray(tourn.registered_players)) {
            for (var i = 0; i < tourn.registered_players.length; i++) {
                if (user_id !== tourn.registered_players[i].user_id) {
                    members_ids.push(tourn.registered_players[i].user_id);
                }
            }

        }

        this.broadcast(this.evt.tournament_inhouse_chat, chat_msg, members_ids, true);

        return chat_msg;
    }

    async sendTournamentGeneralChat(user_id, tournament_name, content, content_type, msg_replied_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            content = arguments[0].content; //text message or audio url if the content is audio type (voice)
            content_type = arguments[0].content_type;
            msg_replied_id = arguments[0].msg_replied_id;
        }

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            is_reply: msg_replied_id ? true : false,
            msg_replied_id: msg_replied_id, //id of the chat message replied to
            tournament_name: tournament_name,
            chat_type: 'general',
            user_id: user_id,
            msg_id: msg_id,
            content: content, //text message or audio url if the content is audio type (voice)
            content_type: content_type,
            status: 'sent', // e.g sent , delivered, seen
            delete_for: [], //holds user_ids of users who deleted the chat
            time: now.getTime(),
            notification_type: "tournament_general_chat",
            notification_time: now.getTime()
        };

        c.insertOne(chat_msg);


        c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        var members_ids = [];
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (user_id !== tourn.officials[i].user_id) {
                    members_ids.push(tourn.officials[i].user_id);
                }
            }
        }

        if (Array.isArray(tourn.registered_players)) {
            for (var i = 0; i < tourn.registered_players.length; i++) {
                if (user_id !== tourn.registered_players[i].user_id) {
                    members_ids.push(tourn.registered_players[i].user_id);
                }
            }

        }

        this.broadcast(this.evt.tournament_general_chat, chat_msg, members_ids, true);

        //REMIND: the client side should implement how those who are currenting
        //sending or viewing tournament general chat message can be updated on
        //new message - approach is as follows:  the client should  
        // periodically pull on new tournament general chat message when in the
        //the chat area and stop the pulling when out of the chat area.

        return chat_msg;
    }

    /**
     * 
     * @param {type} msg_ids
     * @param {type} sender_id
     * @param {type} recipient_id
     * @returns {undefined}
     */
    async deliveryFeedback(msg_ids, sender_id, recipient_id) {
        return this.statusFeedback('delivered', msg_ids, sender_id, recipient_id);
    }

    /**
     * 
     * @param {type} msg_ids
     * @param {type} sender_id
     * @param {type} recipient_id
     * @returns {undefined}
     */
    async seenFeedback(msg_ids, sender_id, recipient_id) {
        return this.statusFeedback('seen', msg_ids, sender_id, recipient_id);
    }
    /**
     * 
     * @param {type} status
     * @param {type} msg_ids
     * @param {type} sender_id
     * @param {type} recipient_id
     * @returns {undefined}
     */
    async statusFeedback(status, msg_ids, sender_id, recipient_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            status = arguments[0].status;
            msg_ids = arguments[0].msg_ids;
            sender_id = arguments[0].sender_id;
            recipient_id = arguments[0].recipient_id;
        }

        if (!Array.isArray(msg_ids)) {
            msg_ids = [msg_ids];
        }

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var query = {
            $or: []
        };
        for (var i = 0; i < msg_ids.length; i++) {
            query.$or.push({msg_id: msg_ids[i]});
        }

        try {
            var r = await c.updateMany(query, {$set: {status: status}});
        } catch (e) {
            console.log(e);
            return this.error(`could not modify chat message status to ${status}`);
        }


        var two_user_ids = [sender_id, recipient_id];
        var obj = {
            sender_id: sender_id,
            msg_ids: msg_ids,
            status: status
        };
        this.broadcast(this.evt.chat_msg_status, obj, two_user_ids, true);

    }
    /**
     * This method is just a simulation
     * 
     * @param {type} gameId
     * @returns {nm$_chat.Chat.simulateHistory.obj}
     */
    simulateHistory(gameId) {
        var obj = [];

        for (var i = 0; i < 10; i++) {
            var content = {
                white_id: i % 3 === 0 ? '07038428492' : '07022840304', //phone number
                black_id: i % 3 !== 0 ? '07038428492' : '07022840304', //phone number
                white_full_name: 'white_player_full_name',
                black_full_name: 'black_player_full_name',
                time: new Date().getTime(),
                msg: "this is a simulated message " + i,
                content_type: 'text', //e.g text or voice (as in WhatsApp)
                vioce_data_url: 'path/voice_data', //the url of the voice data to download the voice from (as in WhatsApp)
                vioce_data_byte_size: '2MB',
                status: 'seen'//e.g sent , delivered, seen
            };

            obj.push(content);
        }

        return obj;
    }
}

module.exports = Chat;

