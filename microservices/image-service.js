
'use strict';

class ImageService {

    constructor() {

        /*this.fs = require('fs');
         this.options = {
         //pfx: fs.readFileSync('security/trade.flexc.ca.pfx'),
         //passphrase: 'furTQkwhYy3m'
         cert: fs.readFileSync('security/matadorprimeelcmarketscom.cer'),
         key: fs.readFileSync('security/matadorprimeelcmarketscom.key')
         };*/

        this.cpus = require('os').cpus();
        this.fork = require('child_process').fork;

        this.formidable = require('formidable');
        this.express = require('express');
        this.app = this.express();
        //this.http_app = express();
        this.helmet = require('helmet');
        this.bodyParser = require('body-parser');
        //this.https = require('https');
        //this.secureHttpServer = https.Server(options, app);
        this.http = require('http');//use for redirecting to https
        this.jwt = require('jsonwebtoken');
        this.config = require('../config');
        this.util = require('../util/util');
        this.httpServer;
        this.imageResizers = [];
        this.rIndex = -1;
        
        this.init();
    }
    async init() {

        console.log('cpus count', this.cpus.length);
        
        for (var i = 0; i < this.cpus.length; i++) {
            this.imageResizers[i] = this.fork('./lib_image/image-resizer.js');
            this.imageResizers[i].on('message', this.onImageResizerMessage.bind(this));
            
            this.imageResizers[i].send('start');//testing!!!
        }
        
        this.app.set('appSecret', this.config.jwtImageServiceSecret); // secret gotten from the config file
        this.app.use(this.onRequestEntry.bind(this));//application level middleware
        this.app.use(this.express.static(__dirname + '/..')); //define the root folder to my web resources e.g javascript files        
        this.app.use(this.helmet());//secure the server app from attackers - Important!
        this.app.use(this.bodyParser.json());// to support JSON-encoded bodies
        this.app.use(this.bodyParser.urlencoded({extended: true}));// to support URL-encoded bodies   
        this.httpServer = this.http.createServer(this.app);//NEW - we now use reverse proxy server - ngnix
        //this.httpServer = http.createServer(this.redirectToHttps.bind(this));//create http server to redirect to https
        //this.secureHttpServer.listen(config.HTTPS_PORT, config.HOST, this.onListenHttps.bind(this));//listen for https connections        

        this.httpServer.listen(this.config.IMAGE_SERVICE_PORT, this.config.IMAGE_SERVICE_HOST, this.onListenHttp.bind(this));//listen for http connections

            // parse a file upload
    var form = new formidable.IncomingForm();
 
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end();
    });
    }
    
    nextResizer(){
        this.rIndex++;
        if(this.rIndex >= this.cpus.length){
            this.rIndex = 0;
        }
        return this.imageResizers[this.rIndex];
    }
    
    onImageResizerMessage(msg){
        console.log(`Msg to master ${msg}`);//testing!!!
        
        this.nextResizer().send(this.rIndex);//testing!!!
    }
    
    redirectToHttps(req, res) {
        //var req_host = req.headers['host'];//no need anyway
        res.writeHead(301, {"Location": "https://" + this.config.IMAGE_SERVICE_HOST + req.url});
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
    onListenHttps() {
        console.log('listening on :' + this.config.IMAGE_SERVICE_HOST + ":" + this.config.IMAGE_SERVICE_PORT);
    }

    onListenHttp() {
        console.log('listening on :' + this.config.IMAGE_SERVICE_HOST + ":" + this.config.IMAGE_SERVICE_PORT);
    }
}


const ims = new ImageService();


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
    console.log('\nShutting down...');

    //clear user sessions in this server instance

    console.log('COME BACK FOR APPROPRIATE GRACEFUL SHUTDOWN!');
    process.exit(0);//COME BACK

    /*ims.httpServer.on('close',function(){
     
     console.log('COME BACK FOR MORE CLEANUP!');
     
     process.exit(0);
     }); 
     
     
     ims.httpServer.close();*/

}
