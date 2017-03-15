/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeApp.view.exchange.BuyerSportfxConfirmDialog', {
    extend: 'Ext.window.Window',
    xtype: 'spotfx-buyer-confirm-dialog',
    title: 'Please confirm your selection',
    reference: 'buyerSpotfxConfirm',
    requires: ['TradeApp.Const'],
    width: 550,
    height: window.screen.height <= 550 ? 450 : (window.screen.height <= 800 ? 500 : 650),
    minWidth: 300,
    minHeight: 300,
    layout: 'fit',
    modal: true, //important - to lock the parent window while this window is visible - this will prevent opening another window from the parent window until this window is close
    //defaultFocus: 'firstName',
    closeAction: 'hide',
    items: [{
            xtype: 'form',
            id: 'buyer-spotfx-comfirm-form',
            //url: '', we will not use form submit but ext ajax request - see below
            autoScroll: true,
            layout: {
                type: 'vbox'
            },
            border: false,
            bodyPadding: 40,
            defaults: {
                msgTarget: 'side',
                labelAlign: 'left',
                labelWidth: 100,
                width: 250,
                xtype: 'displayfield',
                labelStyle: 'font-weight:bold',
                allowBlank: false
            },
            items: [{
                    fieldLabel: 'Order',
                    name: 'order'
                }, {
                    fieldLabel: 'Buyer Action',
                    name: 'buyer_action'
                }, {
                    fieldLabel: 'Exchange Expiry',
                    name: 'exchange_expiry',
                    width: 300//,
                            //renderer: Ext.util.Format.dateRenderer('d-m-Y H:i:s')
                }, {
                    fieldLabel: 'Symbol',
                    name: 'symbol'
                },
                {
                    fieldLabel: 'Direction',
                    name: 'direction'
                },  {
                    fieldLabel: 'Trigger Price',
                    name: 'pending_order_price',
                    renderer: function (value) {
                        var form = this.up('form').getForm();
                        var record = form.getRecord();
                        if (!record) {
                            //is like the framework calls this function times.
                            //on first call the record in undefined but on the
                            //second call the record object is already created.
                            //So leave and wait for the second call.
                            return "...";
                        }
                        var pending_order_price = record.get("pending_order_price");
                        var pending_order_price = pending_order_price - 0;
                        if (pending_order_price && !isNaN(pending_order_price)) {
                            return pending_order_price;
                        } else {
                            return "<span style='font-style: italic;'>None</span>";
                        }
                    }
                },{
                    fieldLabel: 'Stop Loss',
                    name: 'stop_loss'
                }, {
                    fieldLabel: "Take Profit",
                    name: 'take_profit'
                }, {
                    fieldLabel: "Time",
                    name: 'time',
                    width: 300//,
                            //renderer: Ext.util.Format.dateRenderer('d-m-Y H:i:s')
                }, {
                    fieldLabel: "Size",
                    name: 'size'
                }, {
                    fieldLabel: "Seller ID",
                    name: 'seller_id'
                }],
            buttons: [{
                    text: 'Close',
                    handler: function () {
                        //Ok, we have configured that the window should be
                        //destroyed on hide - To see it in action go to app/Util.js 
                        //and uncomment alert("destroy")

                        this.up('window').hide(); // will eventually be destroyed
                    }
                }, {
                    text: 'Ok, Send',
                    handler: function (option) {
                        if (option === 'no') {
                            return;
                        }
                        var win = this.up('window');
                        var f = this.up('form').getForm();
                        var order = f.findField('order').getValue();
                        var token = TradeApp.Util.getAccessToken();
                        var param = "access_token=" + token 
                                + "&" +"version=" + TradeApp.Util.version 
                                + "&" + "order_ticket=" + order;

                        Ext.Ajax.request({
                            url: 'access/buy/exchange/spotfx',
                            method: 'POST',
                            params: param,
                            success: function (conn, response, options, eOpts) {
                                var result = JSON.parse(conn.responseText);
                                if (result.success) {
                                    Ext.Msg.alert(result.status, result.msg);
                                    //refresh the relevant grids

                                    var ex_sp_grid = Ext.getCmp("exchange-spotfx-grid-id");
                                    var pex_sp_grid = Ext.getCmp("personal-exchange-spotfx-grid-id");

                                    TradeApp.Util.refreshGrid(ex_sp_grid, true);
                                    TradeApp.Util.refreshGrid(pex_sp_grid, true);

                                    win.hide(); // will eventually be destroyed

                                    //NOT NECESSARY - since upon countdown_start even , the open postions will
                                    //be automatically refreshed
                                    //var op_sp_grid = Ext.getCmp("trade-open-spotfx-grid-id");//NOT NECESSARY
                                    //TradeApp.Util.refreshGrid(op_sp_grid, true);//NOT NECESSARY


                                } else if (result.status === TradeApp.Const.AUTH_FAIL) {
                                    Ext.Msg.confirm("Authentication",
                                            "You may have to login to perform this operation!"
                                            + "<br/>Do you want to login?", function (option) {
                                                if (option === "yes") {
                                                    TradeApp.Util.login();
                                                }
                                            });
                                } else if (result.status === TradeApp.Const.UNSUPPORTED_VERSION) {
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


                                } else {
                                    Ext.Msg.alert('Failed', result.msg);
                                }

                            },
                            failure: function (conn, response, options, eOpts) {
                                Ext.Msg.alert('Connection problem!', "Could not connect to the remote server!");
                            }
                        });

                    }
                }]
        }]

});


