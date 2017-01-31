

var dataQuery = function (sObj) {

    var select = function (user, input, res, recursion_count, table, callbackRow) {
        var total = 0;
        sObj.db(table)
                .count("SN as total")
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        res.end();
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db(table)
                            .select()
                            .limit(input.limit)
                            .offset(input.start);
                })
                .then(function (rows) {
                    if (rows.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return select(user, input, res, recursion_count, table, callbackRow); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {
                        var row = callbackRow(rows[i]);
                        data.table.push(row);
                    }

                    sObj.sendSuccess(res, "Success", data);
                })
                .catch(function (err) {
                    
                    if (err) {//TODO - log error to another process in production
                        res.end();
                        console.log(err);
                    }
                });


    };

    var selectByCondition = function (user, input, res, recursion_count, table, condition, callbackRow) {
        var total = 0;

        sObj.db(table)
                .count("SN as total")
                .where(condition)
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        res.end();
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db(table)
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

                            return selectByCondition(user, input, res, recursion_count, table, condition, callbackRow); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {
                        var row = callbackRow(rows[i]);
                        data.table.push(row);
                    }

                    sObj.sendSuccess(res, "Success", data);
                })
                .catch(function (err) {
                    
                    if (err) {//TODO - log error to another process in production
                        res.end();
                        console.log(err);
                    }
                });


    };

    var selectJoinByCondition = function (user, input, res, recursion_count, join, condition, callbackRow) {
        var total = 0;

        sObj.db(join.countedTable)
                .count("SN as total")
                .where(condition)
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        res.end();
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db
                            .join(join.table1, join.table1 + '.' + join.key1, '=', join.table2 + '.' + join.key2)
                            .select("*")
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

                            return selectJoinByCondition(user, input, res, recursion_count, join, condition, callbackRow); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {
                        var row = callbackRow(rows[i]);
                        data.table.push(row);
                    }

                    sObj.sendSuccess(res, "Success", data);
                })
                .catch(function (err) {

                    if (err) {//TODO - log error to another process in production
                        res.end();
                        console.log(err);
                    }
                });


    };

    this.adminUsers = function (user, input, res, recursion_count) {

        if (input.username || input.full_name) {
            var param = [];
            var queryStr = "";
            var filter = [];
            if (input.username) {
                filter.push("BINARY USERNAME=?");
                param.push(input.username);
            }

            if (input.full_name) {
                var names = input.full_name.split(" ");
                var first_name = names[0];
                var last_name = names[1];
                filter.push("FIRST_NAME=?");
                filter.push("LAST_NAME=?");
                param.push(first_name);
                param.push(last_name);
            }

            var filterStr = "";
            for (var i = 0; i < filter.length; i++) {
                if (i < filter.length - 1) {
                    filterStr += filter + " || ";
                } else {
                    filterStr += filter;
                }
            }
            queryStr += filterStr;
            var condition = sObj.db.raw(queryStr,
                    param);

            selectByCondition(user, input, res, 0, 'admin', condition, function (row) {
                return {
                    username: row.USERNAME,
                    first_name: row.FIRST_NAME,
                    last_name: row.LAST_NAME,
                    email: row.EMAIL,
                    privileges: row.PRIVILEGES,
                    created_by: row.CREATED_BY,
                    date_created: row.DATE_CREATED
                };
            });

        } else {

            select(user, input, res, 0, 'admin', function (row) {
                return {
                    username: row.USERNAME,
                    first_name: row.FIRST_NAME,
                    last_name: row.LAST_NAME,
                    email: row.EMAIL,
                    privileges: row.PRIVILEGES,
                    created_by: row.CREATED_BY,
                    date_created: row.DATE_CREATED
                };
            });
        }

    };

    this.brokers = function (user, input, res) {

        if (input.company || input.website) {
            var param = [];
            var queryStr = "";
            var filter = [];
            if (input.company) {
                filter.push("COMPANY=?");
                param.push(input.company);
            }

            if (input.website) {
                filter.push("WEBSITE=?");
                param.push(input.website);
            }

            var filterStr = "";
            for (var i = 0; i < filter.length; i++) {
                if (i < filter.length - 1) {
                    filterStr += filter + " || ";
                } else {
                    filterStr += filter;
                }
            }
            queryStr += filterStr;
            var condition = sObj.db.raw(queryStr, param);

            selectByCondition(user, input, res, 0, 'brokers', condition, function (row) {
                return {
                    username: row.USERNAME,
                    company: row.COMPANY,
                    website: row.WEBSITE,
                    email: row.EMAIL,
                    broker_admin_host_name: row.BROKER_ADMIN_HOST_NAME,
                    trade_platform_host_name: row.TRADE_PLATFORM_HOST_NAME,
                    privileges: row.PRIVILEGES,
                    registered_by: row.REGISTERED_BY,
                    date_registered: row.DATE_REGISTERED
                };
            });

        } else {

            select(user, input, res, 0, 'brokers', function (row) {

                return {
                    username: row.USERNAME,
                    company: row.COMPANY,
                    website: row.WEBSITE,
                    email: row.EMAIL,
                    broker_admin_host_name: row.BROKER_ADMIN_HOST_NAME,
                    trade_platform_host_name: row.TRADE_PLATFORM_HOST_NAME,
                    privileges: row.PRIVILEGES,
                    registered_by: row.REGISTERED_BY,
                    date_registered: row.DATE_REGISTERED
                };
            });
        }
    };


    this.withdrawals = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.username ? "&username=" + input.username : "")
                + (input.full_name ? "&full_name=" + input.full_name : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/search/withdrawals', content);
    };

    this.fundings = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.username ? "&username=" + input.username : "")
                + (input.full_name ? "&full_name=" + input.full_name : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/search/fundings', content);
    };

    this.demoTraders = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.username ? "&username=" + input.username : "")
                + (input.full_name ? "&full_name=" + input.full_name : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/search/demo_traders', content);
    };

    this.liveTraders = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.username ? "&username=" + input.username : "")
                + (input.full_name ? "&full_name=" + input.full_name : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/search/live_traders', content);
    };

    this.userBasicInfo = function (user, input, res) {
        var content = "access_token=" + input.access_token
                + (input.username ? "&username=" + input.username : "");
        
        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/user_basic_info', content);
    };
    
    this.spotFxPositions = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "")
                + (input.username ? "&username=" + input.username : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/open/spotfx', content);
    };
    
    this.optionsPositions = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "")
                + (input.username ? "&username=" + input.username : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/open/options', content);
    };
    
    this.spotFxHistory = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "")
                + (input.username ? "&username=" + input.username : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/history/spotfx', content);
    };
    
    this.optionsHistory = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "")
                + (input.username ? "&username=" + input.username : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/history/options', content);
    };
    
    this.depositsAndWithdrawals = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.exchange_id ? "&exchange_id=" + input.exchange_id : "")
                + (input.username ? "&username=" + input.username : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/history/deposits_and_withdrawals', content);
    };
    
    this.accountInfo = function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.live ? "&live=" + input.live : "")
                + (input.username ? "&username=" + input.username : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_request_trader_account_info', content);
    };

    this.historyRebate= function (user, input, res) {

        var content = "access_token=" + input.access_token
                + (input.page ? "&page=" + input.page : "")
                + (input.start ? "&start=" + input.start : "")
                + (input.limit ? "&limit=" + input.limit : "")
                + (input.month ? "&month=" + input.month : "")
                + (input.year ? "&year=" + input.year : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/history_rebate', content);
    };

    this.currentRebate= function (user, input, res) {

        var content = "access_token=" + input.access_token;

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/admin_query/current_rebate', content);
    };

    return this;
};

module.exports = dataQuery;
