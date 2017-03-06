Ext.define('GameApp.store.SolitaireLiveFriendliesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.solitaire-live-friendlies',
    requires: ['GameApp.model.LiveSolitaire'
    ],
    model: 'GameApp.model.LiveSolitaire',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/solitaire/query/friends_live_matches',
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


