/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeApp.model.PersonalExchangeSpotFx', {
    extend: 'Ext.data.Model',

    alias: 'model.personal-exchange-spotfx',

    fields: ['sn','order','method', 'symbol', 'direction', 'pending_order_price', 'stop_loss','take_profit', 'exchange_expiry', 'time', 'size', 'seller_id', 'buyer_id'] //more fields may be included.
    
});

