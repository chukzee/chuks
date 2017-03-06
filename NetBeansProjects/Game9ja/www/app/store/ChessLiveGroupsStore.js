Ext.define('GameApp.store.ChessLiveGroupsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.chess-live-groups',
    requires: ['GameApp.model.LiveChess'
    ],
    model: 'GameApp.model.LiveChess',
    autoLoad: true,
    proxy: {
        //type: 'ajax',// UNCOMENT AFTER TESTING
        type: 'memory', //COMMENT OUT THIS LINE AFTER TESTING
        url: 'access/chess/query/group_live_matches',
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
    },

    //REMIND - COMMENT OUT THE data PROPERTY AFTER TESTING

    data: {}
});


