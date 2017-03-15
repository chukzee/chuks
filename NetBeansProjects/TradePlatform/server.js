var fs = require('fs');

var options = {
    //pfx: fs.readFileSync('security/trade.flexc.ca.pfx'),
    //passphrase: 'furTQkwhYy3m'
    cert: fs.readFileSync('security/matadorprimeelcmarketscom.cer'),
    key: fs.readFileSync('security/matadorprimeelcmarketscom.key')
};

var express = require('express');
var app = express();
var http_app = express();
var openHoursAccRoute = express.Router();//this route place restriction when market is closed
var unverRoute = express.Router();//this route does not consider app version restriction to request and permit request even when market is closed
var _247_AccRoute = express.Router();//this route permit request even when market is closed 
var adminRoute = express.Router();
var https = require('https');
var secureHttpServer = https.Server(options, app);
var http = require('http');//use for redirecting to https
var bodyParser = require('body-parser');
var mysql = require('mysql');
var Redis = require('ioredis');
var helmet = require('helmet');
var config = require('./config');
var bluebirdPromise = require('bluebird');
var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var moment = require('moment');
var util = require('./util')();
var priceHistory = require('./price-history')();
var metrics = require('./app-metrics')();
var executor = require('./task/task-executor')(metrics);

app.use(helmet());//secure the server app from attackers - Important!

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({// to support URL-encoded bodies
    extended: true
}));

app.use(express.static(__dirname)); //define the root folder to my web resources e.g javascript files

//application level middleware
app.use(function (req, res, next) {

    //request metrics
    metrics.markRequest();// measure requests per time e.g per min, per hour and per day
    metrics.incrementRequest();

    res.on('finish', function () {
        metrics.decrementRequest();
    });

    next();
});

console.log("web root : " + __dirname);

var knex = require('knex')({
    client: config.db.provider,
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    },
    pool: {
        min: 0,
        max: 15
    },
    acquireConnectionTimeout: 15000
});

var redis = new Redis();
var lq_fs = require("fs");
var last_quote_fd = lq_fs.openSync(config.LAST_QUOTE_FILE, 'a+');//we do not want truncation if it exists so use 'a+' mode for appending - we will truncate when required

