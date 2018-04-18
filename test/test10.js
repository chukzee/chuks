
var A = {
    extend: ['B', 'M1'],
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


var M1 = {
    extend: 'M2',
    sayM1: function () {
        console.log(this.a);
    }
};

var M2 = {
    extend: 'M3',
    sayM2: function () {
        console.log(this.a);
    }
};


var M3 = {
    extend: 'M2',
    sayM3: function () {
        console.log(this.a);
    }
};

//doExtend(A, B, 'A');
clsExtend(A, 'A');

function clsExtend(obj, first){
    if(!obj.extend){
        return;
    }
    var exts =  obj.extend.constructor === Array ? obj.extend : [obj.extend];
    for(var i=0; i<exts.length; i++){
        exts[i] = toSuper(exts[i]);
    }
    for(var i=0; i<exts.length; i++){
        doExtend(obj, exts, first);
    }
    
    return obj;
}
// BIG COME BACK!!!!!!!

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
     
    /*OLD
    if (!eObj) {
        throw new Error('Unknown class to extend - ' + e.extend);
    }

    try {
        doExtend(obj, eObj, first);
    } catch (e) {
        console.error('This error is most likely caused by a class extending itself - ', eObj.extend, e);
        //do not rethrow the error in this recursive method
    }*/
    
    try {//NEW
        clsExtend(obj, first);
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
        case 'M1':
            return M1;
        case 'M2':
            return M2;
        case 'M3':
            return M3;
    }
}

console.log(A);