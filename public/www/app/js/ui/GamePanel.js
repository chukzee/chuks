
/* global Main, Ns */

Ns.ui.GamePanel = {

    matchData: null,
    rightContentName: null,

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {


    },


    showGameB: function (match, container, flip) {
        Ns.ui.GamePanel.loadGame({
            network: 'bluetooth',
            match: match,
            container: container,
            flip: flip,
        });
    },

    showGame: function (match, container, flip) {
        Ns.ui.GamePanel.loadGame({
            network: 'internet',
            match: match,
            container: container,
            flip: flip,
        });
    },

    loadGame: function (obj) {

        if (!obj.match) {
            return;
        }

        var is_spectator = true;
        var user_id = Ns.view.UserProfile.appUser.user_id;

        for (var i = 0; i < obj.match.players.length; i++) {
            if (obj.match.players[i].user_id === user_id) {
                is_spectator = false;
                break;
            }
        }

        if (!is_spectator) {
            obj.white = obj.match.players[0].user_id === user_id;
        }

        obj.boardTheme = 'wooddark';
        obj.pieceTheme = 'alpha';

        if (obj.match.game_name === 'chess') {

            Ns.ui.GamePanel._loadChess(obj);

        } else if (obj.match.game_name === 'draughts' || obj.match.game_name === 'draft') {

            Ns.ui.GamePanel._loadDraughts(obj);

        }

    },

    _loadChess: function (obj) {

        obj.is3D = false;
        Ns.game.Chess.load(obj);

    },

    _loadDraughts: function (obj) {

        obj.variant = obj.variant ? obj.variant : 'international-draughts';
        obj.is3D = false;
        Ns.game.Draughts.load(obj);

    },

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

    fixSizeConfig: function (match, panel_main, setSizeFn, checkPanelSizeFn) {

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
            setSizeFn(match, dim.board_size, dim.upper_height, dim.lower_height);

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

    ownGameView: function (match, panel_main, resizeFn, checkPanelSizeFn) {

        Ns.ui.GamePanel.matchData = match;

        Ns.ui.GamePanel.fixSizeConfig(match, panel_main, resizeFn, checkPanelSizeFn);

        document.getElementById('game-view-white-pic').src = match.players[0].photo_url;

        $('#game-view-white-name').html(match.players[0].full_name);
        $('#game-view-black-name').html(match.players[1].full_name);

        document.getElementById('game-view-black-pic').src = match.players[1].photo_url;
        $('#game-view-game-score').html(match.scores[0] + ' - ' + match.scores[1]);
        $('#game-view-game-status').html(match.status);


        Main.menu.create({
            width: 150,
            target: "#game-view-menu",
            items: [
                'Draw offer',//offer a draw
                'Rules',//rules of the game. in the case of draughts, the variant and its applied rules will be shown
                'Stats',//show head to head statistics of both players
                'Options', //set pieces and board styles, sound etc
                'Leave',//abort the game
                'Help'
            ],
            onSelect: function (evt) {
                var item = this.item;

                //finally hide the menu
                this.hide();
            }
        });


        if (Ns.view.UserProfile.appUser.id === match.players[0].user_id) {

            $('#game-view-user-wdl').html(match.players[0].wdl);
            $('#game-view-user-countdown').html(match.players[0].countdown);//may not be necessary - will be done locally

            $('#game-view-opponent-countdown').html(match.players[1].countdown);
            $('#game-view-opponent-wdl').html(match.players[1].wdl);

        } else if (Ns.view.UserProfile.appUser.id === match.players[1].user_id) {

            $('#game-view-user-wdl').html(match.players[1].wdl);
            $('#game-view-user-countdown').html(match.players[1].countdown);//may not be necessary - will be done locally

            $('#game-view-opponent-countdown').html(match.players[0].countdown);
            $('#game-view-opponent-wdl').html(match.players[0].wdl);

        }

        var ogv = Ns.GameView;

        var obj = {
            data: match,
        };

        var id_obj = {
            view_id: "game-view-right-content",
            view_body_id: "game-view-right-panel-body",
            view_header_id: "game-view-right-panel-header",
            search_button_id: "TODO"
        };

        var titleChat = 'Chat';
        if (Main.device.isXLarge()) {
            ogv.showRightContent(Ns.ui.GamePanel.matchData, titleChat, Ns.msg.GameChat.content.bind(Ns.msg.GameChat, Ns.ui.GamePanel.matchData, id_obj));
        }

        $('#game-view-footer-chat').on('click', function () {
            var title = titleChat;

            if (Ns.ui.GamePanel.rightContentName
                    && Ns.ui.GamePanel.rightContentName === title) {
                ogv.hideRightContent();
                return;
            }
            Ns.ui.GamePanel.rightContentName = title;
            ogv.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.msg.GameChat.content.bind(Ns.msg.GameChat, Ns.ui.GamePanel.matchData, id_obj));
        });

        $('#game-view-footer-comments').on('click', function () {
            var title = 'Comments';

            if (Ns.ui.GamePanel.rightContentName
                    && Ns.ui.GamePanel.rightContentName === title) {
                ogv.hideRightContent();
                return;
            }
            Ns.ui.GamePanel.rightContentName = title;
            ogv.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.msg.GameComment.content.bind(Ns.msg.GameComment, Ns.ui.GamePanel.matchData, id_obj));
        });

        $('#game-view-footer-stats').on('click', function () {
            var title = 'Stats';

            if (Ns.ui.GamePanel.rightContentName
                    && Ns.ui.GamePanel.rightContentName === title) {
                ogv.hideRightContent();
                return;
            }
            Ns.ui.GamePanel.rightContentName = title;
            ogv.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.Stats.content.bind(obj));
        });
      
        $('#game-view-footer-options').on('click', function () {
            var title = 'Options';

            if (Ns.ui.GamePanel.rightContentName
                    && Ns.ui.GamePanel.rightContentName === title) {
                ogv.hideRightContent();
                return;
            }
            Ns.ui.GamePanel.rightContentName = title;
            ogv.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.Options.content.bind(obj));
        });

        $('#game-view-footer-spectators').on('click', function () {
            var title = 'Spectators';

            if (Ns.ui.GamePanel.rightContentName
                    && Ns.ui.GamePanel.rightContentName === title) {
                ogv.hideRightContent();
                return;
            }
            Ns.ui.GamePanel.rightContentName = title;
            ogv.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.Spectators.content.bind(obj));
        });

        $('#game-view-right-panel-close').on('click', function () {
            ogv.hideRightContent();
        });

        $('#game-view-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                ogv.hideRightContent();
            }
        });

    },

    ownGameViewB: function (match, panel_main, resizeFn, checkPanelSizeFn) {

        Ns.ui.GamePanel.matchData = match;

        Ns.ui.GamePanel.fixSizeConfig(match, panel_main, resizeFn, checkPanelSizeFn);

        document.getElementById('game-view-b-black-pic').src = match.players[0].photo_url;

        $('#game-view-b-white-name').html(match.players[0].full_name);
        $('#game-view-b-black-name').html(match.players[1].full_name);

        document.getElementById('game-view-b-black-pic').src = match.players[1].photo_url;
        $('#game-view-b-game-score').html(match.scores[0] + ' - ' + match.scores[1]);
        $('#game-view-b-game-status').html(match.status);

        Main.menu.create({
            width: 150,
            target: "#game-view-b-menu",
            items: [
                'Draw offer',
                'Draughts variant', //for draughts - we display the draughts variant and the rules for the variant
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


        var id_obj = {
            view_id: "game-view-b-right-content",
            view_body_id: "game-view-b-right-panel-body",
            view_header_id: "game-view-b-right-panel-header",
            search_button_id: "TODO"
        };

        if (Ns.view.UserProfile.appUser.id === match.players[0].user_id) {

            $('#game-view-b-user-wdl').html(match.players[0].wdl);
            $('#game-view-b-user-countdown').html(match.players[0].countdown);//may not be necessary - will be done locally

            $('#game-view-b-opponent-countdown').html(match.players[1].countdown);
            $('#game-view-b-opponent-wdl').html(match.players[1].wdl);

        } else if (Ns.view.UserProfile.appUser.id === match.players[1].user_id) {

            $('#game-view-b-user-wdl').html(match.players[1].wdl);
            $('#game-view-b-user-countdown').html(match.players[1].countdown);//may not be necessary - will be done locally

            $('#game-view-b-opponent-countdown').html(match.players[0].countdown);
            $('#game-view-b-opponent-wdl').html(match.players[0].wdl);

        }

        var ogvb = Ns.GameView;

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
            ogvb.hideRightContent();
        });

        $('#game-view-b-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                ogvb.hideRightContent();
            }
        });

    },

    watchGame: function (match, panel_main, resizeFn) {

        Ns.ui.GamePanel.matchData = match;

        Ns.ui.GamePanel.fixSizeConfig(match, panel_main, resizeFn);

        $('#game-watch-white-name').html(match.players[0].full_name);
        $('#game-watch-white-countdown').html(match.players[0].countdown);
        $('#game-watch-white-wdl').html(match.players[0].wdl);

        document.getElementById('game-watch-white-profile-pic').src = match.players[0].photo_url;

        $('#game-watch-black-name').html(match.players[1].full_name);
        $('#game-watch-black-countdown').html(match.players[1].countdown);
        $('#game-watch-black-wdl').html(match.players[1].wdl);

        document.getElementById('game-watch-black-profile-pic').src = match.players[1].photo_url;

        $('#game-watch-game-score').html(match.scores[0] + ' - ' + match.scores[1]);
        $('#game-watch-game-status').html(match.status);


        Main.menu.create({
            width: 150,
            target: "#game-watch-menu",
            items: [
                'Spectators',
                'Draughts variant', //for draughts - we display the draughts variant and the rules for the variant
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

        var gw = Ns.GameWatch;

        var obj = {
            data: match,
        };

        var id_obj = {
            view_id: "game-watch-right-content",
            view_body_id: "game-watch-right-panel-body",
            view_header_id: "game-watch-right-panel-header",
            search_button_id: "TODO"
        };

        var titleComment = 'Comments';
        if (Main.device.isXLarge()) {
            gw.showRightContent(Ns.ui.GamePanel.matchData, titleComment, Ns.msg.GameComment.content.bind(Ns.msg.GameComment, Ns.ui.GamePanel.matchData, id_obj));
        }


        $('#game-watch-comment-icon').on('click', function () {
            var title = titleComment;
            if (Ns.ui.GamePanel.rightContentName
                    && Ns.ui.GamePanel.rightContentName === title) {
                gw.hideRightContent();
                return;
            }
            Ns.ui.GamePanel.rightContentName = title;
            gw.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.msg.GameComment.content.bind(Ns.msg.GameComment, Ns.ui.GamePanel.matchData, id_obj));
        });

        $('#game-watch-right-panel-close').on('click', function () {
            gw.hideRightContent();
        });

        $('#game-watch-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                gw.hideRightContent();
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
            Main.event.fire(Ns.Const.EVT_GAME_PANEL_SETUP);
        });

        getGameView(function (html) {
            Main.event.fire(Ns.Const.EVT_GAME_PANEL_SETUP);
        });

        getGameViewB(function (html) {
            Main.event.fire(Ns.Const.EVT_GAME_PANEL_SETUP);
        });

        var first_match_data;
        Main.event.on(Ns.Const.EVT_GAME_PANEL_SETUP, function (match_data) {
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
            if (Ns.Match.hasMatchData) {
                var user = Ns.view.UserProfile.appUser;
                if (first_match_data.players[0].user_id === user.id
                        || first_match_data.players[1].user_id === user.id) {
                    //show the current app user game
                    gamePanel.innerHTML = Ns.ui.UI.gameViewHtml;
                    Ns.ui.GamePanel.matchData = first_match_data;
                    Ns.GameView.Content(first_match_data);

                } else {
                    //watch other players live
                    gamePanel.innerHTML = Ns.ui.UI.gameWatchHtml;
                    Ns.ui.GamePanel.matchData = match_data;
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
            var url = Main.intentUrl(Ns.GameHome.GAME_VIEW_HTML);
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
            var url = Main.intentUrl(Ns.GameHome.GAME_VIEW_B_HTML);
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
            var url = Main.intentUrl(Ns.GameHome.GAME_WATCH_HTML);
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


