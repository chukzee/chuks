

var sObj = null;
var ioTraders = null;
var Redis = require('ioredis');
var subscriber = new Redis();
var openTrades = null;
var pendingOrders = null;
var emailer = null;


module.exports = function (_ioTraders, _sObj, _openTrades, _pendingOrders, _emailer) {
    ioTraders = _ioTraders;
    sObj = _sObj;
    openTrades = _openTrades;
    pendingOrders = _pendingOrders;
    emailer = _emailer;

    subscriber.subscribe(sObj.EXCHAGE_BOUGTH, function (err, count) {
        if (err !== null) {
            console.log("FAILED!!! Could not subcrbe " + sObj.EXCHAGE_BOUGTH);
            return;
        }

        console.log("subcribed to : " + sObj.EXCHAGE_BOUGTH);
    });

    subscriber.subscribe(sObj.EXCHAGE_SOLD, function (err, count) {
        if (err !== null) {
            console.log("FAILED!!! Could not subcrbe " + sObj.EXCHAGE_SOLD);
            return;
        }

        console.log("subcribed to : " + sObj.EXCHAGE_SOLD);
    });

    subscriber.subscribe(sObj.ACCOUNT_MODIFIED, function (err, count) {
        if (err !== null) {
            console.log("FAILED!!! Could not subcrbe " + sObj.ACCOUNT_MODIFIED);
            return;
        }

        console.log("subcribed to : " + sObj.ACCOUNT_MODIFIED);
    });

    this.notifyClosedTrade = function (order) {
        var extraParam = {//used for selectively sending the account balance - we do not want to unnecessarily expose another trader's account balance
            seller_account_balance: order.seller_account_balance,
            buyer_account_balance: order.buyer_account_balance
        };
        order.seller_account_balance = null; // nullify! we will used the extraParam to selectively pick the trader account balance
        order.buyer_account_balance = null; // nullify! we will used the extraParam to selectively pick the trader account balance

        notifyTradeOperation(order, sendClosedPositionInfo, sendClosedTradeEmail, extraParam);
    };

    this.notifyPendingOrderDeleted = function (order) {
        notifyTradeOperation(order, sendPendingOrderDeletedInfo, null, null);
    };

    this.effectOpenTrade = function (order) {
        
        //console.log("this.effectOpenTrade--------");
        //console.log(order);

        doEffectOpenTrade(order);
    };

    return this;
};

subscriber.on('message', function (channel, message) {//from redis subcription
    switch (channel) {
        case sObj.EXCHAGE_BOUGTH:
            onExchangeBought(message);
            break;
        case sObj.EXCHAGE_SOLD:
            onExchangeSold(message);
            break;
        case sObj.ACCOUNT_MODIFIED:
            onAccountModified(message);
            break;

    }

});


var notifyTradeOperation = function (order, onlineFunc, emailFunc, extraParam) {

    var commandArr = [];

    //PLEASE DO NOT MODIFY THE ORDER OF ARRANGEMENT - IT IS USED FOLLOWING THIS ORDER BELOW - SEE BELOW IN REDIS PIPELINE CALLBACK

    commandArr[0] = ['get', "user:" + order.seller_username]; //index 0 must be seller- DO NOT CHANGE PLS
    commandArr[1] = ['get', "socket_id:" + order.seller_username];//index 1 must be seller- DO NOT CHANGE PLS
    commandArr[2] = ['get', "user:" + order.buyer_username]; //index 2 must be buyer - DO NOT CHANGE PLS
    commandArr[3] = ['get', "socket_id:" + order.buyer_username]; //index 3 must be buyer- DO NOT CHANGE PLS

    sObj.redis.pipeline(commandArr).exec(function (err, result) {
        for (var i = 0; i < result.length; i++) {

            var errStr = result[i][0];
            var value = result[i][1];
            if (errStr !== null || value === null) {
                if (errStr !== null) {
                    console.error(errStr);//DONT DO THIS IN PRODUCTION
                }
                continue;
            }
            //FOLLOWING THE ARRANGEMENT ORDER ABOVE
            if (i === 0 && typeof emailFunc === "function") {//BY THE ARRANGEMENT ORDER ABOVE THIS IS SELLER
                var user = JSON.parse(value);
                if (extraParam) {
                    extraParam.username = order.seller_username;
                }
                emailFunc(order, user, extraParam);//email notification

            } else if (i === 1 && typeof onlineFunc === "function") {//BY THE ARRANGEMENT ORDER ABOVE THIS IS SELLER
                var socket_id = value;
                if (extraParam) {
                    extraParam.username = order.seller_username;
                }
                onlineFunc(order, socket_id, extraParam);//online notification

            } else if (i === 2 && typeof emailFunc === "function") {//BY THE ARRANGEMENT ORDER ABOVE THIS IS BUYER
                var user = JSON.parse(value);
                if (extraParam) {
                    extraParam.username = order.buyer_username;
                }
                emailFunc(order, user, extraParam);//email notification

            } else if (i === 3 && typeof onlineFunc === "function") {//BY THE ARRANGEMENT ORDER ABOVE THIS IS BUYER
                var socket_id = value;
                if (extraParam) {
                    extraParam.username = order.buyer_username;
                }
                onlineFunc(order, socket_id, extraParam);//online notification
            }

        }
    });
};

