
var sObj = null;

module.exports = function (_sObj) {
    sObj = _sObj;

    this.totalLiveCommission = function (fromDateTime, toDateTime) {

        var total = 0;
        return sObj.db('history_trades_spotfx')
                .select(sObj.db.raw("sum(BUYER_COMMISSION + SELLER_COMMISSION) as total"))
                .where('LIVE', 1)
                .andWhere('TIME', '>=', fromDateTime)
                .andWhere('TIME', '<', toDateTime)//yes '<' and not '<='
                .then(function (rows) {
                    if (rows.length > 0) {
                        total += rows[0].total - 0;//implicitly convert to numeric
                    }
                    return sObj.db('history_trades_options')
                            .select(sObj.db.raw("sum(BUYER_COMMISSION + SELLER_COMMISSION) as total"))
                            .where('LIVE', 1)
                            .andWhere('TIME', '>=', fromDateTime)
                            .andWhere('TIME', '<', toDateTime);//yes '<' and not '<=' please!
                })
                .then(function (rows) {
                    if (rows.length > 0) {
                        total += rows[0].total - 0;//implicitly convert to numeric
                    }

                    return total;
                });


    };


    this.totalLiveAccountBalance = function () {

        return sObj.db('users')
                .sum("ACCOUNT_BALANCE as total")
                .where('LIVE', 1)
                .then(function (rows) {
                    if (rows.length > 0) {
                        return rows[0].total - 0;//implicitly convert to numeric
                    }
                    return 0;
                });

    };

    this.totalLiveOpenPositions = function () {
        var total = 0;
        return sObj.db('open_positions_spotfx')
                .count("SN as total")
                .where('LIVE', 1)
                .then(function (rows) {
                    if (rows.length > 0) {
                        total += rows[0].total - 0;//implicitly convert to numeric
                    }
                    return sObj.db('open_positions_options')
                            .count("SN as total")
                            .where('LIVE', 1);
                })
                .then(function (rows) {
                    if (rows.length > 0) {
                        total += rows[0].total - 0;//implicitly convert to numeric
                    }
                    return total;
                });

    };

    this.currentRebate = function (input, res) {

        var fromDateTime = sObj.date() + " 00:00:00"; // start of today
        var toDateTime = sObj.now();//now
        var rebate = {};

        totalLiveCommission(fromDateTime, toDateTime)
                .then(function (result) {
                    rebate.day_commission = result;
                    return totalLiveAccountBalance();
                })
                .then(function (result) {
                    rebate.day_account_balance = result;
                    return totalLiveOpenPositions();
                })
                .then(function (result) {
                    rebate.open_positions = result;
                    sObj.sendSuccess(res, "Success", {rebate: rebate});
                })
                .catch(function (err) {
                    res.end();
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION
                    }
                });
    };

    this.historyRebate = function (input, res, recursion_count) {
        var total = 0;
        var table = 'daily_rebate';
        var conditionStr = "LIVE = 1 ";
        var param = [];
        if (input.year) {
            conditionStr += " AND year(DATE) = ?";
            param.push(input.year);
        }

        if (input.month) {
            conditionStr += " AND month(DATE) = ?";
            param.push(input.month);
        }

        var condition = sObj.db.raw(conditionStr, param);

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
                            .orderBy('DATE', 'desc')//important! order by DATE is important because it will give reliable order if the insert is not sequential with DATE.
                            .limit(input.limit)
                            .offset(input.start);
                })
                .then(function (rows) {
                    if (rows.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return historyRebate(input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }
                    //MODEL
                    //['date', 'day_commission', 'day_account_balance']
                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {

                        var row = {
                            date: rows[i].DATE,
                            day_commission: rows[i].DAY_COMMISSION,
                            day_account_balance: rows[i].DAY_ACCOUNT_BALANCE
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

    this.doDailyRebate = function () {
        //quickly execute the daily rebate
        sObj.executor.queue(
                {
                    fn: dailyRebateTask,
                    value: 1,
                    unit: sObj.executor.SECONDS
                }
        );

        var _24_hours = 24 * 3600 * 1000;
        var nextDayStartTime = new Date(sObj.date()).getTime() + _24_hours; //start of next day ie 00:00:00

        //now schedule a 24-hour task for rebate - run at the start of the day
        sObj.executor.schedule(
                {
                    fn: dailyRebateTask,
                    value: 1,
                    unit: sObj.executor.DAYS,
                    begin_time: nextDayStartTime
                }
        );

    };
    /**
     * DO NOT ATTEMPT TO CALCULATE PREBATE OVER 1 DAY AGO BECAUSE THERE IS
     * NO EASY WAY TO COMPUTE THE ACCOUNT BALANCE OF OVER 1 DAY AGO.
     * THE ONLY REALIABLE APPROACH IS FOR THE SERVER TO BE ON FOR AT LEAST ONCE 
     * EVERY DAY. IF THE SERVER IS OFF FOR OVER A FULL DAY THE REBATE RECORDS OVER 1 DAY AGO
     * IS THEREFORE NOT POSSIBLE TO GET AND IS ASSUMED LOST. PLEASE TAKE NOTE.
     * @param {type} prevLongTime
     * @returns {undefined}
     * 
     */
    var dailyRebateTask = function (prevLongTime) {
        
        var _24_hours = 24 * 3600 * 1000;
        if (!prevLongTime) {
            prevLongTime = new Date(sObj.date()).getTime() - _24_hours;
        }
        var prevDate = sObj.moment(new Date(prevLongTime)).format(sObj.DEFAULT_DATE_FORMAT);
        var toDate = sObj.date();
        var prevDateTime = prevDate + " 00:00:00";
        var toDateTime = toDate + " 00:00:00";
        var rebate = {};
        var me = this;
        var table = 'daily_rebate';
        sObj.db(table)
                .select("DATE")
                .where('LIVE', 1)
                .andWhere('DATE', prevDate)
                .then(function (rows) {
                    if (rows.length > 0) {//already computed
                        console.log('Rebate already computed for '+prevDate);
                        return sObj.promise.reject(null);
                    }
                    return totalLiveCommission(prevDateTime, toDateTime);
                })
                .then(function (result) {
                    rebate.commission = result;
                    return totalLiveAccountBalance();
                })
                .then(function (result) {
                    rebate.account_balace = result;
                    return rebate;
                })
                .then(function (result) {            
            
                    return sObj.db
                            .insert(
                                    {
                                        DATE: prevDate,
                                        LIVE: 1,
                                        DAY_COMMISSION: rebate.commission,
                                        DAY_ACCOUNT_BALANCE: rebate.account_balace
                                    }
                            )
                            .into(table);
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION
                    }
                });

    };


    return this;
};



