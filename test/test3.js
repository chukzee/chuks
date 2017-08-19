/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function run(n) {
    console.log(n);
    setTimeout(function () {
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

console.log('n ', n);
console.log('b ', b);

console.log('------------------TESTING BINARY OR-----------------');

var obj = {
    fade: true
};

var n = obj.fadein || obj.fade;

console.log('n  = ', n);

console.log('------------------TESTING OBJECT-----------------');

var window = window || {};
var appNamespace = "Ns";
window[appNamespace] = {};

var file = "a/b/c/d";
var ps = file.split('/');

var cObj = window[appNamespace];

for (var i = 0; i < ps.length - 1; i++) {//yes 'i < ps.length-1' - skipping the file name  
    var p = ps[i];
    cObj[p] = {};
    cObj = cObj[p];
}
console.log(window);
var app_scripts = ['a', 'b', 'c'];
var cat_scripts = ['1', '2', '3'];
var files = app_scripts.concat(cat_scripts);

console.log(files);
var _nsFiles = [];
var file = 'path/to/long/Filename.js';
var dot_index = file.indexOf('.');
if (dot_index > -1) {
    file = file.substring(0, dot_index);
}
_nsFiles.push(file);
console.log(file);