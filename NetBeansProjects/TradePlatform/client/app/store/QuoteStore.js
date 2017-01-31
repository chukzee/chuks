//var quote_model = Ext.create('TradeApp.model.Quote');
var space = ' ';
Ext.define('TradeApp.store.QuoteStore', {
    extend: 'Ext.data.Store',
    alias: 'store.quotes',
   
    requires: ['TradeApp.model.Quote'
                ],
    
    model: 'TradeApp.model.Quote',
    autoLoad: true,
    groupField: 'market_type',//whether it is Spot forex, Oil/Gas, Commodities, Futures and so on.
    proxy: {
        type: 'ajax',
        url : 'market_watch',
        actionMethods : { 
            create: 'POST',
            read: 'POST', 
            update: 'POST',
            destroy: 'POST' 
        },
        reader: {
            type: 'json',
            rootProperty: 'table',
            totalProperty: 'total'
        }
    }

    /**READ!!!!!! ABEG READ OOOOOOO!!!!!! - WORKAROUND....
     * Since ExtJS by default sorts group, so to prevent that, prepend numeric value to the group field
     * to retain your desire sort order. e.g Spot is lexically greater than Oil/Gas, which means Oil/Gas
     * will come before Spot in ascending order. Ok force Spot to come before Oil/Gas in ascending order,
     * prepend say '1.' to Spot and say '2.' to Oil/Gas resulting in '1.Spot' and '2.OilGas'. this will
     * force Spot to come befor Oil/Gas. Then before display remove the prepended 'sort preventer' e.g '1.'
     * from the Group name. THIS IS JUST A WORKAROUND!!!
     */
    /**
     * READ!!! A NEAR PERFECT SOLUTION
     * ANOTHER TECHNIQUE OR A KIND OF CHEAT APROACH IS TO PREPEND SPACE CHARACTER TO THE Spot market_type.
     * THIS IS OK BECAUSE ExtJS REMOVES THE WHITE SPACE CHARACTER BEFORE REDERING THE GRID. 
     * 
     * 
     */
    /*data: [// Spot is preceded with white space . see below - REMIND: DO THIS IN FOR REAL data 
            {market_type: space+'Spot',  symbol: "EURUSD", price: "1.3453"},
            {market_type: 'Commodities',  symbol: "COMD3", price: "33.3453"},
            {market_type: space+'Spot',  symbol: "GBPUSD", price: "2.3453"},
            {market_type: 'Oil/Gas',  symbol: "OIL_GAS4", price: "25.3453"},
            {market_type: space+'Spot',  symbol: "AUDUSD", price: "3.3453"},
            {market_type: space+'Spot',  symbol: "USD/JPY", price: "4.3453"},
            {market_type: 'Oil/Gas',  symbol: "OIL_GAS1", price: "22.3453"},
            {market_type: 'Oil/Gas',  symbol: "OIL_GAS2", price: "23.3453"},
            {market_type: 'Oil/Gas',  symbol: "OIL_GAS3", price: "24.3453"},
            
            {market_type: 'Commodities',  symbol: "COMD1", price: "31.3453"},
            {market_type: 'Commodities',  symbol: "COMD2", price: "32.3453"},
            
            {market_type: 'Commodities',  symbol: "COMD4", price: "34.3453"},
            {market_type: 'Futures',  symbol: "FUT1", price: "41.3453"},
            {market_type: 'Futures',  symbol: "FUT2", price: "42.3453"},
            {market_type: 'Futures',  symbol: "FUT3", price: "43.3453"},
            {market_type: 'Futures',  symbol: "FUT4", price: "44.3453"}

        ]*/

});
