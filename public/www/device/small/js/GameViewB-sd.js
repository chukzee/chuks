

/* global Main, Ns */


Ns.GameViewB = {
    rightPanelTitleComp: null,

    afterRightContentHide: function () {
        if (Ns.GameViewB.rightPanelTitleComp) {
            Ns.GameViewB.rightPanelTitleComp.innerHTML = '';
        }
    },
    showRightContent: function (data, title, func) {
        
            Ns.GameView.rightPanelTitleComp = document.getElementById("game-view-b-right-panel-header-title");
            Ns.GameView.rightPanelTitleComp.innerHTML = title;
            var el = document.getElementById('game-view-b-right-content');

            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            func();
            Main.anim.to('game-view-b-right-content', 500, {right: '0%'});
    },
    hideRightContent: function () {
        var el = document.getElementById('game-view-b-right-content');
        var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
        if (el.style.right === '0%') {
            el.style.display = 'block';//ensure visible        
            Main.anim.to('game-view-b-right-content', 500, {right: negative_width}, Ns.GameViewB.afterRightContentHide);
        }
    },
    Content: function (data) {
        
        Ns.ui.GamePanel.rightContentName = '';
        
        var panel_main = document.getElementById('game-view-b-main');
        var board_el = document.getElementById('game-view-b-main-board');
        var upper_el = document.getElementById('game-view-b-main-upper');
        var lower_el = document.getElementById('game-view-b-main-lower');

        Ns.ui.GamePanel.ownGameViewB(data, panel_main, resizeMain);
        
        function resizeMain(data, board_size, upper_height, lower_height){
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';
            
            Ns.ui.GamePanel.showGame(data, 'game-view-b-main-board');
        }


        $('#game-view-b-back-btn').on('click', function () {
            Main.page.back();
        });


    }

};