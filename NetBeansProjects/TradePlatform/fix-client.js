
var net = require('net');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var symbolCollection = new SymbolCollection();
var sequenceNumber = 1;

var sObj = null;
var fixConfig = null;
var HEARTBEAT_PERIOD = 30;
var lastTimeHeatbeatRecv = new Date(); // use to compare and detect if the fix server is idle - TODO - IMPLEMENT THIIS

var delay_start = 0;

var client = null;

var startClientSocket = function () {

    console.log('REMIND: PREVENT FIX SERVER IDLENESS (DEAD CONNECTION) BY CONSIDERING SENDING HEART BEAT TEST MESSAGE TO FIX SERVER IF IT DELAYS HEART BEATBEYOND ALLOWED MINUTES - ABEG O!!!');
    
    console.log('Connecting... to FIX server');

    client = new net.createConnection(fixConfig.port, fixConfig.host);
    client.on('connect', function () {
        console.log('Connected to FIX server');
        delay_start = 0;
        logonToFixServer();
    });

    client.on('data', function (data) {

        //console.log('Received: ' + data);

        var FIXBeginString = '8=FIX.4.4';
        var packs = new String(data).split(FIXBeginString);
        for (var i = 0; i < packs.length; i++) {
            if (!packs[i]) {
                continue;
            }
            var fixData = new FixData(FIXBeginString + packs[i]);
            if (fixData.isValid()) {
                handleFixPacket(fixData);
            }
        }

    });

    client.on('close', function () {

        console.log('Connection closed');

        //Reconnect to the fix server

        delay_start = delay_start >= 5000 ? delay_start : (delay_start + 1000);

        console.log('Waiting... retry FIX connection in ' + (delay_start / 1000 > 1 ? (delay_start / 1000) + " seconds" : (delay_start / 1000) + " second"));

        setTimeout(startClientSocket, delay_start);
    });

    client.on('error', function (err) {
        console.log(err);
    });


};

var FixClient = function () {

    events.EventEmitter.call(this);

    this.firePriceQuote = function (priceObj)
    {
        if(isNaN(priceObj.time)){
            //This is just for the purpose of precation since we need price time as a number 
            //which we use in multiple places
            throw new Error("Invalid price time - Price time must be a number. Pls use getTime() method Date class");
        }
        
        this.emit('price_quote', priceObj);
    };

    this.init = function (_sObj) {
        sObj = _sObj;
        
        fixConfig = _sObj.FIXConfig();
        
        symbolCollection.add(sObj.config.SPOT_SYMBOLS, "Spot");

        symbolCollection.add(sObj.config.FUTURES_SYMBOLS, "Futures");
        symbolCollection.add(sObj.config.COMMODITIES_SYMBOLS, "Commodities");
        symbolCollection.add(sObj.config.OIL_AND_GAS_SYMBOLS, "Oil/Gas");
        
        startClientSocket();
    };

    

    return this;
};


// subclass extends superclass
FixClient.prototype = Object.create(events.EventEmitter.prototype);
FixClient.prototype.constructor = FixClient;

var fClient = new FixClient();

//OR
//FixClient.prototype.__proto__ = events.EventEmitter.prototype;

var handleFixPacket = function (fixData) {

    if (fixData.isLogonSuccess()) {
        afterLogonSuccess();
    } else if (fixData.isHeartbeat()) {
        lastTimeHeatbeatRecv = new Date();
    } else if (fixData.isTestRequest()) {
        replyHeartbeatTest(fixData);
    } else if (fixData.isMassQuoteAcknowledgementRequest()) {
        replyMassQuoteAcknowledgement(fixData);
    }

    if (fixData.isMassQuote()) {
        handleMassQuote(fixData);
    }

    //more may go below

};

var afterLogonSuccess = function () {
    //subscribe to price quotes
    subcribeForPricing(symbolCollection);

    //schedule heatbeat to keep connection alive
    sObj.executor.schedule(sendHeartbeat, HEARTBEAT_PERIOD, sObj.executor.SECONDS);
};

