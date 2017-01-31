/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.main.ForgotPasswordDialog', {
    extend: 'Ext.window.Window',
    xtype: 'withrawal-dialog',
    title: 'Recover My Password',
    reference: 'forgotPasswordDialog',
    viewModel: 'main',
    controller: 'main',
    width: 500,
    height: 400,
    minWidth: 300,
    minHeight: 200,
    layout: 'fit',
    modal: true, //important - to lock the parent window while this window is visible - this will prevent opening another window from the parent window until this window is close
    //defaultFocus: 'firstName',
    closeAction: 'hide',
    items: [{
            xtype: 'form',
            reference: 'forgotPasswordForm',
            url: '/forgot_password',
            defaults: {
                labelWidth: 100
            },
            bodyPadding: 40,
            items: [{
                    xtype: 'component',
                    html: '<div><strong>No Stress!</strong> <br/>We can help you recovery your password.<br/> Just enter your username below and we shall send you an email to recover your password via the email address you provided to us during registration.</div>',
                    flex: 1
                }, {
                    xtype: 'textfield',
                    allowBlank: false,
                    margin:'20 0 40 0',
                    fieldLabel: 'Username',
                    width: 250,
                    name: 'username'
                },{
                    xtype: 'component',
                    id:'forgot_password_feedback',
                    html: ''
                    
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

                        if (form.isValid()) { // make sure the form contains valid data before submitting
                            this.isOperationInProgress = true;
                            form.submit({
                                success: function (form, action) {
                                    me.isOperationInProgress = false;

                                    var result = action.result;
                                    var element = document.getElementById('forgot_password_feedback');
                                    if (result.success) {
                                        form.reset();//reset the form
                                        element.style.color = 'green';
                                        element.innerHTML = result.msg;
                                        
                                    } else {
                                        Ext.Msg.alert('Failed', result.msg);
                                        element.style.color = 'red';
                                        element.innerHTML = result.msg;
                                    }
                                },
                                failure: function (form, action) {
                                    me.isOperationInProgress = false;
                                    var result = action.result;
                                    var element = document.getElementById('forgot_password_feedback');
                                    element.style.color = 'red';
                                    element.innerHTML = result.msg;

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