Ext.define('GameApp.store.TournamentLiveDraftStore', {
    extend: 'Ext.data.Store',
    alias: 'store.tournament-live-draft',
    requires: ['TradeApp.model.LiveDraft'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/draft/query/tournament_live_matches',
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


