
'use strict';
var fs = require('fs');
var options = {
    //pfx: fs.readFileSync('security/trade.flexc.ca.pfx'),
    //passphrase: 'furTQkwhYy3m'
    cert: fs.readFileSync('security/matadorprimeelcmarketscom.cer'),
    key: fs.readFileSync('security/matadorprimeelcmarketscom.key')
};
var appLoader = require('./app-loader');
var RCall = require('./rcall');
var express = require('express');
var app = express();
var http_app = express();
var helmet = require('helmet');
var bodyParser = require('body-parser');
var https = require('https');
var secureHttpServer = https.Server(options, app);
var http = require('http');//use for redirecting to https
var accRoute = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./config');

class Main {

    constructor() {        
        this.init();
    }
    init() {
        
        app.set('appSecret', config.jwtSecret); // secret gotten from the config file
        app.use(this.onRequestEntry);//application level middleware
        app.set('appSecret', config.jwtSecret); // secret gotten from the config file
        app.use(express.static(__dirname + '/..')); //define the root folder to my web resources e.g javascript files        
        app.use(helmet());//secure the server app from attackers - Important!
        app.use(bodyParser.json());       // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({extended: true}));// to support URL-encoded bodies       
        app.use('/access', accRoute); //set this router base url
        accRoute.use(this.accessRouteRequest);
        app.get('/*', this.serveFile);//route for web client resources to server web pages

        var httpServer = http.createServer(this.redirectToHttps);//create http server to redirect to https
        secureHttpServer.listen(config.HTTPS_PORT, config.HOST, this.onListenHttps);//listen for https connections        
        httpServer.listen(config.HTTP_PORT, config.HOST, this.onListenHttp);//listen for http connections
        
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
        //console.log(reqFile);//UNCOMMENT TO SEE THE PATHS
        res.sendFile(__dirname + '/client/' + reqFile);
    }
    accessRouteRequest(req, res, next) {

    }
    onListenHttps() {
        console.log('listening on :' + config.HOST + ":" + config.HTTPS_PORT);
    }

    onListenHttp() {
        console.log('listening on :' + config.HOST + ":" + config.HTTP_PORT);
    }
}

class ServerObject {

    constructor() {

        //var mysql = require('mysql');
        //var Redis = require('ioredis');
        this._shortid = require('shortid');
        this._moment = require('moment');

    }

    get shortid() {
        return this._shortid;
    }

    get moment() {
        return this._moment;
    }
}


const main = new Main();

const sObj = new ServerObject();

appLoader();

new RCall(sObj, app, appLoader);



