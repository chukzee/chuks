/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.main.WithdrawalDialog', {
    extend: 'Ext.window.Window',
    xtype: 'withrawal-dialog',
    title: 'Fund Withdrawal',
    reference: 'withdrawDialog',
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
    items: [{
            xtype: 'form',
            reference: 'withdrawalForm',
            defaultType: 'numberfield',
            url: '/access/account/withdraw',
            defaults: {
                labelWidth: 100
            },
            bodyPadding: 40,
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
                },{
                    allowBlank: false,
                    fieldLabel: 'Amount ($)',
                    width: 250,
                    name: 'amount',
                    minValue: 0,
                    emptyText: 'Specify amount'
                }],
            buttons: [
                {xtype: 'component', flex: 1},
                {
                    text: 'Submit',
                    width: 150,
                    handler: function () {
                        var me = this;
                        if(this.isOperationInProgress === true){
                            return;
                        }
                        var form = this.up('form'); // get the form panel
                        var win = this.up('window'); // get the form panel
                        //get the access token for authentication
                        var access_token = window.sessionStorage.getItem(TradeApp.Const.TOKEN_KEY);

                        //set the token in the hidden form field
                        form.getForm().findField('access_token').setValue(access_token);

                        //set the app version
                        form.getForm().findField('version').setValue(TradeApp.Util.version);

                        if (form.isValid()) { // make sure the form contains valid data before submitting
                            this.isOperationInProgress = true;
                            form.submit({
                                success: function (form, action) {
                                    me.isOperationInProgress = false;
                                    
                                    var result = action.result;
                                
                                    if (result.success) {
                                        form.reset();//reset the form
                                        Ext.Msg.alert(result.status, result.msg);
                                    } else if (result.status === TradeApp.Const.AUTH_FAIL) {
                                        Ext.Msg.confirm("Authentication",
                                                "You may have to login to perform this operation!"
                                                + "<br/>Do you want to login?", function (option) {
                                                    if (option === "yes") {
                                                        TradeApp.Util.login();
                                                    }
                                                });
                                    }  else if (result.status === TradeApp.Const.UNSUPPORTED_VERSION) {
                                        //Ext.Msg.alert("Unsupporte Version", "The application version has changed. In order to continue this page must be reloaded!"
                                          //      +" <br/>NOTE: If you see this message again after reload then clear your browse cache before reloading the page.");
                                        
                                        Ext.Msg.show({
                                            title:"Unsupported Version",
                                            msg:"The application version has changed. In order to continue this page must be reloaded!"
                                                +" <p><strong>NOTE: If you see this message again after reloading then clear your browse cache before reloading the page.</strong></p>",
                                            buttons: Ext.Msg.OK,
                                            fn:function(btn){
                                                
                                                window.location = 'https://' + window.location.hostname;
                                            }
                                        });
                                        
                                        
                                    }else {
                                        Ext.Msg.alert('Failed', result.msg);
                                    }
                                },
                                failure: function (form, action) {
                                    me.isOperationInProgress = false;
                                    var result = action.result;
                                    if (result.status === TradeApp.Const.AUTH_FAIL) {
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
                                            title:"Unsupported Version",
                                            msg:"The application version has changed. In order to continue this page must be reloaded!"
                                                +" <p><strong>NOTE: If you see this message again after reloading then clear your browse cache before reloading the page.</strong></p>",
                                            buttons: Ext.Msg.OK,
                                            fn:function(btn){
                                                
                                                window.location = 'https://' + window.location.hostname;
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