
var moment = require('moment');
var config = require('./config');
var bluebirdPromise = require('bluebird');
var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var moment = require('moment');
var executor = require('./task/task-executor')();
var util = require('./util')();


var sObj = {
    LONG_1970_01_01: new Date("1970-01-01").getTime(),
    PRICE_DATA_DIR: __dirname + "/price_data_history/",
    DEFAULT_DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
    DEFAULT_TIME_FORMAT: "HH:mm:ss",
    DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
    config: config,
    moment: moment,
    util: util,
    MSG_SOMETHING_WENT_WRONG: "Oops! Something went wrong.<br/>Pleas try again.",
    MSG_INVALID_AUTH_TOKEN: "Invalid authentication token!",
    MSG_NO_AUTH_TOKEN: "No token provided for authentication!",
    EXCHAGE_SOLD: "exchange_sold",
    EXCHAGE_BOUGTH: "exchange_bought",
    COUNTDOWN_OVER: "countdown_over",
    ALL_SYMBOLS: config.SPOT_SYMBOLS
            .concat(config.FUTURES_SYMBOLS)
            .concat(config.COMMODITIES_SYMBOLS)
            .concat(config.OIL_AND_GAS_SYMBOLS)
};

var priceHistory = require('./price-history')();

priceHistory.init(sObj);

var newTime = new Date('1990-01-01').getTime();

setTimeout(function () {
    for (var i = 0; i < 11000; i++) {

        var priceObj1 = {
            live: 0,
            symbol: "EUR/USD",
            price: 1.4334,
            time: newTime
        };
        var priceObj2 = {
            live: 0,
            symbol: "GBP/USD",
            price: 1.4334,
            time: newTime
        };
        newTime += 1000;
        priceHistory.add(priceObj1);
        priceHistory.add(priceObj2);
    }
    
    priceHistory.get("1hr", "EUR/USD",function(data){
        //console.log(data);
        for(var i=0; i<data.length; i++){
            console.log(new Date(data[i].time));
        }
    });
    
    console.log(JSON.stringify(priceHistory.getLastKnown()));
    
}, 1000);
