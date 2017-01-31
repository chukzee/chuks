/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.Const', {
    singleton: true,
    /**
     * This will be set dynamically upon startup.
     */
    SYMBOLS_ATTR: null, //set dynamically

    /**
     * @Deprecated
     * This method is deprecated because it causes id problems when the match watch widow is docked.
     * The preferred way to know the element that display server time is to use a common class name 
     * for them.
     * 
     * Register the id of element the display platform time
     */
    PLATFORM_TIME_ELEMENT_IDS: [
        'platform-time-display',
        'exchange-room-general-time-display',
        'exchange-room-personal-time-display'],
    SYMBOLS: ["EUR/USD",
        "GBP/USD",
        "AUD/USD",
        "NZD/USD",
        //"ZAR/USD",
        //"INR/USD",
        "USD/JPY",
        "USD/CHF",
        "USD/CAD",
        //"USD/HKD",
        "USD/SGD",
        "EUR/CHF",
        "EUR/JPY",
        "EUR/GBP",
        "EUR/AUD",
        "EUR/CAD",
        "EUR/NZD",
        "GBP/JPY",
        "GBP/CHF",
        "GBP/AUD",
        "GBP/NZD",
        "GBP/CAD",
        "AUD/CAD",
        "AUD/JPY",
        "AUD/CHF",
        "NZD/JPY",
        "NZD/CHF",
        //"ZAR/EUR",
        //"ZAR/GBP",
        "USD/TRY",
        //"USD/SEK",
        "USD/RUB",
        //"USD/DKK",
        //"GBP/ZAR",
        //"GBP/SEK",
        //"GBP/PLN",
        //"GBP/DKK",
        //"EUR/ZAR",
        "EUR/TRY",
        "CAD/CHF",
        "CAD/JPY",
        "GBP/TRY",
        "CHF/JPY",
        "TRY/JPY",
        "XAU/USD",
        //"XBR/USD",
        "XAG/USD"],
    cboInstrumentsList: function () {
        var n = [this.ALL_INSTRUMENTS];
        return n.concat(this.SYMBOLS);
    },
    PRICE_TIME: 'Price/Time',
    TF: "TF", //timeframe
    LONG_1970_01_01: new Date("1970-01-01").getTime(),
    MAX_TIMEFRAME_BARS: 300,
    TOKEN_KEY: "auth_token",
    USER_KEY: "user",
    LOGOUT_TXT: "LOGOUT",
    LOGIN_TXT: "Login",
    AUTH_FAIL: "auth_fail",
    UNSUPPORTED_VERSION: "unsupported_version",
    NOT_LOGGED_IN_TXT: "Not Logged In",
    ALL_INSTRUMENTS: "(All Instruments)",
    ALL_TYPES: "(All Types)",
    ALL: "(All)",
    ALL_1: "All",
    BUY_SELL: "BUY / SELL"
});
