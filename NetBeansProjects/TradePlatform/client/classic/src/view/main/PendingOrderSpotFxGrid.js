/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var pending_order_spotfx_store = Ext.create('TradeApp.store.PendingOrderSpotFxStore');

Ext.define('TradeApp.view.main.PendingOrderSpotFxGrid', {
    extend: 'TradeApp.view.main.TradePositionSpotFxGrid',
    xtype: 'pending-order-spotfx-grid',
    id: "pending-order-spotfx-grid-id",
    store: pending_order_spotfx_store,
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
            store: pending_order_spotfx_store,
            dock: 'bottom',
            displayInfo: true
        }],
    columns: [{
            text: 'Time Created',
            dataIndex: 'time',
            sortable: false,
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
            dataIndex: 'pending_order_expiry',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var longTime = new Date(value).getTime();
                if (isNaN(longTime) || longTime <= new Date("1970-01-01").getTime()) {
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
            text: 'Trigger Price',
            dataIndex: 'pending_order_price',
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
        }]
});
