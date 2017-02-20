
Ext.define('GameApp.view.chess.ChessHome', {
    extend: 'Ext.TabPanel',
    xtype: 'chess-home',
    fullscreen: true,

    requires: [
        'GameApp.view.chess.ChessView'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Chess tab 1',
            html: 'Chess tab content 1'
        },
        {
            title: 'Chess tab 2',
            html: 'Chess tab content 2'
        }
    ]
});