var sendOpenedTradeEmail = function (order, user) {
    console.log("sendOpenTradeEmail NOT YET IMPLEMETED");
};

var sendClosedTradeEmail = function (order, user) {
    console.log("sendCloseTradeEmail NOT YET IMPLEMETED");
};

var sendClosedPositionInfo = function (order, socket_id, extraParam) {
    sendTradeInfo(order, socket_id, extraParam, 'trade_closed');
};

var sendOpenedPositionInfo = function (order, socket_id, extraParam) {
    sendTradeInfo(order, socket_id, extraParam, 'countdown_over');
};

var sendPendingOrderInfo = function (order, socket_id, extraParam) {
    sendTradeInfo(order, socket_id, extraParam, 'pending_order_created');
};

var sendPendingOrderDeletedInfo = function (order, socket_id, extraParam) {
    sendTradeInfo(order, socket_id, extraParam, 'pending_order_deleted');
};

var sendTradeInfo = function (order, socket_id, extraParam, event_name) {
    if (!socket_id) {
        return;
    }

    if (extraParam) {
        //set the trader account balance
        if (extraParam.username === order.seller_username) {
            order.account_balance = extraParam.seller_account_balance;
        } else {
            order.account_balance = extraParam.buyer_account_balance;
        }
    }

    var seller_username = order.seller_username;
    var buyer_username = order.buyer_username;
    order.seller_username = null;//nullify - we should not send it for security reason - may go to the opponent trader (buyer in this case).
    order.buyer_username = null;//nullify - we should not send it for security reason - may go to the opponent trader (seller in this case).

    var str_order = JSON.stringify(order);

    order.seller_username = seller_username;//restore back atfer serializing - we need it internally
    order.buyer_username = buyer_username;//restore back atfer serializing - we need it internally

    var sock = ioTraders.connected[socket_id];
    if (sock) {
        sock.emit(event_name, str_order, function (err) {
            if (err) {
                console.log(err);//DO NOT DO THIS IN PRODUCTION
            }
        });
    }

    order.account_balance = null;//already served its purpose

};

var onExchangeSold = function (msg) {
    var event_name = "";
    var msgObj = JSON.parse(msg);
    onExchangeOperation(msg, msgObj.type, "sold");
    ioTraders.emit(event_name, msg);
};

var onAccountModified = function (msg) {

    var msgObj = JSON.parse(msg);
    sObj.redis.get("socket_id:" + msgObj.username)
            .then(function (result) {
                var socket_id = result;
                var sock = ioTraders.connected[socket_id];
                if (sock) {
                    sock.emit("account_modified", "", function (err) {
                        if (err) {
                            console.log(err);//DO NOT DO THIS IN PRODUCTION
                        }
                    });
                }
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                }
            });


};

var broadcastExchangeBought = function (order) {
    var obj = {
        seller_id: order.seller_id,
        type: order.product_type
    };
    var msg = JSON.stringify(obj);
    onExchangeOperation(msg, obj.type, "bought");
};

var onExchangeOperation = function (msg, type, operation) {
    var event_name = "";
    if (type === "spotfx") {
        event_name = "spotfx_exchange_" + operation;
    } else if (type === "options") {
        event_name = "options_exchange_" + operation;
    } else {
        throw new Error("Invalid data - Expected spotfx or options : onExchangeOperation " + operation);
    }
    ioTraders.emit(event_name, msg);
};

