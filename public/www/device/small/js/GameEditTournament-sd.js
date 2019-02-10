

/* global Main, Ns */


Ns.GameEditTournament = {

    Content: function (data) {
        Ns.view.EditTournament.content(data);
        $('#edit-tournament-back-btn').on('click', function () {
            Main.page.back();
        });
    },

};