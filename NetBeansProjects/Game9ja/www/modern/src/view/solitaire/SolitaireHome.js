
Ext.define('GameApp.view.solitaire.SolitaireHome', {
    extend: 'Ext.TabPanel',
    xtype: 'solitaire-home',
    fullscreen: true,    
    
    requires: [
        'GameApp.view.solitaire.SolitaireView',
        'GameApp.view.solitaire.SolitaireWatch',
        'GameApp.view.solitaire.SolitaireLiveFriendlies',
        'GameApp.view.solitaire.SolitaireLiveGroups',
        'GameApp.view.solitaire.SolitaireLiveTournaments'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Friendlies',
            xtype:'solitaire-live-friendlies',
        },
        {
            title: 'Groups',
            xtype:'solitaire-live-groups',
        },
        {
            title: 'Tournaments',
            xtype:'solitaire-live-tournaments',
        }
    ]
});