var onExchangeBought = function (msg) {
    var order = JSON.parse(msg);

    if (order.pending_order_price) {

        //console.log("onExchangeBought------");
        //console.log(order);

        //register the pending order for price monitoring
        pendingOrders.add(order);
        notifyTradeOperation(order, sendPendingOrderInfo, null, null);
        //broadcast the operation
        broadcastExchangeBought(order);
        return;//leave
    }

    //At this point it is not a pending order.
    //Send countdown_start event to client

    var expirySeconds = (new Date(order.exchange_expiry).getTime() - new Date(sObj.now()).getTime()) / 1000;


    if (expirySeconds < 10) {// if less than 10 seconds then make atleast 10 seconds to prevent any unexcepted behaviour - Just in case!
        expirySeconds = 10;
    }

    var countdownQty = expirySeconds;
    var countdownUnit = sObj.executor.SECONDS;

    console.log("expirySeconds    " + expirySeconds);

    //console.log("REMOVE LINE BELOW LATER ABEG O!!!");
    //countdownQty = 120;//TESTING!!! TO BE REMOVE ABEG O!!!

    order.countdown = countdownQty * countdownUnit / 1000;

    var commandArr = [];

    commandArr.push(['get', "socket_id:" + order.buyer_username]);
    commandArr.push(['get', "socket_id:" + order.seller_username]);

    sObj.redis.pipeline(commandArr).exec(function (err, result) {
        for (var i = 0; i < result.length; i++) {
            var errStr = result[i][0];
            var value = result[i][1];
            if (errStr !== null || value === null) {
                if (errStr !== null) {
                    console.error(errStr);//DONT DO THIS IN PRODUCTION
                }
                continue;
            }
            var socket_id = value;
            var sock = ioTraders.connected[socket_id];
            if (sock) {//send countdown_start event to the client
                sock.emit('countdown_start', JSON.stringify(order), function (err) {
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION
                    }
                });
            }
        }

        //run the countdown here in the server

        order.countdown_start_time = sObj.now(); //important! used when determining countdown remaining

        sObj.executor.queue(
                {
                    fn: doEffectOpenTrade, //after countdown
                    args: order,
                    value: countdownQty,
                    unit: countdownUnit,
                    name: "countdown",
                    id: sObj.util.countdownID(order.order_ticket)
                });

        //broadcast the operation
        broadcastExchangeBought(order);

    });

};

var doEffectOpenTrade = function (order) {
    //setup the trade in the database
    var promise = null;
    if (order.product_type === "spotfx") {
        promise = setupSpotfxOpenPosition(order);
    } else if (order.product_type === "options") {
        promise = setupOptionsOpenPosition(order);
    } else {
        return;
    }

    if (promise) {

        promise.then(function (order) {

            //console.log("doEffectOpenTrade---- promise.then(function (order) ------");
            //console.log(order);


            //set the pip value - important!
            order.pip_value = sObj.pipValue(order.symbol);

            //console.log("doEffectOpenTrade---- order.pip_value ------");
            //console.log(order);
            //console.log(order.pip_value);

            if (!order.pip_value) {//this can be because the symbol is not supported!
                return;
            }
            
            //register the open position for price monitoring
            openTrades.add(order);

            //console.log("doEffectOpenTrade---- openTrades.add(order) ------");
            //console.log(order);

            //notify the traders of the open position online and via email
            var extraParam = {//used for selectively sending the account balance - we do not want to unnecessarily expose another trader's account balance
                seller_account_balance: order.seller_account_balance,
                buyer_account_balance: order.buyer_account_balance
            };
            order.seller_account_balance = null; // nullify! we will used the extraParam to selectively pick the trader account balance
            order.buyer_account_balance = null; // nullify! we will used the extraParam to selectively pick the trader account balance

            notifyTradeOperation(order, sendOpenedPositionInfo, sendOpenedTradeEmail, extraParam);


        }).catch(function (err) {
            if (err) {
                console.log(err);//DONT DO THIS IN PRODUCTION
            }
        });

    }

};

