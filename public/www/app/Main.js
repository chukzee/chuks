alert('main 0');

var Main = {};

alert('main 1');


(function () {
alert('main 2');
    var isPageInit = false;
    var pageRouteUrl;
    var isMainInit;
    var deviceUrl = "device/";
    var device_category;
    var portriat_width;
    var portriat_height;
    var appUrl = "app/";
    var listeners = {};
    Main.controller = {}; // js in the controller folder will dynamically use this prototype
    Main.ro = {};// object for storing global access for rcall variables for making remote method calls

    Main.helper = new function () {

        var loadDefaultPhoto = function (evt, available) {

            if (!evt.target) {
                console.warn('event target is undefined! this may be caused by '
                        + 'invalid call or use of method to get default'
                        + ' profile photo - make sure the event is passed as parameter');
                return;
            }

            //check if last error is due to failure to load the default image.
            //we will terminate the process if the default image was not found
            if (evt.target.src.endsWith('/' + available)) {
                evt.target.error = null; // terminate the process
                console.warn('Could not load the default profile photo! Probably not found.');
                return;//leave
            }

            evt.target.src = available;//get the default image
        };

        this.loadDefaultProfilePhoto = function (evt) {
            loadDefaultPhoto(evt, 'app/images/default_person.png');
        };

        this.loadDefaultGroupPhoto = function (evt) {
            loadDefaultPhoto(evt, 'app/images/default_group.png');
        };


        this.loadDefaultTournamentPhoto = function (evt) {
            loadDefaultPhoto(evt, 'app/images/default_tournament.png');
        };

    };

    function xhrReq(send, method, url) {
        var data, successFn, errorFn, completeFn;
        if (arguments.length === 4) {
            completeFn = arguments[3];
        }
        if (arguments.length === 5) {
            successFn = arguments[3];
            errorFn = arguments[4];
        }
        if (arguments.length === 6) {
            data = arguments[3];
            successFn = arguments[4];
            errorFn = arguments[5];
        }
        var xhttp;
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for old IE browsers e.g IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = function () {
            if (this.readyState - 0 === 4) {
                if (this.status - 0 === 200) {
                    if (Main.util.isFunc(successFn)) {
                        successFn(this.responseText, this.status);
                    } else if (Main.util.isFunc(completeFn)) {
                        completeFn(this.responseText, this.status);
                    }
                } else {
                    if (Main.util.isFunc(errorFn)) {
                        errorFn(this.statusText, this.status);
                    } else if (Main.util.isFunc(completeFn)) {
                        completeFn(this.statusText, this.status);
                    }
                }
            }
        };

        //rcall is the route path to all RCall requests
        var param = '';
        var headers;
        if (data) {
            if (Main.util.isString(data)) {
                param = data;
            } else {
                headers = data.headers;
                if (Main.util.isString(data.param)) {
                    param = data.param;
                } else {
                    for (var n in data.param) {
                        param += n + '=' + data.param[n] + "&";
                    }
                    if (param) {
                        param = param.substring(0, param.length - 1);//remove the last character &
                    }
                }

            }
        }


        send(xhttp, method, url, param, headers);
    }

    function callListeners(arr, argu) {
        if (!arr) {
            return;
        }
        for (var i = 0; i < arr.length; i++) {
            try {
                if (!Object.prototype.hasOwnProperty.call(arr[i], 'data')) {
                    arr[i].data = {};
                }
                if (argu && !Object.prototype.hasOwnProperty.call(argu, 'data')) {
                    argu.data = {};
                }
                arr[i].fn(argu, arr[i].data);
            } catch (e) {
                console.log(e);
            }

        }
    }

    Main.ajax = {
        get: function () {
            var argu = [];
            argu.push(sendGet);
            argu.push("GET");
            for (var i = 0; i < arguments.length; i++) {
                argu.push(arguments[i]);
            }
            xhrReq.apply(this, argu);
            function sendGet(xhttp, method, url, param, headers) {
                xhttp.open(method, url + (param ? ('?' + param) : ''), true);
                for (var name in headers) {
                    xhttp.setRequestHeader(name, headers[name]);
                }

                xhttp.send();

            }

        },
        post: function () {
            var argu = [];
            argu.push(sendPost);
            argu.push("POST");
            for (var i = 0; i < arguments.length; i++) {
                argu.push(arguments[i]);
            }
            xhrReq.apply(this, argu);
            function sendPost(xhttp, method, url, param, headers) {
                xhttp.open(method, url, true);

                for (var name in headers) {
                    xhttp.setRequestHeader(name, headers[name]);
                }
                if (!headers) {
                    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//default
                }
                xhttp.send(param);
            }
        }
    };

    Main.device = {

        isMobileDeviceReady: false,

        constructor: function (config) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        },

        // deviceready Event Handler
        //
        // Bind any cordova events here. Common events are:
        // 'pause', 'resume', etc.
        onDeviceReady: function () {
            //using 'this' to access isMobileDeviceReady variable is only possible
            //because of the bind(this) in the constructor above - the 'this' of the
            //Main.device class instance is bind to onDeviceReady.
            this.isMobileDeviceReady = true;
        },

        getCategory: function () {
            return device_category;
        },

        isSmall: function () {
            return device_category === "small";
        },

        isMedium: function () {
            return device_category === "medium";
        },

        isLarge: function () {
            return device_category === "large";
        },

        isXLarge: function () {
            return window.innerWidth > 800; //important! checking current width of  screen 
        },
        getPortriatInnerWidth: function () {
            return window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
        },
        getPortriatInnerHeight: function () {
            return window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
        },
        getPortriatWidth: function () {
            return portriat_width;
        },
        getPortriatHeight: function () {
            return portriat_height;
        },
        getLandscapeWidth: function () {
            return Main.device.getPortriatHeight();
        },
        getLandscapeHeight: function () {
            return Main.device.getPortriatWidth();
        }
    };


    Main.util = {

        isFunc: function (fn) {
            return typeof fn === "function";
        },
        isString: function (str) {
            return typeof str === "string";
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

    };


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

    function RCall() {

        var rcallWaitingFn = [];
        var isGetRcallLive = false;
        var rcalFailures = {};

        this.live = function () {
            var objInst, fn;

            if (arguments.length === 1) {
                if (Main.util.isFunc(arguments[0])) {//where only function is passed
                    fn = arguments[0];
                    if (isGetRcallLive) {
                        rcallWaitingFn.push(fn);
                        return;
                    }

                    //console.log('Object.getOwnPropertyNames(rcalFailures)  ', Object.getOwnPropertyNames(rcalFailures));
                    //console.log('Object.getOwnPropertyNames(rcalFailures).length  ', Object.getOwnPropertyNames(rcalFailures).length);

                    if (Object.getOwnPropertyNames(rcalFailures).length > 0) {
                        this.live(rcalFailures, arguments[0]);
                        //retry the failures
                        return;
                    }

                } else {
                    objInst = arguments[0];
                }
            } else {
                objInst = arguments[0];
                fn = arguments[1];
            }

            var classes = [];
            for (var n in objInst) {
                var cls = objInst[n];
                if (Main.util.isString(cls)) {
                    if (classes.indexOf(cls) === -1) {//avoid duplicate
                        classes.push(cls);
                    }
                    rcalFailures[n] = cls;//save - we shall delete if the operation is successful
                }
            }

            if (classes.length === 0) {
                if (Main.util.isFunc(fn)) {
                    try {
                        fn();
                    } catch (e) {
                        console.warn(e);
                    }

                }
                return;
            }

            isGetRcallLive = true;
            var data = {
                headers: {
                    'Content-Type': 'application/json'
                },
                param: JSON.stringify({action: 'init_variables', data: classes})
            };
            Main.ajax.post('rcall', data,
                    function (res) {
                        for (var n in objInst) {
                            delete rcalFailures[n]; //the operation is successful so delete the entry
                        }

                        isGetRcallLive = false;
                        var json = JSON.parse(res);
                        var data = json.data;
                        if (!json.success) {
                            rcallErr(data);
                            return;
                        }
                        for (var rem_classs in data) {
                            var rem_methods = data[rem_classs];
                            for (var variable in objInst) {
                                var clsName = objInst[variable];
                                if (clsName !== rem_classs) {
                                    continue;
                                }

                                for (var k = 0; k < rem_methods.length; k++) {
                                    var method = rem_methods[k];
                                    var promiseFn = function () {
                                        this._getFn;
                                        this._errFn;
                                        var me = this;
                                        this.get = function (fn) {
                                            this._getFn = fn;
                                            return me;
                                        };
                                        this.error = function (fn) {
                                            this._errFn = fn;
                                            return me;
                                        };
                                        return this;
                                    };
                                    if (k === 0) {
                                        objInst[variable] = {};
                                    }

                                    objInst[variable][method] = remoteMethod.bind({
                                        class: rem_classs,
                                        method: method,
                                        promiseFn: promiseFn
                                    });

                                    Main.ro[variable] = objInst[variable]; // set the global variable for rcall

                                    function remoteMethod() {

                                        var className = this.class;
                                        var method = this.method;
                                        var promise = this.promiseFn();
                                        var argu = arguments;

                                        Main.rcall.exec({
                                            class: className,
                                            method: method,
                                            param: argu,
                                            callback: function (reponse) {
                                                if (reponse.success) {
                                                    if (Main.util.isFunc(promise._getFn)) {
                                                        promise._getFn(reponse.data);
                                                    }
                                                } else {
                                                    if (Main.util.isFunc(promise._errFn)) {
                                                        promise._errFn(reponse.data);
                                                    }
                                                }
                                            }
                                        });

                                        return promise;
                                    }

                                }

                            }
                        }

                        if (Main.util.isFunc(fn)) {
                            try {
                                fn();
                            } catch (e) {
                                console.warn(e);
                            }

                        }
                        for (var rem_classs = 0; rem_classs < rcallWaitingFn.length; rem_classs++) {
                            if (Main.util.isFunc(rcallWaitingFn[rem_classs])) {
                                rcallWaitingFn[rem_classs]();
                            }
                        }
                        rcallWaitingFn = [];
                    },
                    function (statusText, status) {
                        rcallErr('rcall failed! Could not get resource. Status text : ' + statusText);
                    });

            function rcallErr(log) {
                rcallWaitingFn = [];
                isGetRcallLive = false;
                console.warn(log);
            }


        };

        this.exec = function (param) {
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

            function validateMultiArgs(argu) {
                //either the first or the last parameter must be a function otherwise error
                if (!Main.util.isFunc(argu[0]) && !Main.util.isFunc(argu[argu.length])) {
                    console.warn("No callback function for RCall - must be the first or last parameter. Cannot also be both");
                    return;
                }

                if (Main.util.isFunc(argu[0]) && Main.util.isFunc(argu[argu.length])) {
                    console.warn("Call function for RCall cannot be both the first and last parameter at same time! Choose one.");
                    return;
                }

                if (argu.length < 3) {
                    console.warn("Incomplete RCall parameter! must be atleast 3");
                    return;
                }
                var fnStart = Main.util.isFunc(argu[0]);
                var argStart = fnStart ? 0 : 1;

                var obj = {};
                var callback = fnStart ? argu[0] : argu[argu.length];
                obj.class = argu[fnStart];
                obj.method = argu[fnStart + 1];
                obj.param = [];
                for (var i = argStart; i < argu.length - 1; i++) {
                    obj.param.push(argu[i]);
                }

                return {objArr: [obj], callback: callback};
            }

            function validateSingeArg(p) {
                var param_arr = Main.util.isArray(p) ? p : [p];
                if (param_arr.length === 0) {
                    console.warn("Empty RCall request!");
                    return;
                }
                var o_arr = [];
                for (var i in param_arr) {
                    var obj = param_arr[i];
                    if (!Main.util.isFunc(obj.callback)) {
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

                    obj.method = Main.util.replaceAll(obj.method, ".", "/");

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

                    var argu = [];
                    for (var n in obj.param) {//ensure it is an array
                        argu[n] = obj.param[n];//convert to array
                    }
                    obj.param = argu;



                    o.param = obj.param !== null && typeof obj.param !== "undefined" ?
                            (obj.param.constructor === Array ? obj.param : [obj.param]) : null;

                    o_arr.push(o);
                }

                return {objArr: o_arr, callback: obj.callback};
            }

            function ajaxExec(objArr, callback) {
                var data = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    param: JSON.stringify({action: 'remote_call', data: objArr})
                };

                Main.ajax.post('rcall', data,
                        function (res) {
                            var json = JSON.parse(res);
                            callback(json);
                        },
                        function (statusText, status) {
                            var respose = {};
                            respose.success = false;
                            respose.status = statusText;
                            callback(respose);
                        });
            }
        };
    }


    function Animate() {
        this.to = function (element, duration, propObj, callback) {
            if (!element) {
                return;
            }
            var el = Main.util.isString(element) ? document.getElementById(element) : element;
            var tween = propObj;
            tween.onComplete = callback;
            if (window.TweenMax) {
                TweenMax.to(el, duration / 1000, tween);
            } else if (window.TweenLite) {
                TweenLite.to(el, duration / 1000, tween);
            } else if (window.$) {
                $(el).animate(propObj, duration, callback);
            } else {

            }
        };
    }

    function Event() {

        var evtList = {};
        /**
         * Used to register an event listener
         * 
         * @param {type} evt_name - The name of the event
         * @param {type} func -  The callback of the event
         * @returns {undefined}
         */
        this.on = function (evt_name, func) {
            if (!evtList[evt_name]) {
                evtList[evt_name] = [];
            }
            if (Main.util.isFunc(func)) {
                evtList[evt_name].push(func);
            }
        };
        /**
         * Used to remove an event listener
         * 
         * 
         * @param {type} evt_name  - The name of the  event
         * @param {type} func - (option) the callback function attached to the event that should be removed only. If not specified the event and all its callbacks will be removed
         * @returns {undefined}
         */
        this.remove = function (evt_name, func) {

            if (evtList[evt_name] && !func) {
                evtList[evt_name] = null;
            } else if (evtList[evt_name]) {
                var evt = evtList[evt_name];
                for (var f in evt) {
                    if (evt[f] === func) {
                        evt[f].splice(f, 1);
                    }
                }
            }
        };
        /**
         * Used to fire an event.
         * The first parameter is the event name and the other parameters are 
         * the arguments to be passed to the  listener callback function
         * 
         * @param {type} evt_name - The name of the event
         * @returns {undefined}
         */
        this.fire = function (evt_name) {
            var argus = [];
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    argus[i - 1] = arguments[i];
                }
            }
            if (evtList[evt_name]) {
                var evt = evtList[evt_name];
                for (var f in evt) {
                    try {
                        evt[f].apply(this, argus);
                    } catch (e) {
                        console.warn(e);
                    }

                }
            }
        };


    }


    return Main;
})();