var market = {
    fs: lq_fs,
    LAST_QUOTE_FILE: config.LAST_QUOTE_FILE,
    /**
     * Unset the last quotes of the market. This method is called once when 
     * market reopens
     * 
     * @returns {undefined}
     */
    unsetLastQuotes: function () {
        this.last_saved_quotes = null;
    },
    saveLastQuotes: function () {
        var me = this;
        var readQuote = function () {
            me.fs.readFile(me.LAST_QUOTE_FILE, function (err, data) {
                if (err) {
                    return console.log(err);
                }
                if (!data) {
                    return;
                }
                try {
                    var str = data.toString().trim();
                    var q = JSON.parse(str);
                    me.last_saved_quotes = q;
                } catch (e) {
                    console.log(e);
                }
            });
        };

        var writeQuote = function () {
            var str_qoute = JSON.stringify(me.quotes);
            me.fs.truncate(config.LAST_QUOTE_FILE, 0, function (err) {
                if (err) {
                    return console.log(err);
                }
                me.fs.writeFile(config.LAST_QUOTE_FILE, str_qoute, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        };


        if (!this.last_saved_quotes) {
            if (!this.quotes) {
                readQuote();
                return;
            } else {
                writeQuote();
            }
            this.last_saved_quotes = this.quotes;
            return this.last_saved_quotes;
        }

        return this.last_saved_quotes;
    },
    getLastSavedQuotes: function (symbol) {
        if (!this.last_saved_quotes || !this.last_saved_quotes[symbol]) {
            return null;
        }
        return this.last_saved_quotes[symbol];
    },
    setQuote: function (symbol, quote) {
        if (!this.quotes) {
            this.quotes = {}; //important - NOTE NOT [] BUT {} ABEG O!!!
        }
        this.quotes[symbol] = quote;

    },
    getQuote: function (symbol) {
        if (!this.quotes || !this.quotes[symbol]) {
            return null;
        }
        return this.quotes[symbol];
    },
    getAllQuotes: function () {
        var qs = [];
        for (var n in this.quotes) {
            qs.push(this.quotes[n]);
        }
        return qs;
    }
};


var ODT_PREFIX = "ODT"; //ORDER TICKET PREFIX - NOTE: IN THE FUTURE THIS CAN BE CHANGED IF WE EXPERIENCE COLLISSION USING shortid
var EXD_PREFIX = "EXD"; //EXCHANGE ID PREFIX - NOTE: IN THE FUTURE THIS CAN BE CHANGED IF WE EXPERIENCE COLLISSION USING shortid

var sObj = {
    isMarketClosed: false,
    metrics: metrics,
    MARKET_CLOSED: "Market is closed!",
    UNSUPPORTED_VERSION: "Unsupported application version.",
    LONG_1970_01_01: new Date("1970-01-01").getTime(),
    PRICE_DATA_DIR: config.PRICE_DATA_DIR,
    EXD_PREFIX: EXD_PREFIX,
    DEFAULT_DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
    DEFAULT_TIME_FORMAT: "HH:mm:ss",
    DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
    config: config,
    redis: redis,
    db: knex,
    executor: executor,
    util: util,
    moment: moment,
    promise: bluebirdPromise,
    shortid: shortid,
    privileges: config.privileges,
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
            market.unsetLastQuotes();
        }
    },
    host: function () {
        return config.production ? config.PROD_HOST : config.DEV_HOST;
    },
    secureHttpPort: function () {
        return config.production ? config.PROD_HTTPS_PORT : config.DEV_HTTPS_PORT;
    },
    httpPort: function () {
        return config.production ? config.PROD_HTTP_PORT : config.DEV_HTTP_PORT;
    },
    FIXConfig: function () {

        var fix_conf = null;

        if (config.FIX_LIVE) {

            console.log("FIX live server selected...");

            fix_conf = config.FIX_LIVE_SETTINGS;
            fix_conf.live = true;
        } else {

            console.log("FIX demo server selected...");
            console.log("NOTE: Set FIX_LIVE to true before startup in config.js to connect to FIX live server!");

            fix_conf = config.FIX_DEMO_SETTINGS;
            fix_conf.live = false;
        }
        return fix_conf;
    },
    now: function () {
        return moment().utc().format("YYYY-MM-DD HH:mm:ss");//GMT
    },
    date: function () {
        return moment().utc().format("YYYY-MM-DD");//GMT
    },
    getUniqueExchangeId: function () {
        var d = new Date();
        return EXD_PREFIX
                + d.getDay()
                + d.getMonth()
                + new String(d.getFullYear()).substring(3)
                + shortid.generate();
    },
    getUniqueOrderTicket: function () {
        var d = new Date();
        return ODT_PREFIX
                + d.getDay()
                + d.getMonth()
                + new String(d.getFullYear()).substring(3)
                + shortid.generate();
    },
    sendSuccess: function (res, obj, override) {
        try {
            var msg = {};
            if (override) {
                msg = override;
                msg.status = "success";
                msg.success = true;
                msg.msg = obj ? obj : "Operation was successful!";// NOTE: 'msg' property is important for ExtJS Form sake
            } else {
                msg.status = "success";
                msg.success = true; // NOTE: 'success' property is important for ExtJS Form sake
                msg.msg = obj ? obj : "Operation was successful!";// NOTE: 'msg' property is important for ExtJS Form sake
            }

            res.json(msg);//send in json format
        } catch (e) {
            console.log(e);
        }

    },
    sendError: function (res, reason) {
        try {
            var msg = {
                status: "error",
                success: false, // NOTE: 'success' property is important for ExtJS Form sake
                msg: reason ? reason : "Operation failed!"// NOTE: 'msg' property is important for ExtJS Form sake
            };
            res.json(msg);//send in json format  
        } catch (e) {
            console.log(e);
        }

    },
    sendUnsupportedVersion: function (res, reason) {
        try {
            var msg = {
                status: "unsupported_version",
                success: false, // NOTE: 'success' property is important for ExtJS Form sake
                msg: reason ? reason : "Operation failed!"// NOTE: 'msg' property is important for ExtJS Form sake
            };
            res.json(msg);//send in json format  
        } catch (e) {
            console.log(e);
        }

    },
    sendIgnore: function (res, reason) {
        try {

            var msg = {
                status: "ignore",
                success: false, // NOTE: 'success' property is important for ExtJS Form sake
                msg: reason ? reason : "Operation was ignored!"// NOTE: 'msg' property is important for ExtJS Form sake
            };
            res.json(msg);//send in json format  
        } catch (e) {
            console.log(e);
        }

    },
    sendAuthFail: function (res, reason) {
        try {

            var msg = {
                status: "auth_fail",
                success: false, // NOTE: 'success' property is important for ExtJS Form sake
                msg: reason ? reason : "Operation denied due to authentication failure!"// NOTE: 'msg' property is important for ExtJS Form sake
            };
            res.json(msg);//send in json format    
        } catch (e) {
            console.log(e);
        }

    },
    pipValue: function (symbol) {
        var attr = config.SYMBOLS_ATTR[symbol];
        if (!attr) {
            return;// this can be because the symbol is not supported!
        }
        var pip_value = config.SYMBOLS_ATTR[symbol].pip_value;
        return pip_value ? pip_value : 1;
    }


    //more may go here
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
    var d = new Date(sObj.date() + " 00:00:00").getDay(); // no need to use getUTCDay() since sObj.date() uses utc
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


//--- initialize price history
priceHistory.init(sObj);

//------ server app built-in module

//----- emailer
var emailer = require('./emailer')(sObj);

//----require exchange-post module
var exchangePost = require('./exchange/exchange-post');
exchangePost.init(sObj, market);

//----- require module for realtime communication
var persistSock = require('./persist-sock')(secureHttpServer, sObj, exchangePost, market, priceHistory, emailer); //just requre and pass parameter

//check and create store procedures
var storeProc = require('./operations/stored-procedures')(sObj);

//do daily rebate
var liveRebate = require('./operations/live-rebate')(sObj);
liveRebate.doDailyRebate();

//----require other module
var accountManager = require('./account/account-manager')(sObj);
var exchangeQuery = require('./exchange/exchange-query')(sObj);
var openPositions = require('./trades/trades-open')(sObj, market);
var tradesPending = require('./trades/trades-pending')(sObj, market);
var accountHistory = require('./trades/account-history')(sObj);
var exchangeBuyer = require('./exchange/exchange-buyer')(sObj);
var usersManager = require('./manager/users-manager')(sObj, emailer);
var deleteOp = require('./operations/delete-op')(sObj);
var search = require('./operations/search')(sObj);


exchangeBuyer.setMarket(market);

var validateLimit = function (input) {
    if (!isNaN(input.start)) {
        input.start = input.start - 0;//implicitly convert to  numeric
    }
    if (!isNaN(input.limit)) {
        input.limit = input.limit - 0;//implicitly convert to  numeric
    }
    if (input.start < 0) {//prevent ExtJS from sending such invalid param
        input.start = 0;
    }
    if (input.limit < 0) {//prevent ExtJS from sending such invalid param
        input.limit = 1;
    }

};

//-------set JSON WEB TOKEN (JWT) secret key
app.set('appSecret', config.jwtSecret); // secret gotten from the config file
app.set('appSecret', config.jwtAdminSecret); // secret gotten from the config file

usersManager.setJWT(jwt);
usersManager.setSecret(app.get('appSecret'));
usersManager.setAdminSecret(app.get('adminSecret'));

//------route for user registration -------------
app.route('/register')
        .post(function (req, res) {
            usersManager.register(req.body, res);
        });

//------route for login--------------------------
app.route('/login')
        .post(function (req, res) {
            usersManager.login(req.body, res);
        });

//-------market watch----------------------------
app.route('/market_watch')
        .post(function (req, res) {
            sObj.sendSuccess(res, "Success", {table: market.getAllQuotes()});
        });

//-------price timeframe----------------------------
app.route('/price_timeframe')
        .post(function (req, res) {
            var input = req.body;
            var prices = priceHistory.get(input.timeframe, input.symbol);
            if (prices !== null) {
                sObj.sendSuccess(res, "Success", {timeframe: input.timeframe, symbol: input.symbol, data: prices});
            } else {
                res.end();
            }
        });


//-------last know price quotes ----------------------------
app.route('/prices_last_known')
        .post(function (req, res) {
            sObj.sendSuccess(res, "Success", {data: priceHistory.getLastKnown()});
        });

//-----------------------forgot password----------------------------------

app.route('/forgot_password')
        .post(function (req, res) {
            usersManager.forgotPassword(req.body, res);
        });


//set this router base url  ------------------------
app.use('/access', openHoursAccRoute);

//set this router base url  ------------------------
app.use('/access_247', _247_AccRoute);


//set this router base url  ------------------------
app.use('/unver', unverRoute);

//set this router base url  ------------------------
app.use('/admin', adminRoute);


// route middleware that will happen on every request on this route instance
unverRoute.use(function (req, res, next) {
    //NOTE: Version check will not be do here on this route and permit request even when market is closed 
    usersManager.authTrader(req, res, next); // authenticate the request of trader
});

// route middleware that will happen on every request on this route instance
_247_AccRoute.use(function (req, res, next) {
    //This route will permit request even when market is closed
    if (req.body.version !== config.VERSION) {
        sObj.sendUnsupportedVersion(res, sObj.UNSUPPORTED_VERSION);
        return;
    }

    usersManager.authTrader(req, res, next); // authenticate the request of trader
});


// route middleware that will happen on every request on this route instance
openHoursAccRoute.use(function (req, res, next) {
    if (req.body.version !== config.VERSION) {
        sObj.sendUnsupportedVersion(res, sObj.UNSUPPORTED_VERSION);
        return;
    }
    if (config.HONOUR_MARKET_CLOSED && sObj.isMarketClosed) {
        sObj.sendError(res, sObj.MARKET_CLOSED);
        return;
    }
    usersManager.authTrader(req, res, next); // authenticate the request of trader
});

// route middleware that will happen on every request on this route instance
adminRoute.use(function (req, res, next) {
    /*UNCOMMENT LATER - for now this is commented out, but should be uncommented later when we are ready to include this feature for admin
     * if (req.body.version !== config.VERSION) {
     sObj.sendUnsupportedVersion(res, sObj.UNSUPPORTED_VERSION);
     return;
     }
     */

    next();//REMIND: COMMENT OUT WHEN LINE BELOW IS FULLY IMPLEMENTED AND FUNCTIONAL
    //usersManager.authAdmin(req, res, next); //REMIND: UNCOMMENT WHEN THIS LINE FULLY IMPLEMENTED AND FUNCTIONAL
});

//-----------------------server time------------------------------------------

_247_AccRoute.post('/time', function (req, res) {
    sObj.sendSuccess(res, "Success", {time: new Date().getTime()});//important! DO NOT SEND sObj.now() - let the client convert to utc itself - abeg o!!!
});

//-----------------------basic start up info----------------------------------

unverRoute.post('/startup', function (req, res) {
    usersManager.startUpInfo(req.user, res);
});


//-----------------------account info----------------------------------

_247_AccRoute.post('/account_info', function (req, res) {
    accountManager.accountInfo(req.user, res);
});


//-----------------------create exchange----------------------------------

openHoursAccRoute.post('/create/spot_forex', function (req, res) {
    exchangePost.spotForex(req.user, req.body, res);
});

openHoursAccRoute.post('/create/digital_call', function (req, res) {
    exchangePost.digitalCall(req.user, req.body, res);
});

openHoursAccRoute.post('/create/digital_put', function (req, res) {
    exchangePost.digitalPut(req.user, req.body, res);
});

openHoursAccRoute.post('/create/no_touch', function (req, res) {
    exchangePost.noTouch(req.user, req.body, res);
});

openHoursAccRoute.post('/create/one_touch', function (req, res) {
    exchangePost.oneTouch(req.user, req.body, res);
});

openHoursAccRoute.post('/create/double_no_touch', function (req, res) {
    exchangePost.doubleNoTouch(req.user, req.body, res);
});

openHoursAccRoute.post('/create/double_one_touch', function (req, res) {
    exchangePost.doubleOneTouch(req.user, req.body, res);
});

openHoursAccRoute.post('/create/range_in', function (req, res) {
    exchangePost.rangeIn(req.user, req.body, res);
});

openHoursAccRoute.post('/create/range_out', function (req, res) {
    exchangePost.rangeOut(req.user, req.body, res);
});

//-------------------query exchange-------------------------

_247_AccRoute.post('/query/general/options_exchange', function (req, res) {
    validateLimit(req.body);
    exchangeQuery.optionsExchange(req.user, req.body, res);
});


_247_AccRoute.post('/query/general/spotfx_exchange', function (req, res) {
    validateLimit(req.body);
    exchangeQuery.spotFxExchange(req.user, req.body, res);
});


_247_AccRoute.post('/query/personal/options_exchange', function (req, res) {
    validateLimit(req.body);
    exchangeQuery.userOptionsExchange(req.user, req.body, res);
});


_247_AccRoute.post('/query/personal/spotfx_exchange', function (req, res) {
    validateLimit(req.body);
    exchangeQuery.userSpotFxExchange(req.user, req.body, res);
});


//-------------------query open trades-----------------------------------

_247_AccRoute.post('/query/open/spotfx', function (req, res) {
    validateLimit(req.body);
    openPositions.spotFxPositions(req.user, req.body, res);
});

_247_AccRoute.post('/query/open/options', function (req, res) {
    validateLimit(req.body);
    openPositions.optionsPositions(req.user, req.body, res);
});


//-------------------query trending orders-----------------------------------

_247_AccRoute.post('/query/pending/spotfx', function (req, res) {
    validateLimit(req.body);
    tradesPending.spotFxPending(req.user, req.body, res);
});

_247_AccRoute.post('/query/pending/options', function (req, res) {
    validateLimit(req.body);
    tradesPending.optionsPending(req.user, req.body, res);
});

//----------------------query history trades-----------------------------

_247_AccRoute.post('/query/history/spotfx', function (req, res) {
    validateLimit(req.body);
    accountHistory.spotFxHistory(req.user, req.body, res);
});

_247_AccRoute.post('/query/history/options', function (req, res) {
    validateLimit(req.body);
    accountHistory.optionsHistory(req.user, req.body, res);
});

_247_AccRoute.post('/query/history/deposits_and_withdrawals', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = false;

    search.depositsAndWithdrawals(req.user, req.body, res);

});


//---------------------exchange buyer---------------------------------

openHoursAccRoute.post('/buy/exchange/spotfx', function (req, res) {
    exchangeBuyer.buySpotFx(req.user, req.body, res);
});

openHoursAccRoute.post('/buy/exchange/options', function (req, res) {
    exchangeBuyer.buyOptions(req.user, req.body, res);
});


//---------------------delete exchange-----------------------------

openHoursAccRoute.post('/delete/exchange/spotfx', function (req, res) {
    deleteOp.deleteExchangeSpotFx(req.user, req.body, res);
});

openHoursAccRoute.post('/delete/exchange/options', function (req, res) {
    deleteOp.deleteExchangeOptions(req.user, req.body, res);
});

//---------------------delete history trades-----------------------------

openHoursAccRoute.post('/delete/history/spotfx', function (req, res) {
    deleteOp.deleteHistorySpotFx(req.user, req.body, res);
});

openHoursAccRoute.post('/delete/history/options', function (req, res) {
    deleteOp.deleteHistoryOptions(req.user, req.body, res);
});

//----------------- refresh countdown to get countdown remaining -----------------------------


_247_AccRoute.post('/refresh/countdown', function (req, res) {
    exchangeBuyer.refreshCountdown(req.user, req.body, res);
});

//-----------------------fund trader's account----------------------------------

/*adminRoute.post('/account/fund', function (req, res) {
 accountManager.fundAccount(req.user, req.body, res);
 });*/

adminRoute.post('/account/fund', function (req, res) {
    req.body.isAdmin = true;
    accountManager.fundAccount(req.user, req.body, res);
});

//-----------------------withdraw fund from trader's account----------------------------------

openHoursAccRoute.post('/account/withdraw', function (req, res) {//here the trader does the withdrawal himself
    req.body.isAdmin = false;
    accountManager.withdrawFund(req.user, req.body, res);
});

adminRoute.post('/account/withdraw', function (req, res) {//here the admin does the withdrawal for the trader
    req.body.isAdmin = true;
    accountManager.tryGetUser(req.body.username, function (user) {
        accountManager.withdrawFund(user, req.body, res);
    }, function () {
        res.end();
    });

});


//-----------------------admin set withdrawal payment method for trader----------------------------------

adminRoute.post('/account/withdrawal/payment_method', function (req, res) {
    req.body.isAdmin = true;
    accountManager.withdrawalPaymentMethod(req.body, res);
});

//-----------------------search data----------------------------------

adminRoute.post('/search/demo_traders', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = true;
    search.demoTraders(req.user, req.body, res);
});

