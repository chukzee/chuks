/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeAdmin.view.withdrawal.PaymentMethodDialog', {
    extend: 'Ext.window.Window',
    xtype: 'payment-method-dialog',
    title: 'Set Payment Method',
    reference: 'paymentMethod',
    viewModel: 'main',
    controller: 'main',
    width: 500,
    height: 250,
    minWidth: 300,
    minHeight: 200,
    layout: 'fit',
    modal: true, //important - to lock the parent window while this window is visible - this will prevent opening another window from the parent window until this window is close
    //defaultFocus: 'firstName',
    closeAction: 'hide',
    withdrawalGrid:null,
    setFormParam: function(serial_nos, grid){
        this.withdrawalGrid = grid;
        var form = this.down('form');
        if(!form){
            Ext.Msg.alert("Unexpected", "Form not ready!");
            return;//just in case
        }
        var field = form.getForm().findField('serial_nos');
        if(!field){
            Ext.Msg.alert("Unexpected", "Form field not ready!");
            return;//just in case
        }
        
        field.setValue(serial_nos);                
    },
    
    items: [{
            xtype: 'form',
            reference: 'paymentMethodForm',
            defaultType: 'textfield',
            url: '/access/account/withdrawal/payment_method',
            defaults: {
                labelWidth: 120
            },
            bodyPadding: 40,
            items: [{
                    hidden: true,
                    xtype: 'textfield',
                    name: 'access_token',
                    allowBlank: true//important! otherwise it may confuse users if not set which will raise form error message - this will confuse the user in this case since it is an hidden component.
                }, {
                    allowBlank: false,
                    fieldLabel: 'Payment Method',
                    width: 320,
                    name: 'payment_method'
                }, {
                    hidden: true,
                    xtype: 'textfield',
                    name: 'serial_nos',
                    allowBlank: true//important! otherwise it may confuse users if not set which will raise form error message - this will confuse the user in this case since it is an hidden component.
                    
                }],
            buttons: [
                {xtype: 'component', flex: 1},
                {
                    text: 'Submit',
                    width: 150,
                    handler: function () {
                        var me = this;
                        if (this.isOperationInProgress === true) {
                            return;
                        }
                        var form = this.up('form');
                        var win = this.up('window');
                        
                        if(!form.getForm().findField('serial_nos').getValue()){
                            Ext.Msg.alert("Unexpected", "Please reload form!");
                            return;
                        }
                        
                        //get the access token for authentication
                        var access_token = window.sessionStorage.getItem(TradeAdmin.Const.TOKEN_KEY);
                                                 
                        //set the token in the hidden form field
                        form.getForm().findField('access_token').setValue(access_token);

                        if (form.isValid()) { // make sure the form contains valid data before submitting
                            this.isOperationInProgress = true;
                            form.submit({
                                success: function (form, action) {
                                    me.isOperationInProgress = false;
                                    
                                    var result = action.result;
                                
                                    if (result.success) {
                                        form.reset();//reset the form
                                        Ext.Msg.alert(result.status, "Successfully updated payment method!");
                                        TradeAdmin.Util.refreshGrid(win.withdrawalGrid, true);
                                    } else if (result.status === TradeAdmin.Const.AUTH_FAIL) {
                                        Ext.Msg.confirm("Authentication",
                                                "You may have to login to perform this operation!"
                                                + "<br/>Do you want to login?", function (option) {
                                                    if (option === "yes") {
                                                        TradeAdmin.Util.login();
                                                    }
                                                });
                                    } else {
                                        Ext.Msg.alert('Failed', result.msg);
                                    }
                                },
                                failure: function (form, action) {
                                    me.isOperationInProgress = false;
                                    var result = action.result;
                                    if (result.status === TradeAdmin.Const.AUTH_FAIL) {
                                        Ext.Msg.confirm("Authentication",
                                                "You may have to login to perform this operation!"
                                                + "<br/>Do you want to login?", function (option) {
                                                    if (option === "yes") {
                                                        TradeAdmin.Util.login();
                                                    }
                                                });
                                    } else {
                                        Ext.Msg.alert('Failed', result.msg);
                                    }
                                    
                                }
                            });
                        } else { // display error alert if the data is invalid
                            Ext.Msg.alert('Invalid input', 'Please correct errors.');
                        }
                    }
                },
                {xtype: 'component', flex: 1}
            ]
        }]
});