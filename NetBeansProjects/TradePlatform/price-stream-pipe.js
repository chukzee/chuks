var net = require('net');
var events = require('events');
var MarketSymbol = {};

var sObj;
var dataStr = "";

var server;

var PriceStreamer = function (_sObj) {


    events.EventEmitter.call(this);

    this.firePriceQuote = function (priceObj)
    {
        if (isNaN(priceObj.time)) {
            //This is just for the purpose of precation since we need price time as a number 
            //which we use in multiple places
            throw new Error("Invalid price time - Price time must be a number. Pls use getTime() method Date class");
        }

        this.emit('price_quote', priceObj);
    };

    this.init = function (_sObj) {
        sObj = _sObj;


        function setMarketSymbol(symbols, market_type) {
            for (var i = 0; i < symbols.length; i++) {
                if (MarketSymbol[symbols[i]]) {
                    throw new Error("duplicate config settings for symbols - " + symbols[i] + " cannot appear in more than one market!");
                }
                MarketSymbol[symbols[i]] = market_type;
            }
        }
        ;

        setMarketSymbol(sObj.config.SPOT_SYMBOLS, "Spot");
        setMarketSymbol(sObj.config.FUTURES_SYMBOLS, "Futures");
        setMarketSymbol(sObj.config.COMMODITIES_SYMBOLS, "Commodities");
        setMarketSymbol(sObj.config.OIL_AND_GAS_SYMBOLS, "Oil/Gas");

        var streamPrice = function (stream) {
            console.log('Price stream server pipe connected');
            stream.on('data', function (d) {
                handleData(d);
            });

            stream.on('end', function () {
                console.log('Price stream server pipe end');
                server.close();
            });


            var handleData = function (data) {
                dataStr += data.toString();
                if (dataStr.charAt(data.length - 1) !== '\n') {
                    return;
                }

                var line = dataStr.split('\n');
                dataStr = ""; //initialize
                var time_recv = new Date().getTime();

                for (var i = 0; i < line.length; i++) {
                    var prc = line[i].split('=');
                    var symbol = prc[0];
                    var bid = prc[1] - 0;//implicitly convert to numeric
                    var ask = prc[2] - 0;//implicitly convert to numeric

                    if (!symbol) {
                        return;//is possible!
                    }

                    //price obj
                    var priceObj = {};
                    priceObj.live = true;
                    priceObj.time = time_recv;
                    priceObj.price = bid; // default is bid price
                    priceObj.bid = bid;
                    priceObj.ask = ask;
                    priceObj.symbol = symbol;
                    priceObj.market_type = MarketSymbol[symbol];
                    //fire the price quote event
                    priceStreamer.firePriceQuote(priceObj);

                    //console.log(priceObj);
                }

            };

        };

        startPipeServer();

        function startPipeServer() {
            server = net.createServer(streamPrice);

            server.on('close', function () {
                console.log('Price stream server pipe closed');

                setTimeout(function () {
                    console.log('Price stream server pipe restarting...');
                    startPipeServer();
                }, 1000);
            });

            server.listen(sObj.config.PRICE_PIPE_PATH, function () {
                console.log('Price stream server pipe listening on ' + sObj.config.PRICE_PIPE_PATH);
            });           
        }


    };

    return this;
};


// subclass extends superclass
PriceStreamer.prototype = Object.create(events.EventEmitter.prototype);
PriceStreamer.prototype.constructor = PriceStreamer;

var priceStreamer = new PriceStreamer();

module.exports = priceStreamer;