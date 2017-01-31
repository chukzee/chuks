Ext.define('TradeAdmin.view.register.RegistrationForm', {
    extend: 'Ext.form.Panel',
    xtype: 'registration-form',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    bodyPadding: 40,
    url: 'access/create/trader',
    defaults: {
        msgTarget: 'side',
        labelAlign: 'left',
        labelWidth: 100,
        width: 300,
        xtype: 'textfield',
        labelStyle: 'font-weight:bold',
        allowBlank: false
    },
    items: [{
            xtype: 'hidden',
            name: 'access_token'
        }, {
            name: 'first_name',
            fieldLabel: 'First Name'
        }, {
            name: 'last_name',
            fieldLabel: 'Last Name'
        }, {
            vtype: 'email',
            name: 'email',
            fieldLabel: 'Email'
        }, {
            xtype: 'numberfield',
            name: 'initial_deposit',
            fieldLabel: 'Initial Deposit',
            minValue:0
        }, {
            type: 'label',
            name: 'username',
            fieldLabel: 'Username',
            editable: false
        }, {
            type: 'label',
            name: 'exchange_id',
            fieldLabel: 'Exchange ID',
            editable: false
        }, {
            type: 'label',
            name: 'password',
            fieldLabel: 'Password',
            editable: false
        }, {
            name: 'apply',
            xtype: 'button',
            type: 'submit',
            width: 300,
            margin: '10 0 0 0',
            text: 'Apply',
            listeners: {
                click: 'onTraderRegistration'
            }
        }]

});





