/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var trade_history_spotfx_store = Ext.create('TradeAdmin.store.TradeHistorySpotFxStore');

Ext.define('TradeAdmin.view.account.TradeHistorySpotFxGrid', {
    extend: 'TradeAdmin.view.account.TradePositionSpotFxGrid',
    xtype: 'trade-history-spotfx-grid',
    //id: "trade-history-spotfx-grid-id",
    store: trade_history_spotfx_store,
    /*tbar: [{
            xtype: 'displayfield',
            reference: 'spotfx_initial_deposit',
            fieldLabel: 'Initial Deposit',
            labelWidth: 100,
            width: 100,
            value: ''//TESTING!!!
        }
    ],*/
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: trade_history_spotfx_store,
            dock: 'bottom',
            displayInfo: true
        }],
    columns: [{
            text: 'Time',
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
        }, {
            text: 'Result',
            dataIndex: 'result',
            sortable: false
        }, {
            text: 'Commission',
            dataIndex: 'commission',
            sortable: false
        }, {
            text: 'Profit / Loss',
            dataIndex: 'profit_and_loss',
            sortable: false
        }]
});
