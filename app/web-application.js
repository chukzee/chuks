
'use strict';

class WebApplication {

    constructor(_sObj, _util, _evt) {
        this.sObj = _sObj;
        this.util = _util;
        this.evt = _evt;
        this.data = {};
        this.success = false;
    }
    
    get files(){
        return this._files;
    }

    send(event_name, _data, to_user_id, acknowledge_delivery, message_ttl_in_seconds) {
        if (Array.isArray(to_user_id)) {
            return this.broadcast(_data, to_user_id, acknowledge_delivery);
        }

        if (message_ttl_in_seconds > this.sObj.MAX_MSG_TTL) {
            message_ttl_in_seconds = this.sObj.MAX_MSG_TTL;
            console.log(`WARNING!!! message ttl of ${message_ttl_in_seconds} was reduced to maximum allowed - ${this.sObj.MAX_MSG_TTL}`);
        }

        var me = this;
        this.sObj.getSocketIDs(to_user_id, function (socket_ids) {

            var data = {
                data: _data,
                user_id: to_user_id,
                socket_ids: socket_ids,
                msg_time: new Date().getTime(), // must be long type please!
                msg_ttl: me.sObj.DEFAULT_MSG_TTL || message_ttl_in_seconds,
                event_name: event_name,
                acknowledge_delivery: acknowledge_delivery,
                resend_count: 0
            };

            me.sObj.redis.publish(me.sObj.PUBSUB_DELIVER_MESSAGE, JSON.stringify(data));
            console.log(data);
        });
    }

    broadcast(event_name, _data, to_user_id_arr, acknowledge_delivery, message_ttl_in_seconds) {

        if (!Array.isArray(to_user_id_arr)) {
            throw new Error('invalid input parameter - third argument must be and array of user ids');
        }

        if (message_ttl_in_seconds > this.sObj.MAX_MSG_TTL) {
            message_ttl_in_seconds = this.sObj.MAX_MSG_TTL;
            console.log(`WARNING!!! message ttl of ${message_ttl_in_seconds} was reduced to maximum allowed - ${this.sObj.MAX_MSG_TTL}`);
        }

        var commandArr = [];

        for (var i = 0; i < to_user_id_arr.length; i++) {
            //each user has a list of sockets ids maintained by the redis server.
            //this allows the user to be served irrespective of the number
            //of devices they are connected from at the same time
            commandArr.push(['lrange', "socket_id:" + to_user_id_arr[i], 0, -1]);
        }

        var me = this;

        this.sObj.redis.pipeline(commandArr).exec(function (err, result) {
            var socket_ids = [];
            var user_ids = []; //corresponding users
            for (var i = 0; i < result.length; i++) {
                var errStr = result[i][0];
                var sock_ids = result[i][1]; // expected to be array of socket ids for each user
                if (errStr !== null || sock_ids === null) {
                    if (errStr !== null) {
                        console.error(errStr);//DONT DO THIS IN PRODUCTION
                    }
                    continue;
                }

                //REMIND - COMFIRM IF REDIS QUEUES THE COMMANDS IN THE PIPELINE AND THE RESULTS ARE RECEIVED
                //IN THE ORDER THEY WERE SENT - IF NOT SO THEN THE LINES BELOW WILL BE BUGGY!

                socket_ids.push(sock_ids); // push the arrays in - socket_ids is now array of arrays
                user_ids.push(to_user_id_arr[i]); //push in the corresponding user
                //now send the broadcast message to redis
            }

            var data = {
                is_broadcast: true,
                data: _data,
                user_ids: user_ids,
                socket_ids: socket_ids, //array of arrays
                msg_time: new Date().getTime(), // must be long type please!
                msg_ttl: me.sObj.DEFAULT_MSG_TTL || message_ttl_in_seconds,
                event_name: event_name,
                acknowledge_delivery: acknowledge_delivery,
                resend_count: 0
            };

            me.sObj.redis.publish(me.sObj.PUBSUB_DELIVER_MESSAGE, JSON.stringify(data));
            
        });
    }

    result(data) {
        this.success = true;
        this._isError = !this.success;
        this.data = data;
        return this;
    }

    error(reason) {
        this.success = false;
        this._lastError = reason;
        this._isError = !this.success;
        return this;
    }

    /**
     * This method tries an operation for certain number
     * of times asynchronously. 
     * 
     * @param {type} func - function to call 
     * @param {type} _times - number of times to try
     * @param {type} _wait_mills - delay before next try
     * @returns {Promise}
     */
    _tryWith(func, _times, _wait_mills) {
        var argu = [];
        if (arguments.length > 3) {
            for (var i = 3; i < arguments.length; i++) {
                argu.push(arguments[i]);
            }
        }

        var time = _times || 10;
        var wait_mills = _wait_mills || 50;
        var try_count = 0;
        var me = this;

        return new Promise(function (resolve, reject) {
            run();
            async function run() {
                try_count++;
                if (try_count > time) {
                    return resolve(false);//resolve as false - do not reject!
                }

                try {
                    if (await func.apply(me, argu)) {
                        return resolve(true);//resolve as true
                    }
                } catch (e) {
                    console.log(e);
                }

                //console.log('setTimeout ', try_count);

                setTimeout(run, wait_mills);
            }

        });
    }

    /**
     * Called after the request for this class is done with.
     * 
     * This method will be implemented by subclassess
     * 
     * 
     * @returns {undefined}
     */
    _onFinish() {

    }

    get lastError() {
        return this._lastError;
    }

    get isError() {
        return this._isError;
    }

}

module.exports = WebApplication;


