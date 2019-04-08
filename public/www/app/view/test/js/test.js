/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Main */

Main.test ={
    simulateBackButtonListener : function(evt){
                
        if(evt.code === "Comma"){//backward
            Main.device.onBackButton();
        }
    }
};

Main.on("pagecreate", function (arg) {
    
    $('#test-dialog').off('click');
    $('#test-dialog').on('click', function () {
       //Main.alert("This is title This is title This is title This is title", "This is title", Main.const.INFO);
        Main.dialog.show({
           title:"This is title",
           iconCls:"fa fa-exclamation-circle",
           content:"This is title This is title This is title This is title", 
           fade: true,
           buttons:['Cancel','No','Yes'],
           //modal:false,
           touchOutClose : true,
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
    
    $('#test-game-view').off('click');
    $('#test-game-view').on('click', function () {

        Main.page.show({//TESTING!!!
            url: "game-view-sd.html",
            effect: "slideleft",
            duration: 300,
            onBeforeShow: Ns.GameView.Content,
            data: {
                game: "name of game e.g chess , draughts etc",
                game_id: "3i393kj383k2c83j", //a unique id for this match
                white_id: "07038428492", //must be a phone number
                white_name: "Chuks Alimele",
                white_pic: "app/images/white_player.jpg",
                white_activity: "making move...",
                white_countdown: "3:21",
                white_wdl: "W 2, L 3, D 5",
                black_id: "08024044943", //must be a phone number
                black_name: "Onome Okoro",
                black_pic: "app/images/black_player.jpg",
                black_activity: "thinking...",
                black_countdown: "5:42",
                black_wdl: "W 3, L 2, D 5",
                game_score: "2 - 0",
                game_status: "Live",
                game_position: "The game position goes here",
                game_duration: "the game duration goes here"

            }
        });

    });


    $('#test-game-watch').off('click');
    $('#test-game-watch').on('click', function () {

        //fake login
        //Ns.Auth = {}; //fake auth
        Ns.view.UserProfile.appUser = {//fake app user object
            id: "07038428492",
            fullName: "Chuks Alimele"
        };

        Main.page.show({//TESTING!!!
            url: "game-watch-sd.html",
            effect: "slideleft",
            duration: 300,
            onBeforeShow: Ns.GameWatch.Content,
            data: {
                game: "name of game e.g chess , draughts etc",
                game_id: "3i393kj383k2c83j", //a unique id for this match
                white_id: "07038428492", //must be a phone number
                white_name: "Chuks Alimele",
                white_pic: "app/images/white_player.jpg",
                white_activity: "making moving...",
                white_countdown: "3:21",
                white_wdl: "W 2, L 3, D 5",
                black_id: "08024044943", //must be a phone number
                black_name: "Onome Okoro",
                black_pic: "app/images/black_player.jpg",
                black_activity: "thinking...",
                black_countdown: "5:42",
                black_wdl: "W 3, L 2, D 5",
                game_score: "2 - 0",
                game_status: "Live",
                game_position: "The game position goes here",
                game_duration: "the game duration goes here"

            }
        });

    });


    $('#test-busy-indicator').off('click');
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

    
    $('#test-fullscreen').off('click');
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

    ///alert("pagecreate");
    //REMIND: To avoid memory leak use 'one' method instead of 'on' method 
    //for page navigation so as to avoid piling up the click event listeners
    //which lead to memory leak
    
    Main.device.isTesting = true; //TESTING!!!
    Main.device.isMobileDeviceReady = !Main.device.isDesktop; //TESTING!!!
    
    console.log('Test line to be removed - Main.device.isMobileDeviceReady = !Main.device.isDesktop;');
    
    document.body.addEventListener('keypress', Main.test.simulateBackButtonListener);

    callCard();
    callCarda();
    callCardn();
    function callCard() {


        $('#btn-card0-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'test/card_1.html',
                fade: true,
                onShow: callCard
            });
        });

        $('#btn-card0-back').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 1 ---> card 0');
            });
        });


        $('#btn-card1-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'test/card_2.html',
                fade: true,
                onShow: callCard
            });
        });

        $('#btn-card1-back').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 2 ---> card 1');
            });
        });



        $('#btn-card2-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'test/card_3.html',
                fade: true,
                onShow: callCard
            });
        });

        $('#btn-card2-back').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 3 ---> card 2');
            });
        });



        $('#btn-card3-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'test/card_4.html',
                fade: true,
                onShow: callCard
            });
        });

        $('#btn-card3-back').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 4 ---> card 3');
            });
        });



        $('#btn-card4-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'test/card_5.html',
                fade: true,
                onShow: callCard
            });
        });

        $('#btn-card4-back').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 5 ---> card 4');
            });
        });



        $('#btn-card5-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'test/card_6.html',
                fade: true,
                onShow: callCard
            });
        });

        $('#btn-card5-back').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 6 ---> card 5');
            });
        });

    }


    function callCarda() {


        $('#btn-card0-next-a').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-a',
                url: 'test/card_1a.html',
                fade: true,
                onShow: callCarda
            });
        });

        $('#btn-card0-back-a').on('click', function () {

            Main.card.back('card-container', function () {
                console.log('card 1a ---> card 0a');
            });
        });


        $('#btn-card1-next-a').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-a',
                url: 'test/card_2a.html',
                fade: true,
                onShow: callCarda
            });
        });

        $('#btn-card1-back-a').on('click', function () {

            Main.card.back('card-container-a', function () {
                console.log('card 2a ---> card 1a');
            });
        });



        $('#btn-card2-next-a').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-a',
                url: 'test/card_3a.html',
                fade: true,
                onShow: callCarda
            });
        });

        $('#btn-card2-back-a').on('click', function () {

            Main.card.back('card-container-a', function () {
                console.log('card 3a ---> card 2a');
            });
        });



        $('#btn-card3-next-a').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-a',
                url: 'test/card_4a.html',
                fade: true,
                onShow: callCarda
            });
        });

        $('#btn-card3-back-a').on('click', function () {

            Main.card.back('card-container-a', function () {
                console.log('card 4a ---> card 3a');
            });
        });



        $('#btn-card4-next-a').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-a',
                url: 'test/card_5a.html',
                fade: true,
                onShow: callCarda
            });
        });

        $('#btn-card4-back-a').on('click', function () {

            Main.card.back('card-container-a', function () {
                console.log('card 5a ---> card 4a');
            });
        });



        $('#btn-card5-next-a').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-a',
                url: 'test/card_6a.html',
                fade: true,
                onShow: callCarda
            });
        });

        $('#btn-card5-back-a').on('click', function () {

            Main.card.back('card-container-a', function () {
                console.log('card 6a ---> card 5a');
            });
        });

    }


    function callCardn() {


        $('#btn-card0-next-n').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-n',
                url: 'test/card_1n.html',
                fade: true,
                onShow: callCardn
            });
        });

        $('#btn-card0-back-n').on('click', function () {

            Main.card.back('card-container-n', function () {
                console.log('card 1n ---> card 0n');
            });
        });


        $('#btn-card1-next-n').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-n',
                url: 'test/card_2n.html',
                fade: true,
                onShow: callCardn
            });
        });

        $('#btn-card1-back-n').on('click', function () {

            Main.card.back('card-container-n', function () {
                console.log('card 2n ---> card 1n');
            });
        });



        $('#btn-card2-next-n').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-n',
                url: 'test/card_3n.html',
                fade: true,
                onShow: callCardn
            });
        });

        $('#btn-card2-back-n').on('click', function () {

            Main.card.back('card-container-n', function () {
                console.log('card 3n ---> card 2n');
            });
        });



        $('#btn-card3-next-n').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-n',
                url: 'test/card_4n.html',
                fade: true,
                onShow: callCardn
            });
        });

        $('#btn-card3-back-n').on('click', function () {

            Main.card.back('card-container-n', function () {
                console.log('card 4n ---> card 3n');
            });
        });



        $('#btn-card4-next-n').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-n',
                url: 'test/card_5n.html',
                fade: true,
                onShow: callCardn
            });
        });

        $('#btn-card4-back-n').on('click', function () {

            Main.card.back('card-container-n', function () {
                console.log('card 5n ---> card 4n');
            });
        });



        $('#btn-card5-next-n').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container-n',
                url: 'test/card_6n.html',
                fade: true,
                onShow: callCardn
            });
        });

        $('#btn-card5-back-n').on('click', function () {

            Main.card.back('card-container-n', function () {
                console.log('card 6n ---> card 5n');
            });
        });

    }



        $('#test-swipe-page').on('click', function () {
            //alert('#btn-page1-next');

            Main.page.show({
                url: 'test/test-swipe.html',
                effect: "slideleft",
                duration: 3000,
                data: {game: "testgame"}
            });
        });

        $('#test-card-page').on('click', function () {
            //alert('#btn-page1-next');

            Main.page.show({
                url: 'test/card_0.html',
                effect: "slideup",
                duration: 3000,
                data: {game: "testgame"}
            });
        });


        $('#test-card-page').on('click', function () {
            //alert('#btn-page1-next');

            Main.page.show({
                url: 'test/card_0.html',
                effect: "slideup",
                duration: 3000,
                data: {game: "testgame"}
            });
        });


    //-----------------------1-------------------------

    $('#btn-page1-next').on('click', function () {
        //alert('#btn-page1-next');

        Main.page.show({
            url: 'test/page_2.html',
            effect: "slideup",
            duration: 3000,
            data: {game: "testgame"}
        });
    });

    $('#btn-page1-back').on('click', function () {
        //alert('#btn-page2-back');
        Main.page.back();
        console.log('#btn-page1-back', 'arg.data', arg.data);
    });

    //-----------------------2-------------------------

    $('#btn-page2-next').on('click', function () {
        //alert('#btn-page2-next');
        Main.page.show({
            url: 'test/page_3.html',
            //effect: "slideleft",
            //duration: 3000,
            //data: {game: "testgame"}
        });

        console.log('#btn-page2-next', 'arg.data', arg.data);
    });

    $('#btn-page2-back').on('click', function () {
        //alert('#btn-page2-back');
        Main.page.back();
        console.log('#btn-page2-back', 'arg.data', arg.data);
    });

    //-------------------------3-----------------------

    $('#btn-page3-next').on('click', function () {
        alert('#btn-page3-next');
        Main.page.show({
            url: 'test/page_4.html',
            //effect: "slideleft",
            //duration: 3000,
            //data: {game: "testgame"}
        });
        console.log('#btn-page3-next', 'arg.data', arg.data);
    });

    $('#btn-page3-back').on('click', function () {
        alert('#btn-page3-back');
        Main.page.back();
        console.log('#btn-page3-back', 'arg.data', arg.data);
    });

    //------------------------4------------------------

    $('#btn-page4-next').on('click', function () {
        alert('#btn-page4-next');
        Main.page.show({
            url: 'test/page_2.html',
            //effect: "slideleft",
            //duration: 3000,
            //data: {game: "testgame"}
        });
        /*Main.page.show(
         {
         url: "http://localhost:8383/Game9ja/test/page_1.html",
         effect: "slideleft",
         duration: 3000,
         data: {game: "testgame"}
         });*/
    });

    $('#btn-page4-back').on('click', function () {
        alert('#btn-page4-back');
        Main.page.back();
    });


    //------------------------5------------------------

    $('#btn-page5-next').on('click', function () {
        alert('#btn-page5-next');
        Main.page.show({
            url: 'test/page_6.html',
            //effect: "slideleft",
            //duration: 3000,
            //data: {game: "testgame"}
        });
    });

    $('#btn-page5-back').on('click', function () {
        alert('#btn-page5-back');
        Main.page.back();
    });



    //------------------------6------------------------

    $('#btn-page6-next').on('click', function () {
        alert('#btn-page6-next');
        Main.page.show({
            url: 'test/page_7.html',
            //effect: "slideleft",
            //duration: 3000,
            //data: {game: "testgame"}
        });
    });

    $('#btn-page6-back').on('click', function () {
        alert('#btn-page6-back');
        Main.page.back();
    });
});



