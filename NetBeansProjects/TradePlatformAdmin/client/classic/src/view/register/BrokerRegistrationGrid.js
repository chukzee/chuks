
var store = Ext.create('TradeAdmin.store.BrokerStore');

Ext.define('TradeAdmin.view.register.BrokerRegistrationGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'broker-registration-grid',
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
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Company',
                    listeners: {
                        change: function (s, r) {
                            var grid = this.up("broker-registration-grid");
                            var p = grid.getStore().getProxy();
                            var params = p.getExtraParams();
                            params.company = s.getValue();
                        }
                    }
                }, {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Website',
                    listeners: {
                        change: function (s, r) {
                            var grid = this.up("broker-registration-grid");
                            var p = grid.getStore().getProxy();
                            var params = p.getExtraParams();
                            params.website = s.getValue();
                        }
                    }
                }]

        }
    ],
    columns: [{
            text: 'Username',
            dataIndex: 'username',
            flex: 1
        }, {
            text: 'Company',
            dataIndex: 'company',
            flex: 1
        }, {
            text: 'Website',
            dataIndex: 'website',
            flex: 1
        }, {
            text: 'Email',
            dataIndex: 'email',
            flex: 1
        }, {
            text: "Admim Hostname",
            dataIndex: 'broker_admin_host_name',
            flex: 1
        }, {
            text: 'Plaftorm Hostname',
            dataIndex: 'trade_platform_host_name',
            flex: 1
        }, {
            text: 'Registered By',
            dataIndex: 'registered_by',
            flex: 1
        }, {
            text: 'Date Registered',
            dataIndex: 'date_registered',
            flex: 1
        }]
});