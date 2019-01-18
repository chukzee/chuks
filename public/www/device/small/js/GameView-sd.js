

/* global Main, Ns */


Ns.GameView = {
    rightPanelTitleComp: null,
    rightPanelHTML: null,

    afterRightContentHide: function () {
        if (Ns.GameView.rightPanelTitleComp) {
            Ns.GameView.rightPanelTitleComp.innerHTML = '';
            document.getElementById('game-view-right-content').outerHTML = Ns.GameView.rightPanelHTML;
            Ns.ui.GamePanel.rightContentName = '';
        }
    },

    showRightContent: function (data, title, func) {

        $('#game-view-right-panel-close').on('click', function () {
            Ns.GameView.hideRightContent();
        });
        
        Ns.GameView.rightPanelTitleComp = document.getElementById("game-view-right-panel-header-title");
        Ns.GameView.rightPanelTitleComp.innerHTML = title;
        var el = document.getElementById('game-view-right-content');

        el.style.width = '80%';//we set this width programatically here
        el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
        el.style.display = 'block';//make visible
        //animate the element to right of 0%
        func();
        Main.anim.to('game-view-right-content', 500, {right: '0%'});
    },
    hideRightContent: function () {
        var el = document.getElementById('game-view-right-content');
        var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
        if (el.style.right === '0%') {
            el.style.display = 'block';//ensure visible        
            Main.anim.to('game-view-right-content', 500, {right: negative_width}, Ns.GameView.afterRightContentHide);
        }
    },
    Content: function (data) {

        Ns.ui.GamePanel.rightContentName = '';

        Ns.GameView.rightPanelHTML = document.getElementById('game-view-right-content').outerHTML;

        var panel_main = document.getElementById('game-view-main');
        var board_el = document.getElementById('game-view-main-board');
        var upper_el = document.getElementById('game-view-main-upper');
        var lower_el = document.getElementById('game-view-main-lower');

        Ns.ui.GamePanel.ownGameView(data, panel_main, resizeMain);

        function resizeMain(data, board_size, upper_height, lower_height) {
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';

            Ns.ui.GamePanel.showGame(data, 'game-view-main-board');
        }


        $('#game-view-back-btn').on('click', function () {
            Main.page.back();
        });


    }

};