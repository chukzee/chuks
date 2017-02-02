
var socketio = require('socket.io');
var notif = require('./notifier');
var fixClient;
var pricePipe;
var analy = require('./operations/analyzer');

var notifier = null;
var tradersIO = null;
var sObj = null;
var priceHistory = null;
var market = null;
var analyzer = null;

//Number of seconds the server wait for client authetication message before disconnecting the client
var AUTH_DISCONNECT_SECONDS = 10;//REMIND - EXPERIMENT TO KNOW APPROPRIATE NUMBER TO SET


module.exports = function (https_server, _sObj, _exchangePost, _market, _priceHistory, _emailer) {
    market = _market;
    var io = socketio(https_server);
    tradersIO = io.of("/traders"); //using traders namespace
    notifier = notif(tradersIO, _sObj, openTrades, pendingOrders, _emailer);
    analyzer = analy(_sObj);
    sObj = _sObj;
    priceHistory = _priceHistory;

    loadExistingOpenTrades();

    loadExistingPendingOrders();

    tradersIO.on('connection', connHandler);
    _priceHistory.setIO(tradersIO);

    if (_sObj.config.PRICE_DATASOURCE === _sObj.config.FIX_SERVER) {
        fixClient = require('./fix-client');
        fixClient.init(_sObj);
        fixClient.on("price_quote", onPriceQuote);
    } else if (_sObj.config.PRICE_DATASOURCE === _sObj.config.MT_CLIENT) {
        pricePipe = require('./price-stream-pipe');
        pricePipe.init(_sObj);
        pricePipe.on("price_quote", onPriceQuote);
    }

    _exchangePost.on("pending_order_sold", onPendingOrderSold);


    /*for (var nsp in io.nsps) {
     //console.dir('----------------------------------------------------------');
     //console.dir(io.nsps[nsp]);
     io.nsps[nsp].on('connect', function (socket) {
     console.log("connected: " + socket.id);
     delete io.nsps[nsp].connected[socket.id];
     });
     }*/

};

var AbstractOrders = function () {
    this.list = {};

    this.isExpired = function (comparedLongTime) {
        return new Date(sObj.now()).getTime() >= comparedLongTime; // yes sObj.now() - we use utc
    };
    //tranverse all orders
    this.tranverse = function (fn) {
        for (var sym in this.list) {
            var orders = this.get(sym);
            for (var i in orders) {
                var ord = orders[i];
                if (ord) {
                    fn(ord);
                }
            }
        }
    };
    this.get = function (symbol) {
        var orders = this.list[symbol];
        return orders ? orders : {};// if no order then return empty object
    };
    this.add = function (order) {
        if (!order.symbol) {
            return;
        }
        if (!order.order_ticket) {
            return;
        }

        if (!this.list[order.symbol]) {
            this.list[order.symbol] = {};
        }
        this.list[order.symbol][order.order_ticket] = order;

        //metrics go below
        sObj.metrics.incrementOrder();

        if (order.open) {
            sObj.metrics.incrementOpenOrder();
        }

        if (!order.open && order.pending_order_price) {
            sObj.metrics.incrementPendingOrder();
        }
    };
    this.remove = function (order) {
        if (!order.symbol) {
            return;
        }
        if (!order.order_ticket) {
            return;
        }

        if (!this.list[order.symbol] || !this.list[order.symbol][order.order_ticket]) {            
            return;
        }

        delete this.list[order.symbol][order.order_ticket]; //delete using delete operator


        //metrics go below
        sObj.metrics.decrementOrder();

        if (order.open) {
            sObj.metrics.decrementOpenOrder();
        }

        if (!order.open && order.pending_order_price) {
            sObj.metrics.decrementPendingOrder();
        }
    };
    this.getColumnMap = function (order) {

        if (order.product_type === "spotfx") {

            order.time = sObj.now();

            return {
                LIVE: order.live,
                SELLER_ID: order.seller_id,
                SELLER_USERNAME: order.seller_username,
                BUYER_ID: order.buyer_id,
                BUYER_USERNAME: order.buyer_username,
                ORDER_TICKET: order.order_ticket,
                DIRECTION: order.direction,
                SIZE: order.size,
                SYMBOL: order.symbol,
                OPEN: order.open,
                CLOSE: order.close,
                STOP_LOSS: order.stop_loss,
                TAKE_PROFIT: order.take_profit,
                SELLER_COMMISSION: order.seller_commission,
                BUYER_COMMISSION: order.buyer_commission,
                SELLER_PROFIT_AND_LOSS: order.seller_profit_and_loss,
                BUYER_PROFIT_AND_LOSS: order.buyer_profit_and_loss,
                SELLER_RESULT: order.seller_result,
                BUYER_RESULT: order.buyer_result,
                TIME: order.time

            };
        } else if (order.product_type === "options") {

            order.time = sObj.now();
            return {
                LIVE: order.live,
                SELLER_ID: order.seller_id,
                SELLER_USERNAME: order.seller_username,
                BUYER_ID: order.buyer_id,
                BUYER_USERNAME: order.buyer_username,
                ORDER_TICKET: order.order_ticket,
                PRODUCT: order.product,
                SYMBOL: order.symbol,
                OPEN: order.open,
                CLOSE: order.close,
                STRIKE: order.strike,
                STRIKE_UP: order.strike_up,
                STRIKE_DOWN: order.strike_down,
                BARRIER: order.barrier,
                BARRIER_UP: order.barrier_up,
                BARRIER_DOWN: order.barrier_down,
                SIZE: order.size,
                EXPIRY: order.expiry,
                PRICE: order.price,
                PREMIUM: order.premium,
                SELLER_COMMISSION: order.seller_commission,
                BUYER_COMMISSION: order.buyer_commission,
                SELLER_PROFIT_AND_LOSS: order.seller_profit_and_loss,
                BUYER_PROFIT_AND_LOSS: order.buyer_profit_and_loss,
                SELLER_RESULT: order.seller_result,
                BUYER_RESULT: order.buyer_result,
                TIME: order.time

            };
        }
    };

};

