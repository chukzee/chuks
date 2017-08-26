
/* global Main */

Ns.ui.GamePanel = {

    gameAreaDimension: function (elem) {

        var el = elem ? elem : this.element;
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


        if (size + upper_height + lower_height > el.clientHeight) {
            board_size = size - upper_height - lower_height;
            if (el.clientHeight > size) {
                board_size = el.clientHeight - upper_height - lower_height;
            }
        } else {
            board_size = size;
        }

        return {board_size: board_size, upper_height: upper_height, lower_height: lower_height};
    },

    fixSizeConfig: function (panel_main, setSizeFn, checkPanelSizeFn) {

        mainResizeListener();
        sizingMain();

        function doSizing() {

            if (checkPanelSizeFn) {
                checkPanelSizeFn.bind(this)();
            }

            var dim = Ns.ui.GamePanel.gameAreaDimension.bind(this)();
            if (!dim) {
                return;
            }

            //console.log(dim);

            //setting the sizes of the panels
            setSizeFn(dim.board_size, dim.upper_height, dim.lower_height);

            if (checkPanelSizeFn) {
                checkPanelSizeFn.bind(this)();
            }

        }


        function sizingMain(evt) {

            /*Deprecated! - causes so problems of not retrieving the dom sizes. 
             if (evt && evt.type === "orientationchange") {
             this.canChangeOrientation = true;
             } else if (evt && this.canChangeOrientation) {
             window.removeEventListener('resize', this.funcListener, false);
             return;
             }
             */


            var o = {};
            o.element = panel_main;
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

    ownGameView: function (data, panel_main, resizeFn, checkPanelSizeFn) {

        Ns.ui.GamePanel.fixSizeConfig(panel_main, resizeFn, checkPanelSizeFn);

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
                'Stats',
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


        if (Ns.view.UserProfile.appUser.id === data.white_id) {

            $('#game-view-user-wld').html(data.white_wld);
            $('#game-view-user-countdown').html(data.white_countdown);//may not be necessary - will be done locally

            $('#game-view-opponent-countdown').html(data.black_countdown);
            $('#game-view-opponent-activity').html(data.black_activity);
            $('#game-view-opponent-wld').html(data.black_wld);

        } else if (Ns.view.UserProfile.appUser.id === data.black_id) {

            $('#game-view-user-wld').html(data.black_wld);
            $('#game-view-user-countdown').html(data.black_countdown);//may not be necessary - will be done locally

            $('#game-view-opponent-countdown').html(data.white_countdown);
            $('#game-view-opponent-activity').html(data.white_activity);
            $('#game-view-opponent-wld').html(data.white_wld);

        }

        var leftPanelTitleComp = document.getElementById("game-view-right-panel-header-title");
        var lefPanelBody = document.getElementById("game-view-right-panel-body");
        var ogv = Ns.GameView;
        ogv.leftPanelTitleComp = leftPanelTitleComp;

        var obj = {
            data: data,
            leftPanelTitleComp: leftPanelTitleComp,
            lefPanelBody: lefPanelBody
        };

        var titleChat = 'Chat';
        if (Main.device.isXLarge()) {
            leftPanelTitleComp.innerHTML = titleChat;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Ns.msg.Chat.content.bind(obj));
        }

        $('#game-view-footer-chat').on('click', function () {
            var title = titleChat;
            if (leftPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            leftPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Ns.msg.Chat.content.bind(obj));
        });

        $('#game-view-footer-comments').on('click', function () {
            var title = 'Comments';
            if (leftPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            leftPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Ns.msg.Comment.content.bind(obj));
        });

        $('#game-view-footer-voice-call').on('click', function () {
            var title = 'Voice Call';
            if (leftPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            leftPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Ns.msg.VoiceCall.content.bind(obj));
        });

        $('#game-view-footer-video-call').on('click', function () {
            var title = 'Video Call';
            if (leftPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            leftPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Ns.msg.VideoCall.content.bind(obj));
        });

        $('#game-view-footer-spectators').on('click', function () {
            var title = 'Stats';
            if (leftPanelTitleComp.innerHTML === title) {
                ogv.hideLeftContent();
                return;
            }
            leftPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            ogv.showLeftContent(Ns.Spectators.content.bind(obj));
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

    ownGameViewB: function (data, panel_main, resizeFn, checkPanelSizeFn) {

        Ns.ui.GamePanel.fixSizeConfig(panel_main, resizeFn, checkPanelSizeFn);

        $('#game-view-b-white-name').html(data.white_name);
        $('#game-view-b-white-pic').attr({src: data.white_pic});
        $('#game-view-b-black-name').html(data.black_name);
        $('#game-view-b-black-pic').attr({src: data.black_pic});
        $('#game-view-b-game-score').html(data.game_score);
        $('#game-view-b-game-status').html(data.game_status);

        Main.menu.create({
            width: 150,
            target: "#game-view-b-menu",
            items: [
                'Draw offer',
                'Draft variant', //for draft - we display the draft variant and the rules for the variant
                'Rules applied',
                'Rules',
                'Stats',
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


        if (Ns.view.UserProfile.appUser.id === data.white_id) {

            $('#game-view-b-user-wld').html(data.white_wld);
            $('#game-view-b-user-countdown').html(data.white_countdown);//may not be necessary - will be done locally

            $('#game-view-b-opponent-countdown').html(data.black_countdown);
            $('#game-view-b-opponent-activity').html(data.black_activity);
            $('#game-view-b-opponent-wld').html(data.black_wld);

        } else if (Ns.view.UserProfile.appUser.id === data.black_id) {

            $('#game-view-b-user-wld').html(data.black_wld);
            $('#game-view-b-user-countdown').html(data.black_countdown);//may not be necessary - will be done locally

            $('#game-view-b-opponent-countdown').html(data.white_countdown);
            $('#game-view-b-opponent-activity').html(data.white_activity);
            $('#game-view-b-opponent-wld').html(data.white_wld);

        }

        var leftPanelTitleComp = document.getElementById("game-view-b-right-panel-header-title");
        var lefPanelBody = document.getElementById("game-view-b-right-panel-body");
        var ogvb = Ns.GameView;
        ogvb.leftPanelTitleComp = leftPanelTitleComp;

        $('#game-view-b-bluetooth-icon').on('click', function () {
            var device_name = 'TODO device name'; //TODO
            var signal_strength = 'TODO  excellent';//TODO
            var elapse_time = 'TODO 456';//TODO
            
            var msg = '<table>'
                    + '<tr><td>Device : </td><td>' + device_name + '</td></tr>'
                    + '<tr><td>Signal strenght : </td><td>' + signal_strength + '</td></tr>'
                    + '<tr><td>Elapse time (s) : </td><td>' + elapse_time + '</td></tr>'
                    + '</table>';
            Main.alert(msg, 'Connected bluetooth device');
        });

        $('#game-view-b-right-panel-close').on('click', function () {
            ogvb.hideLeftContent();
        });

        $('#game-view-b-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                ogvb.hideLeftContent();
            }
        });

    },

    watchGame: function (data, panel_main, resizeFn) {

        Ns.ui.GamePanel.fixSizeConfig(panel_main, resizeFn);

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
                'Spectators',
                'Draft variant', //for draft - we display the draft variant and the rules for the variant
                'Rules applied',
                'Rules',
                'Stats',
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

        var leftPanelTitleComp = document.getElementById("game-watch-right-panel-header-title");
        var lefPanelBody = document.getElementById("game-watch-right-panel-body");
        var gw = Ns.GameWatch;
        gw.leftPanelTitleComp = leftPanelTitleComp;

        var obj = {
            data: data,
            leftPanelTitleComp: leftPanelTitleComp,
            lefPanelBody: lefPanelBody
        };

        var titleComment = 'Comments';
        if (Main.device.isXLarge()) {
            leftPanelTitleComp.innerHTML = titleComment;
            lefPanelBody.innerHTML = '';
            gw.showLeftContent(Ns.msg.Comment.content.bind(obj));
        }


        $('#game-watch-comment-icon').on('click', function () {
            var title = titleComment;
            if (leftPanelTitleComp.innerHTML === title) {
                gw.hideLeftContent();
                return;
            }
            leftPanelTitleComp.innerHTML = title;
            lefPanelBody.innerHTML = '';
            gw.showLeftContent(Ns.msg.Comment.content.bind(obj));
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

        getGameViewB(function (html) {
            Main.event.fire('game_panel_setup');
        });

        var first_match_data;
        Main.event.on('game_panel_setup', function (match_data) {
            if (!first_match_data) {
                first_match_data = match_data;
            }

            //making sure all three game panel type are ready
            if (!Ns.ui.UI.gameViewHtml
                    || !Ns.ui.UI.gameViewBHtml
                    || !Ns.ui.UI.gameWatchHtml) {
                return;
            }


            var gamePanel = document.getElementById("home-game-panel");
            if (Ns.game.Match.hasMatchData) {
                var user = Ns.view.UserProfile.appUser;
                if (first_match_data.white_id === user.id
                        || first_match_data.black_id === user.id) {
                    //show the current app user game
                    gamePanel.innerHTML = Ns.ui.UI.gameViewHtml;
                    Ns.GameView.Content(first_match_data);

                } else {
                    //watch other players live
                    gamePanel.innerHTML = Ns.ui.UI.gameWatchHtml;
                    Ns.GameWatch.Content(match_data);
                }
                isGamePanelInit = true;

            } else if (!isGamePanelInit) {
                gamePanel.innerHTML = Ns.ui.UI.gameWatchHtml; //default - until match data is available

                //TODO - Show default message of say Not Match in the center of the game panel - with beautiful print
            }

        });


        function getGameView(fn) {
            if (Ns.ui.UI.gameViewHtml) {
                if (fn) {
                    fn(Ns.ui.UI.gameViewHtml);
                }
                return;
            }
            var url = 'device/' + Main.device.getCategory() + '/' + Ns.GameHome.GAME_VIEW_HTML;
            Main.ajax.get(url,
                    function (res) {
                        Ns.ui.UI.gameViewHtml = res;
                        if (fn) {
                            fn(res);
                        }

                    },
                    function (err) {
                        //TODO : Display a message on the screen stating : failed to setup game panel

                        console.warn('could not get resource ', url);
                    });
        }


        function getGameViewB(fn) {
            if (Ns.ui.UI.gameViewBHtml) {
                if (fn) {
                    fn(Ns.ui.UI.gameViewBHtml);
                }
                return;
            }
            var url = 'device/' + Main.device.getCategory() + '/' + Ns.GameHome.GAME_VIEW_B_HTML;
            Main.ajax.get(url,
                    function (res) {
                        Ns.ui.UI.gameViewBHtml = res;
                        if (fn) {
                            fn(res);
                        }

                    },
                    function (err) {
                        //TODO : Display a message on the screen stating : failed to setup game panel

                        console.warn('could not get resource ', url);
                    });
        }


        function getGameWatch(fn) {
            if (Ns.ui.UI.gameWatchHtml) {
                if (fn) {
                    fn(Ns.ui.UI.gameWatchHtml);
                }
                return;
            }
            var url = 'device/' + Main.device.getCategory() + '/' + Ns.GameHome.GAME_WATCH_HTML;
            Main.ajax.get(url,
                    function (res) {
                        Ns.ui.UI.gameWatchHtml = res;
                        if (fn) {
                            fn(res);
                        }

                    },
                    function (err) {
                        //TODO : Display a message on the screen stating : failed to setup game panel

                        console.warn('could not get resource ', url);
                    });

        }

    },

};


