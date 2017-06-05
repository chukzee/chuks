

var gameObj = {
    chat: 'game/Chat',
    comment: 'game/Comment'
            //more may go below
};


Main.rcall.live(gameObj);


Main.controller.GameWatch = {

    onBeforeShow: function (data) {

        initMain();
        //window.setTimeout(initMain, 1000);
                
        $('#game-watch-white-name').html(data.white_name);
        $('#game-watch-white-countdown').html(data.white_countdown);
        $('#game-watch-white-activity').html(data.white_activity);
        $('#game-watch-white-wld').html(data.white_wld);
        $('#game-watch-white-profile-pic').attr({src: data.white_pic});
        
        $('#game-watch-black-name').html(data.black_name);
        $('#game-watch-black-countdown').html(data.black_countdown);
        $('#game-watch-black-wld').html(data.black_wld);
        $('#game-watch-black-activity').html(data.black_activity);
        $('#game-watch-black-profile-pic').attr({src: data.black_pic});
        
        $('#game-watch-score').html(data.score);
        $('#game-watch-game-status').html(data.game_status);

        var lefPanelTitleComp = document.getElementById("game-watch-right-panel-header-title");
        var lefPanelBody = document.getElementById("game-watch-right-panel-body");

        var obj = {
            data: data,
            lefPanelTitleComp: lefPanelTitleComp,
            lefPanelBody: lefPanelBody
        };

        $('#game-watch-comment-icon').on('click', function () {
            var title = 'Comments';
            if(lefPanelTitleComp.innerHTML === title){
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            showLeftContent(comments.bind(obj));
        });

        $('#game-watch-right-panel-close').on('click', function () {
            hideLeftContent();
        });

        $('#game-watch-main').on('click', function () {
            hideLeftContent();
        });

        function doSizing(){
            var el = this.element;
            var size = el.clientWidth < el.clientHeight ? el.clientWidth: el.clientHeight;
            
            //since there is a possibility that the clientWidth or clientHeight 
            //might be zero we shall wait till the dimension of the element is
            //ready before trying again
            
            if(el.clientWidth === 0 || el.clientHeight === 0){
                if(this.elaspeTime >= 5000){
                    console.warn('Something is wrong with dom element - could not get size of element!');
                    return;
                }
                this.elaspeTime += this.interval;                
                window.setTimeout(this.sizingFn.bind(this), this.interval);//wait till the dimension is ready
                return;
            }
            
            //console.log('client height gotten after ', this.elaspeTime +' ms');
            
            var upper_height = 40;
            var lower_height = 40;
            var board_size;
            var board_el = document.getElementById('game-watch-main-board');
            var upper_el = document.getElementById('game-watch-main-upper');
            var lower_el = document.getElementById('game-watch-main-lower');
            
            if(size + upper_height + lower_height > el.clientHeight){
                 board_size = size - upper_height - lower_height;
                 if(el.clientHeight > size){
                    board_size = el.clientHeight - upper_height - lower_height;
                 }
            }else{
                board_size = size;
            }
            
            
            //setting the sizes of the panels
            
            board_el.style.width = board_size+'px';
            board_el.style.height = board_size+'px';
            
            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height+'px';
            
            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height+'px';
            
        };

        function sizingMain(evt){
            
            if(evt && evt.type === "orientationchange"){
                this.canChangeOrientation = true;
            }else if(evt && this.canChangeOrientation){
                window.removeEventListener('resize', this.funcListener, false);
                return;
            }
                        
            var el = document.getElementById('game-watch-main');
            var obj = {};
            obj.element = el;
            obj.elaspeTime = 0;
            obj.interval = 100;            
            obj.sizingFn = doSizing.bind(obj);
            
            obj.sizingFn();
        }

        function mainResizeListener(){
            if(!window.addEventListener || !window.removeEventListener){
                return;
            }
            
            var obj = {
               canChangeOrientation : false 
            };
            
            var sizingMainFn = sizingMain.bind(obj);
            
            obj.funcListener = sizingMainFn;
            
            window.removeEventListener('resize', sizingMainFn, false);
            window.addEventListener('resize', sizingMainFn, false);
            
            window.removeEventListener('orientationchange', sizingMainFn, false);
            window.addEventListener('orientationchange', sizingMainFn, false);
            
        }

        function initMain(){            
            mainResizeListener();
            sizingMain();            
        }

        function comments() {
            var data = this.data;
            //this.lefPanelBody - TODO

            Main.rcall.live(function () {

                Main.ro.comment.getHistory(data.gameId)
                        .get(function (res) {

                        })
                        .error(function (err) {

                        });
            });
        }


        function inputMsgHtml() {
            return '<div class="game9ja-message-input">'
                    + '<div>'
                    + '<div><i class="fa fa-smile-o"></i> </div>'
                    + '<div>'
                    + '<textarea placeholder="Write a message..."></textarea>'
                    + '</div>'
                    + '</div>'
                    + '<i class="fa fa-send"></i> '
                    + '</div>';
        }

        function div(content, clazz) {
            if (clazz) {
                return '<div class="' + clazz + '">' + content + '</div>';
            }
            return '<div>' + content + '</div>';
        }

        function showLeftContent(func) {
            var el = document.getElementById('game-watch-right-content');
            
            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            Main.anim.to('game-watch-right-content', 500, {right: '0%'}, func);
        }
        
        function afterLeftContentHide(){
            lefPanelTitleComp.innerHTML = '';
        }

        function hideLeftContent() {
            var el = document.getElementById('game-watch-right-content');            
            var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game-watch-right-content', 500, {right: negative_width}, afterLeftContentHide);
            }
        }

    },

};

Main.on("pageshow", function (arg) {



});