
var n = [];
var m = {};

if (!n) {
    console.log(n);
}
if (!m) {
    console.log(m);
}


console.log(2%2);
//[[], [], [], []]
var n = Array(4);
n.fill([]);
//var n = [[], [], [], []];
console.log(n);
n[0].push(3);
n[2].push(7);
n[2].push(7);
n[3].push(5);
console.log(n);
