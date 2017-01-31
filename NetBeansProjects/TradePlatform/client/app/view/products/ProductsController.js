/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */


Ext.define('TradeApp.view.products.ProductsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products',
    //requires:['TradeApp.Util'],

    
    onItemSelected: function (sender, record) {

        //Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirmChuks', this);
    },
    onConfirmChuks: function (choice) {
        if (choice === 'yes') {
            //alert("I change this fucntion from onConfirm to onConfirmChuks");
        }
    },
    
    
    onSpotForexClick: function () {   
        Ext.create('TradeApp.view.products.SpotForexDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onDigitalCallClick: function () {
        Ext.create('TradeApp.view.products.DigitalCallDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onDigitalPutClick: function () {
        Ext.create('TradeApp.view.products.DigitalPutDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onOneTouchClick: function () {
        Ext.create('TradeApp.view.products.OneTouchDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onNoTouchClick: function () {
        Ext.create('TradeApp.view.products.NoTouchDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onDoubleOneTouchClick: function () {
        Ext.create('TradeApp.view.products.DoubleOneTouchDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onDoubleNoTouchClick: function () {
        Ext.create('TradeApp.view.products.DoubleNoTouchDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onRangeInClick: function () {
        Ext.create('TradeApp.view.products.RangeInDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onRangeOutClick: function () {
        Ext.create('TradeApp.view.products.RangeOutDialog', TradeApp.Util.onHideThenDestroy).show();
    }
    
    
});


