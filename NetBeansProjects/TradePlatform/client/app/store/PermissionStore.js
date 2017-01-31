/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var trades_model = Ext.create('TradeApp.model.TradePosition');

Ext.define('TradeApp.store.PermissionStore', {
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
            if(store.requestAccountBalance){
                TradeApp.Util.requestAccountBalance();
            }
            var p = store.getProxy();

            var params = p.getExtraParams();
            params.access_token = TradeApp.Util.getAccessToken();
            params.version = TradeApp.Util.version;
            
        }
    }


});