//Stores and controls open trades
var openTrades = new function () {

    AbstractOrders.call(this); //extend AbstractOrders

    this.WIN = "WIN"; // SELLER WINS AND BUYER LOSSES - PLEASE DO NOT CHANGE!
    this.LOSS = "LOSS"; // SELLER LOSSES AND BUYER WINS - PLEASE DO NOT CHANGE!
    this.BREAK_EVEN = "BREAK EVEN"; // NOT WINNER NO LOSSER - PLEASE DO NOT CHANGE!

    this.opponentResult = function (seller_result) {
        return seller_result !== this.BREAK_EVEN ?
                (seller_result === this.WIN ?
                        this.LOSS :
                        this.WIN) :
                this.BREAK_EVEN;
    };
    this.exchangersAccountBalances = function (order) {
        return sObj.db.select('ACCOUNT_BALANCE', 'EXCHANGE_ID')
                .whereIn('EXCHANGE_ID', [order.seller_id, order.buyer_id])
                .from('users')
                .then(function (rows) {
                    if (rows.length < 2) {
                        return sObj.promise.reject("UNEXPECTED SELECT LESS THEN 2!!!! order ticket - " + order.order_ticket);
                    }
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if (row.EXCHANGE_ID === order.seller_id) {
                            order.seller_account_balance = row.ACCOUNT_BALANCE;
                        } else if (row.EXCHANGE_ID === order.buyer_id) {
                            order.buyer_account_balance = row.ACCOUNT_BALANCE;
                        }
                    }
                    return order;//important! required in more than one places
                });

    };
    this.closeOrder = function (order, seller_result) {

        order.seller_result = seller_result;
        order.buyer_result = this.opponentResult(seller_result);

        order.seller_type = "SELLER";//important!
        order.buyer_type = "BUYER";//important!

        order = analyzer.anlyzeOrder(order);

        var columns_map = this.getColumnMap(order);
        var history_trades_table = "";
        var open_trdes_table = "";
        if (order.product_type === "options") {
            open_trdes_table = "open_positions_options";
            history_trades_table = "history_trades_options";
        } else if (order.product_type === "spotfx") {
            open_trdes_table = "open_positions_spotfx";
            history_trades_table = "history_trades_spotfx";
        }

        var me = this;
        order.is_closing = true;//mark as closing since we are going into asyn operation - we do not want this order to be access any more
        //start transaction
        sObj.db.transaction(function (trx) {
            //delete the open trade
            trx.delete()
                    .where("ORDER_TICKET", order.order_ticket)
                    .from(open_trdes_table)
                    .then(function (result) {

                        if (result < 1) {//this may occur if another worker in the cluster has already perform this operation

                            me.remove(order); //important! remove the order object from the list store even though no delete occurred since another cluster worker may have deleted it already

                            return sObj.promise.reject("NO DELETE OF OPEN POSTION!!!! order ticket - " + order.order_ticket + "\nNOTE: this is not a problem only if another worker in the cluster has already perform this operation otherwise check the cause!");
                        }

                        me.remove(order); //remove the order object from the list store

                        //insert the trade in history
                        return trx.insert(columns_map)
                                .into(history_trades_table)
                                .then(function (result) {

                                    //update the seller's account balance
                                    return trx.raw("UPDATE users "
                                            + " SET ACCOUNT_BALANCE = ACCOUNT_BALANCE + "
                                            + order.seller_profit_and_loss
                                            + " WHERE EXCHANGE_ID = '" + order.seller_id + "'")
                                            .then(function (result) {
                                                //update the buyer's account balance
                                                return trx.raw("UPDATE users "
                                                        + " SET ACCOUNT_BALANCE = ACCOUNT_BALANCE + "
                                                        + order.buyer_profit_and_loss
                                                        + " WHERE EXCHANGE_ID = '" + order.buyer_id + "'");

                                            });
                                });
                    })
                    .then(trx.commit)
                    .then(function () {
                        //get the seller's and buyer's account balances

                        return me.exchangersAccountBalances(order);
                    })
                    .then(function () {

                        notifier.notifyClosedTrade(order);

                    })
                    .catch(function (err) {
                        if (err) {
                            console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                        }
                        trx.rollback();
                    });

        });

    };
    this.checkSpotFxTrade = function (order, cprice) {

        if (order.direction === "BUY" && cprice >= order.take_profit) {

            order.close = order.take_profit; //add this - according to onyeka so as to avoid slippage
            this.closeOrder(order, this.WIN);

        } else if (order.direction === "BUY" && cprice <= order.stop_loss) {

            order.close = order.stop_loss; //add this - according to onyeka so as to avoid slippage
            this.closeOrder(order, this.LOSS);

        } else if (order.direction === "SELL" && cprice <= order.take_profit) {

            order.close = order.take_profit; //add this - according to onyeka so as to avoid slippage
            this.closeOrder(order, this.WIN);

        } else if (order.direction === "SELL" && cprice >= order.stop_loss) {

            order.close = order.stop_loss; //add this - according to onyeka so as to avoid slippage
            this.closeOrder(order, this.LOSS);

        }
    };
    this.checkOptionsTrade = function (order, cprice) {

        order.close = cprice;

        if (this.isExpired(order.long_expiry)) {

            //NOTE: product_plain is the product name without (ITM) (ATM)or  (OTM) indication
            if (order.product_plain === "DIGITAL CALL") {
                if (cprice > order.barrier) {
                    this.closeOrder(order, this.WIN);
                } else if (cprice < order.barrier) {
                    this.closeOrder(order, this.LOSS);
                } else {//equal
                    this.closeOrder(order, this.BREAK_EVEN);
                }
            } else if (order.product_plain === "DIGITAL PUT") {
                if (cprice < order.barrier) {
                    this.closeOrder(order, this.WIN);
                } else if (cprice > order.barrier) {
                    this.closeOrder(order, this.LOSS);
                } else {//equal
                    this.closeOrder(order, this.BREAK_EVEN);
                }
            } else if (order.product_plain === "ONE TOUCH") {
                this.closeOrder(order, this.LOSS);
            } else if (order.product_plain === "NO TOUCH") {
                this.closeOrder(order, this.WIN);
            } else if (order.product_plain === "DOUBLE ONE TOUCH") {
                this.closeOrder(order, this.LOSS);
            } else if (order.product_plain === "DOUBLE NO TOUCH") {
                this.closeOrder(order, this.WIN);
            } else if (order.product_plain === "RANGE IN") {
                if (cprice > order.barrier_down && cprice < order.barrier_up) {
                    this.closeOrder(order, this.WIN);
                } else if (cprice < order.barrier_down && cprice > order.barrier_up) {
                    this.closeOrder(order, this.LOSS);
                } else {//equal
                    this.closeOrder(order, this.BREAK_EVEN);
                }
            } else if (order.product_plain === "RANGE OUT") {
                if (cprice > order.barrier_down && cprice < order.barrier_up) {
                    this.closeOrder(order, this.LOSS);
                } else if (cprice < order.barrier_down && cprice > order.barrier_up) {
                    this.closeOrder(order, this.WIN);
                } else {//equal
                    this.closeOrder(order, this.BREAK_EVEN);
                }
            }

        } else {//not expired

            if (order.product_plain === "ONE TOUCH" && cprice === order.barrier) {
                this.closeOrder(order, this.WIN);
            } else if (order.product_plain === "NO TOUCH" && cprice === order.barrier) {
                this.closeOrder(order, this.LOSS);
            } else if (order.product_plain === "DOUBLE ONE TOUCH"
                    && (cprice === order.barrier_up || cprice === order.barrier_down)) {
                this.closeOrder(order, this.WIN);
            } else if (order.product_plain === "DOUBLE NO TOUCH"
                    && (cprice === order.barrier_up || cprice === order.barrier_down)) {
                this.closeOrder(order, this.LOSS);
            }
        }

    };

};


