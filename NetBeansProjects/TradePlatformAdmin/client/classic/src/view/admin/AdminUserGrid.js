var store = Ext.create('TradeAdmin.store.AdminUserStore');

Ext.define('TradeAdmin.view.admin.AdminUserGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'admin-user-grid',
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
                    emptyText: 'Username'
                }, {
                    xtype: 'textfield',
                    margin: '0 10 0 0',
                    width: 170,
                    emptyText: 'Full Name'
                }]

        }
    ],
    columns: [{
            text: 'Username',
            dataIndex: 'username',
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
            text: 'Privileges',
            dataIndex: 'privileges',
            flex: 1
        },  {
            text: 'Created By',
            dataIndex: 'created_by',
            flex: 1
        }, {
            text: 'Date Created',
            dataIndex: 'date_created',
            flex: 1
        }]
});