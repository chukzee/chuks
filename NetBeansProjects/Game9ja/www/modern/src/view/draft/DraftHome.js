
Ext.define('GameApp.view.draft.DraftHome', {
    extend: 'Ext.TabPanel',
    xtype: 'draft-home',
    fullscreen: true,    
    requires: [
        'GameApp.view.draft.DraftView',
        'GameApp.view.draft.DraftWatch',
        'GameApp.view.draft.DraftLiveFriendlies',
        'GameApp.view.draft.DraftLiveGroups',
        'GameApp.view.draft.DraftLiveTournaments'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Friendlies',
            xtype:'draft-live-friendlies',
        },
        {
            title: 'Groups',
            xtype:'draft-live-groups',
        },
        {
            title: 'Tournaments',
            xtype:'draft-live-tournaments',
        }
    ]
});