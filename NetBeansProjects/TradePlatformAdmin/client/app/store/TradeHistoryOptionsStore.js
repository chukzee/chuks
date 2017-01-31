/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeAdmin.model.TradePosition');

Ext.define('TradeAdmin.store.TradeHistoryOptionsStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.history-options',
    requires: ['TradeAdmin.model.TradeHistoryOptions'
    ],
    model: 'TradeAdmin.model.TradeHistoryOptions',
    pageSize: 10,
    requestAccountBalance: true,
    //autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access/query/history/options',
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

