
Ext.define('TradeAdmin.store.AdminUserStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.admin-user',
    requires: ['TradeAdmin.model.AdminUser'
    ],
    model: 'TradeAdmin.model.AdminUser',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access/query/admin_users',
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
