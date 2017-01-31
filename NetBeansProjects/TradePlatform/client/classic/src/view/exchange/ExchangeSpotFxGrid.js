/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var exchange_spotfx_store = Ext.create('TradeApp.store.ExchangeSpotFxStore');

Ext.define('TradeApp.view.exchange.ExchangeSpotFxGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'exchange-spotfx-grid',
    id: "exchange-spotfx-grid-id", // DO NOT CHANGE , USED IN MULTIPLE PLACES - PLS DO NOT CHANGE
    title: "Spot Forex",
    requires: [
        'Ext.grid.feature.Grouping',
        'TradeApp.view.exchange.BuyerSportfxConfirmDialog',
        'TradeApp.Const'
    ],
    controller: 'exchange',
    viewModel: 'exchange',
    store: exchange_spotfx_store,
    //collapsible: true,
    frame: true,
    border: false,
    width: "100%",
    height: "100%",
    minHeight: 200,
    resizable: false,
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: exchange_spotfx_store,
            dock: 'bottom',
            displayInfo: true
        }],
    tbar: [
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Filter',
            style: 'font-weight: bold;',
            labelWidth: 60,
            layout: 'hbox',
            items: [{
                    xtype: 'combobox',
                    labelAlign: 'right',
                    margin: '0 10 0 0',
                    width: 170,
                    store: TradeApp.Const.cboInstrumentsList(),
                    value: TradeApp.Const.ALL_INSTRUMENTS,
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        select: 'onGeneralSpotFxSymbolSelected'
                    }
                }, {
                    xtype: 'combobox',
                    labelAlign: 'right',
                    margin: '0 10 0 0',
                    width: 120,
                    store: [TradeApp.Const.BUY_SELL, 'BUY', 'SELL'],
                    value: TradeApp.Const.BUY_SELL,
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        select: 'onGeneralSpotFxDirectionSelected'
                    }
                },{
                    xtype: 'combobox',
                    labelAlign: 'right',
                    margin: '0 10 0 0',
                    width: 170,
                    store: [TradeApp.Const.PRICE_TIME, 'Time (Countdown)', 'Price (Pending order)'],
                    value: TradeApp.Const.PRICE_TIME,
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        select: 'onGeneralSpotFxMethodSelected'
                    }
                }, {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Seller ID',
                    //enableKeyEvents: true,// without this key event will not be fired - Take note
                    listeners: {
                        change: "onGeneralSpotFxSellerIdChange",
                        specialkey: "onGeneralSpotFxSellerIdExec"
                    }
                }]

        }, {
            xtype: 'component',
            flex: 1
        }, {
            xtype: 'button',
            id: 'btn_spotfx_recent_update',
            text: "No recent update",
            handler: 'onExchangeSpotFxRecentUpdate'
        }
    ],
    columns: [{
            text: 'Order',
            dataIndex: 'order'
        }, {
            text: '<div style="font-weight: bold; color: gray;">BUY</div>',
            dataIndex: 'buyer_action',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                //come back to explore metaData
                return "<a href='#'>" + value + "</a>";//come back for styling
            }
        }, {
            text: 'EXCHANGE EXPIRY',
            dataIndex: 'exchange_expiry',
            width: 150,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var longTime = new Date(value).getTime();
                if (isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()) {
                    return "";
                }
                //return  Ext.util.Format.date(value, 'd-m-Y H:i:s');//no no no! causes it to use the local time which is wrong approach
                return value;
            }
        }, {
            text: 'Symbol',
            dataIndex: 'symbol'
        }, {
            text: 'Direction',
            dataIndex: 'direction'
        },  {
            text: 'Trigger Price',
            dataIndex: 'pending_order_price',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                return value ? value : "<span style='font-style: italic;'>None</span>";
            }
        },{
            text: 'Stop Loss',
            dataIndex: 'stop_loss'
        }, {
            text: 'Take Profit',
            dataIndex: 'take_profit'
        }, {
            text: 'Time',
            dataIndex: 'time',
            width: 150,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var longTime = new Date(value).getTime();
                if (isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()) {
                    return "";
                }
                //return  Ext.util.Format.date(value, 'd-m-Y H:i:s');//no no no! causes it to use the local time which is wrong approach
                return value;
            }
        }, {
            text: 'Size',
            dataIndex: 'size'
        }, {
            text: 'Seller ID',
            dataIndex: 'seller_id'
        }],
    listeners: {
        cellclick: 'onSpotfxBuyerAction'
    }
});