

var fs = require("fs");
var mkdirp = require('mkdirp');

class Task {

    constructor(sObj, util, evt) {
        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.file = this.sObj.config.TASKS_FILE;
        this.list = this.loadTasks();
        //The max setTimeout delay is 24.8 days which is (2^31 - 1) or 0x7FFFFFFF milliseconds.
        //A value greater than that will cause wierd behaviour - executing instantly

        this.JS_MAX_SET_TIME0UT_DELAY = Math.pow(2, 31) - 1; // which is (2^31 - 1) or 0x7FFFFFFF
        for (var n in this.list) {
            if (list[n].repeat) {
                //set the new intial delay 
                list[n].delay = new Date(list[n].startTime).getTime() - new Date().getTime();
                if (list[n].delay < 0) {//some time is already lost - the best we can do is to continue from a logic point
                    var mod = new Date().getTime() % list[n].interval;
                    list[n].delay = list[n].interval - mod;
                }
                this.interval(list[n].classMethod, list[n].intial_delay, list[n].interval, list[n].times, list[n].param);
            } else {
                //set the new delay
                list[n].delay = new Date(list[n].startTime).getTime() - new Date().getTime();
                this.later(list[n].classMethod, list[n].delay, list[n].param);
            }
        }
    }

    interval(intial_delay, interval, times, classMethod, param) {
        var obj = {
            classMethod: classMethod,
            taskId: this.sObj.UniqueNumber,
            delay: intial_delay,
            interval: interval,
            intervalId: null, //set dynamically
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
        var intervalId = setInterval(this.intervalFn.bind(this), obj.interval, obj);
        obj.intervalId = intervalId;
    }

    later(delay, classMethod, param) {
        if (delay < 0) {
            return;//do nothing - the time has expired
        }
        var obj = {
            classMethod: classMethod,
            taskId: this.sObj.UniqueNumber,
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
        //Load the task synchronously
        //yes we need synchronous operation here in this case because we 
        //need this initialization process to finish before anything else

        var path = getDir(this.file);
        mkdirp.sync(path);
        var fd = fs.openSync(this.file, 'a+');//open for reading and appending

        var stats = fs.statSync(this.file);
        var size = stats['size'];

        var readPos = 0;
        var length = size - readPos;
        var buffer = new Buffer(length);

        fs.readSync(fd, buffer, 0, length, readPos);

        var data = buffer.toString(); //toString(0, length) did not work but toString() worked for me

        if (!data) {
            return;
        }

        //after loading the task, remove expired tasks
        var now = new Date().getTime();
        this.list = JSON.parse(data);
        for (var i = 0; i < this.list.length; i++) {
            if (!this.list.repeat && this.list.startTime > now) {
                this.list.splice(i, 1);//remove expired tasks
            }
        }


        //delete the old file - important

        fs.closeSync(fd);//close the file
        fs.unlinkSync(this.file);//delete the file

        //create new file with the validated tasks.
        fd = fs.openSync(this.file, 'a+'); //create and open the file 

        var str_tasks = JSON.stringify(this.list, null, 4);

        fs.writeSync(fd, str_tasks);//write

        return this.list;
    }

    saveTask(obj) {

        this.list.push(obj);
        var str = JSON.stringify(obj, null, 4);
        fs.stat(this.file, function (err, stats) {
            var size = stats['size'];
            if (size === 0) {
                str = '[\n'+str+'\n]';
            }else{
                size = size - 2;//skip the last new line character and the closing bracket
                str = ',\n'+str+'\n]';
            }

            fs.writeFile(this.file, str, size, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }

            });
        });
    }

    intervalFn(obj) {
        switch (obj.classMethod) {

            case '':
                return;
            default:

                break;
        }

        obj.count_run++;
        if (obj.times > 0 && obj.count_run === obj.times) {
            clearInterval(obj.intervalId);
        }
    }

    async timeoutFn(obj) {
        try {

            switch (obj.classMethod) {
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