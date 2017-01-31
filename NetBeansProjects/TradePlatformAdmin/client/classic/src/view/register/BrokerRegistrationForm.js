
Ext.define('TradeAdmin.view.register.BrokerRegistrationForm', {
    extend: 'Ext.form.Panel',
    xtype: 'broker-registration-form',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    bodyPadding: 40,
    url: 'access/create/broker',
    defaults: {
        msgTarget: 'side',
        labelStyle: 'font-weight:bold',
        allowBlank: false,
        xtype: 'textfield',
        width: 400,
        labelWidth: 150,
        labelAlign: 'right'
    },
    items: [
        {
            xtype: 'hidden',
            name: 'access_token'
        }, {
            name: 'company',
            fieldLabel: 'Company Name'
        }, {
            name: 'website',
            fieldLabel: 'Website'
        }, {
            type: 'email', //come back
            name: 'email',
            fieldLabel: 'Email'
        }, {
            name: 'username',
            fieldLabel: 'Username'
        }, {
            name: 'password',
            fieldLabel: 'Password'
        }, {
            name: 'broker_admin_host_name',
            fieldLabel: "Broker's admin hostname"
        },  {
            name: 'trade_platform_host_name',
            fieldLabel: "Trade plaftorm hostname"
        },{
            name: 'apply',
            xtype: 'button',
            type: 'submit',
            width: 400,
            margin: '10 0 0 0',
            text: 'Apply',
            listeners: {
                click: 'onBrokerRegistration'
            }
        }
    ]


});





