/* global Main, Ns */


Main.on("pagecreate", function (arg) {

    if (!arg.isIndexPage) {
        return;
    }

    //at this point it is the index page which is what we want.
    Main.device.styleDesktopScrollbar(arg.isIndexPage);

});

Ns.GameSelect = {

    constructor: function () {

        //disable context menu that disturb our custom longpress event
        window.oncontextmenu = function () {
            return false;
        };

        Ns.Auth.login();


        $('#game-select-chess').on('click', function () {

            Main.page.show({
                url: "game-home-ld.html",
                effect: "fade",
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'chess'
            });

        });

        $('#game-select-draughts').on('click', function () {
            Main.page.show({
                url: "game-home-ld.html",
                effect: "fade",
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'draughts'
            });
        });

        $('#game-select-ludo').on('click', function () {
            Main.page.show({
                url: "game-home-ld.html",
                effect: "fade",
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'ludo'
            });
        });

        $('#game-select-solitaire').on('click', function () {
            Main.page.show({
                url: "game-home-ld.html",
                effect: "fade",
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'solitaire'
            });
        });

        $('#game-select-whot').on('click', function () {
            Main.page.show({
                url: "game-home-ld.html",
                effect: "fade",
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'whot'
            });
        });

    }
};