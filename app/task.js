
var PlayRequest = require('./game/play-request');
var Tournament = require('./info/tournament');
var Match = require('./game/match');

class Task {

    constructor(sObj, util, evt) {
        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.list = this.loadTasks();
        //The max setTimeout delay is 24.8 days which is (2^31 - 1) or 0x7FFFFFFF milliseconds.
        //A value greater than that will cause wierd behaviour - executing instantly

        this.JS_MAX_SET_TIME0UT_DELAY = Math.pow(2, 31) - 1; // which is (2^31 - 1) or 0x7FFFFFFF
        for (var n in this.list) {
            if (list[n].repeat) {
                //set the new intial delay 
                list[n].delay = new Date(list[n].startTime).getTime() - new Date().getTime();
                if(list[n].delay < 0){//some time is already lost - the best we can do is to continue from a logic point
                    var mod = new Date().getTime() % list[n].interval;
                    list[n].delay = list[n].interval - mod;
                }
                this.interval(list[n].cmd, list[n].intial_delay, list[n].interval, list[n].times, list[n].param);
            } else {
                //set the new delay
                list[n].delay = new Date(list[n].startTime).getTime() - new Date().getTime();
                this.later(list[n].cmd, list[n].delay, list[n].param);
            }
        }
    }

    interval(cmd, intial_delay, interval, times, param) {
        var obj = {
            cmd: cmd,
            task_id: this.sObj.UniqueNumber,
            delay: intial_delay,
            interval: interval,
            interval_id: null, //set dynamically
            times: times,
            startTime: intial_delay > -1 ? new Date().getTime() + intial_delay : new Date().getTime() + interval,
            repeat: true,
            count_run: 0,
            param: param
        };

        this.saveTask(obj);

        if (intial_delay > 0) {
            this.runAt(obj, this.immInterval(obj).bind(this));
        } else {
            this.immInterval(obj);
        }

    }

    immInterval(obj) {
        var interval_id = setInterval(this.intervalFn.bind(this), obj.interval, obj);
        obj.interval_id = interval_id;
    }

    later(cmd, delay, param) {
        if (delay < 0) {
            return;//do nothing - the time has expired
        }
        var obj = {
            cmd: cmd,
            task_id: this.sObj.UniqueNumber,
            delay: delay,
            startTime: new Date().getTime() + delay,
            repeat: false,
            param: param
        };
        this.saveTask(obj);
        this.runAt(obj, this.timeoutFn.bind(this));
    }

    runAt(obj, fn) {

        if (obj.delay > this.JS_MAX_SET_TIME0UT_DELAY) {//above 24.8 days - so apply this technique to go beyound the limit of 24.8 days
            obj.delay -= this.JS_MAX_SET_TIME0UT_DELAY;
            setTimeout(this.runAt, this.JS_MAX_SET_TIME0UT_DELAY, obj, fn);
        } else {
            setTimeout(fn, obj.delay, obj);
        }
    }

    loadTasks() {
        this.list = [];
        //TODO - Load the task synchronizely


        //after loading the task remove expired tasks
        var now = new Date().getTime();

        for (var i = 0; i < this.list.length; i++) {
            if (!this.list[i].repeat && this.list[i].startTime > now) {
                this.list.splice(i, 1);//remove expired tasks
            }
        }

        var str_task = JSON.stringify(this.list);

        //delete the old file - important
        /* 
         fs.closeSync(fd);//close the file
         fs.unlinkSync(file);//delete the file
         
         //create new file with the validated tasks.
         fd = fs.openSync(file, 'a+'); //create and open the file
         fs.writeSync(fd, str_task);//write
         
         */


        return this.list;
    }

    saveTask(obj) {

        this.list.push(obj);

        /* fs.appendFile(file, str, function (err) {
         if (err) {
         console.log(err);
         return;
         }
         //DO NOT initialize priceCollections[symbol][tf] here - DON'T EVER - causes unexpectedly strange result
         });*/

    }

    intervalFn(obj) {
        switch (obj.cmd) {

            case '':
                return;
            default:

                break;
        }

        obj.count_run++;
        if (obj.times > 0 && obj.count_run === obj.times) {
            clearInterval(obj.interval_id);
        }
    }

    async timeoutFn(obj) {
        try {

            switch (obj.cmd) {
                case 'EXPIRE_PLAY_REQUEST':
                    var game_id = obj.param;
                    await new PlayRequest(this.sObj, this.util, this.evt)._expire(game_id);
                    return;
                case 'START_TOURNAMENT_SEASON':
                    await new Tournament(this.sObj, this.util, this.evt)._startSeason(obj.param);
                    return;
                case 'START_TOURNAMENT_MATCH':
                    var game_id = obj.param;
                    await new Match(this.sObj, this.util, this.evt).start(game_id, 'match-fixture');
                    return;
                case 'REMIND_TOURNAMENT_MATCH':
                    var game_id = obj.param;
                    await new Tournament(this.sObj, this.util, this.evt)._notifyUpcomingMatch(game_id);
                    return;

                default:

                    break;
            }

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION -  INSTEAD LOG TO ANOTHER PROCCESS
        }

    }

}


module.exports = Task;