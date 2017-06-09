

var gameObj = {
    chat: 'game/Chat',
    comment: 'game/Comment'
            //more may go below
};


Main.rcall.live(gameObj);


Main.controller.GameView = {

    onBeforeShow: function (data) {

        initMain();

        $('#game-view-white-name').html(data.white_name);
        $('#game-view-white-pic').attr({src: data.white_pic});
        $('#game-view-black-name').html(data.black_name);
        $('#game-view-black-pic').attr({src: data.black_pic});
        $('#game-view-score').html(data.score);
        $('#game-view-game-status').html(data.game_status);
        
        
        Main.menu.create({
            width: 150,
            target: "#game-view-menu",
            items: [
                'Draw offer',
                'Active rules',
                'Rules',
                'Theme',
                'Sound',
                'Leave',
                'Help'
            ],
            onSelect: function (evt) {
                var item = this.item;
                
                //finally hide the menu
                this.hide();
            }
        });
        
        
        if (Main.controller.auth.appUser.id === data.white_id) {
            
            $('#game-view-user-wld').html(data.white_wld);
            $('#game-view-user-countdown').html(data.white_countdown);//may not be necessary - will be done locally
            
            $('#game-view-opponent-countdown').html(data.black_countdown);
            $('#game-view-opponent-activity').html(data.black_activity);
            $('#game-view-opponent-wld').html(data.black_wld);
            
        } else if (Main.controller.auth.appUser.id === data.black_id) {
            
            $('#game-view-user-wld').html(data.black_wld);
            $('#game-view-user-countdown').html(data.black_countdown);//may not be necessary - will be done locally
            
            $('#game-view-opponent-countdown').html(data.white_countdown);
            $('#game-view-opponent-activity').html(data.white_activity);
            $('#game-view-opponent-wld').html(data.white_wld);
            
        }

        var lefPanelTitleComp = document.getElementById("game-view-right-panel-header-title");
        var lefPanelBody = document.getElementById("game-view-right-panel-body");

        var obj = {
            data: data,
            lefPanelTitleComp: lefPanelTitleComp,
            lefPanelBody: lefPanelBody
        };
        
        $('#game-view-footer-chat').on('click', function () {
            var title = 'Chat';
            if(lefPanelTitleComp.innerHTML === title){
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            showLeftContent(chatMessages.bind(obj));
        });

        $('#game-view-footer-comments').on('click', function () {
            var title = 'Comments';
            if(lefPanelTitleComp.innerHTML === title){
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            showLeftContent(comments.bind(obj));
        });

        $('#game-view-footer-voice-call').on('click', function () {
            var title = 'Voice Call';
            if(lefPanelTitleComp.innerHTML === title){
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            showLeftContent(voiceCall.bind(obj));
        });

        $('#game-view-footer-video-call').on('click', function () {
            var title = 'Video Call';
            if(lefPanelTitleComp.innerHTML === title){
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            showLeftContent(videoCall.bind(obj));
        });

        $('#game-view-footer-stats').on('click', function () {
            var title = 'Stats';
            if(lefPanelTitleComp.innerHTML === title){
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            showLeftContent(Stats.bind(obj));
        });

        $('#game-view-right-panel-close').on('click', function () {
            hideLeftContent();
        });

        $('#game-view-main').on('click', function () {
            hideLeftContent();
        });

        function doSizing(){
            var el = this.element;
            var bound = el.getBoundingClientRect();
            var cmpHeight , cmpWidth;
            if('clientHeight' in el){
                cmpHeight = el.clientHeight;
                cmpWidth = el.clientWidth;
            }else{                
                cmpHeight = bound.height;
                cmpWidth = bound.width;
            }
            
            var size = cmpWidth < cmpHeight ? cmpWidth: cmpHeight;
            
            //since there is a possibility that the clientWidth or clientHeight 
            //might be zero we shall wait till the dimension of the element is
            //ready before trying again
            
            if(cmpWidth === 0 || cmpHeight === 0){
                if(this.elaspeTime >= 5000){
                    console.warn('Something is wrong with dom element - could not get size of element!');
                    return;
                }
                this.elaspeTime += this.interval;                
                window.setTimeout(this.sizingFn.bind(this), this.interval);//wait till the dimension is ready
                return;
            }
            
            console.log('client height gotten after ', this.elaspeTime +' ms');
            
            var upper_height = 40;
            var lower_height = 40;
            var board_size;
            var board_el = document.getElementById('game-view-main-board');
            var upper_el = document.getElementById('game-view-main-upper');
            var lower_el = document.getElementById('game-view-main-lower');
            
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
                        
            var el = document.getElementById('game-view-main');
            var obj = {};
            obj.element = el;
            obj.elaspeTime = 0;
            obj.interval = 100;            
            obj.sizingFn = doSizing.bind(obj);
            
            obj.sizingFn();
        }

        function mainResizeListener() {
            if (!window.addEventListener || !window.removeEventListener) {
                return;
            }

            var obj = {
                canChangeOrientation: false
            };

            var sizingMainFn = sizingMain.bind(obj);

            obj.funcListener = sizingMainFn;

            window.removeEventListener('resize', sizingMainFn, false);
            window.addEventListener('resize', sizingMainFn, false);

            window.removeEventListener('orientationchange', sizingMainFn, false);
            window.addEventListener('orientationchange', sizingMainFn, false);

        }

        function initMain() {
            mainResizeListener();
            sizingMain();
        }

        function chatMessages() {
            var data = this.data;
            var me = this;
            //TODO: show loading indicator

            Main.rcall.live(function () {

                Main.ro.chat.getHistory(data.gameId)
                        .get(function (res) {
                            //TODO: hide loading indicator

                            //me.lefPanelBody.innerHTML = '<div class="game9ja-chat-body"></div>';
                            var contentHtml = '';
                            for (var i = 0; i < res.length; i++) {
                                if (res[i].white_id === data.white_id ||
                                        res[i].black_id === data.black_id) {
                                    //own messaage

                                    var time_html = div(res[i].time);
                                    var msg_html = div(res[i].msg);
                                    var status_html = '<img src="the status file"/>';//TODO- USE src image file
                                    contentHtml += div(msg_html + time_html + status_html, "game9ja-chat-sent");
                                } else {
                                    //a reply

                                    var time_html = div(res[i].time);
                                    var msg_html = div(res[i].msg);
                                    contentHtml += div(msg_html + time_html, "game9ja-chat-received");

                                }
                            }

                            var innerCont = div(contentHtml, "game9ja-chat-body")
                                    + inputMsgHtml();

                            me.lefPanelBody.innerHTML = div(innerCont, "game9ja-chat");

                        })
                        .error(function (err) {
                            //TODO: hide loading indicator
                        });
            });


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

        function voiceCall() {
            var data = this.data;

            //
        }

        function videoCall() {
            var data = this.data;

            //
        }

        function Stats() {
            var data = this.data;

            //
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
            var el = document.getElementById('game-view-right-content');
            
            el.style.width = '80%';//we set this width programatically here
            el.style.right = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            Main.anim.to('game-view-right-content', 500, {right: '0%'}, func);
        }
        
        function afterLeftContentHide(){
            lefPanelTitleComp.innerHTML = '';
        }

        function hideLeftContent() {
            var el = document.getElementById('game-view-right-content');
            var negative_width = "-80%";//set to negative of the width we have in css file or the width we set programatically here
            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game-view-right-content', 500, {right: negative_width}, afterLeftContentHide);
            }
        }

    },

};

Main.on("pageshow", function (arg) {



});