/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.DoubleOneTouchDialog', {
    extend: 'Ext.window.Window',
    xtype: 'double-one-touch-dialog',
    
    title: '<h2>Double One Touch</h2>',
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
            reference: 'doubleOneTouchForm',
            url:'access/create/double_one_touch'
            
        }]
});
