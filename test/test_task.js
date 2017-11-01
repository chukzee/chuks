
var task = new Task();
var Main = {};
Main.task = task;

function Task() {
    var taskList = [];
    var interval_id = null;
    this.remove = function (fn) {
        console.log('remove');
        for (var i = 0; i < taskList.length; i++) {
            console.log('remove1');
            console.log(taskList[i].fn);
            console.log(fn);
            if (taskList[i].fn === fn) {
                console.log('remove2');
                taskList.splice(i, 1);
                i--;
                continue;
            }
        }
    };

    this.repeat = function (param1, param2, param3) {
        var fn, interval, times, argu = [];

        if (arguments.length === 1) {//where the only argument is an object
            fn = param1.fn;
            interval = param1.interval;
            times = param1.times;
            argu = param1.argu;
        } else {
            fn = param1;
            interval = param2;
            times = param3;

            if (arguments.length > 3) {
                for (var i = 3; i < arguments.length; i++) {

                    argu.push(arguments[i]);
                }
            }
        }

        var interval_count = Math.floor(interval / 1000);
        var mill_sec = (interval / 1000 - interval_count) * 1000; // extra milli second

        var nw_task = {
            fn: fn,
            interval_count: interval_count,
            interval_run_count: 0,
            mill_sec: mill_sec,
            times: times ? times : -1, //optional
            times_run: 0,
            argu: argu
        };

        taskList.push(nw_task);

        if (!interval_id) {
            interval_id = setInterval(doTask, 1000);
        }
    };
    var doRun = function (taskObj) {
        try {
            taskObj.fn.apply(null, taskObj.argu);
        } catch (e) {
            console.log(e);
        }

    };
    var doTask = function () {

        for (var i = 0; i < taskList.length; i++) {
            var taskObj = taskList[i];
            taskObj.interval_run_count++;

            if (taskObj.interval_count === taskObj.interval_run_count) {
                taskObj.interval_run_count = 0;
                taskObj.times_run++;

                if (taskObj.mill_sec) {
                    setTimeout(doRun, taskObj.mill_sec, taskObj);
                } else {
                    doRun(taskObj);
                }
            }

            if (taskObj.times_run === taskObj.times) {
                taskList.splice(i, 1);
                i--;
                continue;
            }
        }

        if (taskList.length === 0) {
            clearInterval(interval_id);
            interval_id = null;
        }
    };
}




    function Countdown() {
        var fn_list = [];
        var interval_list = [];
        this.stop = function (fn) {
            for (var i = 0; i < fn_list.length; i++) {
                if (fn_list[i] === fn) {
                    clearInterval(interval_list[i]);
                    fn_list.splice(i, 1);
                    interval_list.splice(i, 1);
                    i--;
                    continue;
                }
            }

        };

        this.start = function (fn, initial_value, pattern) {
            /*if (!Main.util.isFunc(fn)) {
             console.warn('first parameter must be a function');
             return;
             }*/
            initial_value = initial_value - 0;
            if (isNaN(initial_value)) {
                console.warn('initial value (second parameter) not a number');
                return;
            }

            if (pattern && pattern !== 'mm:ss' && pattern !== 'hh:mm:ss') {
                console.warn('invalid pattern (third parameter) must be "mm:ss" or "hh:mm:ss" if provided');
                return;
            }
            var interval_id;
            var runFn = function () {
                if (pattern === 'hh:mm:ss') {
                    var hr = Math.floor(initial_value / 3600);
                    var m = initial_value - hr * 3600;
                    var min = Math.floor(m / 60);
                    var sec = m - min * 60;
                    if (hr < 10) {
                        hr = '0' + hr;
                    }
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (sec < 10) {
                        sec = '0' + sec;
                    }
                    var formatted_value = hr + ":" + min + ":" + sec;

                } else if (pattern === 'mm:ss'){

                    var min = Math.floor(initial_value / 60);
                    var sec = initial_value - min * 60;
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (sec < 10) {
                        sec = '0' + sec;
                    }
                    var formatted_value = min + ":" + sec;
                }else{
                    formatted_value = initial_value;
                }


                try {
                    var is_finish = initial_value === 0;
                    fn(formatted_value, is_finish);
                } catch (e) {
                    console.log(e);
                }

                --initial_value;
                if (initial_value < 0) {
                    clearInterval(interval_id);
                }
            };

            runFn();//initial run is immediate

            interval_id = setInterval(runFn, 1000);

            fn_list.push(fn);
            interval_list.push(interval_id);

        };

    }
    
    
/*task.repeat(function(obj){
 console.log(obj);
 }, 1000, 30 ,'task 1');
 
 task.repeat(function(obj){
 console.log(obj);
 }, 5000, -1 ,'task 5');
 */

var c = new Countdown();
var cFn = function (value, finish) {
    console.log(value, finish);
};

c.start(cFn, 100, 'hh:mm:ss');

/*
setTimeout(function(){
    console.log('stop');
    c.stop(cFn);//stop countdown
}, 20000);*/

