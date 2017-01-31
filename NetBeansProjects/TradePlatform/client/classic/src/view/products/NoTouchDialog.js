/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.NoTouchDialog', {
    extend: 'Ext.window.Window',
    xtype: 'no-touch-dialog',
    title: '<h2>No Touch</h2>',
    width: 550,
    height: window.screen.height <= 700 ? 500 : (window.screen.height <= 800 ? 550 : 600),
    minWidth: 300,
    minHeight: 300,
    layout: 'fit',
    modal: true, //important - to lock the parent window while this window is visible - this will prevent opening another window from the parent window until this window is close
    //defaultFocus: 'firstName',
    closeAction: 'hide',
    viewModel: {
        data: {
            strikeTypeStoreData: ["Up", "Down"],
            strikeType: ""
        },
        formulas: {
            setStrikeLabel: function (get) {
                var v = get('strikeType');
                var sv = get('strikeVal');
                if (v === "Up") {
                    return "+" + (sv ? sv : "");
                } else if (v === "Down") {
                    return "-" + (sv ? sv : "");
                } else {
                    return "";
                }
            }

        }
    },
    items: [{
            xtype: 'product-form-option',
            reference: 'noTouchForm',
            url:'access/create/no_touch'

        }]
});
