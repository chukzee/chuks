

/* global Main */


Ns.GameViewB = {
    leftPanelTitleComp: null,

    afterLeftContentHide: function () {
        if (Ns.GameViewB.leftPanelTitleComp) {
            Ns.GameViewB.leftPanelTitleComp.innerHTML = '';
        }
    },
    showLeftContent: function (func) {
        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-view-b-main');
            elm.style.width = '60%';
            var el = document.getElementById('game-view-b-right-content');
            el.style.width = '40%';
            el.style.display = 'block';
            var dim = Ns.ui.GamePanel.gameAreaDimension(elm);
            if (dim) {
                //setting the sizes of the panels
                Ns.GameViewB.resizeMain(dim.board_size, dim.upper_height, dim.lower_height);
            }

            func();
        } else {

            var el = document.getElementById('game-view-b-right-content');

            el.style.width = '65%';//we set this width programatically here
            el.style.right = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            func();
            Main.anim.to('game-view-b-right-content', 500, {right: '0%'});
        }
    },
    hideLeftContent: function () {
        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-view-b-main');
            elm.style.width = '100%';
            var el = document.getElementById('game-view-b-right-content');
            el.style.display = 'none';
            Ns.GameViewB.afterLeftContentHide();
        } else {
            var el = document.getElementById('game-view-b-right-content');
            var negative_width = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game-view-b-right-content', 500, {right: negative_width}, Ns.GameViewB.afterLeftContentHide);
            }
        }
    },
    resizeMain: function (board_size, upper_height, lower_height) {

        var board_el = document.getElementById('game-view-b-main-board');
        var upper_el = document.getElementById('game-view-b-main-upper');
        var lower_el = document.getElementById('game-view-b-main-lower');

        board_el.style.width = board_size + 'px';
        board_el.style.height = board_size + 'px';

        upper_el.style.width = board_el.style.width;
        upper_el.style.height = upper_height + 'px';

        lower_el.style.width = board_el.style.width;
        lower_el.style.height = lower_height + 'px';

    },
    Content: function (data) {

        var panel_main = document.getElementById('game-view-b-main');

        var rhs_el = document.getElementById('game-view-b-right-content');
        
        var resizeMainFunc = Ns.GameViewB.resizeMain;
        Ns.ui.GamePanel.ownGameViewB(data, panel_main, resizeMainFunc, checkPanelSize);

        function checkPanelSize() {
            //right panel

            if (Main.device.isXLarge()) {

                this.element.style.width = '60%';
                this.element.style.height = '100%';
                rhs_el.style.width = '40%';
                rhs_el.style.right = '0%';//always visible
                rhs_el.style.display = 'block';//always visible
            } else {

                this.element.style.width = '100%';
                this.element.style.height = '100%';

                rhs_el.style.width = '65%';
                rhs_el.style.display = 'block';//always visible
                rhs_el.style.right = '-' + rhs_el.style.width;
                Ns.GameViewB.afterLeftContentHide();
            }
        }

    }

};
