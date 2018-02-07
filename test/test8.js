
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
    this.tasks.push(obj);
    if(this.tasks.length > 1){
        return;
    }
    
    doSave.bind(this)(obj, next.bind(this));

}
function next() {

    var old = this.tasks.shift();
    
    console.log(old);
    
    if(this.tasks.length === 0){
        return;
    }
    var obj = this.tasks[0];
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

var b = {tasks: [], file: file};

saveTask.bind(b)({a: 1, b: 2, c: 3});
saveTask.bind(b)({a: 4, b: 5, c: 6});
saveTask.bind(b)({a: 7, b: 8, c: 9});
