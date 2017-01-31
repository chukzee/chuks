/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.view.products.DigitalPutDialog', {
    extend: 'Ext.window.Window',
    xtype: 'digital-put-dialog',
    title: '<h2>Digital Put</h2>',
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
            strikeTypeStoreData: ["ITM", "ATM", "OTM"],
            strikeType: ""
        },
        formulas: {
            setStrikeLabel: function (get) {
                var v = get('strikeType');
                var sv = get('strikeVal');
                if (v === "OTM") {
                    return "-" + (sv ? sv : "");
                } else if (v === "ITM") {
                    return "+" + (sv ? sv : "");
                } else {
                    return "0";
                }
            },
            strikeFieldDisabled: function (get) {
                return get('strikeType') === "ATM";
            }

        }
    },
    items: [{
            xtype: 'product-form-option',
            reference: 'digitalPutForm',
            url:'access/create/digital_put'

        }]
});
