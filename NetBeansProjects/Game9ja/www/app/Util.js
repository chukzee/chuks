

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
    },
    replaceAll: function (str, regex, subStr) {
        var s = new String(str);
        var sr;
        while (true) {
            sr = s;
            s = s.replace(regex, subStr);
            if (sr === s) {
                //no change so break
                break;
            }
        }
        return s;
    },
    /**
     * Automaticlally destorys the underlying object if the onHide event method is fired.
     * Typically used for destroying ui components when hidden
     */
    onHideThenDestroy: {
        onHide: function () {
            this.destroy();
            return true;
        }
        , onDestroy: function () {//Note: this method is deprecated as of ExtJS 6.2.*
            //alert("destroy"); // UNCOMENT TO SEE IT IN ACTION
            return true;
        }
    },

});