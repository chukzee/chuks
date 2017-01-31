/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeApp.model.TradePosition');

Ext.define('TradeApp.store.DepositsAndWithdrawalsStore', {
    extend: 'TradeApp.store.PermissionStore',
    alias: 'store.deposits-and-withdrawals',
    requires: ['TradeApp.model.DepositsAndWithdrawals'
    ],
    model: 'TradeApp.model.DepositsAndWithdrawals',
    pageSize: 10,
    requestAccountBalance: true,
    //autoLoad: true,
    proxy: {
        type: 'ajax',
        url : 'access_247/query/history/deposits_and_withdrawals',
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

