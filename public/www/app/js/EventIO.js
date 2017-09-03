

Ns.EventIO = {

    constructor: function () {


        // Make code work by removing call to initConfig and initializing the observable mixin
        //this.initConfig(config);  // We need to initialize the config options when the class is instantiated

        //this.mixins.observable.constructor.call(this, config);

        var url = 'https://' + window.location.hostname + '/users';

        var socket = io.connect(url); //users is the socketio namespace used
        var connTimerId = null;


        socket.on('authenticate', function (msg) {
            //socket.emit('authenticate', TradeApp.Util.getAccessToken());//send the acces token
        });

        socket.on('auth_success', function (msg) {
            //refresh trade platform
            //TradeApp.Util.refreshTradePlatform();
        });

        socket.on('auth_fail', function (msg) {

        });

        socket.on('message', function (msg) {

            if (msg.acknowledge_received_by) {
                var data = {
                    msg_id: msg.msg_id,
                    acknowledge_received_by: msg.acknowledge_received_by,
                    acknowledge_received_action : msg.acknowledge_received_action
                };
                socket.emit('acknowledge_received', data);
            }
            
            //below goes all event sent by the 
            switch (msg.event_name) {
                case "group_join_request":
                    //TODO
                    break;
                case "game_position":
                    //TODO
                    break;
                        
                default:
                    
                    break;
            }
            

        });

        socket.on('disconnect', function (msg) {
            //alert('disconnect');

            connTimerId = tryReconnect(socket);
        });

        socket.on('error', function (msg) {
            //alert('error');
            connTimerId = tryReconnect(socket);
        });

        socket.on('ready', function (msg) {//TESTING!!!
            console.log('socket.io is ready');
        });

        socket.on('connect', function (msg) {
            window.clearInterval(connTimerId);
            //testing!!
            socket.emit('set nickname', 'chukzino');//TESTING!!!
        });

        function tryReconnect(socket) {
            return  window.setInterval(function () {
                if (socket.connected === false) {
                    socket.connect();
                }

            }, 3000);
        }
    },

};