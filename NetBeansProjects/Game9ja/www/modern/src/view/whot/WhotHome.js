
Ext.define('GameApp.view.whot.WhotHome', {
    extend: 'Ext.TabPanel',
    xtype: 'whot-home',
    fullscreen: true,    
    requires: [
        'GameApp.view.whot.WhotView',
        'GameApp.view.whot.WhotWatch',
        'GameApp.view.whot.WhotLiveFriendlies',
        'GameApp.view.whot.WhotLiveGroups',
        'GameApp.view.whot.WhotLiveTournaments'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Friendlies',
            xtype:'whot-live-friendlies',
        },
        {
            title: 'Groups',
            xtype:'whot-live-groups',
        },
        {
            title: 'Tournaments',
            xtype:'whot-live-tournaments',
        }
    ]
});