

/* global Main, Ns */


Ns.GameWatch = {

    rightPanelTitleComp: null,
    rightPanelHTML: null,

    afterRightContentHide: function () {
        if (Ns.GameWatch.rightPanelTitleComp) {
            Ns.GameWatch.rightPanelTitleComp.innerHTML = '';
            document.getElementById('game-watch-right-content').outerHTML = Ns.GameWatch.rightPanelHTML;
            Ns.ui.GamePanel.rightContentName = '';
        }
    },
    showRightContent: function (data, title, func) {

        $('#game-watch-right-panel-close').on('click', function () {
            Ns.GameWatch.hideRightContent();
        });

        Main.card.back('game-watch-right-panel-header');//clear any card on the header

        document.getElementById("game-watch-right-panel-body").innerHTML = '';

        Ns.GameWatch.rightPanelTitleComp = document.getElementById("game-watch-right-panel-header-title");
        Ns.GameWatch.rightPanelTitleComp.innerHTML = title;
        var el = document.getElementById('game-watch-right-content');
        var is_visible = $(el).is(':visible');

        el.style.display = 'block';//make visible

        func();

        if (!is_visible) {
            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            //animate the element to right of 0%
            Main.anim.to('game-watch-right-content', 500, {right: '0%'});
        }
    },
    hideRightContent: function () {
        var el = document.getElementById('game-watch-right-content');
        var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
        if (el.style.right === '0%') {
            el.style.display = 'block';//ensure visible        
            Main.anim.to('game-watch-right-content', 500, {right: negative_width}, Ns.GameWatch.afterRightContentHide);
        }
    },
    Content: function (data) {

        Ns.ui.GamePanel.rightContentName = '';
        
        Ns.GameWatch.rightPanelHTML = document.getElementById('game-watch-right-content').outerHTML;

        var panel_main = document.getElementById('game-watch-main');
        var board_el = document.getElementById('game-watch-main-board');
        var upper_el = document.getElementById('game-watch-main-upper');
        var lower_el = document.getElementById('game-watch-main-lower');

        Ns.ui.GamePanel.watchGame(data, panel_main, resizeMain);

        function resizeMain(data, board_size, upper_height, lower_height) {
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';


            var flip; //TODO

            Ns.ui.GamePanel.showGame(data, 'game-watch-main-board', flip);
        }


        $('#game-watch-back-btn').on('click', function () {
            Main.page.back();
        });

    }

};
