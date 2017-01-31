var store = Ext.create('TradeAdmin.store.WithdrawalStore');

Ext.define('TradeAdmin.view.withdrawal.WithdrawalGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'withdrawal-grid',
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
    //IMPORTANT READ : note if in future we return back to CheckboxModel
    //then the cellIndex sought for in ExchangeController 
    //will be equal to grid column not grid column + 1 we used in the case of 
    //spreadsheet selection model our current choice - so modify the code in
    //ExchangeController other singel row delete will not work - abeg o!!!
    //see onDeletePersonalExchangeSpotRowClick method in ExchangeController

    //selModel: Ext.create('Ext.selection.CheckboxModel', {}),
    selModel: {//OUR PREFERRED CHOICE
        type: 'spreadsheet',
        // Disables sorting by header click, though it will be still available via menu
        //columnSelect: true,
        checkboxSelect: true
                //pruneRemoved: false,
                // extensible: 'y'
    },
    dockedItems: [{
            xtype: 'pagingtoolbar',
            store: store,
            dock: 'bottom',
            displayInfo: true
        }],
    tbar: [{
            xtype: 'fieldcontainer',
            //fieldLabel: '',
            //style: 'font-weight: bold;',
            //labelWidth: 60,
            layout: 'hbox',
            items: [
                {
                    xtype: 'button',
                    type: 'submit',
                    margin: '0 10 0 0',
                    text: 'Set Payment Methd',
                    width: 170,
                    listeners: {
                        click: function () {
                            var grid = this.up('withdrawal-grid');
                            var selected_records = grid.getSelectionModel().getSelection();


                            if (selected_records.length === 0) {
                                Ext.Msg.alert("No Selection", "No selection found!");
                                return;
                            }
                            var serial_nos = [];
                            var already = 0;
                            for (var r in selected_records) {
                                if (selected_records[r].get("payment_method")) {
                                    already++;
                                }
                                serial_nos.push(selected_records[r].get("sn"));
                            }
                            var strSNs = JSON.stringify(serial_nos);

                            var showDialog = function (choice) {
                                if (choice === 'yes') {
                                    var form = Ext.create('TradeAdmin.view.withdrawal.PaymentMethodDialog', TradeAdmin.Util.onHideThenDestroy);
                                    form.setFormParam(strSNs, grid);
                                    form.show();
                                }
                            };
                            if (already > 0) {
                                Ext.Msg.confirm('Confirm', (already > 1 ? already + ' records' :  already + ' record') + ' selected already has existing payment method.' +
                                        '<br/>Do you want to replace?', showDialog);
                            } else {
                                showDialog('yes');
                            }

                        }
                    }
                }]
        },
        {
            xtype: 'component',
            flex: 1
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Filter',
            style: 'font-weight: bold;',
            labelWidth: 60,
            layout: 'hbox',
            items: [{
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Username'
                }, {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Exchange ID'
                }, {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Full Name'
                }]

        }
    ],
    columns: [{
            text: 'Payment Method',
            dataIndex: 'payment_method',
            flex: 2
        }, {
            text: 'Date',
            dataIndex: 'date',
            flex: 1
        }, {
            text: 'Username',
            dataIndex: 'username',
            flex: 1
        }, {
            text: 'Exchange ID',
            dataIndex: 'exchange_id',
            flex: 1
        }, {
            text: 'First Name',
            dataIndex: 'first_name',
            flex: 1
        }, {
            text: 'Last Name',
            dataIndex: 'last_name',
            flex: 1
        }, {
            text: 'Email',
            dataIndex: 'email',
            flex: 1
        }, {
            text: 'Amount',
            dataIndex: 'amount',
            flex: 1
        }]
});