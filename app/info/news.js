
"use strict";

var WebApplication = require('../web-application');


class News extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }
    
    post(){
        
    }
    
    

    /**
     * Get news
     * 
     * @param {type} skip
     * @param {type} limit
     * @returns {nm$_news.News.get.data}
     */
    async get(skip, limit) {
        
    }
    
}



module.exports = News;



