/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeApp.model.TradePosition');

Ext.define('TradeApp.store.ExchangeSpotFxStore', {
    extend: 'TradeApp.store.PermissionStore',
    alias: 'store.exchange-spotfx',
    requires: ['TradeApp.model.ExchangeSpotFx'
    ],
    model: 'TradeApp.model.ExchangeSpotFx',
    //autoLoad: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'access_247/query/general/spotfx_exchange',
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

