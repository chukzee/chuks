/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var pending_order_options_store = Ext.create('TradeApp.store.PendingOrderOptionsStore');

Ext.define('TradeApp.view.main.PendingOrderOptionsGrid', {
    extend: 'TradeApp.view.main.TradePositionOptionsGrid',
    xtype: 'pending-order-options-grid',
    id: "pending-order-options-grid-id",
    store: pending_order_options_store,
    /*tbar: [{
     xtype: 'displayfield',
     reference: 'options_initial_deposit',
     fieldLabel: 'Initial Deposit',
     labelWidth: 100,
     width: 100,
     value: ''
     }
     ],*/
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: pending_order_options_store,
            dock: 'bottom',
            displayInfo: true
        }],
    columns: [{
            text: 'Time Created',
            dataIndex: 'time',
            sortable: false,
            renderer:  function(value, metaData, record, rowIndex, colIndex, store, view){
                var longTime = new Date(value).getTime();
                if(isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()){
                    return "";
                }
                //return  Ext.util.Format.date(value, 'd-m-Y H:i:s');//no no no! causes it to use the local time which is wrong approach
                return value;
            }
        }, {
            text: 'Expiry',
            dataIndex: 'pending_order_expiry',
            sortable: false,
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                var longTime = new Date(value).getTime();
                if(isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()){
                    return "";
                }
                //return  Ext.util.Format.date(value, 'd-m-Y H:i:s');//no no no! causes it to use the local time which is wrong approach
                return value;
            }
        }, {
            text: 'Order',
            dataIndex: 'order'
        }, {
            text: 'Type',
            dataIndex: 'type',
            sortable: false
        }, {
            text: 'Product',
            dataIndex: 'product',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var product = record.get("product");
                var seller_product = record.get("seller_product");
                var buyer_product = record.get("buyer_product");

                var exchange_id = TradeApp.Util.getUserExchangeId();

                if (exchange_id === seller_id && seller_product) {
                    return record.get("seller_product");
                } else if (exchange_id === buyer_id && buyer_product) {
                    return record.get("buyer_product");
                } else {
                    return product;
                }

            }
        }, {
            text: 'Symbol',
            dataIndex: 'symbol',
            sortable: false
        }, {
            text: 'Trigger Price',
            dataIndex: 'pending_order_price',
            sortable: false
        }, {
            text: 'Strike',
            dataIndex: 'strike',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var strike = record.get("strike");
                var strike_up = record.get("strike_up") - 0;
                var strike_down = record.get("strike_down") - 0;
                
                if (strike_up !== 0 || strike_down !== 0) {
                    strike_up = Math.abs(strike_up); //yes, just to remove + sign if any
                    var str_strike_up = "+" + strike_up;
                    return '<div>' + str_strike_up + '</div><div>' + strike_down + '</div>';
                }else{
                    return strike;
                }

            }
        }, {
            text: 'Barrier',
            dataIndex: 'barrier',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var barrier = record.get("barrier");
                var barrier_up = record.get("barrier_up") - 0;
                var barrier_down = record.get("barrier_down") - 0;
                
                if ((barrier_up !== 0 || barrier_down !== 0) && barrier_up !== barrier_down) {
                    //barrier_up = Math.abs(barrier_up); //yes, just to remove + sign if any
                    //var str_barrier_up = "+" + barrier_up;
                    //return '<div>' + str_barrier_up + '</div><div>' + barrier_down + '</div>';
                    return '<div>' + barrier_up + '</div><div>' + barrier_down + '</div>';
                }else{
                    return barrier;
                }

            }
        }, {
            text: 'Size',
            dataIndex: 'size',
            sortable: false
        }, {
            text: 'Price (%)',
            dataIndex: 'price',
            sortable: false
        }/*, {DEPRECATED
         text: 'Premium Received',
         dataIndex: 'premium_received',
         sortable: false
         }*/, {
            text: 'Premium (%)',
            dataIndex: 'premium',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var premium = record.get("premium");
                var seller_premium = record.get("seller_premium");
                var buyer_premium = record.get("buyer_premium");
                
                var exchange_id = TradeApp.Util.getUserExchangeId();
                
                if (exchange_id === seller_id && seller_premium) {
                    return seller_premium;
                } else if (exchange_id === buyer_id && buyer_premium) {
                    return buyer_premium;
                }else{
                    return premium;                    
                }

            }
        }
        ]
});
