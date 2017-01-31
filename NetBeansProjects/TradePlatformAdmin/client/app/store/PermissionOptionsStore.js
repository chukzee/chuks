/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeAdmin.model.TradePosition');

Ext.define('TradeAdmin.store.PermissionOptionsStore', {
    extend: 'Ext.data.Store',
    listeners: {
        /**
         * Called before the store proxy makes a request to get new data
         * 
         * @param {type} store
         * @param {type} operation
         * @param {type} eOpts
         * @returns {undefined}
         */
        beforeload: function (store, operation, eOpts) {
            
            var p = store.getProxy();

            var params = p.getExtraParams();
            params.access_token = TradeAdmin.Util.getAccessToken();
            
        },
        /**
         * Called after the store proxy respose
         * 
         * @param {type} store
         * @param {type} operation
         * @param {type} eOpts
         * @returns {undefined}
         */
        load: function (store, operation, eOpts) {

            //Ext.GlobalEvents.fireEvent('options_total_positions', store);
        }
    }


});




