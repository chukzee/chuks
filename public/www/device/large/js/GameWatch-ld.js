

/* global Main, Ns */


Ns.GameWatch = {

    rightPanelTitleComp: null,

    afterRightContentHide: function () {
        if (Ns.GameWatch.rightPanelTitleComp) {
            Ns.GameWatch.rightPanelTitleComp.innerHTML = '';
            Ns.GameWatch.isShowRightPanel = false;
        }
    },
    showRightContent: function (data, title, func) {

        $('#game-watch-right-panel-close').on('click', function () {
            Ns.GameWatch.hideRightContent();
        });
        
        Main.card.back('game-view-right-panel-header');//clear any card on the header

        document.getElementById("game-view-right-panel-body").innerHTML = '';

        Ns.GameView.rightPanelTitleComp = document.getElementById("game-watch-right-panel-header-title");
        Ns.GameView.rightPanelTitleComp.innerHTML = title;
        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-watch-main');
            elm.style.width = '60%';
            var el = document.getElementById('game-watch-right-content');
            el.style.width = '40%';
            el.style.display = 'block';
            var dim = Ns.ui.GamePanel.gameAreaDimension(elm);
            if (dim) {
                //setting the sizes of the panels
                Ns.GameWatch.resizeMain(data, dim.board_size, dim.upper_height, dim.lower_height);
            }

            func();
        } else {

            var elm = document.getElementById('game-watch-main');
            elm.style.width = '100%';

            var el = document.getElementById('game-watch-right-content');
            var is_visible = $(el).is(':visible');

            el.style.display = 'block';//make visible

            func();

            if (!is_visible) {

                el.style.width = '65%';//we set this width programatically here
                el.style.right = '-65%';//set to negative of the width we have in css file or the width we set programatically here
                //animate the element to right of 0%
                Main.anim.to('game-watch-right-content', 500, {right: '0%'});
            }
        }

        Ns.GameWatch.isShowRightPanel = true;
    },
    hideRightContent: function () {

        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-watch-main');
            elm.style.width = '100%';
            var el = document.getElementById('game-watch-right-content');
            el.style.display = 'none';
            Ns.GameWatch.afterRightContentHide();
        } else {
            var el = document.getElementById('game-watch-right-content');
            var negative_width = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game-watch-right-content', 500, {right: negative_width}, Ns.GameWatch.afterRightContentHide);
            }
        }

    },
    resizeMain: function (data, board_size, upper_height, lower_height) {

        var board_el = document.getElementById('game-watch-main-board');
        var upper_el = document.getElementById('game-watch-main-upper');
        var lower_el = document.getElementById('game-watch-main-lower');

        board_el.style.width = board_size + 'px';
        board_el.style.height = board_size + 'px';

        upper_el.style.width = board_el.style.width;
        upper_el.style.height = upper_height + 'px';

        lower_el.style.width = board_el.style.width;
        lower_el.style.height = lower_height + 'px';

        var flip; //TODO
        Ns.ui.GamePanel.showGame(data, 'game-watch-main-board', flip);
    },
    Content: function (data) {

        Ns.ui.GamePanel.rightContentName = '';

        var panel_main = document.getElementById('game-watch-main');

        var rhs_el = document.getElementById('game-watch-right-content');
        var resizeMainFunc = Ns.GameWatch.resizeMain;
        Ns.ui.GamePanel.watchGame(data, panel_main, resizeMainFunc, checkPanelSize);

        function checkPanelSize() {
            //right panel


            if (Main.device.isXLarge()) {

                this.element.style.width = '60%';
                this.element.style.height = '100%';
                rhs_el.style.width = '40%';
                rhs_el.style.right = '0%';//always visible
                rhs_el.style.display = 'block';//always visible

                if (Ns.GameWatch.isShowRightPanel) {

                }

            } else {

                this.element.style.width = '100%';
                this.element.style.height = '100%';

                rhs_el.style.width = '65%';
                rhs_el.style.display = 'block';//always visible
                rhs_el.style.right = '-' + rhs_el.style.width;
                Ns.GameWatch.afterRightContentHide();

            }


        }

    }

};
