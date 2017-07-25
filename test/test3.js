/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function run(n){
    console.log(n);
    setTimeout(function(){
        console.log(n);
    }, 1000);
}


run(1);
run(2);
run(3);
run(4);
run(5);

console.log('------------------');

var n = [];
n.push("a");
n.push("b");
n.push("c");
n.push("d");
n.push("e");
var b = n.unshift('z', 'v');

console.log('n ',n);
console.log('b ',b);

console.log('------------------TESTING BINARY OR-----------------');

var obj ={
    fade: true
};

var n = obj.fadein || obj.fade;

console.log('n  = ', n);