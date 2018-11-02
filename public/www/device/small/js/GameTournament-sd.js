

/* global Main, Ns */


Ns.GameTournament = {


    Content: function (tournament) {
        Ns.view.Tournament.content(tournament);
        $('#tournament-details-back-btn').on('click', function () {
            Main.page.back();
        });
    },
   
    showPerformacesView: function (data) {

        Main.page.show({
            url: 'performance-view.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GamePerformance.Content,
            data: data
        });
    },
};