/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var trade_pos_options_store = Ext.create('TradeAdmin.store.TradePositionOptionsStore');

Ext.define('TradeAdmin.view.account.TradePositionOptionsGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.util.*',
        'Ext.toolbar.Paging'
                //'Ext.ux.PreviewPlugin',
    ],
    xtype: 'tradepos-options-grid',
    //id: "trade-open-options-grid-id",
    store: trade_pos_options_store,
    //width: "100%",
    //height: "100%",
    // Need a minHeight. Neptune resizable framed panels are overflow:visible so as to
    // enable resizing handles to be embedded in the border lines.
    //minHeight: 200,//no no no Don't set mininum height so that the paginating tool will always show be visible
    //title: 'Market Instruments',
    
    
    resizable: false,
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: trade_pos_options_store,
            dock: 'bottom',
            displayInfo: true
        }],
    /*tbar: [
        {
            xtype: 'displayfield',
            fieldLabel: 'Positions',
            reference: 'options_total_open_positions',
            labelWidth: 60,
            width: 180,
            value: '0'
        }, {
            xtype: 'component',
            flex: 1
        }, {
            xtype: 'displayfield',
            fieldLabel: 'Total premium paid',
            reference: 'options_total_premium_paid',
            labelWidth: 120,
            width: 220,
            value: '$0.00'
        }
    ],*/
    columns: [/*{
            text: 'Countdown',
            dataIndex: 'countdown',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                //var order_ticket = record.get('order');
                //return TradeAdmin.Countdown.get(order_ticket);//The cuprit!!! no Countdown!
                return "...";
            }
        }, */{
            text: 'Time',
            dataIndex: 'time',
            sortable: false,
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                var longTime = new Date(value).getTime();
                if(isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()){
                    return "";
                }
                //return Ext.util.Format.date(value, 'd-m-Y H:i:s');//no no no! causes it to use the local time which is wrong approach
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
        }/*, {//DEPRECATED
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
                //return Ext.util.Format.date(value, 'd-m-Y H:i:s');//no no no! causes it to use the local time which is wrong approach
                return value;
            }
        }, {
            text: 'Close',
            dataIndex: 'close',
            sortable: false
        }]
});
