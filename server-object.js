

var mgcol = require('./mongo_collections')();
var util = require('./util/util');
var Task = require('./app/task');
var game = require('./app/game/game');
var shortid = require('shortid');
var moment = require('moment');
var crypto = require('crypto');
var request = require('request-promise-native');
var http = require('http');
var fs = require('fs');
var execSync = require('child_process').execSync;
var initial_unique;
var unique_count = 0;

class ServerObject {

    constructor(db, redis, evt, config, appLoader) {
        this._db = db;

        //console.log('this.KICKOFF_TIME_REMINDER', this.KICKOFF_TIME_REMINDER);

        this._config = config;

        this._redis = redis;
        this._game = game;


        mgcol = mgcol.init(this);
        this._col = mgcol.geCollections();

        //for every startup a unique number is initialized
        initial_unique = crypto.randomBytes(48)//secure random number
                .toString('base64')//to base64
                .replace(/\+/g, '-')//this line and the two below makes the return value url and filename enconding safe
                .replace(/\//g, '_')
                .replace(/\=/g, '');

        var delimiter = ':';//important - must be a non-base6- valid character see base64 table in wikipedia

        this._proess_namespace = crypto.randomBytes(24)
                .toString('base64')//to base64
                .replace(/\+/g, '-')//this line and the two below makes the return value url and filename enconding safe
                .replace(/\//g, '_')
                .replace(/\=/g, '')
                + delimiter;//important!

        this._machine_id = '';
        if (process.platform.startsWith('win')) {
            this._machine_id = getMachineID('wmic DISKDRIVE get SerialNumber', 'SerialNumber');
        } else if (process.platform.startsWith('linux') || process.platform.startsWith('unix')) {
            this._machine_id = getMachineID('dmidecode -t system', 'Serial Number:');
            if (!this._machine_id) {
                this._machine_id = getMachineID('lshal', 'system.hardware.serial =');
                this._machine_id = util.replaceAll(this._machine_id, "\\(string\\)|(\\')", "");
            }
        } else if (process.platform.startsWith('mac')) {
            this._machine_id = getMachineID('/usr/sbin/system_profiler SPHardwareDataType', 'Serial Number:');
        }

        if (!this._machine_id) {
            console.warn('WARNING!!! Could not get the server machine id! This should not happen.');
        } else {
            console.log(`Server Machine ID: ${this._machine_id}`);
        }

        this._task = new Task(this, util, evt, appLoader);

        function getMachineID(cmd, marker) {
            var os_id = '';
            try {

                var options = {encoding: 'utf8'};
                var str = execSync(cmd, options);
                var split = str.toString().trim().split("\n");
                var arr = [];
                for (var i = 0; i < split.length; i++) {
                    var s = split[i].trim();
                    if (s) {
                        arr.push(s);
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === marker) {
                        return arr[i + 1].trim();
                    } else if (arr[i].startsWith(marker)) {
                        return arr[i].substring(marker.length).trim();
                    }
                }
            } catch (e) {
                console.log(e);
            }

            return os_id;
        }


    }

    async pingImageService(){
        return await this.resizeImage({ping: 'true'});//true must be a string not boolean otherwise is will throw this error - TypeError: First argument must be a String or Buffer
    }

    async resizeImage(obj) {
        var formData = {};
        
        if(obj.ping){
            formData.ping = obj.ping;//check if this server is connected to the image service - we use it to ensure the image service is running before this server is fullly started
        }else{
            formData.id= obj.id; //username, group name or tournament name
            formData.type= obj.type;//whether user, group or tournament
            formData.image_file= fs.createReadStream(obj.filename);
        }
        var path = '/image_resize';
        var url = `${this.config.IMAGE_SERVICE_PROTOCOL}://${this.config.IMAGE_SERVICE_HOST}:${this.config.IMAGE_SERVICE_PORT}${path}`;
        
        var agent = new http.Agent({
                keepAlive: true,
                maxSockets: 1
            });
            
        var options ={
            url: url,
            agent : agent,
            formData: formData
        };
        
        var result =  await request.post(options);
        try {
            result = JSON.parse(result);
        } catch (e) {
            //do nothing -  we always expect stringigfied json except the was an error in the remote end
        }

        if(!result.success){
            throw Error('An error occured in the image resizer service!');
        }
        return result;
    }

    /**
     * Get the io socket ids of this user. If a callback is provided
     * the method is asynchronous but if no callback then the method
     * will wait asynchronuously until the id is returned using
     *  ES7 async/await feature. Or throw exception if error occurs
     * 
     * @param {type} user_id -  the user id map to the io socket id
     * @param {type} callback - the callback - if not provided the 
     * method will wait using async/await -note that this may not be 
     * ideal in most case in this game server.
     * @returns {undefined}
     */
    async getSocketIDs(user_id, callback) {

        if (!callback) {
            var socket_ids = await this.redis.lrange("socket_id:" + user_id, 0, -1);
            if (socket_ids) {
                return socket_ids;
            }

            return  [];

        } else {
            this.redis.lrange("socket_id:" + user_id, 0, -1, function (err, socket_ids) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log('here o ', socket_ids);
                console.log('here o user_id', user_id);

                if (!socket_ids) {
                    callback([]);//make as empty array instead
                }
                callback(socket_ids);
            });
        }
    }

    /**
     * @deprecated since we now use GraphicMagick which supports
     * visually all known image formats. So no need to check for supported formats
     * 
     * @param {type} format
     * @returns {Boolean}
     */
    isSupportedImageFormat(format){
        /*var fmt = format.toUpperCase();
        var prefix = 'IMAGE/';
        if(fmt.startsWith(prefix)){
            fmt = fmt.substring(prefix.length);
        }
        return this.config.SUPPORTED_IMAGE_FORMATS.indexOf(fmt) > -1;*/
        return true;
    }

    get machineId() {
        return this._machine_id;
    }

    get config() {
        return this._config;
    }

    get MAX_MSG_TTL() {//in seconds
        return 2592000;// 30 days
    }

    get DEFAULT_MSG_TTL() {//in seconds
        return 86400;// 24 hours
    }

    get GAME_MAX_WAIT_IN_SEC() {//in seconds
        return 300;// 5 minutes
    }

    get KICKOFF_TIME_REMINDER() {//in seconds
        return 600;// 10 minutes
    }

    set isShuttingDown(b) {
        this._is_shutting_down = b;
    }

    get isShuttingDown() {
        return this._is_shutting_down;
    }

    get UniqueNumber() {
        return ++unique_count + "_ID_" + initial_unique; //jsut append the increment to make the call universally unique
    }

    get PROCESS_NS() {
        return this._proess_namespace;
    }

    get MAX_SESSION_PER_SAME_USER() {
        return 10;
    }

    get MAX_GROUP_MEMBERS() {
        return 300;
    }

    get MAX_ALLOW_QUERY_SIZE() {
        return 500;
    }

    get ROUND_ROBIN() {
        return 'round-robin';//Please do not change! Since the data has entered the database.
    }

    get SINGLE_ELIMINATION() {
        return 'single-elimination';//Please do not change! Since the data has entered the database.
    }

    get FINAL() {
        return 'Final';//Please do not change! Since the data has entered the database.
    }

    get SEMI_FINAL() {
        return 'Semi final';//Please do not change! Since the data has entered the database.
    }

    get QUATER_FINAL() {
        return 'Quater final';//Please do not change! Since the data has entered the database.
    }

    get MAX_TOURNAMENT_OFFICIALS() {
        return 30;
    }

    get MIN_TOURNAMENT_PLAYERS() {
        return 4;
    }

    get MAX_TOURNAMENT_PLAYERS() {
        return 100;
    }

    get MAX_GAME_SETS() {
        return 7;
    }

    get MATCH_SCHEDULE_OFFSET() {//allowable match schedule offset from current time in ms
        return 900000; //900000 ms is 15 mins
    }

    get MIN_TOURNAMENT_LIST() {//min number of tournaments to return otherwise random search will be made to complete the minimum numbers
        return 50;
    }

    get WIN_POINT() {
        return 3;
    }

    get DRAW_POINT() {
        return 1;
    }

    get MAX_RATING() {
        return 5; //5 starS e.g *****
    }

    get MIN_RATING() {
        return 1; //1 star e.g *
    }

    get DEFAULT_RATING() {
        return 2.5; //half of MAX_RATING
    }

    get MT_SCORE_TOURNAMENT() {//Match importance score for tournament match - used for ranking players
        return 4;
    }

    get MT_SCORE_GROUP() {//Match importance score for group match - used for ranking players
        return 2.5;
    }

    get MT_SCORE_CONTACT() {//Match importance score for contact match - used for ranking players
        return 2.5;
    }

    get task() {
        return this._task;
    }

    get db() {
        return this._db;
    }

    get redis() {
        return this._redis;
    }

    get shortid() {
        return shortid;
    }

    get moment() {
        return moment;
    }

    get game() {
        return this._game;
    }

    get col() {
        return this._col;
    }

    get PUBSUB_DELIVER_MESSAGE() {
        return 'PUBSUB_DELIVER_MESSAGE';
    }
    get PUBSUB_DELIVERY_RESEND() {
        return 'PUBSUB_DELIVERY_RESEND';
    }
    get PUBSUB_USER_SESSION_SIZE_EXCEEDED() {
        return 'PUBSUB_USER_SESSION_SIZE_EXCEEDED';
    }
    get PUBSUB_VERIFY_ONLINE_STATUS() {
        return 'PUBSUB_VERIFY_ONLINE_STATUS';
    }

}





module.exports = ServerObject;