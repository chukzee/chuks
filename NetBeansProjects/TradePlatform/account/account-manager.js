

var accountManager = function (sObj) {

    this.withdrawalPaymentMethod = function (input, res) {
        
        try {
            var serial_nos_array = JSON.parse(input.serial_nos);
        } catch (e) {
            res.end();
            console.log(e);//DO NOT DO THIS IN PRODUCTION
            return;
        }

        if (serial_nos_array.length === 0) {
            res.end();
            return;
        }
        sObj.db('account_tran')
                .where("SN", 'in', serial_nos_array)
                .update({
                    PAYMENT_METHOD: input.payment_method
                })
                .then(function (result) {
                    if (result > 0) {
                        sObj.sendSuccess(res, "Success");
                    } else {
                        sObj.sendIgnore(res, "Nothing updated!");
                    }

                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION
                    }
                });
    };

    this.accountInfo = function (user, res) {

        var obj = {};

        sObj.db('users')
                .select('ACCOUNT_BALANCE')
                .whereRaw("BINARY USERNAME='" + user.username + "'")
                .andWhere('LIVE', user.live)
                .then(function (rows) {
                    obj.account_balance = 0;
                    if (rows.length > 0) {
                        obj.account_balance = rows[0].ACCOUNT_BALANCE;
                    }
                    
                    sObj.sendSuccess(res, "Success", obj);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {
                        console.log(err);
                    }

                });
    };

    var deleteAccountRecord = function (obj) {

        sObj.db('account_tran')
                .select('AMOUNT')
                .where('SN', obj.sn)
                .then(function (result) {
                    if (result.length === 0) {
                        sObj.sendIgnore(obj.res, 'no result');
                        return;
                    }
                    var amount = result[0];
                    var operator = "+";
                    if (amount < 0) {
                        amount = Math.abs(amount);
                        operator = "-";
                    }
                    sObj.db.transaction(function (trx) {
                        trx.delete()
                                .where('SN', obj.sn)
                                .from('account_tran')
                                .then(function (result) {
                                    return trx.raw("UPDATE users "
                                            + " SET ACCOUNT_BALANCE = ACCOUNT_BALANCE " + operator + " " + amount
                                            + " WHERE BINARY USERNAME = '" + obj.username + "'");
                                })
                                .then(trx.commit)
                                .then(function () {
                                    sObj.sendSuccess(obj.res, "Operation was succesful");
                                })
                                .catch(function (err) {
                                    if (err) {
                                        obj.res.end();
                                        console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                                    }
                                    trx.rollback();
                                });
                    });
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                    }
                });


    };

    var modifyAccount = function (obj) {

        if (!obj.details) {
            obj.details = "";
        }
        obj.amount = Math.abs(obj.amount) - 0;//implicitly convert to numeric
        var operator = "+";
        if (obj.type === "WITHDRAWAL") {
            operator = "-"; // negate
        }
        sObj.db.transaction(function (trx) {
            trx.insert({
                USERNAME: obj.username, TRAN_TYPE: obj.type, TRAN_DATE: sObj.now(), TRAN_DETAILS: obj.details, AMOUNT: obj.amount
            }).into('account_tran')
                    .then(function (result) {
                        if (obj.type === "WITHDRAWAL") {
                            return  trx('users')
                                    .select("ACCOUNT_BALANCE")
                                    .where('USERNAME', obj.username)
                                    .then(function (rows) {
                                        if (rows.length > 0) {
                                            if (obj.amount > rows[0].ACCOUNT_BALANCE) {
                                                sObj.sendError(obj.res, "Operation denied! Cannot withdraw beyond account balance.");
                                                return sObj.promise.reject(null);
                                            }
                                        }
                                        return true;
                                    });
                        }
                        return true;
                    })
                    .then(function (result) {

                        return trx.raw("UPDATE users "
                                + " SET ACCOUNT_BALANCE = ACCOUNT_BALANCE " + operator + " " + obj.amount
                                + " WHERE BINARY USERNAME = ? ", [obj.username]);

                    })
                    .then(trx.commit)
                    .then(function (result) {
                        sObj.sendSuccess(obj.res, "Operation was succesful");

                        sObj.redis.publish(sObj.ACCOUNT_MODIFIED, JSON.stringify({username: obj.username}));
                    })
                    .catch(function (err) {
                        if (err) {
                            obj.res.end();
                            console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                        }
                        trx.rollback();
                    });
        }).catch(function (err) {
            if (err) {
                obj.res.end();
                console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
            }
        });
    };

    var checkOpenTrade = function (callback, param) {
        //first check if the trader has a live trade on.

        sObj.db('open_positions_options')
                .select('SN')
                .whereRaw("BINARY SELLER_ID = '" + param.exchange_id + "'")
                .orWhereRaw("BINARY BUYER_ID = '" + param.exchange_id + "'")
                .then(function (result) {
                    if (result.length > 0) {
                        if (param.res) {
                            sObj.sendError(param.res, "Operation denied! Trader has an open position.");
                        }
                        return sObj.promise.reject(null);
                    }

                    return sObj.db('open_positions_spotfx')
                            .select('SN')
                            .whereRaw("BINARY SELLER_ID = '" + param.exchange_id + "'")
                            .orWhereRaw("BINARY BUYER_ID = '" + param.exchange_id + "'");

                })
                .then(function (result) {
                    if (result.length > 0) {
                        if (param.res) {
                            sObj.sendError(param.res, "Operation denied! Trader has an open position.");
                        }
                        return sObj.promise.reject(null);
                    }
                    return sObj.db('exchange_options')
                            .select('SN')
                            .whereRaw('(BINARY SELLER_ID =? AND  DEL_BY_SELLER_ID is NULL AND EXCHANGE_EXPIRY > ?)'
                                    , [param.exchange_id, sObj.now()]);
                })// AND ((SELLER_ID=? AND DEL_BY_SELLER_ID is NULL) OR (BUYER_ID=? AND DEL_BY_BUYER_ID is NULL))
                .then(function (result) {
                    if (result.length > 0) {
                        if (param.res) {
                            sObj.sendError(param.res, "Operation denied! Trader has a trade in exchange room.");
                        }
                        return sObj.promise.reject(null);
                    }
                    return sObj.db('exchange_spotfx')
                            .select('SN')
                            .whereRaw('(BINARY SELLER_ID =? AND  DEL_BY_SELLER_ID is NULL AND EXCHANGE_EXPIRY > ?)'
                                    , [param.exchange_id, sObj.now()]);
                })
                .then(function (result) {
                    if (result.length > 0) {
                        if (param.res) {
                            sObj.sendError(param.res, "Operation denied! Trader has a trade in exchange room.");
                        }
                        return sObj.promise.reject(null);
                    }
                    return callback(param);
                })
                .catch(function (err) {

                    if (err) {//TODO - log error to another process in production
                        if (param.res) {
                            sObj.sendError(param.res, "Oops!!! Something went wrong.");
                        }
                        console.log(err);
                    }
                });

    };

    this.fundAccount = function (user, input, res) {
        modifyAccount(
                {
                    username: input.username,
                    amount: input.amount,
                    details: input.details,
                    type: "DEPOSIT",
                    res: res
                }
        );
    };

    this.withdrawFund = function (user, input, res) {

        var username = user.username;
        var exchange_id = user.exchangeId;
        var isAdmin;
        if (input.isAdmin) {
            isAdmin = true;
        } else {
            isAdmin = false;
            /*if(!user.live){
             sObj.sendError(res, "Cannot make withdrawal on a demo account!");
             return;
             }*/
        }

        checkOpenTrade(modifyAccount, {
            username: username,
            exchange_id: exchange_id,
            amount: input.amount,
            //details: input.details,
            type: "WITHDRAWAL",
            isAdmin: isAdmin,
            res: res
        });


    };

    this.deleteFund = function (user, input, res) {
        deleteAccountRecord(
                {
                    sn: input.sn,
                    username: input.username,
                    res: res
                }
        );
    };

    this.deleteWithdrawal = function (user, input, res) {

        checkOpenTrade(deleteAccountRecord, {
            sn: input.sn,
            username: input.username,
            res: res
        });
    };


    return this;
};

module.exports = accountManager;
