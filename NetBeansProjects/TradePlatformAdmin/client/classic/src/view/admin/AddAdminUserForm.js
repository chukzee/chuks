Ext.define('TradeAdmin.view.admin.AddAdminUserForm', {
    extend: 'Ext.form.Panel',
    xtype: 'add-admin-user-form',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    bodyPadding: 40,
    url: 'access/create/admin_user',
    defaults: {
        msgTarget: 'side',
        labelAlign: 'left',
        labelWidth: 100,
        //width: 300,
        xtype: 'textfield',
        labelStyle: 'font-weight:bold',
        allowBlank: false
    },
    items: [
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            //margin: '0 0 0 0',
            defaults: {
                msgTarget: 'side',
                labelAlign: 'left',
                labelWidth: 100,
                
                xtype: 'textfield',
                labelStyle: 'font-weight:bold',
                allowBlank: false
            },
            items: [{
                    xtype: 'fieldcontainer',
                    layout: 'vbox',
                    margin: '20 20 0 0',
                    defaults: {
                        msgTarget: 'side',
                        labelAlign: 'left',
                        labelWidth: 100,
                        width: 300,
                        xtype: 'textfield',
                        labelStyle: 'font-weight:bold',
                        allowBlank: false
                    },
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'access_token'
                        }, {
                            name: 'username',
                            fieldLabel: 'Username'
                        }, {
                            name: 'password',
                            fieldLabel: 'Password'
                        }, {
                            name: 'first_name',
                            fieldLabel: 'First Name'
                        }, {
                            name: 'last_name',
                            fieldLabel: 'Last Name'
                        }, {
                            type: 'email', //come back
                            name: 'email',
                            fieldLabel: 'Email'
                        }]
                },
                {
                    xtype: 'fieldset',
                    title: "Admin Privileges",
                    margin: '0 0 0 0',
                    defaults: {
                        xtype: 'checkbox',
                        width: 350,
                        labelWidth: 150,
                        labelAlign: 'right'
                    },
                    items: [
                        {
                            name: 'register_broker', //NOTE HIGHLY RESTRICTIVE
                            fieldLabel: 'Register Broker'
                        }, {
                            name: 'create_admin_user',
                            fieldLabel: 'Create Admin User'
                        }, {
                            name: 'delete_admin',
                            fieldLabel: 'Delete Admin User'
                        }, {
                            name: 'register_trader',
                            fieldLabel: 'Register Trader'
                        }, {
                            name: 'fund_trader_account',
                            fieldLabel: 'Fund Trader Account'
                        }, {
                            name: 'withdraw_trader_fund',
                            fieldLabel: 'Withdraw Trader Fund'
                        }
                    ]
                }]
        }, {
            name: 'apply',
            xtype: 'button',
            type: 'submit',
            width: 80,
            margin: '20 0 0 0',
            text: 'Apply',
            listeners: {
                click: 'onAddAdminUser'
            }
        }]

});


