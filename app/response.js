"use strict";

class Response{
    
    constructor(_res, _req_count, _res_serial, _shared_response_arr){
        this.res = _res;
        this.req_count = _req_count;
        this.res_serial = _res_serial;
        this.shared_response_arr = _shared_response_arr;
    }
        
    replyError(error) {
        this.reply(error ? error : "An error occur!", false);
    }
    
    replySuccess(data) {
        this.reply(data, true);
    }
    
    reply(data, success) {
        var res_obj = {success: success, data: data};
        if(!this.req_count && !this.res_serial){
            this.res.json(res_obj);
            return;
        }
        
        this.shared_response_arr[this.res_serial] =  res_obj;
        if(this.req_count === 1){
            this.res.json(res_obj);
        }else if(this.shared_response_arr.length === this.req_count){
            this.res.json({success: true, data: shared_response_arr});
        }        
    }
    

}


module.exports = Response;

