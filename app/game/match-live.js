
"use strict";

var Base = require('../base');

class MatchLive extends Base {

    constructor(sObj) {
        super(sObj);
    }

    async getContantsMatchList() {

        //TEST CODE SIMULATION BEGINS
         var obj = [];
         var len = 20;
        for (var i = 0; i < len; i++) {
            var content = {};
            content.game_name= "chess";
            content.game_id= "game_id";
            content.white_id = i=== len-1?'07038428492':"white_id_"+i;
            content.white_name = "Chuks_" + i + " Alimele_" + i;
            content.white_pic = "white_pic_" + i + ".png";
            content.white_large_pic = "white_large_pic_" + i + ".png";
            content.white_activity= "thinking...";
            content.white_countdown= "5:42";
            content.white_wld= "W 3, L 2, D 5";
            content.black_id = "black_id_" + i;
            content.black_name = "Peter_" + i + " Okoro_" + i;
            content.black_pic = "black_pic_" + i + ".png";
            content.black_large_pic = "black_large_pic_" + i + ".png";
            content.black_activity= "thinking...";
            content.black_countdown= "5:42";
            content.black_wld= "W 3, L 2, D 5";
            content.game_id = "game_id_" + i;
            content.game_elapse_time = i + " days";
            content.game_views_count = "2" + i + " view";
            content.game_score = "2-0";
            content.game_status= "Live",
            content.game_position= "The game position goes here";
            content.game_duration= "the game duration goes here";
            content.game_end_time = new Date().getTime();// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            content.game_pause_time = new Date().getTime();// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            
            
            obj.push(content);
        }

        this.replySuccess(obj);

        //TEST CODE SIMULATION ENDS

    }

    async getGroupMatchList(group_name) {

        //TEST CODE SIMULATION BEGINS
        
        var obj = [];
        for (var i = 0; i < 20; i++) {
            var content = {};
            content.game_name= "chess";
            content.game_id= "game_id";
            content.group_name = group_name; // must be unique
            content.white_id = "white_id_" + i;
            content.white_name = "Chuks_" + i + " Alimele_" + i;
            content.white_pic = "white_pic_" + i + ".png";
            content.white_large_pic = "white_large_pic_" + i + ".png";
            content.white_activity= "thinking...";
            content.white_countdown= "5:42";
            content.white_wld= "W 3, L 2, D 5";
            content.black_id = "black_id_" + i;
            content.black_name = "Peter_" + i + " Okoro_" + i;
            content.black_pic = "black_pic_" + i + ".png";
            content.black_large_pic = "black_large_pic_" + i + ".png";
            content.black_activity= "thinking...";
            content.black_countdown= "5:42";
            content.black_wld= "W 3, L 2, D 5";
            content.game_id = "game_id_" + i;
            content.game_elapse_time = i + " days";
            content.game_views_count = "2" + i + " view";
            content.game_score = "2-0";
            content.game_status = "Live";
            content.game_position= "The game position goes here";
            content.game_duration= "the game duration goes here";
            content.game_end_time = new Date().getTime();// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            content.game_pause_time = new Date().getTime();// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            
            
            obj.push(content);
        }

        this.replySuccess(obj);
        
        //TEST CODE SIMULATION ENDS

    }

    async getTournamentMatchList(tournament_name) {

        //TEST CODE SIMULATION BEGINS
        var obj = [];
        for (var i = 0; i < 20; i++) {
            var content = {};
            content.game_name= "chess";
            content.game_id= "game_id";
            content.tournament_name = tournament_name; // must be unique
            content.white_id = "white_id_" + i;
            content.white_name = "Chuks_" + i + " Alimele_" + i;
            content.white_pic = "white_pic_" + i + ".png";
            content.white_large_pic = "white_large_pic_" + i + ".png";
            content.white_activity= "thinking...";
            content.white_countdown= "5:42";
            content.white_wld= "W 3, L 2, D 5";
            content.black_id = "black_id_" + i;
            content.black_name = "Peter_" + i + " Okoro_" + i;
            content.black_pic = "black_pic_" + i + ".png";
            content.black_large_pic = "black_large_pic_" + i + ".png";
            content.black_activity= "thinking...";
            content.black_countdown= "5:42";
            content.black_wld= "W 3, L 2, D 5";
            content.game_id = "game_id_" + i;
            content.game_elapse_time = i + " days";
            content.game_views_count = "2" + i + " view";
            content.game_score = "2-0";
            content.game_status = "Live";
            content.game_position= "The game position goes here";
            content.game_duration= "the game duration goes here";
            content.game_end_time = new Date().getTime();// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            content.game_pause_time = new Date().getTime();// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            
            obj.push(content);
        }

        this.replySuccess(obj);
        
        //TEST CODE SIMULATION ENDS

    }
}

module.exports = MatchLive;

