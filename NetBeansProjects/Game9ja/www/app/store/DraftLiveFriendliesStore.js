Ext.define('GameApp.store.DraftLiveFriendliesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.draft-live-friendlies',
    requires: ['GameApp.model.LiveDraft'
    ],
    model: 'GameApp.model.LiveDraft',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/draft/query/friends_live_matches',
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


