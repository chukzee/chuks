var net = require('net');
var WebSocket = require('ws');
var ws = new WebSocket.Server({
    port:8855
});
var PRICE_PIPE_PATH = "\\\\.\\pipe\\price_local_route";

var server = net.createServer(function (stream) {
    console.log('Price stream server pipe connected');
    stream.on('data', function (d) {
        broadcast(d);
    });

    stream.on('end', function () {
        console.log('Price stream server pipe end');
        server.close();
    });


    var broadcast = function (data) {

    };

});

server.on('close', function () {
    console.log('Price stream server pipe closed');
});

server.listen(PRICE_PIPE_PATH, function () {
    console.log('Price stream server pipe listening on ' + PRICE_PIPE_PATH);
});