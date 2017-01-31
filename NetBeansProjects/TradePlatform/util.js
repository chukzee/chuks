
var util = function () {

    this.isPriceMethod = function (method) {
        return method.toLowerCase().indexOf('price') === 0;
    };
    this.isTimeMethod = function (method) {
        return method.toLowerCase().indexOf('time') === 0;
    };
    this.startsWith = function (str, match) {
        return str.indexOf(match) === 0;
    };

    /*this.endsWith = function(str, match){
     if(match.length> str.length){
     return fals;
     }
     
     //NOT FINISH - COME BACK
     
     
     };*/

    this.countdownID = function (suffix) {
        return "countdown:" + suffix;
    };


    this.reverseDirection = function (direction) {
        return direction === "BUY" ? "SELL" : "BUY";
    };

    this.validateStopLossPips = function (stop_loss, direction) {
        direction = direction.toLowerCase();
        stop_loss = Math.abs(stop_loss);
        if (direction === "buy") {
            stop_loss = -stop_loss; // negate
        }
        return stop_loss;
    };

    this.validateTakeProfitPips = function (take_profit, direction) {
        direction = direction.toLowerCase();
        take_profit = Math.abs(take_profit);
        if (direction === "sell") {
            take_profit = -take_profit; // negate
        }
        return take_profit;
    };


    this.isGoldOrSilver = function (symbol) {
        return symbol === "XAUUSD"
                || symbol === "XAU/USD"
                || symbol === "XAGUSD"
                || symbol === "XAG/USD";
    };

    this.modPips = function(symbol, price1,  price2){
        //check for JPY pair which are three digits.
        //check the JPY index in the symbol
        var len = symbol.length;
        var sIndex = 0;//e.g JPY/AUD - where JPY is the base currency
        var eIndex = len - 3;//e.g USD/JPY, USDJPY - where JPY is not the base currency

        var point = 0.0001; // yes 4 but is actually 5 digits some how
        var indexOfJPY = symbol.indexOf("JPY");
        if (indexOfJPY === sIndex || indexOfJPY === eIndex || this.isGoldOrSilver(symbol)) {
            point = 0.01;// yes 2 but is actually 3 digits some how
        }

        var pips = (price1 - price2) / point;


        return Math.abs(pips);
    };

    this.addPipsPrice = function (symbol, price, pips) {
        //check for JPY pair which are three digits.
        //check the JPY index in the symbol
        var len = symbol.length;
        var sIndex = 0;//e.g JPY/AUD - where JPY is the base currency
        var eIndex = len - 3;//e.g USD/JPY, USDJPY - where JPY is not the base currency

        pips = pips - 0;//implicitly convert to numeric

        var point = 0.0001; // yes 4 but is actually 5 digits some how
        var precision = 5;
        var indexOfJPY = symbol.indexOf("JPY");
        if (indexOfJPY === sIndex || indexOfJPY === eIndex || this.isGoldOrSilver(symbol)) {
            point = 0.01;// yes 2 but is actually 3 digits some how
            precision = 3;
        }

        var pip_point = pips * point;
        var new_price = price + pip_point;

        new_price = new_price - 0;//important! implicitly convert to numeric.
        new_price = new_price.toFixed(precision);
        new_price = new_price - 0;//again important! implicitly convert to numeric.


        return new_price;
    };

    this.reverseProduct = function (product) {
        if (!product) {
            return product;// most likely spotfx will be undefined.
        }
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
            //prod = partTM1 + " (OTM)";// OLD

            //NEW START
            if (partTM1 === "DIGITAL CALL ") {
                prod = "DIGITAL PUT (OTM)";
            } else if (partTM1 === "DIGITAL PUT ") {
                prod = "DIGITAL CALL (OTM)";
            }
            //NEW END

        } else if (partTM2 === "(OTM)") {
            //prod = partTM1 + " (ITM)";// OLD

            //NEW START
            if (partTM1 === "DIGITAL CALL ") {
                prod = "DIGITAL PUT (ITM)";
            } else if (partTM1 === "DIGITAL PUT ") {
                prod = "DIGITAL CALL (ITM)";
            }
            //NEW END
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
    //REMOVE (ITM) (OTM) (ATM) (UP) (DOWN) from the name
    this.plainProductName = function (name) {
        if (!name) {
            return name;
        }
        var index = name.indexOf("(ITM)");
        if (index === -1) {
            index = name.indexOf("(OTM)");
        }
        if (index === -1) {
            index = name.indexOf("(ATM)");
        }
        if (index === -1) {
            index = name.indexOf("(UP)");
        }
        if (index === -1) {
            index = name.indexOf("(DOWN)");
        }

        if (index > -1) {
            name = name.substring(0, index);
        }

        name = name.trim();//remove white space
        return name;
    };

    return this;
};

module.exports = util;