var toSymbolPrecision = function (price, symbol) {
    var len = symbol.length;
    var sIndex = 0;//e.g JPY/AUD - where JPY is the base currency
    var eIndex = len - 3;//e.g USD/JPY, USDJPY - where JPY is not the base currency

    var indexOfJPY = symbol.indexOf("JPY");
    var precision = 5;
    if (indexOfJPY === sIndex || indexOfJPY === eIndex || sObj.util.isGoldOrSilver(symbol)) {
        precision = 3;
    }
    
    price = price - 0;//important! implicitly convert to numeric.
    price = price.toFixed(precision);
    price = price - 0;//again important! implicitly convert to numeric.
    return price;
};

var handleMassQuote = function (fix_data) {

    var tokens = fix_data.tokenize();

    var _302_len = 4; // ie "302=".length
    var _188_len = 4; // ie "188=".length
    var _190_len = 4; // ie "190=".length
    var time_recv = new Date().getTime();//important! must be getTime() - used in multiple places - No problem since the getTime() value is the same irrespective of the timezone
    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        var _302_index = t.indexOf("302=");
        var sym_id = t.substring(_302_len);
        if (_302_index === 0) {
            var bid = 0;
            var ask = 0;
            var symbol = symbolCollection.getSymbol(sym_id);
            for (var k = i + 1; k < tokens.length; k++) {
                var tk = tokens[k];
                var bid_index = tk.indexOf("188=");
                var ask_index = tk.indexOf("190=");
                if (bid_index === 0) {
                    bid = tk.substring(_188_len);
                    bid = toSymbolPrecision(bid, symbol);
                }
                if (ask_index === 0) {
                    ask = tk.substring(_190_len);
                    ask = toSymbolPrecision(ask, symbol);
                }
                var _302_index = tk.indexOf("302=");//next 302 
                if (_302_index === 0) {
                    i = k - 1;
                    break;//leave
                }
            }

            //price obj
            var priceObj = {};
            priceObj.live = fixConfig.live;
            priceObj.time = time_recv;
            priceObj.price = bid; // default is bid price
            priceObj.bid = bid;
            priceObj.ask = ask;
            priceObj.symbol = symbol;
            priceObj.market_type = symbolCollection.getMarketType(sym_id);

            //fire the price quote event
            fClient.firePriceQuote(priceObj);
        }
    }
};

function SymbolCollection(_symbs, market_type) {

    this.sym = [];
    this.ids = [];
    this.mkt = [];
    this.start = 1;
    this.cursor = this.start;


    this.add = function (_symbols, market_type) {
        if (!_symbols || _symbols.length === 0) {
            return;
        }
        var symbols = [];
        var unique_symbols = [];
        if (typeof _symbols === "string") {
            symbols.push(_symbols);
        } else {
            symbols = _symbols;
        }
        //first ensure unique symbols
        for (var i = 0; i < symbols.length; i++) {
            if (unique_symbols.indexOf(symbols[i]) === -1) {
                unique_symbols.push(symbols[i]);
            }
        }

        for (var i = 0; i < unique_symbols.length; i++) {
            var n = i + this.start;
            var id = n + "";
            this.sym[id] = unique_symbols[i];
            this.ids[unique_symbols[i]] = id;
            this.mkt[id] = market_type;
        }

    };

    this.add(_symbs, market_type);

    this.getSymbol = function (id) {
        if (arguments.length === 0) {
            return this.sym[this.cursor];
        }
        return this.sym[id];
    };

    this.getMarketType = function (id) {//the type of market the symbol belongs to - e.g Spot, Commodities, Futures, Oil/Gas
        if (arguments.length === 0) {
            return this.mkt[this.cursor];
        }
        return this.mkt[id];
    };

    this.getID = function (symbol) {
        if (arguments.length === 0) {
            return this.ids[this.sym[this.cursor]];
        }
        return this.ids[symbol];
    };

    this.first = function () {
        this.cursor = this.start;
    };

    this.next = function () {
        this.cursor++;
    };

    this.hasNext = function () {
        return typeof this.sym[this.cursor + 1] !== "undefined";
    };


}
;

