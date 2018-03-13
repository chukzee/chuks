

/* global Main */


Ns.GameTournament = {


    Content: function (tournament) {
        
    },
   
    showPerformacesView: function (data) {

        Main.page.show({
            url: 'performance-view-sd.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Performance.content,
            data: data
        });
    },
};