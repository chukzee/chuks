Ext.define('GameApp.store.TournamentLiveChessStore', {
    extend: 'Ext.data.Store',
    alias: 'store.tournament-live-chess',
    requires: ['TradeApp.model.LiveChess'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/chess/query/tournament_live_matches',
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    }

});


