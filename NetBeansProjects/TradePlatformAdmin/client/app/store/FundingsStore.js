
Ext.define('TradeAdmin.store.FundingsStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.fundings',
    requires: ['TradeAdmin.model.Fundings'
    ],
    model: 'TradeAdmin.model.Fundings',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access/query/fundings',
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'table',
            totalProperty: 'total'
        }
    }
});

