
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
     * Determines whether to honour market close hours. Used mainly for debugging purpose
     * when market is closed. If set to false it means the closing hours of the market
     * will not be honour. It defaults to true.
     * 
     * @type Boolean
     */
    HONOUR_MARKET_CLOSED: false,
    /**
     * This is meant for version control. It is sent to the client upon startup.
     * And the client must send this verison on every request to ensure compartibility
     * with the server.
     * @type String
     */
    VERSION: "v1.0.0",
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
     * Set the directory for storing price data history
     * @type String
     */
    PRICE_DATA_DIR: __dirname + "/price_data_history/",
    /**
     * Set the name of file storing the last quotes
     * @type String
     */
    LAST_QUOTE_FILE: __dirname + '/price_data_history/last_quotes.price',
    
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
    PROD_HOST: "matadorprime.elcmarkets.com",
    /**
     * Server http host used in development
     * @type Number
     */
    DEV_HOST: "localhost",
    /**
     * set the price pipe path
     * @type String
     */
    PRICE_PIPE_PATH: "\\\\.\\pipe\\price_local_route",
    /*
     * Used to specify that prices should be streamed from the MetaTrader Server  a
     * running MetTrader Client using piping.
     * 
     * @type String
     */
    MT_CLIENT: "MT_CLIENT",
    /*
     * Used to specify that prices should be streamed from FIX Server.
     * 
     * @type String
     */
    FIX_SERVER: "FIX_SERVER",
    /*
     * Used to determine which source to get the price data from.
     * possible values are 
     * @type String MT_CLIENT and FIX_SERVER
     */
    PRICE_DATASOURCE: "FIX_SERVER",
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
    SYMBOLS_ATTR: {
        "EUR/USD": {pip_value: 1.00, min_pl: 20, max_pl: 100},
        "GBP/USD": {pip_value: 1.00, min_pl: 20, max_pl: 100},
        "AUD/USD": {pip_value: 1.00, min_pl: 20, max_pl: 100},
        "NZD/USD": {pip_value: 1.00, min_pl: 20, max_pl: 100},
        //"ZAR/USD": {pip_value: 1.00, min_pl:... , max_pl: 100},
        //"INR/USD": {pip_value: 1.00, min_pl:... , max_pl: 100},
        "USD/JPY": {pip_value: 0.848, min_pl: 20, max_pl: 100},
        "USD/CHF": {pip_value: 0.972, min_pl: 20, max_pl: 100},
        "USD/CAD": {pip_value: 0.748, min_pl: 20, max_pl: 100},
        //"USD/HKD": {pip_value: 0.129, min_pl:... , max_pl:... },
        "USD/SGD": {pip_value: 0.692, min_pl: 25, max_pl: 100},
        "EUR/CHF": {pip_value: 0.972, min_pl: 20, max_pl: 100},
        "EUR/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "EUR/GBP": {pip_value: 1.237, min_pl: 20, max_pl: 80},
        "EUR/AUD": {pip_value: 0.726, min_pl: 25, max_pl: 100},
        "EUR/CAD": {pip_value: 0.748, min_pl: 25, max_pl: 100},
        "EUR/NZD": {pip_value: 0.693, min_pl: 25, max_pl: 100},
        "GBP/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "GBP/CHF": {pip_value: 0.972, min_pl: 20, max_pl: 100},
        "GBP/AUD": {pip_value: 0.726, min_pl: 25, max_pl: 100},
        "GBP/NZD": {pip_value: 0.693, min_pl: 25, max_pl: 100},
        "GBP/CAD": {pip_value: 0.748, min_pl: 25, max_pl: 100},
        "AUD/CAD": {pip_value: 0.748, min_pl: 25, max_pl: 100},
        "AUD/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "AUD/CHF": {pip_value: 0.972, min_pl: 20, max_pl: 100},
        "NZD/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "NZD/CHF": {pip_value: 0.972, min_pl: 20, max_pl: 100},
        //"ZAR/EUR": {pip_value: 1.04, min_pl:... , max_pl:... },
        //"ZAR/GBP": {pip_value: 1.24, min_pl:... , max_pl:... },
        "USD/TRY": {pip_value: 0.284, min_pl: 100, max_pl: 300},
        //"USD/SEK": {pip_value: 0.107, min_pl:... , max_pl:... },
        "USD/RUB": {pip_value: 0.015, min_pl: 2000, max_pl: 6000},
        //"USD/DKK": {pip_value: 0.143, min_pl:... , max_pl:... },
        //"GBP/ZAR": {pip_value: 0.072, min_pl:... , max_pl:... },
        //"GBP/SEK": {pip_value: 0.107, min_pl:... , max_pl:... },
        //"GBP/PLN": {pip_value: 0.236, min_pl:... , max_pl:... },
        //"GBP/DKK": {pip_value: 0.143, min_pl:... , max_pl:... },
        //"EUR/ZAR": {pip_value: 0.072, min_pl:... , max_pl:... },
        "EUR/TRY": {pip_value: 0.284, min_pl: 100, max_pl: 300},
        "CAD/CHF": {pip_value: 0.972, min_pl: 20, max_pl: 100},
        "CAD/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "GBP/TRY": {pip_value: 0.284, min_pl: 100, max_pl: 300},
        "CHF/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "TRY/JPY": {pip_value: 0.849, min_pl: 20, max_pl: 100},
        "XAU/USD": {pip_value: 0.10, min_pl: 200, max_pl: 900},
        //"XBR/USD": {pip_value: 1.00, min_pl:... , max_pl:... },
        "XAG/USD": {pip_value: 5.00, min_pl: 5, max_pl:20 }
    },
    
    /**
     * Supported spot forex symbols
     * @type Array
     */
    SPOT_SYMBOLS: [
        "EUR/USD",
        "GBP/USD",
        "AUD/USD",
        "NZD/USD",
        "ZAR/USD",
        "INR/USD",
        "USD/JPY",
        "USD/CHF",
        "USD/CAD",
        "USD/HKD",
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
        "ZAR/EUR",
        "ZAR/GBP",
        "USD/TRY",
        "USD/SEK",
        "USD/RUB",
        "USD/DKK",
        "GBP/ZAR",
        "GBP/SEK",
        "GBP/PLN",
        "GBP/DKK",
        "EUR/ZAR",
        "EUR/TRY",
        "CAD/CHF",
        "CAD/JPY",
        "GBP/TRY",
        "CHF/JPY",
        "TRY/JPY",
        "XAU/USD",
        "XBR/USD",
        "XAG/USD"],
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
        "database": 'flatbook_traders'
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
    privileges: {
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