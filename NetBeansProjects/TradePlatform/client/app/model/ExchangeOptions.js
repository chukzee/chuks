/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeApp.model.ExchangeOptions', {
    extend: 'Ext.data.Model',

    alias: 'model.exchange-options',

    fields: ['order','method', 'buyer_action', 'product', 'symbol' , 'pending_order_price', 'strike', 'exchange_expiry', 'time', 'expiry', 'size', 'price','premium', 'seller_id'] //more fields may be included.
});

