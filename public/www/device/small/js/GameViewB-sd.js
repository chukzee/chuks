

/* global Main, Ns */


Ns.GameViewB = {
    rightPanelTitleComp: null,
    rightPanelHTML: null,

    afterRightContentHide: function () {
        if (Ns.GameViewB.rightPanelTitleComp) {
            Ns.GameViewB.rightPanelTitleComp.innerHTML = '';
            document.getElementById('game-view-right-b-content').outerHTML = Ns.GameViewB.rightPanelHTML;
            Ns.ui.GamePanel.rightContentName = '';
        }
    },
    showRightContent: function (data, title, func) {

        $('#game-view-b-right-panel-close').on('click', function () {
            Ns.GameViewB.hideRightContent();
        });

        Main.card.back('game-view-b-right-panel-header');//clear any card on the header

        document.getElementById("game-view-b-right-panel-body").innerHTML = '';

        Ns.GameViewB.rightPanelTitleComp = document.getElementById("game-view-b-right-panel-header-title");
        Ns.GameViewB.rightPanelTitleComp.innerHTML = title;
        var el = document.getElementById('game-view-b-right-content');
        var is_visible = $(el).is(':visible');

        el.style.display = 'block';//make visible

        func();
        if (!is_visible) {
            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            //animate the element to right of 0%
            Main.anim.to('game-view-b-right-content', 500, {right: '0%'});
        }
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
        
        Ns.GameViewB.rightPanelHTML = document.getElementById('game-view-b-right-content').outerHTML;

        var panel_main = document.getElementById('game-view-b-main');
        var board_el = document.getElementById('game-view-b-main-board');
        var upper_el = document.getElementById('game-view-b-main-upper');
        var lower_el = document.getElementById('game-view-b-main-lower');

        Ns.ui.GamePanel.ownGameViewB(data, panel_main, resizeMain);

        function resizeMain(data, board_size, upper_height, lower_height) {
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';

            Ns.ui.GamePanel.showGameB(data, 'game-view-b-main-board');
        }


        $('#game-view-b-back-btn').on('click', function () {
            Main.page.back();
        });


    }

};