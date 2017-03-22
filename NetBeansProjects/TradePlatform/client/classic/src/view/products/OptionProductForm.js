/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.OptionProductForm', {
    extend: 'Ext.form.Panel',
    xtype: 'product-form-option',
    autoScroll: true,
    requires: [
        'Ext.form.field.Time',
        'Ext.form.Label',
        'TradeApp.Util',
        'TradeApp.Const'
    ],
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
            fieldLabel: 'Instruments',
            name: 'symbol',
            width: 235,
            store: TradeApp.Const.SYMBOLS,
            queryMode: 'local',
            editable: false
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
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel: 'Expiry',
            width: 400,
            items: [{
                    xtype: 'numberfield',
                    name: 'expiry_value',
                    minValue: 1,
                    width: 110,
                    margin: '0 10 0 0'
                }, {
                    xtype: 'combobox',
                    name: 'expiry_unit',
                    editable: false,
                    allowBlank: false,
                    width: 110,
                    margin: '0 10 0 0',
                    reference: 'timeUnit',
                    publishes: 'value',
                    valueField: 'minutes',
                    store: ["seconds", "minutes", "hours", "days"],
                    minChars: 0,
                    queryMode: 'local'
                }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel: 'Strike',
            width: 450,
            items: [{
                    xtype: 'combobox',
                    name: 'strike_type',
                    editable: false,
                    width: 110,
                    margin: '0 10 0 0',
                    style: 'font-style: bold; font-size: 14px;',
                    reference: 'sign',
                    bind: {
                        store: '{strikeTypeStoreData}',
                        value: '{strikeType}'
                    },
                    minChars: 1,
                    queryMode: 'local',
                    publishes: 'value',
                    value: ''

                }, {
                    xtype: 'textfield',
                    name: 'strike_price', //name attr
                    reference: 'strike',
                    width: 110,
                    margin: '0 10 0 0',
                    publishes: 'value',
                    decimalPrecision: 5,
                    bind: {
                        value: '{strikeVal}',
                        disabled: '{strikeFieldDisabled}'
                    },
                    listeners: {
                        change: function (field, newVal, oldVal) {
                            var val = new String(this.value);
                            if (newVal.length === 1 && newVal === '+' || newVal === '-') {
                                return;
                            }

                            if (!isNaN(newVal)) {
                                newVal = newVal - 0;//implicitly convert to numeric
                            }

                            if (!newVal) {
                                return;
                            }

                            if (isNaN(newVal)) {
                                this.setValue(oldVal === "" ? "1" : oldVal);
                            }

                            if (!newVal) {
                                this.setValue(!oldVal ? "1" : oldVal);
                            }

                            if (val.charAt(0) === '+' || val.charAt(0) === '-') {
                                this.setValue(Math.abs(val));
                            }


                        },
                        blur: function () {

                            if (!isNaN(this.value)) {
                                this.value = this.value - 0;//implicitly convert to numeric
                            }
                            if (isNaN(this.value) || !this.value) {
                                this.setValue("1");
                            }
                        }
                    }
                }, {
                    xtype: 'label',
                    style: 'font-style: bold; font-size: 16px;',
                    //fieldStyle:'font-style: bold; font-size: 16px; color: red',
                    publishes: 'style',
                    bind: {
                        text: '{setStrikeLabel}'
                    }

                }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel: 'Price (%)',
            width: 450,
            items: [
                {
                    xtype: 'numberfield',
                    //fieldLabel: 'Price (%)',
                    name: 'price',
                    width: 110,
                    minValue: 20,
                    maxValue: 100
                }, {
                    xtype: 'label',
                    text: "min. 20%",
                    style: 'font-style: italic; margin-left: 20px;'
                }, {
                    xtype: 'label',
                    text: "max. 100%",
                    style: 'font-style: italic; margin-left: 20px;'
                }
            ]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel: 'Premium (%)',
            width: 450,
            items: [
                {
                    xtype: 'numberfield',
                    //fieldLabel: 'Price (%)',
                    name: 'premium',
                    width: 110,
                    minValue: 20,
                    maxValue: 100
                }, {
                    xtype: 'label',
                    text: "min. 20%",
                    style: 'font-style: italic; margin-left: 20px;'
                }, {
                    xtype: 'label',
                    text: "max. 100%",
                    style: 'font-style: italic; margin-left: 20px;'
                }
            ]
        }, {
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

                //set the token in the hidden form field
                form.getForm().findField('access_token').setValue(access_token);

                //set the app version
                form.getForm().findField('version').setValue(TradeApp.Util.version);


                if (!form.isValid()) { // make sure the form contains valid data before submitting
                    Ext.Msg.alert('Invalid input', 'Please correct errors.');
                    return;
                }

                var submitForm = function (option) {
                    if (option !== 'yes') {
                        return;
                    }

                    form.submit({
                        success: function (form, action) {

                            form.reset();//reset the form

                            Ext.Msg.alert('Success', action.result.msg);

                            //refresh the relevant grid
                            var gn_grid = Ext.getCmp("exchange-options-grid-id");
                            var ps_grid = Ext.getCmp("personal-exchange-options-grid-id");
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
                                        + "Do you want to login?", function (option) {
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

});
