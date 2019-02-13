

/* global Main, Ns */


Ns.GamePerformance = {

    Content: function (data) {
        Ns.view.Performance.content(data);
        
        $('#performance-view-back-btn').off('click');
        $('#performance-view-back-btn').on('click', function () {
            Main.page.back();
        });
    },

};