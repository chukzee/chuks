/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeApp.model.TradePosition');

Ext.define('TradeApp.store.PersonalExchangeOptionsStore', {
    extend: 'TradeApp.store.PermissionStore',
    alias: 'store.personal-exchange-options',
    requires: ['TradeApp.model.PersonalExchangeOptions'
    ],
    model: 'TradeApp.model.PersonalExchangeOptions',
    pageSize: 20,
    //autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'access_247/query/personal/options_exchange',
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

