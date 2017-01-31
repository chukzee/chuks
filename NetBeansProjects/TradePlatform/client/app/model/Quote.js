/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.model.Quote', {
    extend: 'Ext.data.Model',

    alias: 'model.quote',

    fields: ['market_type', 'symbol', 'price'] //more fields may be included.
    
});


