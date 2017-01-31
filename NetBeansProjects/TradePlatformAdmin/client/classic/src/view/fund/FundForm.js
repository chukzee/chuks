
Ext.define('TradeAdmin.view.fund.FundForm', {
    extend: 'Ext.form.Panel',
    xtype: 'fund-form',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    bodyPadding: 40,
    //width: 400,
    //style: 'margin: 0px auto 0px auto;',
    
    url: 'access/account/fund',
    defaults: {
        msgTarget: 'side',
        labelAlign: 'left',
        labelWidth: 100,
        width: 400,
        xtype: 'textfield',
        labelStyle: 'font-weight:bold',
        allowBlank: false
    },
    items: [{
            xtype: 'hidden',
            name: 'access_token'
        }, {
            name: 'username',
            fieldLabel: 'Username',
            listeners: {
                change: function (field, newVal, oldVal) {
                    if (!newVal || newVal === "") {
                        return;
                    }
                    var form = this.up('form').getForm();

                    form.findField('exchange_id').setValue("");
                    form.findField('email').setValue("");
                    form.findField('first_name').setValue("");
                    form.findField('last_name').setValue("");

                    Ext.Ajax.request({
                        url: 'access/user_basic_info',
                        method: 'POST',
                        params: "access_token=" + TradeAdmin.Util.getAccessToken() + "&username=" + newVal,
                        success: function (conn, response, options, eOpts) {
                            try {
                                var data = JSON.parse(conn.responseText);
                                if (data.success) {
                                    form.findField('exchange_id').setValue(data.user.exchangeId);
                                    form.findField('email').setValue(data.user.email);
                                    form.findField('first_name').setValue(data.user.firstName);
                                    form.findField('last_name').setValue(data.user.lastName);
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
                blur: function () {

                }
            }
        }, {
            xtype: 'displayfield',
            name: 'exchange_id',
            fieldCls: 'x-form-trigger-wrap-default x-form-text x-form-text-default',
            fieldLabel: 'Exchange ID'
        }, {
            xtype: 'displayfield',
            type: 'email', //come back
            fieldCls: 'x-form-trigger-wrap-default x-form-text x-form-text-default',
            name: 'email',
            fieldLabel: 'Email'
        }, {
            xtype: 'displayfield',
            name: 'first_name',
            fieldCls: 'x-form-trigger-wrap-default x-form-text x-form-text-default',
            fieldLabel: 'First Name'
        }, {
            xtype: 'displayfield',
            name: 'last_name',
            fieldCls: 'x-form-trigger-wrap-default x-form-text x-form-text-default',
            fieldLabel: 'Last Name'
        }, {
            xtype: 'numberfield',
            name: 'amount',
            fieldLabel: 'Amount',
            minValue: 0
        }, {
            name: 'apply',
            xtype: 'button',
            type: 'submit',
            width: 400,
            margin: '10 0 0 0',
            text: 'Apply',
            listeners: {
                click: 'onFundAccount'
            }
        }]

});


