
var socketio = require('socket.io');
var Redis = require('ioredis');
var RCallHandler = require('./rcall-handler');
var subscriber = new Redis();
var rcallIO, sObj, util, evt;
var unidentified_sock_ids = {};

setInterval(checkUnidentifiedSock, 5000);

function checkUnidentifiedSock() {
    if (!rcallIO) {
        return;
    }
    var NUM_TIMES = 20;
    for (var id in unidentified_sock_ids) {
        var sock = rcallIO.connected[id];
        if (sock) {
            var data = {
                event_name: 'session_user_id'
            };
            sock.emit('message', data);//request for session user id
            unidentified_sock_ids[id]++;
            if (unidentified_sock_ids[id] % NUM_TIMES === 0) {
                console.log(`WARNING!!! This is not expected. Client of socket id '${id}' did not send its session user id after  ${unidentified_sock_ids[id]} asks`);
            }
        } else {
            delete unidentified_sock_ids[id];
        }
    }
}

function init() {

    subscriber.subscribe(sObj.PUBSUB_DELIVER_MESSAGE, function (err, count) {
        if (err !== null) {
            console.error("FAILED!!! Could not subcrbe " + sObj.PUBSUB_DELIVER_MESSAGE);
            return;
        }

        console.log("subcribed to : " + sObj.PUBSUB_DELIVER_MESSAGE);
    });

    subscriber.subscribe(sObj.PUBSUB_ACKNOWLEDGE_DELIVERY_RESEND, function (err, count) {
        if (err !== null) {
            console.error("FAILED!!! Could not subcrbe " + sObj.PUBSUB_ACKNOWLEDGE_DELIVERY_RESEND);
            return;
        }

        console.log("subcribed to : " + sObj.PUBSUB_ACKNOWLEDGE_DELIVERY_RESEND);
    });

    subscriber.subscribe(sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED, function (err, count) {
        if (err !== null) {
            console.error("FAILED!!! Could not subcrbe " + sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED);
            return;
        }

        console.log("subcribed to : " + sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED);
    });


    subscriber.subscribe(sObj.PUBSUB_VERIFY_ONLINE_STATUS, function (err, count) {
        if (err !== null) {
            console.error("FAILED!!! Could not subcrbe " + sObj.PUBSUB_VERIFY_ONLINE_STATUS);
            return;
        }

        console.log("subcribed to : " + sObj.PUBSUB_VERIFY_ONLINE_STATUS);
    });

//more subcription goes below here



    subscriber.on('message', function (channel, message) {//from redis subcription
        switch (channel) {
            case sObj.PUBSUB_DELIVER_MESSAGE:
                deliverMessage(message);
                break;
            case sObj.PUBSUB_ACKNOWLEDGE_DELIVERY_RESEND:
                acknowledgeDeliveryResend(message);
                break;
            case sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED:
                closeUserSocket(message);
                break;
            case sObj.PUBSUB_VERIFY_ONLINE_STATUS:
                verifyOnlineStatus(message);
                break;


                //more goes here
        }
    });

}

function closeUserSocket(socket_id) {
    var sock = rcallIO.connected[socket_id];
    var after_period = 2 * 60 * 000; // close after the specified period
    if (sock) {
        setTimeout(function () {
            sock.disconnect(true);
        }, after_period);
    }
}

function verifyOnlineStatus(user_id) {
    sObj.getSocketIDs(user_id, function (socket_ids) {
        for (var i = 0; i < socket_ids.length; i++) {
            var sock = rcallIO.connected[socket_ids[i]];
            if (sock) {
                //set to online
                sObj.redis.set('online_status:' + user_id, "online", function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                });
                break;
            }
        }

    });
}


/**
 * Try to resend data we did not receive knowledgement.
 * But do not expect acknowledgement for the sending.
 * So remove any acknowledgement flag before sending.
 * 
 * @param {type} data
 * @returns {undefined} 
 */
function acknowledgeDeliveryResend(data) {
    data = JSON.parse(data);

}

function deliverMessage(data) {

    data = JSON.parse(data);

    if (data.is_broadcast) {
        var socket_ids = data.socket_ids; // array of arrays
        var user_ids = data.user_ids;

        delete data.socket_ids; //no longer required
        delete data.user_ids; //no longer required

        for (var i = 0; i < user_ids.length; i++) {
            send(user_ids[i], socket_ids[i], data);
        }
    } else {

        var socket_ids = data.socket_ids; // array of strings
        var user_id = data.user_id;

        delete data.socket_ids; //no longer required
        delete data.user_id; //no longer required

        send(user_id, socket_ids, data);
    }
}
/**
 * emit data to the user 
 *
 *@param {type} user_id - id of the user of the socket_ids - a user can
 *have more than one socket id it he exist in more than one session at a
 *time
 * @param {type} socket_ids -must be an array - each user has a list of 
 * sockets ids maintained by the redis server.\n
 * this allows the user to be served irrespective of the number
 * of devices they are connected from at the same time
 * @param {type} data - data to send to the user
 * @returns {undefined} */

