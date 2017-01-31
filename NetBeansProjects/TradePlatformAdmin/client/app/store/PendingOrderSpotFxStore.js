/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TradeAdmin.store.PendingOrderSpotFxStore', {
    extend: 'TradeAdmin.store.PermissionStore',
    alias: 'store.pending-spotfx',
    requires: ['TradeAdmin.model.PendingOrderSpotFx'
    ],
    model: 'TradeAdmin.model.PendingOrderSpotFx',
    pageSize: 10,
    //autoLoad: true,
    requestAccountBalance: true,
    proxy: {
        type: 'ajax',
        url : 'access/query/pending/spotfx',
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