adminRoute.post('/search/live_traders', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = true;
    search.liveTraders(req.user, req.body, res);
});

adminRoute.post('/search/withdrawals', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = true;
    search.withdrawals(req.user, req.body, res);
});

adminRoute.post('/search/fundings', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = true;
    search.fundings(req.user, req.body, res);
});

adminRoute.post('/search/withdrawals_and_fundings', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = true;
    search.depositsAndWithdrawals(req.user, req.body, res);
});

adminRoute.post('/search/rebate', function (req, res) {
    validateLimit(req.body);
    req.body.isAdmin = true;
    search.rebate(req.user, req.body, res);
});



//------------user basic info--------------------------
adminRoute.post('/user_basic_info', function (req, res) {
    usersManager.getUserByAdmin(req.user, req.body, res);
});


//------------admin retrieve trader account--------------------------
adminRoute.post('/admin_query/open/spotfx', function (req, res) {
    validateLimit(req.body);
    var user = {username: req.body.username, exchangeId: req.body.exchange_id};
    openPositions.spotFxPositions(user, req.body, res);
});

adminRoute.post('/admin_query/open/options', function (req, res) {
    validateLimit(req.body);
    var user = {username: req.body.username, exchangeId: req.body.exchange_id};
    openPositions.optionsPositions(user, req.body, res);
});

