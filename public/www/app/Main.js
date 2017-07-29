

var Main = {};


(function () {

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
            alert('2');
            if (this.readyState - 0 === 4) {
                alert('2a');
                if (this.status - 0 === 200) {
                    alert('2b');
                    if (Main.util.isFunc(successFn)) {
                        alert('2b s');
                        successFn(this.responseText, this.status);
                        alert('2b s1');
                    } else if (Main.util.isFunc(completeFn)) {
                        alert('2b s2');
                        completeFn(this.responseText, this.status);
                        alert('2b s3');
                    }
                } else {
                    alert('2c');
                    if (Main.util.isFunc(errorFn)) {
                        alert('2d');
                        errorFn(this.statusText, this.status);
                        alert('2e');
                    } else if (Main.util.isFunc(completeFn)) {
                        alert('2f');
                        completeFn(this.statusText, this.status);
                        alert('2g');
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
                
                alert('1');
                
                xhttp.send();
                
                alert('1a');
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
            return window.screen.width > 800; //important! checking current width of  screen 
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


    function Page() {
        var pages = [];
        var effDuration = 0.5;//default effect duration
        var lastPageUrl;
        var transitionInProgress = false;
        function swapShow(pg, transition, forward, pgGoOut) {
            var eff = transition, duration = effDuration;
            if (transition && !Main.util.isString(transition)) {//not string then object!
                eff = transition.effect;
                duration = transition.duration;
            }
            var eff = eff ? eff.toLowerCase() : null;
            duration = duration ? duration : 0;
            var pageIn = pg.page;
            var pageOut;

            for (var i = 0; i < pages.length; i++) {
                if (pages[i].url === lastPageUrl) {
                    pageOut = pages[i].page;
                    break;
                }
            }

            initPageInOut(pageIn, pageOut);

            if (eff === "fadein" || eff === "fadeout") {
                fadePg(pageIn, pageOut, duration, forward, pgGoOut);
            } else if (eff === "slideup" || eff === "slidedown") {
                slideVertPg(pageIn, pageOut, duration, forward, pgGoOut);
            } else if (eff === "slideleft" || eff === "slideright") {
                slideHorizPg(pageIn, pageOut, duration, forward, pgGoOut);
            } else {
                pageIn[0].style.opacity = 1;
                $(pageIn).show();
                if (pageOut) {
                    pageOut[0].style.opacity = 1;
                    $(pageOut).hide();
                }
                afterPageChange(pageIn, pgGoOut);
            }

            lastPageUrl = pg.url;

            if (pg.title) {
                document.title = pg.title;
            }
        }
        function initPageInOut(pageIn, pageOut) {

            pageIn[0].style.opacity = 0;
            pageIn[0].style.top = "0%";
            pageIn[0].style.left = "0%";
            pageIn[0].style.display = "block";


            if (pageOut) {
                pageOut[0].style.opacity = 1;
                pageOut[0].style.top = "0%";
                pageOut[0].style.left = "0%";
                pageOut[0].style.display = "block";

            }
        }
        function fadePg(pageIn, pageOut, duration, forward, pgGoOut) {
            transitionInProgress = true;

            var jqIn = {};
            jqIn.opacity = 1;
            var onCompleteIn = function () {
                afterPageChange(pageIn, pgGoOut);
            };

            var jqOut = {};
            jqOut.opacity = 0;
            var onCompleteOut = function () {
                afterPageChange(pageIn, pgGoOut);
            };

            var tweenIn = {opacity: jqIn.opacity, onComplete: onCompleteIn};
            var tweenOut = {opacity: jqOut.opacity, onComplete: onCompleteOut};

            if (window.TweenMax) {
                TweenMax.to(pageIn, duration / 1000, tweenIn);
                TweenMax.to(pageOut, duration / 1000, tweenOut);
            } else if (window.TweenLite) {
                TweenLite.to(pageIn, duration / 1000, tweenIn);
                TweenLite.to(pageOut, duration / 1000, tweenOut);
            } else if (window.$) {
                $(pageIn).animate(jqIn, duration, onCompleteIn);
                $(pageOut).animate(jqOut, duration, onCompleteOut);
            } else {
                transitionInProgress = false;
            }
        }

        function slideVertPg(pageIn, pageOut, duration, forward, pgGoOut) {
            transitionInProgress = true;
            pageIn[0].style.top = forward ? "100%" : "-100%";
            pageIn[0].style.opacity = 1;

            var body_overflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            pageOut[0].style.overflow = "hidden";
            var first, second;

            var jqIn = {};
            jqIn.top = "0%";
            var onCompleteIn = function () {
                first = true;
                if (first && second) {
                    document.body.style.overflow = body_overflow;
                    afterPageChange(pageIn, pgGoOut);
                }

            };

            var jqOut = {};
            jqOut.top = forward ? "-100%" : "100%";
            var onCompleteOut = function () {
                second = true;
                if (first && second) {
                    document.body.style.overflow = body_overflow;
                    afterPageChange(pageIn, pgGoOut);
                }

            };

            var tweenIn = {top: jqIn.top, onComplete: onCompleteIn};
            var tweenOut = {top: jqOut.top, onComplete: onCompleteOut};

            if (window.TweenMax) {
                TweenMax.to(pageIn, duration / 1000, tweenIn);
                TweenMax.to(pageOut, duration / 1000, tweenOut);
            } else if (window.TweenLite) {
                TweenLite.to(pageIn, duration / 1000, tweenIn);
                TweenLite.to(pageOut, duration / 1000, tweenOut);
            } else if (window.$) {
                $(pageIn).animate(jqIn, duration, onCompleteIn);
                $(pageOut).animate(jqOut, duration, onCompleteOut);
            } else {
                transitionInProgress = false;
            }
        }

        function slideHorizPg(pageIn, pageOut, duration, forward, pgGoOut) {
            transitionInProgress = true;
            pageIn[0].style.left = forward ? "100%" : "-100%";
            pageIn[0].style.opacity = 1;

            var body_overflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            pageOut[0].style.overflow = "hidden";
            var first, second;

            var jqIn = {};
            jqIn.left = "0%";
            var onCompleteIn = function () {
                first = true;
                if (first && second) {
                    document.body.style.overflow = body_overflow;
                    afterPageChange(pageIn, pgGoOut);
                }

            };

            var jqOut = {};
            jqOut.left = forward ? "-100%" : "100%";
            var onCompleteOut = function () {
                second = true;
                if (first && second) {
                    document.body.style.overflow = body_overflow;
                    afterPageChange(pageIn, pgGoOut);
                }

            };

            var tweenIn = {left: jqIn.left, onComplete: onCompleteIn};
            var tweenOut = {left: jqOut.left, onComplete: onCompleteOut};

            if (window.TweenMax) {
                TweenMax.to(pageIn, duration / 1000, tweenIn);
                TweenMax.to(pageOut, duration / 1000, tweenOut);
            } else if (window.TweenLite) {
                TweenLite.to(pageIn, duration / 1000, tweenIn);
                TweenLite.to(pageOut, duration / 1000, tweenOut);
            } else if (window.$) {
                $(pageIn).animate(jqIn, duration, onCompleteIn);
                $(pageOut).animate(jqOut, duration, onCompleteOut);
            } else {
                transitionInProgress = false;
            }

        }

        function afterPageChange(pageIn, pgGoOut) {
            transitionInProgress = false;
            pageIn[0].style.overflow = "auto";
            if (pgGoOut) {
                $(pgGoOut).remove();
            }
        }

        function showPg(p, transition, forward, pgGoOut, pgShowObj) {

            if (Main.util.isString(p)) {//is url string
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].url === p) {
                        p = pages[i];
                        break;
                    }
                }
            }

            if (p.url === lastPageUrl) {
                return;//already showing!
            }

            //call pagebeforeshow listerners

            callListeners(listeners["pagebeforeshow"], {pageUrl: p.url, data: p.data});

            if (pgShowObj && pgShowObj.onBeforeShow) {
                try {
                    pgShowObj.onBeforeShow(p.data);
                } catch (e) {
                    console.warn(e);
                }
            }

            //now show
            swapShow(p, transition, forward, pgGoOut);

            //call pageshow listerners
            callListeners(listeners["pageshow"], {pageUrl: p.url, data: p.data});

            if (pgShowObj && pgShowObj.onShow) {
                try {
                    pgShowObj.onShow(p.data);
                } catch (e) {
                    console.warn(e);
                }
            }
        }

        function refactorBody(container, selector) {
            var sel = selector ? selector : 'body';
            var children = $(container).find(sel).children();
            var content = [];

            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeName !== 'SCRIPT'
                        && children[i].nodeName !== 'LINK'
                        && children[i].nodeName !== 'META'
                        && children[i].nodeName !== 'TITLE') {
                    content.push(children[i]);
                    $(children[i]).remove();
                }
            }

            //Just in case there are any embeded unwanted element, remove them.
            //We do not want to unitentionally execute script more than once.            
            $(content).find('title , script , link , meta').each(function (index) {
                this.remove();
            });

            var style = "style='opacity: 0; position:absolute; width: 100%;"
                    + " height:100%; top; 0%; left:0%;'";

            var cont = $("<div data-app-content='page' " + style + "></div>").append(content);

            var pg = $('body')
                    .append(cont);

            /*MAY NOT BE NECCESSARY SINCE 'overflow: auto' hides the scroll bar which is what we want.
             *  see afterPageChange method where the overflow is set to auto.
             * - observed only in android browser so far though.
             *            
             //The code below will only run on mobile device browser or browser that support touch event.
             //Show scroll bar only if the user attempts to scroll otherwise hide it.
             var bc = document.body.children;
             var last_pg;
             for (var i = 0; i < bc.length; i++) {
             if (bc[i].tagName === 'DIV') {
             last_pg = bc[i];
             }
             }
             if (last_pg) {
             last_pg.addEventListener('touchmove', function () {//show scroll bar
             if (!transitionInProgress) {
             this.el.style.overflow = 'auto';
             }
             
             }.bind({el: last_pg}));
             
             last_pg.addEventListener('touchend', function (evt) {//show scroll bar
             if (!transitionInProgress) {
             this.el.style.overflow = 'hidden';
             }
             
             }.bind({el: last_pg}));
             
             last_pg.addEventListener('touchcancel', function (evt) {//show scroll bar
             if (!transitionInProgress) {
             this.el.style.overflow = 'hidden';
             }
             
             }.bind({el: last_pg}));
             }
             */

            console.log(pg.html());

            return cont;
        }

        function load(p, transition, forward, data, pgShowObj) {
            var url = Main.util.isString(p) ? p : p.url;

            for (var pg_index = 0; pg_index < pages.length; pg_index++) {
                if (pages[pg_index].url === url) {
                    if (pg_index === 0) {
                        //handle home page differently
                        Main.page.home({transition: transition, data: data});
                        return;
                    }
                    //Make the page the last page in the list.
                    if (pg_index === pages.length - 1) {
                        //skip the last in the page list -  the last page is already
                        //at the end so no need to make it last.
                        showPg(url, transition, forward, null, pgShowObj);
                        return;
                    }
                    //now make it the last page
                    var pg = pages[pg_index];
                    pages.splice(pg_index, 1);
                    pages.push(pg);
                    //modify the DOM to send the page to the last
                    var children = $('body').children();
                    var pos = -1;
                    for (var k = 0; k < children.length; k++) {
                        if ($(children[k]).attr('data-app-content') === 'page') {
                            pos++;
                            if (pos === pg_index) {
                                $(children[k]).remove();//remove from this postion
                                $('body').append(children[k]);//append to the end                                
                                //clear all previous event listeners
                                // $(document).add("*").off();//deprecate - incorrect!
                                var lastPage = pages[pages.length - 1];
                                //call relevant event listeners
                                callListeners(listeners["ready"]);
                                callListeners(listeners["pagecreate"], {pageUrl: lastPage.url, data: lastPage.data});
                                showPg(url, transition, forward, null, pgShowObj);
                                break;
                            }
                        }
                    }
                    return;
                }
            }

            $.get(pageRouteUrl + url, function (response) {

                var found = false;
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].url === url) {
                        found = true;
                        break;
                    }
                }

                if (!found) {

                    var pg_recv = $("<div></div>").html("<div data-app-content='page'>" + response + "</div>");
                    var title = pg_recv.find('title').html();
                    var pg = refactorBody(pg_recv, "[data-app-content=page]");

                    $('body').append(pg);

                    pages.push({
                        url: url,
                        data: data,
                        transition: transition,
                        title: title,
                        page: pg
                    });

                    //clear all previous event listeners
                    //$(document).add("*").off();//deprecate - incorrect!
                    var lastPage = pages[pages.length - 1];
                    //call relevant event listeners
                    callListeners(listeners["ready"]);
                    callListeners(listeners["pagecreate"], {pageUrl: lastPage.url, data: lastPage.data});

                }

                showPg(url, transition, forward, null, pgShowObj);
            }).fail(function () {
                console.log("could not get resource:", url);
            });
        }

        this.home = function (obj) {
            if (transitionInProgress) {
                console.warn("Action ignored! Page transition in progress.");
                return false; //unsuccesful becasue page is in transition
            }
            var transition;
            var lastPage = pages[pages.length - 1];
            if (obj) {
                pages[0].data = obj.data;
                transition = obj.transition;
            } else {
                transition = lastPage.transition;//use last page transition
            }

            showPg(pages[0], transition, false, lastPage, _pShowFn(obj));

            //remove all pages except the home page
            for (var i = pages.length - 1; i > 0; i--) {// 'i > 0' ensures the home page in not removed
                pages.splice(i, 1);
            }

            //clear all other pages from the DOM except the home page
            var foundFirst = false;
            var children = $('body').children();
            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeName === 'SCRIPT') {
                    continue;
                }
                if ($(children[i]).attr('data-app-content') === 'page') {
                    if (foundFirst) {
                        children[i].remove();
                    }
                    foundFirst = true;
                }
            }

            return true;//important! - successful
        };


        this.back = function () {
            if (transitionInProgress) {
                console.warn("Action ignored! Page transition in progress.");
                return false; //unsuccesful becasue page is in transition
            }

            var pgGoOut;
            if (pages.length > 1) {//remove the last page but do not empty the array
                var last_index = pages.length - 1;
                var lastPage = pages[last_index];
                //remove also from the DOM
                var children = $('body').children();
                for (var i = children.length - 1; i > -1; i--) {
                    if (children[i].nodeName === 'SCRIPT') {
                        continue;
                    }
                    //get the out-going page whiche we shall remove from the
                    //DOM when the page change is complete
                    if ($(children[i]).attr('data-app-content') === 'page') {
                        pgGoOut = children[i];
                        break
                    }
                }
                var toPg = pages[pages.length - 2];
                showPg(toPg, lastPage.transition, false, pgGoOut);
                pages.splice(last_index, 1);//remove the last page
            }

            return true;//important!
        };

        this.show = function (obj) {
            if (transitionInProgress) {
                console.warn("Action ignored! Page transition in progress.");
                return false; //unsuccesful becasue page is in transition
            }
            var transit = {};
            if (!obj.transition) {
                transit.effect = obj.effect;
                transit.duration = obj.duration;
            } else {
                transit = obj.transition;
            }


            load(obj.url, transit, !(obj.forward === false), obj.data, _pShowFn(obj));
            return true;//important!
        };

        var _pShowFn = function (obj) {
            return {
                onShow: obj && obj.onShow ? obj.onShow : null,
                onBeforeShow: obj && obj.onBeforeShow ? obj.onBeforeShow : null
            };
        };

        this.init = function () {
            if (!isPageInit) {

                var pg = refactorBody(document);

                pages[0] = {
                    url: document.location.href,
                    title: document.title,
                    page: pg
                };

                callListeners(listeners["ready"]);
                callListeners(listeners["pagecreate"], {pageUrl: pages[0].url});

                showPg(pages[0], null, true);
                isPageInit = true;//yes, must be here
                return;
            }
        };

        return this;

    }


    function Listview() {
        var listTpl = {};
        var listTplWaitCount = {};
        var ListTplGetting = {};
        var _game9ja_Dom_Hold_Data = '_game9ja_Dom_Hold_Data_' + new Date().getTime(); // a unique property to be created in dom element for storing data
        var upOut = {};
        var downOut = {};
        var MAX_OFF = 15;//max number of elements off view before consodering remove element from dom.
        var MAX_REMAINING_OFF = MAX_OFF - 5;//max number of elements to be left after removal for excess 
        var MIN_REMAINING_OFF = MAX_REMAINING_OFF - 5;//number of elements off view before putting back the removed elements

        function listThis(html, obj) {

            var container_id = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;

            this.addItem = function (data) {//analogous to appendItem
                this.appendItem(data);
            };

            this.appendItem = function (data) {

                topCutOff(obj.container, obj.scrollContainer, container_id, html, obj);

                bottomCutOff(obj.container, obj.scrollContainer, container_id, html, obj);

                if (downOut[container_id].length) {
                    downOut[container_id].unshift(data);
                } else {
                    putItem(html, obj, data, doAppendItem);
                }

                /*
                 //TESTING!!!
                 if (downOut[container_id].length + $(obj.container).children().length === 100) {//TESTING!!! TO BE REMOVED
                 
                 for(var i=0; i<downOut[container_id].length; i++){
                 console.log(downOut[container_id][i].black_player_name);
                 }
                 }*/

            };

            this.prependItem = function (data) {

                bottomCutOff(obj.container, obj.scrollContainer, container_id, html, obj);

                topCutOff(obj.container, obj.scrollContainer, container_id, html, obj);

                if (upOut[container_id].length) {
                    upOut[container_id].unshift(data);
                } else {
                    putItem(html, obj, data, doPrependItem);
                }

                /*
                 //TESTING!!!
                 if (upOut[container_id].length + $(obj.container).children().length === 100) {//TESTING!!! TO BE REMOVED
                 
                 for(var i=0; i<upOut[container_id].length; i++){
                 console.log(upOut[container_id][i].black_player_name);
                 }
                 
                 }*/

            };

            //NOT YET TESTED
            this.removeItemAt = function (index) {
                if (index < 0) {
                    return;//important
                }
                var up_out = upOut[container_id];
                var down_out = downOut[container_id];
                var children = $(obj.container).children();
                if (index < up_out.length) {
                    up_out.splice(index, 1);
                } else if (index < up_out.length + children.length) {
                    var c_index = index - up_out.length;
                    var child = children[c_index];
                    if (child) {
                        child.remove();
                    }
                } else {
                    //TODO - NOT YET TESTED
                    var c_index = index - up_out.length - children.length;
                    down_out.splice(c_index, 1);
                }



            };

        }

        function putItem(html, obj, data, actionFn) {
            var item = tplParam(html, obj, data);
            actionFn(obj, data, item);
        }

        function tplParam(html, obj, data) {

            for (var name in data) {
                var value = data[name];
                var tpl_name = '{' + name + '}';
                var h;
                do {
                    h = html;
                    html = html.replace(tpl_name, value);
                } while (h !== html)

            }

            var content = $('<div '
                    + (obj.itemClass
                            && Main.util.isString(obj.itemClass)
                            ? (' class="' + obj.itemClass + '" ') : '')
                    + '></div>').html(html);

            //remove title and script tags if present
            $(content).find('title , script').each(function (index) {
                this.remove();
            });
            if (obj.wrapItem === false) {
                return content.html();
            }
            return content;
        }

        function doAppendItem(obj, data, item) {

            $(obj.container).append(item);

            var children = $(obj.container).children();
            var last = children[children.length - 1]; //last element

            //store the data to the dom element for tracking
            last[_game9ja_Dom_Hold_Data] = data;

        }

        function doPrependItem(obj, data, item) {

            $(obj.container).prepend(item);

            var children = $(obj.container).children();
            var first = children[0]; //first element

            //store the data to the dom element for tracking
            first[_game9ja_Dom_Hold_Data] = data;

        }

        function handle(html, obj) {
            var container_id = obj.container.charAt(0) === "#" ? obj.container.substring(1) : obj.container;
            if (!upOut[container_id]) {
                upOut[container_id] = []; // initialize
            }
            if (!downOut[container_id]) {
                downOut[container_id] = []; // initialize
            }


            $(obj.container).html('');//clear previous content

            $(obj.container).off("click");
            $(obj.container).on("click", onSelectItem.bind({container: obj.container, onSelect: obj.onSelect}));

            var cont_id = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;
            var parent = document.getElementById(cont_id);

            var lstThis = new listThis(html, obj);

            var onScroll = onScrollList.bind({obj: obj, itemHtml: html, container_id: cont_id, container: parent, scrollContainer: obj.scrollContainer});

            Main.dom.removeListener(obj.scrollContainer, 'scroll', onScroll, false);
            Main.dom.addListener(obj.scrollContainer, 'scroll', onScroll, false);

            try {
                obj.onReady.bind(lstThis)();
            } catch (e) {
                console.warn(e);
            }


        }

        function onScrollList(evt) {

            if (!this.lastScrollTop) {
                this.lastScrollTop = 0;
            }

            var count = 0;

            if (this.lastScrollTop < evt.target.scrollTop) {

                while (topCutOff(this.container, this.scrollContainer, this.container_id, this.itemHtml, this.obj)) {
                    //continue until no more cutoff

                    console.log('count topCutOff looping ', ++count);
                }
            } else {

                while (bottomCutOff(this.container, this.scrollContainer, this.container_id, this.itemHtml, this.obj)) {
                    //continue until no more cutoff

                    console.log('count bottomCutOff looping ', ++count);
                }
            }


            this.lastScrollTop = evt.target.scrollTop;
        }

        function topCutOff(_container, _scrollContainer, container_id, itemHtml, obj) {
            var container, scrollContainer;

            if (Main.util.isString(_container)) {
                var cid = _container.charAt(0) === '#' ? _container.substring(1) : _container;
                container = document.getElementById(cid);
            } else if (_container) {
                container = _container;
            } else {
                return;
            }

            if (Main.util.isString(_scrollContainer)) {
                var sid = _scrollContainer.charAt(0) === '#' ? _scrollContainer.substring(1) : _scrollContainer;
                scrollContainer = document.getElementById(sid);
            } else if (_scrollContainer) {
                scrollContainer = _scrollContainer;
            } else {
                return;
            }

            var firstChild = container.children[0];
            if (!firstChild) {
                return;
            }
            var firstChildBound = firstChild.getBoundingClientRect();
            var scrollBound = scrollContainer.getBoundingClientRect();

            var item_up_top = firstChildBound.top;
            var item_size = firstChildBound.height;
            if (!item_size || !scrollBound.height) {
                return;
            }

            var count_off_up = (scrollBound.top - item_up_top) / item_size;
            var up_out = upOut[container_id];
            var trim;
            if (count_off_up >= MAX_OFF) {
                var CUT_OFF = MAX_OFF - MAX_REMAINING_OFF;
                for (var i = 0; i < CUT_OFF; i++) {
                    var child = container.children[0];

                    if (container.removeChild(child)) {
                        var data = child[_game9ja_Dom_Hold_Data];
                        up_out.push(data);
                        trim = true;

                        console.log("removed top - child count = ", container.children.length);
                    }
                }
            }

            addBackBottomCutOff(container, scrollBound, container_id, itemHtml, obj);

            return trim;
        }

        function bottomCutOff(_container, _scrollContainer, container_id, itemHtml, obj) {
            var container, scrollContainer;

            if (Main.util.isString(_container)) {
                var cid = _container.charAt(0) === '#' ? _container.substring(1) : _container;
                container = document.getElementById(cid);
            } else if (_container) {
                container = _container;
            } else {
                return;
            }

            if (Main.util.isString(_scrollContainer)) {
                var sid = _scrollContainer.charAt(0) === '#' ? _scrollContainer.substring(1) : _scrollContainer;
                scrollContainer = document.getElementById(sid);
            } else if (_scrollContainer) {
                scrollContainer = _scrollContainer;
            } else {
                return;
            }

            var lastChild = container.children[container.children.length - 1];
            if (!lastChild) {
                return;
            }
            var lastChildBound = lastChild.getBoundingClientRect();
            var scrollBound = scrollContainer.getBoundingClientRect();

            var item_size = lastChildBound.height;
            if (!item_size || !scrollBound.height) {
                return;
            }

            var item_bottom = lastChildBound.top + lastChildBound.height;
            var scroll_cont_bottom = scrollBound.top + scrollBound.height;

            var count_off_bottom = (item_bottom - scroll_cont_bottom) / item_size;

            var down_out = downOut[container_id];
            var trim;
            if (count_off_bottom >= MAX_OFF) {
                var CUT_OFF = MAX_OFF - MAX_REMAINING_OFF;
                for (var i = 0; i < CUT_OFF; i++) {
                    var last_child = container.children[container.children.length - 1];

                    if (container.removeChild(last_child)) {
                        var data = last_child[_game9ja_Dom_Hold_Data];
                        down_out.push(data);
                        trim = true;

                        console.log("removed bottom - child count = ", container.children.length);
                    }
                }
            }


            addBackTopCutOff(container, scrollBound, container_id, itemHtml, obj);

            return trim;
        }

        function addBackTopCutOff(container, scrollBound, container_id, itemHtml, obj) {

            if (!upOut[container_id].length) {
                return;
            }

            var firstChild = container.children[0];
            if (!firstChild) {
                return;
            }
            var firstChildBound = firstChild.getBoundingClientRect();
            var item_up_top = firstChildBound.top;
            var item_size = firstChildBound.height;
            if (!item_size || !scrollBound.height) {
                return;
            }

            var count_off_up = (scrollBound.top - item_up_top) / item_size;
            var up_out = upOut[container_id];
            if (count_off_up < MAX_REMAINING_OFF) {
                var add_back_count = MAX_OFF - count_off_up;
                add_back_count = add_back_count > up_out.length ? up_out.length : add_back_count;

                for (var i = 0; i < add_back_count; i++) {
                    var last_index = up_out.length - 1;
                    if (last_index < 0) {
                        break;
                    }
                    var last_data = up_out[last_index];
                    putItem(itemHtml, obj, last_data, doPrependItem);
                    up_out.splice(last_index, 1);
                }

            }

        }


        function addBackBottomCutOff(container, scrollBound, container_id, itemHtml, obj) {

            if (!downOut[container_id].length) {
                return;
            }

            var lastChild = container.children[container.children.length - 1];
            if (!lastChild) {
                return;
            }

            var lastChildBound = lastChild.getBoundingClientRect();

            var item_size = lastChildBound.height;
            if (!item_size || !scrollBound.height) {
                return;
            }

            var item_bottom = lastChildBound.top + lastChildBound.height;
            var scroll_cont_bottom = scrollBound.top + scrollBound.height;

            var count_off_bottom = (item_bottom - scroll_cont_bottom) / item_size;
            var down_out = downOut[container_id];
            if (count_off_bottom < MAX_REMAINING_OFF) {
                var add_back_count = MAX_OFF - count_off_bottom;
                add_back_count = add_back_count > down_out.length ? down_out.length : add_back_count;

                for (var i = 0; i < add_back_count; i++) {
                    var last_index = down_out.length - 1;
                    if (last_index < 0) {
                        break;
                    }
                    var last_data = down_out[last_index];
                    putItem(itemHtml, obj, last_data, doAppendItem);
                    down_out.splice(last_index, 1);
                }

            }


        }


        function onSelectItem(evt) {
            var children = $(this.container).children();
            if (!children.length) {
                return;
            }

            var parent = evt.target;

            while (parent && parent !== document.body) {
                var saved_data = parent[_game9ja_Dom_Hold_Data];
                if (saved_data) {
                    if (Main.util.isFunc(this.onSelect)) {
                        //call the onSelect callback
                        try {
                            this.onSelect.bind({data: saved_data})(evt, saved_data);
                        } catch (e) {
                            console.warn(e);
                        }

                    }
                    break;
                }
                parent = parent.parentNode;
            }
        }


        this.create = function (obj) {
            if (!obj.tplUrl) {
                console.warn('missing list property - tplUrl');
                return;
            } else if (!Main.util.isString(obj.container)) {
                console.warn('missing list property or not a string - container');
                return;
            } else if (!Main.util.isFunc(obj.onReady)) {
                console.warn('missing list property or not a function - onReady');
                return;
            }

            if (!obj.scrollContainer) {
                obj.scrollContainer = obj.container;
                console.warn('scrollContainer property not provided and container property has be selected in it place! Is this your intention?');
            }

            var scrollEl = obj.scrollContainer;
            if (Main.util.isString(obj.scrollContainer)) {
                var sid = obj.scrollContainer.charAt(0) === '#' ? obj.scrollContainer.substring(1) : obj.scrollContainer;
                scrollEl = document.getElementById(sid);
            }

            scrollEl.style.overflow = 'auto';

            var me = this;
            var html = listTpl[obj.tplUrl];
            if (html) {
                handle(html, obj);
            } else {
                var url = pageRouteUrl + obj.tplUrl;
                if (ListTplGetting[obj.tplUrl] === obj.tplUrl) {
                    if (!listTplWaitCount[obj.tplUrl]) {
                        listTplWaitCount[obj.tplUrl] = [];
                    }
                    listTplWaitCount[obj.tplUrl].push(arguments);
                    return;
                }

                ListTplGetting[obj.tplUrl] = obj.tplUrl;
                $.get(url, function (response) {

                    listTpl[obj.tplUrl] = response;

                    handle(response, obj);
                    delete ListTplGetting[obj.tplUrl];
                    //consider list templates waiting
                    if (listTplWaitCount[obj.tplUrl]) {
                        var countWait = listTplWaitCount[obj.tplUrl].length;
                        if (countWait) {
                            for (var i = 0; i < countWait; i++) {
                                var argu = listTplWaitCount[obj.tplUrl][i];
                                me.create.apply(null, argu);
                            }
                            delete listTplWaitCount[obj.tplUrl];
                        }
                    }


                }).fail(function () {
                    delete listTplWaitCount[obj.tplUrl];
                    console.log("could not get resource:", url);
                });
            }

            /**
             * Get the data in the listview at the specified index
             * 
             */
            this.getData = function (index) {
                if (index < 0) {
                    return;//important
                }
                var container_id = this.container.charAt(0) === '#' ? this.container.substring(1) : this.container;
                var up_out = upOut[container_id];
                var down_out = downOut[container_id];
                var children = $(obj.container).children();
                if (index < up_out.length) {
                    return  up_out[index];
                } else if (index < up_out.length + children.length) {
                    var c_index = index - up_out.length;
                    var child = children[c_index];
                    if (child) {
                        return child[_game9ja_Dom_Hold_Data];
                    }
                } else {
                    //TODO - NOT YET TESTED
                    var c_index = index - up_out.length - children.length;
                    return down_out[index];
                }


            }.bind(obj);

            return this;
        };

    }

    function Busy() {

        var busyEl;

        /**
         * Usage
         * <br>
         * <br>
         * obj = { <br>
         *                 el : ...., //container element <br>
         *  defaultText [opt] : ...., //whether to display default text - true or false<br>
         *         text [opt] : ...., //text used to replace the default text <br>
         *         html [opt] : ...., //alternative html  <br>
         * }<br>
         * <br>
         * where '|' means 'or the property that follows'. <br>
         *      '....' means value<br>
         *       [opt] means optional property<br>
         *      
         * @param {type} obj
         * @returns {undefined}
         */
        this.show = function (obj) {
            this.hide();//hide previous one

            $(obj.el).append("<div data-app-content= 'busy' >" + (obj.html ? obj.html : defaultHtml(obj.defaulText, obj.text)) + "</div>");
            var children = $(obj.el).children();
            busyEl = children[children.length - 1];
            busyEl.style.position = 'absolute';
            busyEl.style.top = '0';
            busyEl.style.left = '0';
            busyEl.style.width = '100%';
            busyEl.style.height = '100%';
            busyEl.style.background = 'transparent';
            busyEl.style.zIndex = Main.const.Z_INDEX;//come back

        };

        this.hide = function () {
            if (busyEl) {
                busyEl.remove();
                busyEl = null;
            }
        };

        function defaultHtml(showText, txt) {
            var text = showText !== false ? 'Loading...' : ''; //strictly not equal to false
            text = txt ? txt : text;
            return '<div style="position: absolute; top: 50%; width: 100%; text-align: center;"><i class="fa fa-circle-o-notch fa-spin" style="margin-right: 3px;"></i>' + text + '</div>';//come back
        }

    }

    function Fullscreen() {

        var fullScreenElement = null;
        var effectFs = null;
        var hideFs = null;
        var showFs = null;
        var duration = 500;
        /**
         * Usage
         * <br>
         * <br>
         * obj = { <br>
         *    el | html | url : ....,<br>
         *       effect [opt] : ....,<br>
         *  closeButton [opt] : .....<br>
         *       onShow [opt] : .....<br>
         *       onHide [opt] : .....<br>
         * }<br>
         * <br>
         * where '|' means 'or the property that follows'. <br>
         *      '....' means value<br>
         *       [opt] means optional property<br>
         *      
         * @param {type} obj
         * @returns {undefined}
         */
        this.show = function (obj) {

            if ((obj.el && obj.html) || (obj.el && obj.url) || (obj.url && obj.html)) {
                throw new Error('Ambigious properties : must be only one of url , el , hmtl');
                return;
            }

            /*if (fullScreenElement) {//remove old one
             fullScreenElement.remove();
             fullScreenElement = null;
             }*/

            var children = $('body').children(); //.find("[data-app-content='fullscreen']")
            var content;
            for (var i = 0; i < children.length; i++) {
                if ($(children[i]).attr('data-app-content') === 'fullscreen') {
                    if (content) {
                        content.remove();//already found so remove - must be only one at a time.
                        continue;
                    }
                    content = children[i];
                    content.innerHTML = '';//set to empty
                    initFullscreen(content);
                }
            }
            if (!content) {
                $('body').append("<div data-app-content= 'fullscreen'></div>");
                children = $('body').children();
                content = children[children.length - 1];
                initFullscreen(content);
            }

            fullScreenElement = content;

            if (obj.url) {
                Main.ajax.get(obj.url,
                        function (res) {
                            $(content).append(res);
                            addClose(content, obj.closeButton);
                        },
                        function (err) {
                            if (fullScreenElement) {
                                fullScreenElement.remove();
                                fullScreenElement = null;
                            }
                            console.log("could not get resources - " + obj.url);
                        });
            } else if (obj.el) {
                $(content).append(obj.el);
                addClose(content, obj.closeButton);
            } else if (obj.html) {
                $(content).append(obj.html);
                addClose(content, obj.closeButton);
            }

            showFs = obj.onShow;
            hideFs = obj.onHide;

            //now fade in or slide. depending on the transition
            effectFs = obj.effect;
            if (!effectFs) {
                effectFs = "fadein";//default effect
            }

            Main.anim.to(fullScreenElement, duration, effectProp(effectFs), Main.util.isFunc(showFs) ? showFs : null);

        };


        function effectProp(effect, reverse) {
            effect = effect.toLowerCase();
            var prop = {};

            if (effect === 'fade' || effect === 'fadeout' || effect === 'fadein') {
                prop.opacity = 1;
                if (reverse) {
                    prop.opacity = 0;
                }
            }
            if (effect === 'slide' || effect === 'slideleft' || effect === 'slideright' || effect === 'slidein') {
                fullScreenElement.style.opacity = 1;
                if (reverse) {
                    prop.left = '100%';
                } else {
                    fullScreenElement.style.left = '100%';
                    prop.left = '0%';
                }
            }
            if (effect === 'slideup' || effect === 'slidedown') {
                fullScreenElement.style.opacity = 1;
                if (reverse) {
                    prop.top = '100%';
                } else {
                    fullScreenElement.style.top = '100%';
                    prop.top = '0%';
                }
            }

            return prop;
        }

        /**
         * Hide the fullscreen. Clean up to realease resources when do. 
         * @returns {undefined}
         */
        this.hide = function () {
            Main.anim.to(fullScreenElement, duration, effectProp(effectFs, true), cleanUp);
        };

        function addClose(content, close) {
            if (!close) {
                return;
            }
            var html = '<i class="fa fa-close" style="color:#777; cursor: pointer; position: absolute; top: 3px; right: 3px;"></i>';
            $(content).append(html);
            var children = $(content).children();
            var last = children[children.length - 1];
            $(last).on('click', Main.fullscreen.hide);
        }

        function initFullscreen(content) {
            content.style.position = 'absolute';
            content.style.top = '0%';
            content.style.left = '0%';
            content.style.width = '100%';
            content.style.height = '100%';
            content.style.background = 'black';
            content.style.opacity = 0;
            content.style.display = 'block';
            content.style.zIndex = Main.const.Z_INDEX;//come back
        }

        function cleanUp() {
            if (fullScreenElement) {
                fullScreenElement.remove();
                fullScreenElement = null;
            }

            if (Main.util.isFunc(hideFs)) {
                hideFs();
            }
        }

    }

    function Card() {
        var viewHtmls = {};
        var cards = {};
        function load(container_id, file, fn) {
            if (!viewHtmls[container_id]) {
                viewHtmls[container_id] = {};
            }

            var url = 'device/' + Main.device.getCategory() + '/' + file;

            var html = viewHtmls[container_id][url];
            if (html) {
                if (fn) {
                    fn(html);
                }
                return;
            }

            Main.ajax.get(url,
                    function (res) {
                        viewHtmls[container_id][url] = res;
                        if (fn) {
                            fn(res);
                        }
                    },
                    function (err) {
                        console.warn('could not get resource ', url);
                    });

        }

        this.to = function (obj) {
            var cid;
            if (!obj.url) {
                console.warn('invalid card url - ', obj.url);
                return;
            }
            if (Main.util.isString(obj.container)) {
                cid = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;
            } else {
                cid = $(obj.container).id();
            }

            var cont = document.getElementById(cid);
            if (!cont) {
                console.warn('unknown  card container id - ', cid);
                return;
            }

            if (!cards[cid]) {
                cards[cid] = [];
                if (cont.innerHTML) {
                    var cardObj = {url: null, fade: null, content: cont.children};
                    cards[cid].push(cardObj); //push the children
                }

            }

            load(cid, obj.url, function (html) {
                //first update the last content in case of any change
                var div = document.createElement('div');
                var children = cont.children;
                var len = children.length;
                for (var i = 0; i < len; i++) {
                    var child = children[0];//always the first
                    div.appendChild(cont.removeChild(child));
                }

                var cds = cards[cid];
                var last_crd = cds[cds.length - 1];
                if (last_crd) {
                    last_crd.content = div; //update the last content
                }

                //find if the new card already exist and make it come last
                for (var i = 0; i < cds.length; i++) {
                    if (obj.url === cds[i].url) {//found so remove - we will make it last soon, we promise
                        cds.splice(i, 1);
                        break;
                    }
                }

                cont.style.opacity = '0';

                cont.innerHTML = html;//set new content to the container
                var cardObj = {url: obj.url, fade: obj.fade || obj.fadein || obj.fadeIn, content: cont.children};
                cds.push(cardObj);//now make it last as promised
                if (obj.fade || obj.fadein || obj.fadeIn) {
                    Main.anim.to(cont, 500, {opacity: 1}, function () {
                        if (Main.util.isFunc(obj.onShow)) {
                            obj.onShow(obj.data);
                        }
                    });
                } else {
                    cont.style.opacity = '1';
                    if (Main.util.isFunc(obj.onShow)) {
                        obj.onShow(obj.data);
                    }
                }
            });

        };

        this.back = function (arg0, arg1) {

            var container, data, onShow;

            if (!Main.util.isString(arg0)
                    || arguments.length === 1) {//detecting that an object is passed
                container = arg0.container;
                data = arg0.data;
                onShow = arg0.onShow;

            } else if (Main.util.isString(arg0) && Main.util.isFunc(arg1)) {
                container = arg0;
                onShow = arg1;
            } else {
                console.warn('invalid method arguments - must be  either a one argument object or two argument with the first string type and the second function type. ');
                return;
            }

            if (!container) {
                console.warn('can not go back on a card without a container - ', container);
                return;
            }

            var cid;

            if (Main.util.isString(container)) {
                cid = container.charAt(0) === '#' ? container.substring(1) : container;
            } else {
                cid = $(container).id();
            }

            var cont = document.getElementById(cid);
            if (!cont) {
                console.warn('unknown  card container id - ', cid);
                return;
            }

            var cds = cards[cid];

            if (!cds.length //important - must check if it is array 
                    || cds.length < 2) {
                return; // already at the begining
            }
            var last_index = cds.length - 1;
            var out_card = cds[last_index];
            cds.splice(last_index, 1);

            cont.innerHTML = ''; //clear
            cont.style.opacity = '0';
            var prev = cds[cds.length - 1];
            var last_content = prev.content.children;
            var len = last_content.length;
            for (var i = 0; i < len; i++) {
                var rem_child = prev.content.removeChild(last_content[0]);//removing the first
                cont.appendChild(rem_child); //adding the removed child
            }

            if (out_card.fade || out_card.fadein || out_card.fadeIn) {
                Main.anim.to(cont, 500, {opacity: 1}, function () {
                    if (Main.util.isFunc(onShow)) {
                        onShow(data);
                    }
                });
            } else {
                cont.style.opacity = '1';
                if (Main.util.isFunc(onShow)) {
                    onShow();
                }
            }

        };
    }


    Main.event = new Event();
    Main.rcall = new RCall();
    Main.page = new Page();
    Main.listview = new Listview();
    Main.anim = new Animate();
    Main.fullscreen = new Fullscreen();
    Main.busy = new Busy();
    Main.dom = new Dom();
    Main.menu = new Menu();
    Main.dialog = new Dialog();
    Main.card = new Card();

    function Dom() {
        this.addListener = function (e, type, callback, capture) {
            var el = e;
            if (Main.util.isString(e)) {
                e = e.charAt(0) === '#' ? e.substring(1) : e;
                el = document.getElementById(e);
                if (!el) {
                    throw new Error('unknown element id - ' + e);
                }
            }

            if (el.addEventListener) {
                el.addEventListener(type, callback, capture);
            } else if (el.attachEvent) {//IE
                el.attachEvent('on' + type, callback, capture);
            }
        };

        this.removeListener = function (e, type, callback, capture) {
            var el = e;
            if (Main.util.isString(e)) {
                e = e.charAt(0) === '#' ? e.substring(1) : e;
                el = document.getElementById(e);
                if (!el) {
                    throw new Error('unknown element id - ' + e);
                }
            }

            if (el.removeEventListener) {
                el.removeEventListener(type, callback, capture);
            } else if (el.detachEvent) {//IE
                el.detachEvent('on' + type, callback, capture);
            }
        };
    }

    Main.const = {
        Z_INDEX: 10000,
        EXCLAMATION: 'EXCLAMATION',
        QUESTION: 'QUESTION',
        INFO: 'INFO',
        YES: 'YES',
        NO: 'NO',
        YES_NO: 'YES_NO',
        YES_NO_CANCEL: 'YES_NO_CANCEL',
        CANCEL: 'CANCEL',
        OK: 'OK',
        OK_CANCEL: 'OK_CANCEL'
    };
    /**
     * Displays option dialog box
     * 
     * @param {type} callback - a callback function called when a button is clicked or confirm box closed - the callback argument
     *  contains the text of the button clicked or undefined if the close button was clicked
     * @param {type} msg - message
     * @param {type} title - message title
     * @param {type} optionButtons - option buttons type (see Main.const )or array of custom option buttons 
     * @param {type} show_icon - whether to display question icon - true or false - defaults to true 
     * @param {type} fade - whether to use fade transition - true or false - defaults to true
     * @returns {undefined}
     */
    Main.confirm = function (callback, msg, title, optionButtons, show_icon, fade) {

        var msg_icon_cls = show_icon !== false ? "fa fa-question-circle" : "";
        var btns = optionButtons;
        if (!Main.util.isArray(optionButtons)) {
            switch (optionButtons) {
                case Main.const.YES_NO:
                    btns = ['NO', 'YES'];
                    break;
                case Main.const.YES_NO_CANCEL:
                    btns = ['CANCEL', 'NO', 'YES'];
                    break;
                case Main.const.OK_CANCEL:
                    btns = ['CANCEL', 'OK'];
                    break;
                default:
                    btns = ['NO', 'YES'];
                    break;

            }
        }

        var is_close_btn = true;

        Main.dialog.show({
            content: msg,
            iconCls: msg_icon_cls,
            title: title,
            buttons: btns,
            fade: fade !== false, // default is fade
            closeButton: !Main.device.isMobileDeviceReady, //do not show the close button in mobile device
            touchOutClose: true, //close the dialog if the user touch outside it
            action: function (el, value) {//not close button   
                is_close_btn = false;
                this.hide();
                if (Main.util.isFunc(callback)) {
                    callback(value);
                }

            },
            onHide: function () {
                if (is_close_btn && Main.util.isFunc(callback)) {//close button clicked
                    callback();
                }
            }
        });

    };

    /**
     * Displays alert dialog box
     *      
     * @param {type} msg - message
     * @param {type} title - message title
     * @param {type} msg_type - message type to determine the message icon - see Main.const
     * @param {type} buttonText - custom button text - the default is 'OK' text
     * @param {type} fade - whether to use fade transition - true or false - defaults to true
     * @returns {undefined}
     */
    Main.alert = function (msg, title, msg_type, buttonText, fade) {
        var msg_icon_cls = "";
        switch (msg_type) {
            case Main.const.EXCLAMATION:
                msg_icon_cls = "fa fa-exclamation-circle";
                break;
            case Main.const.QUESTION:
                msg_icon_cls = "fa fa-question-circle";
                break;
            case Main.const.INFO:
                msg_icon_cls = "fa fa-info-circle";
                break;
        }

        Main.dialog.show({
            content: msg,
            iconCls: msg_icon_cls,
            title: title,
            buttons: [!buttonText ? 'OK' : buttonText],
            fade: fade !== false, // default is fade
            closeButton: !Main.device.isMobileDeviceReady, //do not show the close button in mobile device
            touchOutClose: true //close the dialog if the user touch outside it
        });
    };

    function Dialog() {

        function diagThis(obj, outer, resizeListen, touchCloseFn) {
            this.close = function () {//similar to hide - since by our design, calling hide destroys the dialog.
                this.hide();
            };
            this.hide = function () {

                if (obj.fade || obj.fadeIn || obj.fadeIn) {
                    Main.anim.to(outer, 300, {opacity: 0}, destroy);
                } else {
                    destroy();
                }
                if (Main.util.isFunc(obj.onHide)) {
                    obj.onHide();
                }
            };

            function destroy() {
                if (outer) {
                    outer.parentNode.removeChild(outer);
                    Main.dom.removeListener(window, 'orientationchange', resizeListen, false);
                    Main.dom.removeListener(document.body, 'touchstart', touchCloseFn, false);
                    outer = null;
                }

                //TODO: Unlock the orientation here
            }

        }

        /**
         * Creates and  shows a dialog.
         * 
         * Usage
         * <br>
         * <br>
         * obj = { <br>
         *       container[opt] : ....,//container to center the dialog on<br>
         *       width [opt] : ...., //width of the dialog in pixel - px <br>
         *       height [opt] : ...., //height of the dialog body (not the dialog in this case) in pixel - px <br>
         *       title [opt] : .....,//title of the dialog<br>
         *       buttons [opt] : .....,//array of button text to show in the dialog footer<br>
         *       modal [opt] : .....,//whether to make the dialog modal - defaults to true<br>
         *       action [opt] : .....,//called when any buttons created in the footer is cliced<br>
         *       content [opt] : .....,//cotent of the dialog body<br>
         *       iconCls [opt] : .....,//icon class to show - used typically by alert and confirm dialog<br>
         *       fade | fadein | fadeIn [opt] : .....,//whether to use fade transition<br>
         *       closeButton [opt] : .....,//whether to display close button<br>
         *       touchOutClose [opt] : .....,//whether to close the dialog if user touch outside it on mobile device <br>
         *       onShow [opt] : .....,//called when the dialog is shown<br>
         *       onHide [opt] : .....,//called when the dilog is closed and destroyed<br>
         * }<br>
         * <br>
         * where '|' means 'or the property that follows'. <br>
         *      '....' means value<br>
         *       [opt] means optional property<br>
         *      <br>
         * Usage in action and onShow callback function.<br>
         * 
         * The follow method can be called in the action and onShow callback function <br>
         * <br>
         * this.hide() --- hides and destroys the dialog
         * this.close() --- closes and destroys the dialog - same as this.hide()
         * <br>
         * @param {type} obj
         * @returns {undefined}
         */
        this.show = function (obj) {

            if (obj.buttons && !Main.util.isArray(obj.buttons)) {//yes because button can be absence. so check if present and it is also an array
                console.warn('Dialog buttons must be array of button texts if provided!');
                return;
            }

            //TODO: lock orientation here to the current orientation - to avoid resize problems of the dialog- just a form of workaround
            //TODO : Unlock the orientation when the dialog is hide and destroyed - see destroy() method

            var outer = document.createElement('div');
            var base = document.createElement('div');
            base.className = 'game9ja-dialog';

            var header_el = document.createElement('div');
            header_el.className = 'game9ja-dialog-header';

            var body_el = document.createElement('div');
            body_el.className = 'game9ja-dialog-body';

            var footer_el = document.createElement('div');
            footer_el.className = 'game9ja-dialog-footer';

            header_el.innerHTML = obj.title;

            if (obj.iconCls) {
                var icon_el = document.createElement('span');
                icon_el.className = obj.iconCls;
                body_el.appendChild(icon_el);
            }

            var content_el = document.createElement('div');
            content_el.innerHTML = obj.content;
            content_el.style.width = '100%';

            body_el.appendChild(content_el);

            if (obj.width) {
                var width = new String(obj.width).replace('px', '') - 0;//implicitly convert to numeric
                if (!isNaN(width)) {
                    base.style.width = width + 'px';//width of the dialog
                } else {
                    console.warn('dialog width invalid - ', obj.width);
                }
            }

            if (obj.height) {
                var height = new String(obj.height).replace('px', '') - 0; //implicitly convert to numeric
                if (!isNaN(height)) {
                    body_el.style.height = height + 'px';//the height of the body - not the dialog in this case
                } else {
                    console.warn('dialog height invalid - ', obj.height);
                }
            }

            header_el.innerHTML = obj.title;

            outer.style.position = 'absolute';
            outer.style.top = '0';
            outer.style.left = '0';
            outer.style.minWidth = '100%';
            outer.style.minHeight = '100%';
            outer.style.zIndex = Main.const.Z_INDEX;

            if (obj.modal !== false) {
                outer.style.top = '0px';
                outer.style.left = '0px';
                outer.style.width = '100%';
                outer.style.height = '100%';
                outer.style.background = 'rgba(0,0,0,0.1)';
            }

            base.style.maxWidth = '80%';
            base.style.maxHeight = '80%';

            base.appendChild(header_el);
            base.appendChild(body_el);

            outer.appendChild(base);
            //outer  = base;

            base.style.opacity = 0;

            document.body.appendChild(outer);


            if (obj.touchOutClose === true) {
                Main.dom.addListener(document.body, 'touchstart', touchCloseFunc, false);
            }

            var objThis = new diagThis(obj, outer, resizeListen, touchCloseFunc);

            if (obj.closeButton !== false) {
                var close_el = document.createElement('span');
                close_el.className = 'fa fa-close';
                close_el.style.position = 'absolute';
                close_el.style.right = '2px';
                close_el.style.top = '2px';
                close_el.style.width = '20px';
                close_el.style.height = '20px';
                base.appendChild(close_el);
                Main.dom.addListener(close_el, 'click', objThis.hide, false);
            }

            if (obj.buttons) {//if present

                for (var i = obj.buttons.length - 1; i > -1; i--) {
                    var btn = document.createElement('input');
                    btn.type = 'button';
                    btn.value = obj.buttons[i];
                    footer_el.appendChild(btn);
                }

                Main.dom.addListener(footer_el, 'click', function (evt) {
                    if (evt.target.type === 'button') {
                        if (Main.util.isFunc(obj.action)) {
                            obj.action.call(objThis, evt.target, evt.target.value);
                        }
                    }
                }.bind(objThis), false);

                base.appendChild(footer_el);
            }

            var container;
            if (Main.util.isString(obj.container)) {
                var container_id = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;
                container = document.getElementById(container_id);
            } else if (obj.container) {
                container = obj.container;
            } else {
                container = document.body;
            }
            var cb = container.getBoundingClientRect();
            var bound = base.getBoundingClientRect();

            var compXY = computeXY(cb, bound);

            base.style.left = compXY.x + 'px';
            base.style.top = compXY.y + 'px';

            outer.style.minWidth = bound.width + 'px';
            outer.style.minHeight = bound.height + 'px';

            Main.dom.addListener(window, 'orientationchange', resizeListen, false);

            if (obj.fade || obj.fadeIn || obj.fadeIn) {
                Main.anim.to(base, 300, {opacity: 1}, function () {
                    if (Main.util.isFunc(obj.onShow)) {
                        obj.onShow.call(objThis);
                    }
                });
            } else {
                base.style.opacity = 1;
                if (Main.util.isFunc(obj.onShow)) {
                    obj.onShow.call(objThis);
                }
            }

            function touchCloseFunc(evt) {
                var parent = evt.target;
                var touch_outside = true;
                while (parent && parent !== document.body) {
                    if (parent === base) {
                        touch_outside = false;
                        break;
                    }
                    if (parent === outer) {//when the dialog is modal the outer element fills the page - so close it if touched
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (touch_outside) {
                    objThis.hide();
                }
            }

            function resizeListen() {

                var cb = container.getBoundingClientRect();
                var bound = base.getBoundingClientRect();
                if (bound.width && cb.width && bound.width >= cb.width) {
                    base.style.width = (0.8 * cb.width) + 'px';
                }
                if (bound.height && cb.height && bound.height >= cb.height) {
                    base.style.height = (0.8 * cb.height) + 'px';
                }
                var compXY = computeXY(cb, bound);
                base.style.left = compXY.x + 'px';
                base.style.top = compXY.y + 'px';
            }


            function computeXY(cb, bound) {
                var x, y;
                if (bound.top >= 0
                        && bound.top <= window.screen.height
                        && bound.left >= 0
                        && bound.left <= window.screen.width
                        && bound.height) {//inside the window view port
                    var cb_h = cb.height;
                    var cb_w = cb.width;
                    if (cb_h === 0) {
                        cb_h = window.screen.height;
                    }

                    if (cb_w === 0) {
                        cb_w = window.screen.width;
                    }
                    var b_w = bound.width;
                    var b_h = bound.height;

                    x = cb.left + (cb_w - b_w) / 2;
                    y = cb.top + (cb_h - b_h) / 2;
                    if (b_w > cb_w) {
                        x = 0.1 * cb_w;
                    }
                    if (b_h > cb_h) {
                        y = 0.1 * cb_h;
                    }

                } else {
                    var bw = 200;
                    x = (window.screen.width - bw) / 2;
                    y = (window.screen.height - bw) / 2;
                    if (x <= 0) {
                        x = 40;
                    }
                    if (y <= 0) {
                        y = 40;
                    }
                }
                return {x: x, y: y};
            }
        };
    }

    function Menu() {
        var defaultWidth = 150;
        var menuHeaderHeight = 30; //must not change -  used in css
        var menuCmp;
        var menuBtn;

        function onClickOutsideHide(evt) {
            if (evt.target === menuBtn) {
                return;
            }
            if (!menuCmp) {
                return;
            }
            var container = menuCmp[0];

            var parent = evt.target.parentNode;
            var click_outside = true;
            while (parent && parent !== document.body) {
                if (parent === container) {
                    click_outside = false;
                    break;
                }
                parent = parent.parentNode;
            }

            if (click_outside) {
                destroy();
            }
        }

        function destroy() {
            if (menuCmp) {
                menuCmp.remove();
                menuCmp = null;
                Main.dom.removeListener(document.body, 'click', onClickOutsideHide, false);
            }
        }

        function menuThis(_this, menuCmp, mnuBody) {

            this.hide = function () {
                destroy();
            };

            this.getItems = function () {

                var children = mnuBody.children();
                var items = [];
                if (children.length) {

                    for (var i = 0; i < children.length; i++) {
                        var len = children[i].children.length;
                        if (len === 0) {
                            items.push(children[i].innerHTML);
                        } else if (len === 1) {
                            items.push(children[i].children[0]);
                        } else { // > 1
                            items.push(children[i].children);
                        }

                    }
                }

                return items;
            };
            this.setItems = function (items) {

                if (Main.util.isArray(items)) {
                    this.clear();
                    for (var n in items) {
                        this.appendItem(items[n]);
                    }
                } else if (Main.util.isString(items)) {
                    this.clear();
                    this.appendItem(items);
                }

            };

            this.addItem = function (item) {

                this.appendItem(item);
            };

            this.appendItem = function (item) {

                var e = createMenuItem(_this, menuThis, menuCmp, mnuBody, item);
                mnuBody.append(e);
            };

            this.prependItem = function (item) {

                var e = createMenuItem(_this, menuThis, menuCmp, mnuBody, item);
                mnuBody.prepend(e);
            };

            this.removeItemAt = function (index) {

                var children = mnuBody.children();
                if (children[index]) {
                    $(children[index]).remove();
                }
            };

            this.clearItems = function () {

                mnuBody.html('');
            };

            this.clear = function () {

                this.clearItems();
            };

            this.setHeader = function (text) {

                var children = menuCmp.children();
                if (children.length && children[0].className === 'game9ja-menu-header') {
                    children[0].innerHTML = text;
                } else {
                    menuCmp.prepend('<div class="game9ja-menu-header" >' + text + '</div>');
                }
                normalizeBodyHeight(menuCmp);
            };

            this.setFooter = function (text) {

                var children = menuCmp.children();
                if (children.length && children[children.length - 1].className === 'game9ja-menu-footer') {
                    children[children.length - 1].innerHTML = text;
                } else {
                    menuCmp.append('<div class="game9ja-menu-footer" >' + text + '</div>');
                }
                normalizeBodyHeight(menuCmp);
            };

            function normalizeBodyHeight(menu) {
                var children = menuCmp.children();
                var h = menu[0].clientHeight;
                if (!h) {
                    return;
                }
                var mnu_body;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].className === 'game9ja-menu-header') {
                        h -= menuHeaderHeight;
                    } else if (children[i].className === 'game9ja-menu-footer') {
                        h -= menuHeaderHeight; // same as header height
                    } else if (children[i].className === 'game9ja-menu-body') {
                        mnu_body = children[i];
                    }
                }

                mnu_body.style.height = h + 'px';

            }

            return this;
        }

        function createMenuItem(_this, menuThis, menuCmp, mnuBody, t) {
            var e = document.createElement('div');
            e.innerHTML = t;
            var mThis = new menuThis(_this, menuCmp, mnuBody);

            mThis.item = e.children.length > 0 ?
                    (e.children.length === 1 ? e.children[0] : e.children)
                    : t;

            if (Main.util.isFunc(_this.onSelect)) {
                $(e).on('click', _this.onSelect.bind(mThis));
            }

            return e;
        }

        /**
         * Create a dropdown menu whose content can be dynamic.
         * 
         * Usage
         * <br>
         * <br>
         * obj = { <br>
         *       target : ....,//can be the element id or the element itself <br>
         *       items  : [....]// array of element. can also be text only<br>
         *       width [opt] : ...., //width of the menu in pixel - px <br>
         *       height [opt] : ...., //height of the menu in pixel - px <br>
         *       header [opt] : .....,<br>
         *       footer [opt] : .....,<br>
         *       onShow [opt] : .....,<br>
         *       onSelect [opt] : .....,<br>
         * }<br>
         * <br>
         * where '|' means 'or the property that follows'. <br>
         *      '....' means value<br>
         *       [opt] means optional property<br>
         *      <br>
         * Usage in onShow and onSelect.<br>
         * 
         * The follow method can be called in the onShow and onSelect callback function <br>
         * for creating dynamic content of the menu:<br>
         * <br>
         * this.setItems() --- sets the items of the menu - replaces previous items
         * this.getItems() -- gets all items of the menu<br>
         * this.addItem() --- append an item -- can be elements or plain text<br>
         * this.appendItem() --- append an item - same as this.addItem() -- can be elements or plain text<br>
         * this.prependItem() --- prepends an item  -- can be elements or plain text<br>
         * this.clearItems() ---- clears all items<br>
         * this.clear() ---- clears all items - same as this.clearItems()<br>
         * this.removeItemA() -- clear an items at the specified index<br>
         * this.setHeader() -- set new menu header<br>
         * this.setFooter() -- set new menu footer<br>
         * <br>
         * @param {type} obj
         * @returns {undefined}
         */
        this.create = function (obj) {

            $(obj.target).off('click');
            $(obj.target).on('click', onTargetClick.bind(obj));

            function onTargetClick(evt) {
                //first destroy previous menu shown - there cannot be more than
                //one menu at a time.
                destroy();
                menuBtn = this.target;
                if (Main.util.isString(this.target)) {
                    menuBtn = menuBtn.charAt(0) === '#' ? menuBtn.substring(1) : menuBtn;
                    menuBtn = document.getElementById(menuBtn);
                }

                var bound = menuBtn.getBoundingClientRect();
                var y = bound.top;
                var mnu_width = this.width ? this.width : defaultWidth;
                mnu_width = new String(mnu_width).replace('px', '');
                mnu_width = mnu_width - 0; // implicitly convert to numeric
                if (isNaN(mnu_width)) {
                    mnu_width = defaultWidth;
                }

                var x = bound.left;

                var padding = 5;
                var body_bound = document.body.getBoundingClientRect();
                if (x + mnu_width + padding > body_bound.width) {
                    x = bound.left - mnu_width + bound.width; // align the right edge of the menu with the right edge of the target
                }

                this.height = this.height ? new String(this.height).replace('px', '') : null;

                var max_height = Main.device.getPortriatWidth() - 20; // minus some pixels

                var style = 'position: absolute; '
                        + ' top : ' + y + 'px; '
                        + ' left: ' + x + 'px; '
                        + ' width: ' + mnu_width + 'px; '
                        + (!isNaN(this.height - 0) ? 'height: ' + this.height + 'px;' : '');
                menuCmp = $('<div class="game9ja-menu" style = "' + style + '" ></div>');

                if (this.header) {
                    menuCmp.append('<div class="game9ja-menu-header">' + this.header + '</div>');
                }

                var body_height_style = this.height;
                if (this.height) {
                    if (this.header && this.footer) {
                        body_height_style = this.height - 2 * menuHeaderHeight;
                    } else if (this.header || this.footer) {
                        body_height_style = this.height - menuHeaderHeight;
                    }
                }


                body_height_style = body_height_style ?
                        "style='height: " + body_height_style + "px; max-height: " + max_height + "px;'"
                        : "style='max-height: " + max_height + "px;'";


                menuCmp.append('<div class="game9ja-menu-body" ' + body_height_style + '></div>');

                var mnuBody = menuCmp.find('.game9ja-menu-body');
                var els = [];

                for (var i = 0; i < this.items.length; i++) {
                    var t = this.items[i];
                    var e = createMenuItem(this, menuThis, menuCmp, mnuBody, t);
                    els.push(e);
                }
                var children = $(menuCmp).children();
                var last = children[children.length - 1];
                $(last).append(els);

                if (this.footer) {
                    menuCmp.append('<div class="game9ja-menu-footer">' + this.footer + '</div>');
                }

                $('body').append(menuCmp);

                Main.dom.addListener(document.body, 'click', onClickOutsideHide, false);

                if (Main.util.isFunc(this.onShow)) {
                    var mnuThis = menuThis(this, menuCmp, mnuBody);
                    this.onShow.bind(mnuThis)();
                }
            }
        };
    }


    Main.tab = function (obj) {
        var id_prefix = "#";

        for (var n in obj.onShow) {
            if (id_prefix !== '' && n.charAt(0) !== id_prefix) {
                throw new Error("Invalid tab button selector for onShow - expected '" + id_prefix + n + "' instead of '" + n + "'");
            }
        }

        var btns = $(obj.container).find('.game9ja-tab-header').children();
        var tab_body = $(obj.container).find('.game9ja-tab-body')[0];

        var contents = $(tab_body).children();
        var shownIndex = null;
        var active_class = 'game9ja-tab-active';

        //make sure a tab is active and the corresponding content showing
        for (var i = 0; i < contents.length; i++) {
            contents[i].style.position = 'absolute';
            contents[i].style.top = '0px';
            if (contents[i].style.display === 'block' && shownIndex === null) {
                shownIndex = i;
            } else {
                contents[i].style.display = 'none';
                contents[i].style.left = '100%';
            }

            if (i === contents.length - 1) {
                if (shownIndex === null) {
                    contents[0].style.display = 'block';
                    contents[0].style.left = '0%';
                    shownIndex = 0;
                }

                if (!$(btns[shownIndex]).hasClass(active_class)) {
                    $(btns[shownIndex]).addClass(active_class);
                }

                if (btns[shownIndex]) {
                    var func = obj.onShow[id_prefix + btns[shownIndex].id];
                    if (Main.util.isFunc(func)) {
                        func();
                    }

                }

            }
        }

        for (var i = 0; i < btns.length; i++) {
            $(btns[i]).off('click');
            $(btns[i]).on('click', tabShow.bind(
                    {
                        tabIndex: i,
                        buttons: btns,
                        tabBody: tab_body,
                        fn: obj.onShow[id_prefix + btns[i].id]
                    }));
        }

        Main.swipe({
            el: tab_body,
            left: swipeTabBody.bind({direction: 1}),
            right: swipeTabBody.bind({direction: -1})
        });

        function swipeTabBody() {
            for (var i = 0; i < btns.length; i++) {
                if ($(btns[i]).hasClass(active_class)) {
                    var next = i + this.direction;
                    if (btns[next]) {
                        tabShow.bind(
                                {
                                    tabIndex: next,
                                    buttons: btns,
                                    tabBody: tab_body,
                                    fn: obj.onShow[id_prefix + btns[next].id]
                                })();
                    }
                    break;
                }
            }
        }

        function tabShow() {

            for (var i = 0; i < this.buttons.length; i++) {
                var btn = this.buttons[i];
                if (i === this.tabIndex) {
                    if (!$(btn).hasClass(active_class)) {
                        $(btn).addClass(active_class);
                    }
                } else {
                    $(btn).removeClass(active_class);
                }
            }

            var contents = $(this.tabBody).children();

            for (var i = 0; i < contents.length; i++) {
                if (contents[i].style.display === 'block' && i !== this.tabIndex) {
                    if (Main.util.isFunc(this.fn)) {
                        this.fn();
                    }
                    animShowTab(contents[this.tabIndex], contents[i], i < this.tabIndex);
                    break;
                }
            }



        }

        function animShowTab(newComp, prevComp, forward) {
            newComp.style.display = 'block';

            var prev_left = '100%';
            newComp.style.left = '-100%';
            if (forward) {
                prev_left = '-100%';
                newComp.style.left = '100%';
            }

            Main.anim.to(newComp, 500, {left: '0%'});
            Main.anim.to(prevComp, 500, {left: prev_left}, function () {
                this.el.style.display = 'none';
            }.bind({el: prevComp}));
        }

    };

    Main.swipe = function (obj) {

        if (!obj.el.addEventListener || !obj.el.removeEventListener) {
            return;
        }

        obj.el.removeEventListener('touchstart', startTouch, false);
        obj.el.removeEventListener('touchmove', moveTouch, false);
        obj.el.removeEventListener('touchend', endTouch, false);
        obj.el.removeEventListener('touchcancel', cancelTouch, false);


        obj.el.addEventListener('touchstart', startTouch, false);
        obj.el.addEventListener('touchmove', moveTouch, false);
        obj.el.addEventListener('touchend', endTouch, false);
        obj.el.addEventListener('touchcancel', cancelTouch, false);

        var SW_TIME = 500;
        var SW_MAX_X = 100;
        var SW_MAX_Y = 100;
        var SW_MAX_SLANT = SW_MAX_X / 2;

        var start_time;
        var end_time;
        var start_x;
        var end_x;
        var start_y;
        var end_y;
        var isTouching;

        function startTouch(evt) {

            if (evt.touches.length === 1) {
                start_x = evt.touches[0].pageX;
                start_y = evt.touches[0].pageY;
                start_time = new Date().getTime();
            }
        }

        function moveTouch(evt) {
            if (evt.touches.length === 1) {
                end_x = evt.touches[0].pageX;
                end_y = evt.touches[0].pageY;
                isTouching = true;
            }

        }

        function cancelTouch(evt) {
            obj.el.removeEventListener('touchmove', moveTouch, false);
            isTouching = false;

        }

        function endTouch(evt) {

            if (!isTouching) {
                return;
            }
            isTouching = false;
            end_time = new Date().getTime();
            var elapse = end_time - start_time;
            var change_x = start_x - end_x;
            var change_y = start_y - end_y;

            if (elapse > SW_TIME) {
                return;
            }

            if (Math.abs(change_x) > SW_MAX_X && Math.abs(change_y) < SW_MAX_SLANT) {
                if (change_x > 0) {
                    if (Main.util.isFunc(obj.left)) {
                        obj.left();
                    }

                    //console.log('left ');
                } else {
                    if (Main.util.isFunc(obj.right)) {
                        obj.right();
                    }

                    //console.log('right ');
                }
            } else if (Math.abs(change_y) > SW_MAX_Y && Math.abs(change_x) < SW_MAX_SLANT) {
                if (change_y > 0) {

                    if (Main.util.isFunc(obj.up)) {
                        obj.up();
                    }

                    //console.log('up ');
                } else {
                    if (Main.util.isFunc(obj.down)) {
                        obj.down();
                    }

                    //console.log('down ');
                }
            }
        }

    };

    /**
     * Add listerner
     * 
     * @param {type} event_name
     * @param {type} callback
     * @param {type} data
     * @return {undefined}
     */
    Main.on = function (event_name, callback, data) {
        if (Main.util.isFunc(callback)) {
            if (!listeners[event_name]) {
                listeners[event_name] = [];
            }
            listeners[event_name].push({fn: callback, data: data});
        }
    };

    /**
     * Remove listerner
     * 
     * @param {type} event_name
     * @return {undefined}
     */
    Main.off = function (event_name) {
        delete listeners[event_name];
    };

    /**
     * Called when the application is ready
     * @param {type} fn
     * @return {undefined}
     */
    Main.ready = function (fn) {
        Main.on("ready", fn);

    };

    /**
     * This method should be called by the first index page
     * for loading the device index page and initializing
     * the application.
     * @param {type} obj
     * @return {undefined}
     */
    Main.init = function (obj) {


        if (isMainInit) {//prevent duplicate call
            return;
        }
        isMainInit = true;

        window.onload = function (evt) {

            var device_size_cat;
            if (!obj.prod) {
                device_size_cat = obj.devDevice ? obj.devDevice : "large";
            } else {
                device_size_cat = deviceSizeCategory();
            }
            var pkg = appUrl + "include.json";

            Main.ajax.get(pkg,
                    function (res) {
                        eval('var json = ' + res);//remove comments if present since they are not valid in json

                        var json = json;
                        var absolute_scripts = [],
                                app_scripts = [],
                                cat_scripts = [],
                                absolute_styles = [],
                                app_styles = [],
                                cat_styles = [];

                        if (json.absolute && Main.util.isArray(json.absolute.js)) {
                            absolute_scripts = json.absolute.js;
                        }
                        if (json.absolute && Main.util.isArray(json.absolute.css)) {
                            absolute_styles = json.absolute.css;
                        }

                        if (json.app && Main.util.isArray(json.app.js)) {
                            app_scripts = json.app.js;
                        }
                        if (json.app && Main.util.isArray(json.app.css)) {
                            app_styles = json.app.css;
                        }

                        if (json[device_size_cat] && Main.util.isArray(json[device_size_cat].js)) {
                            cat_scripts = json[device_size_cat].js;
                        }
                        if (json[device_size_cat] && Main.util.isArray(json[device_size_cat].css)) {
                            cat_styles = json[device_size_cat].css;
                        }

                        var track = {
                            deviceCategory: device_size_cat,
                            count: 0,
                            total: absolute_styles.length
                                    + app_styles.length
                                    + cat_styles.length
                                    + absolute_scripts.length
                                    + app_scripts.length
                                    + cat_scripts.length,
                            queueIndex: -1,
                            queue: []
                        };
                        if (track.total > 0) {
                            loadRequiredFiles(absolute_styles, track, absoluteRoute, loadCss);
                            loadRequiredFiles(app_styles, track, appRoute, loadCss);
                            loadRequiredFiles(cat_styles, track, deviceRoute, loadCss);
                            loadRequiredFiles(absolute_scripts, track, absoluteRoute, loadScript);
                            loadRequiredFiles(app_scripts, track, appRoute, loadScript);
                            loadRequiredFiles(cat_scripts, track, deviceRoute, loadScript);
                        } else {//zero
                            loadDeviceMain(track.deviceCategory);
                        }

                    }
            , function () {
                console.log("could not get resource: ", pkg);
            });


        };

        function loadRequiredFiles(files, track, route, callback) {

            for (var i = 0; i < files.length; i++) {
                if (files[i].indexOf(0) === '/') {
                    files[i] = files[i].substring(1);
                }
                var argu = [];
                argu.push(files[i]);
                argu.push(track);
                argu.push(route);
                track.queueIndex++;
                if (track.queueIndex === 0) {
                    callback.apply(this, argu);
                } else {
                    track.queue.push({
                        argu: argu,
                        loader: callback
                    });
                }

            }
        }

        function absoluteRoute(file, type) {
            return file;
        }

        function appRoute(file, type) {
            return appUrl + type + "/" + file;
        }

        function deviceRoute(file, type, cat) {
            return deviceUrl + "/" + cat + "/" + type + "/" + file;
        }
        function onLoadInclude() {
            this.count++;
            if (this.count === this.total) {
                loadDeviceMain(this.deviceCategory);
            } else {
                var next = this.queue[this.count - 1];
                next.loader.apply(null, next.argu);
            }
        }
        function onErrorInclude() {
            console.log('Failed to load a required resource : ', this.file);
        }
        function loadCss(file, track, route) {
            var link = document.createElement("link");

            link.onload = onLoadInclude.bind(track);
            link.onerror = onErrorInclude.bind({file: file});
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = route(file, "css");
            document.head.appendChild(link);
        }

        function loadScript(file, track, route) {
            var script = document.createElement("script");

            script.onload = onLoadInclude.bind(track);
            script.onerror = onErrorInclude.bind({file: file});
            script.type = "text/javascript";
            script.src = route(file, "js", track.deviceCategory);
            document.head.appendChild(script);
        }

        function loadDeviceMain(device_size_cat) {
            //register the home page first

            pageRouteUrl = deviceUrl + device_size_cat + '/';
            var routeFile = pageRouteUrl + "index.html";

            $.get(routeFile,
                    function (response) {
                        var pg_recv = $("<div></div>").html(response);
                        var children = $('body').children();
                        for (var i = children.length - 1; i > -1; i--) {
                            $(children[i]).remove();
                        }
                        var childrenRev = $(pg_recv).children();
                        for (var i = 0; i < childrenRev.length; i++) {
                            if (childrenRev[i].nodeName === 'TITLE') {
                                continue;
                            }
                            $('body').append(childrenRev[i]);
                        }
                        Main.page.init();

                        //initialize controller objects with constructor

                        //console.log(Object.getOwnPropertyNames(Main.controller));


                        var props = Object.getOwnPropertyNames(Main.controller);

                        for (var n in props) {
                            var clazzObj = Main.controller[props[n]];
                            var construtorFn = clazzObj['constructor'];
                            if (Main.util.isFunc(construtorFn)) {
                                construtorFn.call(clazzObj);
                            }
                        }

                    }
            ).fail(function (data) {
                console.log("could not get resource: ", routeFile);
            });

        }

        /**
         * Detect the size of device and return
         * small,  medium or large
         * @return {undefined}
         */
        function deviceSizeCategory() {
            var size = window.screen.width > window.screen.height ?
                    window.screen.width
                    : window.screen.height;

            portriat_height = size;

            portriat_width = window.screen.width < window.screen.height ?
                    window.screen.width
                    : window.screen.height;

            if (size > 768) {//desktops and laptops
                device_category = "large";
            } else if (size <= 768 && size > 600) {//tablets
                device_category = "medium";
            } else {//smart phones
                device_category = "small";
            }

            return device_category;
        }


    };


    return Main;
})();