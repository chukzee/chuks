

var a = {};
a.n = "a";

var b = {};
b.n = "b";

var m = a;
m = b;
m.n = "c";
m = a;
console.log(a);
console.log(b);
console.log(m);