adminRoute.post('/admin_query/history/spotfx', function (req, res) {
    validateLimit(req.body);
    var user = {username: req.body.username, exchangeId: req.body.exchange_id};
    accountHistory.spotFxHistory(user, req.body, res);
});

adminRoute.post('/admin_query/history/options', function (req, res) {
    validateLimit(req.body);
    var user = {username: req.body.username, exchangeId: req.body.exchange_id};
    accountHistory.optionsHistory(user, req.body, res);
});

adminRoute.post('/admin_query/history/deposits_and_withdrawals', function (req, res) {
    validateLimit(req.body);
    var user = {username: req.body.username, exchangeId: req.body.exchange_id};
    req.body.isSingleUserQuery = true;
    search.depositsAndWithdrawals(user, req.body, res);
});

//-----------------------admin request trader account info----------------------------------
adminRoute.post('/admin_request_trader_account_info', function (req, res) {
    var user = {username: req.body.username, live: req.body.live};
    accountManager.accountInfo(user, res);
});


//-----------------------rebate----------------------------------
adminRoute.post('/admin_query/history_rebate', function (req, res) {
    validateLimit(req.body);
    liveRebate.historyRebate(req.body, res);
});

adminRoute.post('/admin_query/current_rebate', function (req, res) {
    liveRebate.currentRebate(req.body, res);
});