//Stores and controls pending orders
var pendingOrders = new function () {

    AbstractOrders.call(this); //extend AbstractOrders

    this.activateOrder = function (order) {

        this.deleteOrder(order, true)
                .then(function (result) {

                    notifier.effectOpenTrade(order);
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                    }
                });
    };
    /**
     * Cancel the pending order in the exchange room.
     * Usually a case where the price is hit before the exchange is bought and before its expiry
     * @param {type} order
     * @returns {undefined}
     */
    this.cancelExchangePendingOrder = function (order) {

        order.is_removing_pending_order = true;
        var me = this;
        var table = "";
        if (order.product_type === "options") {
            table = "exchange_options";
        } else if (order.product_type === "spotfx") {
            table = "exchange_spotfx";
        }
        return sObj.db(table)
                .where("ORDER_TICKET", order.order_ticket)
                .update({
                    CANCELLED: 1
                })
                .then(function (result) {
                    if (result < 1) {//this may occur if another worker in the cluster has already perform this operation
                        me.remove(order); //important! remove the order object from the list store even though no delete occurred since another cluster worker may have deleted it already
                        return sObj.promise.reject("NO DELETE OF PENDING ORDER FROM EXCHANGE ROOM !!!! order ticket - " + order.order_ticket + "\nNOTE: this is not a problem only if another worker in the cluster has already perform this operation otherwise check the cause!");
                    }

                    me.remove(order); //remove the order object from the list store 
                });
    };

    this.deleteOrder = function (order, is_activating) {
        order.is_removing_pending_order = true;
        var me = this;
        var pending_trades_table = "";
        var history_trades_table = "";
        if (order.product_type === "options") {
            pending_trades_table = "pending_positions_options";
            history_trades_table = "history_trades_options";
        } else if (order.product_type === "spotfx") {
            pending_trades_table = "pending_positions_spotfx";
            history_trades_table = "history_trades_spotfx";
        }

        return sObj.db.delete()
                .where("ORDER_TICKET", order.order_ticket)
                .from(pending_trades_table)
                .then(function (result) {
                    if (result < 1) {//this may occur if another worker in the cluster has already perform this operation
                        me.remove(order); //important! remove the order object from the list store even though no delete occurred since another cluster worker may have deleted it already
                        return sObj.promise.reject("NO DELETE OF PENDING ORDER!!!! order ticket - " + order.order_ticket + "\nNOTE: this is not a problem only if another worker in the cluster has already perform this operation otherwise check the cause!");
                    }

                    me.remove(order); //remove the order object from the list store
                    notifier.notifyPendingOrderDeleted(order);
                    if (!is_activating) {
                        var columns_map = me.getColumnMap(order);
                        //insert the trade in history
                        return sObj.db.insert(columns_map)
                                .into(history_trades_table)
                                .then(function (result) {

                                });
                    }
                });
    };

    this.isHitPendingOrderPrice = function (order, current_price, prev_price) {
        return (prev_price < order.pending_order_price && current_price >= order.pending_order_price)
                || (prev_price > order.pending_order_price && current_price <= order.pending_order_price);
    };

    this.checkPendingOrder = function (order, current_price, prev_price) {

        if (!prev_price) {
            return;//yes! important!
        }

        if (order.buyer_id) {

            //here the order is bought and no longer in exchange room
            if (this.isExpired(order.long_pending_order_expiry)) {

                this.deleteOrder(order, false)
                        .catch(function (err) {
                            if (err) {
                                console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                            }
                        });
            } else if (this.isHitPendingOrderPrice(order, current_price, prev_price)) {

                this.activateOrder(order);
            }
        } else {

            //here the order is not bought and still available (not expired) in exchange room
            if (!this.isExpired(order.long_pending_order_expiry)
                    && this.isHitPendingOrderPrice(order, current_price, prev_price)) {
                //here the price is hit before expiry so we will cancel the order    

                this.cancelExchangePendingOrder(order)
                        .catch(function (err) {
                            if (err) {
                                console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                            }
                        });
            }
        }

    };

};