var checksum = function (str) {
    var index_chk = str.lastIndexOf("10=");
    var s = str;
    if (index_chk > -1) {
        s = s.substring(0, index_chk);
    }

    var sum = 0;
    var chksum = 0;
    for (var i = 0; i < s.length; i++) {
        sum = sum + s.charCodeAt(i); // todo - this is not very appropriate. it does not encode
    }
    chksum = sum % 256;
    var cs = new String(chksum);
    if (cs.length === 1) {
        cs = "00" + cs;
    } else if (cs.length === 2) {
        cs = "0" + cs;
    }
    var EMPTY = "";//very importan!!!! implicitly convert to string. PLEASE DON'T CHANGE THIS!!!
    return cs + EMPTY;//important! -very important! abeg o!!!
};

var FixData = function (data) {
    var split = new String(data).split('\001');
    this.tv = {};
    for (i in split) {
        var sub = split[i];
        var index = sub.indexOf("=");
        if (index > 0) {
            var tag = sub.substring(0, index);
            this.tv[tag] = sub.substring(index + 1);
        }
    }

    this.tokenize = function () {
        return split;
    };

    this.isValid = function () {
        if (typeof this.tv["10"] !== "undefined" && checksum(data) === this.tv["10"]) {
            return true;
        }

        console.log("Sorry!!! invalid");

    };

    this.isHeartbeat = function () {
        return this.tv["35"] === "0";
    };

    this.isTestRequest = function () {
        return this.tv["35"] === "1";
    };

    this.isMassQuoteAcknowledgementRequest = function () {
        return this.tv["35"] === "i" && typeof this.tv["117"] !== "undefined"; //yes! check if undefined - correct way
    };

    this.isMassQuote = function () {
        return this.tv["35"] === "i";
    };

    this.getTestReqID = function () {
        return this.tv["112"];
    };

    this.getQuoteID = function () {
        return this.tv["117"];
    };
    this.isLogonSuccess = function () {
        return this.tv["35"] === "A";
    };
};

var FixParser = function () {

    this.separator = "\001";
    this.version = "8=FIX.4.4" + this.separator;
    var part = [];
    this.MsgType = "";

    this.parse = function (fix_version_number) {
        if (fix_version_number) {
            this.version = "8=FIX." + fix_version_number + this.separator;
        }
        var body = this.get();
        var body_length = body.length;
        var sub_body = body;
        if (sub_body.indexOf(this.MsgType) > -1) {
            sub_body = sub_body.substring(this.MsgType.length);
        }
        var msg = this.version + "9=" + body_length + this.separator
                + this.MsgType + sub_body;
        var full = msg + "10=" + checksum(msg) + this.separator;
        return full;
    };

    this.get = function () {
        var bd = "";
        for (var p in part) {
            bd += p + "=" + part[p] + this.separator;
        }
        return this.MsgType + bd + (this.raw ? this.raw : "");
    };
    this.set = function (tagName, value) {
        if (tagName === "35" || tagName === 35) {
            this.MsgType = "35=" + value + this.separator;
            return;
        }
        part[tagName] = value;
    };
    this.setRaw = function (raw) {
        this.raw = raw;
    };
    this.setMsgType = function (mt) {
        this.set("35", mt);
    };

    this.setMsgSeqNum = function (msn) {
        this.set("34", msn);
    };

    this.setTime = function () {
        var time = arguments.length === 0 ? sObj.moment().utc().format("YYYYMMDD-HH:mm:ss") : arguments[0];
        this.set("52", time + ".342");// laugh!!! what is .342 -  TODO! consider removing it if not neccessary
    };

    this.LogonMessage = function () {

        this.setMsgType("A");

        this.setUsername = function (username) {
            this.set("553", username);
        };
        this.setPassword = function (password) {
            this.set("554", password);
        };
        this.setSenderCompID = function (scid) {
            this.set("49", scid);
        };
        this.setTargetCompID = function (tcid) {
            this.set("56", tcid);
        };
        this.setResetSeqNumFlag = function (rsnf) {
            this.set("141", rsnf);
        };
        this.setHeartBtInt = function (hbi) {
            this.set("108", hbi);
        };
        this.setEncryptMethod = function (em) {
            this.set("98", em);
        };

        return this;

    };

    this.MarketDataRequest = function (type) {

        if (!type) {
            type = "V";
        }
        this.setMsgType(type);

        this.setSymbol = function (symb) {

            var sym = "";
            var et = "";
            var bc = symb.substring(0, 3);
            sym = "55=" + symb + this.separator + "15=" + bc + this.separator;
            et = "269=0" + this.separator + "269=1" + this.separator;
            this.raw = "267=1" + this.separator + et + "146=1" + this.separator + sym;
        };
        this.setMDReqID = function (value) {
            this.set("262", value);
        };
        this.setSubscriptionRequestType = function (value) {
            this.set("263", value);
        };
        this.setMUpdateType = function (value) {
            this.set("265", value);
        };
        this.setMarketDepth = function (value) {
            this.set("264", value);
        };
        this.setSenderCompID = function (scid) {
            this.set("49", scid);
        };
        this.setTargetCompID = function (tcid) {
            this.set("56", tcid);
        };

        return this;
    };


};

