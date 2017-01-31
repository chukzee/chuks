/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeApp.view.main.PlatformView', {
    extend: 'Ext.panel.Panel',
    xtype: 'plaftorm-layout',
    requires: [
        'Ext.layout.container.Border',
        'TradeApp.view.main.LHSView',
        'TradeApp.view.main.CenterView'
    ],
    layout: 'border',
    width: "100%",
    height: "100%",
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 0
    },
    items: [
        {
            collapsible: false,
            region: 'center',
            margin: '0 0 0 0',
            xtype: 'center-layout',
            reference: 'center-layout-ref'
        },
        {
            title: '<div  class="flatbook-server-time" id="platform-time-display"  style="font-size: 12px;" >&nbsp;</div>'
                    + '<div>Market watch</div>', //important! let the title be here so that it also displays when the layout is collapsed
            header: {
                style: 'padding-top: 1px; padding-bottom: 1px; '
                        /*title: {//DO NOT USE TITLE HERE IN THIS CASE -  SEE ABOVE REASON.
                         text: '<div id="platform-time-display"  style="font-size: 12px;" >Time</div>'
                         + '<div>Market watch</div>'
                         }*/
            },
            region: 'west',
            floatable: false,
            margin: '5 0 0 0',
            width: "25%",
            minWidth: 200,
            maxWidth: 250,
            xtype: 'lhs-layout'
        }
    ]

});