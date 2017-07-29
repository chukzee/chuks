

/* global Main */


Main.controller.GameView = {
    leftPanelTitleComp: null,

    afterLeftContentHide: function () {
        if (Main.controller.GameView.leftPanelTitleComp) {
            Main.controller.GameView.leftPanelTitleComp.innerHTML = '';
        }
    },
    showLeftContent: function (func) {
            var el = document.getElementById('game-view-right-content');

            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            func();
            Main.anim.to('game-view-right-content', 500, {right: '0%'});
    },
    hideLeftContent: function () {
        var el = document.getElementById('game-view-right-content');
        var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
        if (el.style.right === '0%') {
            el.style.display = 'block';//ensure visible        
            Main.anim.to('game-view-right-content', 500, {right: negative_width}, Main.controller.GameView.afterLeftContentHide);
        }
    },
    Content: function (data) {
        
        var panel_main = document.getElementById('game-view-main');
        var board_el = document.getElementById('game-view-main-board');
        var upper_el = document.getElementById('game-view-main-upper');
        var lower_el = document.getElementById('game-view-main-lower');

        Main.controller.GamePanel.ownGameView(data, panel_main, resizeMain);
        
        function resizeMain(board_size, upper_height, lower_height){
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';
        }


        $('#game-view-back-btn').on('click', function () {
            Main.page.back();
        });


    }

};