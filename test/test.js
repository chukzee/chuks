
'use strict';

process.stdout.write("Hello, World\n");
process.stdout.write("Hello, World\n");
process.stdout.write("Hello, World444444444444444444\x1b[0G");
process.stdout.write("MY Hello, World again\n");

function* gen() {
    try {
        
        console.log('before first');
        
        var n = yield first();
        
        console.log('before second');
        
        var m = yield second();
        
        console.log('before third');
        
        var l = yield third();
        
        console.log('ends');
    } catch (e) {
        console.error(e);
    }

}



var gen = gen();
gen.next();

function first(g) {
    setTimeout(function (parameters) {
        console.log('at first');
        gen.next();
    }, 5000);
}


function second() {
    setTimeout( function mySecondFunc(parameters) {
        console.log('at second');
        gen.next();
        
    }, 5000);
}
;

function third() {
    setTimeout(function (parameters) {
        console.log('at third');
        gen.next();
        gen.next();
    }, 5000);
}
;






