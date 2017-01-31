/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('TradeApp.view.quote.QuoteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.quote',
    listen: {
        //listen to events using GlobalEvents
        
    },
    onItemSelected: function (sender, record) {
        
        //Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirmChuks', this);
    },

    onConfirmChuks: function (choice) {
        if (choice === 'yes') {
            //alert("I change this fucntion from onConfirm to onConfirmChuks");
        }
    }
});
