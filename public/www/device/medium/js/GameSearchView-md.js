

/* global Main, Ns */


Ns.GameSearchView = {

    Content: function (data) {
        Ns.view.SearchView.content(data);
        $('#search-view-header-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};