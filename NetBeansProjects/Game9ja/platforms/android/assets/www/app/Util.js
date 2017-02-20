

Ext.define('GameApp.Util', {
    singleton: true,

    isFunc: function (fn) {
        return typeof fn === "function";
    },
    isString: function (fn) {
        return typeof fn === "string";
    },
    isArray: function (a) {
        return a && a.constructor === Array;
    }
});