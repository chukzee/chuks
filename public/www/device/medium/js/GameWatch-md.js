

/* global Main */

Ns.GameWatch = {

    LANDSCAPE_RHS_PANEL_WIDTH: '65%',
    PORTRAIT_RHS_PANEL_WIDTH: '75%',
    leftPanelTitleComp: null,

    afterLeftContentHide: function () {
        if (Ns.GameWatch.leftPanelTitleComp) {
            Ns.GameWatch.leftPanelTitleComp.innerHTML = '';
        }
    },
    showLeftContent: function (func) {
        var el = document.getElementById('game-watch-right-content');

        el.style.width = Ns.GameWatch.LANDSCAPE_RHS_PANEL_WIDTH;//we set this width programatically here
        el.style.right = "-" + Ns.GameWatch.LANDSCAPE_RHS_PANEL_WIDTH;//set to negative of the width we have in css file or the width we set programatically here

        if (window.screen.height > window.screen.width) {//portrait
            el.style.width = Ns.GameWatch.PORTRAIT_RHS_PANEL_WIDTH;//we set this width programatically here
            el.style.right = "-" + Ns.GameWatch.PORTRAIT_RHS_PANEL_WIDTH;//set to negative of the width we have in css file or the width we set programatically here
        }

        el.style.display = 'block';//make visible
        //animate the element to right of 0%
        func();
        Main.anim.to('game-watch-right-content', 500, {right: '0%'});
    },
    hideLeftContent: function () {

        var el = document.getElementById('game-watch-right-content');
        var negative_width = "-100%";//yes must be -100%

        if (el.style.right === '0%') {
            el.style.display = 'block';//ensure visible        
            Main.anim.to('game-watch-right-content', 500, {right: negative_width}, Ns.GameWatch.afterLeftContentHide);
        }
    },
    Content: function (data) {

        var panel_main = document.getElementById('game-watch-main');
        var board_el = document.getElementById('game-watch-main-board');
        var upper_el = document.getElementById('game-watch-main-upper');
        var lower_el = document.getElementById('game-watch-main-lower');

        Ns.ui.GamePanel.watchGame(data, panel_main, resizeMain);
        
        function resizeMain(board_size, upper_height, lower_height){
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = '100%';//board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = '100%';//board_el.style.width;
            lower_el.style.height = lower_height + 'px';

            //right panel
            var el = document.getElementById('game-watch-right-content');

            if (window.screen.width > window.screen.height) {
                el.style.width = Ns.GameWatch.LANDSCAPE_RHS_PANEL_WIDTH;
            } else {
                el.style.width = Ns.GameWatch.PORTRAIT_RHS_PANEL_WIDTH;
            }
            
        }
        
  
        $('#game-watch-back-btn').on('click', function () {
            Ns.GameHome.home();
        });

    }

};
