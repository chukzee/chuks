/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var analy = require('../operations/analyzer');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var analyzer = null;
var sObj = null;
var market = null;
var xPost = null;

var ExchangePost = function () {

    events.EventEmitter.call(this);

    this.invalid_buyer_action_msg = 'Invalid input - could not create BUYER action';
    this.invalid_strike_msg = 'Invalid input - incorrect strike';

    this.init = function (_sObj, _market) {
        sObj = _sObj;
        market = _market;
        analyzer = analy(sObj);
    };

    this.spotForex = function (user, input, res) {
        input.product = "spot forex";
        if (!validateSpotFxInput(input, res)) {
            return;
        }

        if (!setBuyerAction(input)) {
            sObj.sendError(res, this.invalid_buyer_action_msg);
            return;
        }
        var column_map = {
            LIVE: user.live,
            SELLER_ID: user.exchangeId,
            SELLER_USERNAME: user.username,
            //BUYER_ID: null, //NIL anyway
            ORDER_TICKET: sObj.getUniqueOrderTicket(),
            PENDING_ORDER_PRICE: input.pending_order_price,
            DIRECTION: input.direction,
            BUYER_ACTION: input.buyer_action,
            SYMBOL: input.symbol,
            STOP_LOSS: input.stop_loss, //in pips
            TAKE_PROFIT: input.take_profit, //in pinps
            SIZE: input.size,
            TIME: sObj.now(),
            EXCHANGE_EXPIRY: input.exchange_expiry,
            METHOD: input.method
        };
        postExchange(res, 'exchange_spotfx', column_map, 'spotfx');
    };

    this.digitalCall = function (user, input, res) {
        input.product = "digital call";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.digitalPut = function (user, input, res) {
        input.product = "digital put";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.noTouch = function (user, input, res) {
        input.product = "no touch";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.oneTouch = function (user, input, res) {
        input.product = "one touch";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.doubleNoTouch = function (user, input, res) {
        input.product = "double no touch";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.doubleOneTouch = function (user, input, res) {
        input.product = "double one touch";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.rangeIn = function (user, input, res) {
        input.product = "range in";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');
    };

    this.rangeOut = function (user, input, res) {
        input.product = "range out";
        if (!validateOptionsInput(input, res)) {
            return;
        }
        if (!modifyInput(input)) {
            return sObj.sendError(res, "Invalid input!");
        }
        var column_map = optionsColumnMap(user, input);
        postExchange(res, 'exchange_options', column_map, 'options');

    };

    var checkExchangeExpiry = function (input, res) {

        input.exchange_expiry = sObj.date() + " " + input.exchange_expiry;
        var longExpiry = new Date(input.exchange_expiry).getTime();
        var lonNow = new Date(sObj.now()).getTime();
        var toleranceSeconds = 30 * 1000;

        if (isNaN(longExpiry)) {
            sObj.sendError(res, "Invalid exchange expiry - possibly invalid format");
            return false;
        }

        if (longExpiry < lonNow + toleranceSeconds) {
            sObj.sendError(res, "Invalid exchange expiry - too close to or ealier than current server time!");
            return false;
        }

        return true;
    };

    var validateOptionsInput = function (input, res) {

        if (!checkExchangeExpiry(input, res)) {
            return false;
        }

        if (input.price < 20) {
            sObj.sendError(res, "Invalid price - too low!");
            return false;
        }

        if (input.price > 100) {
            sObj.sendError(res, "Invalid price - too high!");
            return false;
        }

        if (input.premium < 20) {
            sObj.sendError(res, "Invalid premium - too low!");
            return false;
        }

        if (input.premium > 100) {
            sObj.sendError(res, "Invalid premium - too high!");
            return false;
        }

        if(!validatePendingOrder(input, res)){
            return false;
        }

        //more validation may go here

        return true;
    };

    var validateSpotFxInput = function (input, res) {

        if (!checkExchangeExpiry(input, res)) {
            return false;
        }

        var attr = sObj.config.SYMBOLS_ATTR[input.symbol];

        if (!attr) {
            sObj.sendError(res, input.symbol + " is not available!");
            return false;
        }

        var min_pl = attr.min_pl;
        var max_pl = attr.max_pl;

        if (input.stop_loss < min_pl) {
            sObj.sendError(res, "Invalid stop loss - too low!");
            return false;
        }


        if (input.stop_loss > max_pl) {
            sObj.sendError(res, "Invalid stop loss - too high!");
            return false;
        }

        if (input.take_profit < min_pl) {
            sObj.sendError(res, "Invalid take profit - too low!");
            return false;
        }

        if (input.take_profit > max_pl) {
            sObj.sendError(res, "Invalid take profit - too high!");
            return false;
        }

        if(!validatePendingOrder(input, res)){
            return false;
        }

        //more validation may go here

        return true;
    };

    var validatePendingOrder = function(input, res){

        console.log('input.method  '+input.method);
        console.log('input.pending_order_price  '+input.pending_order_price);

        if (sObj.util.isPriceMethod(input.method) 
                && (isNaN(input.pending_order_price) || !input.pending_order_price)) {
            sObj.sendError(res, "Invalid pending order price!");
            return false;
        }else if (sObj.util.isTimeMethod(input.method)) {
            input.pending_order_price = 0;
        }


        var MAX_PIPS_AWAY = 100;
        var quote = market.getQuote(input.symbol);
        var pips_away = sObj.util.modPips(input.symbol, quote.price, input.pending_order_price);
        if (input.pending_order_price && pips_away > MAX_PIPS_AWAY) {
            sObj.sendError(res, "Invalid pending order price - too far away from current market price!" +
                    "<br/>Must not be greater than " + MAX_PIPS_AWAY + " pips away.");
            return false;
        } 
        
        return true;
    };

    var modifyInput = function (input) {
        return setBuyerAction(input)
                && setStrike(input);
    };

    var postExchange = function (res, table, column_map, type) {
        var obj = {
            product_type: type,
            size: column_map.SIZE,
            pip_value: sObj.pipValue(column_map.SYMBOL),
            price: column_map.PRICE,
            premium: column_map.PREMIUM,
            stop_loss: column_map.STOP_LOSS,
            take_profit: column_map.TAKE_PROFIT,
            exchange_id: column_map.SELLER_ID,
            exchanger_type: "SELLER"
        };

        analyzer.checkSufficientFund(obj)
                .then(function (obj) {

                    if (!obj.isValid) {

                        sObj.sendError(res, 'Insufficient fund!');
                        return;
                    }
                    column_map.SELLER_LOSABLE_AMT = obj.seller_losable_amt;
                    column_map.BUYER_LOSABLE_AMT = obj.buyer_losable_amt;

                    sObj.db.insert(column_map)
                            .into(table)
                            .then(function (value) {
                                sObj.sendSuccess(res, 'Sent and stored successfully.');
                                var msg = {
                                    seller_id: column_map.SELLER_ID,
                                    order_ticket: column_map.ORDER_TICKET,
                                    order: column_map.ORDER_TICKET,//same
                                    exchange_expiry:column_map.EXCHANGE_EXPIRY,
                                    type: type
                                };
                                sObj.redis.publish(sObj.EXCHAGE_SOLD, JSON.stringify(msg));

                                if (column_map.PENDING_ORDER_PRICE) {
                                    var order = {
                                        //basic order properties enough for monitoring the pending order in the exchange room 
                                        live: column_map.LIVE,
                                        symbol: column_map.SYMBOL,
                                        product_type: type,
                                        seller_id: column_map.SELLER_ID,
                                        pending_order_price: column_map.PENDING_ORDER_PRICE,
                                        order_ticket: column_map.ORDER_TICKET,
                                        method: column_map.METHOD,
                                        pending_order_expiry: column_map.EXCHANGE_EXPIRY,
                                        long_pending_order_expiry: new Date(column_map.EXCHANGE_EXPIRY).getTime() //important!
                                    };
                                    
                                    //console.log("---post--------");
                                    //console.log(order);
                                    
                                    xPost.emit('pending_order_sold', order);
                                }
                            })
                            .catch(function (err) {
                                //console.dir(column_map);
                                console.log(err);//DONT DO THIS IN PRODUCTION
                                sObj.sendError(res, 'Could not sell product.');
                            });
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    sObj.sendError(res, 'Could not sell product.');
                });

    };

    var setBuyerAction = function (input) {
        var product = input.product;

        if (input.strike_up || input.strike_down || input.strike_type || input.strike_price) {//options

            var uc_strike_type = input.strike_type ? input.strike_type.toUpperCase() : null;

            if (input.strike_price && uc_strike_type === 'OTM' && product === "digital call") {
                input.buyer_action = "DIGITAL PUT (ITM)";
            } else if (input.strike_price && uc_strike_type === 'ITM' && product === "digital call") {
                input.buyer_action = "DIGITAL PUT (OTM)";
            } else if (uc_strike_type === 'ATM' && product === "digital call") {
                input.buyer_action = "DIGITAL PUT (ATM)";
            } else if (input.strike_price && uc_strike_type === 'ITM' && product === "digital put") {
                input.buyer_action = "DIGITAL CALL (OTM)";
            } else if (input.strike_price && uc_strike_type === 'OTM' && product === "digital put") {
                input.buyer_action = "DIGITAL CALL (ITM)";
            } else if (uc_strike_type === 'ATM' && product === "digital put") {
                input.buyer_action = "DIGITAL CALL (ATM)";
            } else if (input.strike_price && uc_strike_type === 'UP' && product === "no touch") {
                input.buyer_action = "ONE TOUCH (UP)";
            } else if (input.strike_price && uc_strike_type === 'DOWN' && product === "no touch") {
                input.buyer_action = "ONE TOUCH (DOWN)";
            } else if (input.strike_price && uc_strike_type === 'UP' && product === "one touch") {
                input.buyer_action = "NO TOUCH (UP)";
            } else if (input.strike_price && uc_strike_type === 'DOWN' && product === "one touch") {
                input.buyer_action = "NO TOUCH (DOWN)";
            } else if (input.strike_up && input.strike_down && product === "double no touch") {
                input.buyer_action = "DOUBLE ONE TOUCH";
            } else if (input.strike_up && input.strike_down && product === "double one touch") {
                input.buyer_action = "DOUBLE NO TOUCH";
            } else if (input.strike_up && input.strike_down && product === "range in") {
                input.buyer_action = "RANGE OUT";
            } else if (input.strike_up && input.strike_down && product === "range out") {
                input.buyer_action = "RANGE IN";
            }
        } else if (product === "spot forex") {//spot forex
            if (input.direction.toLowerCase() === "buy") {
                input.buyer_action = "SELL";
            } else if (input.direction.toLowerCase() === "sell") {
                input.buyer_action = "BUY";
            }
        }


        return input.buyer_action;
    };
    var refactorSellerOptinsProduct = function (input) {
        var product = input.product;
        if (input.strike_type
                && (input.strike_price || input.strike_price === 0)) {
            return (product + " (" + input.strike_type + ")").toUpperCase();
        } else if (input.strike_up && input.strike_down) {
            return product.toUpperCase();
        }
        return null;
    };

    var setStrike = function (input) {
        var product = input.product;
        input.strike = null;
        var uc_strike_type = input.strike_type ? input.strike_type.toUpperCase() : null;
        var isStrikePrice = !isNaN(input.strike_price);
        var isStrikeUp = !isNaN(input.strike_up);
        var isStrikeDown = !isNaN(input.strike_down);
        input.strike_up = Math.abs(input.strike_up); // remove the + sign


        if (isStrikePrice && uc_strike_type === 'OTM' && product === "digital call") {
            input.strike = "+" + input.strike_price;
        } else if (isStrikePrice && uc_strike_type === 'ITM' && product === "digital call") {
            input.strike = "-" + input.strike_price;
        } else if (uc_strike_type === 'ATM' && product === "digital call") {
            input.strike = "0";
            input.strike_price = 0; //important! just set to zero since we did not send it from client
        } else if (isStrikePrice && uc_strike_type === 'ITM' && product === "digital put") {
            input.strike = "+" + input.strike_price;
        } else if (isStrikePrice && uc_strike_type === 'OTM' && product === "digital put") {
            input.strike = "-" + input.strike_price;
        } else if (uc_strike_type === 'ATM' && product === "digital put") {
            input.strike = "0";
            input.strike_price = 0; //important! just set to zero since we did not send it from client
        } else if (isStrikePrice && uc_strike_type === 'UP' && product === "no touch") {
            input.strike = "+" + input.strike_price;
        } else if (isStrikePrice && uc_strike_type === 'DOWN' && product === "no touch") {
            input.strike = "-" + input.strike_price;
        } else if (isStrikePrice && uc_strike_type === 'UP' && product === "one touch") {
            input.strike = "+" + input.strike_price;
        } else if (isStrikePrice && uc_strike_type === 'DOWN' && product === "one touch") {
            input.strike = "-" + input.strike_price;
        } else if (isStrikeUp && isStrikeDown && product === "double no touch") {
            //input.strike = "+" + input.strike_up + " / " + input.strike_down;
            input.strike = 0;
        } else if (isStrikeUp && isStrikeDown && product === "double one touch") {
            //input.strike = "+" + input.strike_up + " / " + input.strike_down;
            input.strike = 0;
        } else if (isStrikeUp && isStrikeDown && product === "range in") {
            //input.strike = "+" + input.strike_up + " / " + input.strike_down;
            input.strike = 0;
        } else if (isStrikeUp && isStrikeDown && product === "range out") {
            //input.strike = "+" + input.strike_up + " / " + input.strike_down;
            input.strike = 0;
        } else {
            return false;
        }


        return true;
    };

    var optionsColumnMap = function (user, input) {
        return {
            LIVE: user.live,
            SELLER_ID: user.exchangeId,
            SELLER_USERNAME: user.username,
            ORDER_TICKET: sObj.getUniqueOrderTicket(),
            PENDING_ORDER_PRICE: input.pending_order_price,
            PRODUCT: refactorSellerOptinsProduct(input),
            SYMBOL: input.symbol,
            STRIKE: input.strike ? input.strike : 0,
            STRIKE_UP: input.strike_up ? input.strike_up : 0,
            STRIKE_DOWN: input.strike_down ? input.strike_down : 0,
            BUYER_ACTION: input.buyer_action,
            EXPIRY_VALUE: input.expiry_value,
            EXPIRY_UNIT: input.expiry_unit,
            SIZE: input.size,
            PRICE: input.price,
            PREMIUM: input.premium,
            TIME: sObj.now(),
            EXCHANGE_EXPIRY: input.exchange_expiry,
            METHOD: input.method
        };
    };


    return this;
};

// subclass extends superclass
ExchangePost.prototype = Object.create(events.EventEmitter.prototype);
ExchangePost.prototype.constructor = ExchangePost;

xPost = new ExchangePost();

module.exports = xPost;