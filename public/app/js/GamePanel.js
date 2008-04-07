
/* global Main */

var gameObj = {
    chat: 'game/Chat',
    comment: 'game/Comment'
            //more may go below
};


Main.rcall.live(gameObj);

Main.controller.GamePanel = {

    fixSizeConfig: function(panel_main_id, setSizeFn, checkPanelSizeFn){
      
        mainResizeListener();
        sizingMain();
      
        function doSizing() {
            
            if(checkPanelSizeFn){
                checkPanelSizeFn.bind(this)();
            }
            
            var el = this.element;
            var bound = el.getBoundingClientRect();
            var cmpHeight, cmpWidth;
            if ('clientHeight' in el) {
                cmpHeight = el.clientHeight;
                cmpWidth = el.clientWidth;
            } else {
                cmpHeight = bound.height;
                cmpWidth = bound.width;
            }

            var size = cmpWidth < cmpHeight ? cmpWidth : cmpHeight;

            //since there is a possibility that the clientWidth or clientHeight 
            //might be zero we shall wait till the dimension of the element is
            //ready before trying again

            if (cmpWidth === 0 || cmpHeight === 0) {
                if (this.elaspeTime >= 5000) {
                    console.warn('Something is wrong with dom element - could not get size of element!');
                    return;
                }
                this.elaspeTime += this.interval;
                window.setTimeout(this.sizingFn.bind(this), this.interval);//wait till the dimension is ready
                return;
            }

            console.log('client height gotten after ', this.elaspeTime + ' ms');

            var upper_height = 40;
            var lower_height = 40;
            var board_size;
            //var board_el = document.getElementById(panel_board_id);
            //var upper_el = document.getElementById(panel_upper_id);
            //var lower_el = document.getElementById(panel_lower_id);

            if (size + upper_height + lower_height > el.clientHeight) {
                board_size = size - upper_height - lower_height;
                if (el.clientHeight > size) {
                    board_size = el.clientHeight - upper_height - lower_height;
                }
            } else {
                board_size = size;
            }


            //setting the sizes of the panels
            setSizeFn(board_size, upper_height, lower_height);
            
            if(checkPanelSizeFn){
                checkPanelSizeFn.bind(this)();
            }

        }
        

        function sizingMain(evt) {

            if (evt && evt.type === "orientationchange") {
                this.canChangeOrientation = true;
            } else if (evt && this.canChangeOrientation) {
                window.removeEventListener('resize', this.funcListener, false);
                return;
            }

            var el = document.getElementById(panel_main_id);
            var o = {};
            o.element = el;
            o.elaspeTime = 0;
            o.interval = 100;
            o.sizingFn = doSizing.bind(o);

            o.sizingFn();
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
         
    },

    ownGameView: function(data, panel_main_id, resizeFn, checkPanelSizeFn){
                
        Main.controller.GamePanel.fixSizeConfig(panel_main_id,resizeFn, checkPanelSizeFn);

        $('#game-view-white-name').html(data.white_name);
        $('#game-view-white-pic').attr({src: data.white_pic});
        $('#game-view-black-name').html(data.black_name);
        $('#game-view-black-pic').attr({src: data.black_pic});
        $('#game-view-game-score').html(data.game_score);
        $('#game-view-game-status').html(data.game_status);


        Main.menu.create({
            width: 150,
            target: "#game-view-menu",
            items: [
                'Draw offer',
                'Draft variant', //for draft - we display the draft variant and the rules for the variant
                'Rules applied',
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
        var ogv = Main.controller.GameView;
        ogv.lefPanelTitleComp = lefPanelTitleComp;
        
        var obj = {
            data: data,
            lefPanelTitleComp: lefPanelTitleComp,
            lefPanelBody: lefPanelBody
        };
        
        var titleChat = 'Chat';
        if (Main.device.isXLarge()) {
            lefPanelTitleComp.innerHTML = titleChat;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Main.controller.Chat.view.bind(obj));
        }

        $('#game-view-footer-chat').on('click', function () {
            var title = titleChat;
            if (lefPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Main.controller.Chat.view.bind(obj));
        });

        $('#game-view-footer-comments').on('click', function () {
            var title = 'Comments';
            if (lefPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Main.controller.Comment.view.bind(obj));
        });

        $('#game-view-footer-voice-call').on('click', function () {
            var title = 'Voice Call';
            if (lefPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Main.controller.VoiceCall.view.bind(obj));
        });

        $('#game-view-footer-video-call').on('click', function () {
            var title = 'Video Call';
            if (lefPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Main.controller.VideoCall.view.bind(obj));
        });

        $('#game-view-footer-stats').on('click', function () {
            var title = 'Stats';
            if (lefPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Main.controller.Stats.view.bind(obj));
        });

        $('#game-view-right-panel-close').on('click', function () {
            ogv.hideLeftContent();
        });

        $('#game-view-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                ogv.hideLeftContent();
            }
        });

    },
    watchGame: function(data, panel_main_id, resizeFn){
                
        Main.controller.GamePanel.fixSizeConfig(panel_main_id,resizeFn);
              
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
        
        $('#game-watch-game-score').html(data.game_score);
        $('#game-watch-game-status').html(data.game_status);

        
        Main.menu.create({
            width: 150,
            target: "#game-watch-menu",
            items: [
                'Draw offer',
                'Draft variant', //for draft - we display the draft variant and the rules for the variant
                'Rules applied',
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
        
        var lefPanelTitleComp = document.getElementById("game-watch-right-panel-header-title");
        var lefPanelBody = document.getElementById("game-watch-right-panel-body");
        var gw = Main.controller.GameWatch;
        gw.lefPanelTitleComp = lefPanelTitleComp;
        
        var obj = {
            data: data,
            lefPanelTitleComp: lefPanelTitleComp,
            lefPanelBody: lefPanelBody
        };
            
        var titleComment = 'Comments';
        if (Main.device.isXLarge()) {
            lefPanelTitleComp.innerHTML = titleComment;
            lefPanelBody.innerHTML = '';
            gw.showLeftContent(Main.controller.Comment.view.bind(obj));
        }

        
        $('#game-watch-comment-icon').on('click', function () {
            var title = titleComment;
            if(lefPanelTitleComp.innerHTML === title){
                gw.hideLeftContent();
                return;
            }
            lefPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            gw.showLeftContent(Main.controller.Comment.view.bind(obj));
        });

        $('#game-watch-right-panel-close').on('click', function () {
            gw.hideLeftContent();
        });

        $('#game-watch-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                gw.hideLeftContent();
            }
        });

    },
    /**
     * Setup game panel for medium and large device 
     *   
     * @returns {undefined}   
     */
    setupOnHome: function () {

        if (Main.device.isSmall()) {
            return;
        }

        // at this point it is medium or large device

        var isGamePanelInit;

        getGameWatch(function (html) {
            Main.event.fire('game_panel_setup');
        });

        getGameView(function (html) {
            Main.event.fire('game_panel_setup');
        });

        var first_match_data;
        Main.event.on('game_panel_setup', function (match_data) {
            if (!first_match_data) {
                first_match_data = match_data;
            }
            if (!Main.controller.UI.gameViewHtml || !Main.controller.UI.gameWatchHtml) {
                return;
            }


            var gamePanel = document.getElementById("home-game-panel");
            if (Main.controller.Match.hasMatchData) {
                var user = Main.controller.auth.appUser;
                if (first_match_data.white_id === user.id
                        || first_match_data.black_id === user.id) {
                    //show the current app user game
                    gamePanel.innerHTML = Main.controller.UI.gameViewHtml;
                    Main.controller.GameView.Content(first_match_data);

                } else {
                    //watch other players live
                    gamePanel.innerHTML = Main.controller.UI.gameWatchHtml;
                    Main.controller.GameWatch.Content(match_data);
                }
                isGamePanelInit = true;

            } else if (!isGamePanelInit) {
                gamePanel.innerHTML = Main.controller.UI.gameWatchHtml; //default - until match data is available

                //TODO - Show default message of say Not Match in the center of the game panel - with beautiful print
            }

        });


        function getGameView(fn) {
            if (Main.controller.UI.gameViewHtml) {
                if (fn) {
                    fn(Main.controller.UI.gameViewHtml);
                }
                return;
            }
            var url = 'device/' + Main.device.getCategory() + '/' + Main.controller.GameHome.GAME_VIEW_HTML;
            Main.ajax.get(url,
                    function (res) {
                        Main.controller.UI.gameViewHtml = res;
                        if (fn) {
                            fn(res);
                        }

                    },
                    function (err) {
                        console.warn('could not get resource ', url);
                    });
        }

        function getGameWatch(fn) {
            if (Main.controller.UI.gameWatchHtml) {
                if (fn) {
                    fn(Main.controller.UI.gameWatchHtml);
                }
                return;
            }
            var url = 'device/' + Main.device.getCategory() + '/' + Main.controller.GameHome.GAME_WATCH_HTML;
            Main.ajax.get(url,
                    function (res) {
                        Main.controller.UI.gameWatchHtml = res;
                        if (fn) {
                            fn(res);
                        }

                    },
                    function (err) {
                        console.warn('could not get resource ', url);
                    });

        }

    },

};


