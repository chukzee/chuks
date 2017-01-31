
Ext.define('TradeAdmin.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'TradeAdmin.view.main.MainController',
        'TradeAdmin.view.main.MainModel',
        'TradeAdmin.view.main.List',
        'TradeAdmin.view.main.BrokerSuperAdminPanel',
        'TradeAdmin.view.main.MainSuperAdminPanel',
        'TradeAdmin.view.main.NormalAdminPanel',
        'TradeAdmin.view.account.LiveTraderAccountPanel',  
        'TradeAdmin.view.account.LiveACForm',  
        'TradeAdmin.view.account.DemoACForm',  
        'TradeAdmin.view.account.DemoTraderAccountPanel',
        'TradeAdmin.view.fund.FundForm',
        'TradeAdmin.view.fund.FundGrid',
        'TradeAdmin.view.admin.AddAdminUserForm',
        'TradeAdmin.view.admin.AdminUserGrid',
        'TradeAdmin.view.register.BrokerRegistrationForm',
        'TradeAdmin.view.register.BrokerRegistrationGrid',
        'TradeAdmin.view.register.RegistrationForm',
        'TradeAdmin.view.register.RegistrationGrid',
        'TradeAdmin.view.withdrawal.WithdrawalForm',
        'TradeAdmin.view.withdrawal.WithdrawalGrid',        
        'TradeAdmin.view.account.DepositsAndWithdrawalsGrid',
        'TradeAdmin.view.account.TradePositionSpotFxGrid',
        'TradeAdmin.view.account.TradePositionOptionsGrid',
        'TradeAdmin.view.account.TradeHistorySpotFxGrid',
        'TradeAdmin.view.account.TradeHistoryOptionsGrid',
        'TradeAdmin.view.account.PendingOrderOptionsGrid',
        'TradeAdmin.view.account.PendingOrderSpotFxGrid'
    ],
    controller: 'main',
    viewModel: 'main',
    layout: 'card',
    width: "100%",
    height: "100%",
    bodyPadding: 0,
    header: {
        //titlePosition: 0,
        title: {
            style: 'height:30px; font-size: 24px; color: gray; text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);',
            text: 'FLATBOOK'
        },
        items: [{
                xtype: 'component',
                id: 'user-name-display',
                style: 'color:white; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);'

            }, {
                xtype: 'component',
                flex: 1

            }, {
                xtype: 'button',
                text: 'LOGOUT',
                hidden: true,
                id: 'platf-logout-button',
                handler: 'showLoginPage'
            }]
    },
    defaults: {
        border: false
    },
    defaultListenerScope: true,
    items: [
        {
            id: 'card-0',
            xtype: 'form',
            reference: 'loginForm',
            defaultType: 'textfield',
            header: {
                style: 'background-color: white;',
                title: {
                    style: 'color: gray;',
                    text: 'LOGIN'
                }
            },
            url: 'login',
            layout: 'vbox',
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
                },
                {
                    xtype: 'component',
                    margin: '20 0 0 0'//,
                    /*autoEl: {
                        tag: "a",
                        html: "Not yet registered?",
                        href: "#",
                        onclick: "showRegisterPage"
                    }*/
                }, {
                    xtype: 'button',
                    type: 'submit',
                    width: 300,
                    margin: '20 0 0 0',
                    name: 'login',
                    text: 'LOGIN',
                    handler: 'loginAdminUser'
                }]


        },
        {
            id: 'card-1',
            xtype: 'main-super-admin-panel'//show this if just ordinary admin. e.g broker
        },
        {
            id: 'card-2',
            xtype: 'broker-super-admin-panel'//show this if super admin. e.g member of flatbook
        },
        {
            id: 'card-3',
            xtype: 'normal-admin-panel'//show this if super admin. e.g member of flatbook
        }
    ],
    loginAdminUser: function () {
        var me = this;
        if (this.isOperationInProgress === true) {
            return;
        }
        var me = this;
        var form = this.down('form'); // get the form panel
        if (form.isValid()) { // make sure the form contains valid data before submitting
            this.isOperationInProgress = true;
            form.submit({
                success: function (form, action) {
                    me.isOperationInProgress = false;
                    var result = action.result;
                    form.reset();
                    try {
                        if (!result) {
                            return;
                        }
                        if (!result.success) {
                            Ext.Msg.alert('Failed', result.msg);
                            return;
                        }
                        var privileges = result.msg.user.privileges.split(",");
                        if (privileges.indexOf("REGISTER_BROKER") > -1) {
                            me.showMainSuperAdmin();
                        } else if (privileges.indexOf("CREATE_ADMIN_USER") > -1) {
                            me.showBrokerSuperAdmin();
                        } else {
                            me.showNormalAdmin();
                        }

                        //Save the authentication token locally using sessionStorage
                        //NOTE: DON'T EVER USE localStorage becacuse it preserve the token indefinitely.
                        //Session storage is used here for security reasons since it gets deleted automatically
                        //when the user closes the browser - This is actually what we want since it
                        //will prevent users from unknowing using someone else token for authentication
                        //thereby causing gross inconsistency and other serious problems.

                        window.sessionStorage.setItem(TradeAdmin.Const.TOKEN_KEY, result.msg.token);

                        var user = result.msg.user;

                        //save the user info in sesssion store
                        window.sessionStorage.setItem(TradeAdmin.Const.USER_KEY, JSON.stringify(user));

                        TradeAdmin.Util.afterLogin();

                    } catch (e) {
                        console.log(e);
                    }

                },
                failure: function (form, action) {
                    me.isOperationInProgress = false;
                    if (action.result && action.result.msg) {
                        Ext.Msg.alert('Failed', action.result.msg);
                    } else if (action.result && typeof action.result === "string") {
                        Ext.Msg.alert('Failed', action.result);
                    } else if (action.msg) {
                        Ext.Msg.alert('Failed', action.msg);
                    } else if (action.response && action.response.responseText) {
                        Ext.Msg.alert('Failed', action.response.responseText);
                    } else if (action.responseText) {
                        Ext.Msg.alert('Failed', action.responseText);
                    } else if (typeof action === "string") {
                        Ext.Msg.alert('Failed', action);
                    }
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid input', 'Please correct errors.');
        }
    },
    showLoginPage: function () {
        window.sessionStorage.clear();//clear the user session - remember you are using JWT. So we are concern about the client session.
        var loginBtn = Ext.getCmp("platf-logout-button");
        loginBtn.setVisible(false);
        var udEl = document.getElementById('user-name-display');
        udEl.innerHTML = "";
        TradeAdmin.Util.user = null;
        this.doCardNavigation(0);
    },
    showMainSuperAdmin: function () {
        this.doCardNavigation(1);
    },
    showBrokerSuperAdmin: function () {
        //prevent broker super admin from registering broker
        var e = Ext.getCmp("bsa-add-admin-grid-id");
        var form = e.down('form').getForm();
        form.findField('register_broker').setVisible(false);

        this.doCardNavigation(2);
    },
    showNormalAdmin: function () {
        this.doCardNavigation(3);
    },
    doCardNavigation: function (incr) {
        /*var me = this;
         var l = me.getLayout();
         var i = l.activeItem.id.split('card-')[1];
         alert(incr);
         alert(i);
         var next = parseInt(i, 10) + incr;
         alert(next);
         l.setActiveItem(next);*/

        this.getLayout().setActiveItem(incr);
    }

});