Ext.define('GameApp.store.LiveChessStore', {
    extend: 'Ext.data.Store',
    alias: 'store.live-chess',
    requires: ['GameApp.model.LiveChess'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/chess/query/live_matches',
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


