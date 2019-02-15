
"use strict";

var WebApplication = require('./app/web-application');

class RCallHandler {

    constructor(sObj, util, appLoader, evt) {
        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.files = null;

        this.appLoader = appLoader;
    }

    replyError(error) {
        return this.reply(false, error ? error : "An error occurred!");
    }

    replySuccess(data) {
        return this.reply(true, data);
    }

    replySuccessWithErrors(data, errors) {
        if (Array.isArray(errors)) {
            errors = errors.join('\n');
        }
        return this.reply(true, data, errors);
    }

    reply(success, rpl, err) {
        if (rpl && rpl.data) {
            rpl = rpl.data;
        }
        var obj = {success: success, data: rpl};
        if (err) {
            obj.error = err;
        }
        if (this.res) {
            
            //return this.res.json(obj);//@deprecated -  since we also use iframe ajax, setting content-type of application/json will cause inconsistent behaviour accross different browsers.
            
            var str_obj = JSON.stringify(obj);
            return this.res.send(str_obj);//this is now our preferred content-type since sending with res.json() causes inconsistent behaviour accross different browser when using iframe ajax
        }
        if (typeof this.done === 'function') {
            this.done(obj);
            this.done = null;//clear
        }
    }

    processInput(req, res) {

        this.res = res;

        if (req.body) {

            console.log(req.body.action);

            switch (req.body.action) {
                case 'init_variables':
                    this.initVariables(req.body.data);
                    return;
                case 'remote_call':
                    this.execMethod(req.body.data);
                    return;
                default:
                    this.replyError("Unknown rcall request!");
                    return;
            }

        } else {
            this.replyError("No request body!");
        }
    }

    processInputWithUpload(rcall_data, files, res) {
        
        this.files = files;
        this.res = res;
        
        try {
            var json = JSON.parse(rcall_data);
            if (json.action === 'remote_call') {
                this.execMethod(json.data);
            } else {
                this.replyError("Unknown rcall request with upload!");
            }
        } catch (e) {
            this.replyError("Invalid rcall request with upload!");
        }

    }

    initVariables(classes) {

        var methodsMap = {};
        var init_errros = [];
        for (var i in classes) {
            var clazz = classes[i];
            if (!clazz) {
                //this.replyError("No class specified!");
                //return;
                init_errros.push("No class specified!");
                continue;//new
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

                    if (mth.startsWith("_")) {
                        continue;//skip private method - private method name begins with underscore character '_' e.g _myPrivateMethod()
                    }

                    if (!methodsMap[clazz]) {
                        methodsMap[clazz] = [];
                    }
                    methodsMap[clazz].push(mth);
                }

            } else {

                //this.replyError("No remote definition match class - " + clazz);
                //return;
                init_errros.push("No remote definition match class - " + clazz);
                continue;//new
            }
        }

        if (init_errros.length === 0) {
            this.replySuccess(methodsMap);
        } else {//has error
            this.replySuccessWithErrors(methodsMap, init_errros);
        }
    }

    execMethod(obj, done) {

        this.done = done;

        var promise_arr = [];
        for (var i in obj) {
            var input = obj[i];
            if (!input.class || !input.method) {
                this.errorFeedback(i);
                return;
            }

            //get the module using the qualified class name
            var Module = this.appLoader.getModule(input.class);
            //execute the class method in the module

            if (Module) {
                //we already know it is a function because we check for that in the app loader.
                //instantiate the module on demand - safe this way to avoid thread issues if any.
                var moduleInstance = new Module(this.sObj, this.util, this.evt);
                
                moduleInstance._files = this.files;//set the files uploaded
                
                //call the method in the module and pass the parameters                
                //var rtv = moduleInstance[input.method].apply(moduleInstance, input.param ? input.param : []);
                //promise_arr.push(rtv);

                if (obj.length === 1) {
                    //single method call
                    this.doExec(promise_arr,
                            obj.length,
                            moduleInstance[input.method],
                            moduleInstance,
                            input.param);
                } else {
                    //multiple method call - run asynchronously using setImmediate to avoid the possibility of any method blocking another
                    setImmediate(this.doExec,
                            promise_arr,
                            obj.length,
                            moduleInstance[input.method],
                            moduleInstance,
                            input.param);
                }



            } else {
                this.errorFeedback(i);
                return;
            }
        }


    }

    doExec(promise_arr, count, method, classInstance, param) {

        var rtv = method.apply(classInstance, param ? param : []);
        promise_arr.push(rtv);

        if (promise_arr.length === count) {
            //promise all
            Promise.all(promise_arr)
                    .then(function (value) {
                        this.sendReturnedValues.bind(this)(value);//send all the success values
                        try {
                            classInstance._onFinish();
                        } catch (e) {
                            console.log(e);
                        }

                    }.bind(this))
                    .catch(function (value) {
                        this.sendReturnedError.bind(this)(value);//send the failed result if promise is rejected
                        try {
                            classInstance._onFinish();
                        } catch (e) {
                            console.log(e);
                        }

                    }.bind(this));
        }
    }

    sendReturnedValues(values) {

        var returnedValues = [];
        for (var i in values) {
            var value = values[i];
            if (value instanceof WebApplication) {
                //where WebApplication type value is returned from the method
                if (!value.lastError) {
                    returnedValues.push({
                        success: value.success,
                        data: value.data === true ? 'Operation was successful' : value.data
                    });//collect the results for onward sending to the client
                } else {
                    return this.sendReturnedError(value);
                }
            } else {
                //where plain value is returned from the method
                returnedValues.push({
                    success: true,
                    data: value === true ? 'Operation was successful' : value
                });//collect the results for onward sending to the client
            }
        }

        if (returnedValues.length === 1) {
            this.replySuccess(returnedValues[0]);
        } else { // more than one value
            this.replySuccess(returnedValues);
        }

    }

    sendReturnedError(errObj) {

        var errMsg;
        if (typeof errObj === 'string') {//the user return the error as string type
            errMsg = errObj;
        } else if (errObj instanceof WebApplication) {//the user return the error as WebApplication type
            errMsg = errObj.lastError;
        } else if (errObj instanceof Error) {//we will assume the error
            //  message is not user defined e.g io error so we will not show 
            //  that but rather show something generic
            errMsg = "Operation was not successful.";

            //we will log this error for debugging purpose
            console.log(errObj); //IN PRODUCTION LOG TO SEPERATE PROCESS FOR PERFORMANCE REASON!!!

        } else {//the user returned the error in other type
            if (errObj.data) {
                errMsg = errObj.data;
            } else if (errObj.error) {
                errMsg = errObj.error;
            }
        }

        this.replyError(errMsg);

    }

    errorFeedback(loop_index) {
        if (loop_index === 0) {
            this.replyError("Resource not found! class or method missing.");
        } else {
            this.replyError("Force termination after some operatons! Resource not found! class or method missing.");
        }
    }
}

module.exports = RCallHandler;
