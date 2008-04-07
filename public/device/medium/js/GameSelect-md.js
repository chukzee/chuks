/* global Main */

//fake login
Main.controller.auth = {}; //fake auth
Main.controller.auth.appUser = {//fake app user object
    id: "07038428492",
    fullName: "Chuks Alimele",
    groupsBelong: [{name: 'Grace', status_message:'this is the best group', photo: 'grace_photo.png'/*etc*/}, {name: 'Best Palyers', status_message:'this is the best group', photo: 'best_players_photo.png'/*etc*/}, {name: 'Omega', status_message:'this is the best group', photo: 'omega_photo.png'/*etc*/}],
    //tournamentList comprise of tournamen belong and tournament listed in tournament search
    tournamentList: [{name: 'Warri Championship', duration:'Feb-3-2017 to Mar-4-2017', photo: 'warri_champ_photo.png'/*etc*/}, {name: 'Sapele Champs', duration:'Feb-3-2017 to Mar-4-2017', photo: 'sapele_champ_photo.png'/*etc*/}, {name: 'Delta Big League', duration:'Feb-3-2017 to Mar-4-2017', photo: 'delta_league_photo.png'/*etc*/}],
    tournamentCount: 200 // overall tournament count in the system (server)
};


Main.on("pagecreate", function (arg) {


    $('#game-select-chess').on('click', function () {

        Main.page.show({
            url: "game-home-md.html",
            effect: "fade",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "chess"
            }
        });

    });

    $('#game-select-draft').on('click', function () {
        Main.page.show({
            url: "game-home-md.html",
            effect: "fade",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "draft"
            }
        });
    });

    $('#game-select-ludo').on('click', function () {
        Main.page.show({
            url: "game-home-md.html",
            effect: "fade",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "ludo"
            }
        });
    });

    $('#game-select-solitaire').on('click', function () {
        Main.page.show({
            url: "game-home-md.html",
            effect: "fade",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "solitaire"
            }
        });
    });

    $('#game-select-whot').on('click', function () {
        Main.page.show({
            url: "game-home-md.html",
            effect: "fade",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "whot"
            }
        });
    });

});