/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeApp.view.main.LHSView', {
    extend: 'Ext.panel.Panel',
    xtype: 'lhs-layout',
    requires: [
        'Ext.layout.container.Border',
        'TradeApp.view.quote.QuoteGrid',
        'TradeApp.view.products.ProductsOption'
    ],
    layout: 'border',
    width: "100%",
    height: "100%",
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true,
        //bodyPadding: 10// no no no DO NOT PAD
        frame: true// use the frame theme concept
    },
    tools: [
        //{ type:'pin' },
        {
            type: 'refresh',
            handler: 'refreshMarketWatch'
        }
        /*UP COMING FEATURE - UNCOMENT WHEN FEATURE IS NEEDED
        ,{type: 'search'}//,
        */
        //{ type:'save' }
    ],
    items: [
        {
            xtype: "quote-grid",
            reference: "quote_grid_ref",
            collapsible: false,
            region: 'center',
            margin: '0 0 0 0',
            height: "50%"

        },
        {
            xtype: "products-option",
            title: 'Products',
            region: 'south',
            floatable: false,
            margin: '0 0 0 0',
            height: "50%"
        }
    ]

});