
Ext.define('TradeAdmin.store.LiveTraderStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.live-trader',
    requires: ['TradeAdmin.model.Trader'
    ],
    model: 'TradeAdmin.model.Trader',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access/query/live_traders',
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
