

/* global Main, Ns */


Ns.GameRankings = {

    Content: function (data) {
        Ns.view.Rankings.content(data);
        
        $('#rankings-back-btn').off('click');
        $('#rankings-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};