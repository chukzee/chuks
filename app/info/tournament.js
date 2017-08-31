
"use strict";

var Result = require('../result');

class Tournament extends Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;  
    }

    async createTournament(obj) {
        
    }

    /**
     * As in multiple change of group info
     * 
     * @param {type} user_id
     * @returns {undefined}
     */
    async editTournament(user_id) {
        
    }
    
    async setTournamentIcon(user_id) {
        
    }
    
    async setTournamentStatus(obj) {
        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var result = await c.updateOne({tournament_name: obj.tournament_name}, {$set: {tournament_status: obj.tournament_status}});
            this.sObj.db.close();
            
        } catch (e) {
            
        }

    }
    
    async addOfficial(user_id) {
        
    }
    
    async addPlayer(user_id) {
        
    }

    async removePlayer(user_id) {
        

    }

    async getTournamentInfo(tournament_name) {


    }
    
   
    async getTournamentsInfoList(tournament_names_arr) {


    }


}

module.exports = Tournament;
