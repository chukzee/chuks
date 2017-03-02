Ext.define('GameApp.store.GroupLiveDraftStore', {
    extend: 'Ext.data.Store',
    alias: 'store.group-live-draft',
    requires: ['GameApp.model.LiveDraft'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/draft/query/group_live_matches',
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


