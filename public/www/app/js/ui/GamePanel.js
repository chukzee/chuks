
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
        if (match.robot === true) {
            Ns.ui.GamePanel.showGameRobot(match, container, flip);
        } else {
            Ns.ui.GamePanel.showGameBluetooth(match, container, flip);
        }
    },

    showGameBluetooth: function (match, container, flip) {
        Ns.ui.GamePanel.loadGame({
            communication: 'bluetooth',
            match: match,
            container: container,
            flip: flip,
        });
    },

    showGameRobot: function (match, container, flip) {
        Ns.ui.GamePanel.loadGame({
            communication: 'worker', //web worker
            match: match,
            container: container,
            flip: flip,
        });
    },

    showGame: function (match, container, flip) {
        Ns.ui.GamePanel.loadGame({
            communication: 'internet',
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

    _showChats: function (view, id_obj) {
        var title = 'Chat';
        if (Ns.ui.GamePanel.rightContentName
                && Ns.ui.GamePanel.rightContentName === title) {
            view.hideRightContent();
            return;
        }
        Ns.ui.GamePanel.rightContentName = title;
        view.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.msg.GameChat.content.bind(Ns.msg.GameChat, Ns.ui.GamePanel.matchData, id_obj));

    },

    _showComments: function (view, id_obj) {
        var title = 'Comments';

        if (Ns.ui.GamePanel.rightContentName
                && Ns.ui.GamePanel.rightContentName === title) {
            view.hideRightContent();
            return;
        }
        Ns.ui.GamePanel.rightContentName = title;
        view.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.msg.GameComment.content.bind(Ns.msg.GameComment, Ns.ui.GamePanel.matchData, id_obj));

    },

    _showSpectators: function (view, id_obj) {
        var title = 'Spectators';

        if (Ns.ui.GamePanel.rightContentName
                && Ns.ui.GamePanel.rightContentName === title) {
            view.hideRightContent();
            return;
        }
        Ns.ui.GamePanel.rightContentName = title;
        view.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.Spectators.content.bind(Ns.Spectators, Ns.ui.GamePanel.matchData, id_obj));

    },

    _showStats: function (view, id_obj) {

        var title = 'Stats';

        if (Ns.ui.GamePanel.rightContentName
                && Ns.ui.GamePanel.rightContentName === title) {
            view.hideRightContent();
            return;
        }
        Ns.ui.GamePanel.rightContentName = title;
        view.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.Stats.content.bind(Ns.Stats, Ns.ui.GamePanel.matchData, id_obj));
    },

    _showOptions: function (view, id_obj) {
        var title = 'Options';

        if (Ns.ui.GamePanel.rightContentName
                && Ns.ui.GamePanel.rightContentName === title) {
            view.hideRightContent();
            return;
        }
        Ns.ui.GamePanel.rightContentName = title;
        view.showRightContent(Ns.ui.GamePanel.matchData, title, Ns.Options.content.bind(Ns.Options, Ns.ui.GamePanel.matchData, id_obj));

    },

    _showByMenuItem: function (item, view, id_obj) {

        switch (item) {
            case 'Draw offer':
                {

                }
                break;
            case 'Rules':
                {

                }
                break;
            case 'Stats':
                {
                    Ns.ui.GamePanel._showStats(view, id_obj);
                }
                break;
            case 'Options':
                {
                    Ns.ui.GamePanel._showOptions(view, id_obj);
                }
                break;
            case 'Leave':
                {

                }
                break;
            case 'Help':
                {

                }
                break;
        }
    },

    _createMenu: function (id_selector, view, id_obj) {

        Main.menu.create({
            width: 150,
            target: id_selector,
            items: [
                'Draw offer', //offer a draw
                'Rules', //rules of the game. in the case of draughts, the variant and its applied rules will be shown
                'Stats', //show head to head statistics of both players
                'Options', //set pieces and board styles, sound etc
                'Leave', //abort the game
                'Help'
            ],
            onSelect: function (evt) {
                var item = this.item;
                Ns.ui.GamePanel._showByMenuItem(item, view, id_obj);
                //finally hide the menu
                this.hide();
            }
        });

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

        var upper_height = 60;
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
        var me = this;

        var id_obj = {
            view_id: "game-view-right-content",
            view_body_id: "game-view-right-panel-body",
            view_header_id: "game-view-right-panel-header",
            search_button_id: "TODO"
        };

        var titleChat = 'Chat';

        Ns.ui.GamePanel.matchData = match;

        Ns.ui.GamePanel.fixSizeConfig(match, panel_main, resizeFn, checkPanelSizeFn);

        document.getElementById('game-view-white-pic').src = match.players[0].small_photo_url;

        $('#game-view-white-name').html(match.players[0].full_name);
        $('#game-view-black-name').html(match.players[1].full_name);

        document.getElementById('game-view-black-pic').src = match.players[1].small_photo_url;
        $('#game-view-game-score').html(match.scores[0] + ' - ' + match.scores[1]);
        $('#game-view-game-status').html(match.status);

        me._createMenu("#game-view-menu", Ns.GameView, id_obj);

        var white_wdl, black_wdl;
        if (match.wdl) {
            white_wdl = match.wdl.white.specific.wdl;
        }

        if (match.wdl) {
            black_wdl = match.wdl.black.specific.wdl;
        }

        if (Ns.view.UserProfile.appUser.user_id === match.players[0].user_id) {

            $('#game-view-white-wdl').html(white_wdl);
            $('#game-view-white-countdown').html(match.players[0].countdown);//may not be necessary - will be done locally

            $('#game-view-black-countdown').html(match.players[1].countdown);
            $('#game-view-black-wdl').html(black_wdl);

        } else if (Ns.view.UserProfile.appUser.user_id === match.players[1].user_id) {

            $('#game-view-black-wdl').html(black_wdl);
            $('#game-view-black-countdown').html(match.players[1].countdown);//may not be necessary - will be done locally

            $('#game-view-white-countdown').html(match.players[0].countdown);
            $('#game-view-white-wdl').html(white_wdl);

        }

        if (Main.device.isXLarge()) {
            me._showChats(Ns.GameView, id_obj);
        }

        $('#game-view-footer-chat').on('click', function () {
            me._showChats(Ns.GameView, id_obj, titleChat);
        });

        $('#game-view-footer-comments').on('click', function () {
            me._showComments(Ns.GameView, id_obj);
        });

        $('#game-view-footer-spectators').on('click', function () {
            me._showSpectators(Ns.GameView, id_obj);
        });

        $('#game-view-footer-stats').on('click', function () {
            me._showStats(Ns.GameView, id_obj);
        });

        $('#game-view-footer-options').on('click', function () {
            me._showOptions(Ns.GameView, id_obj);
        });

        $('#game-view-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                Ns.GameView.hideRightContent();
            }
        });

    },

    ownGameViewB: function (match, panel_main, resizeFn, checkPanelSizeFn) {
        var me = this;

        var id_obj = {
            view_id: "game-view-b-right-content",
            view_body_id: "game-view-b-right-panel-body",
            view_header_id: "game-view-b-right-panel-header",
            search_button_id: "TODO"
        };

        Ns.ui.GamePanel.matchData = match;

        Ns.ui.GamePanel.fixSizeConfig(match, panel_main, resizeFn, checkPanelSizeFn);

        document.getElementById('game-view-b-black-pic').src = match.players[0].small_photo_url;

        $('#game-view-b-white-name').html(match.players[0].full_name);
        $('#game-view-b-black-name').html(match.players[1].full_name);

        document.getElementById('game-view-b-black-pic').src = match.players[1].small_photo_url;
        $('#game-view-b-game-score').html(match.scores[0] + ' - ' + match.scores[1]);
        $('#game-view-b-game-status').html(match.status);

        me._createMenu("#game-view-b-menu", Ns.GameViewB, id_obj);

        var white_wdl, black_wdl;
        if (match.wdl) {
            white_wdl = match.wdl.white.specific.wdl;
        }

        if (match.wdl) {
            black_wdl = match.wdl.black.specific.wdl;
        }

        if (Ns.view.UserProfile.appUser.user_id === match.players[0].user_id) {

            $('#game-view-b-white-wdl').html(white_wdl);
            $('#game-view-b-white-countdown').html(match.players[0].countdown);//may not be necessary - will be done locally

            $('#game-view-b-black-countdown').html(match.players[1].countdown);
            $('#game-view-b-black-wdl').html(black_wdl);

        } else if (Ns.view.UserProfile.appUser.user_id === match.players[1].user_id) {

            $('#game-view-b-black-wdl').html(black_wdl);
            $('#game-view-b-black-countdown').html(match.players[1].countdown);//may not be necessary - will be done locally

            $('#game-view-b-white-countdown').html(match.players[0].countdown);
            $('#game-view-b-white-wdl').html(white_wdl);

        }

        if (Main.device.isXLarge()) {
            me._showOptions(Ns.GameViewB, id_obj);
        }

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

        $('#game-view-b-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                Ns.GameViewB.hideRightContent();
            }
        });

    },

    watchGame: function (match, panel_main, resizeFn) {
        var me = this;

        var id_obj = {
            view_id: "game-watch-right-content",
            view_body_id: "game-watch-right-panel-body",
            view_header_id: "game-watch-right-panel-header",
            search_button_id: "TODO"
        };

        var titleComment = 'Comments';

        Ns.ui.GamePanel.matchData = match;

        Ns.ui.GamePanel.fixSizeConfig(match, panel_main, resizeFn);


        var white_wdl, black_wdl;
        if (match.wdl) {
            white_wdl = match.wdl.white.specific.wdl;
        }

        if (match.wdl) {
            black_wdl = match.wdl.black.specific.wdl;
        }


        $('#game-watch-white-name').html(match.players[0].full_name);
        $('#game-watch-white-countdown').html(match.players[0].countdown);
        $('#game-watch-white-wdl').html(white_wdl);

        document.getElementById('game-watch-white-profile-pic').src = match.players[0].small_photo_url;

        $('#game-watch-black-name').html(match.players[1].full_name);
        $('#game-watch-black-countdown').html(match.players[1].countdown);
        $('#game-watch-black-wdl').html(black_wdl);

        document.getElementById('game-watch-black-profile-pic').src = match.players[1].small_photo_url;

        $('#game-watch-game-score').html(match.scores[0] + ' - ' + match.scores[1]);
        $('#game-watch-game-status').html(match.status);

        me._createMenu("#game-watch-menu", Ns.GameWatch, id_obj);

        if (Main.device.isXLarge()) {
            Ns.GameWatch.showRightContent(Ns.ui.GamePanel.matchData, titleComment, Ns.msg.GameComment.content.bind(Ns.msg.GameComment, Ns.ui.GamePanel.matchData, id_obj));
        }


        $('#game-watch-comment-icon').on('click', function () {
            me._showComments(Ns.GameWatch, id_obj, titleComment);
        });

        $('#game-watch-main').on('click', function () {
            if (!Main.device.isXLarge()) {
                Ns.GameWatch.hideRightContent();
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

            //making sure all three game panel views are ready
            if (!Ns.ui.UI.gameViewHtml
                    || !Ns.ui.UI.gameViewBHtml
                    || !Ns.ui.UI.gameWatchHtml) {
                return;
            }


            var gamePanel = document.getElementById("home-game-panel");

            //show robot match
            Ns.Robot.showGame();
            

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


