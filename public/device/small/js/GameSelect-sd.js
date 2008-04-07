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

//REMIND : for small device the screen orientation will be locked to portrait but on medium and large no lock in neccesary

Main.on("pagecreate", function (arg) {

    $('#test-game-view').on('click', function () {


        Main.page.show({//TESTING!!!
            url: "game-view-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameView.Content,
            data: {
                game: "name of game e.g chess , draft etc",
                gameId: "3i393kj383k2c83j", //a unique id for this match
                white_id: "07038428492", //must be a phone number
                white_name: "Chuks Alimele",
                white_pic: "app/images/white_player.jpg",
                white_activity: "making move...",
                white_countdown: "3:21",
                white_wld: "W 2, L 3, D 5",
                black_id: "08024044943", //must be a phone number
                black_name: "Onome Okoro",
                black_pic: "app/images/black_player.jpg",
                black_activity: "thinking...",
                black_countdown: "5:42",
                black_wld: "W 3, L 2, D 5",
                game_score: "2 - 0",
                game_status: "Live",
                game_position: "The game position goes here",
                game_duration: "the game duration goes here"

            }
        });

    });


    $('#test-game-watch').on('click', function () {

        //fake login
        Main.controller.auth = {}; //fake auth
        Main.controller.auth.appUser = {//fake app user object
            id: "07038428492",
            fullName: "Chuks Alimele"
        };

        Main.page.show({//TESTING!!!
            url: "game-watch-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameWatch.Content,
            data: {
                game: "name of game e.g chess , draft etc",
                gameId: "3i393kj383k2c83j", //a unique id for this match
                white_id: "07038428492", //must be a phone number
                white_name: "Chuks Alimele",
                white_pic: "app/images/white_player.jpg",
                white_activity: "making moving...",
                white_countdown: "3:21",
                white_wld: "W 2, L 3, D 5",
                black_id: "08024044943", //must be a phone number
                black_name: "Onome Okoro",
                black_pic: "app/images/black_player.jpg",
                black_activity: "thinking...",
                black_countdown: "5:42",
                black_wld: "W 3, L 2, D 5",
                game_score: "2 - 0",
                game_status: "Live",
                game_position: "The game position goes here",
                game_duration: "the game duration goes here"

            }
        });

    });


    $('#test-busy-indicator').on('click', function () {
        Main.busy.show({
            el: document.body,
            defaultText: false,
            text: "Please waiting..."
        });


        window.setTimeout(function () {
            alert('hiding busy indicator');
            Main.busy.hide();
        }, 20000);
    });

    $('#test-fullscreen').on('click', function () {

        Main.fullscreen.show({
            html: '<div style="color: white;">This is full screen</div>',
            closeButton: true,
            effect: 'fade'
        });

        window.setTimeout(function () {
            alert('hiding fullscreen');
            Main.fullscreen.hide();
        }, 20000);

        Main.fullscreen.show({
            html: '<div style="color: white;">This is a second full screen</div>',
            closeButton: true,
            effect: 'fade'
        });

        Main.fullscreen.show({
            html: '<div style="color: white;">This is a third full screen</div>',
            closeButton: true,
            effect: 'slidein'
        });

    });

    $('#game-select-chess').on('click', function () {

        Main.page.show({
            url: "game-home-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "chess"
            }
        });

    });

    $('#game-select-draft').on('click', function () {
        Main.page.show({
            url: "game-home-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "draft"
            }
        });
    });

    $('#game-select-ludo').on('click', function () {
        Main.page.show({
            url: "game-home-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "ludo"
            }
        });
    });

    $('#game-select-solitaire').on('click', function () {
        Main.page.show({
            url: "game-home.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "solitaire"
            }
        });
    });

    $('#game-select-whot').on('click', function () {
        Main.page.show({
            url: "game-home-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameHome.Content,
            data: {
                game: "whot"
            }
        });
    });

});