var setupSpotfxOpenPosition = function (order) {

    //console.log("arrive setupSpotfxOpenPosition ------");
    //console.log(order);

    var quote = market.getQuote(order.symbol);
    if (!quote) {
        return;//yes! important!
    }
    var current_price = quote.price;
    if (!current_price) {
        return;//yes! important!
    }
    
    var open = order.pending_order_price ? order.pending_order_price : current_price;
    var close = current_price;
    var signed_sl = validateStopLossPips(order.stop_loss, order.direction);
    var signed_tp = validateTakeProfitPips(order.take_profit, order.direction);
    var stop_loss = sObj.util.addPipsPrice(order.symbol, open, signed_sl);
    var take_profit = sObj.util.addPipsPrice(order.symbol, open, signed_tp);
    var time = sObj.now();////now - important!

    order.sl = Math.abs(signed_sl);//important! stop loss size - positive value
    order.tp = Math.abs(signed_tp);//important! take profit size - positive value also - take note

    //console.log("setupSpotfxOpenPosition  ------");
    //console.log(order);

    order.time = time; // used by pending order for activation to open position
    order.open = open; // used by pending order for activation to open position
    order.stop_loss_price = stop_loss; // used by pending order for activation to open position
    order.take_profit_price = take_profit; // used by pending order for activation to open position

    var columns_map = getColumnMap(order);

    var orderUpdate = function (order) {
        order.open = open;
        order.close = close;
        order.stop_loss = stop_loss;
        order.seller_stop_loss = stop_loss;
        order.buyer_stop_loss = take_profit;//opposite of seller
        order.take_profit = take_profit;
        order.seller_take_profit = take_profit;
        order.buyer_take_profit = stop_loss;//opposite of seller
        order.time = time;
    };

    if (order.pending_order_price) {
        //activating pending order to open position by inserting order into open position table
        return sObj.db.insert(columns_map)
                .into("open_positions_spotfx")
                .then(function (result) {
                    
                    orderUpdate(order);
            
                    //console.log("setupSpotfxOpenPosition---- then 1 ------");
                    //console.log(order);
                        
                    return order;
                });
    } else {
        //updating open position after countdown
        return sObj.db("open_positions_spotfx")
                .where("ORDER_TICKET", order.order_ticket)
                .update({
                    TIME: time,
                    OPEN: open,
                    CLOSE: close,
                    STOP_LOSS: stop_loss,
                    TAKE_PROFIT: take_profit
                })
                .then(function (result) {
                    if (result > 0) {

                        orderUpdate(order);

                        //console.log("setupSpotfxOpenPosition---- then 2 ------");
                        //console.log(order);

                        return order;
                    } else {
                        return sObj.promise.reject(null);
                    }
                });
    }
};

var setupOptionsOpenPosition = function (order) {

    //console.log("arrive setupOptionsOpenPosition ------");
    //console.log(order);

    var quote = market.getQuote(order.symbol);
    if (!quote) {
        return;//yes! important!
    }
    var current_price = quote.price;
    if (!current_price) {
        return;//yes! important!
    }

    var open = order.pending_order_price ? order.pending_order_price : current_price;
    var close = current_price;
    var strike = order.strike;
    var seller_strike = order.strike;
    var buyer_strike = -1 * order.strike;
    var strike_up = order.strike_up;
    var strike_down = order.strike_down;
    var price_percent = order.price_percent;
    var premium = order.premium;
    var barrier = sObj.util.addPipsPrice(order.symbol, open, strike);
    var seller_barrier = sObj.util.addPipsPrice(order.symbol, open, seller_strike);
    var buyer_barrier = sObj.util.addPipsPrice(order.symbol, open, buyer_strike);
    var barrier_up = sObj.util.addPipsPrice(order.symbol, open, strike_up);
    var barrier_down = sObj.util.addPipsPrice(order.symbol, open, strike_down);
    var expiry = computeExpiry(order.expiry_value, order.expiry_unit);
    var long_expiry = new Date(expiry).getTime(); //important! - required for option trade monitoring
    var time = sObj.now();//now

    //console.log("setupOptionsOpenPosition ------");
    //console.log(order);

    order.time = time; // used by pending order for activation to open position
    order.expiry = expiry; // used by pending order for activation to open position
    order.open = open; // used by pending order for activation to open position
    order.barrier_price = barrier; // used by pending order for activation to open position
    order.seller_barrier_price = seller_barrier; // used by pending order for activation to open position
    order.buyer_barrier_price = buyer_barrier; // used by pending order for activation to open position
    order.barrier_up_price = barrier_up; // used by pending order for activation to open position
    order.barrier_down_price = barrier_down; // used by pending order for activation to open position

    var columns_map = getColumnMap(order);

    var orderUpdate = function (order) {
        order.expiry = expiry;
        order.long_expiry = long_expiry;
        order.open = open;
        order.barrier = barrier;
        order.seller_barrier = seller_barrier;
        order.buyer_barrier = buyer_barrier;
        order.barrier_up = barrier_up;
        order.barrier_down = barrier_down;
        order.strike = strike;
        order.seller_strike = seller_strike;
        order.buyer_strike = buyer_strike;
        order.strike_up = strike_up;
        order.strike_down = strike_down;
        order.close = close;
        order.time = time;
    };

    if (order.pending_order_price) {
        //activating pending order to open position by inserting order into open position table
        return sObj.db.insert(columns_map)
                .into("open_positions_options")
                .then(function (result) {
                    orderUpdate(order);
                    return order;
                });
    } else {
        //updating open position after countdown
        return sObj.db("open_positions_options")
                .where("ORDER_TICKET", order.order_ticket)
                .update({
                    TIME: time,
                    OPEN: open,
                    CLOSE: close,
                    STRIKE: strike,
                    STRIKE_UP: strike_up,
                    STRIKE_DOWN: strike_down,
                    BARRIER: barrier,
                    BARRIER_UP: barrier_up,
                    BARRIER_DOWN: barrier_down,
                    PRICE: price_percent,
                    PREMIUM: premium,
                    EXPIRY: expiry
                })
                .then(function (result) {
                    if (result > 0) {

                        orderUpdate(order);

                        //console.log("setupOptionsOpenPosition---- then ------");
                        //console.log(order);

                        return order;
                    } else {
                        return sObj.promise.reject(null);
                    }
                });
    }
};

