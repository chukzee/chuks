
var util = require('../util/util');

var fs = require("fs");
var mkdirp = require('mkdirp');

class Task {

    constructor(sObj, util, evt) {
        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.file = this.sObj.config.TASKS_FILE;
        this.queue = [];
        this.loadTasks();
        //The max setTimeout delay is 24.8 days which is (2^31 - 1) or 0x7FFFFFFF milliseconds.
        //A value greater than that will cause wierd behaviour - executing instantly

        this.JS_MAX_SET_TIME0UT_DELAY = Math.pow(2, 31) - 1; // which is (2^31 - 1) or 0x7FFFFFFF

    }
    loadTasks() {

        //Load the task synchronously
        //yes we need synchronous operation here in this case because we 
        //need this initialization process to finish before anything else

        var path = this.util.getDir(this.file);
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
        console.log(data);
        var arr = JSON.parse(data);
        for (var i = 0; i < arr.length; i++) {
            console.log(arr[i].startTime - now);
            if (!arr[i].repeat && arr[i].startTime < now) {
                arr.splice(i, 1);//remove expired tasks
                i--;
                continue;
            }
            this.reRun(arr[i]);
        }


        //delete the old file - important

        fs.closeSync(fd);//close the file
        fs.unlinkSync(this.file);//delete the file

        //create new file with the validated tasks.
        fd = fs.openSync(this.file, 'a+'); //create and open the file 
        
        var str_tasks = '';
        if (arr.length > 0) {
            str_tasks = JSON.stringify(arr, null, 4);
        }

        fs.writeSync(fd, str_tasks);//write

    }

    reRun(obj) {
        if (obj.repeat) {
            //set the new intial delay 
            obj.delay = new Date(obj.startTime).getTime() - new Date().getTime();
            if (obj.delay < 0) {//some time is already lost - the best we can do is to continue from a logic point
                var mod = new Date().getTime() % obj.interval;
                obj.delay = obj.interval - mod;
            }
            this.interval(obj.classMethod, obj.intial_delay, obj.interval, obj.times, obj.param);
        } else {
            //set the new delay
            obj.delay = new Date(obj.startTime).getTime() - new Date().getTime();
            this.later(obj.classMethod, obj.delay, obj.param);
        }
    }

    interval() {
        console.log('interval', arguments);
    }

    later() {
        console.log('later', arguments);
    }

}

var sObj = {
    config: {
        TASKS_FILE: __dirname + '/test_file.json'
    }
};

new Task(sObj, util);