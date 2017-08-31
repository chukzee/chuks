"use strict";

var Result = require('../result');

class PlayerRank extends Result{
    
    
    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;    
        console.log('PlayerRank');
    }

    computeRank(match_count, match_wins) {
        return (100 * match_wins / match_count) + this.RANK_FACTOR * match_count;
    }

    async getWeeklyRankList() {
        
    }

    async getMonthlyRankList() {
        
        //console.log(this.RANK_FACTOR +" after apply");
        //console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
         
         
    }

    async getYearlyRankList() {
        
    }
}

module.exports = PlayerRank;

//var p = new PlayerRank;

//p['getMonthlyRankList'].apply(p, [1,2,3,4]);

