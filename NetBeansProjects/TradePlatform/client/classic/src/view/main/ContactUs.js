/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeApp.view.main.ContactUs', {
    extend: 'Ext.panel.Panel',
    xtype: 'contact-us',
    requires: [
        'Ext.layout.container.Column'
    ],
    layout: 'column',
    bodyPadding: 10,
    defaults: {
        bodyPadding: 20
    },
    bodyBorder: false,
    autoScroll: true,
    items: [/*{
            xtype: 'panel',
            title: 'Contact info',
            columnWidth: 0.35,
            margin: '20 20 20 20',
            defaults: {
                        labelStyle: 'font-weight:bold; color: gray;'
                    },
            items: [{
                    xtype: 'component',
                    iconCls: 'fa fa-home',
                    html: '<div style="font-weight:bold; font-size: 18px; color: gray;"><span>Company name </span>'+
                            '<p style="font-weight:600; font-size: 12px;">Company addressa 1 goes here</p>'+
                            '<p style="font-weight:600; font-size: 12px;">Company addressa 2 goes here</p></div>'
                }, {
                    iconCls: 'fa fa-phone',
                    fieldLabel: 'Phone Numbers',
                    xtype: 'fieldcontainer',
                    layout:'vbox',
                    items: [
                        {xtype: 'displayfield', value: 'bla bla blah phone no 1'},
                        {xtype: 'displayfield', value: 'bla bla blah phone no 2'},
                        {xtype: 'displayfield', value: 'bla bla blah phone no 3'}
                    ]
                }, {
                    xtype: 'displayfield',
                    iconCls: 'fa fa-email',
                    fieldLabel: 'Email',
                    value:'email address goes here'
                }]
        }*/, {
            xtype: 'panel',
            title: 'Send us a quick message',
            columnWidth: 0.65,
            margin: '20 20 20 20',
            items: [{
                    xtype: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: false,
                    bodyPadding: 10,
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelAlign: 'top',
                        labelWidth: 100,
                        labelStyle: 'font-weight:bold; color: gray;'
                    },
                    items: [{
                            xtype: 'fieldcontainer',
                            //fieldLabel: 'Your Name',
                            labelStyle: 'font-weight:bold; color: gray; padding:0;',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            fieldDefaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                    flex: 1,
                                    name: 'firstName',
                                    itemId: 'firstName',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'First Name',
                                    allowBlank: false,
                                    margin: '0 0 0 5'
                                }, {
                                    flex: 2,
                                    name: 'lastName',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Last Name',
                                    allowBlank: false,
                                    margin: '0 0 0 5'
                                }]
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Your Email Address',
                            afterLabelTextTpl: [
                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                            ],
                            vtype: 'email',
                            allowBlank: false
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Subject',
                            afterLabelTextTpl: [
                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                            ],
                            allowBlank: false
                        }, {
                            xtype: 'textareafield',
                            fieldLabel: 'Message',
                            labelAlign: 'top',
                            flex: 1,
                            margin: '0',
                            afterLabelTextTpl: [
                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                            ],
                            allowBlank: false
                        }],
                    bbar: [/*{
                            xtype: 'tbspacer',
                            width: 100
                        },*/ {
                            xtype: 'button',
                            text: 'Send',
                            width:100,
                            handler: 'onContactMessageSend'
                        }]
                }]
        }]

});