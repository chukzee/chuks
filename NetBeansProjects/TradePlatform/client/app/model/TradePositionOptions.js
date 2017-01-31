/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor. 
 */

Ext.define('TradeApp.model.TradePositionOptions', {
    extend: 'Ext.data.Model',

    alias: 'model.tradepos-options',
//
    //fields: ['option', 'symbol', 'type', 'strike', 'close_price','count_down', 'expiry', 'profit', 'result'] //more fields may be included.
    
    fields: ['order', 'type', 'product', 'symbol', 'open', 'pending_order_price', 'strike', 'strike_up', 
        'strike_down', 'barrier', 'barrier_up', 'barrier_down',  'size', 'price',
         'premium', 'countdown','time' ,'expiry', 'pending_order_expiry',
        'close','result', 'payout', 'commission', 'profit_and_loss'] //more fields may be included.
});

