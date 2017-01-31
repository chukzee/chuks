/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var personal_exchange_options_store = Ext.create('TradeApp.store.PersonalExchangeOptionsStore');

Ext.define('TradeApp.view.exchange.PersonalExchangeOptionsGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'personal-exchange-options-grid',
    id: "personal-exchange-options-grid-id", // DO NOT CHANGE , USED IN MULTIPLE PLACES - PLS DO NOT CHANGE
    title: "Options",
    requires: [
        'Ext.grid.feature.Grouping',
        'TradeApp.Const'
    ],
    controller: 'exchange',
    viewModel: 'exchange',
    store: personal_exchange_options_store,
    //collapsible: true,
    frame: true,
    border: false,
    width: "100%",
    height: "100%",
    minHeight: 200,
    resizable: false,
    //IMPORTANT READ : note if in future we return back to CheckboxModel
    //then the cellIndex sought for in ExchangeController 
    //will be equal to grid column not grid column + 1 we used in the case of 
    //spreadsheet selection model our current choice - so modify the code in
    //ExchangeController other singel row delete will not work - abeg o!!!
    //see onDeletePersonalExchangeOptionsRowClick method in ExchangeController
    
    //selModel: Ext.create('Ext.selection.CheckboxModel', {}),
    selModel: {//OUR PREFERRED CHOICE
        type: 'spreadsheet',
        // Disables sorting by header click, though it will be still available via menu
        //columnSelect: true,
        checkboxSelect: true
                //pruneRemoved: false,
                // extensible: 'y'
    },
    // Enable CTRL+C/X/V hot-keys to copy/cut/paste to the system clipboard.
    /*plugins: [
     'clipboard',
     'selectionreplicator'
     ],*/
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: personal_exchange_options_store,
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
                        select: 'onPersonalOptionsProductSelected'
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
                        select: 'onPersonalOptionsMethodSelected'
                    }
                }]

        }, {
            xtype: 'component',
            flex: 1
        }, {
            xtype: 'button',
            iconCls: 'fa fa-remove',
            text: 'Delete',
            handler: 'onPersonalExchangeOptionsDelete'
        }
    ],
    columns: [{
            text: 'Order',
            dataIndex: 'order'
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
        }, {
            text: 'Buyer ID',
            dataIndex: 'buyer_id'
        }, {
            xtype: 'actioncolumn',
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                    //iconCls: 'cell-editing-delete-row',//not working
                    icon: 'resources/img/icons/delete.png', //my alternative approach 
                    tooltip: 'Delete' 
                }]
        }],
    listeners: {
        cellclick: 'onDeletePersonalExchangeOptionsRowClick'
    }
});