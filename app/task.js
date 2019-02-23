

var fs = require("fs");
var mkdirp = require('mkdirp');

class Task {

    constructor(sObj, util, evt, appLoader) {

        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.__appLoader = appLoader;
        this.file = this.sObj.config.TASKS_FILE;
        this.fd = null;
        this.queue = [];
        this.task = {};
        this._loadTasks();
        //The max setTimeout delay is 24.8 days which is (2^31 - 1) or 0x7FFFFFFF milliseconds.
        //A value greater than that will cause wierd behaviour - executing instantly

        this.JS_MAX_SET_TIME0UT_DELAY = Math.pow(2, 31) - 1; // which is (2^31 - 1) or 0x7FFFFFFF

    }

    /**
     * Executes a task periodically. The task is persistent in the sense that
     * even if the server goes off, the task is remembered the moment the server comes back and
     * continues in the exact expected occurrence.
     * 
     * valid arguments signatures are:
     * -One argument - expects an object.
     * -Two or more argument.
     * 
     * the singnature of object paramenter is:
     * var obj = {
     *      classMethod: classMethod, // the callee method - must be a string representing the mehod to call one of the methods of the class in the app folder e.g game/Match/start.
     *      delay: delay, // initial delay
     *      interval: interval,
     *      times: times,
     *      param: param
     *  };
     * 
     * for more than one argument the signation is:
     * 
     * interval(intial_delay, interval, times, classMethod, param_0, param_1, param_2,......,param_N)
     * 
     * @param {type} o
     * @returns {undefined}
     */
    interval(o) {
        var obj = {};
        if (arguments.length === 1) {
            obj.classMethod = o.classMethod;
            obj.delay = o.delay;
            obj.interval = o.interval;
            obj.times = o.times;
            obj.param = Array.isArray(o.param) ? o.param : [o.param];
        } else if (arguments.length >= 4) {

            obj.delay = arguments[0];
            obj.interval = arguments[1];
            obj.times = arguments[2];
            obj.classMethod = arguments[3];
            obj.param = [];
            for (var i = 4; i < arguments.length; i++) {
                obj.param.push(arguments[i]);
            }

        } else {
            throw new Error('Invalid number of arguments- must be 1 (for object) or at least 4 reqular paramenters');
        }


        obj.taskId = this.sObj.UniqueNumber;
        obj.machineId = this.sObj.machineId;
        obj.intervalId = null; //set dynamically
        obj.startTime = obj.delay > -1 ? new Date().getTime() + obj.delay : new Date().getTime() + obj.interval;
        obj.repeat = true;
        obj.count_run = 0;


        this._validateCall(obj);
        this._saveTask(obj);
        this._doInterval(obj);


    }

    _doInterval(obj) {

        if (obj.delay > 0) {
            this._runAt(obj, this._immInterval.bind(this));
        } else {
            this._immInterval(obj);
        }
    }

    _immInterval(obj) {
        if (obj.delay > 0) {
            this._execFn.bind(this)(obj);
        }
        var intervalId = setInterval(this._execFn.bind(this), obj.interval, obj);
        obj.intervalId = intervalId;
    }

    /**
     * Executes a task after a given delay . The task is persistent in the sense that
     * even if the server goes off, the task is remembered the moment the server come back and
     * continues in the exact expected occurrence.
     * 
     * valid arguments signatures are:
     * -One argument - expects an object.
     * -Two or more argument.
     * 
     * the singnature of object paramenter is:
     * var obj = {
     *      classMethod: classMethod, // the callee method - must be a string representing the mehod to call one of the methods of the class in the app folder e.g game/Match/start.
     *      delay: delay, // initial delay
     *      param: param
     *  };
     * 
     * for more than one argument the signation is:
     * 
     * later(delay, classMethod, param_0, param_1, param_2,......,param_N)
     * 
     * @param {type} o
     * @returns {undefined}
     */
    later(o) {
        var obj = {};
        if (arguments.length === 1) {
            obj.delay = o.delay;
            obj.classMethod = o.classMethod;
            obj.param = Array.isArray(o.param) ? o.param : [o.param];
        } else if (arguments.length >= 2) {

            obj.delay = arguments[0];
            obj.classMethod = arguments[1];
            obj.param = [];
            for (var i = 2; i < arguments.length; i++) {
                obj.param.push(arguments[i]);
            }

        } else {
            throw new Error('Invalid number of arguments- must be 1 (for object) or at least 2 reqular paramenters');
        }

        obj.taskId = this.sObj.UniqueNumber;
        obj.machineId = this.sObj.machineId;
        obj.startTime = new Date().getTime() + obj.delay;
        obj.repeat = false;
        obj.count_run = 0;
        

        if (obj.delay < 0) {
            return;//do nothing - the time has expired
        }

        this._validateCall(obj);
        this._saveTask(obj);
        this._doLater(obj);
    }

    _doLater(obj) {
        this._runAt(obj, this._execFn.bind(this));
    }

    _runAt(obj, fn) {

        if (obj.delay > this.JS_MAX_SET_TIME0UT_DELAY) {//above 24.8 days - so apply this technique to go beyound the limit of 24.8 days
            obj.delay -= this.JS_MAX_SET_TIME0UT_DELAY;
            setTimeout(this._runAt, this.JS_MAX_SET_TIME0UT_DELAY, obj, fn);
        } else {

            setTimeout(fn, obj.delay, obj);
        }
    }

