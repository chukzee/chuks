/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeApp.view.main.ExchangeRoom', {
    extend: 'Ext.panel.Panel',
    xtype: 'exchange-room',
    /*requires: [
     ],*/
    layout: 'center',
    width: "100%",
    height: "100%",
    items: [
        {
            xtype: 'tabpanel',
            ui: 'navigation',
            tabBarHeaderPosition: 1,
            titleRotation: 0,
            tabRotation: 0,
            width: "100%",
            height: "100%",
            headerPosition: 'left',
            header: {
                //style: 'background-color: gray',
                layout: {
                    align: 'stretchmax'
                },
                title: {
                    flex: 0
                },
                iconCls: 'fa-th-list'
            },
            tabBar: {
                flex: 1,
                layout: {
                    align: 'stretch',
                    overflowHandler: 'none'
                }
            },
            defaults: {
                //bodyPadding: 20,
            },
            items: [{
                    xtype: 'panel',
                    layout: 'center',
                    title: 'General',
                    iconCls: 'fa-home',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: '<span>Choose from the available exchange </span><span class="flatbook-server-time" id="exchange-room-general-time-display" style="margin-left: 150px; font-size: 12px;"></span>'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            items: [{
                                    xtype: 'exchange-spotfx-grid'
                                }, {
                                    xtype: 'exchange-options-grid'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    //alert(newC.id);
                                    //alert(oldC.id);
                                    Ext.GlobalEvents.fireEvent('check_exchange_update');
                                }
                            }
                        }]

                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Personal',
                    iconCls: 'fa-user',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: '<span>Your exchange history </span><span class="flatbook-server-time" id="exchange-room-personal-time-display" style="margin-left: 150px; font-size: 12px;"></span>'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            items: [{
                                    xtype: 'personal-exchange-spotfx-grid'
                                }, {
                                    xtype: 'personal-exchange-options-grid'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    //alert(newC.id);
                                    //alert(oldC.id);

                                }
                            }
                        }]
                }]




        }
    ]
});