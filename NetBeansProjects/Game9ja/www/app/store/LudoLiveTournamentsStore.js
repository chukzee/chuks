Ext.define('GameApp.store.LudoLiveTournamentsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.ludo-live-tournaments',
    requires: ['GameApp.model.LiveLudo'
    ],
    model: 'GameApp.model.LiveLudo',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/ludo/query/tournament_live_matches',
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