    _loadTasks() {

        //Load the task synchronously
        //yes we need synchronous operation here in this case because we 
        //need this initialization process to finish before anything else

        var path = this.util.getDir(this.file);
        mkdirp.sync(path);
        if (fs.existsSync(this.file)) {
            this.fd = fs.openSync(this.file, 'r+');
        } else {
            this.fd = fs.openSync(this.file, 'w+');
        }
        var stats = fs.statSync(this.file);
        var size = stats['size'];

        var readPos = 0;
        var length = size - readPos;
        var buffer = new Buffer(length);

        fs.readSync(this.fd, buffer, 0, length, readPos);

        var data = buffer.toString(); //toString(0, length) did not work but toString() worked for me

        if (!data) {
            return;
        }

        //after loading the task, remove expired tasks
        var now = new Date().getTime();

        var arr = JSON.parse(data);
        var disallowed = [];
        var allowed = [];
        var runables = [];
        for (var i = 0; i < arr.length; i++) {                        
            
            if (!arr[i].machineId) {
                continue;
            }
            
            if (arr[i].machineId !== this.sObj.machineId) {
                if (disallowed.indexOf(arr[i].machineId) > -1) {
                    continue;
                }

                if (allowed.indexOf(arr[i].machineId) === -1) {
                    
                    console.log('Detected task that was not created in this server machine - foreign machine id is ' + arr[i].machineId
                            +'\nDo you want to run all tasks from "'+arr[i].machineId+'" machine, (y/n)?');
                    var b = new Buffer(10);
                    var n = fs.readSync(process.stdin.fd, b, 0, b.length);
                    var d = b.toString('utf8', 0, n).toLowerCase();
                    if (d.endsWith('\r\n')) {//windows
                        d = d.substring(0, d.length - 2);
                    } else if (d.endsWith('\n')) {//linux
                        d = d.substring(0, d.length - 1);
                    }
                    if (d !== 'yes' && d !== 'y') {
                        if (d !== 'no' && d !== 'n') {
                            console.log('Invalid answer - please type yes or no!');
                            i--;
                            continue;
                        }
                        
                        disallowed.push(arr[i].machineId);
                        continue;
                    }
                    allowed.push(arr[i].machineId);
                }
            }

            if (!arr[i].repeat && arr[i].startTime < now) {
                arr.splice(i, 1);//remove expired tasks
                i--;
                continue;
            }
            
            //just collect the runable tasks - do not run immediately
            //to avoid event loop blocking interference I observed when
            // reading from the command line which affected the timer result
            //ie unexpected trigger intervals.
            
            runables.push(arr[i]);//importnat! safer this way.
            
        }

        //now rerun all the runnable. safer this way!
        for (var i = 0; i < runables.length; i++) {
            this._reRun(runables[i]);
        }        

        //delete the old file - important

        fs.closeSync(this.fd);//close the file
        fs.unlinkSync(this.file);//delete the file

        //create new file with the validated tasks.
        this.fd = fs.openSync(this.file, 'w+'); //create and open the file 

        var str_tasks = '';
        if (arr.length > 0) {
            str_tasks = JSON.stringify(arr, null, 4);
        }

        fs.writeSync(this.fd, str_tasks);//write

    }

    _reRun(obj) {
        this._validateCall(obj);
        if (obj.repeat) {            

            //set the new intial delay 
            var diff = new Date(obj.startTime).getTime() - new Date().getTime();
            if (diff < 0) {//some time is already lost - the best we can do is to continue from a logical point                
                var mod = (-diff) % obj.interval;
                obj.delay = obj.interval - mod;
            } else {
                obj.delay = diff;
            }            

            this._doInterval(obj);
        } else {
            //set the new delay
            obj.delay = new Date(obj.startTime).getTime() - new Date().getTime();
            this._doLater(obj);
        }
    }

    _saveTask(obj) {
        this.queue.push(obj);
        if (this.queue.length > 1) {
            return;
        }

        this._doSave.bind(this)(obj, this._next.bind(this));

    }

    _next() {

        var old = this.queue.shift();

        //console.log(old);

        if (this.queue.length === 0) {
            return;
        }
        var obj = this.queue[0];
        this._doSave.bind(this)(obj, this._next.bind(this));

    }

    _doSave(obj, done) {
        var me = this;
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

            var buffer = new Buffer(str);//must be a buffer otherwise nodejs will refuse to position it as we expect. They will set the offset to zero and the positon to offset which is zero. What!!!

            fs.write(me.fd, buffer, 0, buffer.length, size, function (err, writtenSize, wrttenData) {
                if (err) {
                    done();
                    console.log(err);
                    return;
                }
                done();
            });
        });
    }

    _validateCall(obj) {

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
                throw Error(`Could not locate '${obj.classMethod}' - '${method}' method was not found in '${clazz}' class`);
            }
            this.task[obj.classMethod] = {
                fn: fn,
                _this: moduleInstance
            };
        } else {
            throw Error(`Could not locate '${obj.classMethod}' - '${clazz}' class could not be found`);
        }
    }

    async _execFn(obj) {

        var t = this.task[obj.classMethod];

        try {
            if (t.fn) {
                await t.fn.apply(t._this, obj.param);
            }
        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS
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