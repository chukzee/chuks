/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('TradeAdmin.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    
    onAddAdminUser: function (s, r) {
        this.doFormSubmit(s, function (result) {

        });
    },
    onFundAccount: function (s, r) {
        this.doFormSubmit(s, function (result) {

        });
    },
    onBrokerRegistration: function (s, r) {
        this.doFormSubmit(s, function (result) {

        });
    },
    onTraderRegistration: function (s, r) {
        this.doFormSubmit(s, function (result) {

        });
    },
    onWithdrawal: function (s, r) {
        this.doFormSubmit(s, function (result) {

        });
    },
    doFormSubmit: function (s, callback) {
        var me = this;
        if (this.isOperationInProgress === true) {
            return;
        }
        var form = s.up('form');
        if (!form.isValid()) {
            Ext.Msg.alert('Invalid input', 'Please correct errors.');
            return;
        }

        //get the access token for authentication
        var access_token = window.sessionStorage.getItem(TradeAdmin.Const.TOKEN_KEY);

        //set the token in the hidden form field
        form.getForm().findField('access_token').setValue(access_token);
        this.isOperationInProgress = true;
        form.submit({
            
            success: function (form, action) {
                me.isOperationInProgress = false;
                form.reset();//reset the form

                Ext.Msg.alert('Success', action.result.msg);
                if (typeof callback === "function") {
                    callback(action.result);
                }
            },
            failure: function (form, action) {                
                me.isOperationInProgress = false;
                if (action.failureType === "connect") {
                    Ext.Msg.alert('Connection problem!', "Please check your internet connection.");
                    return;
                }

                if (action.result.status === TradeAdmin.Const.AUTH_FAIL) {
                    Ext.Msg.confirm("Authentication",
                            "You may have to login to perform this operation!"
                            + "<br/>Do you want to login?", function (option) {
                                if (option === "yes") {
                                    //TradeAdmin.Util.login();
                                }
                            });
                } else {
                    Ext.Msg.alert('Failed', action.result.msg);
                }

            }
        });

    }
});