var checkExpiredOptions = function () {

    //console.log("checkExpiredOptions"); //UNCOMENT TO OBSERVE CALL

    openTrades.tranverse(function (order) {
        if (order.product_type === "options") {
            openTrades.checkOptionsTrade(order);
        }
    });

};


var loadExistingPendingOrders = function () {

    console.log('Loading existing pending orders if any...');

    sObj.db.select()
            .from("pending_positions_spotfx")
            .then(function (result) {

                if (!result || result.length === 0) {
                    return;
                }

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    var order = {
                        live: row.LIVE,
                        seller_id: row.SELLER_ID,
                        seller_username: row.SELLER_USERNAME,
                        buyer_id: row.BUYER_ID,
                        buyer_username: row.BUYER_USERNAME,
                        order_ticket: row.ORDER_TICKET,
                        pending_order_price: row.PENDING_ORDER_PRICE,
                        pending_order_expiry: row.PENDING_ORDER_EXPIRY,
                        long_pending_order_expiry: new Date(row.PENDING_ORDER_EXPIRY).getTime(),
                        order: row.ORDER_TICKET,
                        direction: row.DIRECTION,
                        size: row.SIZE,
                        symbol: row.SYMBOL,
                        stop_loss: row.STOP_LOSS,
                        take_profit: row.TAKE_PROFIT,
                        countdown: row.COUNT_DOWN,
                        open: row.OPEN,
                        close: row.CLOSE,
                        time: row.TIME
                    };

                    //set product type
                    order.product_type = "spotfx";

                    //register the open position for price monitoring
                    pendingOrders.add(order);

                }

            })
            .then(function (result) {
                return sObj.db.select()
                        .from("pending_positions_options");
            })
            .then(function (result) {

                if (!result || result.length === 0) {
                    return;
                }

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    //COME TO VERIFY PROPERTIES OF order
                    var order = {
                        live: row.LIVE,
                        seller_id: row.SELLER_ID,
                        seller_username: row.SELLER_USERNAME,
                        buyer_id: row.BUYER_ID,
                        buyer_username: row.BUYER_USERNAME,
                        order_ticket: row.ORDER_TICKET,
                        order: row.ORDER_TICKET,
                        pending_order_price: row.PENDING_ORDER_PRICE,
                        pending_order_expiry: row.PENDING_ORDER_EXPIRY, //same
                        long_pending_order_expiry: new Date(row.PENDING_ORDER_EXPIRY).getTime(),
                        expiry_value: row.EXPIRY_VALUE,
                        expiry_unit: row.EXPIRY_UNIT,
                        product: row.PRODUCT,
                        product_plain: sObj.util.plainProductName(row.PRODUCT), //very important!!! - basically used when monitoring the  open options trade
                        symbol: row.SYMBOL,
                        strike: row.STRIKE,
                        strike_up: row.STRIKE_UP,
                        strike_down: row.STRIKE_DOWN,
                        barrier: row.BARRIER,
                        barrier_up: row.BARRIER_UP,
                        barrier_down: row.BARRIER_DOWN,
                        size: row.SIZE,
                        price: row.PRICE,
                        premium: row.PREMIUM,
                        countdown: row.COUNT_DOWN,
                        open: row.OPEN,
                        close: row.CLOSE,
                        time: row.TIME
                    };

                    //set product type
                    order.product_type = "options";

                    //register the open position for price monitoring
                    pendingOrders.add(order);

                }

            })
            .then(function (result) {
                return sObj.db.select()
                        .from("exchange_spotfx");
            })
            .then(function (result) {

                //exchange room spot fx

                if (!result || result.length === 0) {
                    return;
                }
                var server_now = sObj.now();
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];

                    if (row.CANCELLED === 1 || row.EXCHANGE_EXPIRY < server_now) {//come back
                        continue;
                    }

                    //COME BACK TO VERIFY PROPERTIES OF order
                    var order = {
                        live: row.LIVE,
                        cancelled: row.CANCELLED,
                        pending_order_price: row.PENDING_ORDER_PRICE,
                        exchange_expiry: row.EXCHANGE_EXPIRY,
                        long_exchange_expiry: new Date(row.EXCHANGE_EXPIRY).getTime(),
                        pending_order_expiry: row.PENDING_ORDER_PRICE ? row.EXCHANGE_EXPIRY : null,
                        long_pending_order_expiry: row.PENDING_ORDER_PRICE ? new Date(row.EXCHANGE_EXPIRY).getTime() : null,
                        seller_id: row.SELLER_ID,
                        seller_username: row.SELLER_USERNAME,
                        buyer_id: row.BUYER_ID,
                        buyer_username: row.BUYER_USERNAME,
                        order_ticket: row.ORDER_TICKET,
                        order: row.ORDER_TICKET,
                        direction: row.DIRECTION,
                        size: row.SIZE,
                        symbol: row.SYMBOL,
                        stop_loss: row.STOP_LOSS,
                        take_profit: row.TAKE_PROFIT,
                        countdown: row.COUNT_DOWN,
                        open: row.OPEN,
                        close: row.CLOSE,
                        time: row.TIME
                    };

                    //set product type
                    order.product_type = "spotfx";

                    //register the open position for price monitoring
                    pendingOrders.add(order);

                }

            })
            .then(function (result) {
                return sObj.db.select()
                        .from("exchange_options");
            })
            .then(function (result) {

                //exchange room options

                if (!result || result.length === 0) {
                    return;
                }

                var server_now = sObj.now();

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    if (row.CANCELLED === 1 || row.EXCHANGE_EXPIRY < server_now) {//come back
                        continue;
                    }

                    var order = {
                        live: row.LIVE,
                        cancelled: row.CANCELLED,
                        pending_order_price: row.PENDING_ORDER_PRICE,
                        exchange_expiry: row.EXCHANGE_EXPIRY,
                        long_exchange_expiry: new Date(row.EXCHANGE_EXPIRY).getTime(),
                        pending_order_expiry: row.PENDING_ORDER_PRICE ? row.EXCHANGE_EXPIRY : null,
                        long_pending_order_expiry: row.PENDING_ORDER_PRICE ? new Date(row.EXCHANGE_EXPIRY).getTime() : null,
                        seller_id: row.SELLER_ID,
                        seller_username: row.SELLER_USERNAME,
                        buyer_id: row.BUYER_ID,
                        buyer_username: row.BUYER_USERNAME,
                        order_ticket: row.ORDER_TICKET,
                        order: row.ORDER_TICKET,
                        product: row.PRODUCT,
                        product_plain: sObj.util.plainProductName(row.PRODUCT), //very important!!! - basically used when monitoring the  open options trade
                        symbol: row.SYMBOL,
                        strike: row.STRIKE,
                        strike_up: row.STRIKE_UP,
                        strike_down: row.STRIKE_DOWN,
                        barrier: row.BARRIER,
                        barrier_up: row.BARRIER_UP,
                        barrier_down: row.BARRIER_DOWN,
                        size: row.SIZE,
                        expiry_unit: row.EXPIRY_UNIT,
                        expiry_value: row.EXPIRY_VALUE,
                        price: row.PRICE,
                        premium: row.PREMIUM,
                        countdown: row.COUNT_DOWN,
                        open: row.OPEN,
                        close: row.CLOSE,
                        time: row.TIME
                    };

                    //set product type
                    order.product_type = "options";

                    //register the open position for price monitoring
                    pendingOrders.add(order);

                }


            })
            .catch(function (err) {
                if (err) {
                    console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                }
            });


};

