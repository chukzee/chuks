
Ns.Auth = {
    
    constructor : function(){
        
        this.login(function(user_info){
            Main.controller.UserProfile.appUser = user_info;
        });
        
    },
    
    login: function(callback){
                     
        //Simulate successful login
        //fake login
       var user = {//fake app user object
            id: "07038428492",
            fullName: "Chuks Alimele",
            groupsBelong: [{name: 'Grace', status_message:'this is the best group', photo: 'grace_photo.png'/*etc*/}, {name: 'Best Palyers', status_message:'this is the best group', photo: 'best_players_photo.png'/*etc*/}, {name: 'Omega', status_message:'this is the best group', photo: 'omega_photo.png'/*etc*/}],
            //tournamentList comprise of tournamen belong and tournament listed in tournament search
            tournamentList: [{name: 'Warri Championship', duration:'Feb-3-2017 to Mar-4-2017', photo: 'warri_champ_photo.png'/*etc*/}, {name: 'Sapele Champs', duration:'Feb-3-2017 to Mar-4-2017', photo: 'sapele_champ_photo.png'/*etc*/}, {name: 'Delta Big League', duration:'Feb-3-2017 to Mar-4-2017', photo: 'delta_league_photo.png'/*etc*/}],
            tournamentCount: 200 // overall tournament count in the system (server)
        };
        
        callback(user);
              
    }
};


