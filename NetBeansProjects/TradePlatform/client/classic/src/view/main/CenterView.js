/* WONDERFUL !!! HTML EDITOR IS THE BOMB - EXCELLENT WIDGET
 var el = Ext.create('Ext.form.HtmlEditor', {
 width: 800,
 height: 200,
 //renderTo: Ext.getBody()
 });
 */

Ext.define('TradeApp.view.main.CenterView', {
    extend: 'Ext.panel.Panel',
    xtype: 'center-layout',
    requires: [
        'Ext.layout.container.Border',
        'TradeApp.view.main.TradePositionSpotFxGrid',
        'TradeApp.view.main.TradePositionOptionsGrid',
        'TradeApp.view.main.TradeHistorySpotFxGrid',
        'TradeApp.view.main.TradeHistoryOptionsGrid',
        'TradeApp.view.main.PendingOrderSpotFxGrid',
        'TradeApp.view.main.PendingOrderOptionsGrid',
        'TradeApp.view.main.MainController',
        'TradeApp.view.main.MainModel',
        'TradeApp.Const'
    ],
    layout: 'border',
    width: "100%",
    height: "100%",
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true
                //bodyPadding: 10// no no no DO NOT PAD
    }, tbar: [{
            xtype: 'combobox',
            editable: false,
            //reference: 'states',
            publishes: 'value',
            labelWidth: 70,
            width: 120,
            reference: 'chart_symbol',
            margin: '0 10 0 0',
            store: TradeApp.Const.SYMBOLS,
            value: 'EUR/USD',
            listeners: {
                select: 'onChartTimeframe'
            }
        }, '-', {
            xtype: 'combobox',
            reference: 'timeframe',
            editable: false,
            //reference: 'states',
            publishes: 'value',
            labelWidth: 70,
            width: 180,
            fieldLabel: 'Timeframe',
            store: ['1 min', '5 min', '15 min', '30 min', '1 hour', '4 hours', '1 day', '1 week', '1 month', '1 year'],
            value: '1 min',
            listeners: {
                select: 'onChartTimeframe'
            }
        }, '-', {
            xtype: 'splitbutton',
            //text: 'Tools',
            iconCls: "fa fa-gear", //TODO
            //glyph: null,
            tooltip: 'Tools',
            menu: [
                    /*UP COMING FEATURE - UNCOMENT WHEN FEATURE IS NEEDED
                     {
                    text: 'Change theme',
                    menu: [{
                            text: 'Green Guzy'
                        },{
                            text: 'Gray Guzy'
                        }, {
                            text: 'Dark Guzy'
                        }, {
                            text: 'Blue Guzy'
                        }, {
                            text: 'Blue San'
                        }]
                }, {
                    xtype: 'menuseparator'
                },*/ {
                    text: 'Change chart',
                    menu: [{
                            text: 'Line',
                            //xtype:'menucheckitem',
                            publishes: 'checked',
                            reference: 'menu_line_chart',
                            //checked: false,//DYNAMIC CHECK AND UNCHECK NOT WORKING !!!
                            handler: 'onLineChart'
                        }, {
                            text: 'Area',
                            //xtype:'menucheckitem',
                            publishes: 'checked',
                            reference: 'menu_area_chart',
                            //checked: false,//DYNAMIC CHECK AND UNCHECK NOT WORKING !!!
                            handler: 'onAreaChart'
                        }, {
                            text: 'OHLC',
                            //xtype:'menucheckitem',
                            publishes: 'checked',
                            reference: 'menu_ohlc_chart',
                            //checked: false,//DYNAMIC CHECK AND UNCHECK NOT WORKING !!!
                            handler: 'onOhlcChart'
                        }, {
                            text: 'Candle Stick',
                            //xtype:'menucheckitem',
                            publishes: 'checked',
                            reference: 'menu_candle_stick_chart',
                            //checked: true,//DYNAMIC CHECK AND UNCHECK NOT WORKING !!!
                            handler: 'onCandleStickChart'
                        }
                        /*UP COMING FEATURE - UNCOMENT WHEN FEATURE IS NEEDED
                        , {
                            xtype: 'menuseparator'
                        }, {
                            text: 'Change apperance'
                        }*/]
                }, {
                    text: 'Pan chart',
                    //iconCls: 'fa fa-pan',//TODO
                    handler: 'onChartPan'
                }, {
                    text: 'Zoom chart',
                    //iconCls: 'fa fa-zoom',//TODO
                    handler: 'onChartZoom'
                }, {
                    text: 'Reset chart',
                    //iconCls: 'fa fa-reset',//TODO
                    handler: 'onChartReset'
                }
                /*UP COMING FEATURE - UNCOMENT WHEN FEATURE IS NEEDED
                 , {
                    xtype: 'menuseparator'
                }, {
                    text: 'Options'
                }*/]
        }, '-',
        /*{
         xtype: 'label',
         text: 'Header Position:'
         },*/
        {
            xtype: 'segmentedbutton',
            reference: 'positionBtn',
            //value: 'top',
            defaultUI: 'default',
            items: [{
                    text: 'Pan',
                    pressed: false,
                    //iconCls: 'fa fa-hand-stop-o',//TODO
                    handler: 'onChartPan'
                }, {
                    text: 'Zoom',
                    pressed: false,
                    //iconCls: 'fa fa-zoom',//TODO
                    handler: 'onChartZoom'
                }, {
                    text: 'Reset',
                    pressed: true,
                    //iconCls: 'fa fa-reset',//TODO
                    handler: 'onChartReset'
                }]
        },'-', {
            xtype: 'button',
            text: 'Withdraw',
            id: 'platf-withdraw-button',
            handler: 'onWithdrawClick'
        }, {
            xtype: 'component', //USED HERE AS A SPACER TO COMPONENT TO FORCE SUCCEDING COMPONENTS TO ALIGN RIGHT
            flex: 1//force the next components afterwards to align right by filling all available space - GOOD TECHNIQUE
        }, {
            xtype: 'button',
            text: TradeApp.Const.LOGIN_TXT,
            id: 'platf-login-button',
            handler: 'onLoginClick'
        }
    ],
    items: [
        {//PLEASE NOTE: DO NOT ADD OR REMOVE PROPERTIES OF THIS ITEM.
            //IF PROPERTY MUST BE ADDED OF REMOVED THEN IT MUST ALSO BE DONE TO OTHER
            //AREAS WHERE THE ITEM IS DYNAMICALLY CREATED. e.g SEE MainColloer.js
            collapsible: false,
            region: 'center',
            margin: '5 0 0 0',
            xtype: 'chart-view',
            reference: 'chart-view-ref'

        },
        {
            xtype: 'tabpanel',
            region: 'south',
            title: 'Account balance:',
            flex: 1,
            //icon: null,
            //glyph: 77,
            tabBarHeaderPosition: 1,
            reference: 'trade_tab_panel',
            plain: false,
            bind: {//MAY BIND THE FOLLOW IN THE FUTURE FOR USER PREFERENCE PURPOSE
                height: window.screen.height < 800 ? "60%" : "50%",
                headerPosition: 'top',
                tabRotation: 0,
                titleRotation: 0,
                titleAlign: 'left',
                iconAlign: 'left'
            },
            defaults: {
                bodyPadding: 10,
                scrollable: true,
                border: false
            },
            /*UP COMING FEATURE - UNCOMENT WHEN FEATURE IS NEEDED
             * tools: [
                {type: 'search'},
                {type: 'save'}
            ],*/
            items: [
                {
                    title: 'Open',
                    //icon: null,
                    //glyph: 70,
                    xtype: "panel",
                    layout: 'fit',
                    width: '100%',
                    height: '100%',
                    bodyPadding: 0,
                    items: [
                        {
                            xtype: 'tabpanel',
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            headerPosition: 'right',
                            header: {
                                title: {
                                    flex: 0
                                }
                                //iconCls: '' // TODO - look FOR history icon
                            },
                            items: [{
                                    title: 'Spot',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "tradepos-spotfx-grid",
                                    reference: "trade_spotfx_positions"
                                }, {
                                    title: 'Options',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "tradepos-options-grid",
                                    reference: "trade_options_positions"
                                }]
                        }
                    ]
                },{
                    title: 'Pending',
                    //icon: null,
                    //glyph: 70,
                    xtype: "panel",
                    layout: 'fit',
                    width: '100%',
                    height: '100%',
                    bodyPadding: 0,
                    items: [
                        {
                            xtype: 'tabpanel',
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            headerPosition: 'right',
                            header: {
                                title: {
                                    flex: 0
                                }
                                //iconCls: '' // TODO - look FOR history icon
                            },
                            items: [{
                                    title: 'Spot',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "pending-order-spotfx-grid",
                                    reference: "pending_spotfx_positions"
                                }, {
                                    title: 'Options',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "pending-order-options-grid",
                                    reference: "pending_options_positions"
                                }]
                        }
                    ]
                },
                {
                    title: 'History',
                    //icon: null,
                    //glyph: 70,
                    xtype: "panel",
                    layout: 'fit',
                    width: '100%',
                    height: '100%',
                    bodyPadding: 0,
                    items: [
                        {
                            xtype: 'tabpanel',
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            headerPosition: 'right',
                            header: {
                                title: {
                                    flex: 0
                                }
                                //iconCls: '' // TODO - look FOR history icon
                            },
                            items: [{
                                    title: 'Spot',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "trade-history-spotfx-grid",
                                    reference: "trade_history_spotfx"
                                }, {
                                    title: 'Options',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "trade-history-options-grid",
                                    reference: "trade_history_options"
                                }, {
                                    title: 'D/W',
                                    //icon: null,
                                    //glyph: 70,
                                    xtype: "deposits-and-withdrawals-grid",
                                    reference: "deposits_and_withdrawals"
                                }]
                        }
                    ]
                }
            ]
        }

    ]

});