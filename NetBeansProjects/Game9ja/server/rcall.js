
"use strict";

var Base = require('./app/base');

class RCall extends Base {

    constructor(sObj, app, appLoader) {
        super(sObj);

        app.route('/rcall')
                .post(this.processInput);
        this.appLoader = appLoader;
    }

    processInput(req, res) {
        var inputArr;
        try {
            inputArr = JSON.parse(req.body);
        } catch (e) {
            this.replyError(res, "Error parsing json!");
        }

        for (var i in inputArr) {
            var input = inputArr[i];
            if (!input.class || !input.method) {
                errorFeedback(res, i);
                return;
            }

            //get the module using the qualified class name
            var Module = this.appLoader.getModule(input.class);
            //execute the class method in the module
            if (Module) {
                //we already know it is a function because we check for that in the app loader.
                //instance the module on demand - safe this way to avoid thread issues if any.
                var moduleInstance = new Module(this.sObj);
                //call the method in the module and pass the parameters
                moduleInstance.response = res;
                moduleInstance[input.method].apply(moduleInstance, input.param ? input.param : []);
            } else {
                errorFeedback(res, i);
                return;
            }
        }
    }

    errorFeedback(res, loop_index) {
        this.response = res;
        if (loop_index === 0) {
            this.replyError("Resource not found! class or method missing.");
        } else {
            this.replyError("Force termination after some success! Resource not found! class or method missing.");
        }
    }
}

module.exports = RCall;
