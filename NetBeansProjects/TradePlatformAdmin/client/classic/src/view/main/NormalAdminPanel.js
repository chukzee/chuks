/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeAdmin.view.main.NormalAdminPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'normal-admin-panel',
    layout: 'center',
    width: "100%",
    height: "100%",
    controller: 'main',
    viewModel: 'main',
    items: [
        {
            xtype: 'tabpanel',
            //ui: 'navigation',
            tabBarHeaderPosition: 1,
            titleRotation: 0,
            tabRotation: 0,
            width: "100%",
            height: "100%",
            headerPosition: 'top',
            header: {
                style: 'background-color: gray',
                layout: {
                    align: 'stretchmax'
                },
                title: {
                    flex: 0
                }//,
                //iconCls: 'fa-th-list'
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
                    title: 'Live Traders',
                    id: 'na-live-traders-grid-id',
                    //iconCls: 'fa-home',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: 'Live Traders'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            layout: 'center',
                            items: [{
                                    xtype: 'registration-form',
                                    title: 'Trader Registration Form'
                                }, {
                                    xtype: 'registration-grid',
                                    title: 'Show Registered Traders'
                                }, {
                                    xtype: 'live-account-panel',
                                    title: 'Live Account'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    if (newC.id.indexOf('registration-grid') === 0) {
                                        TradeAdmin.Util.refreshGrid(newC.id, true);
                                    }
                                }
                            }
                        }]

                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Demo Traders',
                    //iconCls: 'fa-home',
                    margin: '10 0 0 0',
                    id: 'na-demo-traders-grid-id',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: 'Demo Traders'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            layout: 'center',
                            items: [{
                                    xtype: 'demo-traders-grid',
                                    title: 'Show Demo Traders',
                                    id: 'na-demo-traders-grid'
                                }, {
                                    xtype: 'demo-account-panel',
                                    title: 'Demo Account'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    /*
                                     * if (newC.id.indexOf('registration-grid') === 0) {
                                        TradeAdmin.Util.refreshGrid(newC.id, true);
                                       }*/
                                }
                            }
                        }]


                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Funding',
                    //iconCls: 'fa-user',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: 'Account Funding'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            items: [{
                                    xtype: 'fund-form',
                                    title: 'Fund Form'
                                }, {
                                    xtype: 'fund-grid',
                                    title: 'Show Funds History'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    if (newC.id.indexOf('fund-grid') === 0) {
                                        TradeAdmin.Util.refreshGrid(newC.id, true);
                                    }
                                }
                            }
                        }]
                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Withdrawal',
                    //iconCls: 'fa-user',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: 'Fund Withdrawal'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            items: [{
                                    xtype: 'withdrawal-form',
                                    title: 'Withdrawal Form'
                                }, {
                                    xtype: 'withdrawal-grid',
                                    title: 'Show Withdrawal History'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    if (newC.id.indexOf('withdrawal-grid') === 0) {
                                        TradeAdmin.Util.refreshGrid(newC.id, true);
                                    }
                                }
                            }
                        }]
                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Rebate',
                    //iconCls: 'fa-home',
                    //margin: '10 0 0 0',
                    id: 'na-rebate-per-day-grid-id',
                    items: [{
                            xtype: 'rebate-per-day-grid',
                            id: 'na-rebate-per-day-grid'
                        }]

                }],
            listeners: {
                beforetabchange: function (tabPanel, newC, oldC) {

                    if (newC.id.indexOf('na-demo-traders-grid-id') === 0) {
                        TradeAdmin.Util.refreshGrid('na-demo-traders-grid', true);
                    }
                    if (newC.id === "na-rebate-per-day-grid-id") {
                        TradeAdmin.Util.refreshGrid('na-rebate-per-day-grid', true);
                    }

                    if (newC.id === "na-live-traders-grid-id") {
                        var f = newC.down('form').getForm();
                        TradeAdmin.Util.autoLiveTraderIdentity(f);
                    }

                    if (newC.id.indexOf('na-rebate-per-day-grid-id') === 0) {
                        TradeAdmin.Util.getCurrentRebate(newC);
                    }
                }
            }




        }
    ]
});