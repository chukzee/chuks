Ext.define('GameApp.store.FriendsLiveDraftStore', {
    extend: 'Ext.data.Store',
    alias: 'store.friends-live-draft',
    requires: ['GameApp.model.LiveDraft'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/draft/query/friens_live_matches',
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


