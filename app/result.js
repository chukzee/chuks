
'use strict';

class Result {

    constructor(_sObj) {
        this.sObj = _sObj;
        this.data = {};
        this.success = false;
    }

    result(data){
       this.success = true; 
       this._isError = !this.success;
       this.data = data;  
       return this;
    }
    
    error(reason){
       this.success = false; 
       this._lastError = reason;
       this._isError = !this.success;
       return this;
    }
    
    get lastError(){
        return this._lastError;
    }
    
    get isError(){
        return this._isError;
    }
   
}

module.exports = Result;


