/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var trade_history_spotfx_store = Ext.create('TradeApp.store.TradeHistorySpotFxStore');

Ext.define('TradeApp.view.main.TradeHistorySpotFxGrid', {
    extend: 'TradeApp.view.main.TradePositionSpotFxGrid',
    xtype: 'trade-history-spotfx-grid',
    id: "trade-history-spotfx-grid-id",
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
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var type = record.get("type");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && !type) {
                    return record.get("seller_type");
                } else if (exchange_id === buyer_id && !type) {
                    return record.get("buyer_type");
                } else {
                    return type;
                }

            }
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
        }, {
            text: 'Result',
            dataIndex: 'result',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var result = record.get("result");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && !result) {
                    return record.get("seller_result");
                } else if (exchange_id === buyer_id && !result) {
                    return record.get("buyer_result");
                } else {
                    return result;
                }

            }
        }, {
            text: 'Commission',
            dataIndex: 'commission',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var commission = record.get("commission");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && !commission) {
                    return record.get("seller_commission");
                } else if (exchange_id === buyer_id && !commission) {
                    return record.get("buyer_commission");
                } else {
                    return commission;
                }

            }
        }, {
            text: 'Profit / Loss',
            dataIndex: 'profit_and_loss',
            sortable: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var seller_id = record.get("seller_id");
                var buyer_id = record.get("buyer_id");
                var profit_and_loss = record.get("profit_and_loss");
                var exchange_id = TradeApp.Util.getUserExchangeId();
                if (exchange_id === seller_id && !profit_and_loss) {
                    return record.get("seller_profit_and_loss");
                } else if (exchange_id === buyer_id && !profit_and_loss) {
                    return record.get("buyer_profit_and_loss");
                } else {
                    return profit_and_loss;
                }

            }
        }]
});
