

/* global Main */


Ns.GameTournament = {


    Content: function (tournament) {
        
    },
   
    showPerformacesView: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'performance-view.html',
            fade: true,
            data: data,
            onShow: Ns.view.Performance.content
        });
    },
};