

/* global Main */


Ns.GameTournament = {


    Content: function (tournament) {
        
    },
   
    showPerformacesView: function (data) {

        Main.card.to({
            container: '#tournament-details',
            url: 'performance-view-md.html',
            fade: true,
            data: data,
            onShow: Ns.view.Performance.content
        });
    },
};