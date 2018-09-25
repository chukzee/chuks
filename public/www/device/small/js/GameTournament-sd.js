

/* global Main, Ns */


Ns.GameTournament = {


    Content: function (tournament) {
        
    },
   
    showPerformacesView: function (data) {

        Main.page.show({
            url: 'performance-view.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Performance.content,
            data: data
        });
    },
};