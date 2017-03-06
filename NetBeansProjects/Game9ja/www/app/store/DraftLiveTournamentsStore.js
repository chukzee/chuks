Ext.define('GameApp.store.DraftLiveTournamentsStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.draft-live-tournaments',
    requires: ['GameApp.model.LiveDraft'
    ],
    model: 'GameApp.model.LiveDraft',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/draft/query/tournament_live_matches',
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


