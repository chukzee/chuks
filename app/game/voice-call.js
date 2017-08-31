
"use strict";

var Result = require('../result');


class VoiceCall extends   Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;  
    }
    
    getCallLog(user_id, from_time, to_time){
        
    }
}



module.exports = VoiceCall;
