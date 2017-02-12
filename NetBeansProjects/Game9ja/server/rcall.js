
class RCall {

    constructor(sObj, app, appLoader) {
        this.sObj = sObj;
        app.route('/rcall')
                .post(this.processInput);
        this.appLoader = appLoader;
    }

    processInput(req, res) {
        var input;
        try {
            input = JSON.parse(req.body);
        } catch (e) {
            this.replyError(res, "Error parsing json!");
        }

        if (!input.class || !input.method) {
            this.replyError(res, "Resource not found! class or method missing.");
        }

        //get the module using the qualified class name
        var Module = this.appLoader.getModule(input.class);
        //execute the class method in the module
        if (Module) {
            //we already know it is a function because we check for that in the app loader.
            //instance the module on demand - safe this way to avoid thread issues if any.
            var insMod = new Module(this.sObj);
            //call the method in the module and pass the parameters
            insMod.response = res;
            insMod[input.method].apply(Module, input.param ? input.param : []);
        } else {
            this.replyError(res, "Resource not found! class or method missing.");
        }
    }

}

module.exports = RCall;


