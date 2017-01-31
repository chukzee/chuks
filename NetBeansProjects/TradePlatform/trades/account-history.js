/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var accountHistory = function (sObj) {

    this.spotFxHistory = function (user, input, res, recursion_count) {
        var user_exchange_id = user.exchangeId;
        var total = 0;
        var table = 'history_trades_spotfx';

        var condition = sObj.db.raw("(BINARY SELLER_ID=? AND DEL_BY_SELLER_ID is NULL)"
                + " OR "
                + "(BINARY BUYER_ID=? AND DEL_BY_BUYER_ID is NULL)",
                [user_exchange_id, user_exchange_id]);

        sObj.db(table)
                .count("SN as total")
                .where(condition)
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db(table)
                            .select()
                            .where(condition)
                            .orderBy('SN', 'desc')
                            .limit(input.limit)
                            .offset(input.start);
                })
                .then(function (rows) {
                    if (rows.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return spotFxHistory(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }
                    //MODEL
                    //['order', 'time', 'type', 'direction', 'size','symbol', 
                    //'open', 'stop_loss', 'take_profit', 'close', 'countdown', 
                    //'commission', 'profit_and_loss']
                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {
                        var is_seller = rows[i].SELLER_ID === user_exchange_id;
                        var row = {
                            order: rows[i].ORDER_TICKET,
                            time: rows[i].TIME,
                            type: is_seller ? "SELLER" : "BUYER",
                            direction: rows[i].SELLER_ID === user_exchange_id ? rows[i].DIRECTION : sObj.util.reverseDirection(rows[i].DIRECTION),
                            size: rows[i].SIZE,
                            symbol: rows[i].SYMBOL,
                            open: rows[i].OPEN,
                            stop_loss: rows[i].SELLER_ID === user_exchange_id ? rows[i].STOP_LOSS : rows[i].TAKE_PROFIT,
                            take_profit: rows[i].SELLER_ID === user_exchange_id ? rows[i].TAKE_PROFIT : rows[i].STOP_LOSS,
                            close: rows[i].CLOSE,
                            countdown: rows[i].COUNT_DOWN,
                            result: is_seller ? rows[i].SELLER_RESULT : rows[i].BUYER_RESULT,
                            commission: is_seller ? rows[i].SELLER_COMMISSION : rows[i].BUYER_COMMISSION,
                            profit_and_loss: is_seller ? rows[i].SELLER_PROFIT_AND_LOSS : rows[i].BUYER_PROFIT_AND_LOSS
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

    this.optionsHistory = function (user, input, res, recursion_count) {
        var user_exchange_id = user.exchangeId;
        var total = 0;
        var table = 'history_trades_options';
        var condition = sObj.db.raw("(BINARY SELLER_ID=? AND DEL_BY_SELLER_ID is NULL)"
                + " OR "
                + "(BINARY BUYER_ID=? AND DEL_BY_BUYER_ID is NULL)",
                [user_exchange_id, user_exchange_id]);

        sObj.db(table)
                .count("SN as total")
                .where(condition)
                .then(function (rows) {
                    if (rows[0].total === 0) {
                        return sObj.promise.reject(null);
                    }
                    total = rows[0].total;
                    return sObj.db(table) 
                            .select()
                            .where(condition)
                            .orderBy('SN', 'desc')
                            .limit(input.limit)
                            .offset(input.start);
                })
                .then(function (rows) {
                    if (rows.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return optionsHistory(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }
                    // MODEL
                    // ['order', 'type', 'option', 'symbol', 'strike',  'stake', 'price',
                    //   'premium_received',  'premium_paid', 'countdown','time' ,
                    //   'expiry', 'result', 'payout', 'commission', 'profit_and_loss']
                    var data = {
                        total: rows.length <= total ? total : rows.length,
                        table: []
                    };

                    for (var i = 0; i < rows.length; i++) {
                        var is_seller = rows[i].SELLER_ID === user_exchange_id;
                        var row = {
                            order: rows[i].ORDER_TICKET,
                            type: is_seller ? "SELLER" : "BUYER",
                            product: is_seller
                                    ? rows[i].PRODUCT//seller
                                    : sObj.util.reverseProduct(rows[i].PRODUCT), //buyer
                            symbol: rows[i].SYMBOL,
                            open: rows[i].OPEN,
                            strike: rows[i].STRIKE,
                            strike_up: rows[i].STRIKE_UP,
                            strike_down: rows[i].STRIKE_DOWN,
                            barrier:  rows[i].BARRIER, 
                            barrier_up: rows[i].BARRIER_UP,
                            barrier_down: rows[i].BARRIER_DOWN,
                            stake: rows[i].STAKE,
                            size: rows[i].SIZE,
                            //premium_received: is_seller ? rows[i].PREMIUM_RECEIVED : 0,//DEPRECATED
                            //premium_paid: is_seller ? 0 : rows[i].PREMIUM_PAID,//APPROACH IS DEPRECATED
                            premium: is_seller ? rows[i].PREMIUM : rows[i].PRICE,
                            price: is_seller ? rows[i].PRICE : rows[i].PREMIUM,
                            countdown: rows[i].COUNT_DOWN,
                            time: rows[i].TIME,
                            expiry: rows[i].EXPIRY,
                            close: rows[i].CLOSE,
                            result: is_seller ? rows[i].SELLER_RESULT : rows[i].BUYER_RESULT,
                            payout: is_seller ? rows[i].SELLER_PAYOUT : rows[i].BUYER_PAYOUT,
                            commission: is_seller ? rows[i].SELLER_COMMISSION : rows[i].BUYER_COMMISSION,
                            profit_and_loss: is_seller ? rows[i].SELLER_PROFIT_AND_LOSS : rows[i].BUYER_PROFIT_AND_LOSS
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

module.exports = accountHistory;

