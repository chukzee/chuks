
var socketio = require('socket.io');
var Redis = require('ioredis');
var subscriber = new Redis();
var usersIO, sObj, util;
var ACK_SocketIDs_KEY = "___ACK_SocketIDs_KEY_"; //DO NOT CHANGE. DO NOT MAKE UNIQUE. IT WILL NOT WORK BECAUSE IT WILL BE SHARE BY DIFFERENT PROCESS SO IT WILL BE DIFFICULT TO SYNCHRONIZE THE USAGE 

function init() {

    subscriber.subscribe(sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED, function (err, count) {
        if (err !== null) {
            console.error("FAILED!!! Could not subcrbe " + sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED);
            return;
        }

        console.log("subcribed to : " + sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED);
    });

    subscriber.subscribe(sObj.PUBSUB_FORWARD_MOVE, function (err, count) {
        if (err !== null) {
            console.error("FAILED!!! Could not subcrbe " + sObj.PUBSUB_FORWARD_MOVE);
            return;
        }

        console.log("subcribed to : " + sObj.PUBSUB_FORWARD_MOVE);
    });

//more subcription goes below here



    subscriber.on('message', function (channel, message) {//from redis subcription
        switch (channel) {
            case sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED:
                closeUserSocket(message);
                break;
            case sObj.PUBSUB_FORWARD_MOVE:
                forwardMove(JSON.parse(message));
                break;
            case sObj.PUBSUB_BROADCAST_MOVE:
                broadcastMove(JSON.parse(message));
                break;
            case sObj.PUBSUB_ACKNOWLEGE_MOVE_SENT:
                acknowlegetMoveSent(JSON.parse(message));
                break;
            case sObj.PUBSUB_SEND_GROUP_JOIN_REQUEST:
                sendGroupJoinRequest(JSON.parse(message));
                break;
            case sObj.PUBSUB_ACKNOWLEDGE_RECEIVE_RESEND:
                acknowledgeReceiveResend(JSON.parse(message));
                break;

                //more goes here
        }
    });

}

function closeUserSocket(socket_id) {
    var sock = usersIO.connected[socket_id];
    var after_period = 2 * 60 * 000; // close after the specified period
    if (sock) {
        setTimeout(function () {
            sock.disconnect(true);
        }, after_period);
    }
}

/**
 * Try to resend data we did not receive knowledgement.
 * But do not expect acknowledgement for the sending.
 * So remove any acknowledgement flag before sending.
 * 
 * @param {type} data
 * @returns {undefined} 
 */
function acknowledgeReceiveResend(data) {
    data.acknowledge_received_by = false;//disable for this resend action
    data.acknowledge_received_action = "";//further disabling
    var user_socks = data[ACK_SocketIDs_KEY];  //the socket ids of the user
    send(data.event_name, user_socks, data);    
}

/**
 * Forward  move to the opponent
 * 
 * @param {type} data
 * @returns {undefined} 
 */
function forwardMove(data) {
    sObj.getUserSocks(data.opponent_id, function (user_socks) {
        send('game_move', user_socks, data);
    });
}

function sendGroupJoinRequest(data) {
    sObj.getUserSocks(data.opponent_id, function (user_socks) {
        send('group_join_request', user_socks, data);
    });
}
/**
 * Notify the player that the move reach the sent and sent to the opponent
 * 
 * @param {type} data
 * @returns {undefined} 
 */
function acknowlegetMoveSent(data) {
    sObj.getUserSocks(data.user_id, function (user_socks) {
        send('acknowlege_move_sent', user_socks, data);
    });
}


/**
 * Broadcast  move to the spectators
 * 
 * @param {type} data
 * @returns {undefined} 
 */
function broadcastMove(data) {

    var commandArr = [];

    for (var i = 0; i < data.spectators_ids.length; i++) {
        //each user has a list of sockets ids maintained by the redis server.
        //this allows the user to be served irrespective of the number
        //of devices they are connected from at the same time
        commandArr.push(['lrange', "socket_id:" + data.spectators_ids[i], 0, -1]);
    }

    delete data.spectators_ids;  //delete this field and send the rest


    sObj.redis.pipeline(commandArr).exec(function (err, result) {
        for (var i = 0; i < result.length; i++) {
            var errStr = result[i][0];
            var value = result[i][1];
            if (errStr !== null || value === null) {
                if (errStr !== null) {
                    console.error(errStr);//DONT DO THIS IN PRODUCTION
                }
                continue;
            }
            var user_sock = JSON.parse(value);
            
            send('game_move', user_sock, data);
        }

    });

}

