
/*RCall is a technique design  by Chuks to remotely make calls to function.
 * This is done by specifying the class name and its method to access in the 
 * remote end. Parameters can also be passed to the remote method.
 * 
 * The advantage of this technique is that unlike RESTful API where each request
 * is made for a number of actions , in RCall you can send multiple calls in just
 * one http request. That is to say that you can call a number of methods remotely
 * in just one http request. Thus saving bandwidth.
 * 
 * 
 */

Ext.define('GameApp.RCall', {
    singleton: true,

    exec: function (param) {
        var r;
        if (arguments.length === 1) {
            if ((r = validateSingeArg(param))) {
                ajaxExec(r.objArr, r.callback);
            }
        } else {
            if ((r = validateMultiArgs(arguments))) {
                ajaxExec(r.objArr, r.callback);
            }
        }

        function validateMultiArgs(arr) {
            //either the firs or the last parameter must be a function otherwise error
            if (!GameApp.Util.isFunc(arr[0]) && !GameApp.Util.isFunc(arr[arr.length])) {
                console.warn("No callback function for RCall - must be the first or last parameter. Cannot also be both");
                return;
            }

            if (GameApp.Util.isFunc(arr[0]) && GameApp.Util.isFunc(arr[arr.length])) {
                console.warn("Call function for RCall cannot be both the first and last parameter at same time! Choose one.");
                return;
            }

            if (arr.length < 3) {
                console.warn("Incomplete RCall parameter! must be atleast 3");
                return;
            }
            var fnStart = GameApp.Util.isFunc(arr[0]);
            var argStart = fnStart ? 0 : 1;

            var obj = {};
            var callback = fnStart ? arr[0] : arr[arr.length];
            obj.class = arr[fnStart];
            obj.method = arr[fnStart + 1];
            obj.param = [];
            for (var i = argStart; i < arr.length - 1; i++) {
                obj.param.push(arr[i]);
            }

            return {objArr: [obj], callback: callback};
        }

        function validateSingeArg(p) {
            var param_arr = GameApp.Util.isArray(p) ? p : [p];
            if (param_arr.length === 0) {
                console.warn("Empty RCall request!");
                return;
            }
            var o_arr = [];
            for (var i in param_arr) {
                var obj = param_arr[i];
                if (!GameApp.Util.isFunc(obj.callback)) {
                    console.warn("RCall callback function not provided.");
                    return;
                }


                if (obj.class && typeof obj.class !== "string") {
                    console.warn("RCall class invalid - must be a string type if provided.");
                    return;
                }

                if (!obj.method) {
                    console.warn("RCall method not provided.");
                    return;
                }

                if (typeof obj.method !== "string") {
                    console.warn("RCall method invalid - must be a string type.");
                    return;
                }

                obj.method = GameApp.Util.replaceAll(obj.method, ".", "/");

                if (!obj.class) {
                    if (obj.method.indexOf("/") < 0) {
                        console.warn("RCall method invalid - must carry the qualified class name if class is not explicitly defined. e.g authos.EnglishBook.getCount");
                        return;
                    } else {
                        var index = obj.method.lastIndexOf("/");
                        obj.class = obj.method.substring(0, index + 1);
                        obj.method = obj.method.substring(index + 1);
                    }
                }

                var o = {};

                o.class = obj.class;
                o.method = obj.method;

                o.param = obj.param !== null && typeof obj.param !== "undefined" ?
                        (obj.param.constructor === Array ? obj.param : [obj.param]) : null;
                o_arr.push(o);
            }

            return {objArr: o_arr, callback: obj.callback};
        }

        function ajaxExec(objArr, callback) {

            var xhttp;
            if (window.XMLHttpRequest) {
                // code for modern browsers
                xhttp = new XMLHttpRequest();
            } else {
                // code for old IE browsers e.g IE6, IE5
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhttp.onreadystatechange = function () {
                var respose = {};
                if (this.readyState - 0 === 4 && this.status - 0 === 200) {
                    respose.success = true;
                    respose.status = this.statusText;
                    respose.data = this.responseText;
                    try {
                        //try to convert to object
                        respose.data = JSON.parse(respose.data);
                        callback(respose);
                    } catch (e) {
                        //not an object
                        callback(respose);
                    }

                } else if (this.status - 0 > 200) {
                    respose.success = false;
                    respose.status = this.statusText;
                    callback(respose);
                }
            };

            //rcall is the route path to all RCall requests
            xhttp.open("POST", "rcall", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(objArr));
        }
    }
});
