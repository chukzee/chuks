
'use strict';

class Result {

    constructor(_sObj) {
        this.sObj = _sObj;
        this.data = {};
        this.success = false;
    }

    result(data){
       this.success = true; 
       this.data = data;  
       return this;
    }
    
    error(reason){
       this.success = false; 
       this.data = reason;  
       return this;
    }
   
}

module.exports = Result;


