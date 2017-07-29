

/* global Main */


Main.controller.GameViewB = {
    leftPanelTitleComp: null,

    afterLeftContentHide: function () {
        if (Main.controller.GameViewB.leftPanelTitleComp) {
            Main.controller.GameViewB.leftPanelTitleComp.innerHTML = '';
        }
    },
    showLeftContent: function (func) {
            var el = document.getElementById('game-view-b-right-content');

            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            func();
            Main.anim.to('game-view-b-right-content', 500, {right: '0%'});
    },
    hideLeftContent: function () {
        var el = document.getElementById('game-view-b-right-content');
        var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
        if (el.style.right === '0%') {
            el.style.display = 'block';//ensure visible        
            Main.anim.to('game-view-b-right-content', 500, {right: negative_width}, Main.controller.GameViewB.afterLeftContentHide);
        }
    },
    Content: function (data) {
        
        var panel_main = document.getElementById('game-view-b-main');
        var board_el = document.getElementById('game-view-b-main-board');
        var upper_el = document.getElementById('game-view-b-main-upper');
        var lower_el = document.getElementById('game-view-b-main-lower');

        Main.controller.GamePanel.ownGameViewB(data, panel_main, resizeMain);
        
        function resizeMain(board_size, upper_height, lower_height){
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';
        }


        $('#game-view-b-back-btn').on('click', function () {
            Main.page.back();
        });


    }

};