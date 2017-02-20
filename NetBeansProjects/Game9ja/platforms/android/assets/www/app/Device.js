

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
        alert('onDeviceReady');
        this.isMobileDeviceReady = true;
    }
    
    
    
    
});