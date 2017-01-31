/* 
 * This file must be require by Ext and must not be loaded my other means. 
 * Typically it should be required in Application.js
 */

Ext.define('TradeApp.TradeSocket', {
    requires: [
        'TradeApp.Util',
        'TradeApp.Const'
    ],
    constructor: function (config) {
        // Make code work by removing call to initConfig and initializing the observable mixin
        //this.initConfig(config);  // We need to initialize the config options when the class is instantiated

        //this.mixins.observable.constructor.call(this, config);

        var url = 'https://' + window.location.hostname + '/traders';

        var socket = io.connect(url); //traders is the socketio namespace used
        var connTimerId = null;


        socket.on('countdown_start', function (msg) {
            var msgObj = JSON.parse(msg);
            if (msgObj.product_type === "options") {
                Ext.GlobalEvents.fireEvent('options_countdown_start', msgObj);
            } else if (msgObj.product_type === "spotfx") {
                Ext.GlobalEvents.fireEvent('spotfx_countdown_start', msgObj);
            }
        });

        socket.on('countdown_over', function (msg) {
            var msgObj = JSON.parse(msg);
            if (msgObj.product_type === "options") {
                Ext.GlobalEvents.fireEvent('options_countdown_over', msgObj);
            } else if (msgObj.product_type === "spotfx") {
                Ext.GlobalEvents.fireEvent('spotfx_countdown_over', msgObj);
            }
        });
        socket.on('pending_order_created', function (msg) {
            var msgObj = JSON.parse(msg);
            if (msgObj.product_type === "options") {
                Ext.GlobalEvents.fireEvent('options_pending_order_created', msgObj);
            } else if (msgObj.product_type === "spotfx") {
                Ext.GlobalEvents.fireEvent('spotfx_pending_order_created', msgObj);
            }
        });
        socket.on('pending_order_deleted', function (msg) {
            var msgObj = JSON.parse(msg);
            if (msgObj.product_type === "options") {
                Ext.GlobalEvents.fireEvent('options_pending_order_deleted', msgObj);
            } else if (msgObj.product_type === "spotfx") {
                Ext.GlobalEvents.fireEvent('spotfx_pending_order_deleted', msgObj);
            }
        });

        socket.on('trade_closed', function (msg) {
            var msgObj = JSON.parse(msg);
            if (msgObj.product_type === "options") {
                Ext.GlobalEvents.fireEvent('options_trade_closed', msgObj);
            } else if (msgObj.product_type === "spotfx") {
                Ext.GlobalEvents.fireEvent('spotfx_trade_closed', msgObj);
            }
        });
        
        socket.on('account_modified', function (msg) {
            Ext.GlobalEvents.fireEvent('account_modified', msg);
        });

        socket.on('price_quote', function (msg) {
            Ext.GlobalEvents.fireEvent('price_quote', msg);
        });

        socket.on('timeframe_quote', function (msg) {
            Ext.GlobalEvents.fireEvent('timeframe_quote', msg);
        });

        socket.on('spotfx_exchange_sold', function (msg) {
            var msgObj = JSON.parse(msg);
            Ext.GlobalEvents.fireEvent('spotfx_exchange_sold', msgObj);
        });

        socket.on('options_exchange_sold', function (msg) {
            var msgObj = JSON.parse(msg);
            Ext.GlobalEvents.fireEvent('options_exchange_sold', msgObj);
        });

        socket.on('spotfx_exchange_bought', function (msg) {
            var msgObj = JSON.parse(msg);
            Ext.GlobalEvents.fireEvent('spotfx_exchange_bought', msgObj);
        });

        socket.on('options_exchange_sold', function (msg) {
            var msgObj = JSON.parse(msg);
            Ext.GlobalEvents.fireEvent('options_exchange_bought', msgObj);
        });


        socket.on('authenticate', function (msg) {
            socket.emit('authenticate', TradeApp.Util.getAccessToken());//send the acces token
        });

        socket.on('auth_success', function (msg) {
            //refresh trade platform
            TradeApp.Util.refreshTradePlatform();
        });

        socket.on('auth_fail', function (msg) {

        });

        socket.on('disconnect', function (msg) {
            //alert('disconnect');

            connTimerId = tryReconnect(socket);
        });

        socket.on('error', function (msg) {
            //alert('error');
            connTimerId = tryReconnect(socket);
        });

        socket.on('connect', function (msg) {
            window.clearInterval(connTimerId);

        });

        function tryReconnect(socket) {
            return  window.setInterval(function () {
                if (socket.connected === false) {
                    socket.connect();
                }

            }, 3000);
        }


    }
});



