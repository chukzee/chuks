

/* global Main */


Main.controller.GameView = {
    lefPanelTitleComp: null,

    afterLeftContentHide: function () {
        if (Main.controller.GameView.lefPanelTitleComp) {
            Main.controller.GameView.lefPanelTitleComp.innerHTML = '';
        }
    },
    showLeftContent: function (func) {
        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-view-main');
            elm.style.width = '60%';
            var el = document.getElementById('game-view-right-content');
            el.style.width = '40%';
            el.style.display = 'block';
            func();
        } else {

            var el = document.getElementById('game-view-right-content');

            el.style.width = '65%';//we set this width programatically here
            el.style.right = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            func();
            Main.anim.to('game-view-right-content', 500, {right: '0%'});
        }
    },
    hideLeftContent: function () {
        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-view-main');
            elm.style.width = '100%';
            var el = document.getElementById('game-view-right-content');
            el.style.display = 'none';
            Main.controller.GameView.afterLeftContentHide();
        } else {
            var el = document.getElementById('game-view-right-content');
            var negative_width = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game-view-right-content', 500, {right: negative_width}, Main.controller.GameView.afterLeftContentHide);
            }
        }
    },
    Content: function (data) {

        var board_el = document.getElementById('game-view-main-board');
        var upper_el = document.getElementById('game-view-main-upper');
        var lower_el = document.getElementById('game-view-main-lower');

        Main.controller.GamePanel.ownGameView(data, 'game-view-main', resizeMain, checkPanelSize);

        function resizeMain(board_size, upper_height, lower_height) {
            board_el.style.width = board_size + 'px';
            board_el.style.height = board_size + 'px';

            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height + 'px';

            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height + 'px';

        }

        function checkPanelSize() {
            //right panel
            var el = document.getElementById('game-view-right-content');

            if (Main.device.isXLarge()) {

                this.element.style.width = '60%';
                this.element.style.height = '100%';
                el.style.width = '40%';
                el.style.right = '0%';//always visible
                el.style.display = 'block';//always visible
            } else {

                this.element.style.width = '100%';
                this.element.style.height = '100%';

                el.style.width = '65%';
                el.style.display = 'block';//always visible
                el.style.right = '-' + el.style.width;
                Main.controller.GameView.afterLeftContentHide();
            }
        }

    }

};
