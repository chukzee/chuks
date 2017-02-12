
'use strict';

class Base {

    constructor(_sObj) {
        this.sObj = _sObj;
    }

    replyError(error) {
        this.reply(error ? error : "An error occur!", false);
    }
    /*
     * This method must be called by subclass if operation is success
     * otherwise the request will block indefinitely, denially other requests
     */
    replySuccess(data) {
        this.reply(data, true);
    }
    
    /*
     * This method must be called by subclass if operation fails or there is an 
     * error otherwise the request will block indefinitely, denially
     * other requests
     */
    reply(data, success) {
        if (this.response) {
            this.response.json({success: success, data: data});
        }
    }

    set response(res){
        this._res = res;
    }
    get response(){
        return this._res ;
    }
}

module.exports = Base;


