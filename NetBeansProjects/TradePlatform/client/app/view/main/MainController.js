/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */

var ChartProp = Ext.create('TradeApp.view.chart.ChartProp');
//var util = Ext.create('TradeApp.Util');

Ext.define('TradeApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    listen: {
        //listen to events using GlobalEvents
        global: {
            account_info: 'onAccountInfo',
            account_modified: 'onAccountModified',
            spotfx_total_positions: 'displayTotalSpotFxPosition',
            options_total_positions: 'displayTotalOptionsPosition',
            price_quote: 'onPriceQuote',
            options_countdown_start: 'onOptionsCountdownStart',
            spotfx_countdown_start: 'onSpotfxCountdownStart',
            options_countdown_over: 'onOptionsCountdownOver',
            spotfx_countdown_over: 'onSpotfxCountdownOver',
            options_pending_order_created: 'onOptionsPendingOrderCreated',
            spotfx_pending_order_created: 'onSpotfxPendingOrderCreated',
            options_pending_order_deleted: 'onOptionsPendingOrderDeleted',
            spotfx_pending_order_deleted: 'onSpotfxPendingOrderDeleted',
            options_trade_closed: 'onOptionsTradeClosed',
            spotfx_trade_closed: 'onSpotfxTradeClosed',
            drag_drop_quote_on_chart: 'onDragDropQuoteOnChart',
            timeframe_quote: 'onTimeframeQuote',
            switch_from_login: 'switchFromLogin'
        }
    },
    switchFromLogin: function (arg) {
        var dia = this.lookupReference('loginDialog');
        dia.hide();
        if (arg && typeof arg.callback === "function") {
            arg.callback();
        }
    },
    onDragDropQuoteOnChart: function (symbol) {
        this.onChartTimeframe(symbol);
    },
    onTimeframeQuote: function (msg) {

        //console.log(msg);
        TradeApp.Util.addChartTFData(msg.timeframe, msg.quote);

        this.updateChart(msg.quote.symbol, msg.timeframe);

    },
    onNewChartPrice: function (quote) {

        //try {

        TradeApp.Util.updateChartOHLC(quote);

        this.updateChart(quote.symbol, "tick");

        // } catch (e) {
        // console.log(e);
        //}

    },
    /*That is last quote price of the market irrespective of whether the
     * FIX server is on or not. This data is gotten from the history
     * 
     * @param {type} msg
     * @returns {undefined}
     */
    onLastKnownPriceQuotes: function (msg) {
        for (var m in msg) {

            var grid = this.lookupReference('quote_grid_ref');

            var result = null;

            if (grid.isVisible()) {//isVisible not working as excepted - come back for better approach
                result = TradeApp.Util.updateGridWhere(function (record) {
                    record.set('price', m.price);
                }, grid, 'symbol', m.symbol);

            }

        }
    },
    onPriceQuote: function (msg) {


        var me = this;
        this.onNewChartPrice(msg);

        var lblcurrent_symbol = this.lookupReference('chart_symbol');
        if (lblcurrent_symbol && msg.symbol === lblcurrent_symbol.getValue()) {
            //this is the symbol on the chart so we will update the grid
            //price for harmony sake!
            this.updatePriceOnMarketWatch(msg);
            this.updatePriceOnOpenTrades(msg);//COMMENT OUT IF PERFORMANCE IS NOT OK HERE            
        } else {
            //here use UpdateManager to update the components optimally
            //to avoid platform hanging by selecting the best update strategy.
            TradeApp.UpdateManager.update(function (msg) {
                me.updatePriceOnMarketWatch(msg);
                me.updatePriceOnOpenTrades(msg);
            }, msg, msg.symbol, msg.price);

        }


        return false;//important! prevent further call - i suppose it is a bug.
    },
    updatePriceOnMarketWatch: function (msg) {
        var grid = this.lookupReference('quote_grid_ref');

        var result = null;

        if (grid.isVisible()) {//isVisible not working as excepted - come back for better approach
            result = TradeApp.Util.updateGridWhere(function (record) {
                record.set('price', msg.price);
            }, grid, 'symbol', msg.symbol);

        }

        if (!result) {
            TradeApp.Util.refreshGrid(grid, true); // COME BACK TO VERIFY IF WORKING CORRECTLY
        }
    },
    updatePriceOnOpenTrades: function (msg) {

        var result = null;

        grid = this.lookupReference('trade_spotfx_positions');

        if (grid.isVisible()) {//isVisible not working as excepted - come back for better approach
            result = TradeApp.Util.updateGridWhereAll(function (record) {
                record.set('close', msg.price);
            }, grid, 'symbol', msg.symbol);
        }


        grid = this.lookupReference('trade_options_positions');

        if (grid.isVisible()) {//isVisible not working as excepted - come back for better approach
            result = TradeApp.Util.updateGridWhereAll(function (record) {
                record.set('close', msg.price);
            }, grid, 'symbol', msg.symbol);
        }

        return false;//important! prevent further call - i suppose it is a bug.
    },
    displayTotalSpotFxPosition: function (store) {
        var pos_label = this.lookupReference('spotfx_total_open_positions');
        if (pos_label) {
            pos_label.setValue(store.getTotalCount());
        }

    },
    displayTotalOptionsPosition: function (store) {
        var pos_label = this.lookupReference('options_total_open_positions');
        if (pos_label) {
            pos_label.setValue(store.getTotalCount());
        }
    },
    refreshMarketWatch: function () {
        var grid = this.lookupReference('quote_grid_ref');
        TradeApp.Util.refreshGrid(grid, true);
    },
    onOptionsCountdownStart: function (msg) {

        var grid = this.lookupReference('trade_options_positions');
        TradeApp.Util.doTradeGridCountdown(grid, msg.order_ticket, msg.countdown);

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onSpotfxCountdownStart: function (msg) {

        var grid = this.lookupReference('trade_spotfx_positions');
        TradeApp.Util.doTradeGridCountdown(grid, msg.order_ticket, msg.countdown);

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onOptionsCountdownOver: function (msg) {

        var grid = this.lookupReference('trade_options_positions');

        TradeApp.Util.updateGridWhere(function (record) {
            record.set('expiry', msg.expiry);
            record.set('open', msg.open);
            record.set('barrier', msg.barrier);
            record.set('barrier_up', msg.barrier_up);
            record.set('barrier_down', msg.barrier_down);
            record.set('strike', msg.strike);
            record.set('strike_up', msg.strike_up);
            record.set('strike_down', msg.strike_down);
            record.set('premium_paid', msg.premium_paid);
            record.set('close', msg.close);
            record.set('time', msg.time);
        }, grid, 'order', msg.order_ticket);

        //set account balance
        var strFormat = "0,000.00";
        var currency = "$";
        this.lookupReference('trade_tab_panel')
                .setTitle("Account balance: " + currency + Ext.util.Format.number(msg.account_balance, strFormat));

        this.displayTotalOptionsPosition(grid.getStore());

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onSpotfxCountdownOver: function (msg) {
        
        //console.log(msg);
        
        var grid = this.lookupReference('trade_spotfx_positions');

        var exchange_id = TradeApp.Util.getUserExchangeId();
        
        TradeApp.Util.updateGridWhere(function (record) {
            record.set('open', msg.open);
            record.set('stop_loss', exchange_id === msg.seller_id ? msg.seller_stop_loss : msg.buyer_stop_loss);
            record.set('take_profit', exchange_id === msg.seller_id ? msg.seller_take_profit : msg.buyer_take_profit);
            record.set('close', msg.close);
            record.set('time', msg.time);
        }, grid, 'order', msg.order_ticket);

        //set account balance
        if (msg.account_balance) {
            var strFormat = "0,000.00";
            var currency = "$";
            this.lookupReference('trade_tab_panel')
                    .setTitle("Account balance: " + currency + Ext.util.Format.number(msg.account_balance, strFormat));
        }

        this.displayTotalSpotFxPosition(grid.getStore());

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onOptionsPendingOrderCreated: function (msg) {

        var grid = this.lookupReference('pending_options_positions');


        var exchange_id = TradeApp.Util.getUserExchangeId();
        msg.type = exchange_id === msg.seller_id ? "SELLER" : "BUYER";

        var store = grid.getStore();
        //store.add(msg);
        store.insert(0, msg);
        grid.getView().refresh();
        return false;//important! prevent further call - i suppose it is a bug.
    },
    onSpotfxPendingOrderCreated: function (msg) {

        var grid = this.lookupReference('pending_spotfx_positions');

        var exchange_id = TradeApp.Util.getUserExchangeId();
        msg.stop_loss = exchange_id === msg.seller_id ? msg.seller_stop_loss : msg.buyer_stop_loss;
        msg.take_profit = exchange_id === msg.seller_id ? msg.seller_take_profit : msg.buyer_take_profit;

        msg.type = exchange_id === msg.seller_id ? "SELLER" : "BUYER";

        var store = grid.getStore();
        //store.add(msg);
        store.insert(0, msg);
        grid.getView().refresh();

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onSpotfxPendingOrderDeleted: function (msg) {

        console.log('onSpotfxPendingOrderDeleted');

        var p_grid = this.lookupReference('pending_spotfx_positions');
        TradeApp.Util.deleteGridWhere(p_grid, 'order', msg.order_ticket);

        
        var op_grid = this.lookupReference('trade_spotfx_positions');
        TradeApp.Util.refreshGrid(op_grid, true);
    },
    onOptionsPendingOrderDeleted: function (msg) {

        console.log('onOptionsPendingOrderDeleted');

        var p_grid = this.lookupReference('pending_options_positions');
        TradeApp.Util.deleteGridWhere(p_grid, 'order', msg.order_ticket);

        var op_grid = this.lookupReference('trade_options_positions');
        TradeApp.Util.refreshGrid(op_grid, true);
    },
    onOptionsTradeClosed: function (msg) {

        var op_grid = this.lookupReference('trade_options_positions');
        TradeApp.Util.deleteGridWhere(op_grid, 'order', msg.order_ticket);

        var hs_grid = this.lookupReference('trade_history_options');
        var store = hs_grid.getStore();
        //store.add(msg);
        store.insert(0, msg);
        hs_grid.getView().refresh();

        //set account balance
        var strFormat = "0,000.00";
        var currency = "$";
        this.lookupReference('trade_tab_panel')
                .setTitle("Account balance: " + currency + Ext.util.Format.number(msg.account_balance, strFormat));

        this.displayTotalOptionsPosition(op_grid.getStore());

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onSpotfxTradeClosed: function (msg) {

        console.log('onSpotfxTradeClosed');

        var op_grid = this.lookupReference('trade_spotfx_positions');
        TradeApp.Util.deleteGridWhere(op_grid, 'order', msg.order_ticket);

        var hs_grid = this.lookupReference('trade_history_spotfx');
        var store = hs_grid.getStore();
        //store.add(msg);
        store.insert(0, msg);
        hs_grid.getView().refresh();

        //set account balance
        var strFormat = "0,000.00";
        var currency = "$";
        this.lookupReference('trade_tab_panel')
                .setTitle("Account balance: " + currency + Ext.util.Format.number(msg.account_balance, strFormat));

        this.displayTotalSpotFxPosition(op_grid.getStore());

        return false;//important! prevent further call - i suppose it is a bug.
    },
    onAccountInfo: function (info) {
        console.log(info);
        var strFormat = "0,000.00";
        var currency = "$";
        var indsp = this.lookupReference('trade_tab_panel');
        if (indsp)
        {
            indsp.setTitle("Account balance: " + currency + Ext.util.Format.number(info.account_balance, strFormat));
        }
        /*
         var indsp = this.lookupReference('spotfx_initial_deposit');
         if(indsp)
         {
         indsp.setValue(currency + Ext.util.Format.number(info.initial_deposit, strFormat));
         }
         
         var indo = this.lookupReference('options_initial_deposit');
         if(indo)
         {
         indo.setValue(currency + Ext.util.Format.number(info.initial_deposit, strFormat));
         
         }
         */
        return false;//important! prevent further call - i suppose it is a bug.
    },
    onAccountModified: function (info) {
        var me = this;
        Ext.Ajax.request({
            url: 'access_247/account_info',
            method: 'POST',
            params: "access_token=" + TradeApp.Util.getAccessToken() 
                    + "&version=" + TradeApp.Util.version,
            success: function (conn, response, options, eOpts) {
                try {
                    TradeApp.Util.refreshGrid("deposits-and-withdrawals-id", true);
                    var data = JSON.parse(conn.responseText);
                    me.onAccountInfo(data);

                } catch (e) {
                    console.log(e); // uncomment in production
                }

            },
            failure: function (conn, response, options, eOpts) {
                //not interested
            }
        });

    },
    onShowLiveTrades: function () {
        var trade_positions = this.lookupReference('trade_positions');
        var trade_history = this.lookupReference('trade_history');

        trade_history.hide();
        trade_positions.show();

    },
    onShowAccountHistory: function () {

        var trade_positions = this.lookupReference('trade_positions');
        var trade_history = this.lookupReference('trade_history');

        trade_positions.hide();
        trade_history.show();
    },
    onChartPan: function () {
        var chart = this.lookupReference('chart'),
                interactions = chart.getInteractions(),
                panzoom = interactions[0],
                crosshair = interactions[1];

        crosshair.setEnabled(false);
        panzoom.setEnabled(true);
        panzoom.setZoomOnPanGesture(false);
    },
    onChartZoom: function () {
        var chart = this.lookupReference('chart'),
                interactions = chart.getInteractions(),
                panzoom = interactions[0],
                crosshair = interactions[1];

        //Ext.getCmp('chart-view-panel').setStyle('cursor', 'pointer');
        //alert(Ext.getCmp('chart-view-panel'));
        //alert(Ext.getCmp('chart-view-panel').getEl());

        crosshair.setEnabled(false);
        panzoom.setEnabled(true);
        panzoom.setZoomOnPanGesture(true);

        //document.getElementById('chart-view-panel').style.cursor = 'grab';//not working - i don't know why.
    },
    checkOnly: function (all, menu) {
        menu.checked = true;
        menu.addCls('x-form-cb-checked x-form-dirty');
        for (var i in all) {
            if (all[i] !== menu) {
                all[i].checked = false;
                all[i].removeCls('x-form-cb-checked x-form-dirty');
                //all[i].checkChange();
            }
        }

    },
    allowRedraw: function (name) {

        var line = this.lookupReference('menu_line_chart'),
                area = this.lookupReference('menu_area_chart'),
                candle = this.lookupReference('menu_candle_stick_chart'),
                ohlc = this.lookupReference('menu_ohlc_chart');

        var all = [line, area, candle, ohlc];
        switch (name) {
            case 'line':
                this.checkOnly(all, line);
                return line.checked;
            case 'area':
                this.checkOnly(all, area);
                return area.checked;
                break;
            case 'candle_stick':
                this.checkOnly(all, candle);
                return candle.checked;
            case 'ohlc':
                this.checkOnly(all, ohlc);
                return ohlc.checked;
        }


    },
    redrawChart: function (type, name) {
        //if (this.allowRedraw(name)) {
        //alert(name);
        console.dir(type);

        var chart = this.lookupReference('chart');
        chart.setSeries(type);
        chart.redraw();
        ChartProp.setSelectedChartType(name);

        //var chart_view = Ext.getCmp('chart-view-panel');
        //chart_view.createChartDropTarget(chart_view);

        console.log(name);
        console.log(ChartProp.getSelectedChartType());
    },
    onLineChart: function () {
        this.redrawChart(chartProp.getLine(), 'line');
    },
    onAreaChart: function () {
        this.redrawChart(chartProp.getArea(), 'area');
    },
    onCandleStickChart: function () {
        this.redrawChart(chartProp.getCandleStick(), 'candle_stick');
    },
    onOhlcChart: function () {
        this.redrawChart(chartProp.getOhlc(), 'ohlc');
    },
    resetChart: function (chart) {

        var axes = chart.getAxes(),
                interactions = chart.getInteractions(),
                panzoom = interactions[0],
                crosshair = interactions[1];

        crosshair.setEnabled(true);
        panzoom.setEnabled(false);
        panzoom.setZoomOnPanGesture(false);

        axes[0].setVisibleRange([0, 1]);
        axes[1].setVisibleRange([0, 1]);

    },
    onChartReset: function () {
        var chart = this.lookupReference('chart');
        this.resetChart(chart);
        chart.redraw();
    },
    onThemeSwitch: function () {
        var chart = this.lookupReference('chart'),
                currentThemeClass = Ext.getClassName(chart.getTheme()),
                themes = Ext.chart.theme,
                themeNames = [],
                currentIndex = 0,
                name;

        for (name in themes) {
            if (Ext.getClassName(themes[name]) === currentThemeClass) {
                currentIndex = themeNames.length;
            }
            if (name !== 'Base' && name.indexOf('Gradients') < 0) {
                themeNames.push(name);
            }
        }
        chart.setTheme(themes[themeNames[++currentIndex % themeNames.length]]);
        chart.redraw();
    },
    checkChart: function (chart) {

        var lblcurrent_symbol = this.lookupReference('chart_symbol');
        if (!lblcurrent_symbol) {
            return;
        }
        var current_symbol = lblcurrent_symbol.getValue();

        var cbo_tf = this.lookupReference('timeframe');
        if (!cbo_tf) {//for a reason i do not understand the ExtJS build produce reference error. i dont know why!
            return;
        }
        var current_timeframe = TradeApp.Util.toTF(cbo_tf.value);

        if (!chart) {
            chart = this.lookupReference('chart');
        }
        var store = chart.getStore();
        var store_symbol = store.getSymbol();
        var store_timeframe = store.getTimeframe();
        if (!current_symbol) {
            return store;
        }
        if (store_symbol
                && store_timeframe
                && current_symbol === store_symbol
                && current_timeframe === store_timeframe) {
            return store;
        }

        store.setTimeframe(current_timeframe);
        store.setSymbol(current_symbol);
        store.loadData(TradeApp.Util.tfPriceData(current_symbol, current_timeframe));

        //confirm later if line below is really necessary
        chart.redraw();// effect the show of the new bar

        return store;
    },
    updateChart: function (symbol, timeframe) {

        var chart = this.lookupReference('chart');
        var chart_text = this.lookupReference('chart_text');
        var store = this.checkChart(chart);
        if (!store) {
            return;
        }
        var count = store.getCount();
        var store_symbol = store.getSymbol();
        var cbo_tf = this.lookupReference('timeframe');
        if (!cbo_tf) {//for a reason i do not understand the ExtJS build produce reference error. i dont know why!
            return;
        }
        var tf = TradeApp.Util.toTF(cbo_tf.value);
        var o = TradeApp.Util.chartTFS(tf);
        if (!o || !store_symbol || store_symbol !== symbol) {
            return;//do nothing
        }
        if (count === 0) {
            TradeApp.Util.requestTimeframeData(store, symbol, cbo_tf, cbo_tf.value);
            return;
        }

        var priceAxis = chart.getAxes()[0];
        var timeAxis = chart.getAxes()[1];
        var time_step = o.time_step;
        var secs = o.secs;
        var bar_to_show = TradeApp.Util.numBars();

        var quote = TradeApp.Util.getLastChartTFPrice(symbol, tf);
        if (!quote) {//is possible
            return;
        }
        if (!timeframe || timeframe === "tick") {
            var firstRecord = store.getAt(0);
            var first_price = firstRecord.get('price');

            //update all fields except the time field to retain the timeframe
            var lastRecord = store.getAt(count - 1);
            var needRedraw = quote.high > priceAxis.getMaximum() || quote.low < priceAxis.getMinimum();

            store.removeAt(count - 1);
            store.add(quote);

            store_symbol = firstRecord.get('symbol');
            var space = this.getPricePipsSpace(store_symbol);

            if (quote.high + space >= priceAxis.getMaximum()) {
                priceAxis.setMaximum(quote.high + space);
            }

            if (quote.low - space <= priceAxis.getMinimum() || priceAxis.getMinimum() === 0) {
                priceAxis.setMinimum(quote.low - space);
            }

        } else if (timeframe === store.getTimeframe()) {
            store.add(quote); // add new bar
            var firstRecord = store.getAt(0);
            var to_time = quote.time;
            var past_time = bar_to_show * secs * 1000;
            var from_time = to_time - past_time;
            timeAxis.setStep(time_step);
            timeAxis.setMinimum(from_time - 0 * secs * 1000);
            timeAxis.setMaximum(to_time + 1 * secs * 1000);


            store_symbol = firstRecord.get('symbol');
            var limit = TradeApp.Util.getPriceMinMax(symbol, tf);
            if (!limit) {
                return;
            }
            var space = this.getPricePipsSpace(store_symbol);
            priceAxis.setMinimum(limit.min - space);
            priceAxis.setMaximum(limit.max + space);

            //chart_text.setX(from_time);
            //chart_text.setY(limit.max);

            /*chart.getSurface().add({
             type: 'line',
             fromX: from_time - secs * 1000,
             toX: to_time + 2 * secs * 1000,
             fromY: quote.close,
             toY: quote.close
             }).show(true);*/
            //confirm later if line below is really necessary
            chart.redraw();// effect the show of the new bar

        }

    },
    isGoldOrSilver: function (symbol) {
        return symbol === "XAUUSD"
                || symbol === "XAU/USD"
                || symbol === "XAGUSD"
                || symbol === "XAG/USD";
    },
    getPricePipsSpace: function (symbol) {
        var len = symbol.length;
        var sIndex = 0;//e.g JPY/AUD - where JPY is the base currency
        var eIndex = len - 3;//e.g USD/JPY, USDJPY - where JPY is not the base currency
        var indexOfJPY = symbol.indexOf("JPY");
        var pips = 20;
        var step = 0.0001 * pips;
        if (indexOfJPY === sIndex || indexOfJPY === eIndex || this.isGoldOrSilver(symbol)) {
            step = 0.01 * pips;
        }
        return step;
    },
    onChartTimeframe: function (symbol) {
        var symbolCmp = this.lookupReference('chart_symbol');
        var symb = symbolCmp.getValue();
        if (typeof symbol === "string") {
            symbolCmp.setValue(symbol);
        } else {
            symbol = symb;
        }

        if (!symbol) {
            return;
        }


        var cbo_tf = this.lookupReference('timeframe');
        var tf = TradeApp.Util.toTF(cbo_tf.value);
        if (!cbo_tf) {//for a reason i do not understand the ExtJS build produce reference error. i dont know why!
            return;
        }

        var chart = this.lookupReference('chart');

        var store = chart.getStore();
        store.setTimeframe(tf);
        store.setSymbol(symbol);
        var tf_data = TradeApp.Util.tfPriceData(symbol, tf);
        var me = this;
        var MIN_BARS = 15;//if less than this minimum then request timeframe data
        if (tf_data && tf_data.length >= MIN_BARS) {//
            store.setData(tf_data);
        } else {
            TradeApp.Util.requestTimeframeData(store, symbol, cbo_tf, cbo_tf.value, function () {
                me.afterChartLoad(chart, symbol, tf);
            });
        }

        this.afterChartLoad(chart, symbol, tf);
    },
    afterChartLoad: function (chart, symbol, tf) {
        var priceAxis = chart.getAxes()[0];
        var timeAxis = chart.getAxes()[1];
        var o = TradeApp.Util.chartTFS(tf);
        if (!o) {
            return;//do nothing
        }
        var time_step = o.time_step;
        var secs = o.secs;
        var bar_to_show = TradeApp.Util.numBars();
        var store = chart.getStore();
        var count = store.getCount();
        if (!count) {
            return;
        }
        var lastRecord = store.getAt(count - 1);
        var time = lastRecord.get('time');
        var past_time = bar_to_show * secs * 1000;
        var from_time = time - past_time;
        timeAxis.setStep(time_step);
        timeAxis.setMinimum(from_time - 0 * secs * 1000);
        timeAxis.setMaximum(time + 1 * secs * 1000);


        var limit = TradeApp.Util.getPriceMinMax(symbol, tf);
        if (!limit) {
            return;
        }
        var space = this.getPricePipsSpace(symbol);
        priceAxis.setMinimum(limit.min - space);
        priceAxis.setMaximum(limit.max + space);

        chart.redraw();
    },
    onChartRendered: function () {
        this.onChartTimeframe();
    },
    onChartDestroy: function () {
        alert('onChartDestroy - Ends price move simulation');
        if (this.priceMoveSimulationTask) {
            Ext.TaskManager.stop(this.priceMoveSimulationTask);
        }
    },
    onWithdrawClick: function () {
        Ext.create('TradeApp.view.main.WithdrawalDialog', TradeApp.Util.onHideThenDestroy).show();
    },
    onLoginClick: function () {
        if (TradeApp.Util.isLogin()) {
            TradeApp.Util.logout();
        } else {
            TradeApp.Util.login();
        }
    },
    checkUserSessionExist: function () {

        if (TradeApp.Util.isLogin()) {
            TradeApp.Util.afterLogin();
        }
    },
    onMainTabsChange: function (tabPanel, newC, oldC) {
        if (newC.id === "exchange-room-tab") {
            Ext.GlobalEvents.fireEvent('check_exchange_update');
        }
    }

});
