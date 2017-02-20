

Ext.define('GameApp.Msg', {
    singleton: true,

    alert: function (msgObj) {

        if (GameApp.Device.isMobileDeviceReady) {
            navigator.notification.alert(
                    msgObj.msg, // message
                    msgObj.callback, // callback
                    msgObj.title, // title
                    msgObj.btnText ? msgObj.btnText : "OK"// buttonName
                    );
        } else {
            alert("E no work o! Haba kai!");
        }
    },
    alertSuccess: function (s1, s2, s3) {
        this.alert({
            msg: s1,
            callback: GameApp.Util.isFunc(s2) ? s2 : s3,
            title: GameApp.Util.isString(s2) ? s2 : "Success",
            btnText: "OK"
        });
    },
    alertError: function (s1, s2, s3) {
        this.alert({
            msg: s1,
            callback: GameApp.Util.isFunc(s2) ? s2 : s3,
            title: GameApp.Util.isString(s2) ? s2 : "Error",
            btnText: "OK"
        });
    },
    confirm: function (msg, title, buttonLabels, callback) {

        if (GameApp.Device.isMobileDeviceReady) {
            navigator.notification.confirm(
                    msg, // message
                    callback, // callback to invoke with index of button pressed
                    title, // title
                    buttonLabels     // buttonLabels
                    );
        } else {

        }
    }
});
