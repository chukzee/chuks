

var CompanyName = "FLATBOOK";
var company_name_txt_shadow = "font-size: 24px; color: gray; text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);";
var mainTitle = "<div style='width: 100%; "/*+"background: green;"*/ + "'>"
        + "<span style='" /*+ "background: blue;"*/ + company_name_txt_shadow + "'>"
        + CompanyName
        + "</span>"
        + "<span id='user-name-display' style='" /*+ "background: red;"*/ + "margin-left: 300px; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);'>"
        + "Not logged in"
        + "</sapn>"
        + "</div>";

Ext.define('TradeApp.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    id: 'main',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'TradeApp.view.main.PlatformView',
        'TradeApp.Util',
        'TradeApp.UpdateManager'
    ],
    height: "100%",
    width: "100%",
    title: mainTitle,
    tabBarHeaderPosition: 2,
    viewModel: 'main',
    controller: 'main',
    //ui: 'navigation',
    tabBar: {
        layout: {
            pack: 'center'
        },
        // turn off borders for classic theme.  neptune and crisp don't need this
        // because they are borderless by default
        border: false
    },
    defaults: {
        //iconAlign: 'top',
        bodyPadding: 0
    },
    items: [{
            xtype: 'plaftorm-layout',
            title: 'Main',
            iconCls: 'fa fa-home'
        }, {
            xtype: 'exchange-room',
            title: 'Exchange Room',
            id: 'exchange-room-tab'
                    // iconCls: 'fa fa-exchange',
        }, {
            xtype: 'contact-us',
            title: 'Contact Us'
                    //iconCls: null,
        }, {
            xtype: 'register',
            title: 'Register',
            id: 'register-tab',
            //iconCls: null,
            tbar: [
                {
                    xtype: 'component',
                    autoEl: {
                        tag: "h3",
                        html: 'Create A Demo Account',
                        style: 'color: gray;'
                    }
                }
            ]


        }],
    listeners: {
        afterrender: 'checkUserSessionExist',
        beforetabchange: 'onMainTabsChange'
    }


});
