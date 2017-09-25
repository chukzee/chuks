
"use strict";

var WebApplication = require('../web-application');


class Chat extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Get the chat messages of the specified game id
     * 
     * @param {type} game_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_chat.Chat.getGameChats.data}
     */
    async getGameChats(game_id, skip, limit) {


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

        var query = {
            game_id: game_id
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }
    
    async getGroupChats(group_name, skip, limit) {
        
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
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
            group_name: group_name
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    async getTournamentInhouseChats(tournament_name, skip, limit) {
        
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
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
            tournament_name: tournament_name,
            chat_type: 'inhouse'
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }
    
    
    async getTournamentGeneralChats(tournament_name, skip, limit) {
        
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
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
            tournament_name: tournament_name,
            chat_type: 'general'
        };

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;        
    }
    /**
     * Get chat messages of the specified user
     * 
     * @param {type} user_id
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_chat.Chat.getUserChats.data}
     */
    async getUserChats(user_id, skip, limit) {

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

        var c = this.sObj.db.collection(this.sObj.col.chats);

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: 0,
            chats: []
        };

        if (!total) {
            return data;
        }


        data.chats = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    async sendGameChat(user_id, opponent_id, game_id, msg) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            opponent_id = arguments[0].opponent_id;
            game_id = arguments[0].game_id;
            msg = arguments[0].msg;
        }
        
        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            game_id: game_id,
            user_id: user_id,
            opponent_id: opponent_id,
            msg_id: msg_id,
            msg: msg,
            status: 'sent', // e.g sent , delivered, seen
            time: now.getTime()
        };

        c.insertOne(chat_msg);

        //forward to the other user        
        this.send(this.evt.game_chat, chat_msg, opponent_id, true);

        return 'sent successfully';
    }

    async sendGroupChat(user_id, group_name, msg) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
            msg = arguments[0].msg;
        }
        
        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            group_name: group_name,
            user_id: user_id,
            msg_id: msg_id,
            msg: msg,
            status: 'sent', // e.g sent , delivered, seen
            time: now.getTime()
        };

        c.insertOne(chat_msg);

        
        //broadcast message to the group members        
        
        c = this.sObj.db.collection(this.sObj.col.groups);
        var group = await c.findOne({name: group_name});
        
        var members_ids = [];
        for(var i=0; i<group.members.length; i++){
            members_ids[i] = group.members[i].user_id;
        }
        
        this.broadcast(this.evt.group_chat, chat_msg, members_ids, true);
        
        return 'sent successfully';        
    }
    
    async sendTournamentInhouseChat(user_id, tournament_name, msg) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            msg = arguments[0].msg;
        }
        
        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            tournament_name: tournament_name,
            chat_type:'inhouse',
            user_id: user_id,
            msg_id: msg_id,
            msg: msg,
            status: 'sent', // e.g sent , delivered, seen
            time: now.getTime()
        };

        c.insertOne(chat_msg);

        //forward to the other user        
        //this.send('tournament_inhouse_chat', opponent_id, chat_msg);
        
        //broadcast message to the tournament members - officials and players       
        
        c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        
        var members_ids = [];
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                members_ids.push(tourn.officials[i].user_id);
            }
        }
        
        if (Array.isArray(tourn.players)) {
            for (var i = 0; i < tourn.players.length; i++) {
                members_ids.push(tourn.players[i].user_id);
            }
            
        }
        
        this.broadcast(this.evt.tournament_inhouse_chat, chat_msg, members_ids, true);

        return 'sent successfully';        
    }
    
    async sendTournamentGeneralChat(user_id, tournament_name, msg) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            msg = arguments[0].msg;
        }
        
        var c = this.sObj.db.collection(this.sObj.col.chats);

        var now = new Date();
        var msg_id = this.sObj.UniqueNumber; // used for identifying individual message
        var chat_msg = {
            tournament_name: tournament_name,
            chat_type:'general',
            user_id: user_id,
            msg_id: msg_id,
            msg: msg,
            status: 'sent', // e.g sent , delivered, seen
            time: now.getTime()
        };

        c.insertOne(chat_msg);

        
        c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        
        var members_ids = [];
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                members_ids.push(tourn.officials[i].user_id);
            }
        }
        
        if (Array.isArray(tourn.players)) {
            for (var i = 0; i < tourn.players.length; i++) {
                members_ids.push(tourn.players[i].user_id);
            }
            
        }
        
        this.broadcast(this.evt.tournament_general_chat, chat_msg, members_ids, true);
        
        //REMIND: the client side should implement how those who are currenting
        //sending or viewing tournament general chat message can be updated on
        //new message - approach is as follows:  the client should  
        // periodically pull on new tournament general chat message when in the
        //the chat area and stop the pulling when out of the chat area.
        
        return 'sent successfully';        
    }
    
    /**
     * 
     * @param {type} sender_id
     * @param {type} recipient_id
     * @param {type} game_id
     * @param {type} msg
     * @returns {undefined}
     */
    deliveryFeedback(sender_id, recipient_id, game_id, msg) {

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