function send(user_id, socket_ids, data) {
    console.log('user_id', user_id);
    console.log('socket_ids', socket_ids);
    console.log('data', data);

    if (!socket_ids || socket_ids.length === 0) {
        return;
    }
    data.ack_msg_id = sObj.UniqueNumber; // set the acknowledgement message id

    var atleat_one;
    for (var i = 0; i < socket_ids.length; i++) {
        if (!socket_ids[i].startsWith(sObj.PROCESS_NS)) {
            continue;
        }
        //at this point the socket id was created by this server instance       
        var socket_id = socket_ids[i].substring(sObj.PROCESS_NS.length);//extract rhe socket id 
        var sock = rcallIO.connected[socket_id];
        if (!sock) {
            //here the socket is closed so clear the user session mapped to this socket id
            afterUserDiscconnect(socket_id);
            continue;
        }
        atleat_one = true;
        //REMIND - confirm later if there is any need to stringify the data - if socketio accepts object
        sock.emit("message", data); // do not pass any callback - because of memory issue - just being cautious

        console.log('sent through socket_id: ', socket_id);
    }

    if (atleat_one && data.acknowledge_delivery) {
        data.user_id = user_id;
        delete data.acknowledge_delivery; //delete to avoid exponential acknowledgements which is disastrous
        sObj.redis.set("acknowledge_delivery:" + data.ack_msg_id, JSON.stringify(data));
    }

}

function afterUserDiscconnect(socket_id) {
    var user_id;
    sObj.redis.get('user_id:' + sObj.PROCESS_NS + socket_id)
            .then(function (_user_id) {
                user_id = _user_id;
                if (!_user_id) {
                    return;
                }
                //first remove this socket id from his list of session ids in redis - 
                return sObj.redis.lrem("socket_id:" + user_id, socket_id, 1);//come back to confirm later
            })
            .then(function () {
                //set his online status to offline
                return sObj.redis.set('online_status:' + user_id, "offline");
            })
            .then(function () {
                //publish PUBSUB_VERIFY_ONLINE_STATUS to be sure he is
                //not connected elsewhere. If found online in another
                //server then that server should modify the status 
                //back to online

                return sObj.redis.publish(sObj.PUBSUB_VERIFY_ONLINE_STATUS, user_id);
            })
            .then(function () {
                //do nothing
            })
            .catch(function (err) {
                console.log(err);
            });

}

module.exports = function (httpServer, appLoader, _sObj, _util, _evt) {
    sObj = _sObj;
    util = _util;
    evt = _evt;
    var io = socketio(httpServer);
    rcallIO = io.of("/rcall"); //using users namespace
    init();

    rcallIO.on('connection', onSocketConnect);

    function onSocketConnect(socket) {

        unidentified_sock_ids[socket.id] = 0;

        var data = {
            event_name: 'session_user_id'
        };
        socket.emit('message', data);//request for session user id

        socket.on('disconnect', onUserDisconnect);
        socket.on('rcall_request', onRCallRequest);
        socket.on('session_user_id', onSessionUserID);
        socket.on('acknowledge_delivery', onAcknowledgeDelivery);

        /**
         * Modify the user online status when he is disconnected
         * @returns {undefined}
         */
        function onUserDisconnect() {
            afterUserDiscconnect(socket.id);
        }

        function onRCallRequest(input) {

            var rcallHandler = new RCallHandler(sObj, util, appLoader, evt);//Yes, create new rcall object for each request to avoid reference issue

            rcallHandler.execMethod(input.data, function (data) {
                data._rcall_req_id = input._rcall_req_id;
                socket.emit("rcall_response", data); // do not pass any callback - because of memory issue - just being cautious
            });

        }

        //the client should detect connection event and 
        //send the username immediately to have his session
        //saved
        function onSessionUserID(username) {
            //ok the client has sent the username so
            //save it against the socket id for tracking his
            //socket
            saveSession(socket, username);
        }

        function onAcknowledgeDelivery(msg) {

            try {

                //COME BACK

                handleReceiveAcknowledgeAction(msg.acknowledge_received_action);


            } catch (e) {
                console.log(e);
            }


        }
    }

    function saveSession(socket, user_id) {
        //save the socket id in redis
        var socket_id = socket.id;

        //do two way may mapping of the user_id and socket_id

        sObj.redis.set("user_id:" + sObj.PROCESS_NS + socket_id, user_id) //map user_id to socket_id
                .then(function (result) {
                    //then map socket_id to user_id
                    return sObj.redis.rpush("socket_id:" + user_id, sObj.PROCESS_NS + socket_id)//append
                            .then(function (count) {

                                delete unidentified_sock_ids[socket_id]; //ok, delete since we now have the user session id 

                                //now ensure the number same user session does not 
                                //exceed our defined limit.
                                
                                if (count > sObj.MAX_SESSION_PER_SAME_USER) {
                                    //remove the oldest of the same user session and publishing the
                                    //socket id via redis since we know that the socket may not be in this 
                                    //server
                                    var excess_count = count - sObj.MAX_SESSION_PER_SAME_USER;
                                    
                                    for (var i = 0; i < excess_count; i++) {

                                        sObj.redis.lpop("socket_id:" + user_id)//get and remove the first on the list 
                                                .then(function (oldest_socket_id) {
                                                    //now publish the socket id for the relevant server process
                                                    //to close the user socket

                                                    return sObj.redis.publish(sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED, oldest_socket_id);
                                                })
                                                .catch(function (err) {
                                                    console.log(err);//what can we do anyway - unfortunate
                                                });
                                    }
                                }
                            });
                })
                .catch(function (err) {
                    //if something went wrong then close the socket
                    socket.disconnect(true);//set to true to close the underlying connection
                });


    }

};

function handleReceiveAcknowledgeAction(action) {

    if (!action) {
        return;
    }

    switch (action) {
        case 'TODO':

            break;

        default:

            break;
    }

}
