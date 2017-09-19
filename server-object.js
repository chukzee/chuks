

var mgcol = require('./mongo_collections')();
var util = require('./util/util');
var Task = require('./app/task');
var game = require('./app/game/game');
var shortid = require('shortid');
var moment = require('moment');
var crypto = require('crypto');
var initial_unique;
var unique_count = 0;

class ServerObject {

    constructor(db, redis, evt) {

        mgcol = mgcol.init(db);
        this._col = mgcol.geCollections();

        this._db = db;
        this._redis = redis;
        this._game = game;
        this._task = new Task(this, util , evt);
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
                
                console.log('here o ',socket_ids );
                console.log('here o user_id',user_id );
                
                if (!socket_ids) {
                    callback([]);//make as empty array instead
                }
                callback(socket_ids);
            });
        }
    }
    
    
    get MAX_MSG_TTL(){//in seconds
        return 2592000;// 30 days
    }
    
    get DEFAULT_MSG_TTL(){//in seconds
        return 86400;// 24 hours
    }
    
    set isShuttingDown(b){
        this._is_shutting_down = b;
    }

    get isShuttingDown(){
        return this._is_shutting_down;
    }

    get UniqueNumber() {        
        return ++unique_count + "_ID_" +initial_unique ; //jsut append the increment to make the call universally unique
    }
    
    get PROCESS_NS(){
        return this._proess_namespace;
    }
    
    get MAX_SESSION_PER_SAME_USER(){
        return 10;
    }

    get MAX_GROUP_MEMBERS() {
        return 300;
    }

    get MAX_ALLOW_QUERY_SIZE() {
        return 500;
    }
    
    get MAX_TOURNAMENT_OFFICIALS(){
        return 30;
    }
    
    get MAX_TOURNAMENT_PLAYERS(){
        return 100;
    }
    
    get task(){
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

    get game(){
        return this._game;
    }

    get col() {
        return this._col;
    }

    get PUBSUB_DELIVER_MESSAGE() {
        return 'PUBSUB_DELIVER_MESSAGE';
    }
    get PUBSUB_DELIVERY_RESEND(){
        return 'PUBSUB_DELIVERY_RESEND';
    }
    get PUBSUB_USER_SESSION_SIZE_EXCEEDED() {
        return 'PUBSUB_USER_SESSION_SIZE_EXCEEDED';
    }
    get PUBSUB_VERIFY_ONLINE_STATUS(){
        return 'PUBSUB_VERIFY_ONLINE_STATUS';
    }
    

}





module.exports = ServerObject;