var loadExistingOpenTrades = function () {

    console.log('Loading existing open positions if any...');
    var abstractOrders = new AbstractOrders();

    var registerCountdown = function (order) {
        var expirySeconds = (order.countdown_expiry - new Date(sObj.now()).getTime()) / 1000;
        sObj.executor.queue(
                {
                    fn: notifier.effectOpenTrade, //after countdown
                    args: order,
                    value: expirySeconds,
                    unit: sObj.executor.SECONDS,
                    name: "countdown", //Do not change! Used in many places
                    id: sObj.util.countdownID(order.order_ticket)
                });
    };

    sObj.db.select()
            .from("open_positions_spotfx")
            .then(function (result) {

                if (result.length === 0) {
                    return;
                }

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    var order = {
                        live: row.LIVE,
                        seller_id: row.SELLER_ID,
                        seller_username: row.SELLER_USERNAME,
                        buyer_id: row.BUYER_ID,
                        buyer_username: row.BUYER_USERNAME,
                        order_ticket: row.ORDER_TICKET,
                        order: row.ORDER_TICKET,
                        direction: row.DIRECTION,
                        size: row.SIZE,
                        symbol: row.SYMBOL,
                        stop_loss: row.STOP_LOSS,
                        take_profit: row.TAKE_PROFIT,
                        countdown: row.COUNT_DOWN,
                        countdown_expiry: new Date(row.COUNT_DOWN).getTime(),
                        open: row.OPEN,
                        close: row.CLOSE,
                        time: row.TIME
                    };

                    //set product type
                    order.product_type = "spotfx";

                    //set the pip value - important!
                    order.pip_value = sObj.pipValue(order.symbol);

                    if (!order.pip_value) {//this can be because the symbol is not supported!
                        continue;
                    }

                    if (!order.open) {
                        if (!abstractOrders.isExpired(order.countdown_expiry)) {
                            registerCountdown(order);
                        } else {
                            //close the trade for beak even
                            openTrades.closeOrder(order, openTrades.BREAK_EVEN);
                        }

                        continue;
                    }

                    order.sl = Math.abs(order.open - order.stop_loss) / pairPoints(order.symbol);//important! stop loss size - positive value
                    order.tp = Math.abs(order.open - order.take_profit) / pairPoints(order.symbol);//important! take profit size - positive value also - take note                    

                    //register the open position for price monitoring
                    openTrades.add(order);

                }

            })
            .then(function (result) {
                return sObj.db.select()
                        .from("open_positions_options");
            })
            .then(function (result) {

                if (!result || result.length === 0) {
                    return;
                }

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    var order = {
                        live: row.LIVE,
                        seller_id: row.SELLER_ID,
                        seller_username: row.SELLER_USERNAME,
                        buyer_id: row.BUYER_ID,
                        buyer_username: row.BUYER_USERNAME,
                        order_ticket: row.ORDER_TICKET,
                        order: row.ORDER_TICKET,
                        product: row.PRODUCT,
                        product_plain: sObj.util.plainProductName(row.PRODUCT), //very important!!! - basically used when monitoring the  open options trade
                        symbol: row.SYMBOL,
                        strike: row.STRIKE,
                        strike_up: row.STRIKE_UP,
                        strike_down: row.STRIKE_DOWN,
                        barrier: row.BARRIER,
                        barrier_up: row.BARRIER_UP,
                        barrier_down: row.BARRIER_DOWN,
                        size: row.SIZE,
                        expiry: row.EXPIRY,
                        long_expiry: new Date(row.EXPIRY).getTime(),
                        price: row.PRICE,
                        premium: row.PREMIUM,
                        countdown: row.COUNT_DOWN,
                        countdown_expiry: new Date(row.COUNT_DOWN).getTime(),
                        open: row.OPEN,
                        close: row.CLOSE,
                        time: row.TIME
                    };


                    //set product type
                    order.product_type = "options";

                    //set the pip value - important!
                    order.pip_value = sObj.pipValue(order.symbol);

                    if (!order.pip_value) {//this can be because the symbol is not supported!
                        continue;
                    }

                    if (!order.open) {
                        if (!abstractOrders.isExpired(order.countdown_expiry)) {
                            registerCountdown(order);
                        } else {
                            //close the trade for beak even
                            openTrades.closeOrder(order, openTrades.BREAK_EVEN);
                        }

                        continue;
                    }


                    //register the open position for price monitoring
                    openTrades.add(order);

                }

            })
            .catch(function (err) {
                if (err) {
                    console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                }
            });


};