var computeExpiry = function (expiry_value, expiry_unit) {
    var format = sObj.DEFAULT_DATETIME_FORMAT;
    var expiry = null;
    /*if (expiry_unit !== "ticks") {
        expiry = sObj.moment().utc().add(expiry_value, expiry_unit).format(format);
    } else {
        expiry = sObj.moment().utc().add(expiry_value, expiry_unit).format(format);
    }*/
    
    var longNow =new Date(sObj.now()).getTime();
    
    var milliSec = 0;
    
    if(expiry_unit === 'seconds'){
        milliSec = 1000 * expiry_value; 
    }else if(expiry_unit === 'minutes'){
        milliSec = 1000 * 60 * expiry_value;
    }else if(expiry_unit === 'hours'){
        milliSec = 1000 * 3600 * expiry_value;
    }else if(expiry_unit === 'days'){
        milliSec = 1000 * 3600 * 24 * expiry_value;
    }else{
        console.log('WARNING!!!  Unsupported expiry unit - '+expiry_unit);
        return '1900-01-01 00:00:00';
    }

    var longExpiry = longNow + milliSec;

    expiry = sObj.moment(longExpiry).format(format);
    
    return expiry;

};

var validateStopLossPips = function (stop_loss, direction) {
    direction = direction.toLowerCase();
    stop_loss = Math.abs(stop_loss);
    if (direction === "buy") {
        stop_loss = -stop_loss; // negate
    }
    return stop_loss;
};

var validateTakeProfitPips = function (take_profit, direction) {
    direction = direction.toLowerCase();
    take_profit = Math.abs(take_profit);
    if (direction === "sell") {
        take_profit = -take_profit; // negate
    }
    return take_profit;
};

/**
 * Set the pending order properties to the open position
 * 
 * Used by pending order for activation to open position.
 * @param {type} pending_order
 * @returns {getColumnMap.notifierAnonym$10|getColumnMap.notifierAnonym$9}
 */
var getColumnMap = function (pending_order) {

    if (pending_order.product_type === "spotfx") {
        return {
            LIVE: pending_order.live,
            SELLER_ID: pending_order.seller_id,
            SELLER_USERNAME: pending_order.seller_username,
            BUYER_ID: pending_order.buyer_id,
            BUYER_USERNAME: pending_order.buyer_username,
            ORDER_TICKET: pending_order.order_ticket,
            OPEN: pending_order.open,
            CLOSE: pending_order.close,
            DIRECTION: pending_order.direction,
            SIZE: pending_order.size,
            SYMBOL: pending_order.symbol,
            STOP_LOSS: pending_order.stop_loss_price,
            TAKE_PROFIT: pending_order.take_profit_price,
            TIME: pending_order.time

        };
    } else if (pending_order.product_type === "options") {
        return {
            LIVE: pending_order.live,
            SELLER_ID: pending_order.seller_id,
            SELLER_USERNAME: pending_order.seller_username,
            BUYER_ID: pending_order.buyer_id,
            BUYER_USERNAME: pending_order.buyer_username,
            ORDER_TICKET: pending_order.order_ticket,
            OPEN: pending_order.open,
            CLOSE: pending_order.close,
            PRODUCT: pending_order.product,
            SYMBOL: pending_order.symbol,
            STRIKE: pending_order.strike,
            STRIKE_UP: pending_order.strike_up,
            STRIKE_DOWN: pending_order.strike_down,
            BARRIER: pending_order.barrier_price,
            BARRIER_UP: pending_order.barrier_up_price,
            BARRIER_DOWN: pending_order.barrier_down_price,
            SIZE: pending_order.size,
            EXPIRY: pending_order.expiry,
            PRICE: pending_order.price,
            PREMIUM: pending_order.premium,
            TIME: pending_order.time
        };
    }
};

