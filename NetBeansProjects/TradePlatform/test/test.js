
var moment = require('moment');

var toSymbolPrecision = function (price, symbol) {
    var len = symbol.length;
    var sIndex = 0;//e.g JPY/AUD - where JPY is the base currency
    var eIndex = len - 3;//e.g USD/JPY, USDJPY - where JPY is not the base currency

    var indexOfJPY = symbol.indexOf("JPY");
    var precision = 4;
    if (indexOfJPY === sIndex || indexOfJPY === eIndex) {
        precision = 2;
    }

    price = price - 0;//important! implicitly convert to numeric.
    price = price.toFixed(precision);
    price = price - 0;//again important! implicitly convert to numeric.
    return price;
};

var reverseSellerProduct = function (product) {

    var partTM1 = product.substring(0, product.length - 5);
    var partTM2 = product.substring(product.length - 5);
    var prod = "";
    if (partTM2 === "(ATM)") {
        if (partTM1 === "DIGITAL CALL ") {
            prod = "DIGITAL PUT " + partTM2;
        } else if (partTM1 === "DIGITAL PUT ") {
            prod = "DIGITAL CALL " + partTM2;
        }

    } else if (partTM2 === "(ITM)") {
        prod = partTM1 + " (OTM)";
    } else if (partTM2 === "(OTM)") {
        prod = partTM1 + " (ITM)";
    }

    //e.g ONE TOUCH (UP)
    var partUP1 = product.substring(0, product.length - 4);
    var partUP2 = product.substring(product.length - 4);

    if (partUP2 === "(UP)") {
        if (partUP1 === "ONE TOUCH ") {
            prod = "NO TOUCH " + partUP2;
        } else if (partUP1 === "NO TOUCH ") {
            prod = "ONE TOUCH " + partUP2;
        }
    }

    //e.g ONE TOUCH (DOWN)
    var partDOWN1 = product.substring(0, product.length - 6);
    var partDOWN2 = product.substring(product.length - 6);

    if (partDOWN2 === "(DOWN)") {
        if (partDOWN1 === "ONE TOUCH ") {
            prod = "NO TOUCH " + partDOWN2;
        } else if (partDOWN1 === "NO TOUCH ") {
            prod = "ONE TOUCH " + partDOWN2;
        }
    }

    if (product === "DOUBLE ONE TOUCH") {
        prod = "DOUBLE NO TOUCH";
    } else if (product === "DOUBLE NO TOUCH") {
        prod = "DOUBLE ONE TOUCH";
    } else if (product === "RANGE IN") {
        prod = "RANGE OUT";
    } else if (product === "RANGE OUT") {
        prod = "RANGE IN";
    }

    return prod;
};

console.log(toSymbolPrecision("23.123499999999", "USD/JPY"));

var add = function () {
    var counter = 0;
    return function () {
        return counter += 1;
    }
}();

add();
add();
add();

console.log(add());

console.log(moment().utc().toString());

console.log(new Date(moment().utc()).getTime() - new Date().getTime());

var expirySeconds = (new Date("2016-11-11 11:10:10").getTime() - new Date("2016-11-11 10:10:10").getTime()) / 1000;

console.log(expirySeconds);
console.log(moment().utc().add(3, "days").format("YYYY-MM-DD HH:mm:ss"));

console.log("reverseSellerProduct "+reverseSellerProduct("RANGE OUT"));

var sO = {
    now: moment().utc().format("YYYY-MM-DD HH:mm:ss"),//GMT
    nowFunc: function(){
        return moment().utc().format("YYYY-MM-DD HH:mm:ss");//GMT
    }
};


console.log("test invalid          = "+new Date('sO.now').getTime());
console.log("1969-01-01          = "+new Date('1969-01-01').getTime());
console.log("1970-01-01          = "+new Date('1970-01-01').getTime());
console.log("01-01-1970          = "+new Date('01-01-1970').getTime());
console.log("is same          = "+(new Date('01-01-1970').getTime() === new Date('1970-01-01').getTime()));
var a =["a1","a2","a3"];
var b =["b1","b2","b3"];
var c =["c1","c2","c3"];
var s = {
    syb:a.concat(b).concat(c)
};

console.log(s.syb);

/*for(var i=0; i< 3000; i+=30){
    console.log(i%233);
}*/

console.log(a);
var d = a;
d.shift();
d.shift();
console.log(a);
console.log(d);

var m ="           \
        add         \
        cdd          \
        ";

console.log(m);


console.log((new Date('1900-01-01 03:00:00').getTime() - new Date('1900-01-01 02:00:00').getTime())/1000);

console.log('----------------------');

console.log(moment(new Date(new Date(moment().utc().format("YYYY-MM-DD HH:mm:ss")).getTime())).format("YYYY-MM-DD"));

console.log(moment(new Date(new Date(moment().utc().format("YYYY-MM-DD HH:mm:ss")).getTime() - 24*3600*1000)).format("YYYY-MM-DD"));

console.log(new Date().getDay());

console.log("----now----");

console.log(moment(new Date(moment().utc().format("YYYY-MM-DD HH:mm:ss")).getTime()).format("YYYY-MM-DD HH:mm:ss"));


