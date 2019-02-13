

/* global Main, Ns */


Ns.GameCreateTournament = {

    Content: function (data) {
        Ns.view.CreateTournament.content(data);
        
        $('#create-tournament-back-btn').off('click');
        $('#create-tournament-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};