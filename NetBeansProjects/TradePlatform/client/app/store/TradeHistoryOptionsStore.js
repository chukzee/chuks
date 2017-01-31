/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeApp.model.TradePosition');

Ext.define('TradeApp.store.TradeHistoryOptionsStore', {
    extend: 'TradeApp.store.PermissionStore',
    alias: 'store.history-options',
    requires: ['TradeApp.model.TradeHistoryOptions'
    ],
    model: 'TradeApp.model.TradeHistoryOptions',
    pageSize: 10,
    requestAccountBalance: true,
    //autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access_247/query/history/options',
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

