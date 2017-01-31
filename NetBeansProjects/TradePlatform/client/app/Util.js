/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.Util', {
    singleton: true,
    /**
     * The application version supported by the server.
     * This is set dynamically
     */
    version: null,
    /*COMMENTED OUT BECAUSE OF THE DIFFULTY OF UPDATING EXTJS COMBOBOX
     * 
     * SYMBOLS:[],//this will be populated dynamically
     INSTRUMENTS_LIST:[],//this is also populated dynamically - contents are sligtly different from SYMBOLS
     getSymbols : function(){
     return this.SYMBOLS;
     },*/


    /**
     * Automaticlally destorys the underlying object if the onHide event method is fired.
     * Typically used for destroying ui components when hidden
     */
    onHideThenDestroy: {
        onHide: function () {
            this.destroy();
            return true;
        }
        , onDestroy: function () {//Note: this method is deprecated as of ExtJS 6.2.*
            //alert("destroy"); // UNCOMENT TO SEE IT IN ACTION
            return true;
        }
    },
    numBars: function () {
        //return 48;
        //console.log('window.screen.width '+ window.screen.width);
        return 84;
    },
    requestTimeframeData: function (store, symbol, cbo, cbo_val, callback) {
        if (this.isRequestingTF) {
            return;
        }
        this.isRequestingTF = true;
        var me = this;
        var tf = this.toTF(cbo_val);
        Ext.Ajax.request({
            url: 'price_timeframe',
            method: 'POST',
            params: 'timeframe=' + tf + '&' + 'symbol=' + symbol,
            success: function (conn, response, options, eOpts) {
                try {

                    var json = JSON.parse(conn.responseText);

                    //NOTE: cbo is very import because we need to detect
                    //if the user has changed the value of combo box
                    if (me.toTF(cbo.value) === json.timeframe) {//check if the value is the same before the request was made
                        store.setData(json.data);
                        me.setChartTFData(symbol, tf, json.data);
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                } catch (e) {
                    console.log(e);
                }

                me.isRequestingTF = false;
            },
            failure: function (conn, response, options, eOpts) {
                me.isRequestingTF = false;
            }
        });

    },
    tfKey: function (symbol, tf) {
        return  TradeApp.Const.TF + ":" + symbol + ":" + tf;
    },
    checkTFDataInit: function (symbol, tf) {
        if (!this.tfData) {
            this.tfData = {};
        }
        if (!symbol) {
            return;
        }
        if (!this.tfData[symbol]) {
            this.tfData[symbol] = {};
        }
        if (!this.tfData[symbol][tf]) {
            this.tfData[symbol][tf] = [];
        }
    },
    getPriceMinMax: function (symbol, tf) {
        this.checkTFDataInit(symbol, tf);
        var prices = this.tfPriceData(symbol, tf);
        if (!prices || prices.length === 0) {
            return;
        }
        var obj = {
            max: prices[0].high,
            min: prices[0].low
        };
        for (var i in prices) {
            var p = prices[i];
            if (p.low < obj.min) {
                obj.min = p.low;
            }
            if (p.high > obj.max) {
                obj.max = p.high;
            }
        }
        return obj;
    },
    addChartTFData: function (tf, priceObj) {

        var symbol = priceObj.symbol;
        if (!symbol) {
            return;
        }
        this.checkTFDataInit(symbol, tf);
        if (this.tfData[symbol][tf].length >= TradeApp.Const.MAX_TIMEFRAME_BARS) {
            this.tfData[symbol][tf].shift(); // remove the first element
        }
        this.tfData[symbol][tf].push(priceObj);

    },
    getLastChartTFPrice: function (symbol, tf) {

        this.checkTFDataInit(symbol, tf);
        var prices = this.tfData[symbol][tf];
        return prices.length > 0 ? prices[prices.length - 1] : null;
    },
    updateChartOHLC: function (quote) {
        if (!this.tfData) {
            return;
        }
        var prices = this.tfData[quote.symbol];
        if (!prices) {
            return;
        }

        var test_length = 0;

        var last = null;
        for (var tf in prices) {
            var tf_prices = prices[tf];
            if (tf_prices.length > 0) {
                last = tf_prices[tf_prices.length - 1];

                last.price = quote.price;
                last.close = quote.price;

                if (!last.high || quote.price > last.high) {
                    last.high = quote.price;
                }
                if (!last.low || quote.price < last.low) {
                    last.low = quote.price;
                }

                if (!last.open) {
                    last.open = quote.price;
                }

                test_length = tf_prices.length;// TESTING!!!
            }
        }

        if (!last) {
            return;
        }


    },
    setChartTFData: function (symbol, tf, prices) {
        this.checkTFDataInit(symbol, tf);
        this.tfData[symbol][tf] = prices;
    },
    tfPriceData: function (symbol, tf) {
        if (!symbol) {
            return null;
        }
        if (!tf) {
            return null;
        }
        if (this.tfData && this.tfData[symbol] && this.tfData[symbol][tf]) {
            return this.tfData[symbol][tf];
        } else {
            try {
                return window.localStorage.getItem(this.tfKey(symbol, tf));
            } catch (e) {
                console.log(e);
            }

        }
    },
    toTF: function (value) {
        if (value === '1 min' || value === '1min') {
            return "1min";
        }
        else if (value === '5 min' || value === '5min') {
            return "5min";
        }
        else if (value === '15 min' || value === '15min') {
            return "15min";
        }
        else if (value === '30 min' || value === '30min') {
            return "30min";
        }
        else if (value === '1 hour' || value === '1hr') {
            return "1hr";
        }
        else if (value === '4 hours' || value === '4hr') {
            return "4hr";
        }
        else if (value === '1 day' || value === '1day') {
            return "1day";
        }
        else if (value === '1 week' || value === '1week') {
            return "1week";
        }
        else if (value === '1 month' || value === '1month') {
            return "1month";
        }
        else if (value === '1 year' || value === '1year') {
            return "1year";
        }

    },
    chartTFData: function (symbol, value) {
        return this.tfPriceData(symbol, this.toTF(value));
    },
    milliTFSecs: function (value) {

        if (value === '1 min' || value === '1min') {
            return 60 * 1000;
        }
        else if (value === '5 min' || value === '5min') {
            return 5 * 60 * 1000;
        }
        else if (value === '15 min' || value === '15min') {
            return 15 * 60 * 1000;
        }
        else if (value === '30 min' || value === '30min') {
            return 30 * 60 * 1000;
        }
        else if (value === '1 hour' || value === '1hr') {
            return 60 * 60 * 1000;
        }
        else if (value === '4 hours' || value === '4hr') {
            return 4 * 60 * 60 * 1000;
        }
        else if (value === '1 day' || value === '1day') {
            return 24 * 60 * 60 * 1000;
        }
        else if (value === '1 week' || value === '1week') {
            return 7 * 24 * 60 * 60 * 1000;
        }
        else if (value === '1 month' || value === '1month') {
            return 30 * 24 * 60 * 60 * 1000;
        }
        else if (value === '1 year' || value === '1year') {
            return 365 * 24 * 60 * 60 * 1000;

        }

    },
    chartTFS: function (value) {

        if (value === '1 min' || value === '1min') {
            return {
                time_step: [Ext.Date.MINUTE, 1],
                dateFormat: 'H:i',
                secs: 60
            };
        }
        else if (value === '5 min' || value === '5min') {
            return {
                time_step: [Ext.Date.MINUTE, 5],
                dateFormat: 'H:i',
                secs: 60 * 5
            };
        }
        else if (value === '15 min' || value === '15min') {
            return {
                time_step: [Ext.Date.MINUTE, 15],
                dateFormat: 'H:i',
                secs: 60 * 15
            };
        }
        else if (value === '30 min' || value === '30min') {
            return {
                time_step: [Ext.Date.MINUTE, 30],
                dateFormat: 'H:i',
                secs: 60 * 30
            };
        }
        else if (value === '1 hour' || value === '1hr') {
            return {
                time_step: [Ext.Date.HOUR, 1],
                dateFormat: 'H:i',
                secs: 60 * 60
            };
        }
        else if (value === '4 hours' || value === '4hr') {
            return {
                time_step: [Ext.Date.HOUR, 4],
                dateFormat: 'H:i',
                secs: 60 * 60 * 4
            };
        }
        else if (value === '1 day' || value === '1day') {
            return {
                time_step: [Ext.Date.DAY, 1],
                dateFormat: 'd-M',
                secs: 60 * 60 * 24
            };
        }
        else if (value === '1 week' || value === '1week') {
            return {
                time_step: [Ext.Date.DAY, 7],
                dateFormat: 'd-M',
                secs: 60 * 60 * 24 * 7
            };
        }
        else if (value === '1 month' || value === '1month') {
            return {
                time_step: [Ext.Date.MONTH, 1],
                dateFormat: 'M-Y',
                secs: 60 * 60 * 24 * 30
            };
        }
        else if (value === '1 year' || value === '1year') {
            return {
                time_step: [Ext.Date.YEAR, 1],
                dateFormat: 'Y',
                secs: 60 * 60 * 24 * 365
            };
        }

    },
    logout: function () {
        window.sessionStorage.clear();//clear the user session - remember you are using JWT. So we are concern about the client session.
        var loginBtn = Ext.getCmp("platf-login-button");
        loginBtn.setText(TradeApp.Const.LOGIN_TXT);
        var udEl = document.getElementById('user-name-display');
        udEl.innerHTML = TradeApp.Const.NOT_LOGGED_IN_TXT;//indicate the user is not logged in
        this.user = null;
    },
    clearGrids: function (grids) {
        for (var i = 0; i < grids.length; i++) {
            var d = grids[i];
            var grid = null;
            if (Ext.isString(d)) {//we assume grid id
                grid = Ext.getCmp(d);
                if (!grid) {
                    console.warn("unknown grid id - " + d);
                    return;
                }
            } else {
                grid = d; //the grid itself
            }

            grid.getStore().removeAll();
            grid.getView().refresh();
        }
    },
    isLogin: function () {
        return window.sessionStorage.getItem(TradeApp.Const.TOKEN_KEY) || 0;
    },
    login: function () {
        window.sessionStorage.clear();//JUST IN CASE! And this will also help for the purpose of normalizeLogin
        Ext.create('TradeApp.view.main.LoginDialog', this.onHideThenDestroy).show();
    },
    //handles some abnomality i observed. maybe because the session storage failed to clear - i do not understand why!
    normalizeLogin: function () {
        if (this.isLogin()) {
            var loginBtn = Ext.getCmp("platf-login-button");
            var udEl = document.getElementById('user-name-display');
            if (loginBtn.getText() === TradeApp.Const.LOGIN_TXT || udEl.innerHTML === TradeApp.Const.NOT_LOGGED_IN_TXT) {
                //Oops! But why?
                //Anyway, ask the user to re-login
                this.login();
                return true; // this indicates the abnormality which will be tested against
            }
        }
    },
    loginIfNot: function () {
        var token = window.sessionStorage.getItem(TradeApp.Const.TOKEN_KEY);
        if (!token) {
            this.login();
        }
    },
    afterLogin: function () {
        var str_user = window.sessionStorage.getItem(TradeApp.Const.USER_KEY);
        if (!str_user) {
            return;
        }
        try {

            this.user = JSON.parse(str_user);
            //display the name of user on the platform.
            var firstName = this.user.firstName;
            var lastName = this.user.lastName;
            var accType = "";
            if (this.user.live === 0) {
                accType = "DEMO - ";
            } else if (this.user.live === 1) {
                accType = "LIVE - ";
            }
            var udEl = document.getElementById('user-name-display');
            udEl.innerHTML = accType + firstName + " " + lastName;

            //change the login button to log out 
            Ext.getCmp("platf-login-button").setText(TradeApp.Const.LOGOUT_TXT);

            this.initPlatformData();//important!
        } catch (e) {
            console.log(e);
        }

    },
    getUser: function () {
        if (!this.user) {
            var str_user = window.sessionStorage.getItem(TradeApp.Const.USER_KEY);
            try {
                this.user = JSON.parse(str_user);
            } catch (e) {
                console.log(e);
            }
        }

        return this.user;
    },
    getUserExchangeId: function () {
        if (this.getUser() && this.user.exchangeId) {
            return this.user.exchangeId;
        }
        return null;
    },
    getAccessToken: function () {
        if (!TradeApp.Const) {
            return "";
        }

        return window.sessionStorage.getItem(TradeApp.Const.TOKEN_KEY);
    },
    /**
     * This will load the various sections of the platform data by sending
     * request to the server
     * @returns {undefined}  
     */
    initPlatformData: function () {
        this.startUpInfo();
        this.clearRelevantGrids();//important! to avoid view another persons record accidentally due to network failure.
        this.loadRelevantGrids();

    },
    /**
     * Get special info from server like:
     *
     * - server time
     * - user account balance
     * - other special info
     * 
     * @returns {undefined}   
     */
    startUpInfo: function () {

        var me = this;
        Ext.Ajax.request({
            url: 'unver/startup',
            method: 'POST',
            params: "access_token=" + TradeApp.Util.getAccessToken(),
            success: function (conn, response, options, eOpts) {
                try {

                    var data = JSON.parse(conn.responseText);
                    //document.getElementById('platform-time-display').innerHTML = '';

                    /*COMMENTED OUT BECAUSE OF THE DIFFULTY OF UPDATING EXTJS COMBOBOX
                     me.SYMBOLS = data.symbols;//set the symbols
                     me.INSTRUMENTS_LIST = [];
                     me.INSTRUMENTS_LIST = me.INSTRUMENTS_LIST.concat(TradeApp.Const.ALL_INSTRUMENTS);
                     me.INSTRUMENTS_LIST = me.INSTRUMENTS_LIST.concat(data.symbols);
                     */

                    me.version = data.version;

                    TradeApp.Const.SYMBOLS_ATTR = data.symbols_attr;

                    me.syncServerTime(data.time);

                    Ext.GlobalEvents.fireEvent('account_info',
                            {
                                account_balance: data.account_balance,
                                initial_deposit: data.initial_deposit
                            });
                } catch (e) {
                    console.log(e); // uncomment in production
                }

            },
            failure: function (conn, response, options, eOpts) {

            }
        });

    },
    requestAccountBalance: function () {
        var me = this;
        Ext.Ajax.request({
            url: 'access_247/account_info',
            method: 'POST',
            params: "access_token=" + TradeApp.Util.getAccessToken()
                    + "&version=" + TradeApp.Util.version,
            success: function (conn, response, options, eOpts) {
                try {
                    var data = JSON.parse(conn.responseText);
                    Ext.GlobalEvents.fireEvent('account_info',
                            {
                                account_balance: data.account_balance
                            });
                } catch (e) {
                    console.log(e); // uncomment in production
                }

            },
            failure: function (conn, response, options, eOpts) {

            }
        });

    },
    requestServerTime: function () {
        var me = this;
        Ext.Ajax.request({
            url: 'access_247/time',
            method: 'POST',
            params: "access_token=" + TradeApp.Util.getAccessToken()
                    + "&version=" + TradeApp.Util.version,
            success: function (conn, response, options, eOpts) {
                try {
                    var data = JSON.parse(conn.responseText);
                    //for some reason data.time is NaN - we do not know why!
                    if (data.success && !isNaN(data.time)) {
                        me.syncServerTime(data.time);
                    }else{
                        window.setTimeout(requestServerTime , 5000);//try again!
                        return;
                    }
                } catch (e) {
                    console.log(e);
                }
                me.isRequentingServerTime = false;
            },
            failure: function (conn, response, options, eOpts) {
                //do nothing - not interested!
                me.isRequentingServerTime = false;
            }
        });

    },
    //not yet tested - COME BACK FOR TESTINGING ABEG O!!!
    syncServerTime: function (time) {
        var date = new Date(time);
        var utc_hr = date.getUTCHours();
        var dt = new Date(time);
        time = dt.getTime();

        var me = this;
        me.lastServerTime = time;
        me.lastLocalTime = new Date().getTime();
        me.nextServerTime = time;
        if (me.timerControlId) {
            window.clearInterval(me.timerControlId);//JUST IN CASE - IMPORTANT!
        }
        me.timerControlId = window.setInterval(function () {
            var currenLocalTime = new Date().getTime();
            var currentServerDateTime = new Date(me.nextServerTime);
            var currentServerTime = currentServerDateTime.getTime();
            var local_elapse = currenLocalTime - me.lastLocalTime;
            var server_elapse = currentServerTime - me.lastServerTime;

            //check for invalid server/local time synchronization.
            // the local elapse time is expected to be equal to the server elapse time.
            //But a tolerance of 15 seconds will be given. If the tolerance is exceed the
            //synchronization will be rendered invalid and a new servr time will be requested.
            var TOLERANCE = 15 * 1000;
            if (Math.abs(local_elapse - server_elapse) > TOLERANCE) {
                console.log("request server time after tolerance exceeded!");
                //window.clearInterval(me.timerControlId);//clear the time to ensure the request is not requested
                if (!me.isRequentingServerTime) {
                    me.isRequentingServerTime = true;
                    me.requestServerTime();//request new server time
                }
                return;
            }

            //At this point the synchronizatioon is within tolerance limit

            var strTime = currentServerDateTime.toUTCString().substring(0, 25);
            var eids = TradeApp.Const.PLATFORM_TIME_ELEMENT_IDS;

            var elems = document.getElementsByClassName("flatbook-server-time");
            for (var i = 0; i < elems.length; i++) {
                elems[i].innerHTML = strTime;
            }
            /*var e = null;
             for (var i in  eids) {
             var id = eids[i];
             var e = document.getElementById(id);
             if (e) {
             e.innerHTML = strTime;
             } else {
             //console.log("unknown time element id "+ id); //uncomment only for debugging purpose. this only occurs when the element is not yet created
             }
             }*/

            me.nextServerTime += 1000;

        }, 1000);

    },
    /**
     * This will clear the relevant grids 
     * @returns {undefined}  
     */
    clearRelevantGrids: function () {

        //list all the grids to load specifying the grid id
        var grid_ids = [
            "exchange-options-grid-id",
            "exchange-spotfx-grid-id",
            "personal-exchange-options-grid-id",
            "personal-exchange-spotfx-grid-id",
            "trade-history-options-grid-id",
            "trade-history-spotfx-grid-id",
            "trade-open-options-grid-id",
            "trade-open-spotfx-grid-id",
            "deposits-and-withdrawals-id",
            "pending-order-options-grid-id",
            "pending-order-spotfx-grid-id"
                    //more may go here
        ];

        this.clearGrids(grid_ids);

    },
    /**
     * This will load the relevant grids 
     * @returns {undefined}  
     */
    loadRelevantGrids: function (obj) {
        if (!obj) {
            obj = {};
        }
        //list all the grids to load specifying the grid id
        var grid_ids = [
            "exchange-options-grid-id",
            "exchange-spotfx-grid-id",
            "personal-exchange-options-grid-id",
            "personal-exchange-spotfx-grid-id",
            "trade-history-options-grid-id",
            "trade-history-spotfx-grid-id",
            "trade-open-options-grid-id",
            "trade-open-spotfx-grid-id",
            "deposits-and-withdrawals-id",
            "pending-order-options-grid-id",
            "pending-order-spotfx-grid-id"
                    //more may go here
        ];
        obj.len = grid_ids.length;
        obj.doneCount = 0;
        for (var i = 0; i < grid_ids.length; i++) {
            this.refreshGrid(grid_ids[i], true, function (o) {
                o.doneCount++;
                if (o.doneCount === o.len) {
                    if (typeof o.finishAll === "function") {
                        o.finishAll();
                    }
                }
            }, obj);
        }


    },
    //second or third parameter can be the call back
    refreshGrid: function (d, force, cback, param) {//force means refresh uncondionally
        var callbackFunc = null;
        if (typeof force === "function") {
            callbackFunc = force;
        } else if (typeof cback === "function") {
            callbackFunc = cback;
        }
        var grid = null;
        if (!d) {
            console.warn("grid or grid id not provided!");
            return;
        }
        if (Ext.isString(d)) {//we assume grid id
            grid = Ext.getCmp(d);
            if (!grid) {
                console.warn("unknown grid id - " + d);
                return;
            }
        } else {
            grid = d; //the grid itself
        }

        var store = grid.getStore();
        if (store.getCount() === 0 || force === true) { //must test 'force' as true
            store.reload({
                callback: function () {
                    grid.getView().refresh();
                    if (callbackFunc) {
                        callbackFunc(param);
                    }
                }
            });
        }
    },
    /**
     * A convinient way to update the content of a grid cell.
     * This updates the first cell found.
     * 
     * NOTE : To update all cell that match the condition use updateGridWhereAll
     *
     * @param {type} callback - a callback function to perform the operation
     * @param {type} d - the target grid or grid id
     * @param {type} column - the selected column name
     * @param {type} column_value - the cell value of the selected column which will be updated
     * @returns {undefined}  
     */
    updateGridWhere: function (callback, d, column, column_value) {

        var grid = null;
        if (!d) {
            console.warn("grid or grid id not provided!");
            return true;
        }
        if (Ext.isString(d)) {//we assume grid id
            grid = Ext.getCmp(d);
            if (!grid) {
                console.warn("unknown grid id - " + d);
                return true;
            }
        } else {
            grid = d; //the grid itself
        }


        var models = grid.getStore().getRange();
        for (var i = 0; i < models.length; i++) {
            var record = models[i];
            if (record.get(column) === column_value) {
                callback(record);
                return true;
            }
        }

        return false;
    },
    /**
     * A convinient way to update the content of a grid cell.
     * This updates all cells found that match the condition.
     * 
     *
     * @param {type} callback - a callback function to perform the operation
     * @param {type} d - the target grid or grid id
     * @param {type} column - the selected column name
     * @param {type} column_values - the cell value of the selected column which will be updated
     * @returns {undefined}  
     */
    updateGridWhereAll: function (callback, d, column, column_values) {

        var grid = null;
        if (!d) {
            console.warn("grid or grid id not provided!");
            return true;
        }
        if (Ext.isString(d)) {//we assume grid id
            grid = Ext.getCmp(d);
            if (!grid) {
                console.warn("unknown grid id - " + d);
                return true;
            }
        } else {
            grid = d; //the grid itself
        }

        var values = [];
        if (typeof column_values === "string") {
            values.push(column_values);
        } else if (Ext.isArray(column_values)) {
            values = column_values;
        } else {
            return;
        }

        var store = grid.getStore();
        store.beginUpdate();
        var found = false;
        for (var c = 0; c < values.length; c++) {
            var models = store.getRange();
            for (var i = 0; i < models.length; i++) {
                var record = models[i];
                if (record.get(column) === values[c]) {
                    callback(record);
                    found = true;
                }
            }
        }
        store.endUpdate();
        grid.getView().refresh();

        return found;
    },
    deleteGridWhere: function (d, column, column_values) {

        var grid = null;
        if (!d) {
            console.warn("grid or grid id not provided!");
            return true;
        }
        if (Ext.isString(d)) {//we assume grid id
            grid = Ext.getCmp(d);
            if (!grid) {
                console.warn("unknown grid id - " + d);
                return true;
            }
        } else {
            grid = d; //the grid itself
        }

        var values = [];
        if (typeof column_values === "string") {
            values.push(column_values);
        } else if (Ext.isArray(column_values)) {
            values = column_values;
        } else {
            return;
        }

        var store = grid.getStore();
        store.beginUpdate();
        var found = false;
        for (var c = 0; c < values.length; c++) {
            var models = store.getRange();
            for (var i = 0; i < models.length; i++) {
                var record = models[i];
                if (record.get(column) === values[c]) {
                    //callback(record);
                    store.removeAt(i);

                    found = true;
                    break;
                }
            }
        }
        store.endUpdate();
        grid.getView().refresh();

        return found;
    },
    getExchangeSpotFxUpdateCount: function () {
        if (!this.exchange_spotfx_update_count) {
            return this.exchange_spotfx_update_count = 0; //yes set to zero and return
        }
        return this.exchange_spotfx_update_count;
    },
    incrementExchangeSpotFxUpdateCount: function () {
        if (!this.exchange_spotfx_update_count) {
            return this.exchange_spotfx_update_count = 1; //yes set to 1 and return
        }
        return ++this.exchange_spotfx_update_count;
    },
    clearExchangeSpotFxUpdateCount: function () {
        this.exchange_spotfx_update_count = 0;
    },
    getExchangeOptionsUpdateCount: function () {
        if (!this.exchange_options_update_count) {
            return this.exchange_options_update_count = 0; //yes set to zero and return
        }
        return this.exchange_options_update_count;
    },
    incrementExchangeOptionsUpdateCount: function () {
        if (!this.exchange_options_update_count) {
            return this.exchange_options_update_count = 1; //yes set to 1 and return
        }
        return ++this.exchange_options_update_count;
    },
    clearExchangeOptionsUpdateCount: function () {
        this.exchange_options_update_count = 0;
    },
    getGridsOrderTickets: function (grid_ids, filter) {
        var tickets = [];
        for (var i = 0; i < grid_ids.length; i++) {
            var d = grid_ids[i];
            var grid = null;
            if (Ext.isString(d)) {//we assume grid id
                grid = Ext.getCmp(d);
                if (!grid) {
                    console.warn("unknown grid id - " + d);
                    return;
                }
            } else {
                grid = d; //the grid itself
            }

            var store = grid.getStore();

            var models = store.getRange();

            for (var k = 0; k < models.length; k++) {
                var record = models[k];
                var ticket = record.get('order');

                if (typeof filter === "function") {
                    if (filter(record)) {
                        tickets.push(ticket);
                    }
                } else {
                    tickets.push(ticket);
                }
            }

        }

        return tickets;

    },
    showRegisterPage: function () {

        Ext.GlobalEvents.fireEvent('switch_from_login',
                {
                    callback: function () {
                        try {
                            Ext.getCmp('main').setActiveTab('register-tab');
                        } catch (e) {
                            console.error(e);
                        }

                    }
                });

    },
    showForgotPasswordPage: function () {

        Ext.GlobalEvents.fireEvent('switch_from_login',
                {
                    callback: function () {
                        Ext.create('TradeApp.view.main.ForgotPasswordDialog', TradeApp.Util.onHideThenDestroy).show();
                    }
                });

    },
    doTradeGridCountdown: function (grid, order_ticket, countdown) {
        var me = this;
        //first refresh the grid to display the latest record
        this.refreshGrid(grid, true, function () {
            //now update the grid
            me.updateGridWhere(function (record) {
                TradeApp.Countdown.start(function (cd_value, remain_sec) {
                    record.set('countdown', cd_value);
                }, order_ticket, countdown);
            }, grid, 'order', order_ticket);
        });

    },
    refreshTradePlatform: function () {

        //refresh relevant platform activities
        var me = this;
        this.startUpInfo();
        this.loadRelevantGrids({
            finishAll: function () {
                me.refreshCountdown();
            }
        });//e.g open positions , history trades and exchanges posted

        this.refreshChart();
    },
    refreshCountdown: function () {
        //first get all the order tickets whose open prices are zero
        var grid_ids = [
            "trade-open-options-grid-id",
            "trade-open-spotfx-grid-id"
        ];
        var tickets = this.getGridsOrderTickets(grid_ids, function (record) {
            return !record.get('open');// where it has no open price
        });

        var order_tickets = JSON.stringify(tickets);
        var me = this;
        Ext.Ajax.request({
            url: 'access_247/refresh/countdown',
            method: 'POST',
            params: "access_token=" + TradeApp.Util.getAccessToken()
                    + "&order_tickets=" + order_tickets
                    + "&version=" + TradeApp.Util.version,
            success: function (conn, response, options, eOpts) {
                try {
                    var msg = JSON.parse(conn.responseText);
                    if (msg.success) {
                        var grid_id;
                        for (var i = 0; i < msg.countdown_orders.length; i++) {

                            var product_type = msg.countdown_orders[i].product_type;
                            var order_ticket = msg.countdown_orders[i].order_ticket;
                            var countdown = msg.countdown_orders[i].countdown_remaining;

                            if (product_type === "options") {
                                grid_id = 'trade-open-options-grid-id';
                            } else if (product_type === "spotfx") {
                                grid_id = 'trade-open-spotfx-grid-id';
                            }

                            console.log(msg.countdown_orders[i]);//TESTING!!!

                            //me.doTradeGridCountdown(grid_id, order_ticket, countdown);// WRONG IN THIS CASE HERE! SO WE COMMENTED IT OUT

                            var grid = Ext.getCmp(grid_id);
                            if (grid) {
                                me.updateGridWhere(function (record) {
                                    TradeApp.Countdown.start(function (cd_value, remain_sec) {
                                        record.set('countdown', cd_value);
                                    }, order_ticket, countdown);
                                }, grid, 'order', order_ticket);
                            }

                        }
                    } else if (msg.status === TradeApp.Const.AUTH_FAIL) {
                        //do something later - like display global message on top of the page like in gmail
                    } else {
                        //do something later - like display global message on top of the page like in gmail
                    }
                } catch (e) {
                    console.log(e);
                }

            },
            failure: function (conn, response, options, eOpts) {
                //do nothing - not interested!
            }
        });
    },
    refreshChart: function () {
        //use socketio event here
    }
});


