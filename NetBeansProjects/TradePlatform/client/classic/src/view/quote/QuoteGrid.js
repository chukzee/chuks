/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var quote_store = Ext.create('TradeApp.store.QuoteStore');

Ext.define('TradeApp.view.quote.QuoteGrid', {
    extend: 'Ext.grid.Panel', //NOTE: The class name for the grid in the modern toolkit is Ext.grid.Grid,
    //UNLIKE in the classic toolkit which is Ext.grid.Panel used here.
    //There are some minor differences that exist between the classic and modern toolkit,
    //but most of the concepts are same.
    xtype: 'quote-grid',
    requires: [
        'Ext.grid.feature.Grouping',
        'Ext.dd.DropTarget'
                /*
                 'TradeApp.store.QuoteStore',
                 'TradeApp.view.quote.QuoteController',
                 'TradeApp.view.quote.QuoteViewModel'*/
    ],
    controller: 'quote',
    viewModel: 'quote',
    store: quote_store,
    collapsible: true,
    frame: true,
    width: "100%",
    viewConfig: {
        /*UP COMING FEATURE - UNCOMMENT WHEN FEATURE IS NEEDED
         * plugins: {
         ptype: 'gridviewdragdrop',
         containerScroll: true,
         dragText: 'Drop on the chart',
         enableDrop: false,
         ddGroup: 'grid-to-chart'
         //dragGroup: 'group1',
         //dropGroup: 'group2'
         },
         listeners: {
         drop: function (node, data, dropRec, dropPosition) {
         var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
         Ext.example.msg('Drag from right to left', 'Dropped ' + data.records[0].get('name') + dropOn);
         }
         }*/
    },
    // Need a minHeight. Neptune resizable framed panels are overflow:visible so as to
    // enable resizing handles to be embedded in the border lines.
    //minHeight: 200,
    //title: 'Market Instruments',
    resizable: false,
    features: [{
            id: 'group',
            ftype: 'grouping',
            groupHeaderTpl: "{name}", // use '{name}' - please study more for other form of manipulation e.g '{columnName}: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
    enableDragDrop: true,
    selModel: new Ext.selection.RowModel({
        singleSelect: true
    }),
    columns: [{
            text: 'Type',
            dataIndex: 'market_type'//,
                    //hidden: true//not neccessary anyway since it is hidden by default if the column is used as group name
        }, {
            text: 'Symbol',
            dataIndex: 'symbol',
            sortable: false,
            minWidth: 120,
            resizable: false,
            flex: 1,
            groupable: false,
            renderer: function (a, b, c) {
                var syb = new String(a).replace('/', '');
                syb = syb.replace(' ', '');// todo - replace all space characters

                var s1 = syb.substring(0, 2).toLowerCase();
                var s2 = syb.substring(3, 5).toLowerCase();
                if (s1 === "eu") {
                    s1 = '_European Union';
                }
                var flag_style = "style='margin-right:2px;margin-left:2px;'";
                var flag1 = '';
                var flag2 = '';
                var record = quote_store.getAt(b.recordIndex);
                var group = record.get('market_type');
                var space = ' ';
                var group = group.toLowerCase();
                if (group === "spot"
                        || group === space + "spot"
                        || group === "spot forex"
                        || group === space + "spot forex"
                        || group === "forex"
                        || group === space + "forex") {
                    if (s1 !== "xa") {//skip Gold and Silver
                        flag1 = "<img src='resources/img/icons/flags_iso/16/" + s1 + ".png' " + flag_style + "/>";
                    }
                    if (s2 !== "xa") {//skip Gold and Silver
                        flag2 = "<img src='resources/img/icons/flags_iso/16/" + s2 + ".png' " + flag_style + "/>";
                    }
                    var direction_style = " style = 'position: absolute; top: 6px; right: 10px;' ";//todo - change to green / up as price go up / down
                } else {
                    var direction_style = "";//todo - change to green / up as price go up / down
                }
                var valueDiv = "<div " + direction_style + " >" + a + "</div>";

                //console.log(group);

                return flag1 + flag2 + valueDiv;
            }
        }, {
            text: 'Bid',
            dataIndex: 'price',
            sortable: false,
            //flex: 1,
            groupable: false
        }]


});




/*
 Ext.define('KitchenSink.view.dd.GridToForm', {
 extend: 'Ext.container.Container',
 requires: [
 'Ext.grid.*',
 'Ext.form.*',
 'Ext.layout.container.HBox',
 'Ext.dd.DropTarget',
 'KitchenSink.model.dd.Simple'
 ],
 xtype: 'dd-grid-to-form',
 width: 650,
 height: 300,
 layout: {
 type: 'hbox',
 align: 'stretch'
 },
 bodyPadding: 5,
 myData: [
 {name: 'Record 0', column1: '0', column2: '0'},
 {name: 'Record 1', column1: '1', column2: '1'},
 {name: 'Record 2', column1: '2', column2: '2'},
 {name: 'Record 3', column1: '3', column2: '3'},
 {name: 'Record 4', column1: '4', column2: '4'},
 {name: 'Record 5', column1: '5', column2: '5'},
 {name: 'Record 6', column1: '6', column2: '6'},
 {name: 'Record 7', column1: '7', column2: '7'},
 {name: 'Record 8', column1: '8', column2: '8'},
 {name: 'Record 9', column1: '9', column2: '9'}
 ],
 initComponent: function () {
 this.items = [{
 xtype: 'grid',
 viewConfig: {
 plugins: {
 ddGroup: 'grid-to-form',
 ptype: 'gridviewdragdrop',
 enableDrop: false
 }
 },
 store: new Ext.data.Store({
 model: KitchenSink.model.dd.Simple,
 data: this.myData
 }),
 columns: [{
 flex: 1,
 header: 'Record Name',
 sortable: true,
 dataIndex: 'name'
 }, {
 header: 'column1',
 width: 80,
 sortable: true,
 dataIndex: 'column1'
 }, {
 header: 'column2',
 width: 80,
 sortable: true,
 dataIndex: 'column2'
 }],
 enableDragDrop: true,
 width: 325,
 margin: '0 5 0 0',
 title: 'Data Grid',
 tools: [{
 type: 'refresh',
 tooltip: 'Reset example',
 scope: this,
 handler: this.onResetClick
 }],
 selModel: new Ext.selection.RowModel({
 singleSelect: true
 })
 }, {
 xtype: 'form',
 flex: 1,
 title: 'Generic Form Panel',
 bodyPadding: 10,
 labelWidth: 100,
 defaultType: 'textfield',
 items: [{
 fieldLabel: 'Record Name',
 name: 'name'
 }, {
 fieldLabel: 'Column 1',
 name: 'column1'
 }, {
 fieldLabel: 'Column 2',
 name: 'column2'
 }]
 }];
 
 this.callParent();
 },
 onResetClick: function () {
 this.down('grid').getStore().loadData(this.myData);
 this.down('form').getForm().reset();
 },
 onBoxReady: function () {
 this.callParent(arguments);
 var form = this.down('form'),
 body = form.body;
 
 this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
 ddGroup: 'grid-to-form',
 notifyEnter: function (ddSource, e, data) {
 //Add some flare to invite drop.
 body.stopAnimation();
 body.highlight();
 },
 notifyDrop: function (ddSource, e, data) {
 // Reference the record (single selection) for readability
 var selectedRecord = ddSource.dragData.records[0];
 
 // Load the record into the form
 form.getForm().loadRecord(selectedRecord);
 
 // Delete record from the source store.  not really required.
 ddSource.view.store.remove(selectedRecord);
 return true;
 }
 });
 },
 beforeDestroy: function () {
 var target = this.formPanelDropTarget;
 if (target) {
 target.unreg();
 this.formPanelDropTarget = null;
 }
 this.callParent();
 }
 });
 */