
module.exports = function () {

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

    this.length = function (v, fn) {
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

};


