
'use strict';

class GameServer {

    constructor() {

        this.db;
        this.redis;
        this.sObj;
        this.httpServer;

        this.init();
    }

    require() {

        /*this.fs = require('fs');
         this.options = {
         //pfx: fs.readFileSync('security/trade.flexc.ca.pfx'),
         //passphrase: 'furTQkwhYy3m'
         cert: fs.readFileSync('security/matadorprimeelcmarketscom.cer'),
         key: fs.readFileSync('security/matadorprimeelcmarketscom.key')
         };*/

        this.appLoader = require('./app-loader')();
        this.RCallHandler = require('./rcall-handler');
        this.formidable = require('formidable');
        this.express = require('express');
        this.app = this.express();
        //this.http_app = express();
        this.helmet = require('helmet');
        this.bodyParser = require('body-parser');
        //this.https = require('https');
        //this.secureHttpServer = https.Server(options, app);
        this.http = require('http');//use for redirecting to https
        this.accRoute = this.express.Router();
        this.jwt = require('jsonwebtoken');
        this.config = require('./config');
        this.mongo = require('mongodb').MongoClient;
        this.Redis = require('ioredis');
        this.RealtimeSession = require('./realtime-session');
        this.util = require('./util/util');
        this.ServerObject = require('./server-object');
        this.evt = require('./app/evt');
    }

    async init() {

        try {

            this.require();

            console.log('Connecting to mongo server...');

            var mongo_url = 'mongodb://' + this.config.MONGO_HOST + ':' + this.config.MONGO_PORT + '/' + this.config.MONGO_DB_NAME;

            this.db = await this.mongo.connect(mongo_url, {
                poolSize: 50
                        //,ssl: true //TODO
                        //and many more options TODO - see doc at http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/
            });

            console.log('Connected to mongo server at:', mongo_url);

            console.log('Connecting to redis server...');

            this.redis = new this.Redis();

            console.log('Connected to redis server at:', `${this.redis.options.host}:${this.redis.options.port}`);

            this.app.set('appSecret', this.config.jwtSecret); // secret gotten from the config file
            this.app.use(this.onRequestEntry.bind(this));//application level middleware
            this.app.use(this.express.static(__dirname + '/..')); //define the root folder to my web resources e.g javascript files        
            this.app.use(this.helmet());//secure the server app from attackers - Important!
            this.app.use(this.bodyParser.json());// to support JSON-encoded bodies
            this.app.use(this.bodyParser.urlencoded({extended: true}));// to support URL-encoded bodies   
            this.app.use('/access', this.accRoute); //set this router base url
            this.accRoute.use(this.accessRouteRequest.bind(this));
            //line below may be commented out since we now use reverse proxy - ngnix
            this.app.get('/*', this.serveFile.bind(this));//route for web client resources to server web pages
            this.sObj = new this.ServerObject(this.db, this.redis, this.evt, this.config, this.appLoader);
            //initilize here! - For a reason I do not understand the express app object does not use the body parse if this initialization is done outside this async init method- the request body is undefined.But if this init method is not declared async it works normal.  Shocking... anyway!

            console.log('Connecting to image service...');

            await this.sObj.pingImageService();//checking if the imageservice is up and running

            console.log('Connected to image service at:', `${this.config.IMAGE_SERVICE_PROTOCOL}://${this.config.IMAGE_SERVICE_HOST}:${this.config.IMAGE_SERVICE_PORT}`);

            this.httpServer = this.http.createServer(this.app);//NEW - we now use reverse proxy server - ngnix
            //this.httpServer = this.http.createServer(this.redirectToHttps.bind(this));//create http server to redirect to https
            //this.secureHttpServer.listen(config.HTTPS_PORT, config.HOST, this.onListenHttps.bind(this));//listen for https connections        

            this.httpServer.listen(this.config.HTTP_PORT, this.config.HOST, this.onListenHttp.bind(this));//listen for http connections

            this.RealtimeSession(this.httpServer, this.appLoader, this.sObj, this.util, this.evt);

            this.app.route('/rcall')
                    .post(this.rcallRequest.bind(this));


            this.app.route('/rcall_with_upload')
                    .post(this.rcallWithUploadRequest.bind(this));


            this.app.route('/test')
                    .post(function (req, res) {
                        res.send('the result');
                    }.bind(this));

        } catch (e) {
            console.log(e);
            console.log("--------------------");
            console.log("Server cannot start!");
            process.exit(1);
        }

    }

    redirectToHttps(req, res) {
        //var req_host = req.headers['host'];//no need anyway
        res.writeHead(301, {"Location": "https://" + this.config.HOST + req.url});
        res.end();
    }

    onRequestEntry(req, res, next) {
        //request metrics
        //metrics.markRequest();// measure requests per time e.g per min, per hour and per day
        //metrics.incrementRequest();
        res.on('finish', this.onRequestFinish);
        next();
    }

    rcallRequest(req, res) {

        var rcallHandler = new this.RCallHandler(this.sObj, this.util, this.appLoader, this.evt);//Yes, create new rcall object for each request to avoid reference issue
        rcallHandler.processInput(req, res);
    }

    rcallWithUploadRequest(req, res) {
        var form = new this.formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            var rcallHandler = new this.RCallHandler(this.sObj, this.util, this.appLoader, this.evt);//Yes, create new rcall object for each request to avoid reference issue
            if (err) {
                rcallHandler.replyError();
                return;
            }
            var rcall_data;
            for (var n in fields) {
                var rcall_data = fields[n];
                break;//break since we know it is only one field which contain the rcall data (json stringified);
            }
            rcallHandler.processInputWithUpload(rcall_data, files, res);
        });
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
        console.log('listening on :' + this.config.HOST + ":" + this.config.HTTPS_PORT);
    }

    onListenHttp() {
        console.log('listening on :' + this.config.HOST + ":" + this.config.HTTP_PORT);
    }
}


const gs = new GameServer();


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

function gracefulShutdown() {
    gs.sObj.isShuttingDown = true;
    console.log('\nShutting down...');

    //clear user sessions in this server instance

    console.log('COME BACK FOR APPROPRIATE GRACEFUL SHUTDOWN!');
    process.exit(0);//COME BACK

    /*gs.httpServer.on('close',function(){
     
     console.log('COME BACK FOR MORE CLEANUP!');
     
     process.exit(0);
     }); 
     
     
     gs.httpServer.close();*/

}
