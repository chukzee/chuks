/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TradeApp.store.PendingOrderOptionsStore', {
    extend: 'TradeApp.store.PermissionStore',
    alias: 'store.pending-options',
    requires: ['TradeApp.model.PendingOrderOptions'
    ],
    model: 'TradeApp.model.PendingOrderOptions',
    pageSize: 10,
    requestAccountBalance: true,
    //autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access_247/query/pending/options',
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

