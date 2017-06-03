

var gameObj = {
    chat: 'game/Chat',
    comment: 'game/Comment'
            //more may go below
};


Main.rcall.live(gameObj);


Main.controller.GameView = {

    onBeforeShow: function (data) {

        initMain();//
        
        $('#game9ja-game-view-white-player-name').html(data.white_player_name);
        $('#game9ja-game-view-white-player-pic').attr({src: data.white_player_pic});
        $('#game9ja-game-view-black-player-name').html(data.black_player_name);
        $('#game9ja-game-view-black-player-pic').attr({src: data.black_player_pic});
        $('#game9ja-game-view-score').html(data.score);
        $('#game9ja-game-view-game-status').html(data.game_status);

        var lefPanelTitleComp = document.getElementById("game9ja-game-view-left-panel-header-title");
        var lefPanelBody = document.getElementById("game9ja-game-view-left-panel-body");

        var obj = {
            data: data,
            lefPanelTitleComp: lefPanelTitleComp,
            lefPanelBody: lefPanelBody
        }
        $('#game-view-footer-chat').on('click', function () {
            lefPanelTitleComp.innerHTML = 'Chat';
            lefPanelBody.innerHTML = '';
            showLeftContent(chatMessages.bind(obj));
        });

        $('#game-view-footer-comments').on('click', function () {
            lefPanelTitleComp.innerHTML = 'Comments';
            lefPanelBody.innerHTML = '';
            showLeftContent(comments.bind(obj));
        });

        $('#game-view-footer-voice-call').on('click', function () {
            lefPanelTitleComp.innerHTML = 'Voice Call';
            lefPanelBody.innerHTML = '';
            showLeftContent(voiceCall.bind(obj));
        });

        $('#game-view-footer-video-call').on('click', function () {
            lefPanelTitleComp.innerHTML = 'Video Call';
            lefPanelBody.innerHTML = '';
            showLeftContent(videoCall.bind(obj));
        });

        $('#game-view-footer-stats').on('click', function () {
            lefPanelTitleComp.innerHTML = 'Stats';
            lefPanelBody.innerHTML = '';
            showLeftContent(Stats.bind(obj));
        });

        $('#game9ja-game-view-left-panel-close').on('click', function () {
            hideLeftContent();
        });

        $('#game9ja-game-view-main').on('click', function () {
            hideLeftContent();
        });


        function initMain(){
            var el = document.getElementById('game9ja-game-view-main');
            var size = el.clientWidth < el.clientHeight ? el.clientWidth: el.clientHeight;
            
            var upper_height = 30;
            var lower_height = 50;
            var board_size = size - upper_height - lower_height;
            var board_el = document.getElementById('game9ja-game-view-main-board');
            var upper_el = document.getElementById('game9ja-game-view-main-upper');
            var lower_el = document.getElementById('game9ja-game-view-main-lower');
            
            //setting the sizes of the panels
            board_el.style.width = board_size+'px';
            board_el.style.height = board_size+'px';
            
            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height+'px';
            
            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height+'px';
            
            //positioning the panels
            board_el.style.position = 'relative';
            board_el.style.margin = '0 auto';
            
            upper_el.style.position = 'relative';
            upper_el.style.margin = '0 auto';
            
            lower_el.style.position = 'relative';
            lower_el.style.margin = '0 auto';
            
            //testing!!!
            upper_el.style.background = 'red';
            board_el.style.background = 'blue';
            lower_el.style.background = 'green';
            
            
        }

        function chatMessages() {
            var data = this.data;
            var me = this
            //TODO: show loading indicator

            Main.rcall.live(function () {

                Main.ro.chat.getHistory(data.gameId)
                        .get(function (res) {
                            //TODO: hide loading indicator

                            //me.lefPanelBody.innerHTML = '<div class="game9ja-chat-body"></div>';
                            var contentHtml = '';
                            for (var i = 0; i < res.length; i++) {
                                if (res[i].white_player_id === data.white_player_id ||
                                        res[i].black_player_id === data.black_player_id) {
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
            var el = document.getElementById('game9ja-game-view-left-content');

            el.style.right = "-75%";//set to negative of the width we have in css file
            el.style.display = 'block';//make visible
            //animate the element to right of 0%
            Main.anim.to('game9ja-game-view-left-content', 500, {right: '0%'}, func);
        }

        function hideLeftContent() {
            var el = document.getElementById('game9ja-game-view-left-content');
            var negative_width = "-75%";//set to negative of the width we have in css file
            if (el.style.right === '0%') {
                el.style.display = 'block';//ensure visible        
                Main.anim.to('game9ja-game-view-left-content', 500, {right: negative_width});
            }
        }

    },

};

Main.on("pageshow", function (arg) {



});