

Ns.view.Tournament = {
    
       
    
    tournamentList : [],
    
    /**
     * hold the total tournaments known to the server
     * @type Number
     */
    tournamentCount: 0,
    
    
    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor : function(){
        
    },
    
    content : function(){
        
                
        $('#tournament-details-back-btn').on('click',function(){
            Main.card.back({
                container:'#home-main',
            });
        });
    },
    
    
    //more goes below
};