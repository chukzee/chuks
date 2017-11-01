
Ns.Util = {
    REQUEST_RATE_INTERVAL: 60, //in seconds
    lastContactsMatchRequestTime: 0,
    lastGroupMatchRequestTime: {}, // hold the group name against the  request time
    lastTournamentMatchRequestTime: {}, // hold the tournament name against the  request time        

    formatTime: function (time) {
        var date = new Date(time);

        console.log('TODO - consider the user time zone');

        var day = date.getDate();
        var month = date.getMonth() + 1;//plus one because it is zero based month
        var year = date.getFullYear();
        var hr = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        var date_part = day + '/' + month + '/' + year;

        var day_00_hrs = new Date(year, date.getMonth(), day).getTime();
        
        var now = new Date();
        var now_00_hrs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        var _24_hrs = 60 * 60 * 24 * 1000;
        
        if (now_00_hrs === day_00_hrs) {
            date_part = 'Today';
        } else if (now_00_hrs - day_00_hrs === _24_hrs) {
            date_part = 'Yesterday';
        }

        var dateStr = date_part + ' ' + hr + ':' + min;
        return dateStr;
    }
};

