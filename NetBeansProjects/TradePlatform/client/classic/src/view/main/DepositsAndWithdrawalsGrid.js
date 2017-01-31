/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var store = Ext.create('TradeApp.store.DepositsAndWithdrawalsStore');

Ext.define('TradeApp.view.main.DepositsAndWithdrawalsGrid', {
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
    xtype: 'deposits-and-withdrawals-grid',
    id: "deposits-and-withdrawals-id",
    store: store,
    width: "100%",
    height: "100%",
    // Need a minHeight. Neptune resizable framed panels are overflow:visible so as to
    // enable resizing handles to be embedded in the border lines.
    //minHeight: 200,//no no no Don't set mininum height so that the paginating tool will always show be visible
    //title: 'Market Instruments',
    resizable: false,
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: store,
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
    columns: [{
            text: 'Date',
            dataIndex: 'date',
            flex: 1,
            renderer:  function(value, metaData, record, rowIndex, colIndex, store, view){
                var longTime = new Date(value).getTime();
                if(isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()){
                    return "";
                }
                return  Ext.util.Format.date(value, 'd-m-Y H:i:s');
            }
        }, {
            text: 'Type',
            dataIndex: 'type',
            flex: 1
        }, /* {
         text: 'Details',
         dataIndex: 'details',
         flex: 1
         },*/ {
            text: 'Amount',
            dataIndex: 'amount',
            flex: 1
        }]
});
