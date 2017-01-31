/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.DoubleNoTouchDialog', {
    extend: 'Ext.window.Window',
    xtype: 'double-no-touch-dialog',
    
    title: '<h2>Double No Touch</h2>',
    width: 550,
    height: window.screen.height <= 700 ? 500 : (window.screen.height <= 800 ? 550 : 600),
    minWidth: 300,
    minHeight: 300,
    layout: 'fit',
    modal: true,//important - to lock the parent window while this window is visible - this will prevent opening another window from the parent window until this window is close
    //defaultFocus: 'firstName',
    closeAction: 'hide', 
    items: [{
            xtype: 'product-form-option-b',
            reference: 'doubleNoTouchForm',
            url:'access/create/double_no_touch'
            
        }]
});
