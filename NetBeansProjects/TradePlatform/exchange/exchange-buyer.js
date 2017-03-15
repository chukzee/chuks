/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var analy = require('../operations/analyzer');

var analyzer = null;

var exchangeBuyer = function (sObj) {

    analyzer = analy(sObj);

    this.setMarket = function (mkt) {
        this.market = mkt;
    };

    this.buyOptions = function (user, input, res) {
        buyProduct("options", user.exchangeId, user.username, input.order_ticket, res);
    };


    this.buySpotFx = function (user, input, res) {
        buyProduct("spotfx", user.exchangeId, user.username, input.order_ticket, res);
    };

    var buyProduct = function (mkt_type, user_exchange_id, username, order_ticket, res) {
        // "exchange_spotfx", "open_positions_spotfx",
        //"exchange_options", "open_positions_options",
        var ex_table, open_table, pending_table, pending_order_price;

        if (mkt_type === "spotfx") {
            ex_table = "exchange_spotfx";
            open_table = "open_positions_spotfx";
        } else if (mkt_type === "options") {
            ex_table = "exchange_options";
            open_table = "open_positions_options";
        }

        var no_update = "no update";
        var not_found = "not found";
        var columns_map = null;
        sObj.db(ex_table)
                .select()
                .whereRaw("BINARY ORDER_TICKET = '" + order_ticket + "'")//order ticket as sent from the exchange room in the client side
                .andWhereRaw("BINARY SELLER_ID != '" + user_exchange_id + "'")//seller cannot be the buyer at the same time - he cannot buy an order he placed for selling
                .andWhere("DEL_BY_SELLER_ID", "is", null)//Check if is marked deleted
                .andWhere("CANCELLED", 0)//Check if is cancelled - usually a case where the price is hit before the exchange is bought before expiry
                .andWhere("EXCHANGE_EXPIRY", ">", sObj.now())//Check if exchange has expired
                .then(function (rows) {
                    if (rows.length < 1) {
                        return sObj.promise.reject(not_found);
                    }
                    var row = rows[0];
                    columns_map = getColumnMap(mkt_type, row, user_exchange_id, username);
                    pending_order_price = row.PENDING_ORDER_PRICE;
                    var is_pending_order = pending_order_price && !isNaN(pending_order_price);
                    
                    if (is_pending_order) {
                        
                        delete columns_map.EXPIRY;//important! delete to avoid 'Unknow column' Sql error
                        columns_map.PENDING_ORDER_PRICE = pending_order_price;
                        columns_map.PENDING_ORDER_EXPIRY = row.EXCHANGE_EXPIRY;                        
                        
                        var barrier = sObj.util.addPipsPrice(row.SYMBOL, pending_order_price, row.STRIKE);
                        var barrier_up = sObj.util.addPipsPrice(row.SYMBOL, pending_order_price, row.STRIKE_UP);
                        var barrier_down = sObj.util.addPipsPrice(row.SYMBOL, pending_order_price, row.STRIKE_DOWN);
                        

                        if (mkt_type === "spotfx") {
                            pending_table = "pending_positions_spotfx";
                        } else if (mkt_type === "options") {
                            pending_table = "pending_positions_options";                            
                            columns_map.EXPIRY_UNIT = row.EXPIRY_UNIT;
                            columns_map.EXPIRY_VALUE = row.EXPIRY_VALUE;
							columns_map.BARRIER = barrier;
							columns_map.BARRIER_UP = barrier_up;
							columns_map.BARRIER_DOWN = barrier_down;
                        }
                    }
                    var obj = {
                        product_type: mkt_type,
                        pip_value: sObj.pipValue(columns_map.SYMBOL),
                        size: columns_map.SIZE,
                        price: columns_map.PRICE,
                        premium: columns_map.PREMIUM,
                        stop_loss: columns_map.STOP_LOSS,
                        take_profit: columns_map.TAKE_PROFIT,
                        exchange_id: columns_map.BUYER_ID,
                        exchanger_type: "BUYER"
                    };

                    analyzer.checkSufficientFund(obj)
                            .then(function (obj) {
                                if (!obj.isValid) {
                                    sObj.sendError(res, 'Insufficient fund!');
                                    return;
                                }

                                columns_map.SELLER_LOSABLE_AMT = obj.seller_losable_amt;
                                columns_map.BUYER_LOSABLE_AMT = obj.buyer_losable_amt;

                                sObj.db.transaction(function (trx) {

                                    sObj.db(ex_table)
                                            .transacting(trx)
                                            .whereRaw("BINARY ORDER_TICKET = '" + order_ticket + "'")//order ticket as sent from the exchange room
                                            .andWhere("BUYER_ID", "is", null)
                                            .andWhereRaw("BINARY SELLER_ID != '" + user_exchange_id + "'")//seller cannot be the buyer at the same time - he cannot buy an order he placed for selling
                                            .andWhere("DEL_BY_SELLER_ID", "is", null)//Check if is marked deleted
                                            .andWhere("CANCELLED", 0)//Check if is cancelled - usually a case where the price is hit before the exchange is bought before expiry
                                            .andWhere("EXCHANGE_EXPIRY", ">", sObj.now())//Check if exchange has expired
                                            .update({
                                                BUYER_ID: user_exchange_id,
                                                BUYER_USERNAME: username
                                            })
                                            .then(function (result) {
                                                if (result < 1) {
                                                    return sObj.promise.reject(no_update);
                                                }
                                                if (is_pending_order) {
                                                    return trx.insert(columns_map)
                                                            .into(pending_table);
                                                } else {
                                                    return trx.insert(columns_map)
                                                            .into(open_table);
                                                }

                                            })
                                            .then(function (result) {
                                                var order = {
                                                    method: row.METHOD,
                                                    time: sObj.now(), //time the exchange was bought
                                                    product: row.PRODUCT, //very important!!! - basically used when monitoring the  open options trade
                                                    product_sold: row.PRODUCT, //same as product above ! just for emphasis
                                                    product_plain: sObj.util.plainProductName(row.PRODUCT), //very important!!! - basically used when monitoring the  open options trade
                                                    seller_product: row.PRODUCT, //important!
                                                    buyer_product: sObj.util.reverseProduct(row.PRODUCT), //important!
                                                    direction: row.DIRECTION, //very important!!! - basically used when monitoring the  open spot fx trade
                                                    seller_direction: row.DIRECTION, //important!
                                                    buyer_direction: sObj.util.reverseDirection(row.DIRECTION), //important!
                                                    order_ticket: order_ticket,
                                                    order: order_ticket, //important! yes, same as order_ticket for purpose of consistency
                                                    product_type: mkt_type, //whether options or spot forex
                                                    buyer_id: user_exchange_id, //Important!
                                                    buyer_username: username, //Important!
                                                    pending_order_price: row.PENDING_ORDER_PRICE, //importany! in the case of pending order
                                                    exchange_expiry: row.EXCHANGE_EXPIRY,
                                                    pending_order_expiry: row.EXCHANGE_EXPIRY,
                                                    long_pending_order_expiry: new Date(row.EXCHANGE_EXPIRY).getTime(), //important! required mainly for pending order expiration even after being bought. if the price is hit before the expiry the order is cancelled.
                                                    symbol: row.SYMBOL,
                                                    size: row.SIZE, //important!
                                                    price_percent: row.PRICE, //for options
                                                    price: row.PRICE, //for options!same as price_percent for purpose of consistency
                                                    premium: row.PREMIUM,
                                                    live: row.LIVE, //important!
                                                    seller_id: row.SELLER_ID, //Important!
                                                    seller_username: row.SELLER_USERNAME, //Important!
                                                    expiry_value: row.EXPIRY_VALUE, //for options
                                                    expiry_unit: row.EXPIRY_UNIT, // for options
                                                    strike: row.STRIKE, // for options
                                                    seller_strike: row.STRIKE, // for options
                                                    buyer__strike: row.STRIKE ? (-1 * row.STRIKE) : row.STRIKE, // for options
                                                    strike_up: row.STRIKE_UP, // for options
                                                    strike_down: row.STRIKE_DOWN, // for options
                                                    stop_loss: row.STOP_LOSS, // for spotfx
                                                    seller_stop_loss: row.STOP_LOSS, // for spotfx
                                                    buyer_stop_loss: row.TAKE_PROFIT, //opposite of seller -  for spotfx 
                                                    take_profit: row.TAKE_PROFIT, // for spotfx
                                                    seller_take_profit: row.TAKE_PROFIT, // for spotfx
                                                    buyer_take_profit: row.STOP_LOSS //opposite of seller -  for spotfx
                                                };
                                                
                                                if (is_pending_order) {
                                                    order.barrier = barrier;
                                                    order.barrier_up = barrier_up;
                                                    order.barrier_down = barrier_down;
                                                }
                                                
                                                sObj.redis.publish(sObj.EXCHAGE_BOUGTH, JSON.stringify(order));
                                                return true;
                                            })
                                            .then(function (result) {
                                                trx.commit();
                                                sObj.sendSuccess(res, "Exchange bought successfully!");
                                                return true;
                                            })
                                            .catch(function (err) {
                                                trx.rollback();
                                                if (err === no_update) {
                                                    //happens when more than one trader attempt to buy same order
                                                    //at same time.
                                                    sObj.sendError(res, "ORDER NOT AVAILABLE");
                                                } else {
                                                    console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                                                    sObj.sendError(res, 'Could not buy product.');
                                                }

                                            });

                                });

                            })
                            .catch(function (err) {
                                if (err) {
                                    console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                                }
                                sObj.sendError(res, 'Could not buy product.');
                            });


                })
                .catch(function (err) {
                    if (err === not_found) {
                        //Can happen when a seller tries to buy his own order which is illegal
                        sObj.sendError(res, "CONDITION NOT MET");
                    } else {
                        console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                        sObj.sendError(res, 'Could not buy product.');
                    }
                });

    };

    var getColumnMap = function (mkt_type, row, buyer_id, buyer_username) {

        if (mkt_type === "spotfx") {
            return {
                LIVE: row.LIVE,
                SELLER_ID: row.SELLER_ID,
                SELLER_USERNAME: row.SELLER_USERNAME,
                BUYER_ID: buyer_id,
                BUYER_USERNAME: buyer_username,
                ORDER_TICKET: row.ORDER_TICKET,
                DIRECTION: row.DIRECTION,
                SIZE: row.SIZE,
                SYMBOL: row.SYMBOL,
                STOP_LOSS: row.STOP_LOSS,
                TAKE_PROFIT: row.TAKE_PROFIT,
                COUNT_DOWN : row.EXCHANGE_EXPIRY,
                TIME: sObj.now()
            };
        } else if (mkt_type === "options") {
            return {
                LIVE: row.LIVE,
                SELLER_ID: row.SELLER_ID,
                SELLER_USERNAME: row.SELLER_USERNAME,
                BUYER_ID: buyer_id,
                BUYER_USERNAME: buyer_username,
                ORDER_TICKET: row.ORDER_TICKET,
                PRODUCT: row.PRODUCT,
                SYMBOL: row.SYMBOL,
                STRIKE: row.STRIKE,
                STRIKE_UP: row.STRIKE_UP,
                STRIKE_DOWN: row.STRIKE_DOWN,
                SIZE: row.SIZE,
                EXPIRY: row.EXPIRY,
                PRICE: row.PRICE,
                PREMIUM: row.PREMIUM,
                COUNT_DOWN : row.EXCHANGE_EXPIRY,
                TIME: sObj.now()
            };
        }
    };


    this.refreshCountdown = function (user, input, res) {
        try {

            var order_tickets = JSON.parse(input.order_tickets);
            var countdown_orders = [];
            for (var i = 0; i < order_tickets.length; i++) {

                sObj.executor.getByID(sObj.util.countdownID(order_tickets[i]), function (name, id, args, value, unit) {
                    
                    var countdown_remaining = (new Date(args.exchange_expiry).getTime() - new Date(sObj.now()).getTime()) / 1000;
                    
                    console.log("value " + value);
                    console.log("countdown_remaining " + countdown_remaining);
                    
                    countdown_orders.push({
                        product_type: args.product_type,
                        order_ticket: args.order_ticket,
                        countdown_remaining: countdown_remaining
                    });
                });
            }
            sObj.sendSuccess(res, "Success", {countdown_orders: countdown_orders});
        } catch (e) {
            res.end();
            console.error(e);
        }

    };

    return this;
};

module.exports = exchangeBuyer;