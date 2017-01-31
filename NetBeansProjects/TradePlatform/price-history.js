

var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');

var MAX_TICK_PRICE_OBJECTS = 10000; //max tick price objects count
var MAX_NON_TICK_PRICE_OBJECTS = 500;//max price objects count - ticks not included 
var sObj = null;
var tradersIO = null;

var priceHistory = function () {
    var priceCollections = {};
    var prevPriceData = {};
    var timeframes = null;

    this.init = function (_sObj) {
        sObj = _sObj;
        var symbols = sObj.ALL_SYMBOLS;
        for (i in symbols) {
            initSymbolPrices(symbols[i], 1);//live
            initSymbolPrices(symbols[i], 0);//demo
        }
    };
    this.setIO = function (io) {
        tradersIO = io;
    };
    
    /**
     * Get price history given the specified timeframe and symbol
     * 
     * @param {type} tf - specified timeframe - can also be tick
     * @param {type} symbol - market symbol
     * @param {type} callback - a callback that must be provided since the method can sometimes be asynchronous
     * @returns {undefined}
     */
    this.get = function (tf, symbol) {
        return priceCollections[symbol] && priceCollections[symbol][tf] ? priceCollections[symbol][tf] : null;   
    };

    this.getLastKnown = function () {
        var lk = [];
        for (var n in prevPriceData) {
            var price = prevPriceData[n]["tick"];
            if (price) {
                lk.push(price);
            }
        }
        return lk;
    };

    var dataToPrices = function (data) {
        var arr = data.split('\n');
        var ps = [];
        for (var i = 0; i < arr.length; i++) {
            try {
                var obj = JSON.parse(arr[i]);
                ps.push(obj);
            } catch (e) {
                //No need to print error here.
                //here, it means the section of data is incomplete due to the
                //arbituary way we read data from the file
            }
        }
        return ps;
    };

    var initSymbolPrices = function (symbol, live) {
        //yes we need synchronous operation here in this case because we 
        //need this initialization process to finish before anything else

        var file = getSymbolPriceFilename(symbol, live, "tick");
        var path = getDir(file);
        mkdirp.sync(path);
        var fd = fs.openSync(file, 'a+');//open for reading and appending

        var stats = fs.statSync(file);
        var size = stats['size'];
        var rq_size = 10000;
        var readPos = size > rq_size ? size - rq_size : 0;
        var length = size - readPos;
        var buffer = new Buffer(length);

        if (length === 0) {
            return; //nothing to do
        }

        fs.readSync(fd, buffer, 0, length, readPos);

        var data = buffer.toString(); //toString(0, length) did not work but toString() worked for me

        //Simple check whether the data is corrupt by checking if it ends with the new line character delimiter
        if (data.charAt(data.length - 1) !== '\n') {
            //here it means the file is corrupt so correct it
            var index = data.lastIndexOf('\n');
            if (index > -1) {
                data = data.substring(0, index + 1);
                fs.truncateSync(file, readPos);//truncate to this position
                fs.writeSync(fd, data, readPos);//write starting from this position                
            }
        }

        var prices = dataToPrices(data);

        if (prices.length === 0) {
            return;//nothing to do
        }

        if (prices[0].live !== live) {
            return;//wait for your turn! demo and live are given opportunity! see caller method
        }
        if (!priceCollections[symbol]) {
            priceCollections[symbol] = {};
            prevPriceData[symbol] = {};
        }

        priceCollections[symbol]["tick"] = prices;
        prevPriceData[symbol]["tick"] = prices[prices.length - 1];

        timeframes = sObj.config.timeframes;
        for (var tf in timeframes) {
            initSymbolTimeframe(tf, timeframes[tf], symbol, live, prices);
        }

    };

    var initSymbolTimeframe = function (tf, millsecs, symbol, live, prices) {

        var len = prices.length;

        var tfPriceArr = [];
        var previous_price = null;
        for (var i = 0; i < len; i++) {
            var curent_price = prices[i];
            //NOTE: The technique is to detect a drop in modulus - There lies the
            //data we are looking for.
            if (isDropInModulus(millsecs, previous_price, curent_price)) {
                tfPriceArr.push(curent_price);
            }
            previous_price = curent_price;
        }

        if (!priceCollections[symbol]) {
            priceCollections[symbol] = {};
            prevPriceData[symbol] = {};
        }

        priceCollections[symbol][tf] = tfPriceArr;
        prevPriceData[symbol][tf] = tfPriceArr[tfPriceArr.length - 1];

        var file = getSymbolPriceFilename(symbol, live, tf);
        var str = "";
        for (var i = 0; i < tfPriceArr.length; i++) {
            str += JSON.stringify(tfPriceArr[i]) + '\n';
        }

        var fd = fs.openSync(file, 'a+'); //open the file

        var stats = fs.statSync(file);
        var size = stats['size'];
        var rq_size = 1000; //just as much enough to get the last price object in the file
        var readPos = size > rq_size ? size - rq_size : 0;
        var length = size - readPos;
        var buffer = new Buffer(length);

        if (size === 0) {
            fs.writeSync(fd, str);//write        
        } else if (size > 0) {
            fs.readSync(fd, buffer, 0, length, readPos);
            var data = buffer.toString();
            var prcs = dataToPrices(data);

            if (prcs.length === 0) {
                //delete and recreate the file 
                fs.closeSync(fd);//close the file
                fs.unlinkSync(file);//delete the file
                fd = fs.openSync(file, 'a+'); //create and open the file
                fs.writeSync(fd, str);//write

                return;
            }

            //compare the timestamps of the first introducing price and the last timeframe file price
            var p = prices[0];//first introducing price
            var lp = prcs[prcs.length - 1];//last timeframe file price
            if (p.time > lp.time) {
                //ok append to the timeframe price file
                fs.appendFileSync(file, str);

            }

        }

    };

    this.storeQuote = function (priceObj) {
        addTf(priceObj, "tick"); //Yes, ticks can even be less than 1 second so no need to specify timeframe seconds
        timeframes = sObj.config.timeframes;
        for (var tf in timeframes) {
            addTf(priceObj, tf, timeframes[tf]);
        }
    };

    this.addTf = function (priceObj, tf, millsecs) {

        var symbol = priceObj.symbol;

        if (!priceCollections[symbol]) {
            priceObj.high = priceObj.price;
            priceObj.low = priceObj.price;
            priceCollections[symbol] = {};
            prevPriceData[symbol] = {};
        }

        if (!priceCollections[symbol][tf]) {
            priceCollections[symbol][tf] = [];
            priceCollections[symbol][tf].push(priceObj);
            prevPriceData[symbol][tf] = priceObj;
            return;
        }



        if (millsecs && !isDropInModulus(millsecs, prevPriceData[symbol][tf], priceObj)) {//Not ticks but actual timefames.

            if (tf !== "tick") {//yes, except the tick prices - though 'tick' will not reach here anyway if logic is perfect!
                updateLastOHLC(priceCollections[symbol][tf], priceObj);
            }

            prevPriceData[symbol][tf] = priceObj;
            return; //Leave since no drop in modulus.
        }

        initNewOHLC(priceObj);
        priceCollections[symbol][tf].push(priceObj);

        if (tf !== "tick") {
            //send the timeframe quote to the connected users
            tradersIO.emit('timeframe_quote', {timeframe: tf, quote: priceObj}); // must do this before drain the price below
        }

        if (priceCollections[symbol][tf].length >= maxPriceObjects(millsecs)) {
            drainPrices(symbol, priceObj.live, tf);//drain to release memory
        }

        prevPriceData[symbol][tf] = priceObj; //set last known price of the symbol on the specified timeframe.

    };

    var maxPriceObjects = function (millsecs) {
        return millsecs ? MAX_NON_TICK_PRICE_OBJECTS : MAX_TICK_PRICE_OBJECTS;
    };
    /**
     * The technique is to detect a drop in modulus - There lies the
     *  data we are looking for.
     *  
     * @param {type} seconds
     * @param {type} previous_price
     * @param {type} current_price
     * @returns {Boolean}
     */
    var isDropInModulus = function (seconds, previous_price, current_price) {
        if (!previous_price || !current_price) {
            return false;
        }
        //check drop in modulus
        var diff = previous_price.time - sObj.LONG_1970_01_01;
        var prev_mod = diff % seconds;

        diff = current_price.time - sObj.LONG_1970_01_01;
        var mod = diff % seconds;

        return mod < prev_mod;
    };

    var drainPrices = function (symbol, live, tf) {

        var file = getSymbolPriceFilename(symbol, live, tf);
        var str = "";
        var prices = priceCollections[symbol][tf];
        for (var i = 0; i < prices.length; i++) {
            str += JSON.stringify(prices[i]) + '\n';
        }

        priceCollections[symbol][tf] = [];//yes initialize as empty array

        fs.appendFile(file, str, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            //DO NOT initialize priceCollections[symbol][tf] here - DON'T EVER - causes unexpectedly strange result
        });

    };

    var updateLastOHLC = function (tfPrcArr, current_price) {

        if (tfPrcArr.length > 0) {
            var lastP = tfPrcArr[tfPrcArr.length - 1];
            if (current_price.price > lastP.high) {
                lastP.high = current_price.price;
            }
            if (lastP.low === 0) {
                lastP.low = current_price.price;
            }

            if (current_price.price < lastP.low) {
                lastP.low = current_price.price;
            }
            if (!lastP.open) {
                lastP.open = lastP.price;
            }
            lastP.close = current_price.price;

        }

    };

    var initNewOHLC = function (current_price) {

        current_price.open = current_price.price;
        current_price.high = current_price.price;
        current_price.low = current_price.price;
        current_price.close = current_price.price;



    };

    var getSymbolPriceFilename = function (symbol, live, timeframe) {
        var dir = live ? "live/" : "demo/";
        symbol = symbol.replace("/", "");
        var tf = timeframe ? ("_" + timeframe) : "";
        return sObj.PRICE_DATA_DIR + dir + symbol + tf + ".price";
    };

    var getDir = function (file) {
        var index = -1;
        if (path.sep === '\\') {
            var index_1 = file.lastIndexOf('\\');
            var index_2 = file.lastIndexOf('/');
            index = index_1 > index_2 ? index_1 : index_2;

        } else if (path.sep === '/') {
            index = file.lastIndexOf('/');
        }
        if (index === -1) {
            return file;
        }

        var dir = file.substring(0, index);

        return dir;
    };

    return this;
};


module.exports = priceHistory;