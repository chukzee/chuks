/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.SpotForexDialog', {
    extend: 'Ext.window.Window',
    xtype: 'spotfx-dialog',
    title: '<h2>Spot Forex</h2>',
    reference: 'spotForexDialog',
    requires: [
        'Ext.form.field.Time',
        'Ext.form.Label',
        'TradeApp.Util',
        'TradeApp.Const'
    ],
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
            url: 'access/create/spot_forex',
            reference: 'spotForexForm',
            autoScroll: true,
            layout: {
                type: 'vbox'
                        //align: 'stretch'
            },
            border: false,
            bodyPadding: 40,
            defaults: {
                msgTarget: 'side',
                labelAlign: 'left',
                labelWidth: 120,
                width: 320,
                xtype: 'numberfield',
                labelStyle: 'font-weight:bold',
                allowBlank: false
            },
            items: [{
                    hidden: true,
                    xtype: 'textfield',
                    name: 'access_token',
                    allowBlank: true//important! otherwise it may confuse users if not set which will raise form error message - this will confuse the user in this case since it is an hidden component.
                }, {
                    hidden: true,
                    xtype: 'textfield',
                    name: 'version',
                    allowBlank: true//important! otherwise it may confuse users if not set which will raise form error message - this will confuse the user in this case since it is an hidden component.
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldLabel: 'Exchange Expiry',
                    width: 400,
                    items: [
                        {
                            xtype: 'timefield',
                            name: 'exchange_expiry',
                            width: 110,
                            format: 'H:i', //display format
                            submitFormat: 'H:i:s', //submit format - format we need in the server
                            editable: true
                        }, {
                            xtype: 'label',
                            text: "Format: mm:ss",
                            style: 'font-style: italic; margin-left: 20px;'
                        }
                    ]
                }, {
                    xtype: 'combobox',
                    id: 'cbo_dialog_spotfx_symbols',
                    name: 'symbol',
                    width: 235,
                    fieldLabel: 'Instruments',
                    store: TradeApp.Const.SYMBOLS,
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        change: function (s, r) {
                            var symbol = s.getValue();
                            if (!symbol) {
                                return;
                            }
                            var form = s.up('form');
                            var f = form.getForm();


                            if (!TradeApp.Const.SYMBOLS_ATTR) {
                                s.setValue('');
                                Ext.Msg.alert('Error', 'It appears some features are missing!<br/>You may have to reload the platform.');
                                return;
                            }
                            var attr = TradeApp.Const.SYMBOLS_ATTR[symbol];
                            if (!attr) {
                                s.setValue('');
                                Ext.Msg.alert('Error', symbol + ' is not supported!');
                                return;
                            }
                            if (!attr.min_pl) {
                                s.setValue('');
                                Ext.Msg.alert('Error', symbol + ' is not activated! Mininum pl is not available.');
                                return;
                            }

                            if (!attr.max_pl) {
                                s.setValue('');
                                Ext.Msg.alert('Error', symbol + ' is not activated! Maximum pl is not available.');
                                return;
                            }

                            var tp_fld = f.findField('take_profit');
                            tp_fld.setMinValue(attr.min_pl);
                            tp_fld.setMaxValue(attr.max_pl);

                            var sl_fld = f.findField('stop_loss');
                            sl_fld.setMinValue(attr.min_pl);
                            sl_fld.setMaxValue(attr.max_pl);

                            var min_tp_fld = Ext.getCmp('min_spotfx_take_profit');
                            var max_tp_fld = Ext.getCmp('max_spotfx_take_profit');
                            var min_sl_fld = Ext.getCmp('min_spotfx_stop_loss');
                            var max_sl_fld = Ext.getCmp('max_spotfx_stop_loss');

                            min_tp_fld.setText('min. ' + attr.min_pl + ' pips');
                            max_tp_fld.setText('max. ' + attr.max_pl + ' pips');
                            min_sl_fld.setText('min. ' + attr.min_pl + ' pips');
                            max_sl_fld.setText('max. ' + attr.max_pl + ' pips');


                        }
                    }
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldLabel: 'Method',
                    width: 430,
                    items: [{
                            xtype: 'combobox',
                            name: 'method',
                            store: ['Time (Countdown)', 'Price (Pending order)'],
                            queryMode: 'local',
                            editable: false,
                            margin: '0 10 0 0',
                            width: 180,
                            listeners: {
                                select: function (c) {
                                    var field = this.up('form').getForm().findField('pending_order_price');
                                    if (c.getValue().toLowerCase().indexOf('time') === 0) {
                                        field.setValue('');
                                        field.setVisible(false);
                                    } else if (c.getValue().toLowerCase().indexOf('price') === 0) {
                                        field.setVisible(true);
                                    }
                                }
                            }
                        }, {
                            xtype: 'numberfield',
                            name: 'pending_order_price',
                            width: 110,
                            step: 0.01,
                            minValue: 0,
                            emptyText: 'Price',
                            decimalPrecision: 5,
                            allowBlank: true, //important! otherwise it may confuse users if not set which will raise form error message - this will confuse the user in this case since it is an hidden component.
                            hidden: true,
                            //spinner buttons, arrow keys and mouse wheel listeners
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false

                        }]
                }, {
                    fieldLabel: 'Size',
                    name: 'size',
                    width: 235,
                    minValue: 1
                }, {
                    xtype: 'combobox',
                    name: 'direction',
                    width: 235,
                    fieldLabel: 'Direction',
                    store: ['BUY', 'SELL'],
                    queryMode: 'local',
                    editable: false
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldLabel: 'Stop Loss',
                    width: 450,
                    items: [
                        {
                            xtype: 'numberfield',
                            //fieldLabel: 'Stop Loss',
                            width: 110,
                            name: 'stop_loss',
                            minValue: 20,
                            maxValue: 100
                        }, {
                            xtype: 'label',
                            text: "min. 20 pips",
                            id: 'min_spotfx_stop_loss',
                            style: 'font-style: italic; margin-left: 20px;'
                        }, {
                            xtype: 'label',
                            text: "max. 100 pips",
                            id: 'max_spotfx_stop_loss',
                            style: 'font-style: italic; margin-left: 20px;'
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldLabel: 'Take Profit',
                    width: 450,
                    items: [
                        {
                            xtype: 'numberfield',
                            //fieldLabel: 'Take Profit', // which should come first - stoploss or take profit -  ask onyeka
                            name: 'take_profit',
                            width: 110,
                            minValue: 20,
                            maxValue: 100
                        }, {
                            xtype: 'label',
                            text: "min. 20 pips",
                            id: 'min_spotfx_take_profit',
                            style: 'font-style: italic; margin-left: 20px;'
                        }, {
                            xtype: 'label',
                            text: "max. 100 pips",
                            id: 'max_spotfx_take_profit',
                            style: 'font-style: italic; margin-left: 20px;'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: "Seller's ID",
                    layout: 'hbox',
                    width: 350,
                    items: [{
                            xtype: 'displayfield',
                            //value: TradeApp.Util.getUserExchangeId(), //NO DON'T . USE afterrender BELOW BECAUSE WE NEED IT TO BE DYNAMIC AND IT SHOULD NO DISPLAY WHEN THE USER IS NOT LOGGED IN
                            listeners: {
                                afterrender: function (e) {
                                    var exchangeId = TradeApp.Util.getUserExchangeId();
                                    e.setValue(exchangeId);
                                }
                            }

                        }, {
                            xtype: 'label',
                            text: "(automatic)",
                            style: 'font-style: italic;'
                        }]

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
                    text: 'Confirm',
                    handler: function () {

                        if (TradeApp.Util.normalizeLogin()) { //The call is very important!
                            //leave since the abnormality was detected.
                            return;
                        }
                        var form = this.up('form'); // get the form panel

                        //get the access token for authentication
                        var access_token = window.sessionStorage.getItem(TradeApp.Const.TOKEN_KEY);

                        //set the app version
                        form.getForm().findField('version').setValue(TradeApp.Util.version);

                        //set the token in the hidden form field
                        form.getForm().findField('access_token').setValue(access_token);

                        if (!form.isValid()) { // make sure the form contains valid data before submitting
                            Ext.Msg.alert('Invalid input', 'Please correct errors.');
                            return;
                        }

                        var submitForm = function (option) {
                            if (option === 'no') {
                                return;
                            }

                            form.submit({
                                success: function (form, action) {

                                    form.reset();//reset the form

                                    Ext.Msg.alert('Success', action.result.msg);

                                    //refresh the relevant grid
                                    var gn_grid = Ext.getCmp("exchange-spotfx-grid-id");
                                    var ps_grid = Ext.getCmp("personal-exchange-spotfx-grid-id");
                                    TradeApp.Util.refreshGrid(gn_grid, true);
                                    TradeApp.Util.refreshGrid(ps_grid, true);
                                },
                                failure: function (form, action) {

                                    if (action.failureType === "connect") {
                                        Ext.Msg.alert('Connection problem!', "Could not connect to the remote server!");
                                        return;
                                    }

                                    if (action.result.status === TradeApp.Const.AUTH_FAIL) {
                                        Ext.Msg.confirm("Authentication",
                                                "You may have to login to perform this operation!"
                                                + "<br/>Do you want to login?", function (option) {
                                                    if (option === "yes") {
                                                        TradeApp.Util.login();
                                                    }
                                                });
                                    } else if (action.result.status === TradeApp.Const.UNSUPPORTED_VERSION) {
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
                                        Ext.Msg.alert('Failed', action.result.msg);
                                    }

                                }
                            });

                        };

                        Ext.Msg.confirm('Confirm', 'You are about to send this trade to exchange room!' +
                                '<br/>Do you want to contine?', submitForm);


                    }
                }]
        }]


});
