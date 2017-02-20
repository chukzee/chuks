

Ext.define('GameApp.Device', {
    singleton: true,
    
    isMobileDeviceReady: false,
    
    constructor: function (config) {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //using 'this' to access isMobileDeviceReady variable is only possible
        //because of the bind(this) in the constructor above - the 'this' of the
        // GameApp.Device class instance is bind to onDeviceReady.
        this.isMobileDeviceReady = true;
    }
    
    
    
    
});