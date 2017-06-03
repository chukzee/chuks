/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Main.on("pagecreate", function (arg) {
    ///alert("pagecreate");
    //REMIND: To avoid memory leak use 'one' method instead of 'on' method 
    //for page navigation so as to avoid piling up the click event listeners
    //which lead to memory leak
    
    
    $('#btn-page0-next').on('click', function () {
        //alert('#btn-page1-next');
        
        Main.page.show({
            url: 'page_1.html',
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
        console.log('#btn-page1-back','arg.data', arg.data);
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
        
        console.log('#btn-page2-next','arg.data', arg.data);
    });
    
    $('#btn-page2-back').on('click', function () {
        //alert('#btn-page2-back');
        Main.page.back();
        console.log('#btn-page2-back','arg.data', arg.data);
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
        console.log('#btn-page3-next','arg.data', arg.data);
    });
    
    $('#btn-page3-back').on('click', function () {
        alert('#btn-page3-back');
        Main.page.back();
        console.log('#btn-page3-back','arg.data', arg.data);
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



