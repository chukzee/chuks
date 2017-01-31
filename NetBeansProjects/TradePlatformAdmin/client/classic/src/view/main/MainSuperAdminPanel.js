/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeAdmin.view.main.MainSuperAdminPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'main-super-admin-panel',
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
                //style: 'background-color: white;',
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
                    title: 'Add Admin User',
                    //iconCls: 'fa-user',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: 'Admin user'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            items: [{
                                    xtype: 'add-admin-user-form',
                                    title: 'Admin User Form'
                                }, {
                                    xtype: 'admin-user-grid',
                                    title: 'Show Admin Users'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    if (newC.id.indexOf('admin-user-grid') === 0) {
                                        TradeAdmin.Util.refreshGrid(newC.id, true);
                                    }
                                }
                            }
                        }]
                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Register Broker',
                    //iconCls: 'fa-home',
                    margin: '10 0 0 0',
                    items: [{
                            xtype: 'tabpanel',
                            header: {
                                style: 'background-color: white;',
                                title: {
                                    style: 'color: gray;',
                                    text: 'Brokers Registration'
                                }
                            },
                            tabBarHeaderPosition: 1,
                            titleRotation: 0,
                            tabRotation: 0,
                            width: "100%",
                            height: "100%",
                            headerPosition: 'top',
                            items: [{
                                    xtype: 'broker-registration-form',
                                    title: 'Broker Registration Form'
                                }, {
                                    xtype: 'broker-registration-grid',
                                    title: 'Show Registered Brokers'
                                }],
                            listeners: {
                                beforetabchange: function (tabPanel, newC, oldC) {
                                    if (newC.id.indexOf('broker-registration-grid') === 0) {
                                        TradeAdmin.Util.refreshGrid(newC.id, true);
                                    }
                                }
                            }
                        }]

                }, {
                    xtype: 'panel',
                    layout: 'center',
                    title: 'Live Traders',
                    id: 'msa-live-traders-grid-id',
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
                    id: 'msa-demo-traders-grid-id',
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
                                    id: 'msa-demo-traders-grid'
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
                    id: 'msa-rebate-per-day-grid-id',
                    items: [{
                            xtype: 'rebate-per-day-grid',
                            id: 'msa-rebate-per-day-grid'
                        }]

                }],
            listeners: {
                beforetabchange: function (tabPanel, newC, oldC) {
                    if (newC.id === "msa-demo-traders-grid-id") {
                        TradeAdmin.Util.refreshGrid('msa-demo-traders-grid', true);
                    }
                    if (newC.id === "msa-rebate-per-day-grid-id") {
                        TradeAdmin.Util.refreshGrid('msa-rebate-per-day-grid', true);
                    }

                    if (newC.id === "msa-live-traders-grid-id") {
                        var f = newC.down('form').getForm();
                        TradeAdmin.Util.autoLiveTraderIdentity(f);
                    }

                    if (newC.id.indexOf('msa-rebate-per-day-grid-id') === 0) {
                        TradeAdmin.Util.getCurrentRebate(newC);
                    }
                }
            }




        }
    ]
});