var pairPoints = function (symbol) {
    //check for JPY pair which are three digits.
    //check the JPY index in the symbol
    var len = symbol.length;
    var sIndex = 0;//e.g JPY/AUD - where JPY is the base currency
    var eIndex = len - 3;//e.g USD/JPY, USDJPY - where JPY is not the base currency

    var point = 0.0001;
    var indexOfJPY = symbol.indexOf("JPY");
    if (indexOfJPY === sIndex || indexOfJPY === eIndex) {
        point = 0.01;
    }

    return point;
};

var connHandler = function (socket) {

    sObj.metrics.incrementConnectedUsers();

    console.log('a user connected');
    socket.isTraderAuth = false;
    //emit authentication event to the client
    send(socket, "authenticate", null);
    deferDisconnet(socket);

    socket.on('disconnect', function () {

        sObj.metrics.decrementConnectedUsers();

        console.log('user disconnected');

    });

    socket.on('authenticate', function (token) {
        authenticate(token, socket, onAccessGranted);
    });

    socket.on('price_quote', function (msg) {
        //console.log('message : ' + msg);
        //io.emit('chat message event', msg);
    });
};

var authenticate = function (token, socket, callback) {

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, this.secret, function (err, decoded) {
            if (err) {

                sendAuthFail(socket, sObj.MSG_INVALID_AUTH_TOKEN);
                deferDisconnet(socket);
                return;
            } else {
                var username = typeof decoded === "object" ?
                        decoded.username//may we store the username in an object. using 'object' payload
                        : decoded;//ok here we used 'string' payload

                sObj.redis.get("user:" + username)
                        .then(function (result) {
                            if (!result) {
                                sendAuthFail(socket, "Session not available!");
                                deferDisconnet(socket);
                                return;
                            }
                            var user = JSON.parse(result);
                            socket.isTraderAuth = true;
                            sendAuthSuccess(socket, "AUTH_SUCCESS");//important!
                            callback(socket, user);//execute callback
                        })
                        .catch(function (err) {
                            sendError(socket, sObj.MSG_SOMETHING_WENT_WRONG);
                            deferDisconnet(socket);
                            //TODO: DO NOT LOG TO CONSOLE IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE REASON
                            console.log("could not cache user info in redis: ");
                            console.log(err);
                        });

            }
        });

    } else {

        // if there is no token
        // return an error        
        return sendAuthFail(socket, sObj.MSG_NO_AUTH_TOKEN);
    }
};

