
/* global Promise */

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

        this.fs = require('fs');
        this.mkdirp = require('mkdirp');
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

        this.mkdirp.sync(this.config.WEB_ROOT + this.config.GROUP_SMALL_IMAGE_DIR);
        this.mkdirp.sync(this.config.WEB_ROOT + this.config.TOURNAMENT_SMALL_IMAGE_DIR);
        this.mkdirp.sync(this.config.WEB_ROOT + this.config.USER_SMALL_IMAGE_DIR);

        this.mkdirp.sync(this.config.WEB_ROOT + this.config.GROUP_LARGE_IMAGE_DIR);
        this.mkdirp.sync(this.config.WEB_ROOT + this.config.TOURNAMENT_LARGE_IMAGE_DIR);
        this.mkdirp.sync(this.config.WEB_ROOT + this.config.USER_LARGE_IMAGE_DIR);

        //console.log('cpus count', this.cpus.length);

        for (var i = 0; i < this.cpus.length; i++) {
            this.imageResizers[i] = this.fork('./lib_image/image-resizer.js');
            this.imageResizers[i].on('message', this.onImageResizerMessage.bind(this));
        }

        this.app.set('appSecret', this.config.jwtImageServiceSecret); // secret gotten from the config file
        this.app.use(this.onRequestEntry.bind(this));//application level middleware
        this.app.use(this.helmet());//secure the server app from attackers - Important!
        this.httpServer = this.http.createServer(this.app);

        this.httpServer.keepAliveTimeout = 0;//we need forever keep alive so disable the keep alive timeout by setting a value of zero!

        this.httpServer.on('connection', function (sock) {
            sock.setKeepAlive(true);

            /*sock.on('close', function(){
             console.log('sock close');
             });*/

        });

        this.httpServer.listen(this.config.IMAGE_SERVICE_PORT, this.config.IMAGE_SERVICE_HOST, this.onListenHttp.bind(this));//listen for http connections

        this.app.route('/image_resize')
                .post(this.imageResizeRequest.bind(this));


        this.app.route('/test')
                .get(function (req, res) {
                    console.log('sock');
                    res.send('see am here');
                    res.end();
                });

    }

    promiseCopyFile(from, to) {
        return new Promise((resolve, reject) => {
            this.fs.copyFile(from, to, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    promiseRenameFile(from, to) {
        return new Promise((resolve, reject) => {
            this.fs.rename(from, to, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    imageResizeRequest(req, res) {
        var form = new this.formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            var result = {};
            result.success = false;
            if (err) {
                return res.send(JSON.stringify(result));
            }

            if (fields.ping) {
                result.success = true;
                return res.send(JSON.stringify(result));
            }

            var relative_small_image_path;
            var relative_large_image_path;

            var file_name = `${fields.id}${this.config.IMAGE_EXTENTION}`;

            switch (fields.type) {
                case 'user':
                    {
                        relative_small_image_path = `${this.config.USER_SMALL_IMAGE_DIR}/${file_name}`;
                        relative_large_image_path = `${this.config.USER_LARGE_IMAGE_DIR}/${file_name}`;
                    }
                    break;
                case 'group':
                    {
                        relative_small_image_path = `${this.config.GROUP_SMALL_IMAGE_DIR}/${file_name}`;
                        relative_large_image_path = `${this.config.GROUP_LARGE_IMAGE_DIR}/${file_name}`;
                    }
                    break;
                case 'tournament':
                    {
                        relative_small_image_path = `${this.config.TOURNAMENT_SMALL_IMAGE_DIR}/${file_name}`;
                        relative_large_image_path = `${this.config.TOURNAMENT_LARGE_IMAGE_DIR}/${file_name}`;
                    }
                    break;
                default:
                {
                    return res.send(JSON.stringify(result));
                }

            }
            var from_tmp = files.image_file.path;

            var imgPaths = {};
            imgPaths.input_file_path = from_tmp;
            imgPaths.absolute_small_image_path = `${this.config.WEB_ROOT}${relative_small_image_path}`;
            imgPaths.absolute_large_image_path = `${this.config.WEB_ROOT}${relative_large_image_path}`;


            this.promiseCopyFile(from_tmp, imgPaths.absolute_large_image_path)
                    .then(() => {
                        return this.promiseCopyFile(from_tmp, imgPaths.absolute_small_image_path);
                    })
                    .then(() => {

                        result.success = true;
                        result.small_image_path = relative_small_image_path;
                        result.large_image_path = relative_large_image_path;
                        this.nextResizer().send(imgPaths);
                        res.send(JSON.stringify(result));
                    })
                    .catch(err => {
                        console.log(err);
                        return res.send(JSON.stringify(result));
                    });

        });
    }

    nextResizer() {
        this.rIndex++;
        if (this.rIndex >= this.cpus.length) {
            this.rIndex = 0;
        }
        return this.imageResizers[this.rIndex];
    }

    onImageResizerMessage(msg) {

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
