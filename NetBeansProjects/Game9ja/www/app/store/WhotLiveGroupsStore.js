Ext.define('GameApp.store.WhotLiveGroupsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.whot-live-groups',
    requires: ['GameApp.model.LiveWhot'
    ],
    model: 'GameApp.model.LiveWhot',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/whot/query/group_live_matches',
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


