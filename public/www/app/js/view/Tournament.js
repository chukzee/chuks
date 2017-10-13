

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
        
        var obj = {
            tourn: 'info/Tournament'
        };

        Main.rcall.live(obj);

    },
    
    content : function(){
        
                
        $('#tournament-details-back-btn').on('click',function(){
            Main.card.back({
                container:'#home-main',
            });
        });
    },
    
    getUserTournamentsInfo: function (callback) {
        
        Main.rcall.live(function () {
            Main.ro.tourn.getTournamentsInfoList(Ns.view.UserProfile.appUser.tournaments_belong)
                    .get(function (tournaments) {
                        if (tournaments.length === 0) {
                            return;
                        }
                        Ns.view.Tournament.tournamentList = tournaments;

                        callback(tournaments);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },
    
    //more goes below
};