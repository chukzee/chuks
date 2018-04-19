
var A = {
    extend: 'A',
    sayA: function () {
        console.log(this.a);
    }
};


var B = {
    extend: 'C',
    sayB: function () {
        console.log(this.a);
    }
};


var C = {
    extend: 'D',
    sayC: function () {
        console.log(this.a);
    }
};

var D = {
    extend: 'A',
    sayD: function () {
        console.log(this.a);
    }
};

doExtend(A, A, 'A');

function doExtend(obj, e, first) {
    if (!e) {
        return;
    }
    
    for (var n in e) {
        if (!(n in obj)) {
            obj[n] = e[n];
        }
    }

    if (!e.extend || //no more extend
            e.extend === first//cyclic extend
            ) {
        return;
    }

    var eObj = toSuper(e.extend);

    if (!eObj) {
        throw new Error('Unknown class to extend - ' + e.extend);
    }

    try {
        doExtend(obj, eObj, first);
    } catch (e) {
        console.error('This error is most likely caused by a class extending itself - ', eObj.extend, e);
        //do not rethrow the error in this recursive method
    }
}

function toSuper(extend) {
    switch (extend) {
        case 'A':
            return A;
        case 'B':
            return B;
        case 'C':
            return C;
        case 'D':
            return D;
    }
}

console.log(A);