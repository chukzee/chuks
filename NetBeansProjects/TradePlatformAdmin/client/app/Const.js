/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeAdmin.Const', {
    singleton: true,

    SYMBOLS: [
        "AUD/USD",
        "AUD/JPY",
        "AUD/CHF",
        "AUD/CAD",
        "EUR/USD",
        "EUR/JPY",
        "EUR/GBP",
        "GBP/USD",
        "GBP/JPY",
        "GBP/CHF",
        "GBP/AUD",
        "USD/JPY",
        "USD/CHF",
        "USD/CAD"],
    LONG_1970_01_01: new Date("1970-01-01").getTime(),    
    TOKEN_KEY: "auth_token",
    USER_KEY: "user",
    LOGOUT_TXT: "LOGOUT",
    LOGIN_TXT: "Login",
    AUTH_FAIL: "auth_fail",
    UNSUPPORTED_VERSION:"unsupported_version",
    NOT_LOGGED_IN_TXT: "Not Logged In",
    ALL_INSTRUMENTS: "(All Instruments)",
    ALL_TYPES: "(All Types)",
    ALL: "(All)",
    ALL_1: "All",
    BUY_SELL: "BUY / SELL"
});
