var path = require('path');

var Util = function () {

    this.copy = function (from, to, fields, force) {
        for (var i in fields) {
            if (i in from) {
                var f = fields[i];
                if (force === true) {
                    to[i] = f;
                    return;
                }
                ;
                if (f !== null && f !== undefined) {
                    to[i] = f;
                }
            }
        }
    };

    this.merge = function (from, to) {
        for (var i in from) {
            var f = from[i];
            to[i] = f;
        }
    };

    this.length = function (v) {
        if (v && v.length > -1) {
            return v.length;
        }
        return 0;
    };

    this.isFunc = function (fn) {
        return typeof fn === 'function';
    };

    this.isString = function (str) {
        return typeof str === 'string';
    };

    function escapeRegExp(string) {//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //$& means the whole string
    }

    this.replaceAll = function (str, find, replacement) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replacement);
    };

    this.findMissing = function (arr1, arr2, func) {
        var smaller = arr1;
        var bigger = arr2;
        var swap;
        if (smaller.length > bigger.length) {
            smaller = arr2;
            bigger = arr1;
            swap = true;
        }


        if (smaller.length < bigger.length) {
            for (var i = 0; i < bigger.length; i++) {
                var found = false;
                for (var k = 0; k < smaller.length; k++) {

                    if (!swap) {
                        if (func(smaller[k], bigger[i])) {
                            found = true;
                            break;
                        }
                    } else {
                        if (func(bigger[i], smaller[k])) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    return bigger[i];
                }
            }
        }

    };

    /**
     * Remove duplicate elements from the array
     * @param {type} arr
     * @returns {unresolved}
     */
    this.toSet = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var k = 0; k < arr.length; k++) {
                if (k === i) {
                    continue;
                }
                if (arr[i] === arr[k]) {
                    arr.splice(k, 1);
                    k--;
                    continue;
                }
            }
        }
        return arr;
    };

    this.getDir = function (file) {
        var index = -1;
        if (path.sep === '\\') {
            var index_1 = file.lastIndexOf('\\');
            var index_2 = file.lastIndexOf('/');
            index = index_1 > index_2 ? index_1 : index_2;

        } else if (path.sep === '/') {
            index = file.lastIndexOf('/');
        }
        if (index === -1) {
            return file;
        }

        var dir = file.substring(0, index);

        return dir;
    };


    return this;
}();

module.exports = Util;

/*Testing!!!
 var arr1 = [{user_id: 1}, {user_id: 2}, {user_id: 3}, {user_id: 4}];
 var arr2 = [1, 2, 3,4];
 
 var r = Util.findMissing(arr1, arr2, function (a1, a2) {
 return a1.user_id === a2;
 });
 
 
 console.log(r);
 */
/*
 var m = [0,3,3,3,3,3,3,4,3,4,1,1,0];
 Util.toSet(m);
 
 console.log(m);
 */