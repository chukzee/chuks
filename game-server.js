
'use strict';
/*var fs = require('fs');
 var options = {
 //pfx: fs.readFileSync('security/trade.flexc.ca.pfx'),
 //passphrase: 'furTQkwhYy3m'
 cert: fs.readFileSync('security/matadorprimeelcmarketscom.cer'),
 key: fs.readFileSync('security/matadorprimeelcmarketscom.key')
 };*/

var appLoader = require('./app-loader')();
var RCallHandler = require('./rcall-handler');
var express = require('express');
var app = express();
//var http_app = express();
var helmet = require('helmet');
var bodyParser = require('body-parser');
//var https = require('https');
//var secureHttpServer = https.Server(options, app);
var http = require('http');//use for redirecting to https

var accRoute = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./config');
var mongo = require('mongodb').MongoClient;
var Redis = require('ioredis');
var RealtimeSession = require('./realtime-session');
var util = require('./util/util');
var ServerObject = require('./server-object');
var evt = require('./app/evt');
var db;
var redis;
var sObj;

class Main {

    constructor() {
        this.init();
    }
    async init() {

        var mongo_url = 'mongodb://' + config.MONGO_HOST + ':' + config.MONGO_PORT + '/' + config.MONGO_DB_NAME;
        try {
            db = await mongo.connect(mongo_url, {
                poolSize: 50
                        //,ssl: true //TODO
                        //and many more optionS TODO - see doc at http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/
            });
            console.log('Connected to mongo server at : ' + mongo_url);
        } catch (e) {
            console.error(e);
            console.log("Server cannot start!");
            process.exit(1);
        }

        redis = new Redis();

        app.set('appSecret', config.jwtSecret); // secret gotten from the config file
        app.use(this.onRequestEntry.bind(this));//application level middleware
        app.set('appSecret', config.jwtSecret); // secret gotten from the config file
        app.use(express.static(__dirname + '/..')); //define the root folder to my web resources e.g javascript files        
        app.use(helmet());//secure the server app from attackers - Important!
        app.use(bodyParser.json());// to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({extended: true}));// to support URL-encoded bodies   
        app.use('/access', accRoute); //set this router base url
        accRoute.use(this.accessRouteRequest.bind(this));
        //commented out since we now use reverse proxy - ngnix
        app.get('/*', this.serveFile.bind(this));//route for web client resources to server web pages
        var httpServer = http.createServer(app);//NEW - we now use reverse proxy server - ngnix
        //var httpServer = http.createServer(this.redirectToHttps.bind(this));//create http server to redirect to https
        //secureHttpServer.listen(config.HTTPS_PORT, config.HOST, this.onListenHttps.bind(this));//listen for https connections        

        httpServer.listen(config.HTTP_PORT, config.HOST, this.onListenHttp.bind(this));//listen for http connections

        sObj = new ServerObject(db, redis);
        //initilize here! - For a reason I do not understand the express app object does not use the body parse if this initialization is done outside this async init method- the request body is undefined.But if this init method is not declared async it works normal.  Shocking... anyway!
        
        RealtimeSession(httpServer, appLoader, sObj, util, evt);

        app.route('/rcall')
                .post(function (req, res) {
                    var rcallHandler = new RCallHandler(sObj, util, appLoader, evt);//Yes, create new rcall object for each request to avoid reference issue
                    rcallHandler.processInput(req, res);
                });
    }
    redirectToHttps(req, res) {
        //var req_host = req.headers['host'];//no need anyway
        res.writeHead(301, {"Location": "https://" + config.HOST + req.url});
        res.end();
    }
    onRequestEntry(req, res, next) {
        //request metrics
        //metrics.markRequest();// measure requests per time e.g per min, per hour and per day
        //metrics.incrementRequest();
        res.on('finish', this.onRequestFinish);
        next();
    }
    onRequestFinish() {
        //metrics.decrementRequest();                
    }
    serveFile(req, res) {
        var reqFile = '/index.html'; //default
        if (req.path !== '/') {
            reqFile = decodeURIComponent(req.path);// decodeURIComponent() will be prefered to decodeURI() because it decodes URI special markers such as &, ?, #, etc while decodeURI() does not
        }
        console.log(reqFile);//UNCOMMENT TO SEE THE PATHS
        res.sendFile(__dirname + '/public/www/' + reqFile);
    }
    accessRouteRequest(req, res, next) {

        //do some stuff here!
        console.log(req.body);

        next();
    }
    onListenHttps() {
        console.log('listening on :' + config.HOST + ":" + config.HTTPS_PORT);
    }

    onListenHttp() {
        console.log('listening on :' + config.HOST + ":" + config.HTTP_PORT);
    }
}


const main = new Main();


if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  //graceful shutdown
  gracefulShutdown();
});

function gracefulShutdown(){
    sObj.isShuttingDown = true;
    console.log('\nShutting down...');
    
    //clear user sessions in this server instance
    
    
    setTimeout(function(){//TO BE REMOVE LATER - NOT THE BEST!
        console.log('COME BACK FOR PROPER shutdown -  not using setTimeout!');
        process.exit();
    },2000);
    
}