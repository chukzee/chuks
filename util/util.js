
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