/**
 * emit data to the user 
 *
 * @param {type} event_name - name of the event
 * @param {type} user_socks -must be an array - each user has a list of 
 sockets ids maintained by the redis server.\n
 this allows the user to be served irrespective of the number
 of devices they are connected from at the same time
 * @param {type} data - data to send to the user
 * @returns {undefined} */

function send(event_name, user_socks, data) {


    //user_sock is expected to be an arry because each user socket id 
    //is stored in a list to hold socket ids of same user
    var atleat_one_sent = false;
    for (var i = 0; i < user_socks.length; i++) {
        var socket_id = user_socks[i].socket_id;
        var sock = usersIO.connected[socket_id];
        if (!sock) {//send countdown_start event to the client
            return;
        }
        atleat_one_sent = true;
        data.event_name = event_name;
        sock.emit("message", JSON.stringify(data), function (err) {
            if (err) {
                console.log(err);//DO NOT DO THIS IN PRODUCTION
            }
        });

    }


    //check if the packet needs receive acknowledgement
    if (atleat_one_sent && data.acknowledge_received_by) {
        data[ACK_SocketIDs_KEY] = user_socks;
        sObj.redis.set("acknowledge_received_by:" + data.acknowledge_received_by, JSON.stringify(data));
    }
}

module.exports = function (httpServer, _sObj, _util) {
    sObj = _sObj;
    util = _util;
    var io = socketio(httpServer);
    usersIO = io.of("/users"); //using users namespace

    usersIO.on('connection', function (socket) {

        init();

        //console.log('socket.io connected');


        //the client should detect connection event and 
        //send the username immediately to have his session
        //saved
        socket.on('username', function (username) {
            //ok the client has sent the username so
            //save it against the socket id for tracking his
            //socket
            saveSession(socket, username);
        });
        
        socket.on('acknowledge_received', function (msg) {
            if(typeof msg !== 'string'){
                msg = JSON.parse(msg);
            }
            try {
                
                handleReceiveAcknowledgeAction(msg.acknowledge_received_action);
                
                //clear the acknowledgment from the redis
                
                //sObj.redis.rem() //comeback
                
            } catch (e) {
                console.log(e);
            }
            

        });

    });


    function saveSession(socket, user_id) {
        //save the socket id in redis
        var user_sock = {
            socket_id: socket.id,
            user_id: user_id
        };
        sObj.redis.rpush("socket_id:" + user_id, JSON.parse(user_sock))//append
                .then(function (count) {

                    //now ensure the number same user session does not 
                    //exceed our define limit.
                    if (count > sObj.MAX_SESSION_PER_SAME_USERNAME) {
                        //remove the oldest of the same user session and publishing the
                        //socket id via redis since we know that the socket may not be in this 
                        //server
                        var excess_count = count - sObj.MAX_SESSION_PER_SAME_USERNAME;
                        for (var i = 0; i < excess_count; i++) {

                            sObj.redis.lpop("socket_id:" + user_id)//get and remove the first on the list 
                                    .then(function (oldest_user_sock) {
                                        //now publish the socket id for the relevant server process
                                        //to close the user socket
                                        var oldest_socket_id = oldest_user_sock.socket_id;
                                        return sObj.redis.publish(sObj.PUBSUB_USER_SESSION_SIZE_EXCEEDED, oldest_socket_id);
                                    })
                                    .catch(function (err) {
                                        console.log(err);//what can we do anyway - unfortunate
                                    });
                        }
                    }
                })
                .catch(function (err) {
                    //if some went wrong then close the socket
                    socket.disconnect(true);//set to true to close the underlying connection
                });
    }
    
};

function handleReceiveAcknowledgeAction(action){
    
    if(!action){
        return;
    }
    
    switch (action) {
        case 'TODO':
            
            break;
            
        default:
            
            break;
    }
    
}
