Ext.define('GameApp.store.LudoLiveFriendliesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.ludo-live-friendlies',
    requires: ['GameApp.model.LiveLudo'
    ],
    model: 'GameApp.model.LiveLudo',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/ludo/query/friends_live_matches',
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


