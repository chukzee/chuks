/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeApp.model.ExchangeSpotFx', {
    extend: 'Ext.data.Model',

    alias: 'model.exchange-spotfx',

    fields: ['order','method', 'buyer_action', 'symbol', 'direction',  'pending_order_price','stop_loss','take_profit','exchange_expiry', 'time', 'size', 'seller_id'] //more fields may be included.
});

