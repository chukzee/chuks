/* global Main */


Main.on("pagecreate", function (arg) {


    $('#game-select-chess').on('click', function () {

        Main.page.show({
            url: "game-home-md.html",
            effect: "fade",
            duration: 500,
            onBeforeShow: Ns.GameHome.Content,
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
            onBeforeShow: Ns.GameHome.Content,
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
            onBeforeShow: Ns.GameHome.Content,
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
            onBeforeShow: Ns.GameHome.Content,
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
            onBeforeShow: Ns.GameHome.Content,
            data: {
                game: "whot"
            }
        });
    });

});