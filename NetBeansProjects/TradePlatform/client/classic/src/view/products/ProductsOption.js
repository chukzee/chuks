/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.ProductsOption', {
    extend: 'Ext.panel.Panel',
    xtype: "products-option",
    requires: [
        'Ext.layout.container.VBox',
        'TradeApp.view.products.OptionProductForm',
        'TradeApp.view.products.OptionProductFormB',
        'TradeApp.view.products.SpotForexDialog'
    ],
    controller: 'products',
    viewModel: 'products',
    
    width: "100%",
    defaultType: 'button',
    //autoScroll:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    autoScroll: true,
    items: [
        {
            text: "Spot Forex",
            handler: 'onSpotForexClick'
        },{
            text: "Digital Call",
            handler: 'onDigitalCallClick'
        },
        {
            text: "Digital Put",
            handler: 'onDigitalPutClick'
        },
        {
            text: "One Touch",
            handler: 'onOneTouchClick'
        },
        {
            text: "No Touch",
            handler: 'onNoTouchClick'
        },
        {
            text: "Double One Touch",
            handler: 'onDoubleOneTouchClick'
        },
        {
            text: "Double No Touch",
            handler: 'onDoubleNoTouchClick'
        },
        {
            text: "Range In",
            handler: 'onRangeInClick'
        },
        {
            text: "Range Out",
            handler: 'onRangeOutClick'
        }
    ]
});