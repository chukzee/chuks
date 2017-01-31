
//the variable name losable_amt is the amount to loss if the traders losses
var check_equity_proc_name = "checkEquity";

var checkEquityProcSQL = ""
        + " CREATE PROCEDURE " + check_equity_proc_name + "(IN type VARCHAR(200), IN exchange_id VARCHAR(200), IN losable_amt INT, IN server_now DATETIME)"

        + " BEGIN "
        //DECLARE VARIABLES
        + " DECLARE equity INT DEFAULT 0; "
        + " DECLARE val INT DEFAULT 0; "

        //get trader account balance
        + " SELECT ACCOUNT_BALANCE  INTO val FROM users "
        + " WHERE users.EXCHANGE_ID = exchange_id; "

        + " SET equity = val - losable_amt; "


        + " IF (type = 'SELLER') THEN " //IF SELLER

        //calculating SELLER_LOSABLE_AMT from exchange_options
        + " SELECT COALESCE(SUM(SELLER_LOSABLE_AMT), 0)  INTO val FROM exchange_options "
        + " WHERE "
        + " exchange_options.CANCELLED = 0 AND exchange_options.EXCHANGE_EXPIRY > server_now "
        + " AND (exchange_options.BUYER_ID IS NULL AND BINARY exchange_options.SELLER_ID = exchange_id AND exchange_options.DEL_BY_SELLER_ID  IS NULL); "

        + " SET equity = equity - val; "

        //calculating SELLER_LOSABLE_AMT from exchange_spotfx
        + " SELECT COALESCE(SUM(SELLER_LOSABLE_AMT), 0)  INTO val FROM exchange_spotfx  "
        + " WHERE "
        + " exchange_spotfx.CANCELLED = 0 AND exchange_spotfx.EXCHANGE_EXPIRY > server_now "
        + " AND (exchange_spotfx.BUYER_ID IS NULL AND BINARY exchange_spotfx.SELLER_ID = exchange_id AND exchange_spotfx.DEL_BY_SELLER_ID  IS NULL); "

        + " SET equity = equity - val; "

        //calculating SELLER_LOSABLE_AMT from open_positions_options
        + " SELECT COALESCE(SUM(SELLER_LOSABLE_AMT), 0)  INTO val FROM open_positions_options  "
        + " WHERE BINARY open_positions_options.BUYER_ID = exchange_id OR BINARY open_positions_options.SELLER_ID = exchange_id; "

        + " SET equity = equity - val; "

        //calculating SELLER_LOSABLE_AMT from open_positions_spotfx
        + " SELECT COALESCE(SUM(SELLER_LOSABLE_AMT), 0)  INTO val FROM open_positions_spotfx  "
        + " WHERE BINARY open_positions_spotfx.BUYER_ID = exchange_id OR BINARY open_positions_spotfx.SELLER_ID = exchange_id; "

        + " SET equity = equity - val; "

        + " ELSEIF (type = 'BUYER') THEN " //IF BUYER

        //calculating BUYER_LOSABLE_AMT from exchange_options
        
        + " SELECT COALESCE(SUM(BUYER_LOSABLE_AMT), 0)  INTO val FROM exchange_options "
        + " WHERE "
        + " exchange_options.CANCELLED = 0 AND exchange_options.EXCHANGE_EXPIRY > server_now "
        + " AND (exchange_options.BUYER_ID IS NULL AND BINARY exchange_options.SELLER_ID = exchange_id AND exchange_options.DEL_BY_SELLER_ID  IS NULL); "

        + " SET equity = equity - val; "

        //calculating BUYER_LOSABLE_AMT from exchange_spotfx
        + " SELECT COALESCE(SUM(BUYER_LOSABLE_AMT), 0)  INTO val FROM exchange_spotfx  "
        + " WHERE "
        + " exchange_spotfx.CANCELLED = 0 AND exchange_spotfx.EXCHANGE_EXPIRY > server_now "
        + " AND (exchange_spotfx.BUYER_ID IS NULL AND BINARY exchange_spotfx.SELLER_ID = exchange_id AND exchange_spotfx.DEL_BY_SELLER_ID  IS NULL); "

        + " SET equity = equity - val; "

        //calculating BUYER_LOSABLE_AMT from open_positions_options
        + " SELECT COALESCE(SUM(BUYER_LOSABLE_AMT), 0)  INTO val FROM open_positions_options  "
        + " WHERE BINARY open_positions_options.BUYER_ID = exchange_id OR BINARY open_positions_options.SELLER_ID = exchange_id; "

        + " SET equity = equity - val; "

        //calculating BUYER_LOSABLE_AMT from open_positions_spotfx
        + " SELECT COALESCE(SUM(BUYER_LOSABLE_AMT), 0)  INTO val FROM open_positions_spotfx  "
        + " WHERE BINARY open_positions_spotfx.BUYER_ID = exchange_id OR BINARY open_positions_spotfx.SELLER_ID = exchange_id; "

        + " SET equity = equity - val; "


        + " END IF;"//end if

        //select to get the result of the calculation
        + "SELECT equity;"

        + " END "; // end of procedure

var storeProc = function (sObj) {
    sObj.db.raw(checkProcedureExixtSQL(sObj.config.db.database))
            .then(function (result) {
                if (result[0][0].YES === 0) {
                    console.log("Creating stored procedure: " + check_equity_proc_name);
                    return sObj.db.raw(checkEquityProcSQL);
                } else if (result[0][0].YES === 1) {
                    console.log("Found stored procedure: " + check_equity_proc_name);
                    return sObj.promise.reject(null);
                    
                } else {
                    throw new Error("Unexpected return value when checking procedure exists : " + check_equity_proc_name);
                }
            })
            .then(function (result) {
                console.log("Successfully created stored procedure: " + check_equity_proc_name);
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                }
            });

    return this;
};

var checkProcedureExixtSQL = function (db_name) {
    return "SELECT EXISTS(SELECT 1 FROM mysql.proc p WHERE db = '" + db_name + "' AND name = '" + check_equity_proc_name + "') as YES;";
};

module.exports = storeProc;
