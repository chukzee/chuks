
Ext.define('TradeAdmin.store.RebatePerDayStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.rebate-per-month',
    requires: ['TradeAdmin.model.RebatePerDay'
    ],
    model: 'TradeAdmin.model.RebatePerDay',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access/query/rebate_per_day',
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
