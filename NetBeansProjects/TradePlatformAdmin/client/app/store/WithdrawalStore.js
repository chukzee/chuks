
Ext.define('TradeAdmin.store.WithdrawalStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.withdrawal',
    requires: ['TradeAdmin.model.Withdrawal'
    ],
    model: 'TradeAdmin.model.Withdrawal',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access/query/withdrawals',
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