var onAccessGranted = function (socket, user) {
    //save the socket id in redis
    sObj.redis.set("socket_id:" + user.username, socket.id)
            .then(function (result) {
                //TODO
            })
            .catch(function (err) {
                //if some went wrong then close the socket
                socket.disconnect(true);//set to true to close the underlying connection
            });
};

var deferDisconnet = function (socket) {
    sObj.executor.queue(function (sock) {
        if (!sock.isTraderAuth) {
            sock.disconnect(true);//set to true to close the underlying connection                                    
            console.log("disconnected by defer");
        }
    }, socket, AUTH_DISCONNECT_SECONDS, sObj.executor.SECONDS);
};

/**
 * called when a new price is received from the FIX server or our price simulator server
 * 
 * NOTE-  expected price format is as shown below so upon receiving
 *  from a source such as FIX server, the price obj of the below format
 *  should be created for compartibility
 *  
 *  properties of price object - some are optional
 *  
 *  - symbol (important)
 *  - market_type (important)
 *  - time (important) - time we received the price feed
 *  - price (important! represent the current price)
 *  - time (may be important -  this will be verified for its importance later - TOODO!!! )
 *  - bid (optional)
 *  - ask (optional)
 *  - open (optional)
 *  - close (optional) - this should also be same as price (ie current price)
 *  - high (optional)
 *  - low (optional)
 *  - time_frame (optional)
 *  
 *  -
 * @param {type} priceObj
 * @returns {undefined}
 */
