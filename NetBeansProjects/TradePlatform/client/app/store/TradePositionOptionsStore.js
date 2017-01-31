/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeApp.model.TradePosition');

Ext.define('TradeApp.store.TradePositionOptionsStore', {
    extend: 'TradeApp.store.PermissionOptionsStore',
    alias: 'store.trades-options',
    requires: ['TradeApp.model.TradePositionOptions'
    ],
    model: 'TradeApp.model.TradePositionOptions',
    pageSize: 10,
    //autoLoad: true,
    requestAccountBalance: true,
    proxy: {
        type: 'ajax',
        url : 'access_247/query/open/options',
        actionMethods : { 
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

