Ext.define('GameApp.store.DraftLiveGroupsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.draft-live-groups',
    requires: ['GameApp.model.LiveDraft'
    ],
    model: 'GameApp.model.LiveDraft',
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


