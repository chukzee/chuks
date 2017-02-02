
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


var ordersCounter = probe.counter({
  name : 'Total orders'
});

var countdownOrdersCounter = probe.counter({
  name : 'Total countdown orders'
});

var openOrdersCounter = probe.counter({
  name : 'Total open orders'
});

var pendingOrdersCounter = probe.counter({
  name : 'Total pending orders'
});

var connectedUsersCounter = probe.counter({
  name : 'Total users connected'
});

var tasksCounter = probe.counter({
  name : 'Total regitered tasks'
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
        console.log('incrementOrder');
        ordersCounter.inc();
    };
    
    this.decrementOrder = function(){
        console.log('decrementOrder');
        ordersCounter.dec();
    };
    
    this.incrementOpenOrder = function(){
        console.log('incrementOpenOrder');
        openOrdersCounter.inc();
    };
    
    this.decrementOpenOrder = function(){
        console.log('decrementOpenOrder');
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
    
    this.incrementTasks = function(){
        tasksCounter.inc();
    };
    
    this.decrementTasks = function(){
        tasksCounter.dec();
    };
        
    this.incrementCountdownOrders = function(){
        countdownOrdersCounter.inc();
    };
    
    this.decrementCountdownOrders = function(){
        countdownOrdersCounter.dec();
    };
    return this;
};


module.exports = metrics;

