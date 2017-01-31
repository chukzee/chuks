/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeApp.model.PersonalExchangeOptions', {
    extend: 'Ext.data.Model',

    alias: 'model.personal-exchange-options',

    fields: ['sn', 'order','method', 'product', 'symbol' , 'pending_order_price', 'strike', 'strike_up', 'strike_down','exchange_expiry', 'time', 'expiry', 'size', 'price','premium', 'seller_id', 'buyer_id'] //more fields may be included.

    
});

