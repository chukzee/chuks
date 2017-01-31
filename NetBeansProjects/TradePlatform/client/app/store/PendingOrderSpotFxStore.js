/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TradeApp.store.PendingOrderSpotFxStore', {
    extend: 'TradeApp.store.PermissionStore',
    alias: 'store.pending-spotfx',
    requires: ['TradeApp.model.PendingOrderSpotFx'
    ],
    model: 'TradeApp.model.PendingOrderSpotFx',
    pageSize: 10,
    //autoLoad: true,
    requestAccountBalance: true,
    proxy: {
        type: 'ajax',
        url : 'access_247/query/pending/spotfx',
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

