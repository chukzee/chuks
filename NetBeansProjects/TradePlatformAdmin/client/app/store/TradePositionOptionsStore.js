/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeAdmin.model.TradePosition');

Ext.define('TradeAdmin.store.TradePositionOptionsStore', {
    extend: 'TradeAdmin.store.PermissionOptionsStore',
    alias: 'store.trades-options',
    requires: ['TradeAdmin.model.TradePositionOptions'
    ],
    model: 'TradeAdmin.model.TradePositionOptions',
    pageSize: 10,
    //autoLoad: true,
    requestAccountBalance: true,
    proxy: {
        type: 'ajax',
        url : 'access/query/open/options',
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

