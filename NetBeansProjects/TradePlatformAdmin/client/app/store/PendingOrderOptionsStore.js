/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TradeAdmin.store.PendingOrderOptionsStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.pending-options',
    requires: ['TradeAdmin.model.PendingOrderOptions'
    ],
    model: 'TradeAdmin.model.PendingOrderOptions',
    pageSize: 10,
    requestAccountBalance: true,
    //autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/query/pending/options',
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

