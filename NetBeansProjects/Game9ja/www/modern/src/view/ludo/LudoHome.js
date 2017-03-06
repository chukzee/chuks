
Ext.define('GameApp.view.ludo.LudoHome', {
    extend: 'Ext.TabPanel',
    xtype: 'ludo-home',
    fullscreen: true,    
    requires: [
        'GameApp.view.ludo.LudoView',
        'GameApp.view.ludo.LudoWatch',
        'GameApp.view.ludo.LudoLiveFriendlies',
        'GameApp.view.ludo.LudoLiveGroups',
        'GameApp.view.ludo.LudoLiveTournaments'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Friendlies',
            xtype:'ludo-live-friendlies',
        },
        {
            title: 'Groups',
            xtype:'ludo-live-groups',
        },
        {
            title: 'Tournaments',
            xtype:'ludo-live-tournaments',
        }
    ]
});