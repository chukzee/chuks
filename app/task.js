
var PlayRequest = require('./game/play-request');

class Task {

    constructor(sObj, util) {
        this.sObj = sObj;
        this.util = util;
        this.list = {};
    }

    interval(task_name, delay, param) {
        setInterval(this.interval, delay, {task_name: task_name, param: param});
    }

    later(task_name, delay, param) {
        setTimeout(this.timeout, delay, {task_name: task_name, param: param});
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
                new PlayRequest(this.sObj, this.util)._expire(game_id);
                return;
            default:

                break;
        }
    }

}


module.exports = Task;