
var fs = require("fs");
var mkdirp = require('mkdirp');

var fac = 6;
var n = 50;
console.log(fac - n % fac);

var file = __dirname + '/test_file.json';

var fd = fs.openSync(file, 'r+');//open for reading and appending

/**
 * Safely saves tasks asynchronously by waiting of one task to finish saving before
 * asynchronously saving the nex task.
 * 
 * @param {type} obj
 * @returns {undefined}
 */
function saveTask(obj) {
    this.queue.push(obj);
    if (this.queue.length > 1) {
        return;
    }

    doSave.bind(this)(obj, next.bind(this));

}
function next() {

    var old = this.queue.shift();

    console.log(old);

    if (this.queue.length === 0) {
        return;
    }
    var obj = this.queue[0];
    doSave.bind(this)(obj, next.bind(this));

}
function doSave(obj, done) {

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


var b = {queue: [], file: file};

var delay = 1 *60 * 1000;
var obj1 = {
    classMethod: 'classMethod',
    taskId: 1,
    delay: delay,
    interval : 30,
    startTime: new Date().getTime() + delay,
    repeat: true,
    times: 3,
    param: 'param'
};

delay = 2 *60 * 1000;
var obj2 = {
    classMethod: 'classMethod',
    taskId: 1,
    delay: delay,
    interval : 30,
    startTime: new Date().getTime() + delay,
    repeat: true,
    times: 3,
    param: 'param'
};

delay = 3 *60 * 1000;
var obj3 = {
    classMethod: 'classMethod',
    taskId: 1,
    delay: delay,
    interval : 30,
    startTime: new Date().getTime() + delay,
    repeat: true,
    times: 3,
    param: 'param'
};

saveTask.bind(b)(obj1);
saveTask.bind(b)(obj2);
saveTask.bind(b)(obj3);