//--------------------------------------------------------------------

//----------create http server to redirect to https -------------------
var httpServer = http.createServer(function (req, res) {
    //var req_host = req.headers['host'];//no need anyway
    res.writeHead(301, {"Location": "https://" + sObj.host() + req.url});
    res.end();
});

//-----Route for web client resources to server web pages

app.get('/*', function (req, res) {

    var reqFile = '/index.html'; //default
    if (req.path !== '/') {
        reqFile = decodeURIComponent(req.path);// decodeURIComponent() will be prefered to decodeURI() because it decodes URI special markers such as &, ?, #, etc while decodeURI() does not
    }

    //console.log(reqFile);//UNCOMMENT TO SEE THE PATHS

    var filename = __dirname + '/client/' + reqFile;
    res.sendFile(filename, function (err) {
        if (err) {
            if ((err + "").startsWith("Error: ENOENT: no such file or directory")) {
                res.status(404)
                        .send("<html>" +
                                "<head>" +
                                "<title>Not Found</title>" +
                                "</head>" +
                                "<body>" +
                                "<h1>Oops! Not Found.</h1>" +
                                "<div style='font-size: 18px; font-family: Times New Roman;'>" +
                                "Sorry, the file you are seeking for does not exist in the remote server." +
                                "</div>" +
                                "<div style='font-size: 14px; font-family: Times New Roman;'>" +
                                "- " + reqFile +
                                "</div>" +
                                "</body>" +
                                "</html>");

            }
        }
    });
});


//listen for https connections
secureHttpServer.listen(sObj.secureHttpPort(), sObj.host(), function () {
    console.log('listening on :' + sObj.host() + ":" + sObj.secureHttpPort());
});

//listen for http connections
httpServer.listen(sObj.httpPort(), sObj.host(), function () {
    console.log('listening on :' + sObj.host() + ":" + sObj.httpPort());
});

var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

rl.on('line', function (line) {
    if (line === "exit" || line === "quit") {
        //process.exitCode = 1;
        console.log("program terminates!");
        process.exit(0);
    }
    console.log(line);
});
