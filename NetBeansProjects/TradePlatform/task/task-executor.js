
var tasks = [];
var namedTasks = {};
var isLazyStarted = false;
var MIN_INTERVAL = 1000; // TODO: Experiment with lower value later (say 100, 10 , 1) and check server performance if it has negative impact.
var metrics = null;

var executor = function (_metrics) {
    metrics = _metrics;
    
    this.SECONDS = 1000;
    this.MINUTES = 60 * 1000;
    this.HOURS = 60 * 60 * 1000;
    this.DAYS = 60 * 60 * 24 * 1000;

    this.getByName = function (name, fn) {
        for (var i in namedTasks) {
            var nt = namedTasks[i];
            if (nt.name === name) {
                fn(nt.name, nt.id, nt.args, nt.value, nt.unit);
            }
        }
    };

    this.getByID = function (id, fn) {
        var nt = namedTasks[id];
        if (nt) {
            fn(nt.name, nt.id, nt.args, nt.value, nt.unit);
        }
    };

    this.searchByIDs = function (ids, fn) {
        for (var i = 0; i < ids.length; i++) {
            var nt = namedTasks[ids[i]];
            if (nt) {
                fn(nt.name, nt.id, nt.args, nt.value, nt.unit);
            }
        }
    };

    this.queue = function (fn, args, value, unit) {

        if (typeof fn === "function" && arguments.length >= 3) {
            validateTask(fn, args, value, unit, false);
        } else if (typeof fn === "object" && arguments.length === 1) {
            validateTaskObject(fn, false);
        } else {
            throw new Error("Invalid parameters or paramenter count");
        }

    };

    this.schedule = function (fn, args, value, unit, begin_time) {
        if (typeof fn === "function" && arguments.length >= 3) {
            validateTask(fn, args, value, unit, begin_time, true);
        } else if (typeof fn === "object" && arguments.length === 1) {
            validateTaskObject(fn, true);
        } else {
            throw new Error("Invalid parameters or paramenter count");
        }
    };

    var validateTaskObject = function (obj, repeat) {
        createTask(obj.fn, obj.args, obj.value, obj.unit, obj.begin_time, repeat, obj.name, obj.id);
    };

    var validateTask = function () {
        var fn, value, unit, begin_time, args = null, repeat;

        if (typeof arguments[3] === "undefined") {
            fn = arguments[0];
            value = arguments[1];
            unit = arguments[2];

        } else if (typeof arguments[4] === "undefined") {
            fn = arguments[0];
            args = arguments[1];
            value = arguments[2];
            unit = arguments[3];

        } else {
            fn = arguments[0];
            args = arguments[1];
            value = arguments[2];
            unit = arguments[3];
            begin_time = arguments[4];

        }

        repeat = arguments[arguments.length - 1];

        createTask(fn, args, value, unit, begin_time, repeat);
    };

    var createTask = function (fn, args, value, unit, begin_time, repeat, name, id) {
        if (begin_time) {
            begin_time = new Date(begin_time).getTime();
            if (isNaN(begin_time)) {
                throw new Error("Invalid schedule time! Expected a valid time parameter.");
            }

            if (begin_time <= new Date().getTime()) {
                begin_time = 0;//cancel
            }
        }

        if (!isLazyStarted) {
            setInterval(run, MIN_INTERVAL);
        }
        var has_unit = unit === this.SECONDS
                || unit === this.MINUTES
                || unit === this.HOURS
                || unit === this.DAYS;

        var time = new Date().getTime();
        var interval = !isNaN(value) && has_unit ? (value * unit) : 0;

        var nex_time = begin_time ? begin_time : (time + interval);

        var ts = {
            fn: fn,
            args: args, //function arguments
            startTime: time,
            nextTime: nex_time,
            interval: interval,
            repeat: repeat,
            value: value,
            unit: unit,
            name: name,
            id: id
        };

        if ((ts.id && !ts.name) || (!ts.id && ts.name)) {
            throw new Error("a task with id must go with a name and vice versa");
        }
        if (ts.id) {
            namedTasks[ts.id] = ts;
        }

        tasks.push(ts);

        //do some metrics
        metrics.incrementTasks();

        if (ts.name === "countdown") {
            metrics.incrementCountdownOrders();
        }

    };

    return this;

};

var run = function () {
    var currenTime = new Date().getTime();
    tasks.forEach(function (task, index, arr) {
        if (task.nextTime <= currenTime) {

            try {
                task.fn(task.args);//execute the function
            } catch (e) {
                console.error(e); // DO NOT DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS
            }
            if (!task.repeat) {
                if (task.id) {
                    delete namedTasks[task.id];
                }
                arr.splice(index, 1);// remove the task

                //do some metrics
                metrics.decrementTasks();

                if (task.name === "countdown") {
                    metrics.decrementCountdownOrders();
                }

            }
            task.nextTime += task.interval;
        }

    });

};


module.exports = executor;









