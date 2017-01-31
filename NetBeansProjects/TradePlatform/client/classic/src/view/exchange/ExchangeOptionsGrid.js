/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var exchange_options_store = Ext.create('TradeApp.store.ExchangeOptionsStore');

Ext.define('TradeApp.view.exchange.ExchangeOptionsGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'exchange-options-grid',
    title: "Options",
    id: "exchange-options-grid-id", // DO NOT CHANGE , USED IN MULTIPLE PLACES - PLS DO NOT CHANGE
    requires: [
        'Ext.grid.feature.Grouping',
        'TradeApp.view.exchange.BuyerOptionsConfirmDialog',
        'TradeApp.Const'
    ],
    controller: 'exchange',
    viewModel: 'exchange',
    store: exchange_options_store,
    //collapsible: true,
    frame: true,
    border: false,
    width: "100%",
    height: "100%",
    minHeight: 200,
    resizable: false,
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: exchange_options_store,
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
                    store: [TradeApp.Const.ALL_TYPES, 'DIGITAL CALL (ITM)', 'DIGITAL CALL (ATM)', 'DIGITAL CALL (OTM)', 'DIGITAL PUT (ITM)', 'DIGITAL PUT (ATM)', 'DIGITAL PUT (OTM)', 'ONE TOUCH', 'NO TOUCH', 'DOUBLE ONE TOUCH', 'DOUBLE NO TOUCH', 'RANGE IN', 'RANGE OUT'],
                    value: TradeApp.Const.ALL_TYPES,
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        select: 'onGeneralOptionsProductSelected'
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
                        select: 'onGeneralOptionsMethodSelected'
                    }
                }, {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Seller ID',
                    //enableKeyEvents: true,// without this key event will not be fired - Take note
                    listeners: {
                        change: "onGeneralOptionsSellerIdChange",
                        specialkey: "onGeneralOptionsSellerIdExec"
                    }
                }]

        }, {
            xtype: 'component',
            flex: 1
        }, {
            xtype: 'button',
            id: 'btn_options_recent_update',
            text: "No recent update",
            handler: 'onExchangeOptionsRecentUpdate'
        }
    ],
    columns: [{
            text: 'Order',
            dataIndex: 'order'
        }, {
            text: '<div style="font-weight: bold; color: gray;">BUY</div>',
            dataIndex: 'buyer_action',
            width: 150,
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
            text: 'Product',
            dataIndex: 'product',
            width: 150
        }, {
            text: 'Symbol',
            dataIndex: 'symbol'
        }, {
            text: 'Trigger Price',
            dataIndex: 'pending_order_price',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                return value ? value : "<span style='font-style: italic;'>None</span>";
            }
        }, {
            text: 'Strike',
            dataIndex: 'strike',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var strike = record.get("strike");
                var strike_up = record.get("strike_up") - 0;
                var strike_down = record.get("strike_down") - 0;
                if (strike_up !== 0 || strike_down !== 0) {
                    strike_up = Math.abs(strike_up); //yes, just to remove + sign if any
                    var str_strike_up = "+" + strike_up;
                    return '<div>' + str_strike_up + '</div><div>' + strike_down + '</div>';
                } else {
                    return strike;
                }

            }
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
            text: 'Expiry',
            dataIndex: 'expiry'
        }, {
            text: 'Size',
            dataIndex: 'size'

        }, {
            text: 'Price (%)',
            dataIndex: 'price'
        }, {
            text: 'Premium (%)',
            dataIndex: 'premium'
        }, {
            text: 'Seller ID',
            dataIndex: 'seller_id'
        }],
    listeners: {
        cellclick: 'onOptionsBuyerAction'
    }
});