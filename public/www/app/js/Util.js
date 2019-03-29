
/* global Ns */

Ns.Util = {
    DELIMITER: '\u0000',
    REQUEST_RATE_INTERVAL: 60, //in seconds
    lastContactsMatchRequestTime: 0,
    lastGroupMatchRequestTime: {}, // hold the group name against the  request time
    lastTournamentMatchRequestTime: {}, // hold the tournament name against the  request time        

    getGameObject: function (game_name) {

        switch (game_name) {
            case 'chess':
            {
                return Ns.game.two.Chess2D;
            }
            case 'draughts':
            {
                return Ns.game.two.Draughts2D;
            }
            case 'draft'://OR draft
            {
                return Ns.game.two.Draughts2D;
            }
            case 'ludo':
            {
                return Ns.game.two.Ludo2D;
            }
            case 'solitaire':
            {
                return Ns.game.two.Solitaire2D;
            }
            case 'whot':
            {
                return Ns.game.two.Whot2D;
            }
        }
    },

    formatTime: function (time, stict_date) {
        var date = new Date(time);

        var day = date.getDate();
        var month = date.getMonth() + 1;//plus one because it is zero based month
        var year = date.getFullYear();
        var hr = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        day = day > 9 ? day : '0' + day;
        month = month > 9 ? month : '0' + month;
        year = year > 9 ? year : '0' + year;
        hr = hr > 9 ? hr : '0' + hr;
        min = min > 9 ? min : '0' + min;
        sec = sec > 9 ? sec : '0' + sec;

        var date_part = day + '/' + month + '/' + year;

        var day_00_hrs = new Date(year, date.getMonth(), day).getTime();

        var now = new Date();
        var now_00_hrs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        var _24_hrs = 60 * 60 * 24 * 1000;

        if (stict_date !== true) {
            if (now_00_hrs === day_00_hrs) {
                date_part = 'Today';
            } else if (now_00_hrs - day_00_hrs === _24_hrs) {
                date_part = 'Yesterday';
            }
        }

        var dateStr = date_part + ' ' + hr + ':' + min;
        return dateStr;
    },

    formatDate: function (time) {
        var date = new Date(time);

        var day = date.getDate();
        var month = date.getMonth() + 1;//plus one because it is zero based month
        var year = date.getFullYear();

        switch (month) {
            case 1:
                month = 'Jan';
                break;
            case 2:
                month = 'Feb';
                break;
            case 3:
                month = 'Mar';
                break;
            case 4:
                month = 'Apr';
                break;
            case 5:
                month = 'May';
                break;
            case 6:
                month = 'Jun';
                break;
            case 7:
                month = 'Jul';
                break;
            case 8:
                month = 'Aug';
                break;
            case 9:
                month = 'Sep';
                break;
            case 10:
                month = 'Oct';
                break;
            case 11:
                month = 'Nov';
                break;
            case 12:
                month = 'Dec';
                break;
        }

        var date_part = month + ' ' + day + ', ' + year;

        var day_00_hrs = new Date(year, date.getMonth(), day).getTime();

        var now = new Date();
        var now_00_hrs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        var _24_hrs = 60 * 60 * 24 * 1000;

        if (now_00_hrs === day_00_hrs) {
            return date_part = 'Today';
        } else if (now_00_hrs - day_00_hrs === _24_hrs) {
            return date_part = 'Yesterday';
        }

        var dateStr = date_part;
        return dateStr;
    }
};

