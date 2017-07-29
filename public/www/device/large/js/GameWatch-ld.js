

/* global Main */


Main.controller.GameWatch = {

    leftPanelTitleComp: null,
    
    afterLeftContentHide: function () {
        if (Main.controller.GameWatch.leftPanelTitleComp) {
            Main.controller.GameWatch.leftPanelTitleComp.innerHTML = '';
            Main.controller.GameWatch.isShowLeftPanel = false;
        }
    },
    showLeftContent: function (func) {
        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-watch-main');
            elm.style.width = '60%';
            var el = document.getElementById('game-watch-right-content');
            el.style.width = '40%';
            el.style.display = 'block';
            var dim = Main.controller.GamePanel.gameAreaDimension(elm);
            if (dim) {
                //setting the sizes of the panels
                Main.controller.GameWatch.resizeMain(dim.board_size, dim.upper_height, dim.lower_height);
            }

            func();
        } else {

            var elm = document.getElementById('game-watch-main');
            elm.style.width = '100%';
            
            var el = document.getElementById('game-watch-right-content');

            el.style.width = '65%';//we set this width programatically here
            el.style.right = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            func();
            Main.anim.to('game-watch-right-content', 500, {right: '0%'});
        }
        
        Main.controller.GameWatch.isShowLeftPanel = true;
    },
    hideLeftContent: function () {

        if (Main.device.isXLarge()) {
            var elm = document.getElementById('game-watch-main');
            elm.style.width = '100%';
            var el = document.getElementById('game-watch-right-content');
            el.style.display = 'none';
            Main.controller.GameWatch.afterLeftContentHide();
        } else {
            var el = document.getElementById('game-watch-right-content');
            var negative_width = '-65%';//set to negative of the width we have in css file or the width we set programatically here

            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game-watch-right-content', 500, {right: negative_width}, Main.controller.GameWatch.afterLeftContentHide);
            }
        }

    },
    resizeMain: function (board_size, upper_height, lower_height) {

        var board_el = document.getElementById('game-watch-main-board');
        var upper_el = document.getElementById('game-watch-main-upper');
        var lower_el = document.getElementById('game-watch-main-lower');

        board_el.style.width = board_size + 'px';
        board_el.style.height = board_size + 'px';

        upper_el.style.width = board_el.style.width;
        upper_el.style.height = upper_height + 'px';

        lower_el.style.width = board_el.style.width;
        lower_el.style.height = lower_height + 'px';

    },
    Content: function (data) {

        var panel_main = document.getElementById('game-watch-main');

        var rhs_el = document.getElementById('game-watch-right-content');
        var resizeMainFunc = Main.controller.GameWatch.resizeMain;
        Main.controller.GamePanel.watchGame(data, panel_main, resizeMainFunc, checkPanelSize);

        function checkPanelSize() {
            //right panel


            if (Main.device.isXLarge()) {

                this.element.style.width = '60%';
                this.element.style.height = '100%';
                rhs_el.style.width = '40%';
                rhs_el.style.right = '0%';//always visible
                rhs_el.style.display = 'block';//always visible
                
                if(Main.controller.GameWatch.isShowLeftPanel){
                    
                }
                
            } else {

                this.element.style.width = '100%';
                this.element.style.height = '100%';

                rhs_el.style.width = '65%';
                rhs_el.style.display = 'block';//always visible
                rhs_el.style.right = '-' + rhs_el.style.width;
                Main.controller.GameWatch.afterLeftContentHide();

            }
        }

    }

};
