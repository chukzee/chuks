/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeAdmin.model.TradePosition');

Ext.define('TradeAdmin.store.TradeHistorySpotFxStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.history-spotfx',
    requires: ['TradeAdmin.model.TradeHistorySpotFx'
    ],
    model: 'TradeAdmin.model.TradeHistorySpotFx',
    pageSize: 10,
    //autoLoad: true,
    requestAccountBalance: true,
    proxy: {
        type: 'ajax',
        url : 'access/query/history/spotfx',
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

