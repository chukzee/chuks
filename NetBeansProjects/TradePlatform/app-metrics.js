
var probe = require('pmx').probe();

var requestPerMin = probe.meter({
  name      : 'requests/min',
  samples   : 1,
  timeframe : 60
});

var requestPerHour = probe.meter({
  name      : 'requests/hour',
  samples   : 1,
  timeframe : 3600
});


var requestPerDay = probe.meter({
  name      : 'requests/day',
  samples   : 1,
  timeframe : 3600 * 24
});


var requestCounter = probe.counter({
  name : 'Total requests'
});

var openOrdersCounter = probe.counter({
  name : 'Total open orders'
});

var pendingOrdersCounter = probe.counter({
  name : 'Total pending orders'
});


var ordersCounter = probe.counter({
  name : 'Total orders'
});

var connectedUsersCounter = probe.counter({
  name : 'Total users connected'
});


var metrics = function(){
    
    this.markRequest = function(){
        requestPerMin.mark();
        requestPerHour.mark();
        requestPerDay.mark();
    };

    this.incrementRequest = function(){
        requestCounter.inc();
    };
    
    this.decrementRequest = function(){
        requestCounter.dec();
    };

    this.incrementOrder = function(){
        ordersCounter.inc();
    };
    
    this.decrementOrder = function(){
        ordersCounter.dec();
    };
    
    this.incrementOpenOrder = function(){
        openOrdersCounter.inc();
    };
    
    this.decrementOpenOrder = function(){
        openOrdersCounter.dec();
    };
    
    this.incrementPendingOrder = function(){
        pendingOrdersCounter.inc();
    };
    
    this.decrementPendingOrder = function(){
        pendingOrdersCounter.dec();
    };
    
    this.incrementConnectedUsers = function(){
        connectedUsersCounter.inc();
    };
    
    this.decrementConnectedUsers = function(){
        connectedUsersCounter.dec();
    };
             
    return this;
};


module.exports = metrics;

