

/* global Main, Ns */


Ns.GameTournament = {


    Content: function (tournament) {
        Ns.view.Tournament.content(tournament);
        
        $('#tournament-details-back-btn').off('click');
        $('#tournament-details-back-btn').on('click', function () {
            Main.page.back();
        });
    },
   
    showPerformacesView: function (data) {

        Main.page.show({
            url: 'performance-view.html',
            effect: "fade",//we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GamePerformance.Content,
            data: data
        });
    },
};