/* global Main */

//REMIND : for small device the screen orientation will be locked to portrait but on medium and large no lock in neccesary

Main.on("pagecreate", function (arg) {
    if(!arg.isIndexPage){
        return;
    }
    //at this point it is the index page which is what we want.
    
    Ns.Auth.login();
    
    $('#game-select-chess').on('click', function () {

        Main.page.show({
            url: "game-home.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameHome.Content,
            data: 'chess'
        });

    });

    $('#game-select-draft').on('click', function () {
        Main.page.show({
            url: "game-home.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameHome.Content,
            data: 'draft'
        });
    });

    $('#game-select-ludo').on('click', function () {
        Main.page.show({
            url: "game-home.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameHome.Content,
            data: 'ludo'
        });
    });

    $('#game-select-solitaire').on('click', function () {
        Main.page.show({
            url: "game-home.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameHome.Content,
            data: 'solitaire'
        });
    });

    $('#game-select-whot').on('click', function () {
        Main.page.show({
            url: "game-home.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameHome.Content,
            data: 'whot'
        });
    });

});