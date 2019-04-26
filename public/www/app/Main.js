
var Main = {};

(function () {

    var _host = window.location.hostname;
    var _protocol = window.location.protocol;
    var _pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    var isPageInit = false;
    var transitionInProgress = false;
    var devicePageRouteUrl;
    var devicePageTplRouteUrl;
    var deviceUrl = "device/";
    var appTplRouteUrl = 'app/view/tpl/';
    var appPageRouteUrl = 'app/view/';
    var isMainInit;
    var appNamespace = "MyApp"; // default namespace
    var _nsObjs = {};
    var _nsFiles = [];
    var tempClassObjects = {};
    var device_category;
    var portriat_width;
    var portriat_height;
    var appUrl = "app/";
    var listeners = {};
    var deviceBackMeOnly = {};
    var socket;
    var _isDestopScrollbarStyled = false;
    var deskStyle;
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

    /**
     * Self invoking function for polyfills
     * largely gotten from https://developer.mozilla.org
     * @returns {undefined}
     */
    (function () {

        //polyfill for bind - MDN ->https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (oThis) {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        fNOP = function () {},
                        fBound = function () {
                            return fToBind.apply(this instanceof fNOP
                                    ? this
                                    : oThis,
                                    aArgs.concat(Array.prototype.slice.call(arguments)));
                        };

                if (this.prototype) {
                    // Function.prototype doesn't have a prototype property
                    fNOP.prototype = this.prototype;
                }
                fBound.prototype = new fNOP();

                return fBound;
            };
        }

        //polyfill String.prototype.endsWith()
        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function (search, this_len) {
                if (this_len === undefined || this_len > this.length) {
                    this_len = this.length;
                }
                return this.substring(this_len - search.length, this_len) === search;
            };
        }

        //polyfill String.prototype.startsWith()
        if (!String.prototype.startsWith) {
            Object.defineProperty(String.prototype, 'startsWith', {
                value: function (search, pos) {
                    pos = !pos || pos < 0 ? 0 : +pos;
                    return this.substring(pos, pos + search.length) === search;
                }
            });
        }

        //polyfill Array.prototype.find()
        // https://tc39.github.io/ecma262/#sec-array.prototype.find
        if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function (predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return undefined.
                    return undefined;
                },
                configurable: true,
                writable: true
            });
        }

        //polyfill Array.prototype.findIndex()
        // https://tc39.github.io/ecma262/#sec-array.prototype.findindex
        if (!Array.prototype.findIndex) {
            Object.defineProperty(Array.prototype, 'findIndex', {
                value: function (predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return k.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return k;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return -1.
                    return -1;
                },
                configurable: true,
                writable: true
            });
        }

        //polyfill the remove() method in Internet Explorer 9 and higher 
        // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
        (function (arr) {
            arr.forEach(function (item) {
                if (item.hasOwnProperty('remove')) {
                    return;
                }
                Object.defineProperty(item, 'remove', {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: function remove() {
                        if (this.parentNode !== null)
                            this.parentNode.removeChild(this);
                    }
                });
            });
        })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

        //more polyfill may go below 

    })();

    Main.host = function () {
        return _host;
    };

    Main.protocol = function () {
        return _protocol;
    };

    Main.pathname = function () {
        return _pathname;
    };

    function urlWithHostAndProtocol(url) {

        var index = url.indexOf('?');
        var u = url;
        var param_part = '';

        if (index > -1) {
            u = url.substring(0, index);
            param_part = url.substring(index);
        }

        if (u.indexOf('://') === -1) {
            if (!u.startsWith('/')) {
                u = '/' + u;
            }
            u = _protocol + '//' + _host + u;
        }

        url = u + param_part;

        return url;
    }

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
        var timeout;

        if (data) {
            if (Main.util.isString(data)) {
                param = data;
            } else {
                headers = data.headers;
                timeout = data.timeout;
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

        url = urlWithHostAndProtocol(url);
        send(xhttp, method, url, param, headers, timeout);
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


    Main.ajax = {
        get: function () {
            var argu = [];
            argu.push(sendGet);
            argu.push("GET");
            for (var i = 0; i < arguments.length; i++) {
                argu.push(arguments[i]);
            }
            xhrReq.apply(this, argu);
            function sendGet(xhttp, method, url, param, headers, timeout) {

                xhttp.open(method, url + (param ? ('?' + param) : ''), true);

                for (var name in headers) {
                    xhttp.setRequestHeader(name, headers[name]);
                }

                if (timeout > 0) {
                    xhttp.timeout = timeout;
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
            function sendPost(xhttp, method, url, param, headers, timeout) {
                xhttp.open(method, url, true);

                for (var name in headers) {
                    xhttp.setRequestHeader(name, headers[name]);
                }

                if (!headers) {
                    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//default
                }

                if (timeout > 0) {
                    xhttp.timeout = timeout;
                }

                xhttp.send(param);
            }
        }
    };

    function IframeAjax() {

        /**
         * This is the iframe ajax technique for mainly uploading files which is not
         * possible with javascript ajax ie using XMLHttpRequest
         * 
         * @param {type} f can be a form or an array of form fields
         * @param {type} action_url action url
         * @param {type} successFn called if successful
         * @param {type} errorFn called if there is error
         * @returns {undefined}
         */
        this.send = function (f, action_url, successFn, errorFn) {
            action_url = urlWithHostAndProtocol(action_url);
            var inputs = f;
            if (f instanceof window.HTMLFormElement) {
                inputs = f.querySelectorAll('[name]');
            } else if (inputs && inputs.constructor !== Array && !(inputs instanceof window.NodeList)) {
                throw new Error('first parameter must be a form or an array of form elements on html node list');
            }

            // Create the iframe...
            var iframe = document.createElement("iframe");
            var frame_name = "upload_iframe_" + new Date().getTime();
            iframe.setAttribute("id", frame_name);
            iframe.setAttribute("name", frame_name);
            iframe.setAttribute("width", "0");
            iframe.setAttribute("height", "0");
            iframe.setAttribute("border", "0");
            iframe.setAttribute("style", "width: 0; height: 0; border: none;");
            var resotreInputFiles = function (original, clone) {
                clone.parentNode.insertBefore(original, clone);
                clone.parentNode.removeChild(clone);
            };

            var swaps = [];
            var ifrForm = document.createElement("form");//chuks
            for (var i = 0; i < inputs.length; i++) {//chuks
                var e = document.createElement(inputs[i].tagName);
                if (inputs[i].type === 'file') {
                    var clone = inputs[i].cloneNode(true);
                    inputs[i].parentNode.insertBefore(clone, inputs[i]);
                    e = inputs[i];//we are moving this file input to the iframe form and replacing the old location with the clone
                    swaps.push({original: inputs[i], clone: clone});
                } else {
                    e.setAttribute("type", inputs[i].type);
                    e.setAttribute("name", inputs[i].name);
                    e.setAttribute("value", inputs[i].value);
                }

                ifrForm.appendChild(e);
            }

            iframe.appendChild(ifrForm);

            // Add to document...
            document.body.appendChild(iframe);

            // Add event...
            var eventHandler = function () {

                if (iframe.detachEvent) {
                    iframe.detachEvent("onload", eventHandler);
                } else {
                    iframe.removeEventListener("load", eventHandler, false);
                }

                var content = '';

                // Message from server...
                var success = true;
                try {
                    if (iframe.contentDocument) {
                        content = iframe.contentDocument.body.innerHTML;
                    } else if (iframe.contentWindow) {
                        content = iframe.contentWindow.document.body.innerHTML;
                    } else if (iframe.document) {
                        content = iframe.document.body.innerHTML;
                    }
                } catch (e) {
                    success = false;
                    console.log(e);
                }


                //resotore back the original file input
                for (var i = 0; i < swaps.length; i++) {
                    resotreInputFiles(swaps[i].original, swaps[i].clone);
                }

                // Delelt the iframe...
                iframe.parentNode.removeChild(iframe);
                var statusCode = null;//must be null. Important! we will use this null value to know that the response is from iframe ajax and take appropriate decisions afterwards
                if (success) {
                    if (typeof successFn === 'function') {
                        successFn(content, statusCode);
                    }
                } else {
                    if (typeof errorFn === 'function') {
                        errorFn('', statusCode);
                    }
                }
            };

            if (iframe.addEventListener) {
                iframe.addEventListener("load", eventHandler, true);
            } else if (iframe.attachEvent) {
                iframe.attachEvent("onload", eventHandler);
            }

            // Set properties of form...
            ifrForm.setAttribute("target", frame_name);
            ifrForm.setAttribute("action", action_url);
            ifrForm.setAttribute("method", "post");
            ifrForm.setAttribute("enctype", "multipart/form-data");
            ifrForm.setAttribute("encoding", "multipart/form-data");

            // Submit the form...
            ifrForm.submit();

        };
    }



    Main.device = {

        isMobileDeviceReady: false,
        isDesktop: false,
        isDesktopApplication: false,
        backActions: [], //array of functions to execute when back button is press
        menuButtonAction: null,
        searchButtonAction: null,
        isPaused: false,
        isActive: true, //yes - considering if it is no a mobile device . safe this way!
        event: {
            /*Go to cordova website to see the list of supported device for the events
             * below. The commented parts are not supported
             */

            backbutton: {
                name: 'backbutton',
                supported: ['Android', 'BlackBerry 10' /*, 'iOS', 'Win32NT'*/, 'WinCE']
            },
            pause: {
                name: 'pause',
                supported: ['Android', 'BlackBerry 10', 'iOS', 'Win32NT', 'WinCE']
            },
            resume: {
                name: 'resume',
                supported: ['Android', 'BlackBerry 10', 'iOS', 'Win32NT', 'WinCE']
            },
            menubutton: {
                name: 'menubutton',
                supported: ['Android', 'BlackBerry 10' /*, 'iOS', 'Win32NT', 'WinCE'*/]
            },
            searchbutton: {
                name: 'searchbutton',
                supported: ['Android' /*, 'BlackBerry 10', 'iOS', 'Win32NT', 'WinCE'*/]
            }
        },
        constructor: function (config) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        },
        isSupported: function (ev) {
            if (this.isTesting) {//TESTING!!!
                console.log('REMIND: is testing!!! to be removed');
                return true;
            }

            if (typeof device === 'undefined') {//new
                console.log('Not a mobile device');
                return false;
            }

            var platf = device.platform;
            if (ev.is === true) {
                return true;
            } else if (ev.is === false) {
                return false;
            }
            for (var n in ev.supported) {
                if (platf === ev.supported[n]) {
                    ev.is = true;
                    return ev.is;
                }
            }

            ev.is = false;
        },
        // deviceready Event Handler
        //
        // Bind any cordova events here. Common events are:
        // 'pause', 'resume', etc.
        onDeviceReady: function () {

            this.isMobileDeviceReady = true;
            this.isActive = true;

            alert('onDeviceReady ');
            alert(this.isMobileDeviceReady);


            this.removeDeskTopScrollbarStyle();//just in case the device ready event delays too much

            navigator.app.overrideButton("menubutton", true); //this will force the menubutton to fire (work) - though not documented. I do not know why!

            document.addEventListener('pause', this.onPause.bind(this), false);
            document.addEventListener('resume', this.onResume.bind(this), false);
            document.addEventListener('backbutton', this.onBackButton.bind(this), false);
            document.addEventListener('menubutton', this.onMenuButton.bind(this), false);
            document.addEventListener('searchbutton', this.onSearchButton.bind(this), false);

        },

        onPause: function () {
            this.isPaused = true;
            this.isActive = false;

            alert('onPause');
        },

        onResume: function () {
            this.isPaused = false;
            this.isActive = true;
            window.setTimeout(function () {
                //accoring to the cordova doc, put interative function call in setTimeout upon resume
                //so as not to hang the application

                alert('onResume');

            }, 0);

        },

        onBackButton: function () {
            if (transitionInProgress) {
                //avoid a particular bug that results if the page
                //is already in transition
                alert('skipped onBackButton');
                return;
            }

            alert('onBackButton');
            var action = this.backActions[this.backActions.length - 1];

            if (Main.util.isFunc(action)) {
                try {
                    action();
                } catch (e) {
                    console.warn(e);
                }
            }

        },

        onMenuButton: function () {
            alert('onMenuButton');
            if (Main.util.isFunc(this.menuButtonAction)) {
                try {
                    this.menuButtonAction();
                } catch (e) {
                    console.warn(e);
                }
            }
        },

        onSearchButton: function () {
            alert('onSearchButton');
            if (Main.util.isFunc(this.searchButtonAction)) {
                try {
                    this.searchButtonAction();
                } catch (e) {
                    console.warn(e);
                }
            }
        },

        removeBackAction: function (action, specific) {
            if (!action) {
                return;
            }
            var c = 1;
            for (var i = this.backActions.length - 1; i > -1; i--) {

                if (action === this.backActions[i]) {
                    this.backActions.splice(i, c); //automatically clear all back actions upto to this point
                    break;
                }

                if (!specific
                        || (specific && !deviceBackMeOnly[specific])) {
                    c++;
                }
            }
        },

        addBackAction: function (action) {
            if (this.isSupported(this.event.backbutton)) {
                if (this.isMobileDeviceReady) {
                    this.backActions.push(action);
                }
            }
        },

        setMenuButtonAction: function (action) {
            if (this.isSupported(this.event.menubutton)) {
                if (this.isMobileDeviceReady) {
                    this.menuButtonAction = action;
                }
            }
        },
        setSearchButtonAction: function (action) {
            if (this.isSupported(this.event.searchbutton)) {
                if (this.isMobileDeviceReady) {
                    this.searchButtonAction = action;
                }
            }
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

        isPortriat: function () {
            return window.screen.height > window.screen.width;
        },

        isLandscape: function () {
            return window.screen.height < window.screen.width;
        },

        getPortriatInnerWidth: function () {
            return window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
        },
        getPortriatInnerHeight: function () {
            return window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
        },

        getLandscapeInnerWidth: function () {
            return Main.device.getPortriatInnerHeight();
        },
        getLandscapeInnerHeight: function () {
            return Main.device.getPortriatInnerWidth();
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
        },
        removeDeskTopScrollbarStyle: function () {
            if (deskStyle) {
                deskStyle.innerHTML = '';
            }

        },
        styleDesktopScrollbar: function (isIndexPage) {
            if (!isIndexPage) {
                return;
            }
            var desktop_scrollbar = "::-webkit-scrollbar {"/*width*/
                    + " width: 8px; height: 8px; }"//width and height must be same - width for vertical and height for horizontal scrollbar orientaion

                    + "::-webkit-scrollbar-button {"
                    + " width: 0px; height: 0px;" //or 8px if the button should show
                    //+ " background-color: #41963A;"//button background color
                    //+ " color: white; "+
                    + "}"

                    /*track*/
                    + "::-webkit-scrollbar-track {"
                    + " -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); "
                    + " box-shadow: inset 0 0 6px rgba(0,0,0,0.3); "
                    + " -webkit-border-radius: 4px;"
                    + " border-radius: 4px;"
                    + "}"

                    /*handle*/
                    + "::-webkit-scrollbar-thumb {"
                    + " background-color: #41963A;"
                    + " -webkit-border-radius: 4px;"
                    + " border-radius: 4px;"
                    + "}"
            
                    /*handle on hover*/
                    + "::-webkit-scrollbar-thumb:hover {"
                    + "background-color: #64BB31; }";

            if (!Main.device.isMobileDeviceReady) {//most likely a desktop device
                deskStyle = document.createElement('style');
                deskStyle.innerHTML = desktop_scrollbar;

                if (!_isDestopScrollbarStyled) {
                    var head = document.getElementsByTagName('head')[0];
                    head.appendChild(deskStyle);
                    _isDestopScrollbarStyled = true;
                }

            }
        }
    };


    Main.util = {

        isWebAssemblySupported: function () {

            var is_supported = null;//initial

            return function () {

                if (is_supported !== null) {
                    return is_supported;//return the saved answser
                }

                is_supported = false;
                try {
                    if (typeof window.WebAssembly === 'object'
                            && typeof window.WebAssembly.instantiate === 'function') {
                        var module = new window.WebAssembly.Module(window.Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                        if (module instanceof window.WebAssembly.Module) {
                            var instance = new window.WebAssembly.Instance(module);
                            is_supported = instance instanceof window.WebAssembly.Instance;
                        }
                    }
                } catch (e) {
                    //we are not interested
                }
                return is_supported;
            };
        }(),

        isFunc: function (fn) {
            return typeof fn === "function";
        },

        isString: function (str) {
            return typeof str === "string";
        },

        isArray: function (a) {
            return a && a.constructor === Array;
        },

        endsWith: function (str, search) {
            var s_len = search.length;
            if (s_len > str.length || s_len === 0) {
                return false;
            }
            var start = str.length - s_len;

            for (var i = start, n = 0; i < str.length; i++, n++) {
                if (str.charAt(i) !== search.charAt(n)) {
                    return false;
                }
            }
            return true;
        },

        startsWith: function (str, search) {
            if (search.length === 0) {
                return false;
            }
            return str.indexOf(search) === 0;
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

        toSentenceCase: function (str) {
            if (str.length > 1) {
                return str.substring(0, 1).toUpperCase() + str.substring(1); // to sentence case
            }
            if (str.length === 1) {
                return str.toUpperCase(); // to sentence case
            }
        },

        serilaNo: function () {
            var serial = 0;
            return function () {
                return ++serial;
            };
        }()//yes

    };

    var EventIO = function () {
        var evtListeners = {};
        var ack_msg_ids = [];
        var MAX_TRACK_MSG_IDS = 20; //max message ids to track in order to detect and prevent duplicate messages
        var is_midware_set;
        this.on = function (event_name, listener) {
            if (!Main.util.isFunc(listener)) {
                return;
            }
            if (!evtListeners[event_name]) {
                evtListeners[event_name] = [];
            }
            //avoid duplicate before registering the listener
            if (evtListeners[event_name].indexOf(listener) === -1) {
                evtListeners[event_name].push(listener);
            }

            if (!is_midware_set && socket) {
                socket.on("message", msgMidware);
                is_midware_set = true;
            }
        };

        this.off = function (evt_name, func) {

            if (evtListeners[evt_name] && !func) {
                evtListeners[evt_name] = null;
            } else if (evtListeners[evt_name]) {
                var listeners = evtListeners[evt_name];
                for (var f in listeners) {
                    if (listeners[f] === func) {
                        listeners[f].splice(f, 1);
                    }
                }
            }
        };

        function msgMidware(msg) {
            if (typeof msg === 'string') {//stringified json
                try {
                    msg = JSON.parse(msg);
                } catch (e) {
                    console.log(e);//invalid json
                }
            }

            if (msg.acknowledge_delivery) {
                var ack = {
                    msg_id: msg.msg_id,
                    user_id: msg.user_id, //important!
                    acknowledge_delivery: msg.acknowledge_delivery
                };
                socket.emit('acknowledge_delivery', ack);

                if (ack_msg_ids.indexOf(msg.msg_id) > -1) {
                    console.log('detect duplicate recieved message with id - ' + msg.msg_id);
                    return;
                }

                ack_msg_ids.push(msg.msg_id);

                if (ack_msg_ids.length > MAX_TRACK_MSG_IDS) {//
                    //remove the top in the list
                    ack_msg_ids.splice(0, 1);
                }

            }

            //more midware checks may go below before calling the listeners

            //-----
            function EventObject(event_name, data) {
                this.type = event_name;
                this.data = data;
                this.socket = {};
                this.socket.emit = function (evt_name, data, callback) {
                    socket.emit(evt_name, data, callback);
                };
            }


            //call the listeners for this event
            var data = msg.data;
            for (var evt in evtListeners) {
                var len = evtListeners[evt].length;
                if (evt === msg.event_name) {
                    for (var k = 0; k < len; k++) {
                        var listrner = evtListeners[evt][k]; //listener
                        try {
                            var evt_obj = new EventObject(msg.event_name, data);
                            listrner(evt_obj);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    return;
                }
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
        var MAX_WAIT_CONNECT = 60; //60 seconds
        var rcallFailures = {};
        var nextRCallLiveRetrySec = 2;
        var retryLiveArgs = [];
        var rio;
        var retrials = [];
        var nextRCallExecRetrySec = 1;
        var nextRetryExecTime;
        var isRetryingExec = false;
        var rcallRetryExecTimerId = null;
        var RCALL_MULTIPART_REQUEST_FIELD_NAME = 'RCALL_MULTIPART_REQUEST_FIELD_NAME';

        Main.ready(function () {
            if (!rio) {
                rio = new RIO();
            }
        });

        function addRetry(obj_param) {
            retrials.push(obj_param);
            execRetry();
        }

        function doRetryExec() {
            isRetryingExec = false;
            nextRetryExecTime = new Date().getTime() + getNextRetryExecSec(nextRCallExecRetrySec) * 1000;
            if (retrials.length === 0) {
                nextRetryExecTime = 0;
                return;
            }

            for (var i = 0; i < retrials.length; i++) {
                Main.rcall.exec(retrials[i]);
            }

            retrials = [];//clear all

            execRetry();
        }

        function secondsRemainToRetry() {
            if (nextRetryExecTime) {
                return Math.ceil((nextRetryExecTime - new Date().getTime()) / 1000);
            } else {
                return getNextRetryExecSec(nextRCallExecRetrySec);
            }
        }

        function execRetry() {

            if (isRetryingExec) {
                return;
            }

            isRetryingExec = true;
            nextRCallExecRetrySec = getNextRetryExecSec(nextRCallExecRetrySec);
            rcallRetryExecTimerId = window.setTimeout(doRetryExec, nextRCallExecRetrySec * 1000);

            if (nextRCallExecRetrySec === 0) {
                nextRCallExecRetrySec = 1;
            }
        }

        function retryNow() {
            isRetryingExec = false;
            if (rcallRetryExecTimerId) {
                window.clearTimeout(rcallRetryExecTimerId);
            }
            nextRCallExecRetrySec = 0;
            execRetry();
        }

        function getNextRetryExecSec(sec) {

            sec *= 2;
            if (sec >= 256) {
                sec = 4;
            }

            return sec;
        }

        function RIO() {
            var sucFnList = {};
            var errFnList = {};
            var serial = 0;
            var reconnectFactor = 1;
            var last_conn_time = new Date().getTime();

            var url = '/rcall';
            url = urlWithHostAndProtocol(url);
            if (window.io) {
                sock();
            }


            //We observed that some time the disconnection evetn is not fired
            //thus making the connection lost forever. To avoid this, we will
            //periodically check for connection and autmatically connect to the 
            //server if discovered that this connection is lost
            var imObj = {immediate: true};
            window.setInterval(reconnectSocket.bind(imObj), MAX_WAIT_CONNECT);

            this.checkConnect = function () {
                if (!socket && window.io) {
                    sock();
                }
                if (socket.connected === false && last_conn_time) {
                    var elapse = (new Date().getTime() - last_conn_time) / 1000;
                    var MAX_ELAPSE = 10;
                    //attempt a socket connection. 
                    //also possible no discconnect event was received
                    //in which case our re-connection strategy will be useless
                    //and the connection will be off indefinitely. So avoid
                    //that indefinite loss of connection
                    if (elapse > MAX_ELAPSE) {
                        reconnectSocket();
                    }
                }
                return socket && socket.connected === true;
            };

            this.send = function (_data, successFn, errorFn) {
                serial++;
                var uniqueNo = new Date().getTime() + "_" + serial;
                var data = {
                    _rcall_req_id: uniqueNo,
                    data: _data
                };
                sucFnList[uniqueNo] = successFn;
                errFnList[uniqueNo] = errorFn;

                socket.emit('rcall_request', data);
            };

            function sock() {

                socket = window.io.connect(url); //users is the socketio namespace used

                socket.on('rcall_response', onRCallResponse);
                socket.on('connect', onConnect);
                socket.on('disconnect', onDisconnect);
                socket.on('error', onErrorSocket);
            }

            function onRCallResponse(msg) {
                var key = msg._rcall_req_id;

                sucFnList[key](msg);

                delete sucFnList[key];
                delete errFnList[key];
            }

            function onConnect(msg) {
                reconnectFactor = 1;
            }

            function onDisconnect(msg) {
                //alert('disconnect');
                reconnectSocket();
            }

            function onErrorSocket(msg) {
                //alert('error');
                reconnectSocket();
            }

            function reconnectSocket() {
                if (reconnectFactor >= MAX_WAIT_CONNECT) {
                    reconnectFactor /= 4; //restart the connect after 
                    if (reconnectFactor < 1) {//just in case
                        reconnectFactor = 1;
                    }
                } else {
                    reconnectFactor *= 2; // increment the time to wait before trying again
                }
                var factor = reconnectFactor;
                if (this.immediate) {
                    factor = 0;
                }

                window.setTimeout(function () {
                    if (socket.connected === false) {
                        sucFnList = {};
                        errFnList = {};
                        socket.connect();
                        last_conn_time = new Date().getTime();
                    }

                }, factor * 1000);
            }
        }

        this.resend = function () {
            retryNow();
        };

        this.live = function () {
            var objInst, fn;
            var meThis = this;

            if (arguments.length === 1) {
                if (Main.util.isFunc(arguments[0])) {//where only function is passed
                    fn = arguments[0];
                    if (isGetRcallLive) {
                        rcallWaitingFn.push(fn);
                        return;
                    }

                    //console.log('Object.getOwnPropertyNames(rcallFailures)  ', Object.getOwnPropertyNames(rcallFailures));
                    //console.log('Object.getOwnPropertyNames(rcallFailures).length  ', Object.getOwnPropertyNames(rcallFailures).length);

                    if (Object.getOwnPropertyNames(rcallFailures).length > 0) {
                        this.live(rcallFailures, arguments[0]);
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
                    rcallFailures[n] = cls;//save - we shall delete if the operation is successful
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
                            delete rcallFailures[n]; //the operation is successful so delete the entry
                        }

                        isGetRcallLive = false;
                        var json = JSON.parse(res);
                        var data = json.data;
                        if (json.error) {
                            rcallErr(json.error);
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
                                        this._data_bind = {};//default
                                        this._getFn;
                                        this._errFn;
                                        this._beforeFn;
                                        this._afterFn;
                                        this._retry;
                                        this._timeout;
                                        this._attach;

                                        var _busy_obj = null; //yes
                                        var me = this;

                                        this.get = function (fn) {
                                            this._getFn = fn;
                                            return me;
                                        };

                                        this.error = function (fn) {
                                            this._errFn = fn;
                                            return me;
                                        };

                                        this.before = function (fn) {
                                            this._beforeFn = fn;
                                            return me;
                                        };

                                        this.after = function (fn) {
                                            this._afterFn = fn;
                                            return me;
                                        };

                                        this.timeout = function (param) {
                                            this._timeout = param;
                                            return me;
                                        };
                                        /**
                                         * Calling the method will cause rcall to automatically retry
                                         * the request upon connection timeout of failure using in-built
                                         * retry strategy
                                         * 
                                         * @param {type} param can be a function or any truthy value
                                         * @returns {MainL#4.RCall.live.MainL#4#RCall#live#L#964.promiseFn}
                                         */
                                        this.retry = function (param) {
                                            this._retry = param;
                                            return me;
                                        };

                                        /**
                                         * Call this method to upload files
                                         * 
                                         * @param {type} file_inputs - input file element
                                         * @returns {MainL#4.RCall.live.MainL#4#RCall#live#L#979.promiseFn}
                                         */
                                        this.attach = function (file_inputs) {
                                            if (!Main.util.isArray(file_inputs)
                                                    && !(file_inputs instanceof window.NodeList)) {
                                                file_inputs = [file_inputs];
                                            }//C:\Users\HP-PC\Documents\NetBeansProjects\Game9ja\test\test-copy-file.js
                                            //verify if the param is an array of input file elements
                                            for (var i = 0; i < file_inputs.length; i++) {
                                                var is_input_element = file_inputs[i] instanceof window.HTMLInputElement;
                                                if (!is_input_element
                                                        || (is_input_element && file_inputs[i].type !== 'file')) {
                                                    console.error('invalid rcall attachements at index ' + i + ' - must be input file element but found ', file_inputs[i]);
                                                    throw Error('invalid rcall attachements at index ' + i + ' - must be input file element');
                                                }

                                                if (!file_inputs[i].name) {
                                                    throw Error('invalid rcall attachements at index ' + i + ' - input file element must have a name attribute a value');
                                                }

                                                if (file_inputs[i].name === RCALL_MULTIPART_REQUEST_FIELD_NAME) {
                                                    throw Error('invalid rcall attachements at index ' + i + ' - input file element must not be given a name "' + RCALL_MULTIPART_REQUEST_FIELD_NAME + '", which is used internally by rcall.');
                                                }


                                            }

                                            this._attach = file_inputs;
                                            return me;
                                        };
                                        this.busy = function (obj) {
                                            var o = obj || {};
                                            if (!o.el) {
                                                o.el = document.body;
                                            }
                                            _busy_obj = o;
                                            return me;
                                        };
                                        this._getBusyObj = function () {
                                            return _busy_obj;
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
                                        var fnBind = arguments[arguments.length - 1];
                                        if (Main.util.isFunc(fnBind)) {
                                            argu = [];
                                            for (var i = 0; i < arguments.length - 1; i++) {
                                                argu[i] = arguments[i];
                                            }
                                        } else {
                                            fnBind = null;
                                        }

                                        //run asynchronously to ensure promise is created
                                        window.setTimeout(doRemoteMethod, 0);

                                        function doRemoteMethod() {
                                            var bind = fnBind ? fnBind() : promise._data_bind; //local bind - value will be available in the promise
                                            try {
                                                if (Main.util.isFunc(promise._beforeFn)) {
                                                    promise._beforeFn.call(bind);
                                                }
                                            } catch (e) {
                                                console.log(e);
                                            }

                                            if (promise._getBusyObj()) {
                                                //show busy
                                                Main.busy.show(promise._getBusyObj.call(bind));
                                            }

                                            var objParam = {
                                                class: className,
                                                method: method,
                                                param: argu,
                                                bind: bind,
                                                attach: promise._attach,
                                                timeout: promise._timeout
                                            };

                                            var bndRcallCallback = rcallCallback.bind(objParam);

                                            objParam.callback = bndRcallCallback;

                                            Main.rcall.exec(objParam);

                                            function rcallCallback(response, is_iframe_response, bind) {
                                                try {
                                                    var data, err;
                                                    if (response.success === true) {
                                                        nextRCallExecRetrySec = 1;//initialize retry 
                                                        data = response.data;
                                                        if (Main.util.isFunc(promise._getFn)) {
                                                            promise._getFn.call(bind, data);
                                                        }

                                                    } else {
                                                        err = response.data;
                                                        var err_code = response.err_code;
                                                        if (is_iframe_response && typeof response.success === 'undefined') {
                                                            err = response;//the server most likely sent response message describing the http status error e.g 404
                                                            err_code = null;
                                                        }

                                                        var connect_err = response.connect_err;

                                                        if (connect_err && promise._retry) {//handle retry only for connection failures
                                                            if (Main.util.isFunc(promise._retry)) {
                                                                promise._retry.call(bind, secondsRemainToRetry());
                                                            }

                                                            var execObjParam = this;
                                                            addRetry(execObjParam);
                                                            return;
                                                        }


                                                        if (Main.util.isFunc(promise._errFn)) {
                                                            promise._errFn.call(bind, err, err_code, connect_err);
                                                        }
                                                    }
                                                } catch (e) {
                                                    console.log(e);
                                                }

                                                if (promise._getBusyObj()) {
                                                    //hide busy
                                                    Main.busy.hide();
                                                }

                                                if (Main.util.isFunc(promise._afterFn)) {
                                                    promise._afterFn.call(bind, data, err);
                                                }
                                            }
                                        }



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
                        retryCausedBy500X(status);
                        rcallErr('rcall failed! Could not get resource. Status text : ' + statusText);
                    });

            function rcallErr(log) {
                rcallWaitingFn = [];
                isGetRcallLive = false;
                console.warn(log);
            }
            /**
             * Retry  initializing the rcall variables if the failure 
             * is caused by server - possibly the server is off.
             * So we want to be sure if the server is back the rcall
             * variables will the initialied to avoid error caused by case
             * where call to the remote methods throws:
             * Uncaught TypeError: Cannot read property 'sendRequest' of undefined
             * 
             * So when the server is back a setTimeout will attempt to retry the 
             * initialization of the rcall variables
             * @param {interger} status 
             * @returns {undefined}
             */
            function retryCausedBy500X(status) {
                if (status < 500) {
                    return;
                }

                //at this point the error is cause by the server
                //so we will continue to retry until the rcall variables
                //are initialized

                if (nextRCallLiveRetrySec >= MAX_WAIT_CONNECT) {
                    nextRCallLiveRetrySec /= 4; //retry after 
                    if (nextRCallLiveRetrySec < 1) {//just in case
                        nextRCallLiveRetrySec = 1;
                    }
                } else {
                    nextRCallLiveRetrySec *= 2; // increment the time to wait before trying again
                }

                window.setTimeout(function () {
                    if (Object.getOwnPropertyNames(rcallFailures).length > 0) {

                        console.log('rcallFailures', rcallFailures);

                        //we are only interesed in initializing the rcall variables to 
                        //avoid error caued by access remote method when not already created
                        //ie Cannot read property 'TheMethod' of undefined
                        meThis.live(rcallFailures);
                    }

                }, nextRCallLiveRetrySec * 1000);
            }


        };

        this.exec = function (param) {
            var r;
            if (arguments.length === 1) {
                if ((r = validateSingeArg(param))) {
                    remoteExec(r);
                }
            } else {
                if ((r = validateMultiArgs(arguments))) {
                    remoteExec(r);
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

                return {objArr: o_arr, attach: obj.attach, callback: obj.callback, bind: obj.bind, timeout: obj.timeout};
            }

            function remoteExec(r) {

                var objArr = r.objArr,
                        attach = r.attach,
                        bind = r.bind,
                        timeout = r.timeout,
                        callback = r.callback;

                var param = JSON.stringify({action: 'remote_call', data: objArr});

                if (attach) {//for the case with file attachment use iframe ajax for upload
                    //we just need to convert to array because we want to attach another field to hold other rcall request
                    var fields = [];
                    var otherReqField = document.createElement('input');

                    otherReqField.setAttribute('type', 'text');
                    otherReqField.setAttribute('name', RCALL_MULTIPART_REQUEST_FIELD_NAME);
                    otherReqField.value = param;

                    fields.push(otherReqField);
                    if (attach instanceof window.NodeList || Main.util.isArray(attach)) {
                        for (var i = 0; i < attach.length; i++) {
                            fields.push(attach[i]);
                        }
                    }

                    Main.iframeAjax.send(fields, 'rcall_with_upload', successFn, errorFn);

                } else if (rio.checkConnect()) {
                    rio.send(objArr, successFn, errorFn);
                } else {
                    var data = {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        param: param,
                        timeout: timeout
                    };

                    Main.ajax.post('rcall', data, successFn, errorFn);
                }

                function successFn(response, status) {
                    if (Main.util.isString(response)) {
                        try {//try check if it is json and convert if so
                            response = JSON.parse(response);
                        } catch (e) {
                            //do nothing
                        }
                    }
                    var is_iframe_response = status === null;
                    callback(response, is_iframe_response, bind);
                }

                function errorFn(statusText, status) {
                    var response = {};
                    var connect_err = false;
                    if (status === 0) {
                        connect_err = true;
                        statusText = 'Please check connection!'; // we prefer this description
                    }
                    if (status === 504) {
                        connect_err = true;
                        statusText = 'Connection to the server has timed out!'; // we prefer this description
                    }

                    response.success = false;
                    response.data = statusText;
                    response.err_code = status;
                    response.connect_err = connect_err;

                    var is_iframe_response = status === null;
                    callback(response, is_iframe_response, bind);
                }

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
                //avoid duplicate
                if (evtList[evt_name].indexOf(func) === -1) {
                    evtList[evt_name].push(func);
                }
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
        this.off = function (evt_name, func) {

            if (evtList[evt_name] && !func) {
                evtList[evt_name] = null;
            } else if (evtList[evt_name]) {
                var listeners = evtList[evt_name];
                for (var i = 0; i < listeners.length; i++) {
                    if (listeners[i] === func) {
                        listeners.splice(i, 1);
                        break;
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
        var lastPage;

        var _game9ja_Dom_Hold_PgBack = '_game9ja_Dom_Hold_PgBack_' + new Date().getTime(); // a unique property to be created in dom element for storing data
        var _game9ja_Dom_Hold_Has_Back_Action = '_game9ja_Dom_Hold_Has_Back_Action_' + new Date().getTime(); // a unique property to be created in dom element for storing data
        var _game9ja_Dom_Hold_Page_On_Hide = '_game9ja_Dom_Hold_Page_On_Hide' + new Date().getTime(); // a unique property to be created in dom element for storing data

        var currentPage;

        function swapShow(pg, transition, forward, pgGoOut, hasBackAction) {
            var eff = transition, duration = effDuration;
            if (transition && !Main.util.isString(transition)) {//not string then object!
                eff = transition.effect;
                duration = transition.duration;
            }
            var eff = eff ? eff.toLowerCase() : null;
            duration = duration ? duration : 0;
            var pageIn = pg.page;
            pageIn[0][_game9ja_Dom_Hold_Has_Back_Action] = hasBackAction;

            var pageOut;

            for (var i = 0; i < pages.length; i++) {
                if (pages[i] === lastPage) {
                    pageOut = pages[i].page;
                    if (pgGoOut && pages[i].onHide) {
                        pgGoOut[_game9ja_Dom_Hold_Page_On_Hide] = {data: pages[i].data, onHide: pages[i].onHide};
                    }
                    break;
                }
            }

            if (pageIn === pageOut) {
                alert('same page');
            }
            initPageInOut(pageIn, pageOut);

            if (eff === "fade" || eff === "fadein" || eff === "fadeout") {
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
                afterPageChange(forward, pageIn, pgGoOut);
            }

            lastPage = pg;//new
            //lastPageUrl = pg.url;//old

            currentPage = pageIn;

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
                afterPageChange(forward, pageIn, pgGoOut);
            };

            var jqOut = {};
            jqOut.opacity = 0;
            var onCompleteOut = function () {
                afterPageChange(forward, pageIn, pgGoOut);
            };

            var tweenIn = {opacity: jqIn.opacity, onComplete: onCompleteIn};
            var tweenOut = {opacity: jqOut.opacity, onComplete: onCompleteOut};

            var durationOut = 20; //new

            if (window.TweenMax) {
                TweenMax.to(pageIn, duration / 1000, tweenIn);
                TweenMax.to(pageOut, durationOut / 1000, tweenOut);
            } else if (window.TweenLite) {
                TweenLite.to(pageIn, duration / 1000, tweenIn);
                TweenLite.to(pageOut, durationOut / 1000, tweenOut);
            } else if (window.$) {
                $(pageIn).animate(jqIn, duration, onCompleteIn);
                $(pageOut).animate(jqOut, durationOut, onCompleteOut);
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
                    afterPageChange(forward, pageIn, pgGoOut);
                }

            };

            var jqOut = {};
            jqOut.top = forward ? "-100%" : "100%";
            var onCompleteOut = function () {
                second = true;
                if (first && second) {
                    document.body.style.overflow = body_overflow;
                    afterPageChange(forward, pageIn, pgGoOut);
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
                    afterPageChange(forward, pageIn, pgGoOut);
                }

            };

            var jqOut = {};
            jqOut.left = forward ? "-100%" : "100%";
            var onCompleteOut = function () {
                second = true;
                if (first && second) {
                    document.body.style.overflow = body_overflow;
                    afterPageChange(forward, pageIn, pgGoOut);
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

        function afterPageChange(forward, pageIn, pgGoOut) {
            transitionInProgress = false;
            pageIn[0].style.overflow = "auto";

            var backFn;
            var oHobj;

            if (pgGoOut) {//get the page back function stored in the dom                
                backFn = pgGoOut[_game9ja_Dom_Hold_PgBack];
                if (!backFn) {
                    //then try this
                    if (pgGoOut[0]) {
                        backFn = pgGoOut[0][_game9ja_Dom_Hold_PgBack];
                    }
                }

                oHobj = pgGoOut[_game9ja_Dom_Hold_Page_On_Hide];
                delete pgGoOut[_game9ja_Dom_Hold_Page_On_Hide];//avoid duplicate call

                if (!oHobj) {
                    //then try this
                    if (pgGoOut[0]) {
                        oHobj = pgGoOut[0][_game9ja_Dom_Hold_Page_On_Hide];
                        delete pgGoOut[0][_game9ja_Dom_Hold_Page_On_Hide];//avoid duplicate call
                    }
                }

                if (oHobj) {
                    try {
                        oHobj.onHide(oHobj.data);
                    } catch (e) {
                        console.log(e);
                    }
                }

                $(pgGoOut).remove();//now remove
            }

            if (forward) {
                var has_back_action = pageIn[0][_game9ja_Dom_Hold_Has_Back_Action] !== false;//yes strictly !==false
                pageIn[0][_game9ja_Dom_Hold_PgBack] = function () {//important!
                    if (this.has_back_action) {
                        return Main.page.back();
                    }
                }.bind({has_back_action: has_back_action});

                Main.device.addBackAction(pageIn[0][_game9ja_Dom_Hold_PgBack]);

            } else {

                Main.device.removeBackAction(backFn);
            }



        }

        function showPg(p, transition, forward, pgGoOut, pgShowObj, hasBackAction) {

            /*@deprecated
             * if (Main.util.isString(p)) {//is url string
             for (var i = 0; i < pages.length; i++) {
             if (pages[i].url === p) {
             p = pages[i];
             break;
             }
             }
             }*/

            /*if (p.url === lastPageUrl) {//old
             return;//already showing!
             }*/
            if (p === lastPage) {//new
                return;//already showing!
            }

            //call pagebeforeshow listerners
            var isIndexPage = false;
            if (p === pages[0]) {
                isIndexPage = true;
            }
            callListeners(listeners["pagebeforeshow"], {pageUrl: p.url, isIndexPage: isIndexPage, data: p.data});

            if (pgShowObj && pgShowObj.onBeforeShow) {
                try {
                    pgShowObj.onBeforeShow(p.data);
                } catch (e) {
                    console.warn(e);
                }
            }

            if (pgShowObj && pgShowObj.onHide) {
                p.onHide = pgShowObj.onHide;
            }

            //now show
            swapShow(p, transition, forward, pgGoOut, hasBackAction);

            //call pageshow listerners
            callListeners(listeners["pageshow"], {pageUrl: p.url, isIndexPage: isIndexPage, data: p.data});

            if (pgShowObj && pgShowObj.onShow) {
                try {
                    pgShowObj.onShow(p.data);
                } catch (e) {
                    console.warn(e);
                }
            }

            if (pgShowObj && pgShowObj.finishPg) {
                pgShowObj.finishPg();
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

            //console.log(pg.html());

            return cont;
        }

        function addPage(url, response, data, transition) {

            var pg_recv = $("<div></div>").html("<div data-app-content='page'>" + response + "</div>");
            var title = pg_recv.find('title').html();
            var pg = refactorBody(pg_recv, "[data-app-content=page]");

            $('body').append(pg);

            pages.push({
                url: url,
                response: response,
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
            callListeners(listeners["pagecreate"], {pageUrl: lastPage.url, isIndexPage: false, data: lastPage.data});

            return lastPage;
        }

        function load(p, transition, forward, data, pgShowObj, hasBackAction) {
            var url = Main.util.isString(p) ? p : p.url;

            for (var pg_index = 0; pg_index < pages.length; pg_index++) {
                var pg = pages[pg_index];
                if (pg.url === url) {

                    if (pg_index === 0) {
                        //handle home page differently
                        Main.page.home({transition: transition, data: data});
                        return;
                    }

                    //Make the page the last page in the list.
                    if (pg_index === pages.length - 1) {
                        //skip the last in the page list -  the last page is already
                        //at the end so no need to make it last.
                        showPg(pg, transition, forward, null, pgShowObj, hasBackAction);
                        return;
                    }

                    //now make it the last page
                    pages.splice(pg_index, 1);//remove from old location
                    pages.push(pg);//put at the end

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
                                callListeners(listeners["pagecreate"], {pageUrl: lastPage.url, isIndexPage: false, data: lastPage.data});
                                showPg(lastPage, transition, forward, null, pgShowObj, hasBackAction);
                                break;
                            }
                        }
                    }

                    return;
                }
            }
            var inUrl = intentUrl(url);

            $.get(inUrl, function (response) {

                var found = false;
                var p;
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].url === url) {
                        p = pages[i];
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    p = addPage(url, response, data, transition);
                }

                showPg(p, transition, forward, null, pgShowObj, hasBackAction);
            }).fail(function () {
                console.log("could not get resource:", inUrl);
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

            var pgOut = lastPage.page;

            showPg(pages[0], transition, false, pgOut, _pShowFn(obj));

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


        this.back = function (obj) {
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
                    //get the out-going page which we shall remove from the
                    //DOM when the page change is complete
                    if ($(children[i]).attr('data-app-content') === 'page') {
                        pgGoOut = children[i];
                        break
                    }
                }
                var toPg = pages[pages.length - 2];
                var pgShowObj;
                if (typeof obj === 'object') {
                    toPg.data = obj.data;
                    pgShowObj = _pShowFn(obj);
                }

                showPg(toPg, lastPage.transition, false, pgGoOut, pgShowObj);
                pages.splice(last_index, 1);//remove the last page

            }

            return true;//important!
        };

        /*
         * Removes the current page and show a new page
         * @param {type} obj
         * @returns {undefined|Boolean}
         */
        this.removeAndShow = function (obj) {
            show0(obj, afterPageShow);

            function afterPageShow() {
                if (pages.length < 2) {//there must be at least two page for us to be able to remove the 2nd to last one
                    return;
                }

                //At this point the is at least 2 pages

                //Remove the 2nd to last page from the page array collection
                var _prev_index = pages.length - 2; // we need the 2nd to last index
                pages.splice(_prev_index, 1);

                //remove the 2nd to last page from the DOM
                var children = $('body').children();
                var count = 0;//counting from the back (last page)
                for (var i = children.length - 1; i > -1; i--) {
                    if (children[i].nodeName === 'SCRIPT') {
                        continue;
                    }
                    if ($(children[i]).attr('data-app-content') === 'page') {
                        count++;
                        if (count === 2) {//2nd to the last page
                            children[i].remove();
                            break;
                        }
                    }
                }
            }
        };

        this.show = function (obj) {
            return show0(obj);//important!
        };

        show0 = function (obj, finishPg) {
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


            load(obj.url, transit, !(obj.forward === false), obj.data, _pShowFn(obj, finishPg), (obj.hasBackAction !== false));
            return true;//important!
        };

        this.getUrl = function () {
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].page === currentPage) {
                    return pages[i].url;
                }
            }
            return '';
        };

        var _pShowFn = function (obj, finishPg) {
            return {
                onShow: obj && obj.onShow ? obj.onShow : null,
                onBeforeShow: obj && obj.onBeforeShow ? obj.onBeforeShow : null,
                onHide: obj && obj.onHide ? obj.onHide : null,
                finishPg: finishPg
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
                callListeners(listeners["pagecreate"], {pageUrl: pages[0].url, isIndexPage: true});

                showPg(pages[0], null, true);
                isPageInit = true;//yes, must be here
                return;
            }
        };

        return this;

    }

    function Tpl() {
        var tplList = {};
        var waitTplLoading;
        var regexTplMatchParams = {};
        var queue = [];

        function tplReplace(html, obj, data) {

            var param_arr = regexTplMatchParams[obj.tplUrl];

            if (!param_arr) {
                var regex = /{[a-zA-Z_][a-zA-Z0-9._-]*}/g;
                param_arr = html.match(regex);
                if (!param_arr) {
                    param_arr = [];
                }
                for (var i = 0; i < param_arr.length; i++) {
                    //remove the opening and closing braces - { and }
                    param_arr[i] = param_arr[i].substring(1, param_arr[i].length - 1);
                }
                regexTplMatchParams[obj.tplUrl] = param_arr;
            }

            for (var i = 0; i < param_arr.length; i++) {
                var v;
                var param = param_arr[i];
                if (obj.onReplace) {
                    try {
                        v = obj.onReplace(param, data);
                    } catch (e) {
                        v = undefined;
                        console.log(e);
                    }

                }

                var obj_path = param.split('.');//assuming it is object parameter (e.g xxx.yyy.0.zzz) - if not this approach will also work anyway
                var top_lev_par = obj_path[0];//top level parameter
                if (typeof v === 'undefined' && typeof data[top_lev_par] !== 'undefined') {
                    var v = data[top_lev_par];
                    for (var k = 1; k < obj_path.length; k++) {
                        var par = obj_path[k];
                        if (typeof v[par] === 'undefined') {
                            break;
                        }
                        v = v[par];
                    }
                }

                html = html.replace('{' + param + '}', v);
            }
            var div_wapper = '<div></div>';
            var content = $(div_wapper).html(html);

            //remove title, script, link and meta tags if present
            $(content).find('title , script, link , meta').each(function (index) {
                this.remove();
            });

            //remove the div_wapper
            var cnt = content[0];// jquery to plain js dom
            var rpl_children = cnt.children;
            if (rpl_children.length === 1) {
                rpl_children = rpl_children[0];
            }
            if (obj.afterReplace) {
                try {
                    obj.afterReplace(rpl_children, data);
                } catch (e) {
                    console.log(e);
                }

            }

        }


        this.template = function (obj) {

            queue.push(obj);
            if (waitTplLoading) {
                return;
            }
            waitTplLoading = true;
            doGet(obj);

            //console.log(obj.tplUrl, '---', obj.data);

            function next() {
                waitTplLoading = false;
                queue.shift();
                if (queue.length === 0) {
                    return;
                }

                //console.log(obj.tplUrl, '---next---', obj.data);

                var qObj = queue[0];
                if (qObj) {
                    doGet(qObj);
                }
            }

            function doGet(obj) {
                var res = tplList[obj.tplUrl];
                if (res) {//already have it in memory

                    tplReplace(res, obj, obj.data);

                    //console.log(obj.tplUrl, '---before Sync next---', obj.data);

                    next();
                    return;
                }
                var url = intentUrl(obj.tplUrl);
                $.get(url, function (response) {
                    tplList[obj.tplUrl] = response;
                    tplReplace(response, obj, obj.data);

                    //console.log(obj.tplUrl, '---before Async next---', obj.data);

                    next();

                }).fail(function () {
                    next();
                    console.log("could not get resource:", url);
                });
            }

        };
    }

    function Listview() {
        var regexMatchParams = {};
        var listTpl = {};
        var listTplWaitCount = {};
        var ListTplGetting = {};
        var _game9ja_Dom_Hold_Data = '_game9ja_Dom_Hold_Data_' + new Date().getTime(); // a unique property to be created in dom element for storing data
        //MAX_OFF of 15 has some problem on my itel device - come back to resolve this bug later!
        var MAX_OFF = 100;//max number of elements off view before consodering remove element from dom.
        var MAX_REMAINING_OFF = MAX_OFF - 5;//max number of elements to be left after removal for excess 
        var MIN_REMAINING_OFF = MAX_REMAINING_OFF - 5;//number of elements off view before putting back the removed elements
        var lastSelectedListviewItem;

        function listThis(html, obj) {

            var container_id = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;

            /**
             * Get the data in the listview at the specified index
             * 
             * @param {type} index
             * @returns {undefined|jQuery|MainL#4.Listview.listThis.getData.children|MainL#4.Listview.listThis.getData.child}
             */
            this.getData = function (index) {
                if (index < 0) {
                    return;//important
                }
                var children = $(container_id).children();
                if (index < children.length) {
                    var child = children[index];
                    if (child) {
                        return child[_game9ja_Dom_Hold_Data];
                    }
                }

            };

            this.addItem = function (data) {//analogous to appendItem
                this.appendItem(data);
            };

            this.appendItem = function (data) {
                putItem(html, obj, data, doAppendItem);
            };

            this.prependItem = function (data) {
                putItem(html, obj, data, doPrependItem);
            };

            this.removeItemAt = function (index) {
                if (index < 0) {
                    return;//important
                }
                var children = document.getElementById(container_id).children;
                if (index < children.length) {
                    var child = children[index];
                    if (child) {
                        child.remove();
                    }
                }

            };

            this.replaceItem = function (data, fn) {

                var children = document.getElementById(container_id).children;
                var el;
                var el_index = -1;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var dom_data = child[_game9ja_Dom_Hold_Data];
                    if (typeof dom_data !== 'undefined' && fn(dom_data) === true) {
                        el = child;
                        el_index = i;
                        break;
                    }
                }

                if (!el) {
                    return false;
                }

                //now replace with the new data

                var replacement = tplParam(html, obj, data);

                if (Main.util.isString(replacement)) {//html string
                    el.outerHTML = replacement;
                } else if ('outerHTML' in replacement) {//hmtl element
                    el.outerHTML = replacement.outerHTML;
                } else if ('length' in replacement) {//html collection
                    var outer_html = '';
                    for (var i = 0; i < replacement.length; i++) {
                        outer_html += replacement[i].outerHTML;
                    }
                    el.outerHTML = outer_html;
                }

                el[_game9ja_Dom_Hold_Data] = data;
                var cont = document.getElementById(container_id);
                var d_children = cont.children;
                cont.replaceChild(el, d_children[el_index]);

                return true;
            };

            this.setSelectionColor = function (b) {
                var clazz = 'game9ja-listview-item-selected';
                if (!lastSelectedListviewItem) {
                    return;
                }
                if (b) {
                    if (!$(lastSelectedListviewItem).hasClass(clazz)) {
                        $(lastSelectedListviewItem).addClass(clazz);
                    }
                } else {
                    $(lastSelectedListviewItem).removeClass(clazz);
                }

            };
        }

        function putItem(html, obj, data, actionFn) {
            var item = tplParam(html, obj, data);
            actionFn(obj, data, item);
        }

        function tplParam(html, obj, data) {

            var param_arr = regexMatchParams[obj.tplUrl];

            if (!param_arr) {
                var regex = /{[a-zA-Z_][a-zA-Z0-9._-]*}/g;
                param_arr = html.match(regex);
                for (var i = 0; i < param_arr.length; i++) {
                    //remove the opening and closing braces - { and }
                    param_arr[i] = param_arr[i].substring(1, param_arr[i].length - 1);
                }
                regexMatchParams[obj.tplUrl] = param_arr;
            }

            for (var i = 0; i < param_arr.length; i++) {
                var v;
                var param = param_arr[i];
                if (obj.onRender) {
                    try {
                        v = obj.onRender(param, data);
                    } catch (e) {
                        v = undefined;
                        console.log(e);
                    }

                }

                var obj_path = param.split('.');//assuming it is object parameter (e.g xxx.yyy.0.zzz) - if not this approach will also work anyway
                var top_lev_par = obj_path[0];//top level parameter
                if (typeof v === 'undefined' && typeof data[top_lev_par] !== 'undefined') {
                    var v = data[top_lev_par];
                    for (var k = 1; k < obj_path.length; k++) {
                        var par = obj_path[k];
                        if (typeof v[par] === 'undefined') {
                            break;
                        }
                        v = v[par];
                    }
                }


                html = html.replace('{' + param + '}', v);
            }


            var content = $('<div '
                    + (obj.itemClass
                            && Main.util.isString(obj.itemClass)
                            ? (' class="' + obj.itemClass + '" ') : '')
                    + '></div>').html(html);

            //remove title, script, link and meta tags if present
            $(content).find('title , script, link , meta').each(function (index) {
                this.remove();
            });

            content = content[0];

            if (obj.wrapItem === false) {
                return content.children;
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


            $(obj.container).html('');//clear previous content

            var lstThis = new listThis(html, obj);

            $(obj.container).off("click");
            $(obj.container).on("click", onSelectItem.bind({container: obj.container, onSelect: obj.onSelect, list: lstThis}));

            var cont_id = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;
            var parent = document.getElementById(cont_id);

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

            } else {

            }


            this.lastScrollTop = evt.target.scrollTop;
        }


        function onSelectItem(evt) {
            var children = $(this.container).children();
            if (!children.length) {
                return;
            }

            var parent = evt.target;

            while (parent && parent !== document.body) {
                var saved_data = parent[_game9ja_Dom_Hold_Data];
                if (_game9ja_Dom_Hold_Data in parent) {
                    lastSelectedListviewItem = parent;
                    if (Main.util.isFunc(this.onSelect)) {
                        //call the onSelect callback
                        try {
                            this.onSelect.bind(this.list)(evt, saved_data);
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
                console.warn('Missing list property - tplUrl');
                return;
            } else if (!Main.util.isString(obj.container)) {
                console.warn('Missing list property or not a string - container');
                return;
            } else if (!Main.util.isFunc(obj.onReady)) {
                console.warn('Missing list property or not a function - onReady');
                return;
            } else if (Main.util.isString(obj.container) && obj.container.charAt(0) !== '#') {
                console.warn("Invalid id selector for container property - must have '#' prefix but found '" + obj.container + "'");
                return;
            } else if (Main.util.isString(obj.scrollContainer) && obj.scrollContainer.charAt(0) !== '#') {
                console.warn("Invalid id selector for scrollContainer property - must have '#' prefix but found '" + obj.scrollContainer + "'");
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
                var url = intentUrl(obj.tplUrl);
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
         *        background  : ....,//background 
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
            busyEl.style.zIndex = Main.const.Z_INDEX;
            busyEl.style.background = 'rgba(0,0,0,0.3)';
            busyEl.style.color = obj.color ? obj.color : '#000000';



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
            var me = this;
            if ((obj.el && obj.html) || (obj.el && obj.url) || (obj.url && obj.html)) {
                throw new Error('Ambigious properties : must be only one of url , el , hmtl');
                //return;
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
                var url = intentUrl(obj.url);
                Main.ajax.get(url,
                        function (res) {
                            $(content).append(res);
                            addClose(content, obj.closeButton);
                            finishShow.call(me);
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
                finishShow.call(me);
            } else if (obj.html) {
                $(content).append(obj.html);
                addClose(content, obj.closeButton);
                finishShow.call(me);
            }

            function finishShow() {
                showFs = obj.onShow;
                hideFs = obj.onHide;

                //now fade in or slide. depending on the transition
                effectFs = obj.effect;
                if (!effectFs) {
                    effectFs = "fadein";//default effect
                }
                var callShow = function () {
                    showFs.call(this, fullScreenElement);
                };
                var fThis = {
                    hide: this.hide
                };
                Main.anim.to(fullScreenElement, duration, effectProp(effectFs), Main.util.isFunc(showFs) ? callShow.bind(fThis) : null);

                Main.device.addBackAction(this.hide);
            }
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
            Main.device.removeBackAction(this.hide);
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
        var CARD_ME_ONLY = 'CARD_ME_ONLY_' + new Date().getTime();

        deviceBackMeOnly[CARD_ME_ONLY] = CARD_ME_ONLY;

        function load(container_id, file, fn) {
            if (!viewHtmls[container_id]) {
                viewHtmls[container_id] = {};
            }

            var url = intentUrl(file);

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

        to0 = function (obj, finishCallback) {
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

            //check if the card is nested. back button event will not respond to nested 
            //card because of certain complications
            var parent = cont.parentNode;
            var isNestedCard = false;
            while (parent && parent !== document.body) {
                var parent_id = parent.id;
                if (cards[parent_id]) {
                    isNestedCard = true;
                    break;
                }

                parent = parent.parentNode;
            }

            //Also check if the card has embeded cards. back button event will not respond to nested 
            //card because of certain complications            
            for (var eid in cards) {
                if (eid === cont.id) {
                    continue;
                }
                var ebc = cont.querySelector("#" + eid);
                if (ebc) {
                    var crds = cards[eid];
                    for (var n in crds) {
                        //remove the embeded card device back action
                        Main.device.removeBackAction(crds[n].deviceCardBackFn, CARD_ME_ONLY);
                        crds[n].isNestedCard = true;//mark as nested
                        crds[n].deviceCardBackFn = null;//nullify the device back action
                    }
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
                var cardObj = {obj: obj, url: obj.url, fade: obj.fade || obj.fadein || obj.fadeIn, content: cont.children};
                cds.push(cardObj);//now make it last as promised

                cardObj.isNestedCard = isNestedCard;

                //set the last argu of this card container.
                var last_argu = last_crd.obj ? last_crd.obj : {container: obj.container, fade: cardObj.fade};

                if (obj.fade || obj.fadein || obj.fadeIn) {
                    Main.anim.to(cont, 500, {opacity: 1}, function () {
                        if (Main.util.isFunc(obj.onShow)) {
                            obj.onShow(obj.data);
                        }
                        createCardBackAction();
                    });
                } else {
                    cont.style.opacity = '1';
                    if (Main.util.isFunc(obj.onShow)) {
                        obj.onShow(obj.data);
                    }
                    createCardBackAction();
                }
                if (finishCallback) {
                    finishCallback();
                }
                function createCardBackAction() {
                    if (!isNestedCard) {
                        //we will not create back action for nested cards because of
                        //some complications that could arise.
                        cardObj.deviceCardBackFn = deviceCardBack.bind(last_argu);
                        Main.device.addBackAction(cardObj.deviceCardBackFn);
                    }
                }
                function deviceCardBack() {
                    Main.card.back(this);
                }

            });

        };

        this.to = function (obj) {
            to0(obj);
        };

        this.back = function (arg0, arg1) {

            var container, data, onShow;

            if (!Main.util.isString(arg0)
                    && arguments.length === 1) {//detecting that an object is passed
                container = arg0.container;
                data = arg0.data;
                onShow = arg0.onShow;

            } else if (Main.util.isString(arg0)
                    && arguments.length === 1) {//detecting that only the cotainer id is passed
                container = arg0;
            } else if (Main.util.isString(arg0) && Main.util.isFunc(arg1)) {
                container = arg0;
                onShow = arg1;
            } else {
                console.warn('invalid method arguments - must be  either a one argument object or  one argument container id (string) or two argument with the first string type and the second function type. ');
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

            if (!Main.util.isArray(cds)
                    || !cds.length //important - must check if it is array 
                    || cds.length < 2) {
                return; // already at the begining
            }

            var last_index = cds.length - 1;
            var out_card = cds[last_index];
            cds.splice(last_index, 1);

            if (!out_card.isNestedCard) {
                //only top level cards can have device back action and hence can be removed
                Main.device.removeBackAction(out_card.deviceCardBackFn, CARD_ME_ONLY);
            }

            cont.innerHTML = ''; //clear
            cont.style.opacity = '0';
            var prev = cds[cds.length - 1];
            var last_content = prev.content.children;
            var len = last_content.length;
            var rem_chidren = [];
            for (var i = 0; i < len; i++) {
                var rem_child = prev.content.removeChild(last_content[0]);//removing the first as the number of children reduces to zero

                if (!rem_child.style.visibility) {//only consider elements with no visibility property set.
                    //Brilliant technique by hidding the element to prevent the child 
                    //from recieving event of the outgoing card element 
                    //on same position - was a difficult buggy to solve
                    rem_child.style.visibility = 'hidden';
                    rem_chidren.push(rem_child);
                }

                cont.appendChild(rem_child); //adding the removed child
            }

            //Brilliant technique by asynchronously reshowing to prevent the child 
            //from recieving event of the outgoing card element 
            //on same position - was a difficult buggy to solve
            window.setTimeout(function () {
                for (var i = 0; i < rem_chidren.length; i++) {
                    rem_chidren[i].style.visibility = '';//set to empty - the original value
                }
            }, 10);

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

            if (Main.util.isFunc(out_card.obj.onHide)) {
                out_card.obj.onHide(out_card.obj.data);
            }

        };

        this.removeTo = function (obj) {
            var container = obj.container;
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

            to0(obj, afterCardShow);

            function afterCardShow() {
                var cds = cards[cid];

                if (!Main.util.isArray(cds)
                        || !cds.length //important - must check if it is array 
                        || cds.length < 2) {
                    return; // already at the begining
                }

                //At this point there is aleast two cards on the container.

                //remove the 2nd to the last card from the card object collection
                var prev_index = cds.length - 2; //we need the 2nd to the last index
                cds.splice(prev_index, 1);

            }

        };
    }


    Main.event = new Event();
    Main.eventio = new EventIO();
    Main.rcall = new RCall();
    Main.iframeAjax = new IframeAjax();
    Main.page = new Page();
    Main.listview = new Listview();
    Main.anim = new Animate();
    Main.fullscreen = new Fullscreen();
    Main.busy = new Busy();
    Main.dom = new Dom();
    Main.menu = new Menu();
    Main.dialog = new Dialog();
    Main.toast = new Toast();
    Main.card = new Card();
    Main.tpl = new Tpl();
    Main.task = new Task();
    Main.countdown = new Countdown();
    Main.uiupdater = new UIUpdater();
    Main.clipboard = new Clipboard();


    Main.intentUrl = function (url) {
        return intentUrl(url);
    };

    function Clipboard() {

        this.copy = function (text, is_show_toast) {

            if (text === '' || text === null || typeof text === 'undefined') {
                if (is_show_toast) {
                    Main.toast.show('Nothing to copy');
                }
                return false;
            }

            var txa = document.createElement('textarea');
            txa.value = text;

            txa.style.posiion = 'fixed';
            txa.style.top = '0';
            txa.style.left = '0';
            txa.style.width = '2em';
            txa.style.height = '2em';

            document.body.appendChild(txa);

            txa.focus();
            txa.select();
            var result;
            try {
                result = document.execCommand('copy');
            } catch (e) {
                console.log(e);
            }

            if (is_show_toast === true) {
                if (result) {
                    Main.toast.show('Selected text copied');
                } else {
                    Main.toast.show('Could not copy');
                }
            }

            document.body.removeChild(txa);//remove the textarea from the dom

            return result;
        };
    }

    function UIUpdater() {
        /**
         * Usage
         * <br>
         * <br>
         * obj = { <br>
         *    container: ...., //container of the uiupdater<br>
         *    update  : ..... //final function to call after the delay is elapsed<br>
         *    delay [opt] : ....,//number of second to wait for the update function to be called<br>
         *    countdown [opt] : ....., //the function to call after each second until the delay period is elapse and the update function called<br>
         *    data [opt] : .....// the data to pass to the update function <br>
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
            var DEFAULT_DELAY = 3;
            var delay = obj.delay > -1 ? obj.delay : DEFAULT_DELAY;

            var cid;
            var container = obj.container;
            if (Main.util.isString(container)) {
                cid = container.charAt(0) === '#' ? container.substring(1) : container;
            } else {
                cid = $(container).id();
            }

            container = document.getElementById(cid);
            if (!container) {
                console.warn('unknown  container id - ', cid);
                return;
            }

            var el = document.createElement('div');
            el.style.zIndex = Main.const.Z_INDEX;
            el.className = 'game9ja-uiupdater-toast';
            el.style.top = '-30px';

            container.appendChild(el);
            animDiplay(container, el, true);

            Main.countdown.start(function (value, finish) {
                if (Main.util.isFunc(obj.countdown)) {
                    obj.countdown(el, value, finish);
                } else {
                    el.innerHTML = finish ? "Updating..." : "Updating in " + value + " sec...";
                }

                if (finish) {
                    if (Main.util.isFunc(obj.update)) {

                        //animate hide the display
                        animDiplay(container, el, false);

                        obj.update(obj.data);
                    }
                }
            }, delay);


        };

        function animDiplay(container, el, show) {
            var duration = 500;
            var prop = {};
            if (show) {

                prop.top = '0';
                Main.anim.to(el, duration, prop);

            } else {//hide

                prop.top = '-30px';
                Main.anim.to(el, duration, prop, function () {
                    container.removeChild(el);
                });
            }
        }

    }

    function Countdown() {
        var fn_list = [];
        var interval_list = [];
        this.stop = function (fn) {
            if (!fn) {
                return;
            }
            for (var i = 0; i < fn_list.length; i++) {
                if (fn_list[i] === fn) {
                    clearInterval(interval_list[i]);
                    fn_list.splice(i, 1);
                    interval_list.splice(i, 1);
                    i--;
                    continue;
                }
            }

        };

        this.start = function (fn, initial_value, pattern) {

            if (!Main.util.isFunc(fn)) {
                console.warn('first parameter must be a function');
                return;
            }

            initial_value = initial_value - 0;
            if (isNaN(initial_value)) {
                console.warn('initial value (second parameter) not a number');
                return;
            }

            if (pattern && pattern !== 'mm:ss' && pattern !== 'hh:mm:ss') {
                console.warn('invalid pattern (third parameter) must be "mm:ss" or "hh:mm:ss" if provided');
                return;
            }
            var interval_id;
            var runFn = function () {
                if (pattern === 'hh:mm:ss') {
                    var hr = Math.floor(initial_value / 3600);
                    var m = initial_value - hr * 3600;
                    var min = Math.floor(m / 60);
                    var sec = m - min * 60;
                    if (hr < 10) {
                        hr = '0' + hr;
                    }
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (sec < 10) {
                        sec = '0' + sec;
                    }
                    var formatted_value = hr + ":" + min + ":" + sec;

                } else if (pattern === 'mm:ss') {

                    var min = Math.floor(initial_value / 60);
                    var sec = initial_value - min * 60;
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (sec < 10) {
                        sec = '0' + sec;
                    }
                    var formatted_value = min + ":" + sec;
                } else {
                    formatted_value = initial_value;
                }


                try {
                    var is_finish = initial_value === 0;
                    fn(formatted_value, is_finish);
                } catch (e) {
                    console.log(e);
                }

                --initial_value;
                if (initial_value < 0) {
                    clearInterval(interval_id);
                }
            };

            runFn();//initial run is immediate

            interval_id = setInterval(runFn, 1000);

            fn_list.push(fn);
            interval_list.push(interval_id);

        };

    }

    function Task() {
        var taskList = [];
        var interval_id = null;
        this.remove = function (fn) {
            for (var i = 0; i < taskList.length; i++) {
                if (taskList[i].fn === fn) {
                    taskList.splice(i, 1);
                    i--;
                    continue;
                }
            }
        };

        this.repeat = function (param1, param2, param3) {
            var fn, interval, times, argu = [];

            if (arguments.length === 1) {//where the only argument is an object
                fn = param1.fn;
                interval = param1.interval;
                times = param1.times;
                argu = param1.argu;
            } else {
                fn = param1;
                interval = param2;
                times = param3;

                if (arguments.length > 3) {
                    for (var i = 3; i < arguments.length; i++) {

                        argu.push(arguments[i]);
                    }
                }
            }

            var interval_count = Math.floor(interval / 1000);
            var mill_sec = (interval / 1000 - interval_count) * 1000; // extra milli second

            var nw_task = {
                fn: fn,
                interval_count: interval_count,
                interval_run_count: 0,
                mill_sec: mill_sec,
                times: times ? times : -1, //optional
                times_run: 0,
                argu: argu
            };

            taskList.push(nw_task);

            if (!interval_id) {
                interval_id = setInterval(doTask, 1000);
            }
        };
        var doRun = function (taskObj) {
            try {
                taskObj.fn.apply(null, taskObj.argu);
            } catch (e) {
                console.log(e);
            }

        };
        var doTask = function () {

            for (var i = 0; i < taskList.length; i++) {
                var taskObj = taskList[i];
                taskObj.interval_run_count++;

                if (taskObj.interval_count === taskObj.interval_run_count) {
                    taskObj.interval_run_count = 0;
                    taskObj.times_run++;

                    if (taskObj.mill_sec) {
                        setTimeout(doRun, taskObj.mill_sec, taskObj);
                    } else {
                        doRun(taskObj);
                    }
                }

                if (taskObj.times_run === taskObj.times) {
                    taskList.splice(i, 1);
                    i--;
                    continue;
                }
            }

            if (taskList.length === 0) {
                clearInterval(interval_id);
                interval_id = null;
            }
        };
    }


    function Dom() {

        var fns = [];
        var bind_fns = [];

        this.addListener = function (e, type, a2, a3, a4) {

            var param = _analyzeEvtParam(a2, a3, a4);

            var data = param.data;
            var callback = param.callback;
            var capture = param.capture;


            var el = e;
            if (Main.util.isString(e)) {
                e = e.charAt(0) === '#' ? e.substring(1) : e;
                el = document.getElementById(e);
                if (!el) {
                    throw new Error('unknown element id - ' + e);
                }
            }



            Main.dom.removeListener(e, type, callback, capture);//first remove event of same type on same element with same listener

            var callbackWrapFn;
            if (Main.util.isFunc(callback)) {
                callbackWrapFn = function (evt) {
                    return callback(evt, data);
                };
                fns.push(callback);
                bind_fns.push(callbackWrapFn);
            }

            if (!el) {
                return;
            }

            if (el.addEventListener) {
                //el.removeEventListener(type, callbackFn, capture);//@deprecated - replaced with Main.dom.removeListener above
                el.addEventListener(type, callbackWrapFn, capture);
            } else if (el.attachEvent) {//IE
                //el.detachEvent('on' + type, callbackFn, capture);//@deprecated - replaced with Main.dom.removeListener above
                el.attachEvent('on' + type, callbackWrapFn, capture);
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
            var callbackWrapFn;
            for (var i = 0; i < fns.length; i++) {
                if (fns[i] === callback) {
                    callbackWrapFn = bind_fns[i];
                    fns.splice(i, 1);
                    bind_fns.splice(i, 1);
                    break;
                }
            }

            if (!el) {
                return;
            }

            if (el.removeEventListener) {
                el.removeEventListener(type, callbackWrapFn, capture);
            } else if (el.detachEvent) {//IE
                el.detachEvent('on' + type, callbackWrapFn, capture);
            }
        };
    }

    /**
     * This is used to detect the expected url based on the
     * suffix of the file name. expected suffixes are:<br>
     * -sd => means it is file from small device 'view' folder<br>
     * -md => means it is file from medium device 'view' folder<br>
     * -ld => means it is file from large device 'view' folder<br>
     * -tpl-sd => means it is file from small device 'view/tpl' folder<br>
     * -tpl-md => means it is file from medium device 'view/tpl' folder<br>
     * -tpl-ld => means it is file from large device 'view/tpl' folder<br>
     * -tpl => means it is file from  'app/view/tpl' folder<br>
     * 
     * otherwise it is file from 'app/view' folder
     * 
     * @param {type} url
     * @returns {undefined}
     */
    function intentUrl(url) {
        var to = url.indexOf('.');//the '.html' part
        var suffix1 = url.substring(to - 3, to);//ie -sd, -md, -ld
        var suffix2 = url.substring(to - 4, to);//ie -tpl
        var suffix3 = url.substring(to - 6, to);//ie -tpl-sd, -tpl-md, -tpl-ld 
        var path;

        if (suffix3 === '-tpl-sd' || suffix3 === '-tpl-md' || suffix3 === '-tpl-ld') {
            path = devicePageTplRouteUrl + url;
        } else if (suffix2 === '-tpl') {
            path = appTplRouteUrl + url;
        } else if (suffix1 === '-sd' || suffix1 === '-md' || suffix1 === '-ld') {
            path = devicePageRouteUrl + url;
        } else {
            path = appPageRouteUrl + url;
        }

        return path;
    }

    /**
     * This is used to get the expected class name of javascript file.<br>
     * -sd => means it is file from small device 'js' folder<br>
     * -md => means it is file from medium device 'js' folder<br>
     * -ld => means it is file from large device 'js' folder<br>
     * 
     * otherwise it is file from 'app/js' folder
     * 
     * @param {type} js_file_name
     * @returns {undefined}
     */
    function jsClassName(js_file_name) {

        //var device_size_cat = deviceSizeCategory();
        var deviceJs = deviceUrl + device_category + '/js/';
        var appJs = appUrl + 'js/';
        if (js_file_name.startsWith(deviceJs)) {
            if (js_file_name.endsWith('-sd.js')
                    || js_file_name.endsWith('-md.js')
                    || js_file_name.endsWith('-ld.js')) {
                js_file_name = js_file_name.substring(deviceJs.length);
                js_file_name = js_file_name.substring(0, js_file_name.length - 6);
            } else {
                throw Error('invalid javascript file name in ' + deviceJs + ' folder - ' + js_file_name);
            }
        } else if (js_file_name.startsWith(appJs)) {
            if (js_file_name.endsWith('.js')) {
                js_file_name = js_file_name.substring(appJs.length);
                js_file_name = js_file_name.substring(0, js_file_name.length - 3);
            } else {
                throw Error('invalid javascript file name in ' + appJs + ' folder - ' + js_file_name);
            }
        }

        var regex = /\//g; //regex to match all back slash
        var cls_name = appNamespace + '.' + js_file_name.replace(regex, '.');

        return cls_name;
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
     *  contains the text of the button clicked
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


        Main.dialog.show({
            content: msg,
            iconCls: msg_icon_cls,
            title: title,
            buttons: btns,
            fade: fade !== false, // default is fade
            closeButton: !Main.device.isMobileDeviceReady, //do not show the close button in mobile device
            touchOutClose: true, //close the dialog if the user touch outside it
            action: function (el, value) {//not close button   
                this.hide();
                if (Main.util.isFunc(callback)) {
                    callback(value);
                }

            },
            onHide: function () {
                //do nothing
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
            touchOutClose: true, //close the dialog if the user touch outside it   
            action: function (el, value) {
                this.hide();
            }
        });
    };

    function Toast() {
        var wait;
        var txts = [];
        this.show = function (text) {

            var me = this;
            if (arguments.length > 0) {
                txts.push(text);
            }

            if (wait) {
                return;
            }

            wait = true;

            var toast_el = document.createElement('div');
            toast_el.style.zIndex = Main.const.Z_INDEX;
            toast_el.className = 'game9ja-toast';
            toast_el.innerHTML = txts[0];
            toast_el.style.display = 'none';
            document.body.appendChild(toast_el);

            $(toast_el).stop()
                    .fadeIn(400)
                    .delay(3000)
                    .fadeOut(400, function () {
                        document.body.removeChild(toast_el);
                        txts.splice(0, 1);
                        wait = false;
                        if (txts.length > 0) {
                            me.show.call(me);
                        }
                    });

        };
    }

    function Dialog() {

        function DlgThis(param) {

            var obj, dlg_cmp, setHeaderTitle, setBodyContent, getDialogContentEl, getDialogBodyEl,
                    getDialogFooterEL, dialogButtonsCreate, resizeListenDlgBind,
                    setVisible, touchCloseFn, deviceBackHideFunc, btns;
            this.init = function () {
                obj = param.obj;
                dlg_cmp = param.dlg_cmp;
                setHeaderTitle = param.setHeaderTitle;
                setBodyContent = param.setBodyContent;
                getDialogContentEl = param.getDialogContentEl;
                getDialogBodyEl = param.getDialogBodyEl;
                getDialogFooterEL = param.getDialogFooterEL;
                dialogButtonsCreate = param.dialogButtonsCreate;
                resizeListenDlgBind = param.resizeListenDlgBind;
                setVisible = param.setVisible;
                touchCloseFn = param.touchCloseFn;
                deviceBackHideFunc = param.deviceBackHideFunc;
                btns = param.btns;
            };
            this.setButtonText = function (index, text) {
                if (btns[index]) {
                    btns[index].value = text;
                }
            };

            /**
             * create new sets of buttons. 
             * 
             * passing the buttons texts as parameters
             * 
             * @param {type} param
             * @returns {undefined}
             */
            this.createButtons = function (param) {
                var p = arguments;
                if (arguments.length === 1 && Main.util.isArray(param) && param.length > 0) {
                    p = param;
                }
                dialogButtonsCreate(p);

            };

            /**
             * Disable buttons. 
             * 
             * passing the buttons index as parameters.
             * If no parameter is passed then all buttons are diabled
             * 
             * @param {type} param
             * @returns {undefined}
             */
            this.disableButtons = function (param) {
                var p = arguments;
                if (arguments.length === 1 && Main.util.isArray(param) && param.length > 0) {
                    p = param;
                }
                enableBtns(p, false);
            };

            /**
             * Enable buttons. 
             * 
             * passing the buttons index as parameters.
             * If no parameter is passed then all buttons are enabled
             * 
             * @param {type} param
             * @returns {undefined}
             */
            this.enableButtons = function (param) {
                var p = arguments;
                if (arguments.length === 1 && Main.util.isArray(param) && param.length > 0) {
                    p = param;
                }
                enableBtns(p, true);
            };

            function enableBtns(param, enable) {

                var footer = getDialogFooterEL();
                var btns = [];
                for (var i = 0; i < footer.children.length; i++) {
                    if (footer.children[i].type === 'button') {
                        btns.push(footer.children[i]);
                    }
                }
                var p_btns = [];
                if (param.length > 0) {
                    for (var i = 0; i < param.length; i++) {
                        if (typeof param[i] === 'number' && param[i] > -1 && param[i] < btns.length) {
                            p_btns.push(btns[param[i]]);
                        }
                    }
                } else {
                    p_btns = btns;
                }

                for (var i = 0; i < p_btns.length; i++) {
                    if (enable) {
                        p_btns[i].removeAttribute('disabled');
                    } else {
                        p_btns[i].disabled = true;
                    }

                }

            }

            this.setTitle = function (title) {
                obj.tile = title;
                setHeaderTitle(title);
            };

            this.getTitle = function () {
                return obj.title;
            };

            this.setContent = function (content) {
                obj.content = content;
                setBodyContent(content);

            };

            this.layout = function () {
                resizeListenDlgBind.call(obj, dlg_cmp);
            };

            this.getContentElement = function () {
                return getDialogContentEl();
            };

            this.getBody = function () {
                return getDialogBodyEl();
            };

            this.setVisible = function (param) {
                var value, duration;
                if (arguments.length === 1 && typeof arguments[0] === 'object') {
                    value = param.value;
                    duration = param.duration;
                } else if (arguments.length > 1) {
                    value = arguments[0].value;
                    duration = arguments[1].duration;
                } else {
                    return;
                }
                setVisible(value, duration);
            };

            this.close = function () {//similar to hide - since by our design, calling hide destroys the dialog.
                this.hide();
            };
            this.hide = function (o) {
                if (typeof o === 'object' && o.destroyOnResize === true) {
                    destroy();
                    return;
                }

                if (obj.fade || obj.fadeIn || obj.fadeIn) {
                    Main.anim.to(dlg_cmp, 300, {opacity: 0}, destroy);
                } else {
                    destroy();
                }
                if (Main.util.isFunc(obj.onHide)) {
                    obj.onHide.call(this);
                }

            };

            function destroy() {
                if (dlg_cmp) {
                    dlg_cmp.parentNode.removeChild(dlg_cmp);
                    Main.dom.removeListener(window, 'resize', resizeListenDlgBind, false);
                    Main.dom.removeListener(document.body, 'touchstart', touchCloseFn, false);
                    dlg_cmp = null;
                }

                Main.device.removeBackAction(deviceBackHideFunc);

                //TODO: Unlock the orientation here
            }

        }

        function resizeListenDlg(dlgBase, header, body, footer) {

            if (dlgBase) {
                dlgBase.style = 'opacity: 0';
            }
            if (header) {
                header.style = '';
            }
            if (body) {
                body.style = '';
            }
            if (footer) {
                footer.style = '';
            }

            dlgStyle.call(this, dlgBase, header, body, footer);

            dlgBase.style.opacity = 1;
        }

        function dlgStyle(base, header_el, body_el, footer_el) {

            var obj = this;

            var max_width = window.innerWidth * 0.8;
            var max_height = window.innerHeight * 0.8;

            if (obj.width) {
                var width = new String(obj.width).replace('px', '') - 0;//implicitly convert to numeric
                if (!isNaN(width)) {
                    base.style.width = width + 'px';//width of the dialog
                } else {
                    console.warn('dialog width invalid - ', obj.width);
                }
            }

            if (obj.widthScreenRatio) {
                var w_r = obj.widthScreenRatio;
                ;
                if (w_r > 1) {
                    w_r = 1;
                }
                var width = window.innerWidth * w_r;
                if (!isNaN(width)) {
                    base.style.width = width + 'px';//width of the dialog
                } else {
                    console.warn('dialog width invalid - ', obj.widthScreenRatio);
                }
            }

            var base_width;
            var base_bound = base.getBoundingClientRect();
            if (base_bound) {
                base_width = base_bound.width > max_width ? max_width : base_bound.width;
            }

            if (obj.height) {
                var height = new String(obj.height).replace('px', '') - 0; //implicitly convert to numeric
                if (!isNaN(height)) {
                    body_el.style.height = height + 'px';//the height of the body - not the dialog in this case
                } else {
                    console.warn('dialog height invalid - ', obj.height);
                }
            }

            if (obj.heightScreenRatio) {
                var h_r = obj.heightScreenRatio;
                ;
                if (h_r > 1) {
                    h_r = 1;
                }
                var height = window.innerHeight * h_r;
                if (!isNaN(height)) {
                    body_el.style.height = height + 'px';//the height of the body - not the dialog in this case
                } else {
                    console.warn('dialog height screen ration invalid - ', obj.heightScreenRatio);
                }
            }

            if (obj.maxWidth) {//new
                var max_w = new String(obj.maxWidth).replace('px', '') - 0;//implicitly convert to numeric
                if (!isNaN(max_w)) {
                    max_w = max_w > max_width ? max_width : max_w;
                    base.style.maxWidth = max_w + 'px';//max width of the dialog
                } else {
                    console.warn('dialog maxWidth invalid - ', obj.maxWidth);
                }
            }

            if (obj.maxHeight) {//new
                var max_h = new String(obj.maxHeight).replace('px', '') - 0; //implicitly convert to numeric
                if (!isNaN(max_h)) {
                    max_h = max_h > max_height ? max_height : max_h;
                    body_el.style.maxHeight = max_h + 'px';//the max height of the body - not the dialog in this case
                } else {
                    console.warn('dialog maxHeight invalid - ', obj.maxHeight);
                }
            }
            var b_bound = body_el.getBoundingClientRect();//recall to get the latest information 
            var b_h = 0;
            if (b_bound) {
                b_h = b_bound.height;
            }

            base.style.width = base_width + 'px';

            base_bound = base.getBoundingClientRect();//get the new base bound since we just modified the width and the overall dimension might have change - e.g the height may certainly change

            var base_height = base_bound.height;
            base_width = base_bound.width;

            for (var i = 0; i < 3; i++) {//run 3 times so that be can get base_h <= max_height
                if (base_height > max_height) {
                    var diff = base_height - max_height;
                    b_h -= diff;
                    body_el.style.maxHeight = b_h + 'px';
                    base_height -= diff;//same should happen to the base height
                    base_bound = base.getBoundingClientRect();
                    base_height = base_bound.height;
                    base_width = base_bound.width;
                    if (base_height <= max_height) {
                        break;
                    }
                }
            }

            var x = Math.floor((window.innerWidth - base_width) / 2);
            var y = Math.floor((window.innerHeight - base_height) / 2);

            base.style.position = 'absolute';
            base.style.top = y + 'px';
            base.style.left = x + 'px';

        }

        function show0() {
            var obj = this;
            if (obj.buttons && !Main.util.isArray(obj.buttons)) {//yes because button can be absence. so check if present and it is also an array
                console.warn('Dialog buttons must be array of button texts if provided!');
                return;
            }

            var base = document.createElement('div');
            var initialOpacity = 1;
            if (obj.visible === false) {
                base.style.opacity = 0;
                initialOpacity = 0;
            }

            base.className = 'game9ja-dialog';
            var body_el, header_el, footer_el;

            if (obj.headless !== true && obj.hasHeader !== false) {
                header_el = document.createElement('div');
                header_el.className = 'game9ja-dialog-header';
                addHeader();
            }

            body_el = document.createElement('div');
            body_el.className = 'game9ja-dialog-body';

            var content_el = document.createElement('div');

            addBody();

            base.appendChild(header_el);
            base.appendChild(body_el);

            var dlg_cmp;
            var outsideDialog;

            if (obj.modal !== false) {
                var outer = document.createElement('div');
                outer.style.position = 'absolute';
                outer.style.top = '0';
                outer.style.left = '0';
                outer.style.zIndex = Main.const.Z_INDEX;
                outer.style.overflow = 'hidden';
                outer.style.top = '0px';
                outer.style.left = '0px';
                outer.style.width = '100%';
                outer.style.height = '100%';
                outer.style.background = 'rgba(0,0,0,0.3)';

                outer.appendChild(base);
                document.body.appendChild(outer);
                dlg_cmp = outer;
                outsideDialog = outer;
            } else {
                document.body.appendChild(base);
                dlg_cmp = base;
                outsideDialog = document.body;
            }

            base.style.opacity = 0;

            var obj_param = {
                obj: obj,
                dlg_cmp: dlg_cmp,
                setHeaderTitle: setHeaderTitle,
                getDialogContentEl: getDialogContentEl,
                setBodyContent: setBodyContent,
                getDialogBodyEl: getDialogBodyEl,
                getDialogFooterEL: getDialogFooterEL,
                dialogButtonsCreate: dialogButtonsCreate,
                setVisible: setVisible,
                touchCloseFunc: touchCloseFunc,
                deviceBackHideFunc: deviceBackHideFunc,
                btns: []
            };

            var dlgThis = new DlgThis(obj_param);

            var resizeListenDlgBind = resizeListenDlg.bind(obj, base, header_el, body_el, footer_el);

            obj_param.resizeListenDlgBind = resizeListenDlgBind;

            dlgThis.init();

            addCloseButton();

            if (Main.util.isArray(obj.buttons) && obj.buttons.length > 0) {

                footer_el = document.createElement('div');
                footer_el.className = 'game9ja-dialog-footer';

                addFooter(obj.buttons);

            }

            dlgStyle.call(obj, base, header_el, body_el, footer_el);

            Main.dom.addListener(window, 'resize', resizeListenDlgBind, false);


            if (obj.fade || obj.fadeIn || obj.fadeIn) {
                Main.anim.to(base, 300, {opacity: initialOpacity}, function () {
                    if (Main.util.isFunc(obj.onShow)) {
                        try {
                            obj.onShow.call(dlgThis);
                        } catch (e) {
                            console.warn(e);
                        }
                    }
                    addTouchCloseListener();
                    Main.device.addBackAction(deviceBackHideFunc);
                });
            } else {
                base.style.opacity = initialOpacity;
                if (Main.util.isFunc(obj.onShow)) {
                    try {
                        obj.onShow.call(dlgThis);
                    } catch (e) {
                        console.warn(e);
                    }

                }
                addTouchCloseListener();
                Main.device.addBackAction(deviceBackHideFunc);
            }


            function addHeader() {
                setHeaderTitle(obj.title);//new
            }

            function addBody() {
                if (obj.iconCls) {
                    var icon_el = document.createElement('span');
                    icon_el.className = obj.iconCls;
                    body_el.appendChild(icon_el);
                }
                setBodyContent(obj.content);//new - aviod show undefined or null
                content_el.style.width = '100%';
                body_el.appendChild(content_el);
            }

            function addFooter(buttons) {
                if (!buttons) {//if present 
                    return;
                }

                footerAdder(function () {
                    for (var i = buttons.length - 1; i > -1; i--) {
                        var btn = document.createElement('input');
                        btn.type = 'button';
                        btn.value = buttons[i];
                        footer_el.appendChild(btn);
                        obj_param.btns.push(btn);
                    }
                });

            }

            function footerAdder(forloop) {
                obj_param.btns.splice(0, obj_param.btns.length);//clear - new
                footer_el.innerHTML = ''; //new
                forloop();
                base.appendChild(footer_el);
                Main.dom.removeListener(footer_el, 'click', btnListenerFn, false);
                Main.dom.addListener(footer_el, 'click', btnListenerFn, false);
            }

            function dialogButtonsCreate(buttons) {
                addFooter(buttons);
            }

            function setBodyContent(content) {//new
                content = content ? content : '';
                if (Main.util.isString(content)) {
                    content_el.innerHTML = content;
                } else {
                    content_el.appendChild(content);
                }
            }

            function titleHtml(title) {//new
                title = title ? title : '';
                return '<div style= "width: 80%; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">' + title + '</div>';
            }

            function setHeaderTitle(title) {//new 
                header_el.innerHTML = titleHtml(title);
            }

            function addCloseButton() {
                if (obj.closeButton !== false) {
                    var close_el = document.createElement('span');
                    close_el.className = 'fa fa-close';
                    close_el.style.position = 'absolute';
                    close_el.style.right = '2px';
                    close_el.style.top = '2px';
                    close_el.style.width = '20px';
                    close_el.style.height = '20px';
                    base.appendChild(close_el);
                    Main.dom.addListener(close_el, 'click', dlgThis.hide, false);
                }
            }

            function getDialogContentEl() {
                return content_el;
            }

            function getDialogBodyEl() {
                return body_el;
            }

            function getDialogFooterEL() {
                return footer_el;
            }

            function setVisible(b, trans_duration) {//new
                if (b === true) {
                    if (trans_duration > 0) {
                        Main.anim.to(base, trans_duration, {opacity: 1});
                    } else {
                        base.style.opacity = 1;
                    }
                } else if (b === false) {
                    if (trans_duration > 0) {
                        Main.anim.to(base, trans_duration, {opacity: 0});
                    } else {
                        base.style.opacity = 0;
                    }
                }
            }
            ;

            function btnListenerFn(evt) {
                if (evt.target.type === 'button') {
                    if (Main.util.isFunc(obj.action)) {
                        obj.action.call(dlgThis, evt.target, evt.target.value);
                    }
                }
            }

            function addTouchCloseListener() {
                if (obj.touchOutClose === true) {
                    Main.dom.addListener(outsideDialog, 'click', touchCloseFunc, false);//we now use 'click' instead of 'touchstart' event because the touchstart event cause undesirable event propagation.
                }
            }

            function deviceBackHideFunc() {
                return dlgThis.hide();
            }

            function touchCloseFunc(evt) {
                var parent = evt.target;
                var touch_outside = true;
                while (parent && parent !== document.body) {
                    if (parent === base) {
                        touch_outside = false;
                        break;
                    }
                    if (parent === outsideDialog) {
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (touch_outside) {
                    dlgThis.hide();
                }
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
         *       maxWidth [opt] : ...., //max. width of the dialog in pixel - px <br>
         *       height [opt] : ...., //height of the dialog body (not the dialog in this case) in pixel - px <br>
         *       maxHeight [opt] : ...., //max height of the dialog body (not the dialog in this case) in pixel - px <br>
         *       title [opt] : .....,//title of the dialog<br>
         *       buttons [opt] : .....,//array of button text to show in the dialog footer<br>
         *       modal [opt] : .....,//whether to make the dialog modal - defaults to true<br>
         *       action [opt] : .....,//called when any buttons created in the footer is clicked<br>
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
            show0.call(obj);
        };

    }

    function Menu() {
        var defaultWidth = 150;
        var menuHeaderHeight = 30; //must not change -  used in css
        var menuCmp;
        var menuOuter;
        var menuBtn;
        var resizeListenMnuBind;
        var deviceBackHideFns = []; //store hides function to be removed by back actions when menu is destroyed 

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
                if (parent === menuOuter) {
                    break;
                }
                parent = parent.parentNode;
            }

            if (click_outside) {
                destroy();
            }
        }

        function resizeListenMnu(menuCmp, mnuBody) {

            menuCmp[0].style = 'opacity: 0';
            mnuBody[0].style = '';

            mnuStyle.call(this, menuCmp, mnuBody);
            menuCmp[0].style.opacity = 1;
        }

        function destroy() {

            if (menuOuter) {
                menuOuter.parentNode.removeChild(menuOuter);
                menuOuter = null;
                menuCmp = null;
                Main.dom.removeListener(document.body, 'click', onClickOutsideHide, false);
                Main.dom.removeListener(window, 'resize', resizeListenMnuBind, false);
            }

            for (var i in deviceBackHideFns) {
                Main.device.removeBackAction(deviceBackHideFns[i]);
            }
            deviceBackHideFns = [];//empty the hides functions

        }

        function menuThis(_this, menuCmp, mnuBody) {

            this.hide = function () {
                destroy.call(this);
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

            this.layout = function () {
                resizeListenMnuBind();
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

        function create0() {
            //first destroy previous menu shown - there cannot be more than
            //one menu at a time.
            destroy();

            //alert('styleObj.main_style ' + styleObj.main_style);
            //alert('styleObj.body_style ' + styleObj.body_style);

            menuCmp = $('<div class="game9ja-menu"></div>');

            var mnuBody;

            addHeader.call(this);
            mnuBody = addBody.call(this);
            addFooter.call(this);

            function addHeader() {
                if (this.header) {
                    menuCmp.append('<div class="game9ja-menu-header"></div>');
                    var mnuHeader = menuCmp.find('.game9ja-menu-header');
                    mnuHeader.append(this.header);
                }
            }

            function addBody() {
                menuCmp.append('<div class="game9ja-menu-body"></div>');//body
                var mnuBody = menuCmp.find('.game9ja-menu-body');
                var els = [];
                var mnu_items = this.items;
                if (Main.util.isFunc(mnu_items)) {
                    mnu_items = mnu_items();
                }

                if (!Main.util.isArray(mnu_items)) {//convert to array which is what is expected
                    mnu_items = [mnu_items];
                }

                for (var i = 0; i < mnu_items.length; i++) {
                    var t = mnu_items[i];
                    if (typeof t !== 'undefined' && t !== null) {
                        var e = createMenuItem(this, menuThis, menuCmp, mnuBody, t);
                        els.push(e);
                    }
                }

                var children = $(menuCmp).children();
                var last = children[children.length - 1];
                $(last).append(els);

                return mnuBody;
            }

            function addFooter() {
                if (this.footer) {
                    menuCmp.append('<div class="game9ja-menu-footer"></div>');
                    var mnuFooter = menuCmp.find('.game9ja-menu-footer');
                    mnuFooter.append(this.footer);
                }
            }

            menuOuter = document.createElement('div');
            menuOuter.style.position = 'absolute';
            menuOuter.style.top = '0';
            menuOuter.style.width = '100%';
            menuOuter.style.height = '100%';

            $(menuOuter).append(menuCmp);

            $('body').append(menuOuter);

            mnuStyle.call(this, menuCmp, mnuBody);

            Main.dom.addListener(document.body, 'click', onClickOutsideHide, false);

            resizeListenMnuBind = resizeListenMnu.bind(this, menuCmp, mnuBody);

            Main.dom.addListener(window, 'resize', resizeListenMnuBind, false);

            var mnuThis = menuThis(this, menuCmp, mnuBody);

            if (!deviceBackHideFns) {
                deviceBackHideFns = [];
            }

            deviceBackHideFns.push(mnuThis.hide);

            Main.device.addBackAction(mnuThis.hide);

            if (Main.util.isFunc(this.onShow)) {
                this.onShow.call(mnuThis);
            }

        }

        function mnuStyle(mnuCmp, mnuBody) {
            menuBtn = this.target;
            if (Main.util.isString(this.target)) {
                menuBtn = menuBtn.charAt(0) === '#' ? menuBtn.substring(1) : menuBtn;
                menuBtn = document.getElementById(menuBtn);
            }

            //check if the menu button is out of view as in the case of it overlayed with another card layer
            if (!menuBtn.offsetParent
                    && menuBtn.offsetWidth === 0
                    && menuBtn.offsetHeight === 0) {
                return;//leave since the menu botton in no showing
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
            this.height -= 0;//implicitly convent to numeric
            var screen_inner_height = window.innerHeight;

            var mnu_bound = mnuCmp[0].getBoundingClientRect();

            var max_height = screen_inner_height - 60; // minus some pixels

            if (mnu_bound.height > 0 && max_height > mnu_bound.height) {
                if (!this.height) {
                    max_height = mnu_bound.height;
                }
            }

            var mnu_height;
            var body_height = this.height;
            var max_body_height = max_height;
            if (this.height && this.height < max_height) {
                mnu_height = this.height;
                if (this.header && this.footer) {
                    body_height = this.height - 2 * menuHeaderHeight;
                } else if (this.header || this.footer) {
                    body_height = this.height - menuHeaderHeight;
                }
            } else {
                mnu_height = max_height;
                if (this.header && this.footer) {
                    max_body_height = max_height - 2 * menuHeaderHeight;
                } else if (this.header || this.footer) {
                    max_body_height = max_height - menuHeaderHeight;
                }
            }


            var body_height_style = body_height ?
                    "height: " + body_height + "px; max-height: " + max_body_height + "px;"
                    : "max-height: " + max_body_height + "px;";


            if (mnu_height + y > screen_inner_height) {
                y = (screen_inner_height - mnu_height) / 2; //place in center of screen vertically
                y = Math.floor(y);
            }

            var style = 'position: absolute; '
                    + ' top : ' + y + 'px; '
                    + ' left: ' + x + 'px; '
                    + ' width: ' + mnu_width + 'px; '
                    + ' height: ' + mnu_height + 'px;';


            mnuCmp[0].style = style;
            mnuBody[0].style = body_height_style;

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

            /*if (obj.height) {
             //set a private field for adjusting height when orientation change to avoid improper height
             obj._heightRatio = obj.height / window.innerHeight; //save the height ratio for proper height setting based on device orientation
             }*/


            function onTargetClick() {
                create0.call(this);
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

        tab_body.style.overflow = 'hidden';//force overflow to hidden to prevent Android swipe event bug issue

        var contents = $(tab_body).children();
        var shownIndex = null;
        var active_class = 'game9ja-tab-active';

        //make sure a tab is active and the corresponding content showing

        if (obj.activeTabIndex > -1 && obj.activeTabIndex < contents.length) {
            for (var i = 0; i < contents.length; i++) {
                if (i === obj.activeTabIndex) {
                    contents[i].style.display === 'block';
                    if (!$(btns[i]).hasClass(active_class)) {
                        $(btns[i]).addClass(active_class);
                    }
                } else {
                    contents[i].style.display === 'none';
                    $(btns[i]).removeClass(active_class);
                }
            }
        }

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
            /*
             * Deprecated -  using Main.click() now. no need to off. that has been taken care of.
             $(btns[i]).off('click');
             $(btns[i]).on('click', tabShow.bind(
             {
             tabIndex: i,
             buttons: btns,
             tabBody: tab_body,
             fn: obj.onShow[id_prefix + btns[i].id]
             }));*/

            Main.click(btns[i], tabShow.bind(
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

        var tab_touch_start_x = null;
        var tab_touch_start_y = null;
        var tab_touch_end_x = null;
        var tab_touch_end_y = null;

        var dragObj = {
            buttons: btns,
            tabBody: tab_body
        };

        if (tab_body.addEventListener) {
            tab_body.addEventListener('touchstart', tabStartTouch.bind(dragObj), false);
            tab_body.addEventListener('touchmove', tabMoveTouch.bind(dragObj), false);
            tab_body.addEventListener('touchend', tabEndTouch.bind(dragObj), false);
            tab_body.addEventListener('touchcancel', tabCancelTouch.bind(dragObj), false);
        }


        function tabStartTouch(evt) {

            if (evt.touches.length === 1) {
                tab_touch_start_x = evt.touches[0].pageX;
                tab_touch_start_y = evt.touches[0].pageY;
            }

        }

        function tabMoveTouch(evt) {
            if (evt.touches.length !== 1) {
                return;
            }
            dragTab.call(this, evt);
        }

        function tabEndTouch(evt) {
            finishDragTab.call(this, evt);
        }

        function tabCancelTouch(evt) {
            finishDragTab.call(this, evt);
        }

        function isVert(x, y) {
            var deg = Math.atan(Math.abs(y / x)) * 180 / Math.PI;
            if (deg > 10) {//TESTING!!!           
                console.log('veritcal ', deg);
            }
            return deg > 10;
        }

        function finishDragTab(evt) {

            if (typeof tab_touch_end_x === 'undefined' || tab_touch_end_x === null) {
                return;
            }

            var change_x = tab_touch_start_x - tab_touch_end_x;
            var change_y = tab_touch_start_y - tab_touch_end_y;


            //initialize - important!
            tab_touch_start_x = null;
            tab_touch_start_y = null;
            tab_touch_end_x = null;
            tab_touch_end_y = null;

            var tab_cont = getTabDragged.call(this, evt);
            if (!tab_cont) {
                return;
            }

            var contents = $(this.tabBody).children();
            for (var i = 0; i < contents.length; i++) {
                if (contents[i] === tab_cont) {
                    var next_tab_index;
                    if (change_x > 0) {
                        next_tab_index = i + 1;
                        animDraggedTab.call(this, contents[i], contents[i + 1], change_x, true, next_tab_index);
                    } else {
                        next_tab_index = i - 1;
                        animDraggedTab.call(this, contents[i], contents[i - 1], change_x, false, next_tab_index);
                    }
                    break;
                }
            }

        }

        function getTabDragged(evt) {

            var tab_cont = evt.target;

            while (true) {

                if (tab_cont === document.body || tab_cont === null) {
                    tab_cont = null;
                    break;
                }

                if (tab_cont.parentNode === this.tabBody) {
                    break;
                }

                tab_cont = tab_cont.parentNode;
            }

            return tab_cont;
        }

        function dragTab(evt) {
            var end_x = evt.touches[0].pageX;
            var end_y = evt.touches[0].pageY;
            var change_x = tab_touch_start_x - end_x;
            var change_y = tab_touch_start_y - end_y;

            if (isVert(change_x, change_y)) {
                return;
            }

            tab_touch_end_x = end_x;
            tab_touch_end_y = end_y;

            var tab_cont = getTabDragged.call(this, evt);
            if (!tab_cont) {
                return;
            }

            var contents = $(this.tabBody).children();
            for (var i = 0; i < contents.length; i++) {
                if (contents[i] === tab_cont) {
                    if (change_x > 0) {
                        dragShowTab(contents[i], contents[i + 1], change_x, true);
                    } else {
                        dragShowTab(contents[i], contents[i - 1], change_x, false);
                    }
                    break;
                }
            }

        }

        function dragShowTab(comp, new_comp, change, forward) {
            if (!new_comp) {
                return;
            }

            comp.style.display = 'block';
            new_comp.style.display = 'block';
            var width = comp.getBoundingClientRect().width;

            if (forward) {
                if (change > width) {
                    change = width;
                }
                comp.style.left = -change + 'px';
                new_comp.style.left = -change + width + 'px';
            } else {
                change = -change;
                if (change > width) {
                    change = width;
                }
                comp.style.left = change + 'px';
                new_comp.style.left = change - width + 'px';
            }

        }

        function swipeTabBody() {
            for (var i = 0; i < btns.length; i++) {
                if ($(btns[i]).hasClass(active_class)) {
                    var next = i + this.direction;
                    if (btns[next]) {
                        tabShow.call(
                                {
                                    tabIndex: next,
                                    buttons: btns,
                                    tabBody: tab_body,
                                    fn: obj.onShow[id_prefix + btns[next].id]
                                });
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

        function animDraggedTab(comp, new_comp, change, forward, next_tab_index) {
            if (!new_comp) {
                return;
            }

            comp.style.display = 'block';
            new_comp.style.display = 'block';

            var width = comp.getBoundingClientRect().width;

            if (Math.abs(change) > width / 2) {//if the dragging has done mid way

                var func = obj.onShow[id_prefix + this.buttons[next_tab_index].id];
                if (Main.util.isFunc(func)) {
                    func();
                }

                if (forward) {
                    Main.anim.to(comp, 500, {left: -width + 'px'}, function () {
                        this.el.style.display = 'none';
                    }.bind({el: comp}));

                    Main.anim.to(new_comp, 500, {left: '0px'});
                    setActiveButton(new_comp);

                } else {
                    Main.anim.to(comp, 500, {left: width + 'px'}, function () {
                        this.el.style.display = 'none';
                    }.bind({el: comp}));

                    Main.anim.to(new_comp, 500, {left: '0px'});
                    setActiveButton(new_comp);
                }

            } else {
                //reverse
                if (forward) {
                    Main.anim.to(new_comp, 500, {left: width + 'px'}, function () {
                        this.el.style.display = 'none';
                    }.bind({el: new_comp}));

                    Main.anim.to(comp, 500, {left: '0px'});
                    setActiveButton(comp);

                } else {
                    Main.anim.to(new_comp, 500, {left: -width + 'px'}, function () {
                        this.el.style.display = 'none';
                    }.bind({el: new_comp}));

                    Main.anim.to(comp, 500, {left: '0px'});
                    setActiveButton(comp);
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

            setActiveButton(newComp);
            Main.anim.to(newComp, 500, {left: '0%'});

            Main.anim.to(prevComp, 500, {left: prev_left}, function () {
                this.el.style.display = 'none';
            }.bind({el: prevComp}));
        }

        function setActiveButton(comp) {
            var tab_main = comp.parentNode;

            while (true) {
                if (tab_main === document.body || tab_main === null) {
                    return;
                }

                if ($(tab_main).hasClass('game9ja-tab')) {
                    break;
                }
                tab_main = tab_main.parentNode;
            }

            var tab_body = $(tab_main).find('.game9ja-tab-body')[0];
            var tab_header = $(tab_main).find('.game9ja-tab-header')[0];

            var btns = tab_header.children;
            var tab_contents = tab_body.children;

            for (var tab_index = 0; tab_index < tab_contents.length; tab_index++) {
                var btn = btns[tab_index];
                if (tab_contents[tab_index] === comp) {
                    if (!$(btn).hasClass(active_class)) {
                        $(btn).addClass(active_class);
                    }
                } else {
                    $(btn).removeClass(active_class);
                }
            }



        }

    };


    function _analyzeEvtParam(a1, a2, a3) {
        var param = {
            data: null,
            callback: null,
            capture: null
        };
        if (typeof a3 !== 'undefined'
                && typeof a2 === 'function') {
            param.data = a1;
            param.callback = a2;
            param.capture = a3;
        } else if (typeof a3 === 'undefined'
                && typeof a2 !== 'undefined'
                && typeof a1 === 'function'
                && typeof a2 !== 'function') {
            param.callback = a1;
            param.capture = a2;
        } else if (typeof a3 === 'undefined'
                && typeof a2 === 'function') {
            param.data = a1;
            param.callback = a2;
        } else if (typeof a3 === 'undefined'
                && typeof a2 === 'undefined'
                && typeof a1 === 'function') {
            param.callback = a1;
        }

        return param;
    }

    Main.click = function (el, argu1, argu2, argu3) {

        if (Main.device.isMobileDeviceReady) {//implement mobile tap event
            Main.dom.addListener(el, 'touchstart', null, null, false);
            Main.dom.addListener(el, 'touchend', argu1, argu2, argu3);
        } else {
            Main.dom.addListener(el, 'click', argu1, argu2, argu3);
        }
    };

    Main.tap = function (el, argu1, argu2, argu3) {
        Main.click(el, argu1, argu2, argu3);
    };


    Main.longpress = function (el, argu1, argu2, argu3) {

        var param = _analyzeEvtParam(argu1, argu2, argu3);

        var data = param.data;
        var callback = param.callback;
        var capture = param.capture;

        // Create variable for setTimeout
        var delay;

        // Set number of milliseconds for longpress
        var longpress_duration = 1300;

        if (Main.device.isMobileDeviceReady) {
            el.addEventListener('touchstart', onPress, capture);
            el.addEventListener('touchend', clearAction);
            el.addEventListener('touchcancel', clearAction);
        } else {
            el.addEventListener('mousedown', onPress, capture);
            el.addEventListener('mouseup', clearAction);
            el.addEventListener('mouseout', clearAction);
        }

        function onPress(e) {
            delay = setTimeout(check, longpress_duration);
            function check() {
                callback(e, data);
            }
        }

        function clearAction(e)
        {
            clearTimeout(delay);
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

            var pkg = _pathname + appUrl + "include.json";

            Main.ajax.get(pkg,
                    function (res) {

                        //block comments directly below is deprecated code. breaks when minified by minifying tool
                        //because the json variable evaluated in the eval function is not minified thus breaking 
                        //the code afte it.
                        /* eval('var json = ' + res);//remove comments if present since they are not valid in json
                         var json = json;//old - it breaks when minified 
                         */

                        var variable = "game9ja_eval_call_" + new Date().getTime();//unique variable name
                        window[variable] = variable;//technique! to avoid minifying tools from breaking the
                        // code, store the variable name to be used in the eval function in the window object 

                        eval('window[' + variable + '] = ' + res);//remove comments if present since they are not valid in json


                        var json = window[variable];

                        if (!json.domain) {
                            throw Error('Invalid include - must contain property "domain"');
                        } else if (!Main.util.isString(json.domain)) {
                            throw Error('Invalid value of property of domain in include file');
                        }


                        if (!json.protocol) {
                            throw Error('Invalid include - must contain property "protocol"');
                        } else if (!Main.util.isString(json.protocol)) {
                            throw Error('Invalid value of property of protocol in include file');
                        }

                        if ((window.location.protocol !== 'http:' && window.location.protocol !== 'https:')
                                || !_host) {//likely a desktop or mobile app
                            _host = json.domain;
                            _protocol = json.protocol;
                        }

                        if (_host === 'localhost' || _host === '127.0.0.1') {
                            console.warn('WARNING!!! You are connecting to local server using "' + _host + '". Is this intentional? ');
                        }

                        //setup the application namespace
                        if (Main.util.isString(json.namespace)) {
                            if (window[json.namespace]) {
                                console.error("Application error! User defined namespace already exist - " + json.namespace);
                                return;
                            }
                            appNamespace = json.namespace;
                        } else if (Main.util.isString(appNamespace)) {
                            if (window[appNamespace]) {
                                console.error("Application error! Default namespace already exist - " + appNamespace);
                                return;
                            }
                        } else {
                            console.error("Application error! No namespace found - application must be provided with a namespace.");
                            return;
                        }

                        window[appNamespace] = {};


                        var absolute_scripts = [],
                                app_scripts = [],
                                cat_scripts = [],
                                absolute_styles = [],
                                app_styles = [],
                                cat_styles = [];

                        var absolute_exe = [];
                        var app_exe = [];
                        var cat_exe = [];
                        var is_build = false;
                        if (json.build && json.build.prod) {
                            is_build = true;
                            //override the resources with that of the build since the
                            //build takes precedence
                            json.absolute = json.build.absolute;
                            json.app = json.build.app;
                            json[device_size_cat] = json.build[device_size_cat];
                        }

                        if (json.absolute && Main.util.isArray(json.absolute.js)) {
                            absolute_scripts = json.absolute.js;
                        }
                        if (json.absolute && Main.util.isArray(json.absolute.css)) {
                            absolute_styles = json.absolute.css;
                        }
                        if (json.absolute && Main.util.isArray(json.absolute.load_exceptions)) {
                            absolute_exe = json.absolute.load_exceptions;
                        }

                        if (json.app && Main.util.isArray(json.app.js)) {
                            app_scripts = json.app.js;
                        }
                        if (json.app && Main.util.isArray(json.app.css)) {
                            app_styles = json.app.css;
                        }
                        if (json.app && Main.util.isArray(json.app.load_exceptions)) {
                            app_exe = json.app.load_exceptions;
                        }

                        if (json[device_size_cat] && Main.util.isArray(json[device_size_cat].js)) {
                            cat_scripts = json[device_size_cat].js;
                        }
                        if (json[device_size_cat] && Main.util.isArray(json[device_size_cat].css)) {
                            cat_styles = json[device_size_cat].css;
                        }
                        if (json[device_size_cat] && Main.util.isArray(json[device_size_cat].load_exceptions)) {
                            cat_exe = json[device_size_cat].load_exceptions;
                        }

                        var track = {
                            deviceCategory: device_size_cat,
                            file: null, //set dynamically
                            type: null, //set dynamically
                            count: 0,
                            retryCount: 0,
                            isBuild: is_build,
                            total: absolute_styles.length
                                    + app_styles.length
                                    + cat_styles.length
                                    + absolute_scripts.length
                                    + app_scripts.length
                                    + cat_scripts.length,
                            queueIndex: -1,
                            queue: []
                        };
                        var is_path_absolute = true;

                        var cssFilesHandler = function () {
                            loadRequiredFiles(absolute_styles, track, absoluteRoute, loadCss, absolute_exe, is_path_absolute);
                            loadRequiredFiles(app_styles, track, appRoute, loadCss, app_exe, !is_path_absolute);
                            loadRequiredFiles(cat_styles, track, deviceRoute, loadCss, cat_exe, !is_path_absolute);
                        };

                        var jsFilesHandler = function () {
                            loadRequiredFiles(absolute_scripts, track, absoluteRoute, loadScript, absolute_exe, is_path_absolute);
                            loadRequiredFiles(app_scripts, track, appRoute, loadScript, app_exe, !is_path_absolute);
                            loadRequiredFiles(cat_scripts, track, deviceRoute, loadScript, cat_exe, !is_path_absolute);
                        };

                        if (is_build) {
                            for (var i in json.build.merge_js) {
                                var merged_files = json.build.merge_js[i];
                                if (!nsObjects(merged_files)) {
                                    return;
                                }
                            }
                            if (Main.util.isFunc(Main.build)) {
                                Main.build();
                            } else {
                                console.error("Build tool fault detected! Main.build is not a function! Build tool is expected to create the function with relevant code of the js file embeded inside and the function appended to the main js file.");
                                return;
                            }

                        }

                        if (track.total > 0) {
                            cssFilesHandler();
                            jsFilesHandler();
                        } else {//zero
                            loadDeviceMain(track.deviceCategory);
                        }

                    }
            , function () {
                console.log("could not get resource: ", pkg);
            });

        };

        /**
         * Create the relevant namepace object of the file<br>
         * e.g if the file name is /path/to/long/Filename.js<br>
         * and the app namespace is MyApp then the object MyApp.path.to.long 
         * will be created in the order below:<br>
         * <br>
         * MyApp.path = {}<br>
         * MyApp.path.to = {}<br>
         * MyApp.path.to.long = {}<br>
         * 
         * @param {type} file
         * @returns {undefined}
         */
        function nsObjects(file) {
            var dot_index = file.indexOf('.');
            if (dot_index > -1) {
                file = file.substring(0, dot_index);
            }
            _nsFiles.push(file);

            var ps = file.split('/');
            var cObj = window[appNamespace];
            var pstr = "";

            for (var i = 0; i < ps.length - 1; i++) {//yes 'i < ps.length-1' - skipping the file name  
                var p = ps[i];

                pstr += i > 0 ? "." + p : p;
                if (cObj[p] && !_nsObjs[pstr]) {
                    console.error("Application Error! cannot instantiate class object for " + file + " - object '" + appNamespace + "." + pstr + "' already exist!");
                    return;
                } else if (!cObj[p]) {
                    cObj[p] = {};
                }


                cObj = cObj[p];

            }

            if (pstr) {
                _nsObjs[pstr] = window[appNamespace][ps[0]];
            }

            return true;
        }

        function loadRequiredFiles(files, track, route, callback, exceptions, is_path_absolute) {

            for (var i = 0; i < files.length; i++) {
                if (files[i].indexOf(0) === '/') {
                    files[i] = files[i].substring(1);
                }
                var argu = [];
                argu.push(files[i]);
                argu.push(track);
                argu.push(route);
                argu.push(exceptions);
                argu.push(is_path_absolute);
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
            return deviceUrl + cat + "/" + type + "/" + file;
        }
        function nextProcess() {
            this.count++;
            if (this.count === this.total) {
                loadDeviceMain(this.deviceCategory);
            } else {
                var next = this.queue[this.count - 1];
                next.loader.apply(null, next.argu);
            }
        }
        function retryProcess() {

            if (this.retryCount >= 5) {
                console.error('Could not load resource after maximum retry attempts exceeded - ', this.file);
                return;
            }

            this.retryCount++;

            console.log(this.retryCount, 'Retry loading :', this.file);

            this.count--;//force repeat

            nextProcess.call(this);

        }
        function onLoadInclude() {

            if (this.retryCount > 0) {
                console.log('Successfully loaded :', this.file);
            }

            this.retryCount = 0;//intialize after any successful loading

            if (this.type === 'js' && !this.isPathAbsolute) {
                var cls_name = jsClassName(this.file);
                var clsObj = classObject(cls_name);
                if (!clsObj) {
                    console.warn("Class '" + cls_name + "' not found in '" + this.file + "'. Is this intentional?");
                }
                var temClsObj = tempClassObjects[cls_name];
                if (typeof temClsObj === 'undefined') {
                    tempClassObjects[cls_name] = {instance: clsObj, className: cls_name, fileName: this.file};
                } else {
                    throw Error("Class '" + temClsObj.className + "' in '" + this.file + "' already exists in '" + temClsObj.fileName + "'");
                }

            }

            nextProcess.call(this);
        }
        function onErrorInclude() {

            for (var n in this.exceptions) {
                var ex = this.exceptions[n];
                var ex_file = this.routeFn(ex);
                if (this.file === ex_file) {

                    console.log(ex_file, "failed to load but will not abort application loading process based on configuration!");

                    nextProcess.call(this);
                    return;
                }
            }

            console.log('Failed to load a required resource :', this.file);

            retryProcess.call(this);

        }
        function loadCss(file, track, route, exceptions, is_path_absolute) {
            track.type = "css";
            track.file = route(file, track.type);
            track.exceptions = exceptions;
            track.routeFn = route;

            var link = document.createElement("link");
            link.onload = onLoadInclude.bind(track);
            link.onerror = onErrorInclude.bind(track);
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = track.file;
            document.head.appendChild(link);
        }

        function loadScript(file, track, route, exceptions, is_path_absolute) {

            //create the objects related to the namepace directory
            if (!track.isBuild) {// for development! - the nsObjects for buid is handled else here
                if (!is_path_absolute) {
                    if (!nsObjects(file)) {
                        return;
                    }
                }
            }

            track.type = "js";
            track.file = route(file, track.type, track.deviceCategory);
            track.exceptions = exceptions;
            track.routeFn = route;
            track.isPathAbsolute = is_path_absolute;

            var script = document.createElement("script");

            script.onload = onLoadInclude.bind(track);
            script.onerror = onErrorInclude.bind(track);
            script.type = "text/javascript";
            script.src = track.file;
            document.head.appendChild(script);

        }
        function classObject(className) {
            var sp = className.split('.');
            var appNs = window;
            var i;
            for (i in sp) {
                var p = sp[i];
                if (!appNs[p]) {
                    return;
                }
                appNs = appNs[p];
            }
            return appNs;
        }

        function loadDeviceMain(device_size_cat) {
            //register the home page first

            Main.device.constructor();//initialize device            

            devicePageTplRouteUrl = deviceUrl + device_size_cat + '/view/tpl/';
            devicePageRouteUrl = deviceUrl + device_size_cat + '/view/';

            var routeFile = devicePageRouteUrl + "index.html";

            $.get(routeFile,
                    function (response) {
                        var pg_recv = $("<div></div>").html(response);
                        var children = $('body').children();
                        for (var name = children.length - 1; name > -1; name--) {
                            $(children[name]).remove();
                        }
                        var childrenRev = $(pg_recv).children();
                        for (var name = 0; name < childrenRev.length; name++) {
                            if (childrenRev[name].nodeName === 'TITLE') {
                                continue;
                            }
                            $('body').append(childrenRev[name]);
                        }
                        Main.page.init();

                        //initialize namespace related objects by calling their constructors

                        var cls_list = {};
                        for (var name in tempClassObjects) {
                            cls_list[name] = tempClassObjects[name].instance;
                        }

                        tempClassObjects = null; //free memory

                        //consider class that extends other class

                        for (var name in cls_list) {

                            var clsObj = cls_list[name];

                            if (typeof clsObj === 'undefined') {
                                continue;
                            }

                            var superClsObj = cls_list[clsObj.extend];

                            if (clsObj.extend
                                    && !superClsObj) {
                                throw Error('Unknown class to extend by ' + name + ' - ' + clsObj.extend + ' is unknown');
                            }
                            doExtend(clsObj, superClsObj, name);

                            if (name === 'Ns.game.two.Chess2D') {//TESTING!!!
                                console.dir(clsObj);
                            }

                            var construct = 'constructor';
                            if (clsObj.hasOwnProperty(construct)) {
                                var construtorFn = clsObj[construct];
                                if (Main.util.isFunc(construtorFn)) {
                                    construtorFn.call(clsObj);
                                }
                            }
                        }


                        function doExtend(obj, e, first) {
                            if (!e) {
                                return;
                            }

                            for (var n in e) {
                                if (!(n in obj)) {
                                    obj[n] = e[n];
                                }
                            }

                            if (!e.extend || //no more extend
                                    e.extend === first//cyclic extend
                                    ) {
                                return;
                            }

                            var eObj = cls_list[e.extend];// super class object

                            if (!eObj) {
                                throw new Error('Unknown class to extend - ' + e.extend);
                            }

                            try {
                                doExtend(obj, eObj, first);
                            } catch (e) {
                                console.error('This error is most likely caused by a class extending itself - ', eObj.extend, e);
                                //do not rethrow the error in this recursive method
                            }
                        }




                    }
            ).fail(function (data) {
                console.log("could not get resource: ", routeFile);
            });

        }


    };

    /**
     * Detect the size of device and return
     * small,  medium or large
     * @return {undefined}
     */
    function deviceSizeCategory() {

        //NOTE: We have deprecated the use of window.screen.height and window.screen.width
        //rather we resort to the use of window.innerHeight and window.innerWidth.
        //The reason for the deprecation is the shocking observation that
        //they report wrong values and are inconsistent with deifferent device webViews and browsers.
        //The devicePixelRation somewhat affects the values they return.
        //One shocking and very terrifying observation I had in my Itel phone of 320 x 570 size is that,
        //while the android browser report the correct sizes (320 x 570) with devicePixelRatio of 1.5,
        //the webview of the same phone reported  (480 x 855) with same devicePixelRatio of 1.5.
        //THIS IS ABSOLUTELY SHOCKING AND TERRIFYING. WHAT!!!!!!
        //even window.outerHeight and window.outerWidth have similar issues so do not
        //use them. STICK ONLY TO window.innerHeight and window.innerWidth


        var longer_size = window.innerWidth > window.innerHeight ?
                window.innerWidth
                : window.innerHeight;


        var short_size = window.innerWidth < window.innerHeight ?
                window.innerWidth
                : window.innerHeight;

        portriat_height = longer_size;
        portriat_width = short_size;

        //portriat_width = portriat_width / window.devicePixelRatio;

        if (longer_size >= 800 && short_size >= 800) {//desktops and laptops
            device_category = "large";
        } else if (longer_size >= 600) {//tablets
            device_category = "medium";
        } else {//smart phones
            device_category = "small";
        }

        if (window.innerWidth >= 800
                && !('onorientationchange' in window)
                && window.devicePixelRatio === 1)
        {//a good guess that it is a desktop
            device_category = "large";
            Main.device.isDesktop = true;
        }
        
        console.log('user agent', window.navigator.userAgent);
        
        var user_agent = window.navigator.userAgent.toLowerCase();
        
        if(user_agent.indexOf(' electron/') > -1){
            Main.device.isDesktopApplication = true;//Electron application
        }else if(typeof process !== 'undefined' && process.versions && process.versions['node-webkit']){
            Main.device.isDesktopApplication = true;//nwjs application
        }
        
        console.log('Main.device.isDesktopApplication', Main.device.isDesktopApplication);
        
        return device_category;
    }


    return Main;
})();

/*
 * Below the build tool will append the Main.build function with
 * the js resource files content wrapped inside
 * 
 * example is shown below
 * 
 * Main.build = function(){
 * 
 * //the js resource files content will be
 * //embeded in body of this function. 
 * 
 * }
 * 
 * 
 */
