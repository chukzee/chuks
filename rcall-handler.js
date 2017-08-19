
"use strict";

var Response = require('./app/response');

class RCallHandler extends Response {

    constructor(sObj, app, appLoader) {
        super();
        this.sObj = sObj;
        app.route('/rcall')
                .post(this.processInput.bind(this));
        this.appLoader = appLoader;

    }

    processInput(req, res) {
        this.res = res;
        console.log(req.body.action);
        if (req.body.action === 'init_variables') {
            this.initVariables(req.body.data);
        } else if (req.body.action === 'remote_call') {
            this.execMethod(req.body.data, res);
        } else {
            this.replyError("Unknown request!");
        }
    }

    initVariables(classes) {

        var methodsMap = {};

        for (var i in classes) {
            var clazz = classes[i];
            if (!clazz) {
                this.replyError("No class specified!");
                return;
            }

            //get the module using the qualified class name
            var Module = this.appLoader.getModule(clazz);

            if (Module) {
                //we already know it is a function because we check for that in the app loader.
                var methods = Object.getOwnPropertyNames(Module.prototype);//NOTE : the super class methods are not included
                for (var m in methods) {
                    var mth = methods[m];
                    if (mth === 'constructor') {//skip the constructor
                        continue;
                    }
                    if (!methodsMap[clazz]) {
                        methodsMap[clazz] = [];
                    }
                    methodsMap[clazz].push(mth);
                }

            } else {
                this.replyError("No remote definition match class - " + clazz);
                return;
            }
        }

        this.replySuccess(methodsMap);
    }

    execMethod(obj, res) {

        var _shared_response_arr = [];
        for (var i in obj) {
            var input = obj[i];
            if (!input.class || !input.method) {
                this.errorFeedback(this, i);
                return;
            }

            //get the module using the qualified class name
            var Module = this.appLoader.getModule(input.class);
            //execute the class method in the module
            var respObj = new Response(res, obj.length, i, _shared_response_arr);
            if (Module) {
                //we already know it is a function because we check for that in the app loader.
                //instantiate the module on demand - safe this way to avoid thread issues if any.
                var moduleInstance = new Module(this.sObj);
                //set the response object needed by the module
                moduleInstance.response = respObj;
                //call the method in the module and pass the parameters
                console.log('input.param ', input.param);
                moduleInstance[input.method].apply(moduleInstance, input.param ? input.param : []);
            } else {
                errorFeedback(respObj, i);
                return;
            }
        }


    }

    errorFeedback(respObj, loop_index) {
        if (loop_index === 0) {
            respObj.replyError("Resource not found! class or method missing.");
        } else {
            respObj.replyError("Force termination after some success! Resource not found! class or method missing.");
        }
    }
}

module.exports = RCallHandler;
