

/* global Main, Ns */


Ns.GameTournament = {


    Content: function (tournament) {
        Ns.view.Tournament.content(tournament);
        
        $('#tournament-details-back-btn').off('click');
        $('#tournament-details-back-btn').on('click', function () {

            Main.card.back('#home-main', function () {

            });
        });
    },
   
    showPerformacesView: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'performance-view.html',
            fade: true,
            data: data,
            onShow: Ns.GamePerformance.Content
        });
    },
};