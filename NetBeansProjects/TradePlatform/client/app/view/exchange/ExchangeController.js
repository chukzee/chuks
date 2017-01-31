/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */

Ext.define('TradeApp.view.exchange.ExchangeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.exchange',
    //requires:['TradeApp.Util'],

    listen: {
        //listen to events using GlobalEvents
        global: {
            check_exchange_update: 'onCheckExchangeUpdate',
            options_exchange_sold: 'onOptionsExchangeOperation',
            spotfx_exchange_sold: 'onSpotFxExchangeOperation',
            options_exchange_bought: 'onOptionsExchangeOperation',
            spotfx_exchange_bought: 'onSpotFxExchangeOperation'
        }
    },
    onItemSelected: function (sender, record) {

        //Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirmChuks', this);
    },
    onConfirmChuks: function (choice) {
        if (choice === 'yes') {
            //alert("I change this fucntion from onConfirm to onConfirmChuks");
        }
    },
    onGeneralOptionsSellerIdChange: function (s, r) {

        var grid = Ext.getCmp("exchange-options-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterSellerId = s.getValue() === "" ? null : s.getValue();

    },
    onGeneralOptionsSellerIdExec: function (s, e) {
        if (e.getKey() === Ext.EventObject.ENTER) {
            var grid = Ext.getCmp("exchange-options-grid-id");
            TradeApp.Util.refreshGrid(grid, true);
        }
    },
    onGeneralOptionsProductSelected: function (s, r) {
        var grid = Ext.getCmp("exchange-options-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterProduct = s.getValue() === TradeApp.Const.ALL_TYPES ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onGeneralOptionsMethodSelected: function (s, r) {
        var grid = Ext.getCmp("exchange-options-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterMethod = s.getValue() === TradeApp.Const.PRICE_TIME ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onGeneralSpotFxMethodSelected: function (s, r) {
        var grid = Ext.getCmp("exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterMethod = s.getValue() === TradeApp.Const.PRICE_TIME ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onPersonalOptionsMethodSelected: function (s, r) {
        var grid = Ext.getCmp("personal-exchange-options-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterMethod = s.getValue() === TradeApp.Const.PRICE_TIME ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onPersonalSpotFxMethodSelected: function (s, r) {
        var grid = Ext.getCmp("personal-exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterMethod = s.getValue() === TradeApp.Const.PRICE_TIME ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onGeneralSpotFxSellerIdChange: function (s, r) {

        var grid = Ext.getCmp("exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterSellerId = s.getValue() === "" ? null : s.getValue();

    },
    onGeneralSpotFxSellerIdExec: function (s, e) {
        if (e.getKey() === Ext.EventObject.ENTER) {
            var grid = Ext.getCmp("exchange-spotfx-grid-id");
            TradeApp.Util.refreshGrid(grid, true);
        }
    },
    onGeneralSpotFxSymbolSelected: function (s, r) {

        var grid = Ext.getCmp("exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterSymbol = s.getValue() === TradeApp.Const.ALL_INSTRUMENTS ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onGeneralSpotFxDirectionSelected: function (s, r) {

        var grid = Ext.getCmp("exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterDirection = s.getValue() === TradeApp.Const.BUY_SELL ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onPersonalOptionsProductSelected: function (s, r) {

        var grid = Ext.getCmp("personal-exchange-options-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterProduct = s.getValue() === TradeApp.Const.ALL_TYPES ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onPersonalSpotFxSymbolSelected: function (s, r) {

        var grid = Ext.getCmp("personal-exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterSymbol = s.getValue() === TradeApp.Const.ALL_INSTRUMENTS ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onPersonalSpotFxDirectionSelected: function (s, r) {

        var grid = Ext.getCmp("personal-exchange-spotfx-grid-id");
        var store = grid.getStore();
        var p = store.getProxy();
        var params = p.getExtraParams();
        params.filterDirection = s.getValue() === TradeApp.Const.BUY_SELL ? null : s.getValue();
        TradeApp.Util.refreshGrid(grid, true);
    },
    onSpotfxBuyerAction: function (maybe_grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        if (cellIndex === 1) {
            Ext.create('TradeApp.view.exchange.BuyerSportfxConfirmDialog', TradeApp.Util.onHideThenDestroy).show();
            var form = Ext.getCmp('buyer-spotfx-comfirm-form');
            form.getForm().loadRecord(record);
        }

    },
    onOptionsBuyerAction: function (maybe_grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        if (cellIndex === 1) {
            Ext.create('TradeApp.view.exchange.BuyerOptionsConfirmDialog', TradeApp.Util.onHideThenDestroy).show();
            var form = Ext.getCmp('buyer-options-comfirm-form');
            form.getForm().loadRecord(record);
        }
    },
    onExchangeSpotFxRecentUpdate: function () {

        var grid = Ext.getCmp("exchange-spotfx-grid-id");
        var btn = Ext.getCmp("btn_spotfx_recent_update");
        if (TradeApp.Util.getExchangeSpotFxUpdateCount() > 0) {
            TradeApp.Util.refreshGrid(grid, true, function () {
                TradeApp.Util.clearExchangeSpotFxUpdateCount();
                btn.setText("No recent update");
            });
        } else {
            btn.setText("No recent update");
        }
    },
    onExchangeOptionsRecentUpdate: function () {

        var grid = Ext.getCmp("exchange-options-grid-id");
        var btn = Ext.getCmp("btn_options_recent_update");
        if (TradeApp.Util.getExchangeOptionsUpdateCount() > 0) {
            TradeApp.Util.refreshGrid(grid, true, function () {
                TradeApp.Util.clearExchangeOptionsUpdateCount();
                btn.setText("No recent update");
            });
        } else {
            btn.setText("No recent update");
        }
    },
    onCheckExchangeUpdate: function () {
        this.onExchangeOptionsRecentUpdate();
        this.onExchangeSpotFxRecentUpdate();
        return false;//important! prevent further call - i suppose it is a bug.
    },
    onSpotFxExchangeOperation: function (msg) {
        if (msg.seller_id === TradeApp.Util.getUserExchangeId()) {
            return;//no need since we already refresh the grid immediately after it was sold
        }

        var increment = TradeApp.Util.incrementExchangeSpotFxUpdateCount();
        var btn = Ext.getCmp("btn_spotfx_recent_update");
        btn.setText(increment < 2 ? increment + " recent update" : increment + " recent updates");

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onOptionsExchangeOperation: function (msg) {
        if (msg.seller_id === TradeApp.Util.getUserExchangeId()) {
            return;//no need since we already refresh the grid immediately after it was sold
        }

        var increment = TradeApp.Util.incrementExchangeOptionsUpdateCount();
        var btn = Ext.getCmp("btn_options_recent_update");
        btn.setText(increment < 2 ? increment + " recent update" : increment + " recent updates");
        return false;//important! prevent further call - i suppose it is a bug.
    },
    onPersonalExchangeSpotDelete: function () {

        var grid = Ext.getCmp("personal-exchange-spotfx-grid-id");
        var records = grid.getSelectionModel().getSelection();
        this.doExchangeDelete(grid, records, "spotfx");
    },
    onPersonalExchangeOptionsDelete: function () {

        var grid = Ext.getCmp("personal-exchange-options-grid-id");
        var records = grid.getSelectionModel().getSelection();
        this.doExchangeDelete(grid, records, "options");
    },
    onDeletePersonalExchangeSpotRowClick:
            function (maybe_grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                var grid = Ext.getCmp("personal-exchange-spotfx-grid-id");
                var columnCount = grid.columns.length;
                //NOTE: since we are using spreadsheet selection model the 
                //cellIndex we are look for is columnCount + 1 but it we
                //use checkbox selection model the cellIndex is equal to columnCount
                if (cellIndex === columnCount + 1) {
                    this.doExchangeDelete(grid, [record], "spotfx");
                }

            },
    onDeletePersonalExchangeOptionsRowClick:
            function (maybe_grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                var grid = Ext.getCmp("personal-exchange-options-grid-id");
                var columnCount = grid.columns.length;
                //NOTE: since we are using spreadsheet selection model the 
                //cellIndex we are look for is columnCount + 1 but it we
                //use checkbox selection model the cellIndex is equal to columnCount                
                if (cellIndex === columnCount + 1) {
                    this.doExchangeDelete(grid, [record], "options");
                }
            },
    doExchangeDelete: function (grid, selected_records, product_type) {
        var order_tickets = "";
        //var norm_order_tickets = "";
        for (var r in selected_records) {
            order_tickets += selected_records[r].get("order") + ",";
            //norm_order_tickets += "'" + selected_records[r].get("order") + "',";
        }
        if (!order_tickets || order_tickets === "") {
            return;
        }

        order_tickets = order_tickets.substring(0 - order_tickets.length - 1); // remove (,)
        //norm_order_tickets = norm_order_tickets.substring(0 - norm_order_tickets.length - 1); // remove (,)

        var me = this;
        Ext.Msg.confirm('Confirm', 'You are about to delete ' + selected_records.length + ' selected ' + (selected_records.length > 1 ? 'records.' : 'record.')
                + '<br/>Do you want to continue?', function (choice) {
                    if (choice !== 'yes') {
                        return;
                    }
                    Ext.Ajax.request({
                        url: 'access/delete/exchange/' + product_type,
                        method: 'POST',
                        params: "access_token=" + TradeApp.Util.getAccessToken()
                                + "&version=" + TradeApp.Util.version
                                + "&order_ticket_list=" + order_tickets,
                        success: function (conn, response, options, eOpts) {
                            try {
                                var result = JSON.parse(conn.responseText);
                                
                                if (result.success) {
                                    Ext.Msg.alert('Success', result.msg);
                                    TradeApp.Util.deleteGridWhere(grid, 'order', order_tickets.split(','));
                                }  else if (result.status === TradeApp.Const.AUTH_FAIL) {
                                    Ext.Msg.confirm("Authentication",
                                            "You may have to login to perform this operation!"
                                            + "<br/>Do you want to login?", function (option) {
                                                if (option === "yes") {
                                                    TradeApp.Util.login();
                                                }
                                            });
                                }else if (result.status === TradeApp.Const.UNSUPPORTED_VERSION) {
                                    //Ext.Msg.alert("Unsupporte Version", "The application version has changed. In order to continue this page must be reloaded!"
                                    //      +" <br/>NOTE: If you see this message again after reload then clear your browse cache before reloading the page.");
                                    Ext.Msg.show({
                                        title: "Unsupported Version",
                                        msg: "The application version has changed. In order to continue this page must be reloaded!"
                                                + " <p><strong>NOTE: If you see this message again after reloading then clear your browse cache before reloading the page.</strong></p>",
                                        buttons: Ext.Msg.OK,
                                        fn: function (btn) {
                                            window.location = 'https://' + window.location.hostname;
                                        }
                                    });

                                   
                                }else{
                                    Ext.Msg.alert('Failed', result.msg);
                                }

                            } catch (e) {
                                console.log(e);
                            }
                        },
                        failure: function (conn, response, options, eOpts) {
                            Ext.Msg.alert('Failed', 'Connection problem!');
                        }
                    });

                }, this);

    }


});
//personal-exchange-options-grid-id

