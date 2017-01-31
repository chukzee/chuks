
var store = Ext.create('TradeAdmin.store.RebatePerDayStore');

Ext.define('TradeAdmin.view.rebate.RebatePerDayGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'rebate-per-day-grid',
    requires: [
        'Ext.grid.feature.Grouping'
    ],
    controller: 'main',
    viewModel: 'main',
    store: store,
    //collapsible: true,
    frame: true,
    border: false,
    width: "100%",
    height: "100%",
    minHeight: 200,
    resizable: false,
    header: {
        style: 'background-color: white;',
        title: {
            style: 'color: gray;',
            text: 'Rebate'
        }
    },
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: store,
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
                    emptyText: 'Year',
                    labelAlign: 'right',
                    margin: '0 10 0 0',
                    width: 100,
                    store: function () {
                        var ar = ['(All)'];
                        for(var i = 2015; i < 2051; i++){
                            ar.push(i);
                            
                        }
                        return ar;
                    }()/*[2016, 2017, 2018, 2019, 2016, 2020, 2016, 2016, 2016, 2016, 2016, ]*/,
                    queryMode: 'local',
                    editable: true,
                    listeners: {
                        select: function () {

                        }
                    }
                }, {
                    xtype: 'combobox',
                    emptyText: 'Month',
                    labelAlign: 'right',
                    margin: '0 10 0 0',
                    width: 100,
                    store: ['(All)','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        select: function () {

                        }
                    }
                }]

        }, {
            xtype: 'component',
            flex: 1
        },
        {
            xtype: 'fieldcontainer',
            labelWidth: 60,
            layout: 'hbox',
            items: [{
                    xtype: 'displayfield',
                    name: 'total_open_trades',
                    margin: '0 10 0 0',
                    fieldLabel: 'Open Positions',
                    tip: 'Total Open Positions',
                    labelAlign: 'right',
                    labelStyle: 'font-weight: 600;',
                    listeners: {
                        render: function (c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: c.getEl(),
                                html: c.tip
                            });
                        }
                    }
                }, {
                    xtype: 'displayfield',
                    name: 'day_commission',
                    margin: '0 10 0 0',
                    fieldLabel: 'Total Com.',
                    tip: "Today's Commissions",
                    labelAlign: 'right',
                    labelStyle: 'font-weight: 600;',
                    listeners: {
                        render: function (c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: c.getEl(),
                                html: c.tip
                            });
                        }
                    }
                }, {
                    xtype: 'displayfield',
                    name: 'day_account_balance',
                    margin: '0 10 0 0',
                    fieldLabel: 'Total Bal.',
                    tip: 'Current Account Balance',
                    labelAlign: 'right',
                    labelStyle: 'font-weight: 600;',
                    listeners: {
                        render: function (c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: c.getEl(),
                                html: c.tip
                            });
                        }
                    }
                }, {
                    xtype: 'button',
                    margin: '0 10 0 0',
                    text: 'Update',
                    tip: 'Click to get the latest.',
                    //width: 90,
                    listeners: {
                        click: function () {
                            var cmp = this.up('fieldcontainer');
                            TradeAdmin.Util.getCurrentRebate(cmp);
                        },
                        render: function (c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: c.getEl(),
                                html: c.tip
                            });
                        }
                    }
                }]

        }
    ],
    columns: [{
            text: 'Date',
            dataIndex: 'date',
            flex: 1
        }, {
            text: 'Commission ($)',
            dataIndex: 'day_commission',
            flex: 1
        }, {
            text: 'Account Bal ($)',
            dataIndex: 'day_account_balance',
            flex: 1
        }]
});