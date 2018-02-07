

var fs = require("fs");
var mkdirp = require('mkdirp');

class Task {

    constructor(sObj, util, evt, appLoader) {

        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.__appLoader = appLoader;
        this.file = this.sObj.config.TASKS_FILE;
        this.queue = [];
        this.tasksFn = {};
        this.loadTasks();
        //The max setTimeout delay is 24.8 days which is (2^31 - 1) or 0x7FFFFFFF milliseconds.
        //A value greater than that will cause wierd behaviour - executing instantly

        this.JS_MAX_SET_TIME0UT_DELAY = Math.pow(2, 31) - 1; // which is (2^31 - 1) or 0x7FFFFFFF

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

        this.validateCall(obj);
        this.saveTask(obj);
        this.doInterval(obj);


    }

    doInterval(obj) {
        
        if (obj.delay > 0) {
            this.runAt(obj, this.immInterval(obj).bind(this));
        } else {
            this.immInterval(obj);
        }
    }

    immInterval(obj) {
        var intervalId = setInterval(this.execFn.bind(this), obj.interval, obj);
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
        this.validateCall(obj);
        this.saveTask(obj);
        this.doLater(obj);
    }

    doLater(obj) {
        this.runAt(obj, this.execFn.bind(this));
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
        var arr = JSON.parse(data);
        for (var i = 0; i < arr.length; i++) {
            if (!arr[i].repeat && arr[i].startTime > now) {
                arr[i].splice(i, 1);//remove expired tasks
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

        var str_tasks = JSON.stringify(arr, null, 4);

        fs.writeSync(fd, str_tasks);//write

    }

    reRun(obj) {
        this.validateCall(obj);
        if (obj.repeat) {
            //set the new intial delay 
            obj.delay = new Date(obj.startTime).getTime() - new Date().getTime();
            if (obj.delay < 0) {//some time is already lost - the best we can do is to continue from a logic point
                var mod = new Date().getTime() % obj.interval;
                obj.delay = obj.interval - mod;
            }
            this.doInterval(obj);
        } else {
            //set the new delay
            obj.delay = new Date(obj.startTime).getTime() - new Date().getTime();
            this.doLater(obj);
        }
    }

    saveTask(obj) {
        this.queue.push(obj);
        if (this.queue.length > 1) {
            return;
        }

        this.doSave.bind(this)(obj, next.bind(this));

    }

    next() {

        var old = this.queue.shift();

        //console.log(old);

        if (this.queue.length === 0) {
            return;
        }
        var obj = this.queue[0];
        this.doSave.bind(this)(obj, next.bind(this));

    }

    doSave(obj, done) {

        var str = JSON.stringify(obj, null, 4);
        fs.stat(this.file, function (err, stats) {

            if (err) {
                done();
                console.log(err);
                return;
            }

            var size = stats['size'];
            if (size === 0) {
                str = '[\n' + str + '\n]';
            } else {
                size = size - 2;//skip the last new line character and the closing bracket
                str = ',\n' + str + '\n]';
            }

            var buffer = new Buffer(str);//must be a buffer otherwise nodejs will refuse to position it as will expect. they will set the offset to zero and the positon to offset which is zero.What!

            fs.write(fd, buffer, 0, buffer.length, size, function (err, writtenSize, wrttenData) {
                if (err) {
                    done();
                    console.log(err);
                    return;
                }
                done();
            });
        });
    }

    validateCall(obj){

        var index = obj.classMethod.lastIndexOf('/');
        var clazz = obj.classMethod.substring(0, index);
        var method = obj.classMethod.substring(index + 1);

        //get the module using the qualified class name
        var Module = this.__appLoader.getModule(clazz);
        //execute the class method in the module

        if (Module) {
            //we already know it is a function because we check for that in the app loader.
            //instantiate the module on demand - safe this way to avoid thread issues if any.
            var moduleInstance = new Module(this.sObj, this.util, this.evt);
            var fn = moduleInstance[method];
            if (typeof fn !== 'function') {
                throw Error(`Not a function - ${obj.classMethod}`);
            }
            this.tasksFn[obj.classMethod] = fn.bind(moduleInstance);
        }        
    }

    async execFn(obj) {

        var fn = this.tasksFn[obj.classMethod];
        if(fn){
            fn(obj.param);
        }

        if (obj.count_run > -1) {
            obj.count_run++;
        }
        if (obj.times > 0 && obj.count_run === obj.times) {
            clearInterval(obj.intervalId);
        }
    }

}


module.exports = Task;