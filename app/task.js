
var PlayRequest = require('./game/play-request');
var Tournament = require('./info/tournament');

class Task {

    constructor(sObj, util, evt) {
        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.list = {};
    }

    interval(task_name, delay, param) {
        setInterval(this.interval.bind(this), delay, {task_name: task_name, param: param});
    }

    later(task_name, delay, param) {
        setTimeout(this.timeout.bind(this), delay, {task_name: task_name, param: param});
    }

    interval(obj) {
        switch (obj.task_name) {

            case '':
                return;
            default:

                break;
        }
    }

    timeout(obj) {
        switch (obj.task_name) {
            case 'EXPIRE_PLAY_REQUEST':
                var game_id = obj.param;
                new PlayRequest(this.sObj, this.util, this.evt)._expire(game_id);
                return;
            case 'START_TOURNAMENT_SEASON':
                new Tournament(this.sObj, this.util, this.evt)._startSeason(obj.param);
                return;    
                
            default:

                break;
        }
    }

}


module.exports = Task;