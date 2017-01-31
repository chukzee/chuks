
Ext.define('TradeAdmin.view.account.DemoACForm', {
    extend: 'Ext.form.Panel',
    xtype: 'demo-ac-form',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    bodyPadding: 40,
    //url: 'access/account/something',
    defaults: {
        msgTarget: 'side',
        labelAlign: 'right',
        labelWidth: 100,
        width: 500,
        xtype: 'textfield',
        labelStyle: 'font-weight:bold',
        allowBlank: false
    },
    items: [{
            xtype: 'hidden',
            name: 'access_token'
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            defaults: {
                labelStyle: 'font-weight:bold',
                labelAlign: 'right',
                allowBlank: false
            },
            items: [{
                    name: 'username',
                    xtype: 'textfield',
                    fieldLabel: 'Username',
                    listeners: {
                        keyup: function (field, newVal, oldVal) {
                            if (!newVal || newVal === "") {
                                return;
                            }

                        }
                    }
                }, {
                    name: 'go',
                    xtype: 'button',
                    type: 'submit',
                    width: 50,
                    //margin: '10 0 0 0',
                    text: 'Go',
                    listeners: {
                        click: function () {
                            var panel = this.up('demo-account-panel');
                            var tabpanel = panel.down('tabpanel');
                            var form = this.up('form').getForm();
                            var username = form.findField('username').getValue();
                            if (!username) {
                                Ext.Msg.alert('Invalid', 'Please enter username!');
                                return;
                            }

                            var g1 = panel.down('tradepos-spotfx-grid');
                            var g2 = panel.down('tradepos-options-grid');
                            var g3 = panel.down('trade-history-spotfx-grid');
                            var g4 = panel.down('trade-history-options-grid');
                            var g5 = panel.down('deposits-and-withdrawals-grid');

                            var grids = [g1, g2, g3, g4, g5];

                            TradeAdmin.Util.clearGrids(grids);

                            tabpanel.setTitle("Account balance: ");


                            form.findField('username_1').setVisible(false);
                            form.findField('exchange_id').setVisible(false);
                            form.findField('email').setVisible(false);
                            form.findField('first_name').setVisible(false);
                            form.findField('last_name').setVisible(false);

                            Ext.Ajax.request({
                                url: 'access/user_basic_info',
                                method: 'POST',
                                params: "access_token=" + TradeAdmin.Util.getAccessToken() + "&live=0" + "&username=" + username,
                                success: function (conn, response, options, eOpts) {
                                    try {
                                        var data = JSON.parse(conn.responseText);

                                        if (!data.success) {
                                            Ext.Msg.alert('Not Found', data.msg);
                                            return;
                                        }
                                        var live = data.user.live - 0;//implicitly convert to numeric
                                        if (live) {
                                            Ext.Msg.alert('Unexpected', 'Not a demo user.');
                                            return;
                                        }

                                        form.reset();

                                        form.findField('username_1').setVisible(true);
                                        form.findField('exchange_id').setVisible(true);
                                        form.findField('email').setVisible(true);
                                        form.findField('first_name').setVisible(true);
                                        form.findField('last_name').setVisible(true);

                                        form.findField('username_1').setValue(data.user.username);
                                        form.findField('exchange_id').setValue(data.user.exchangeId);
                                        form.findField('email').setValue(data.user.email);
                                        form.findField('first_name').setValue(data.user.firstName);
                                        form.findField('last_name').setValue(data.user.lastName);

                                        for (var i = 0; i < grids.length; i++) {
                                            var p = grids[i].getStore().getProxy();
                                            var params = p.getExtraParams();
                                            params.username = data.user.username;
                                            params.exchange_id = data.user.exchangeId;
                                            params.live = data.user.live;
                                            TradeAdmin.Util.refreshGrid(grids[i], true);
                                        }


                                        TradeAdmin.Util.requestAccountBalance(params.username, params.live, function (info) {
                                            var strFormat = "0,000.00";
                                            var currency = "$";
                                            tabpanel.setTitle("Account balance: " + currency + Ext.util.Format.number(info.account_balance, strFormat));

                                        });

                                    } catch (e) {
                                        console.log(e);
                                    }
                                },
                                failure: function (conn, response, options, eOpts) {
                                    //do nothing - not interested!
                                }
                            });
                        }
                    }
                }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            margin: '10 0 0 0',
            defaults: {
                labelStyle: 'font-weight: 600; font-style: italic;',
                labelAlign: 'right',
                allowBlank: false
            },
            items: [
                {
                    xtype: 'displayfield',
                    name: 'username_1',
                    margin: '0 20 0 0',
                    hidden: true,
                    fieldLabel: 'Username'
                }, {
                    xtype: 'displayfield',
                    name: 'exchange_id',
                    hidden: true,
                    fieldLabel: 'Exchange Id'
                }
            ]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            margin: '0 0 0 0',
            defaults: {
                labelStyle: 'font-weight: 600; font-style: italic;',
                labelAlign: 'right',
                allowBlank: false
            },
            items: [
                {
                    xtype: 'displayfield',
                    name: 'first_name',
                    margin: '0 20 0 0',
                    hidden: true,
                    fieldLabel: 'First Name'
                }, {
                    xtype: 'displayfield',
                    name: 'last_name',
                    hidden: true,
                    fieldLabel: 'Last Name'
                }
            ]
        }, {
            xtype: 'displayfield',
            name: 'email',
            margin: '0 0 0 0',
            labelAlign: 'right',
            labelStyle: 'font-weight: 600; font-style: italic;',
            hidden: true,
            fieldLabel: 'Email'
        }]

});


