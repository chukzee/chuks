

class Game{
    
    constructor(){
        this.chess = new Chess(2, 2);
        this.draughts = new Draughts(2, 2);
        this.ludo = new Ludo(4, 2);
        this.solitaire = new Solitaire( Math.Infinity, 2);
        this.whot = new Whot(Math.Infinity, 2);
    }
    /**
     * Get the appropriate game for using the names and set the rules accordingly.
     * 
     * 
     * @param {type} name
     * @param {type} rules
     * @returns {nm$_Game.Ludo|nm$_Game.Whot|nm$_Game.Chess|nm$_Game.Solitaire|nm$_Game.Draughts}
     */
    get(name, rules){//TODO - rules - may require create new object of the specified game and initialize with the rules
        switch (name) {
            case "chess":
                return this.chess.setRules(rules);
                
            case "draughts":
                return this.draughts.setRules(rules);
                
            case "ludo":
                return this.ludo.setRules(rules);
                
            case "whot":
                return this.whot.setRules(rules);
                
            case "solitaire":
                return this.solitaire.setRules(rules);
                
            default:
                
                break;
        }
    }
    
    
    
    
}

class BaseGame{
   
     constructor(max_players, min_players){
         this.max_players = max_players;
         this.min_players = min_players;
         this.rules = null;
     }
   
    maxPlayers(){
        return this.max_players;
    }
    minPlayers(){
        return this.min_players; //minimum players that must be avaliable for the game to be still no
    }
    
    multiPlayers(){
        return this.max_players > 2;
    }
}



class Chess extends BaseGame{
    
    constructor(max_players , min_players){
         super(max_players, min_players);
    }
    
    getDefautRules(){
        return {};//TODO
    }
    
    setRules(rules){
        this.rules = rules;
       return this;
    }
};

class Draughts extends BaseGame{
    
    constructor(max_players , min_players){
         super(max_players, min_players);
    }
     
    getDefautRules(){
        return {};//TODO
    }
    
    setRules(rules){
        this.rules = rules;
       return this;
    }
};

class Ludo extends BaseGame{
    
    constructor(max_players , min_players){
         super(max_players, min_players);
    }
     
    getDefautRules(){
        return {};//TODO
    }
    
    setRules(rules){
        this.rules = rules;
       return this;
    }
};

class Whot extends BaseGame{
    
    constructor(max_players , min_players){
         super(max_players, min_players);
     }
     
    getDefautRules(){
        return {};//TODO
    }
    
    setRules(rules){
        this.rules = rules;
       return this;
    }
};

class Solitaire extends BaseGame{
    
    constructor(max_players , min_players){
         super(max_players, min_players);
     }
     
    getDefautRules(){
        return {};//TODO
    }
    
    setRules(rules){
        this.rules = rules;
       return this;
    }
};


module.exports = new Game();