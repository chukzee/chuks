
"use strict";

var Base = require('../base');


class Chat extends   Base {

    constructor(sObj) {
        super(sObj);

    }

    getHistory(gameId) {


        //TEST SIMULATION
        this.replySuccess(this.simulateHistory(gameId));//TESTING!!!

    }

    sendTo(msg) {

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
                white_id: i%3 ===0 ?'07038428492': '07022840304' , //phone number
                black_id: i%3 !==0 ?'07038428492': '07022840304', //phone number
                white_full_name: 'white_player_full_name',
                black_full_name: 'black_player_full_name',
                time: new Date().getTime(),
                msg: "this is a simulated message " + i,
                content_type:'text',//e.g text or voice (as in WhatsApp)
                vioce_data_url:'path/voice_data',//the url of the voice data to download the voice from (as in WhatsApp)
                vioce_data_byte_size:'2MB',
                status: 'seen'//e.g sent , delivered, seen
            };

            obj.push(content);
        }

        return obj;
    }
}

module.exports = Chat;
