/* global Main */

//REMIND : for small device the screen orientation will be locked to portrait but on medium and large no lock in neccesary

Main.on("pagecreate", function (arg) {

    $('#test-dialog').on('click', function () {
       
        Main.dialog.show({
           title:"This is title",
           iconCls:"fa fa-exclamation-circle",
           content:"This is title This is title This is title This is title", 
           fade: true,
           buttons:['Cancel','No','Yes'],
           action:function(btn, value){
               alert(btn);
               alert(value);
               this.hide();
           }, 
           onShow :function(){
               //alert('show');
           }
        });
        
        
        //Main.alert('this is a wonderful messag', 'The title', Main.const.INFO, 'Done' );
        
       
       /*Main.confirm(function(option){
           alert(option);
       }, 'this is a wonderful messag', 'The title',Main.const.YES_NO_CANCEL);
       */
    });
    
    $('#test-game-view').on('click', function () {

        Main.page.show({//TESTING!!!
            url: "game-view-sd.html",
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameView.Content,
            data: {
                game: "name of game e.g chess , draft etc",
                game_id: "3i393kj383k2c83j", //a unique id for this match
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
        //.Main.controller.auth = {}; //fake auth
        Main.controller.UserProfile.appUser = {//fake app user object
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
                game_id: "3i393kj383k2c83j", //a unique id for this match
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