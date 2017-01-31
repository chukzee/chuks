/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var exchangeQuery = function (sObj) {

    this.optionsExchange = function (user, input, res, recursion_count) {
        
        if (input.filterProduct || input.filterSellerId || input.filterMethod) {
            filterOptionsExchange(user, input, res);
            return;
        }
        
        var total = 0;
        var table = 'exchange_options';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=? AND BUYER_ID is NULL AND DEL_BY_SELLER_ID is NULL", [sObj.now(), user.live]);
        
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
                .then(function (result) {
                    
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return optionsExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendOptionsResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    this.spotFxExchange = function (user, input, res, recursion_count) {
        if (input.filterSymbol || input.filterSellerId || input.filterDirection || input.filterMethod) {
            filterSpotFxExchange(user, input, res);
            return;
        }
        var total = 0;
        var table = 'exchange_spotfx';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=? AND BUYER_ID is NULL AND DEL_BY_SELLER_ID is NULL", [sObj.now(), user.live]);
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return spotFxExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendSpotFxResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    /**
     user_exchange_id will be retrieve from the user session
     */
    this.userOptionsExchange = function (user, input, res, recursion_count) {

        if (input.filterProduct || input.filterMethod) {
            filterUserOptionsExchange(user, input, res);
            return;
        }
        var total = 0;
        var table = 'exchange_options';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=? AND ((BINARY SELLER_ID=? AND DEL_BY_SELLER_ID is NULL) OR (BINARY BUYER_ID=? AND DEL_BY_BUYER_ID is NULL))",
                [sObj.now(), user.live, user.exchangeId, user.exchangeId]);
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return userOptionsExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendUserOptionsResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    /**
     user_exchange_id will be retrieve from the user session
     */
    this.userSpotFxExchange = function (user, input, res, recursion_count) {

        if (input.filterSymbol || input.filterDirection || input.filterMethod) {
            filterUserSpotFxExchange(user, input, res);
            return;
        }
        var total = 0;
        var table = 'exchange_spotfx';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=? AND ((BINARY SELLER_ID=? AND DEL_BY_SELLER_ID is NULL) OR (BINARY BUYER_ID=? AND DEL_BY_BUYER_ID is NULL))",
                [sObj.now(), user.live, user.exchangeId, user.exchangeId]);
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return userSpotFxExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendUserSpotFxResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };



    var filterOptionsExchange = function (user, input, res, recursion_count) {

        var or = "OR ";
        var filter_query_str = "";

        if (input.filterProduct) {
            filter_query_str += or + "PRODUCT='" + input.filterProduct + "'";
        }
        
        if (input.filterSellerId) {
            filter_query_str += or + "BINARY SELLER_ID='" + input.filterSellerId + "'";
        }
        
        if (input.filterMethod) {
            filter_query_str += or + "METHOD='" + input.filterMethod + "'";
        }

        filter_query_str = filter_query_str.substring(or.length);
        if (filter_query_str === '') {
            sObj.sendIgnore(res, 'no result');
            return;
        }
        var total = 0;
        var table = 'exchange_options';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=?"
                +" AND BUYER_ID is NULL "
                +" AND DEL_BY_SELLER_ID is NULL AND (" + filter_query_str + ")", [sObj.now(), user.live]);
        
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return filterOptionsExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendOptionsResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };


    var filterSpotFxExchange = function (user, input, res, recursion_count) {

        var or = "OR ";
        var filter_query_str = "";

        if (input.filterSymbol) {
            filter_query_str += or + "SYMBOL='" + input.filterSymbol + "'";
        }
        
        if (input.filterSellerId) {
            filter_query_str += or + "BINARY SELLER_ID='" + input.filterSellerId + "'";
        }
        
        if (input.filterDirection) {
            filter_query_str += or + "DIRECTION='" + input.filterDirection + "'";
        }
        
        if (input.filterMethod) {
            filter_query_str += or + "METHOD='" + input.filterMethod + "'";
        }

        filter_query_str = filter_query_str.substring(or.length);
        if (filter_query_str === '') {
            sObj.sendIgnore(res, 'no result');
            return;
        }
        var total = 0;
        var table = 'exchange_spotfx';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=?"
                +" AND BUYER_ID is NULL "
                +" AND DEL_BY_SELLER_ID is NULL AND (" + filter_query_str + ")", [sObj.now(), user.live]);
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;
                            console.log("recursion");
                            return filterSpotFxExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendSpotFxResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    /**
     user_exchange_id will be retrieve from the user session
     */
    var filterUserOptionsExchange = function (user, input, res, recursion_count) {
        var or = "OR ";
        var filter_query_str = "";

        if (input.filterProduct) {
            filter_query_str += or + "PRODUCT='" + input.filterProduct + "'";
        }

        if (input.filterSellerId) {
            filter_query_str += or + "BINARY SELLER_ID='" + input.filterSellerId + "'";
        }
        
        if (input.filterMethod) {
            filter_query_str += or + "METHOD='" + input.filterMethod + "'";
        }

        filter_query_str = filter_query_str.substring(or.length);
        if (filter_query_str === '') {
            sObj.sendIgnore(res, 'no result');
            return;
        }//((SELLER_ID=? AND DEL_BY_SELLER_ID is NULL) OR (BUYER_ID=? AND DEL_BY_BUYER_ID is NULL))
        var total = 0;
        var table = 'exchange_options';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=? "
                + " AND "
                + " ((BINARY SELLER_ID=? AND DEL_BY_SELLER_ID is NULL)"
                + " OR (BINARY BUYER_ID=? AND DEL_BY_BUYER_ID is NULL))"
                + " AND (" + filter_query_str + ")",
                [sObj.now(), user.live, user.exchangeId, user.exchangeId]);
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return filterUserOptionsExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendUserOptionsResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    /**
     user_exchange_id will be retrieve from the user session
     */
    var filterUserSpotFxExchange = function (user, input, res, recursion_count) {
        var or = "OR ";
        var filter_query_str = "";

        if (input.filterSymbol) {
            filter_query_str += or + "SYMBOL='" + input.filterSymbol + "'";
        }
        
        if (input.filterSellerId) {
            filter_query_str += or + "BINARY SELLER_ID='" + input.filterSellerId + "'";
        }
        
        if (input.filterDirection) {
            filter_query_str += or + "DIRECTION='" + input.filterDirection + "'";
        }

        if (input.filterMethod) {
            filter_query_str += or + "METHOD='" + input.filterMethod + "'";
        }
        
        filter_query_str = filter_query_str.substring(or.length);
        if (filter_query_str === '') {
            sObj.sendIgnore(res, 'no result');
            return;
        }
        var total = 0;
        var table = 'exchange_spotfx';
        var condition = sObj.db.raw("CANCELLED = 0 AND EXCHANGE_EXPIRY > ? AND LIVE=? "
                + " AND "
                + " ((BINARY SELLER_ID=? AND DEL_BY_SELLER_ID is NULL)"
                + " OR (BINARY BUYER_ID=? AND DEL_BY_BUYER_ID is NULL))"
                + " AND (" + filter_query_str + ")",
                [sObj.now(), user.live, user.exchangeId, user.exchangeId]);
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
                .then(function (result) {
                    if (result.length === 0 && total > 0) {
                        if (!recursion_count) {//risky so attemp the recursion only once
                            recursion_count = 1;//JUST ONCE PLS!
                            input.start = 0;
                            input.limit = total;

                            return filterUserSpotFxExchange(user, input, res, recursion_count); // recursion attempt

                        } else {
                            total = 0;//we tried our best so just set to zero instead
                        }
                    }

                    sendUserSpotFxResult(res, result, total);
                })
                .catch(function (err) {
                    res.end();
                    if (err) {//TODO - log error to another process in production
                        console.log(err);
                    }
                });
    };

    var sendSpotFxResult = function (res, result, total) {

        //['order','method', 'buyer_action', 'symbol', 'direction', 'stop_loss','take_profit', 'exchange_expiry', 'time', 'size', 'seller_id']
        var data = {
            total: result.length <= total ? total : result.length,
            table: []
        };

        for (var i = 0; i < result.length; i++) {
            var row = {
                order: result[i].ORDER_TICKET,
                method:result[i].METHOD,
                buyer_action: result[i].BUYER_ACTION,
                symbol: result[i].SYMBOL,
                direction: result[i].DIRECTION,
                pending_order_price: result[i].PENDING_ORDER_PRICE,
                stop_loss: result[i].STOP_LOSS,
                take_profit: result[i].TAKE_PROFIT,
                time: result[i].TIME,
                exchange_expiry: result[i].EXCHANGE_EXPIRY,
                size: result[i].SIZE,
                seller_id: result[i].SELLER_ID
            };
            data.table.push(row);
        }

        sObj.sendSuccess(res, "Success", data);

    };

    var sendOptionsResult = function (res, result, total) {
        //['order', 'method','buyer_action' ,'product', 'symbol' , 'strike', 'strike_up', 'strike_down', 'exchange_expiry','time', 'expiry', 'size', 'price', 'seller_id']
        var data = {
            total: result.length <= total ? total : result.length,
            table: []
        };

        for (var i = 0; i < result.length; i++) {
            var row = {
                order: result[i].ORDER_TICKET,
                method:result[i].METHOD,
                buyer_action: result[i].BUYER_ACTION,
                product: result[i].PRODUCT,
                symbol: result[i].SYMBOL,
                pending_order_price: result[i].PENDING_ORDER_PRICE,
                strike: result[i].STRIKE,
                strike_up: result[i].STRIKE_UP,
                strike_down: result[i].STRIKE_DOWN,
                time: result[i].TIME,
                expiry: result[i].EXPIRY_VALUE +" " +result[i].EXPIRY_UNIT,
                exchange_expiry: result[i].EXCHANGE_EXPIRY,
                size: result[i].SIZE,
                price: result[i].PRICE,
                premium: result[i].PREMIUM,
                seller_id: result[i].SELLER_ID
            };
            data.table.push(row);
        }

        sObj.sendSuccess(res, "Success", data);

    };

    var sendUserSpotFxResult = function (res, result, total) {
        
        // ['sn','order','method', 'symbol', 'direction', 'stop_loss','take_profit', 'exchange_expiry','time', 'size', 'seller_id', 'buyer_id']
        var data = {
            total: result.length <= total ? total : result.length,
            table: []
        };

        for (var i = 0; i < result.length; i++) {
            var row = {
                sn: result[i].SN,
                method:result[i].METHOD,
                order: result[i].ORDER_TICKET,
                symbol: result[i].SYMBOL,
                direction: result[i].DIRECTION,
                pending_order_price: result[i].PENDING_ORDER_PRICE,
                stop_loss: result[i].STOP_LOSS,
                take_profit: result[i].TAKE_PROFIT,
                time: result[i].TIME,
                exchange_expiry: result[i].EXCHANGE_EXPIRY,
                size: result[i].SIZE,
                seller_id: result[i].SELLER_ID,
                buyer_id: result[i].BUYER_ID
            };
            data.table.push(row);
        }

        sObj.sendSuccess(res, "Success", data);

    };

    var sendUserOptionsResult = function (res, result, total) {
        
        //['sn', 'order', 'method', 'product', 'symbol' , 'strike', 'strike_up', 'strike_down', 'exchange_expiry','time', 'expiry', 'size', 'price', 'seller_id', 'buyer_id']
        var data = {
            total: result.length <= total ? total : result.length,
            table: []
        };

        for (var i = 0; i < result.length; i++) {
            var row = {
                sn: result[i].SN,
                method:result[i].METHOD,
                order: result[i].ORDER_TICKET,
                product: result[i].PRODUCT,
                symbol: result[i].SYMBOL,
                pending_order_price: result[i].PENDING_ORDER_PRICE,
                strike: result[i].STRIKE,
                strike_up: result[i].STRIKE_UP,
                strike_down: result[i].STRIKE_DOWN,
                time: result[i].TIME,
                expiry: result[i].EXPIRY_VALUE +" " +result[i].EXPIRY_UNIT,
                exchange_expiry: result[i].EXCHANGE_EXPIRY,
                size: result[i].SIZE,
                price: result[i].PRICE,
                premium: result[i].PREMIUM,
                seller_id: result[i].SELLER_ID,
                buyer_id: result[i].BUYER_ID
            };
            data.table.push(row);
        }

        sObj.sendSuccess(res, "Success", data);

    };


    return this;
};

module.exports = exchangeQuery;
