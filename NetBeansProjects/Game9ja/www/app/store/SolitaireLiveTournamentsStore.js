Ext.define('GameApp.store.SolitaireLiveTournamentsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.solitaire-live-tournaments',
    requires: ['GameApp.model.LiveSolitaire'
    ],
    model: 'GameApp.model.LiveSolitaire',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/solitaire/query/tournament_live_matches',
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


