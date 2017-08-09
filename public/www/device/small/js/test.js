/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Main.test ={
    simulateBackButtonListener : function(evt){
                
        if(evt.code === "Comma"){//backward
            Main.device.onBackButton();
        }
    }
};

Main.on("pagecreate", function (arg) {
    ///alert("pagecreate");
    //REMIND: To avoid memory leak use 'one' method instead of 'on' method 
    //for page navigation so as to avoid piling up the click event listeners
    //which lead to memory leak
    Main.device.isTesting = true; //TESTING!!!
    Main.device.isMobileDeviceReady = true; //TESTING!!!
    document.body.addEventListener('keypress', Main.test.simulateBackButtonListener)

    callCard();
    callCarda();
    callCardn();
    function callCard() {


        $('#btn-card0-next').on('click', function () {
            //alert('#btn-page1-next');

            Main.card.to({
                container: 'card-container',
                url: 'card_1.html',
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
                url: 'card_2.html',
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
                url: 'card_3.html',
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
                url: 'card_4.html',
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
                url: 'card_5.html',
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
                url: 'card_6.html',
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
                url: 'card_1a.html',
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
                url: 'card_2a.html',
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
                url: 'card_3a.html',
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
                url: 'card_4a.html',
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
                url: 'card_5a.html',
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
                url: 'card_6a.html',
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
                url: 'card_1n.html',
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
                url: 'card_2n.html',
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
                url: 'card_3n.html',
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
                url: 'card_4n.html',
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
                url: 'card_5n.html',
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
                url: 'card_6n.html',
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



        $('#test-card-page').on('click', function () {
            //alert('#btn-page1-next');

            Main.page.show({
                url: 'card_0.html',
                effect: "slideup",
                duration: 3000,
                data: {game: "testgame"}
            });
        });


        $('#test-card-page').on('click', function () {
            //alert('#btn-page1-next');

            Main.page.show({
                url: 'card_0.html',
                effect: "slideup",
                duration: 3000,
                data: {game: "testgame"}
            });
        });


    //-----------------------1-------------------------

    $('#btn-page1-next').on('click', function () {
        //alert('#btn-page1-next');

        Main.page.show({
            url: 'page_2.html',
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
            url: 'page_3.html',
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
            url: 'page_4.html',
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
            url: 'page_2.html',
            //effect: "slideleft",
            //duration: 3000,
            //data: {game: "testgame"}
        });
        /*Main.page.show(
         {
         url: "http://localhost:8383/Game9ja/page_1.html",
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
            url: 'page_6.html',
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
            url: 'page_7.html',
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



