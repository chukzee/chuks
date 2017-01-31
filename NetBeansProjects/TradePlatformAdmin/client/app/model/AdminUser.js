/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('TradeAdmin.model.AdminUser', {
    extend: 'Ext.data.Model',

    alias: 'model.admin-user',

    fields: ['username',  'password', 'first_name', 'last_name', 'email',
        'privileges', 'created_by', 'date_created'] //more fields may be included.
});