var sendHeartbeat = function () {

    var f = new FixParser();
    f.setMsgType(0);
    f.set("49", fixConfig.SenderCompID);
    f.set("56", fixConfig.TargetCompID);
    sendFixMessage(f);

};

var replyHeartbeatTest = function (fix_data) {

    var f = new FixParser();
    f.setMsgType(0);
    f.set("49", fixConfig.SenderCompID);
    f.set("56", fixConfig.TargetCompID);
    f.set("112", fix_data.getTestReqID());
    sendFixMessage(f);
};

var replyMassQuoteAcknowledgement = function (fix_data) {

    var f = new FixParser();
    f.setMsgType("b");
    f.set("49", fixConfig.SenderCompID);
    f.set("56", fixConfig.TargetCompID);
    f.set("117", fix_data.getQuoteID());
    sendFixMessage(f);
};

var sendFixMessage = function (fm) {

    fm.setMsgSeqNum(sequenceNumber);
    fm.setTime();

    var data = fm.parse();

    //console.log(data);

    client.write(data);

    sequenceNumber++;

};

var logonToFixServer = function () {
    var f = new FixParser();

    var logonMsg = f.LogonMessage();
    logonMsg.setUsername(fixConfig.username);
    logonMsg.setPassword(fixConfig.password);
    logonMsg.setMsgSeqNum(1);
    logonMsg.setSenderCompID(fixConfig.SenderCompID);
    logonMsg.setTargetCompID(fixConfig.TargetCompID);
    logonMsg.setResetSeqNumFlag("Y");
    logonMsg.setHeartBtInt(HEARTBEAT_PERIOD);
    logonMsg.setEncryptMethod(0);

    sendFixMessage(f);
};

var createPriceSubcriptionMsg = function (sym, id) {
    var f = new FixParser();
    var mrkDatReq = f.MarketDataRequest();

    mrkDatReq.setMsgSeqNum(2);
    mrkDatReq.setSenderCompID(fixConfig.SenderCompID);
    mrkDatReq.setTargetCompID(fixConfig.TargetCompID);
    mrkDatReq.setMDReqID(id);
    mrkDatReq.setSubscriptionRequestType(1);
    mrkDatReq.setMUpdateType(0);  // todo - test for 1
    mrkDatReq.setMarketDepth(0);
    mrkDatReq.setSymbol(sym);
    return f;
};
var subcribeForPricing = function (symbol_map) {

    symbol_map.first();//to first

    var recallWrite = function () {

        var fm = createPriceSubcriptionMsg(symbol_map.getSymbol(), symbol_map.getID());
        fm.setMsgSeqNum(sequenceNumber);
        fm.setTime();

        var data = fm.parse();

        console.log(data);

        client.write(data, function () {
            if (symbol_map.hasNext()) {
                symbol_map.next();
                sequenceNumber++;
                recallWrite();// write the next
            }
        });
    };

    recallWrite();

};

module.exports = fClient;