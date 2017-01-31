var fs = require('fs');

var options = {
    //pfx: fs.readFileSync('security/trade.flexc.ca.pfx'),
    //passphrase: 'furTQkwhYy3m'	
    cert: fs.readFileSync('security/mapelcmarketscom.cer'),
    key: fs.readFileSync('security/mapelcmarketscom.key')
};


var express = require('express');
var app = express();
var accRoute = express.Router();
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
var executor = require('./task/task-executor')();

app.use(helmet());//secure the server app from attackers - Important!

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({// to support URL-encoded bodies
    extended: true
}));

app.use(express.static(__dirname)); //define the root folder to my web resources e.g javascript files

console.log("web root : " + __dirname);

var knex = require('knex')({
    client: config.db.provider,
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    }
});

var knexReq = require('knex');

var redis = new Redis();


util = require('./util');

var ODT_PREFIX = "ODT"; //ORDER TICKET PREFIX - NOTE: IN THE FUTURE THIS CAN BE CHANGED IF WE EXPERIENCE COLLISSION USING shortid
var EXD_PREFIX = "EXD"; //EXCHANGE ID PREFIX - NOTE: IN THE FUTURE THIS CAN BE CHANGED IF WE EXPERIENCE COLLISSION USING shortid

var sObj = {
    DEFAULT_DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
    DEFAULT_TIME_FORMAT: "HH:mm:ss",
    DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
    config: config,
    redis: redis,
    db: knex,
    https: https,
    httpsOptions: options,
    /*util: function () {//Deprecated! handled below in a different approach
     return util(this);
     }(),*/
    privileges: config.privileges,
    executor: executor,
    moment: moment,
    promise: bluebirdPromise,
    shortid: shortid,
    MSG_SOMETHING_WENT_WRONG: "Oops! Something went wrong.<br/>Pleas try again.",
    MSG_INVALID_AUTH_TOKEN: "Invalid authentication token!",
    MSG_NO_AUTH_TOKEN: "No token provided for authentication!",
    now: function () {
        return moment().utc().format("YYYY-MM-DD HH:mm:ss");//GMT
    },
    date: function () {
        return moment().utc().format("YYYY-MM-DD");//GMT
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

    }

    //more may go here
};

//set the util
sObj.util = util(sObj);

//----require other modules

var adminManager = require('./manager/admin-manager')(sObj);
var accountManager = require('./account/account-manager')(sObj);
var dataQuery = require('./data-query')(sObj);

//-------set JSON WEB TOKEN (JWT) secret key
app.set('appSecret', config.jwtSecret); // secret gotten from the config file

adminManager.setJWT(jwt);
adminManager.setSecret(app.get('appSecret'));

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

//------route for user registration -------------
app.route('/register')
        .post(function (req, res) {
            adminManager.register(req.body, res);
        });

//------route for login--------------------------
app.route('/login')
        .post(function (req, res) {
            adminManager.login(req.body, res);
        });


//set this router base url  ------------------------
app.use('/access', accRoute);


// route middleware that will happen on every request on this route instance
accRoute.use(function (req, res, next) {
    adminManager.authenticate(req, res, next); // authenticate the request
});


//-----------------------basic start up info----------------------------------

accRoute.post('/startup', function (req, res) {
    adminManager.startUpInfo(req.user, res);
});


//-----------------------create admin user----------------------------------

accRoute.post('/create/admin_user', function (req, res) {
    adminManager.createAdminUser(req.user, req.body, res);
});


//-----------------------register broker----------------------------------

accRoute.post('/create/broker', function (req, res) {
    adminManager.registerBroker(req.user, req.body, res);
});


//-----------------------register trader----------------------------------

accRoute.post('/create/trader', function (req, res) {
    adminManager.registerTrader(req.user, req.body, res);
});



//-----------------------fund trader's account----------------------------------

accRoute.post('/account/fund', function (req, res) {
    accountManager.fundAccount(req.user, req.body, res);
});

//-----------------------withdraw fund from trader's account----------------------------------

accRoute.post('/account/withdraw', function (req, res) {
    accountManager.withdrawFund(req.user, req.body, res);
});
//-----------------------set payment method----------------------------------

accRoute.post('/account/withdrawal/payment_method', function (req, res) {
    accountManager.setWithdrawPaymentMethod(req.user, req.body, res);
});



//-----------------------data query----------------------------------

accRoute.post('/query/admin_users', function (req, res) {
    validateLimit(req.body);
    dataQuery.adminUsers(req.user, req.body, res);
});

accRoute.post('/query/brokers', function (req, res) {
    validateLimit(req.body);
    dataQuery.brokers(req.user, req.body, res);
});

accRoute.post('/query/live_traders', function (req, res) {
    validateLimit(req.body);
    dataQuery.liveTraders(req.user, req.body, res);
});

accRoute.post('/query/demo_traders', function (req, res) {
    validateLimit(req.body);
    dataQuery.demoTraders(req.user, req.body, res);
});

accRoute.post('/query/withdrawals', function (req, res) {
    validateLimit(req.body);
    dataQuery.withdrawals(req.user, req.body, res);
});

accRoute.post('/query/fundings', function (req, res) {
    validateLimit(req.body);
    dataQuery.fundings(req.user, req.body, res);
});


accRoute.post('/user_basic_info', function (req, res) {
    dataQuery.userBasicInfo(req.user, req.body, res);
});



//-----------------------auto live trader identity----------------------------------

accRoute.post('/auto_live_trader_identity', function (req, res) {//here the admin does the withdrawal for the trader
    var obj = {
        exchange_id: sObj.getUniqueExchangeId(),
        username: shortid.generate(),
        password: shortid.generate()
    };
    sObj.sendSuccess(res, obj);
});


//-------------------query open trades-----------------------------------

accRoute.post('/query/open/spotfx', function (req, res) {
    validateLimit(req.body);
    dataQuery.spotFxPositions(req.user, req.body, res);
});

accRoute.post('/query/open/options', function (req, res) {
    validateLimit(req.body);
    dataQuery.optionsPositions(req.user, req.body, res);
});


//----------------------query history trades-----------------------------

accRoute.post('/query/history/spotfx', function (req, res) {
    validateLimit(req.body);
    dataQuery.spotFxHistory(req.user, req.body, res);
});

accRoute.post('/query/history/options', function (req, res) {
    validateLimit(req.body);
    dataQuery.optionsHistory(req.user, req.body, res);
});

accRoute.post('/query/history/deposits_and_withdrawals', function (req, res) {
    validateLimit(req.body);
    dataQuery.depositsAndWithdrawals(req.user, req.body, res);
});

//-----------------------account info----------------------------------

accRoute.post('/account_info', function (req, res) {
    dataQuery.accountInfo(req.user, req.body, res);
});


//-----------------------rebate----------------------------------

accRoute.post('/query/rebate_per_day', function (req, res) {
    dataQuery.historyRebate(req.user, req.body, res);
});


accRoute.post('/current_rebate', function (req, res) {
    dataQuery.currentRebate(req.user, req.body, res);
});


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

    res.sendFile(__dirname + '/client/' + reqFile);
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
