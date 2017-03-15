
var moment = require('moment');
var config = require('./../config');
var metrics = require('./../app-metrics')();
var executor = require('./../task/task-executor')(metrics);


var sObj = {
    isMarketClosed: false,
    metrics: metrics,
    MARKET_CLOSED: "Market is closed!",
    UNSUPPORTED_VERSION: "Unsupported application version.",
    LONG_1970_01_01: new Date("1970-01-01").getTime(),
    PRICE_DATA_DIR: config.PRICE_DATA_DIR,
    DEFAULT_DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
    DEFAULT_TIME_FORMAT: "HH:mm:ss",
    DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
    executor: executor,
    MSG_SOMETHING_WENT_WRONG: "Oops! Something went wrong.<br/>Pleas try again.",
    MSG_INVALID_AUTH_TOKEN: "Invalid authentication token!",
    MSG_NO_AUTH_TOKEN: "No token provided for authentication!",
    EXCHAGE_SOLD: "exchange_sold",
    EXCHAGE_BOUGTH: "exchange_bought",
    COUNTDOWN_OVER: "countdown_over",
    ACCOUNT_MODIFIED: "account_modified",
    ALL_SYMBOLS: config.SPOT_SYMBOLS
            .concat(config.FUTURES_SYMBOLS)
            .concat(config.COMMODITIES_SYMBOLS)
            .concat(config.OIL_AND_GAS_SYMBOLS),
    setMarketClosed: function (closed) {
        this.isMarketClosed = closed;
        if (!closed) {//where market is open
            //market.unsetLastQuotes();
        }
    },
    now: function () {
        return moment().utc().format("YYYY-MM-DD HH:mm:ss");//GMT
    },
    date: function () {
        return moment().utc().format("YYYY-MM-DD");//GMT
    }
};


//Set reminder for dishonourned market closed hours
if (!config.HONOUR_MARKET_CLOSED) {
    sObj.executor.schedule(
            {
                fn: function () {
                    console.log('REMIND!!! Market closed hours is not honoured! Consider honouring it.');
                },
                value: 20,
                unit: sObj.executor.SECONDS,
                begin_time: new Date().getTime() + 2 * 1000
            }
    );
}

var marketActivationTask = function () {
    var d = new Date(sObj.date()).getDay(); // no need to use getUTCDay() since sObj.date() uses utc
    if (d === 5 || d === 6) {
        sObj.isMarketClosed = true;//close market
        console.log("Market is closed! Day " + d);
    } else {
        sObj.isMarketClosed = false;//open market
        console.log("Market is open. Day " + d);
    }
};

//chect if market is open and creat task for closing and opening the market.
(function () {
    var d = new Date(sObj.date() + " 00:00:00").getDay(); // no need to use getUTCDay() since sObj.date() uses utc

    console.log(new Date().getTimezoneOffset());
    console.log(sObj.date());
    console.log(new Date(sObj.date() + " 00:00:00"));
    console.log("day ", d);
    
    var hours_away = 22 * 3600 * 1000;
    var startTime = new Date(sObj.date() + " 00:00:00").getTime() + hours_away;

    var nowTime = new Date().getTime();


    if (d === 6) {//obviously saturday
        sObj.setMarketClosed(true);//closed on saturdays       
        console.log("Market is closed! Day " + d);
    } else if (d === 5 && nowTime < startTime) {
        sObj.setMarketClosed(false);//open on friday at this time
        console.log("Market is open. Day " + d);
    } else if (d === 5 && nowTime >= startTime) {
        sObj.setMarketClosed(true);//closed on friday at this time
        console.log("Market is closed! Day " + d);
    } else if (d === 0 && nowTime < startTime) {
        sObj.setMarketClosed(true);//closed on sunday at this time
        console.log("Market is closed! Day " + d);
    } else if (d === 0 && nowTime >= startTime) {
        sObj.setMarketClosed(false);//open on sunday at this time
        console.log("Market is open. Day " + d);
    } else {
        sObj.setMarketClosed(false);//open on week days
        console.log("Market is open. Day " + d);
    }


    //now schedule a 24-hour task for rebate - run at the start of the day
    sObj.executor.schedule(
            {
                fn: marketActivationTask,
                value: 1,
                unit: sObj.executor.DAYS,
                begin_time: startTime
            }
    );

}());

