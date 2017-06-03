
var Main = {};


(function () {

    var isPageInit = false;
    var pageRouteUrl;
    var isMainInit;
    var deviceUrl = "device/";
    var appUrl = "app/";
    var listeners = {};
    Main.controller = {}; // js in the controller folder will dynamically use this prototype
    Main.ro = {};// object for storing global access for rcall variables for making remote method calls

    Main.helper = {
        loadDefaultProfilePhoto: function (evt) {

            if (!evt.target) {
                console.warn('event target is undefined! this may be caused by '
                        + 'invalid call or use of method to get default'
                        + ' profile photo - make the event is passed as parameter');
                return;
            }

            var available = 'app/images/default_person.png';
            //check if last error is due to failure to load the default image.
            //we will terminate the process if the default image was not found
            if (evt.target.src.endsWith('/' + available)) {
                evt.target.error = null; // terminate the process
                console.warn('Could not load the default profile photo! Probably not found.');
                return;//leave
            }

            evt.target.src = available;//get the default image
        }
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
            // Main.device class instance is bind to onDeviceReady.
            this.isMobileDeviceReady = true;
        }

    };


    Main.util = {

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
        }

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

                    console.log('Object.getOwnPropertyNames(rcalFailures)  ', Object.getOwnPropertyNames(rcalFailures));
                    console.log('Object.getOwnPropertyNames(rcalFailures).length  ', Object.getOwnPropertyNames(rcalFailures).length);

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
                    fn();
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
                            fn();
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
            if(!element){
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
    ;



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
                if (children[i].nodeName !== 'SCRIPT' && children[i].nodeName !== 'TITLE') {
                    content.push(children[i]);
                    $(children[i]).remove();
                }
            }

            //Just in case there are any embeded unwanted element, remove them.
            //We do not want to unitentionally execute script more than once.            
            $(content).find('title , script').each(function (index) {
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
                                $(document).add("*").off();
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
                    $(document).add("*").off();
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
                return;
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
        };


        this.back = function () {
            if (transitionInProgress) {
                console.warn("Action ignored! Page transition in progress.");
                return;
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


        };

        this.show = function (obj) {
            if (transitionInProgress) {
                console.warn("Action ignored! Page transition in progress.");
                return;
            }
            var transit = {};
            if (!obj.transition) {
                transit.effect = obj.effect;
                transit.duration = obj.duration;
            } else {
                transit = obj.transition;
            }


            load(obj.url, transit, !(obj.forward === false), obj.data, _pShowFn(obj));
        };

        var _pShowFn = function (obj) {
            return {onShow: obj.onShow, onBeforeShow: obj.onBeforeShow};
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


    function List() {
        var listTpl = {};
        var listTplWaitCount = {};
        var ListTplGetting = {};

        function tplParam(html, obj) {

            var set = obj.set;
            for (var name in set) {
                var value = set[name];
                var tpl_name = '{' + name + '}';
                var h;
                do {
                    h = html;
                    html = html.replace(tpl_name, value);
                } while (h !== html)

            }

            var content = $('<div class='
                    + (obj.itemClass
                            && Main.util.isString(obj.itemClass)
                            ? obj.itemClass : "list-group-item")
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

        function doAddItem(obj, item) {
            $(obj.container).append(item);
        }
        function doPrependItem(obj, item) {
            $(obj.container).prepend(item);
        }
        function handle(html, obj, tplFn, actionFn) {
            var item = tplFn(html, obj);
            if (!$(obj.container).hasClass("list-group")) {
                $(obj.container).addClass("list-group");
            }

            actionFn(obj, item);
        }
        function putItem(obj, actionCallback) {
            if (!obj.tplUrl) {
                console.warn('missing list property - tplUrl');
                return;
            } else if (!obj.container) {
                console.warn('missing list property - container');
                return;
            } else if (!obj.set) {
                console.warn('missing list property - set');
                return;
            }
            var html = listTpl[obj.tplUrl];
            if (html) {
                handle(html, obj, tplParam, actionCallback);
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

                    handle(response, obj, tplParam, actionCallback);
                    delete ListTplGetting[obj.tplUrl];
                    //consider list templates waiting
                    var countWait = listTplWaitCount[obj.tplUrl].length;
                    if (countWait) {
                        for (var i = 0; i < countWait; i++) {
                            var argu = listTplWaitCount[obj.tplUrl][i];
                            putItem.apply(null, argu);
                        }
                        delete listTplWaitCount[obj.tplUrl];
                    }


                }).fail(function () {
                    delete listTplWaitCount[obj.tplUrl];
                    console.log("could not get resource:", url);
                });
            }
        }
        this.addItem = function (obj) {
            putItem(obj, doAddItem);
        };

        this.appendItem = function (obj) {//analogous to addItem
            this.addItem(obj);
        };

        this.prependItem = function (obj) {
            putItem(obj, doPrependItem);
        };

        this.removeItem = function (obj) {
            //TODO
        };

        this.removeItemAt = function (index) {
            //TODO
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
            busyEl.style.zIndex = '10000';//come back

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
            return '<div style="position: absolute; top: 50%; width: 100%; text-align: center;"><i class="fa fa-spinner fa-spin" style="margin-right: 3px;"></i>' + text + '</div>';//come back
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
                    if(content){
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
            content.style.zIndex = '10000';//come back
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


    Main.rcall = new RCall();
    Main.page = new Page();
    Main.list = new List();
    Main.anim = new Animate();
    Main.fullscreen = new Fullscreen();
    Main.busy = new Busy();


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
                    obj.onShow[id_prefix + btns[shownIndex].id]();
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
                    this.fn();
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
                    obj.left();

                    //console.log('left ');
                } else {
                    obj.right();

                    //console.log('right ');
                }
            } else if (Math.abs(change_y) > SW_MAX_Y && Math.abs(change_x) < SW_MAX_SLANT) {
                if (change_y > 0) {
                    obj.up();

                    //console.log('up ');
                } else {
                    obj.down();

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
                        var app_scripts = [],
                                cat_scripts = [],
                                app_styles = [],
                                cat_styles = [];
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
                            total: app_styles.length
                                    + cat_styles.length
                                    + app_scripts.length
                                    + cat_scripts.length,
                            queueIndex: -1,
                            queue: []
                        };
                        if (track.total > 0) {

                            loadRequiredFiles(app_styles, track, appRoute, loadCss);
                            loadRequiredFiles(cat_styles, track, deviceRoute, loadCss);
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
            var category;
            if (size > 768) {//desktops and laptops
                category = "large";
            } else if (size <= 768 && size > 600) {//tablets
                category = "medium";
            } else {//smart phones
                category = "small";
            }

            return category;
        }


    };


    return Main;
})();



