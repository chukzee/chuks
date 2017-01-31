/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.main.LoginDialog', {
    extend: 'Ext.window.Window',
    xtype: 'login-dialog',
    title: '<h3>Login</h3>',
    reference: 'loginDialog',
    viewModel: 'main',
    controller: 'main',
    width: 500,
    height: 350,
    minWidth: 300,
    minHeight: 330,
    layout: 'fit',
    modal: true, //important - to lock the parent window while this window is visible - this will prevent opening another window from the parent window until this window is close
    //defaultFocus: 'firstName',
    closeAction: 'hide',
    items: [{
            xtype: 'form',
            reference: 'loginForm',
            defaultType: 'textfield',
            url: 'login',
            defaults: {
                labelWidth: 120
            },
            bodyPadding: 40,
            items: [{
                    allowBlank: false,
                    fieldLabel: 'Username',
                    name: 'username',
                    emptyText: 'username'
                }, {
                    allowBlank: false,
                    fieldLabel: 'Password',
                    name: 'password',
                    emptyText: 'password',
                    inputType: 'password'
                },/* {
                    xtype: 'checkbox',
                    fieldLabel: 'Keep me signed in',
                    name: 'remember'
                },*/
                {
                    xtype: 'component',
                    autoEl: {
                        tag: "a",
                        html: "Not yet registered?",
                        href: "#",
                        onclick: 'TradeApp.Util.showRegisterPage()'
                    }
                }],
            buttons: [
                {xtype: 'component', flex: 1},
                , {xtype: 'tbspacer'},
                {xtype: 'component', flex: 1},
                {
                    text: 'Login',
                    width: 120,
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
                                    try {
                                        //Ext.Msg.alert('Success', action.result.msg);
                                        win.hide();

                                        //Save the authentication token locally using sessionStorage
                                        //NOTE: DON'T EVER USE localStorage becacuse it preserve the token indefinitely.
                                        //Session storage is used here for security reasons since it gets deleted automatically
                                        //when the user closes the browser - This is actually what we want since it
                                        //will prevent users from unknowing using someone else token for authentication
                                        //thereby causing gross inconsistency and other serious problems.

                                        window.sessionStorage.setItem(TradeApp.Const.TOKEN_KEY, action.result.msg.token);

                                        var user = action.result.msg.user;

                                        //save the user info in sesssion store
                                        window.sessionStorage.setItem(TradeApp.Const.USER_KEY, JSON.stringify(user));

                                        TradeApp.Util.afterLogin();

                                    } catch (e) {
                                        console.log(e);
                                    }


                                },
                                failure: function (form, action) {
                                    me.isOperationInProgress = false;
                                    Ext.Msg.alert('Failed', action.result.msg);
                                }
                            });
                        } else { // display error alert if the data is invalid
                            Ext.Msg.alert('Invalid input', 'Please correct errors.');
                        }
                    }
                },
                {xtype: 'component', flex: 1},
                {
                    xtype: 'component',
                    autoEl: {
                        tag: "a",
                        html: "Forgot password?",
                        href: "#",
                        onclick: 'TradeApp.Util.showForgotPasswordPage()'
                    }
                }, {xtype: 'tbspacer'}
            ]
        }]
});