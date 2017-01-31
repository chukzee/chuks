/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var trade_pos_spotfx_store = Ext.create('TradeApp.store.TradePositionSpotFxStore');

Ext.define('TradeApp.view.main.TradePositionSpotFxGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.util.*',
        'Ext.toolbar.Paging',
        'Ext.selection.RowModel'        
                //'Ext.ux.PreviewPlugin',
    ],
    xtype: 'tradepos-spotfx-grid',
    id: "trade-open-spotfx-grid-id",
    store: trade_pos_spotfx_store,
    width: "100%",
    height: "100%",
    // Need a minHeight. Neptune resizable framed panels are overflow:visible so as to
    // enable resizing handles to be embedded in the border lines.
    //minHeight: 200,//no no no Don't set mininum height so that the paginating tool will always show be visible
    //title: 'Market Instruments',
    selModel: Ext.create('Ext.selection.RowModel', {}),
    resizable: false,
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: trade_pos_spotfx_store,
            dock: 'bottom',
            displayInfo: true
        }],
    /*tbar: [
     {
     xtype: 'displayfield',
     fieldLabel: 'Positions',
     reference:'spotfx_total_open_positions',
     labelWidth: 60,
     width: 180,
     value: '0'
     }, {
     xtype: 'component',
     flex: 1
     }, {
     xtype: 'displayfield',
     fieldLabel: 'Floating Profit',
     reference:'spotfx_floating_profit',
     labelWidth: 90,
     width: 220,
     value: '$0.00'
     }
     ],*/
    columns: [{
            text: 'Countdown',
            dataIndex: 'countdown',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var order_ticket = record.get('order');
                return TradeApp.Countdown.get(order_ticket);
            }
        }, {
            text: 'Time',
            dataIndex: 'time',
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
            text: 'Direction',
            dataIndex: 'direction',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var seller_direction = record.get("seller_direction");
                var buyer_direction = record.get("buyer_direction");
                var direction = record.get("direction");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && seller_direction) {
                    return seller_direction;
                } else if (exchange_id === buyer_id && buyer_direction) {
                    return buyer_direction;
                } else {
                    return direction;
                }

            }
        }, {
            text: 'Size',
            dataIndex: 'size',
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
            text: 'S/L',
            dataIndex: 'stop_loss',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var seller_stop_loss = record.get("seller_stop_loss");
                var buyer_stop_loss = record.get("buyer_stop_loss");
                var stop_loss = record.get("stop_loss");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && seller_stop_loss) {
                    return seller_stop_loss;
                } else if (exchange_id === buyer_id && buyer_stop_loss) {
                    return buyer_stop_loss;
                } else {
                    return stop_loss;
                }

            }
        }, {
            text: 'T/P',
            dataIndex: 'take_profit',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var seller_take_profit = record.get("seller_take_profit");
                var buyer_take_profit = record.get("buyer_take_profit");
                var take_profit = record.get("take_profit");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && seller_take_profit) {
                    return seller_take_profit;
                } else if (exchange_id === buyer_id && buyer_take_profit) {
                    return buyer_take_profit;
                } else {
                    return take_profit;
                }

            }
        }, {
            text: 'Close',
            dataIndex: 'close',
            sortable: false
        }]
});
