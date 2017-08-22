

Ns.view.Tournament = {
    
    
    /**
     * holds array of tournament names the app user belong to
     * e.g
     * //structure
     * 
     * ['tournament_name_1','tournament_name_2','tournament_name_3','tournament_name_4']
     * 
     * @type type
     */
    tournamentsBelong : [],
    
    /**
     * holds list of tournament info against the tournament name
     * e.g
     * //object structure
     * {
     *  tournament_name_1 : {name:..., photo:...,date_created:...,duration:..., created_by:  officials:..., players:..., match_schedule:... etc.}
     *  tournament_name_2 : {name:..., photo:...,date_created:...,duration:..., created_by:  officials:..., players:..., match_schedule:... etc.}
     *  tournament_name_3 : {name:..., photo:...,date_created:...,duration:..., created_by:  officials:..., players:..., match_schedule:... etc.}
     *  tournament_name_4 : {name:..., photo:...,date_created:...,duration:..., created_by:  officials:..., players:..., match_schedule:... etc.}
     *  tournament_name_5 : {name:..., photo:...,date_created:...,duration:..., created_by:  officials:..., players:..., match_schedule:... etc.}
     * }
     * @type type
     */
    tournamentList : {},
    /**
     * holds the 
     * @type Number
     */
    
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