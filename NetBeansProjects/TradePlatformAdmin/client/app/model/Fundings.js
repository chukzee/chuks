/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeAdmin.model.Fundings', {
    extend: 'Ext.data.Model',

    alias: 'model.fundings',

    fields: ['first_name', 'last_name', 'exchange_id', 'username', 'email', 'amount', 'date'] //more fields may be included.
});

