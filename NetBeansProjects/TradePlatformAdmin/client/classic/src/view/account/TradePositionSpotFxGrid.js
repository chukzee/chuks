/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var trade_pos_spotfx_store = Ext.create('TradeAdmin.store.TradePositionSpotFxStore');

Ext.define('TradeAdmin.view.account.TradePositionSpotFxGrid', {
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
    //id: "trade-open-spotfx-grid-id",
    store: trade_pos_spotfx_store,
    //width: "100%",
    //height: "100%",
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
    columns: [/*{
            text: 'Countdown',
            dataIndex: 'countdown',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                //var order_ticket = record.get('order');
                //return TradeAdmin.Countdown.get(order_ticket);//The cuprit!!! no Countdown!
                return "...";
            }
        },*/ {
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
            sortable: false
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
            sortable: false
        }, {
            text: 'T/P',
            dataIndex: 'take_profit',
            sortable: false
        }, {
            text: 'Close',
            dataIndex: 'close',
            sortable: false
        }]
});
