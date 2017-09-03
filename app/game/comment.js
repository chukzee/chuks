
"use strict";

var Result = require('../result');

class Comment extends   Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;  

    }

    async getGameComments(gameId) {

        //TEST SIMULATION
        //this.replySuccess(this.simulateHistory(gameId));//TESTING!!!

    }

    async getUserComment(user_id, gameId) {

        //TEST SIMULATION
        //this.replySuccess(this.simulateHistory(gameId));//TESTING!!!

    }

    async add(user_id, game_id, comment) {

    }

    async like(user_id, game_id, comment_id) {

    }

    async dislike(user_id, game_id, comment_id) {

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

