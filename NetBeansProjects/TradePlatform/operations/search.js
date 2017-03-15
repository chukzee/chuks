/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var search = function (sObj) {


    this.liveTraders = function (user, input, res) {
        input.live = 1;
        this.traders(user, input, res);
    };

    this.demoTraders = function (user, input, res) {
        input.live = 0;
        this.traders(user, input, res);
    };

    this.withdrawals = function (user, input, res) {
        input.tran_type = 'WITHDRAWAL';
        this.transactions(user, input, res);
    };

    this.fundings = function (user, input, res) {
        input.tran_type = 'DEPOSIT';
        this.transactions(user, input, res);
    };

    this.depositsAndWithdrawals = function (user, input, res) {
        input.tran_type = 'BOTH';
        this.transactions(user, input, res);
    };

    this.traders = function (user, input, res, recursion_count) {


        var live = input.live ? 1 : 0;
        var total = 0;
        var table = 'users';
        var param = [];
        var queryStr = " LIVE=? ";
        var filter = [];
        param.push(live);

        if (input.username) {
            filter.push(" BINARY USERNAME=? ");
            param.push(input.username);
        }
        if (input.exchange_id) {
            filter.push(" BINARY EXCHANGE_ID=? ");
            param.push(input.exchange_id);
        }
        if (input.full_name) {
            var names = input.full_name.split(" ");
            var first_name = names[0];
            var last_name = names[1];
            filter.push(" FIRST_NAME=? ");
            filter.push(" LAST_NAME=? ");
            param.push(first_name);
            param.push(last_name);
        }

        var filterStr = "";
        for (var i = 0; i < filter.length; i++) {
            if (i < filter.length - 1) {
                filterStr += filter[i] + " OR ";
            } else {
                filterStr += filter[i];
                filterStr = " AND (" + filterStr + ") ";
            }
        }

        queryStr += filterStr;

        var condition = sObj.db.raw(queryStr,
                param);

        sObj.db(table)
                .count("SN as total")
                .where(condition)
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db(table)// NO NEED TO SORT HISTORY TRADES. WE NEED THE DEFAULT ASCENDING ORDER
                            .select()
                            .where(condition)
                            .limit(input.limit)
                            .offset(input.start);
                })
                .then(function (rows) {
                    if (rows.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return traders(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {

                        var row = {
                            live: rows[i].LIVE,
                            username: rows[i].USERNAME,
                            exchange_id: rows[i].EXCHANGE_ID,
                            first_name: rows[i].FIRST_NAME,
                            last_name: rows[i].LAST_NAME,
                            email: rows[i].EMAIL,
                            sex: rows[i].SEX,
                            address: rows[i].ADDRESS,
                            country: rows[i].COUNTRY,
                            state: rows[i].STATE,
                            company: rows[i].COMPANY,
                            date_registered: rows[i].DATE_REGISTERED
                        };
                        data.table.push(row);
                    }

                    sObj.sendSuccess(res, "Success", data);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    this.transactions = function (user, input, res, recursion_count) {
        var tran_type = input.tran_type;
        var total = 0;
        var table = 'account_tran';

        var condition;
        var queryStr = "";
        var param = [];

        if (tran_type === 'BOTH') {
            queryStr = " account_tran.TRAN_TYPE=? OR account_tran.TRAN_TYPE=? ";
            param = ['DEPOSIT', 'WITHDRAWAL'];
        } else {
            queryStr = " account_tran.TRAN_TYPE=? ";
            param = [tran_type];
        }

        if (!input.isAdmin || input.isSingleUserQuery) {
            //restrict search to the user
            queryStr = " BINARY account_tran.USERNAME = '" + user.username + "' AND ( " + queryStr + " ) ";
        }

        var filter = [];

        if (input.username) {
            filter.push(" BINARY account_tran.USERNAME=? ");
            param.push(input.username);
        }
        if (input.exchange_id) {
            filter.push(" BINARY users.EXCHANGE_ID=? ");
            param.push(input.exchange_id);
        }
        if (input.full_name) {
            var names = input.full_name.split(" ");
            var first_name = names[0];
            var last_name = names[1];
            filter.push(" users.FIRST_NAME=? ");
            filter.push(" users.LAST_NAME=? ");
            param.push(first_name);
            param.push(last_name);
        }

        var filterStr = "";
        for (var i = 0; i < filter.length; i++) {
            if (i < filter.length - 1) {
                filterStr += filter[i] + " OR ";
            } else {
                filterStr += filter[i];
                filterStr = " AND (" + filterStr + ") ";
            }
        }


        queryStr += filterStr;

        condition = sObj.db.raw(queryStr,
                param);

        sObj.db(table)
                //.count("account_tran.SN as total")
                .select(sObj.db.raw('COUNT(account_tran.SN) as total'))
                .innerJoin('users', 'account_tran.USERNAME', 'users.USERNAME')
                .where(condition)
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db(table)// NO NEED TO SORT HISTORY TRADES. WE NEED THE DEFAULT ASCENDING ORDER
                            .select('account_tran.SN',//important! very important! we the the SN of account_tran and not users
                                    'account_tran.USERNAME',
                                    'account_tran.TRAN_DATE',
                                    'account_tran.TRAN_TYPE',
                                    'users.EXCHANGE_ID',
                                    'users.FIRST_NAME',
                                    'users.LAST_NAME',
                                    'users.EMAIL',
                                    'account_tran.AMOUNT',
                                    'account_tran.PAYMENT_METHOD')
                            .innerJoin('users', 'account_tran.USERNAME', 'users.USERNAME')
                            .where(condition)
                            .orderBy('account_tran.SN', 'desc')
                            .limit(input.limit)
                            .offset(input.start);
                })
                .then(function (rows) {
                    if (rows.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return transactions(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {

                        var row = {
                            sn: rows[i].SN,
                            username: rows[i].USERNAME,
                            date: rows[i].TRAN_DATE,
                            type: rows[i].TRAN_TYPE,
                            exchange_id: rows[i].EXCHANGE_ID,
                            first_name: rows[i].FIRST_NAME,
                            last_name: rows[i].LAST_NAME,
                            email: rows[i].EMAIL,
                            amount: rows[i].AMOUNT,
                            payment_method: rows[i].PAYMENT_METHOD
                        };
                        data.table.push(row);
                    }

                    sObj.sendSuccess(res, "Success", data);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    return this;
};

module.exports = search;

