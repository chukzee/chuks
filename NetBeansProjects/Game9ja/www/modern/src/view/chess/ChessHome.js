
Ext.define('GameApp.view.chess.ChessHome', {
    extend: 'Ext.TabPanel',
    xtype: 'chess-home',
    fullscreen: true,    
    
    requires: [
        'GameApp.view.chess.ChessView',
        'GameApp.view.chess.ChessWatch',
        'GameApp.view.chess.ChessLiveFriendlies',
        'GameApp.view.chess.ChessLiveGroups',
        'GameApp.view.chess.ChessLiveTournaments'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Friendlies',
            xtype:'chess-live-friendlies',
        },
        {
            title: 'Groups',
            xtype:'chess-live-groups',
        },
        {
            title: 'Tournaments',
            xtype:'chess-live-tournaments',
        }
    ]
});