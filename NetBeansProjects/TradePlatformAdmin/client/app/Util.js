/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeAdmin.Util', {
    singleton: true,
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
    isLogin: function () {
        return window.sessionStorage.getItem(TradeAdmin.Const.TOKEN_KEY) || 0;
    },
    afterLogin: function () {
        var str_user = window.sessionStorage.getItem(TradeAdmin.Const.USER_KEY);
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
            udEl.innerHTML = accType + firstName + (lastName ? (" " + lastName) : "");

            //change the login button to log out 
            Ext.getCmp("platf-logout-button").setVisible(true);

        } catch (e) {
            console.log(e);
        }

    },
    getUser: function () {
        if (!this.user) {
            var str_user = window.sessionStorage.getItem(TradeAdmin.Const.USER_KEY);
            try {
                this.user = JSON.parse(str_user);
            } catch (e) {
                console.log(e);
            }
        }

        return this.user;
    },
    getAccessToken: function () {
        if (!TradeAdmin.Const) {
            return "";
        }

        return window.sessionStorage.getItem(TradeAdmin.Const.TOKEN_KEY);
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
    //second or third parameter can be the call back
    refreshGrid: function (d, force, cback) {//force means refresh uncondionally
        var callbackFunc = null;
        if (typeof force === "function") {
            callbackFunc = force;
        } else if (typeof cback === "function") {
            callbackFunc = cback;
        }
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
        if (store.getCount() === 0 || force === true) { //must test 'force' as true
            store.reload({
                callback: function () {
                    grid.getView().refresh();
                    if (callbackFunc) {
                        callbackFunc();
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
     * @param {type} grid - the target grid
     * @param {type} column - the selected column name
     * @param {type} column_value - the cell value of the selected column which will be updated
     * @returns {undefined}  
     */
    updateGridWhere: function (callback, grid, column, column_value) {
        if (!grid) {
            return true;
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
     * @param {type} grid - the target grid
     * @param {type} column - the selected column name
     * @param {type} column_values - the cell value of the selected column which will be updated
     * @returns {undefined}  
     */
    updateGridWhereAll: function (callback, grid, column, column_values) {
        if (!grid) {
            return true;
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
    deleteGridWhere: function (grid, column, column_values) {
        if (!grid) {
            return true;
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
    autoLiveTraderIdentity: function (form) {
        var me = this;

        Ext.Ajax.request({
            url: 'access/auto_live_trader_identity',
            method: 'POST',
            params: "access_token=" + TradeAdmin.Util.getAccessToken(),
            success: function (conn, response, options, eOpts) {
                try {
                    var data = JSON.parse(conn.responseText);
                    form.findField('username').setValue(data.msg.username);
                    form.findField('exchange_id').setValue(data.msg.exchange_id);
                    form.findField('password').setValue(data.msg.password);
                } catch (e) {
                    console.log(e);
                }
            },
            failure: function (conn, response, options, eOpts) {
                //do nothing - not interested!

            }
        });

    },
    getCurrentRebate: function (cmp) {
        var me = this;
        Ext.Ajax.request({
            url: 'access/current_rebate',
            method: 'POST',
            params: "access_token=" + TradeAdmin.Util.getAccessToken(),
            success: function (conn, response, options, eOpts) {
                try {
                    var data = JSON.parse(conn.responseText);
                    if (data.success) {
                        cmp.query("[name=total_open_trades]")[0].setValue(data.rebate.open_positions);
                        cmp.query("[name=day_commission]")[0].setValue(data.rebate.day_commission);
                        cmp.query("[name=day_account_balance]")[0].setValue(data.rebate.day_account_balance);
                    }

                } catch (e) {
                    console.log(e); // uncomment in production
                }

            },
            failure: function (conn, response, options, eOpts) {

            }
        });

    },
    requestAccountBalance: function (username, live, callback) {
        var me = this;
        Ext.Ajax.request({
            url: 'access/account_info',
            method: 'POST',
            params: "access_token=" + TradeAdmin.Util.getAccessToken() + "&username=" + username + "&live=" + live,
            success: function (conn, response, options, eOpts) {
                try {
                    var data = JSON.parse(conn.responseText);
                    if (typeof callback === "function") {
                        callback({
                            account_balance: data.account_balance
                        });
                    }

                } catch (e) {
                    console.log(e); // uncomment in production
                }

            },
            failure: function (conn, response, options, eOpts) {

            }
        });

    }
});


