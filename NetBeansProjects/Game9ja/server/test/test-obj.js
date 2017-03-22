

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


var FROM_SQUARE_MASK = 127;// 0 - 127 with max 127
var TO_SQUARE_MASK = 127;// 0 - 127 with max 127 

var FROM_SQUARE_SHIFT = 0;
var TO_SQUARE_SHIFT = FROM_SQUARE_SHIFT + 7;
var h = 5;
var mk = h << TO_SQUARE_SHIFT;

var g = (mk >> TO_SQUARE_SHIFT)
        & TO_SQUARE_MASK; 


console.log("------shift-----");

console.log(g);


console.log("------col-----");

for(var i=0; i<100; i++)
console.log(i%10);