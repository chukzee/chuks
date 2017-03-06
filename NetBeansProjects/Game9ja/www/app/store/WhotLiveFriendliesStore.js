Ext.define('GameApp.store.WhotLiveFriendliesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.whot-live-friendlies',
    requires: ['GameApp.model.LiveWhot'
    ],
    model: 'GameApp.model.LiveWhot',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/whot/query/friends_live_matches',
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


