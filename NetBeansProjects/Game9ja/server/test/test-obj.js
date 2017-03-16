

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

var g = [11, 22, 33, 44, 55, 66, 77];

console.log("---------------------");

console.log(g, "-------", g.length);


console.log("------afer delete-----");
g.splice(1, 1);
console.log(g, "-------", g.length);
