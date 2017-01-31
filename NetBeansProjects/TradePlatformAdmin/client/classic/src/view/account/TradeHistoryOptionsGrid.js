/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var trade_history_options_store = Ext.create('TradeAdmin.store.TradeHistoryOptionsStore');

Ext.define('TradeAdmin.view.account.TradeHistoryOptionsGrid', {
    extend: 'TradeAdmin.view.account.TradePositionOptionsGrid',
    xtype: 'trade-history-options-grid',
    //id: "trade-history-options-grid-id",
    store: trade_history_options_store,
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
            store: trade_history_options_store,
            dock: 'bottom',
            displayInfo: true
        }],
    columns: [{
            text: 'Time',
            dataIndex: 'time',
            sortable: false//,
            //renderer: Ext.util.Format.dateRenderer('d-m-Y H:i:s')//no no no! causes it to use the local time which is wrong approach
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
            sortable: false
        }, {
            text: 'Symbol',
            dataIndex: 'symbol',
            sortable: false
        }, {
            text: 'Open',
            dataIndex: 'open',
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
            sortable: false
        }, {
            text: 'Expiry',
            dataIndex: 'expiry',
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
            text: 'Close',
            dataIndex: 'close',
            sortable: false
        }, {
            text: 'Result',
            dataIndex: 'result',
            sortable: false
        },/* {
            text: 'Payout',
            dataIndex: 'payout',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var payout = record.get("payout");
                var exchange_id = TradeAdmin.Util.getUserExchangeId();
                if (exchange_id === seller_id && !payout) {
                    return record.get("seller_payout");
                } else if (exchange_id === buyer_id && !payout) {
                    return record.get("buyer_payout");
                } else {
                    return payout;
                }

            }
        },*/ {
            text: 'Commission',
            dataIndex: 'commission',
            sortable: false
        }, {
            text: 'Payout / Loss',
            dataIndex: 'profit_and_loss',
            sortable: false
        }]
});
