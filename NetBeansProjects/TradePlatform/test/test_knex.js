
var config = require('../config');
var shortid = require('shortid');
var moment = require('moment');
var util = require('../util')();

var knex = require('knex')({
    client: config.db.provider,
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    },
    pool: {
        min: 0,
        max: 15
    },
    acquireConnectionTimeout: 15000
});

// INTO val 

//SET val = val + 55;\

//WHERE EXCHANGE_ID = 'EXD386H1qfL-la'; 


var exchanger_type = "SELLER";  
var exchange_id = 'EXD001192';
var losable_amt = 200;
var now = moment().utc().format("YYYY-MM-DD HH:mm:ss");

var callStoredProcSql = "CALL checkEquity('" + exchanger_type
                + "','" + exchange_id + "',"
                + losable_amt + ",'" + now + "')";
        
         knex.raw(callStoredProcSql)
                .then(function (result) {
                    if(result[0] && result[0][0] && result[0][0][0]){
                        var equity = result[0][0][0]['equity'];
                        console.log(equity > 0);
                        console.log(equity < 0);
                        return equity > 0;
                    }else{
                        console.log('unexpected result return by knex');
                    }
                    console.log(result[0][0][0]['equity']);
                });
        
