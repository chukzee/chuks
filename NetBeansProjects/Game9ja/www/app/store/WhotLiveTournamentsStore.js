Ext.define('GameApp.store.WhotLiveTournamentsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.whot-live-tournaments',
    requires: ['GameApp.model.LiveWhot'
    ],
    model: 'GameApp.model.LiveWhot',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/whot/query/tournament_live_matches',
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


