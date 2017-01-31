
Ext.define('TradeAdmin.view.account.LiveTraderAccountPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'live-account-panel',
    //layout: 'vbox',
    //width: "100%",
    //height: "100%",
    layout: 'border',
    width: "100%",
    height: "100%",
    bodyBorder: false,
    defaults: {
       collapsible: false,
        split: true,
        bodyPadding: 0
    },
    items: [
        {
            xtype: 'live-ac-form',
            region: 'center'
            //margin: '5 0 0 0'
            //region: 'center',
            

        },
        {
            xtype: 'tabpanel',
            //margin: '5 0 0 0',
            region: 'south',
            title: 'Account balance:',
            flex: 1,
            //icon: null,
            //glyph: 77,
            tabBarHeaderPosition: 1,
            reference: 'trade_tab_panel',
            plain: false,
            bind: {//MAY BIND THE FOLLOW IN THE FUTURE FOR USER PREFERENCE PURPOSE
                //height: window.screen.height < 800 ? "60%" : "50%",
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
                    //width: '100%',
                    //height: '100%',
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
                    //width: '100%',
                    //height: '100%',
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
                    //width: '100%',
                    //height: '100%',
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