
Ext.define('TradeAdmin.store.BrokerStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.broker',
    requires: ['TradeAdmin.model.Broker'
    ],
    model: 'TradeAdmin.model.Broker',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access/query/brokers',
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
