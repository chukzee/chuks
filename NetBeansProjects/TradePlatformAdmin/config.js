
/**
 The global config file for the server app
 */
module.exports = {
    /**
     * Determines settings to use. Whether to use production settings or not.
     * 
     * @type Boolean
     */
    production: false,
    /**
     * A link to the live account page.
     * @type String
     */
    LIVE_ACCOUNT_LINK: "TODO",
    /**
     * Commission collected on all won trades
     * @type Number
     */
    COMMISSION: 10,
    /**
     * Server https port used in production
     * @type Number
     */
    PROD_HTTPS_PORT: 443,
    /**
     * Server https port used in development
     * @type Number
     */
    DEV_HTTPS_PORT: 443,
    /**
     * Server http port used in production
     * @type Number
     */
    PROD_HTTP_PORT: 80,
    /**
     * Server http port used in development
     * @type Number
     */
    DEV_HTTP_PORT: 3005,
    /**
     * Server http host used in production
     * @type Number
     */
    PROD_HOST: "map.elcmarkets.com",
    /**
     * Server http host used in development
     * @type Number
     */
    DEV_HOST: "localhost",
    /**
     * A flag used to select the FIX server to connect to.
     * Set to true to connect to fix live server. Default is false
     * @type Boolean
     */
    FIX_LIVE: false,
    /**
     * FIX demo server settings. Please ensure it is the FIX demo server setting
     * that is provided here
     * @type type
     */
    FIX_DEMO_SETTINGS: {
        host: 'primexmuk.demo.primexm.com', //demo
        port: 30270, //demo
        SenderCompID: "Q074", //demo
        TargetCompID: "XCD1", //demo
        username: "primexm_vibhs_uat4_q", //demo
        password: "APA6Gvk7y4wCwQdj"//demo
    },
    /**
     * FIX live server settings. Please ensure it is the FIX live server setting
     * that is provided here
     * @type type
     */
    FIX_LIVE_SETTINGS: {
        host: 'UKNOWN', //live
        port: 0, //UKNOWN //live
        SenderCompID: "UKNOWN", //live
        TargetCompID: "UKNOWN", //live
        username: "UKNOWN", //live
        password: "UKNOWN"//live
    },
    /**
     * Supported spot forex symbols
     * @type Array
     */
    SPOT_SYMBOLS: [
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
    /**
     * Supported future market symbols
     * @type Array
     */
    FUTURES_SYMBOLS: [
        //TODO
    ],
    /**
     * Supported commodities market symbols
     * @type Array
     */
    COMMODITIES_SYMBOLS: [
        //TODO
    ],
    /**
     * Supported oil/gas market symbols
     * @type Array
     */
    OIL_AND_GAS_SYMBOLS: [
        //TODO
    ],
    /**
     * Supported timeframes of chart prices for this app
     * @type type
     */
    timeframes: {
        "1min": 60 * 1000,
        "5min": 5 * 60 * 1000,
        "15min": 15 * 60 * 1000,
        "30min": 30 * 60 * 1000,
        "1hr": 3600 * 1000,
        "4hr": 4 * 3600 * 1000,
        "1day": 24 * 3600 * 1000,
        "1week": 7 * 24 * 3600 * 1000,
        "1month": 30 * 24 * 3600 * 1000,
        "1year": 365 * 24 * 3600 * 1000
    },
    
    /**
     * Database server config settings
     * @type type
     */
    db: {
        "provider": "mysql",
        "host": '127.0.0.1',
        "user": 'elitecapital',
        "password": 'elitecapitalpass',
        "database": 'flatbook_admin'
    },
    /**
     * Redis connection settings
     * @type type
     */
    redis: {
    },
    /**
     * Admin privileges
     * @type type
     */
    privileges : {
       REGISTER_BROKER: "REGISTER_BROKER",
       CREATE_ADMIN_USER: "CREATE_ADMIN_USER",
       DELETE_ADMIN_USER: "DELETE_ADMIN_USER",
       REGISTER_TRADER: "REGISTER_TRADER",
       FUND_TRADER_ACCOUNT: "FUND_TRADER_ACCOUNT",
       TRADER_FUND_WITHDRAWAL: "TRADER_FUND_WITHDRAWAL"
   },
    /**
     * Json Web Token (JWT) secret - PLEASE DO NOT MODIFY THIS SECRET EXCEPT WHEN ABSOLUTELY NEEDED.
     * 
     * NOTE : IF THIS SECRET IS MODIFID IT WILL INVALIDATE THE ENTIRE USERS CONNECTIONS AND THE 
     * ENTIRE REDIS CACHE MAY NEED TO BE DROPED. SO MODIFY WITH CAUTION
     * 
     * @type String
     */
    jwtSecret: "bfa633968fb6ddd251178f68a1f0c9e3060d5f859f084061b0dc93db198d35afeced835091bc1a1fd54f495971dedfe09c7aac0936ff5eac1184210e786ca205",
    jwtAdminSecret: "f0c9e3060d5f859f0840615091bc1a1fd540e786ca205dedfe09c7aac0936ff5eac118421b0dcbfa633968fb6ddd25f495971ced831178f68a193db198d35afe"
};