var onPriceQuote = function (priceObj) {
    //NOTE: check for market close should not begin with this function but below
    //since the quote streamed from the remote demo server is still on even when market is closed.
    var prevQuote = market.getQuote(priceObj.symbol);
    var prev_price = prevQuote ? prevQuote.price : null;
    market.setQuote(priceObj.symbol, priceObj);//set the current quote of the market

    //check for market close here. important !
    if (sObj.config.HONOUR_MARKET_CLOSED && sObj.isMarketClosed) {
        market.saveLastQuotes();//save last qoute only if not yet saved.
        return;//wait till market opens
    }

    //we will check if any order is due for closing
    var open_orders = openTrades.get(priceObj.symbol); // if no order then an empty object is returned
    for (var i in open_orders) {
        var order = open_orders[i];
        if (order.is_closing || priceObj.symbol !== order.symbol) {
            continue;
        }
        if (order.product_type === "spotfx") {
            openTrades.checkSpotFxTrade(order, priceObj.price);
        } else if (order.product_type === "options") {
            openTrades.checkOptionsTrade(order, priceObj.price);
        }
    }

    //we will check if any pending order is due for activation or cancellation
    var pending_orders = pendingOrders.get(priceObj.symbol); // if no order then an empty object is returned

    for (var i in pending_orders) {
        var order = pending_orders[i];

        if (order.is_removing_pending_order || priceObj.symbol !== order.symbol) {
            return;
        }
        pendingOrders.checkPendingOrder(order, priceObj.price, prev_price);
    }


    //broadcast the price quote
    tradersIO.emit('price_quote', priceObj);

    //store the quote 
    priceHistory.storeQuote(priceObj);
};

var onPendingOrderSold = function (order) {

    pendingOrders.add(order);//register the order for monitoring!
};

var send = function (socket, event_name, respMsg) {
    var sock = socket;
    if (typeof socket === "string") {//if string we shall assume it to be the socket id
        sock = tradersIO.connected[socket];
    }
    sock.emit(event_name, respMsg, logError);
};

var sendIgnore = function (socket, respMsg) {
    return send(socket, "ignore", respMsg);
};

var sendAuthFail = function (socket, respMsg) {
    return send(socket, "auth_fail", respMsg);
};

var sendAuthSuccess = function (socket, respMsg) {
    return send(socket, "auth_success", respMsg);
};

var sendError = function (socket, respMsg) {
    return send(socket, "error", respMsg);
};

var sendSuccess = function (socket, respMsg) {
    return send(socket, "success", respMsg);
};

function logError(err) {
    if (hasValue(err)) {
        console.error(err);
    }
}

function hasValue(param) {
    return typeof param !== "undefined" && param !== null;
}

