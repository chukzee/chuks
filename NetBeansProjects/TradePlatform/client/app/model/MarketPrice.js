/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.model.MarketPrice', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name: 'time', type: 'number'},
        {name: 'open', type: 'number'},
        {name: 'high', type: 'number'},
        {name: 'low', type: 'number'},
        {name: 'close', type: 'number'},
        {name: 'pl_price', type: 'number'}// price line
    ]

});



