
/* global Ns, Main */

Ns.Options = {

    THEME_SAVE_KEY: '_THEME_SAVE_KEY',

    DEFAULT_CHESS_PIECE_2D: 'alpha',
    DEFAULT_CHESS_PIECE_3D: '', //TODO
    DEFAULT_CHESS_BOARD_TOP: 'woodlight',
    DEFAULT_CHESS_BOARD_FRAME: 'wood_base_1',
    DEFAULT_CHESS_BOARD_FLOOR: 'wood_base_1',

    DEFAULT_DRAUGHTS_PIECE_2D: '', //TODO
    DEFAULT_DRAUGHTS_PIECE_3D: '', //TODO
    DEFAULT_DRAUGHTS_BOARD_TOP: '', //TODO
    DEFAULT_DRAUGHTS_BOARD_FRAME: '', //TODO
    DEFAULT_DRAUGHTS_BOARD_FLOOR: '', //TODO

    DEFAULT_LIGHT_INTENSITY: 50, //in percent
    DEFAUTLT_IS_SOUND: true,
    DEFAUTLT_IS_DRAG_PIECE: true,

    chessPiece2d: null,
    chessPiece3d: null,
    chessBoardTop: null,
    chessBoardFrame: null,
    chessBoardFloor: null,

    draughtsPiece2d: null,
    draughtsPiece3d: null,
    draughtsBoardTop: null,
    draughtsBoardFrame: null,
    draughtsBoardFloor: null,

    lightIntensity: null,
    isSound: null,
    isDragPiece: null,

    constructor: function () {
        this.init();
    },

    init: function () {

        this.chessPiece2d = this._localGetOption('chessPiece2d');
        if (this.chessPiece2d === null) {
            this.chessPiece2d = this.DEFAULT_CHESS_PIECE_2D;
        }

        this.chessPiece3d = this._localGetOption('chessPiece3d');
        if (this.chessPiece3d === null) {
            this.chessPiece3d = this.DEFAULT_CHESS_PIECE_3D;
        }

        this.chessBoardTop = this._localGetOption('chessBoardTop');
        if (this.chessBoardTop === null) {
            this.chessBoardTop = this.DEFAULT_CHESS_BOARD_TOP;
        }

        this.chessBoardFrame = this._localGetOption('chessBoardFrame');
        if (this.chessBoardFrame === null) {
            this.chessBoardFrame = this.DEFAULT_CHESS_BOARD_FRAME;
        }

        this.chessBoardFloor = this._localGetOption('chessBoardFloor');
        if (this.chessBoardFloor === null) {
            this.chessBoardFloor = this.DEFAULT_CHESS_BOARD_FLOOR;
        }

        this.draughtsPiece2d = this._localGetOption('draughtsPiece2d');
        if (this.draughtsPiece2d === null) {
            this.draughtsPiece2d = this.DEFAULT_DRAUGHTS_PIECE_2D;
        }

        this.draughtsPiece3d = this._localGetOption('draughtsPiece3d');
        if (this.draughtsPiece3d === null) {
            this.draughtsPiece3d = this.DEFAULT_DRAUGHTS_PIECE_3D;
        }

        this.draughtsBoardTop = this._localGetOption('draughtsBoardTop');
        if (this.draughtsBoardTop === null) {
            this.draughtsBoardTop = this.DEFAULT_DRAUGHTS_BOARD_TOP;
        }

        this.draughtsBoardFrame = this._localGetOption('draughtsBoardFrame');
        if (this.draughtsBoardFrame === null) {
            this.draughtsBoardFrame = this.DEFAULT_DRAUGHTS_BOARD_FRAME;
        }

        this.draughtsBoardFloor = this._localGetOption('draughtsBoardFloor');
        if (this.draughtsBoardFloor === null) {
            this.draughtsBoardFloor = this.DEFAULT_DRAUGHTS_BOARD_FLOOR;
        }


        this.isSound = this._localGetOption('isSound');
        if (this.isSound === null) {
            this.isSound = this.DEFAUTLT_IS_SOUND;
        }

        this.isDragPiece = this._localGetOption('isDragPiece');
        if (this.isDragPiece === null) {
            this.isDragPiece = this.DEFAUTLT_IS_DRAG_PIECE;
        }

        this.lightIntensity = this._localGetOption('lightIntensity');
        if (this.lightIntensity === null) {
            this.lightIntensity = this.DEFAULT_LIGHT_INTENSITY;
        }

    },

    content: function (match, id_obj) {
        this.init();
        var me = this;
        Main.tpl.template({
            tplUrl: 'game-view-options.html',
            data: match.wdl,
            onReplace: function (tpl_var, wdl) {


            },
            afterReplace: function (el, data) {
                document.getElementById(id_obj.view_body_id).innerHTML = el.outerHTML;

                $(document.body).find('div[data-game-option]').each(function () {
                    if (this.dataset.gameOption !== Ns.ui.UI.selectedGame) {
                        $(this).hide();
                    }
                });

                var o = me._els();
                me._setOptions(o);

                //for chess
                Main.click(o.el_chess_piece_2d, data, me._onClickChessPiece2d.bind(me));
                Main.click(o.el_chess_piece_3d, data, me._onClickChessPiece3d.bind(me));
                Main.click(o.el_chess_board_top, data, me._onClickChessBoardTop.bind(me));
                Main.click(o.el_chess_board_frame, data, me._onClickChessBoardFrame.bind(me));
                Main.click(o.el_chess_board_floor, data, me._onClickChessBoardFloor.bind(me));

                //for draughts
                Main.click(o.el_draughts_piece_2d, data, me._onClickDraughtsPiece2d.bind(me));
                Main.click(o.el_draughts_piece_3d, data, me._onClickDraughtsPiece3d.bind(me));
                Main.click(o.el_draughts_board_top, data, me._onClickDraughtsBoardTop.bind(me));
                Main.click(o.el_draughts_board_frame, data, me._onClickDraughtsBoardFrame.bind(me));
                Main.click(o.el_draughts_board_floor, data, me._onClickDraughtsBoardFloor.bind(me));

                Main.click(o.el_light, data, me._onClickLight.bind(me));
                Main.dom.addListener(o.el_sound, 'click', data, me._onClickSound.bind(me));//important! do not use Main.click  -> not working for checkbox because of maybe touchend event used internally for mobile device
                Main.dom.addListener(o.el_drag_piece, 'click', data, me._onClickDragPiece.bind(me));//important! do not use Main.click  -> not working for checkbox because of maybe touchend event used internally for mobile device

                var el_reset = document.getElementById('game_view_options_reset');
                Main.click(el_reset, data, me._onClickReset.bind(me));

            }
        });
    },

    _localSaveOption: function (prefix, opt) {
        window.localStorage.setItem(prefix + this.THEME_SAVE_KEY, opt);
    },

    _localGetOption: function (prefix) {
        try {
            var opt = window.localStorage.getItem(prefix + this.THEME_SAVE_KEY);
            if (opt === null) {//yes
                return null;
            }
        } catch (e) {
            console.log(e);
        }

        if (opt === 'false') {
            opt = false;
        } else
        if (opt === 'true') {
            opt = true;
        } else if (opt !== true || opt !== false) {//except true or false
            var num = opt - 0;//implicitly convert to numeric
            if (!isNaN(num)) {//is a number
                opt = num;
            }
        }
        return opt;
    },

    _preSelectHoziListItemTheme: function (theme, container) {
        if (!theme || !container) {
            return;
        }

        var children = container.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].dataset.name === theme) {
                children[i].className = 'game-view-options-item-select';
            } else {
                children[i].className = 'game-view-options-item';
            }
        }

    },

    _selectHoziListItemTheme: function (evt, data) {
        var target = evt.target;
        if (target.tagName.toLowerCase() !== 'img') {
            return;
        }
        var children = target.parentNode.children;
        target.className = 'game-view-options-item-select';
        for (var i = 0; i < children.length; i++) {
            if (children[i] === target) {
                continue;
            }
            children[i].className = 'game-view-options-item';
        }

        return target.dataset.name;
    },

    _onClickChessPiece2d: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.chessPiece2d = theme;

        this._localSaveOption('chessPiece2d', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_PIECE_2D_CHANGE);
    },

    _onClickDraughtsPiece2d: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.draughtsPiece2d = theme;

        this._localSaveOption('draughtsPiece2d', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_PIECE_2D_CHANGE);
    },

    _onClickChessPiece3d: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.chessPiece3d = theme;

        this._localSaveOption('chessPiece3d', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_PIECE_3D_CHANGE);
    },

    _onClickDraughtsPiece3d: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.draughtsPiece3d = theme;

        this._localSaveOption('draughtsPiece3d', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_PIECE_3D_CHANGE);
    },

    _onClickChessBoardTop: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.chessBoardTop = theme;

        this._localSaveOption('chessBoardTop', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_TOP_CHANGE);
    },

    _onClickDraughtsBoardTop: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.draughtsBoardTop = theme;

        this._localSaveOption('draughtsBoardTop', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_TOP_CHANGE);
    },

    _onClickChessBoardFrame: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.chessBoardFrame = theme;

        this._localSaveOption('chessBoardFrame', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_FRAME_CHANGE);

    },

    _onClickDraughtsBoardFrame: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.draughtsBoardFrame = theme;

        this._localSaveOption('draughtsBoardFrame', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_FRAME_CHANGE);

    },

    _onClickChessBoardFloor: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.chessBoardFloor = theme;

        this._localSaveOption('chessBoardFloor', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_FLOOR_CHANGE);

    },

    _onClickDraughtsBoardFloor: function (evt, data) {
        var theme = this._selectHoziListItemTheme(evt, data);
        if (!theme) {
            return;
        }

        this.draughtsBoardFloor = theme;

        this._localSaveOption('draughtsBoardFloor', theme);
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_FLOOR_CHANGE);

    },

    _onClickLight: function (evt, data) {
        var ranage_btn = evt.target;
        this.lightIntensity = ranage_btn.value;
        this._localSaveOption('lightIntensity', this.lightIntensity);
        
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_LIGHT_INTENSITY_CHANGE);
    },

    _onClickSound: function (evt, data) {
        var check_btn = evt.target;
        this.isSound = check_btn.checked;
        this._localSaveOption('isSound', this.isSound);
        
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_SOUND_CHANGE);
    },

    _onClickDragPiece: function (evt, data) {
        var check_btn = evt.target;
        this.isDragPiece = check_btn.checked;
        this._localSaveOption('isDragPiece', this.isDragPiece);
        
        Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_DRAG_PIECE_CHANGE);
    },

    _els: function () {

        var obj = {};
        //for chess
        var chess_option = $('div[data-game-option="chess"]');
        obj.el_chess_piece_2d = chess_option[0].querySelector('div[data-piece="2d"]');
        obj.el_chess_piece_3d = chess_option[0].querySelector('div[data-piece="3d"]');
        obj.el_chess_board_top = chess_option[1].querySelector('div[data-board="top"]');
        obj.el_chess_board_frame = chess_option[1].querySelector('div[data-board="frame"]');
        obj.el_chess_board_floor = chess_option[2].querySelector('div[data-board="floor"]');

        //for draughts
        var draughts_option = $('div[data-game-option="draughts"]');
        obj.el_draughts_piece_2d = draughts_option[0].querySelector('div[data-piece="2d"]');
        obj.el_draughts_piece_3d = draughts_option[0].querySelector('div[data-piece="3d"]');
        obj.el_draughts_board_top = draughts_option[1].querySelector('div[data-board="top"]');
        obj.el_draughts_board_frame = draughts_option[1].querySelector('div[data-board="frame"]');
        obj.el_draughts_board_floor = draughts_option[2].querySelector('div[data-board="floor"]');

        obj.el_light = document.querySelector('input[data-light="intensity"]');
        obj.el_sound = document.getElementById('game_view_option_sound_id');
        obj.el_drag_piece = document.getElementById('game_view_option_drag_piece_id');

        return obj;
    },

    _onClickReset: function (evt, data) {
        var o = this._els();
        this._setOptions(o, true);
    },

    _setOptions: function (o, reset) {

        if (reset) {
            this.chessPiece2d = this.DEFAULT_CHESS_PIECE_2D;
            this.chessPiece3d = this.DEFAULT_CHESS_PIECE_3D;
            this.chessBoardTop = this.DEFAULT_CHESS_BOARD_TOP;
            this.chessBoardFrame = this.DEFAULT_CHESS_BOARD_FRAME;
            this.chessBoardFloor = this.DEFAULT_CHESS_BOARD_FLOOR;

            this.draughtsPiece2d = this.DEFAULT_DRAUGHTS_PIECE_2D;
            this.draughtsPiece3d = this.DEFAULT_DRAUGHTS_PIECE_3D;
            this.draughtsBoardTop = this.DEFAULT_DRAUGHTS_BOARD_TOP;
            this.draughtsBoardFrame = this.DEFAULT_DRAUGHTS_BOARD_FRAME;
            this.draughtsBoardFloor = this.DEFAULT_DRAUGHTS_BOARD_FLOOR;

            this.isSound = this.DEFAUTLT_IS_SOUND;
            this.isDragPiece = this.DEFAUTLT_IS_DRAG_PIECE;
            this.lightIntensity = this.DEFAULT_LIGHT_INTENSITY;
        }

        //for chess
        this._preSelectHoziListItemTheme(this.chessPiece2d, o.el_chess_piece_2d);
        this._preSelectHoziListItemTheme(this.chessPiece3d, o.el_chess_piece_3d);
        this._preSelectHoziListItemTheme(this.chessBoardTop, o.el_chess_board_top);
        this._preSelectHoziListItemTheme(this.chessBoardFrame, o.el_chess_board_frame);
        this._preSelectHoziListItemTheme(this.chessBoardFloor, o.el_chess_board_floor);

        //for draughts
        this._preSelectHoziListItemTheme(this.draughtsPiece2d, o.el_draughts_piece_2d);
        this._preSelectHoziListItemTheme(this.draughtsPiece3d, o.el_draughts_piece_3d);
        this._preSelectHoziListItemTheme(this.draughtsBoardTop, o.el_draughts_board_top);
        this._preSelectHoziListItemTheme(this.draughtsBoardFrame, o.el_draughts_board_frame);
        this._preSelectHoziListItemTheme(this.draughtsBoardFloor, o.el_draughts_board_floor);


        //preselect light intensity
        o.el_light.value = this.lightIntensity;

        //preselect sound
        o.el_sound.checked = this.isSound;

        //preselect drag piece
        o.el_drag_piece.checked = this.isDragPiece;

        if (reset) {
            this._localSaveOption('chessPiece2d', this.chessPiece2d);
            this._localSaveOption('chessPiece3d', this.chessPiece3d);
            this._localSaveOption('chessBoardTop', this.chessBoardTop);
            this._localSaveOption('chessBoardFrame', this.chessBoardFrame);
            this._localSaveOption('chessBoardFloor', this.chessBoardFloor);

            this._localSaveOption('draughtsPiece2d', this.draughtsPiece2d);
            this._localSaveOption('draughtsPiece3d', this.draughtsPiece3d);
            this._localSaveOption('draughtsBoardTop', this.draughtsBoardTop);
            this._localSaveOption('draughtsBoardFrame', this.draughtsBoardFrame);
            this._localSaveOption('draughtsBoardFloor', this.draughtsBoardFloor);

            this._localSaveOption('isSound', this.isSound);
            this._localSaveOption('isDragPiece', this.isDragPiece);
            this._localSaveOption('lightIntensity', this.lightIntensity);
            
            //fire the events
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_PIECE_2D_CHANGE);
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_PIECE_3D_CHANGE);
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_TOP_CHANGE);
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_FRAME_CHANGE);
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_BOARD_FLOOR_CHANGE);
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_SOUND_CHANGE);
            Main.event.fire(Ns.Const.EVT_GAME_OPTIONS_LIGHT_INTENSITY_CHANGE);

        }

    },

    get2DChessPieceTheme: function () {
        return this.chessPiece2d;
    },

    get2DDraughtsPieceTheme: function (pce) {//TODO
        return;
    },

    get3DChessPieceTheme: function () {
        //TODO
    },

    get3DDraughtsPieceTheme: function (pce) {//TODO
        return;
    },

    getChessBoardThemeUrl: function () {
        return "../resources/games/chess/board/themes/" + this.chessBoardTop + "/60.png";
    },

    getDraughtsBoardThemeUrl: function (inverted_board) {
        return "../resources/games/draughts/board/themes/" + this.draughtsBoardTop + "/60" + (inverted_board ? "-inverse" : "") + ".png";
    },

    getChessBoardFrameThemeUrl: function () {
        return "../resources/images/" + this.chessBoardFrame + ".jpg";
    },

    getDrauhtsBoardFrameThemeUrl: function () {
        return "../resources/images/" + this.draughtsBoardFrame + ".jpg";
    },

    getChessBoardFloorThemeUrl: function () {
        return "../resources/images/" + this.chessBoardFloor + ".jpg";
    },

    getDraughtsBoardFloorThemeUrl: function () {
        return "../resources/images/" + this.druahtsBoardFloor + ".jpg";
    },

    isSoundAllow: function () {
        return this.isSound;
    },

    isDragPieceAllow: function () {
        return this.isDragPiece;
    },

    getLightIntensity: function () {
        return this.lightIntensity;
    },

};

