/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.model.TradePositionSpotFx', {
    extend: 'Ext.data.Model',

    alias: 'model.tradepos-spotfx',

    //fields: ['option', 'symbol', 'type', 'strike', 'close_price','count_down', 'expiry', 'profit', 'result'] //more fields may be included.
    fields: ['order', 'time',  'expiry', 'pending_order_expiry', 'type', 'direction', 'size','symbol', 
        'open', 'pending_order_price', 'stop_loss', 'take_profit', 'close', 
        'countdown', 'result', 'commission', 'profit_and_loss'] //more fields may be included.
});

