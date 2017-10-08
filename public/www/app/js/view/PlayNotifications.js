
Ns.view.PlayNotifications = {

    constructor: function () {


        var obj = {
            play_request: 'game/PlayRequest',
        };

        Main.eventio.on('play_request', this.onPlayRequest);
        Main.eventio.on('play_request_rejected', this.onPlayRequestRejected);
        Main.eventio.on('play_request_expired', this.onPlayRequestExpired);

    },

    content: function () {

    },

    onPlayRequest: function (obj) {
        console.log(obj);
    },

    onPlayRequestRejected: function (obj) {
        console.log(obj);
    },

    onPlayRequestExpired: function (obj) {
        console.log(obj);
    }

    //more goes below
};