

var c1 = function () {
    this.b = 5;
    this.last = 0;
    this.add = function (a, b) {
        return this.last = a + b;
    };
    this.mult = function (a, b) {
        return this.last = a * b;
    };
};

var c2 = new function () {

    c1.call(this);


    this.solve = function () {
        return this.solution();
    };

    this.solution = function () {
        return this.add(2, 4);
    };

};


var c3 = new function () {

    c1.call(this);

    this.solve = function () {
        return this.solution();
    };

    this.solution = function () {
        return this.add(5, 4);
    };

    //return this;
};


// subclass extends superclass
//c2.prototype = Object.create(c1.prototype);
//c2.prototype.constructor = c2;

//var cObj = new c2();

//console.log(c2.add(2,3) + c2.b);
//console.log(c2.mult(2,3));
console.log("---------------");
console.log(c2.solve(3, 4));
console.log(c2.last);
console.log(c3.last);
console.log("---------------");
console.log(c3.solve(6, 7));
console.log(c2.last);
console.log(c3.last);


var obj = {
    "a": 1,
    "b": 2,
    "c": 3,
    "d": 4
};


obj.c = null;
obj.d = null;

console.log(obj);

delete obj.c;
delete obj.d;

console.log(obj);
console.log(obj.c);
var t = {};
if(t){
    console.log("yes");
}
var ob = {};
var i = 0;
for (i = 0; i < 4000000; i++) {
    var o = {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "last": i
    };
    var p = i + "pro";
    ob[p] = o;
    if (i > 1000000) {
        delete ob[p];
    }
}

console.log("done");
console.log(ob[1+"pro"]);

