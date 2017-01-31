//var quote_model = Ext.create('TradeApp.model.Quote');

//FOR NOW THIS STORE JUST SIMULATE THE ACTUAL CHART STORE
Ext.define('TradeApp.store.ChartStore', {
    extend: 'Ext.data.Store',
    model: 'TradeApp.model.MarketPrice',
    alias: 'store.chart',
    storeId: 'chart_store_id',
    data: [],
    seed: 1.4,
    config: {
        timeframe: null, //initially unknown
        symbol: null,//initially unknown
        maxPrice:null,
        minPrice:null
    },
    randomPriceData: function (price, time) {
        var max = 1000;
        var min = 0;
        var trend = -1;
        //var price = max / 2;
        var rand_trend = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1];
        var bar_h = 25;
        var close = 0;
        var open = 0;
        var high = 0;
        var low = 0;

        var rand = Math.abs(Math.random());
        trend = rand_trend[Math.floor(rand * rand_trend.length)];
        var delta = rand * 5;
        price += (trend * delta);

        if (price >= (max - bar_h) * 0.9) {
            trend = -1;
            price += (trend * delta);
        }

        if (price <= (min + bar_h) * 1.1) {
            trend = 1;
            price += (trend * delta);
        }

        bar_trend = rand_trend[Math.floor(rand * rand_trend.length)];

        low = price;
        high = price + (rand * bar_h);
        close = low + (high - low) * rand;
        open = low + (high - low) * Math.random();

        return {time: time + 1000, open: open, high: high, low: low, close: close};
    },
    generateData: function () {
        //var period_len = 30 * 24 * 60 * 60 * 1000;
        var period_len = 20 * 60 * 60 * 1000;
        //var period_len =  5 * 60 * 1000;

        var record = {
            time: new Date().getTime() - period_len,
            low: 600
        };

        alert(new Date(record.time));

        var count = period_len / 1000;
        var data = [];
        for (var i = 0; i < count; i++) {
            var record = this.randomPriceData(record.low, record.time);
            data.push(record);
        }

        return data;
    },
    /**
     * takes and array of two elements as parameter such as [Ext.Date.SECOND, 1] , [Ext.Date.HOUR, 1] etc
     * @param {type} tf
     * @returns {undefined}
     */
    tfMillSec: function (tf) {
        switch (tf[0]) {
            case Ext.Date.SECOND :
                return 1000 * tf[1];
            case Ext.Date.MINUTE :
                return 60 * 1000 * tf[1];
            case Ext.Date.HOUR :
                return 60 * 60 * 1000 * tf[1];
            case Ext.Date.DAY :
                return 60 * 60 * 24 * 1000 * tf[1];
            case Ext.Date.MONTH :
                return 60 * 60 * 24 * 30 * 1000 * tf[1];
            case Ext.Date.YEAR :
                return 60 * 60 * 24 * 30 * 12 * 1000 * tf[1];

            case 'wk' :
                return 60 * 60 * 24 * 7 * 1000 * tf[1];// case of weeks which Ext does not cover
        }

        // case of weeks which Ext does not cover
        if (new String(tf[0]).toLowerCase() === 'week') {
            return 60 * 60 * 24 * 7 * 1000 * tf[1];
        }
    },
    /**
     * Extracts the data for the specified timeframe.
     * 
     * @param {type} data - the data to extract from
     * @param {type} tf - the specified timeframe - array of two elements : e.g [Ext.Date.SECOND, 1] , [Ext.Date.HOUR, 4] etc
     * @returns {Array}
     */
    timeframeFilter: function (data, tf) {

        var mill_sec = this.tfMillSec(tf);
        var tf_data = [];
        var b1 = new Date('01/01/1970').getTime();
        var b2 = new Date(data[0].time).getTime();
        var num = (b2 - b1) / mill_sec;
        num = Math.floor(num);
        var rb = num * mill_sec;
        var next_time = b1 + rb;
        for (var i = 1; i < data.length; i++) {
            if (data[i].time >= next_time) {
                tf_data.push(data[i]);
                next_time += mill_sec;
            }
        }
        return tf_data;
    },
    constructor: function (config) {
        config = Ext.apply({
            //data: this.generateData()
        }, config);
        this.callParent([config]);
    }
});
