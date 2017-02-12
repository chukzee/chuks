
'use strict';


setTimeout(function (parameters) {
    //wait 
    console.log('waiting');
}, 30000);

function* gen() {
    console.log('begin');

    console.log('before first');

    var n = yield first();

    console.log('before second');

    var m = yield second();

    console.log('before third');

    var l = yield third();

    console.log('ends');
}



var gen = gen();
gen.next();

function first() {
    setTimeout(function (parameters) {
        console.log('at first');
        gen.next();
    }, 500);
}


function second() {
    setTimeout(function (parameters) {
        console.log('at second');
        gen.next();
    }, 500);
}
;

function third() {
    setTimeout(function (parameters) {
        console.log('at third');
        gen.next();
        gen.next();
    }, 500);
}
;






