/* global Main, Ns */

//REMIND : for small device the screen orientation will be locked to portrait but on medium and large no lock in neccesary

Main.on("pagecreate", function (arg) {
    if (!arg.isIndexPage) {
        return;
    }
});

Ns.GameSelect = {

    constructor: function () {
        //at this point it is the index page which is what we want.

        //disable context menu that disturb our custom longpress event
        window.oncontextmenu = function () {
            return false;
        };

        Ns.Auth.login();

        $('#game-select-chess').on('click', function () {

            Main.page.show({
                url: "game-home.html",
                effect: "fade", //we will now use fade since slide effect has performace issue for large page content
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'chess'
            });

        });

        $('#game-select-draughts').on('click', function () {
            Main.page.show({
                url: "game-home.html",
                effect: "fade", //we will now use fade since slide effect has performace issue for large page content
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'draughts'
            });
        });

        $('#game-select-ludo').on('click', function () {
            Main.page.show({
                url: "game-home.html",
                effect: "fade", //we will now use fade since slide effect has performace issue for large page content
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'ludo'
            });
        });

        $('#game-select-solitaire').on('click', function () {
            Main.page.show({
                url: "game-home.html",
                effect: "fade", //we will now use fade since slide effect has performace issue for large page content
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'solitaire'
            });
        });

        $('#game-select-whot').on('click', function () {
            Main.page.show({
                url: "game-home.html",
                effect: "fade", //we will now use fade since slide effect has performace issue for large page content
                duration: 300,
                onBeforeShow: Ns.GameHome.Content,
                data: 'whot'
            });
        });

    }
};
