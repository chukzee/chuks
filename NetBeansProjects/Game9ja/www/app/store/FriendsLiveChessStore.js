Ext.define('GameApp.store.FriendsLiveChessStore', {
    extend: 'Ext.data.Store',
    alias: 'store.friends-live-chess',
    requires: ['GameApp.model.LiveChess'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/chess/query/friends_live_matches',
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


