


"use strict";

var Result = require('../result');

class Match extends Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;  
    }
    
    /**
     * Add the spectator to this match and notify all users viewing this match
     * Only spectators who are members of the either of the player's group 
     * or contact list can be added. An exception to the rule may be given to 
     * certain users (e.g Premium Users) who may have the privilege to watch top ranked 
     * players games. However there is going to be a hard limit of visible spectators 
     * per game. This therefore introduces two type of spectators: Visible and Invisible.
     * The hard limit will only affect the invisible spectators. That is, if the total
     * number of spectators is greater the the maximum allowed then the rest will be 
     * regarded as invisible spectators. 
     * The main differenc between visible and invisible spectators is that the former will
     * receive realtime game session events while the later will not. The reason is that the invisible
     * spectator will not be stored in the datababase.
     * When a legitimate spectator joins the match late, his spectator type is marked as 'invisible'
     * and the status sent to the client. So periodically the invisible spectator will query
     * the game status. Upon quering, if it is detected that the number of spectators is fallen
     * below maximum thath the invisible spectator wiil be promoted to 'visible'.
     * 
     * 
     * @param {type} user_id - the spectator user id
     * @param {type} game_id -  the game id
     * @param {type} game_start_time - used to expire the spectator document from the collection
     * @returns {Match}
     */
    join(user_id, game_id, game_start_time){
        
        if(isNaN(new Date(game_start_time).getTime())){
            error("invalid input - date start time must be provided and a valid date."); 
            return this;
        }
        
        
        
    }
    
    leave(user_id, game_id){
        
    }
    
    expire(game_id){
        
    }
    
    
    
    
}