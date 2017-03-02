
"use strict";


class RCallRequest{

    constructor(sObj, app, appLoader) {
        this.sObj = sObj;
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

        var _shared_response_arr = [];
        for (var i in inputArr) {
            var input = inputArr[i];
            if (!input.class || !input.method) {
                errorFeedback(res, i);
                return;
            }

            //get the module using the qualified class name
            var Module = this.appLoader.getModule(input.class);
            //execute the class method in the module
            var respObj = new Response(res, inputArr.length, i, _shared_response_arr);
            if (Module) {
                //we already know it is a function because we check for that in the app loader.
                //instance the module on demand - safe this way to avoid thread issues if any.
                var moduleInstance = new Module(this.sObj);
                //set the response object needed by the module
                moduleInstance.response = respObj;
                //call the method in the module and pass the parameters
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

module.exports = RCallRequest;
