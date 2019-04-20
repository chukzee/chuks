
/* global Main, Ns */

Ns.game.AbstractBoard2D = {

    refStateIndex: 0, //will be incremented for each reload - a way of detecting view change to prevent asynchronous process corrupting the views
    config: null,
    moveResendCountdownFn: null,
    gameEngineWorker: null,
    isGameOver: false,
    internalGame: null, // the game engine. e.g chessj.s and my draftgame.js
    userSide: null, //whether 'b' or 'w'. ie black or white. default is null for watched game
    isBoardFlip: false, //whether black to white direction. default is white to black (false)
    ANIM_MAX_DURATION: 500,
    GAME_OVER_ALERT_DURATION: 15000,
    HOVER_SQUARE_STYLE: 'background: red', //TODO - use beautiful bacground, possibly beautiful imgage
    PICKED_SQUARE_STYLE: 'background: yellow', //TODO - use beautiful bacground, possibly beautiful imgage
    CAPTURED_SQUARE_STYLE: 'background: blue', //TODO - use beautiful bacground, possibly beautiful imgage

    /**
     * Loads and sets up the game on the specified contianer using
     * the provided game position. If the game position is not provided
     * then the starting position is setup. The provided theme is used
     * if provided otherwise the default is used.<br>
     * 
     * The argument is expected to be an object with the following 
     * properties:<br>
     * <br>
     * obj = {<br>
     *        container: 'the_container', //compulsory <br>
     *        variant:'the variant', //compulsory for draughts only <br>
     *        gamePosition: 'the_game_posiont', //optional<br>
     *        white: true, //whether the user is white or black. For watched games this field in absent<br>
     *        flip: true, //used in watched games only. whether the board should face black to white direction. ie black is below and white above<br>
     * }<br>
     *
     * The gameboard squares are indexed as illustrated below:
     * 
     *   +----+----+----+----+----+----+----+----+
     * 8 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 |
     *   +----+----+----+----+----+----+----+----+
     * 7 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 |
     *   +----+----+----+----+----+----+----+----+
     * 6 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 |
     *   +----+----+----+----+----+----+----+----+
     * 5 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
     *   +----+----+----+----+----+----+----+----+
     * 4 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 |
     *   +----+----+----+----+----+----+----+----+
     * 3 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
     *   +----+----+----+----+----+----+----+----+
     * 2 |  8 |  9 | 10 | 11 | 12 | 13 | 14 | 15 |
     *   +----+----+----+----+----+----+----+----+
     * 1 |  0 |  1 |  2 |  3 |  4 |  5 |  6 |  7 |
     *   +----+----+----+----+----+----+----+----+
     *      a    b    c    d    e    f    g    h
     *      
     * @param {type} internal_game
     * @param {type} config
     * @param {type} callback
     * @returns {undefined}
     */
    load: function (internal_game, config, callback) {
        this.refStateIndex++; //increment for each reload - a way of detecting view change to prevent asynchronous process corrupting the views
        this.config = config;
        this.squareList = {};
        this.squarePieces = [];
        this.hoverSquare = null;
        this.pickedSquare = null;
        this.captureSquareList = [];
        this.pickedPiece = null;
        this.boardRowCount = 8; //default is 8
        this.boardContainer = null;
        this.pieceWidth = null;
        this.pieceHeight = null;
        this.squareSize = null;
        this.boardX = -1;
        this.boardY = -1;
        this.boardRow = -1;
        this.boardCol = -1;
        this.boardSq = -1;
        this.startTouchBoardX = -1;
        this.startTouchBoardY = -1;
        this.startTouchBoardRow = -1;
        this.startTouchBoardCol = -1;
        this.startTouchBoardSq = -1;
        this.isTouchingBoard = false;
        this.retryWaitDuartion = 1;
        this.isCaptureAnim = false;
        this.isPieceAnim = false;

        this.stopGameEngineWorker();//stop previous running game engine since the game may be different e.g changing from chess to draughts

        if (config.variant) {
            var vrnt = this.getVariant(config.variant);
            var board_size = vrnt.size;
            var s = board_size.split('x'); //e.g 8x8, 10x10, 12x12
            this.boardRowCount = s[0] - 0;//implicitly convet to numeric
        }

        this.internalGame = internal_game;
        this.userSide = config.white === true ? 'w' : (config.white === false ? 'b' : null); //strictly true or false
        this.isBoardFlip = config.flip;

        var el = document.getElementById(config.container);

        var me = this;
        var extra_dom_prop = '_resizeBoardContainerHandler_game9ja'; // must be a constant - do not use datetime
        var old_handler = el[extra_dom_prop];
        if (old_handler) {//remove old handler
            el.addEventListener('resize', old_handler);
            el.addEventListener('orientationchange', old_handler);
        }

        var resizeBoardContainer = function (evt) {
            me.boardContainer = me.properlySizedBoardContainer(el, me.boardRowCount, config.invertedBoard);
        };

        el.addEventListener('resize', resizeBoardContainer);
        el.addEventListener('orientationchange', resizeBoardContainer);

        el[extra_dom_prop] = resizeBoardContainer; //register the handler for later removal

        resizeBoardContainer();

        el.innerHTML = '';//clear any previous
        el.appendChild(this.boardContainer);

        //var board_cls = this.getBoardClass(obj.invertedBoard);//@Deprecated

        var gameboard = this.board(this.boardContainer);

        this.boardContainer.appendChild(gameboard);

        this.displayTurn(this.config.match);

        /*@deprecated since we now use the rcall internal retry strategy to resend the move
         if (this.config.match && this.config.match._unsentGamePosition) {
         this.sendGameMove(this.config.match._unsentMove, this.config.match._unsentGamePosition);
         }*/

        if (!this.config._skipCheckUpdate) {
            this.checkUpdate(this.config.match);
        }

        delete this.config._skipCheckUpdate;

        this.isGameOver = this.checkGameOver();
        if (this.isGameOver) {
            this.displayGameOverMessage(this.config.match);
        } else if (this.config.white !== true && this.config.white !== false) {//spectator
            this.spectatorJoin(this.config.match);
        } else if (this.isRobotTurn(this.config.match)) {
            this._workerSendMove(this.config.match.game_position);
        }

        callback(this); // note for 3D which may be asynchronous this may not be call here but after the async proccess

    },

    /**
     * Creates a properly sized board container. This container is created
     * so that we can give it a proper size to avoid a situation where the
     * board theme image is not repeated evenly. If the width of the container
     * is not a multiple of the board number of rows then there is a possibity of 
     * the theme image not evenly repeated (a Bazaar look). 
     * Thus we will give a size which is the highest multiple of the
     * board number of rows closest to the size of the provided element
     * 
     * 
     * @param {type} el -  the provided element upon which we will create the board container
     * @param {Integer} row_count 
     * @param {Integer} inverted_board 
     * @returns {undefined}
     */
    properlySizedBoardContainer: function (el, row_count, inverted_board) {
    
        el.style.backgroundImage = 'url(' + this.getBoardFrameThemeUrl() + ')';
        el.style.backgroundRepeat = 'repeat';

        var proper_container = document.createElement('div');

        proper_container.style.backgroundImage = 'url(' + this.getBoardThemeUrl(inverted_board) + ')';
        proper_container.style.backgroundRepeat = 'repeat';
        proper_container.style.backgroundSize = 100 / (this.boardRowCount / 2) + '%';
        
        //console.log(proper_container.style.backgroundSize);
        
        var box = el.getBoundingClientRect();
        var padding = 10;
        var size = box.width - padding * 2;
        var row_width = Math.floor(size / row_count); // to ensure the board theme image is properly repeated

        var cont_size = row_width * row_count;
        proper_container.style.width = cont_size + 'px';
        proper_container.style.height = cont_size + 'px';

        proper_container.style.position = 'absolute';
        proper_container.style.top = (box.width - cont_size)/2 + 'px';
        proper_container.style.left = (box.width - cont_size)/2 + 'px';

        return proper_container;
    },

    spectatorJoin: function (match) {
        if (this.config.isTesting) {
            return;
        }

        var user_id = Ns.view.UserProfile.appUser.user_id;
        var prev_game_id = Ns.Spectators.currentWatchGameId;

        Ns.Spectators.currentWatchGameId = match.game_id; // set the current watched game id  

        Main.ro.spectator.join(user_id, match.game_id, prev_game_id, match.start_time)
                .get(function (data) {
                    //do nothing for now
                })
                .error(function (err, err_code, connect_err) {
                    console.log(err);
                });
    },

    isShowGameOverAlert: function () {
        var e = this.boardContainer.querySelector('div[data-alert="game_over"]');
        if (e) {
            return true;
        }
        return false;
    },

    getGameOverEl: function (match) {

        var el = document.createElement('div');

        el.setAttribute("data-alert", "game_over");

        el.style.position = 'absolute';
        el.style.top = '20%';
        el.style.left = this.squareSize * 0.95 + 'px';
        el.style.width = (this.squareSize * this.boardRowCount) - 2 * this.squareSize + 'px';
        el.style.background = 'linear-gradient(#333, #111)';
        el.style.borderRadius = '30px';
        el.style.zIndex = 1000;
        el.style.paddingTop = '5px';
        el.style.paddingBottom = '5px';
        el.style.textAlign = 'center';

        var gm_el = document.createElement('div');
        gm_el.innerHTML = 'GAME OVER';
        gm_el.style.fontFamily = 'Comic Sans MS';
        gm_el.style.fontWeight = 'bold';
        gm_el.style.fontSize = '24px';
        gm_el.style.color = 'red';

        var msg_el = document.createElement('div');
        msg_el.innerHTML = this.getGameOverMessage();
        msg_el.style.fontSize = '16px';
        msg_el.style.color = '#eee';


        el.appendChild(gm_el);
        el.appendChild(msg_el);

        if (match && match.current_set < match.sets.length) {
            var btn_el = document.createElement('div');
            btn_el.innerHTML = 'Next game starts shortly!';
            btn_el.style.fontSize = '14px';
            btn_el.style.color = '#eee';

            el.appendChild(btn_el);
        }

        return el;
    },

    onOptionPieceChange: function () {
        if (!this.squarePieces) {
            return;
        }
        for (var i = 0; i < this.squarePieces.length; i++) {
            var pce_el = this.squarePieces[i];
            if (!pce_el) {
                continue;
            }
            this.setPieceAppearance(pce_el, this.getPieceTheme());
        }
    },

    onOptionBoardTopChange: function () {
        if (!this.boardContainer) {
            return;
        }
        this.boardContainer.style.backgroundImage = 'url(' + this.getBoardThemeUrl(this.config.invertedBoard) + ')';
    },

    onOptionBoardFrameChange: function () {
        if (!this.boardContainer) {
            return;
        }
        this.boardContainer.parentNode.style.backgroundImage = 'url(' + this.getBoardFrameThemeUrl() + ')';
    },

    onOptionSoundChange: function () {
        alert('onOptionSoundChange');
    },

    getPieceTheme: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getBoardThemeUrl: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getBoardFrameThemeUrl: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    createPieceElement: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    setPieceAppearance: function (pceEl, piece_theme) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    pieceSquarRatio: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    isWhiteTurn: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    isWhite: function (pce) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getInternalPiece: function (sqn) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getBoardClass: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getGamePostion: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    makeMove: function (from, to) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    remoteMove: function (from, to) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    rcallSendMove: function (from, to) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    notationToPath: function (notation, turn) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    checkGameOver: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getGameOverMessage: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    showGameOver: function (match) {
        var me = this;
        me.clearFeedback();
        var game_over_el = this.getGameOverEl(match);
        this.boardContainer.appendChild(game_over_el);
        game_over_el.style.top = '10%';

        Main.anim.to(game_over_el, 300, {top: '20%'}, function () {
            var gel = this;
            window.setTimeout(function (el) {
                try {
                    me.boardContainer.removeChild(el);//remove the game over display
                } catch (e) {
                    console.log(e);
                }

                me.restartGame(match);

            }, me.GAME_OVER_ALERT_DURATION, gel);

        }.bind(game_over_el));
    },

    /**
     * must return 'w' for white and 'b' for black
     * @returns {unresolved}
     */
    getWinnerSide: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getBestMoveFromGameEngineOutput: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    /**
     * @returns {unresolved}
     */
    getGameEngineWorkerJs: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    /**
     * @returns {unresolved}
     */
    getGameEngineWorkerJsAsm: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    /**
     * @returns {unresolved}
     */
    promotePiece: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    showPomotionDialog: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    robotSearchMove: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    /**
     * The method is used to verify if the game view should be modified so as not
     * to corrupt the view with data of other games as the user moves (changes) from one view
     * to the other. Since some processes are asynchronous the views can get corrupt
     * with data from other views running asynchronously. So this method is a safety
     * method to prevent that. 
     * Call this method at the begining of any method that
     * may be called from any asynchronous process.
     *  
     * @param {type} match
     * @returns {Boolean}
     */
    checkAccess: function (match) {

        if (this.config.isTesting) {
            return true;
        }

        if (match.game_id !== this.config.match.game_id
                || Ns.ui.UI.selectedGame !== match.game_name) {
            return false; //we should only access if the expected game is in view
        }

        if (!$(this.boardContainer).is(':visible')) {
            return false; //we should only access if the view is showing
        }

        return true;
    },

    clearFeedback: function () {

        if (this.config.white === true || this.config.white === false) {//must be true of false
            this.feedbackEl({
                container: 'game-view-feedback',
                text: ''
            });
            this.feedbackEl({
                container: 'game-view-b-feedback',
                text: ''
            });
        } else {//watch game view
            this.feedbackEl({
                container: 'game-watch-white-feedback',
                text: ''
            });

            this.feedbackEl({
                container: 'game-watch-black-feedback',
                text: ''
            });
        }
    },

    isRobotTurn: function (match) {

        if (!this.checkAccess(match)) {
            return;
        }

        if (typeof match === 'undefined') {
            return;
        }

        if (this.isWhiteTurn() === match.robotSide) {
            return true;
        }

        if (typeof match.robotSide === 'undefined') {
            if (match.players[0].full_name === 'Robot' && this.isWhiteTurn()) {
                return true;
            }
            if (match.players[1].full_name === 'Robot' && !this.isWhiteTurn()) {
                return true;
            }
        }

    },

    displayTurn: function (match) {

        if (!this.checkAccess(match)) {
            return;
        }

        if (this.config.white === true || this.config.white === false) {//must be true of false - own game view

            this.feedbackEl({
                container: 'game-view-b-feedback',
                text: this.isWhiteTurn() === this.config.white ? "Your turn!" : "Opponent's turn!"
            });

            this.feedbackEl({
                container: 'game-view-feedback',
                text: this.isWhiteTurn() === this.config.white ? "Your turn!" : "Opponent's turn!"
            });


        } else {//watch game view
            this.feedbackEl({
                container: 'game-watch-feedback',
                text: this.isWhiteTurn() ? "White turn!" : "Black turn!"
            });

        }
    },

    displayGameOverMessage: function (match) {

        if (!this.checkAccess(match)) {
            return;
        }

        if (this.config.white === true || this.config.white === false) {//must be true of false - own game view

            this.feedbackEl({
                container: 'game-view-b-feedback',
                text: 'GAME OVER! ' + this.getGameOverMessage()
            });

            this.feedbackEl({
                container: 'game-view-feedback',
                text: 'GAME OVER! ' + this.getGameOverMessage()
            });

        } else {//watch game view
            this.feedbackEl({
                container: 'game-watch-feedback',
                text: 'GAME OVER! ' + this.getGameOverMessage()
            });

        }
    },

    /**
     * Display that the player is thinking
     * 
     * the expected fields of prop below
     * 
     * var prop = {
     *      game_id: ...,
     *      game_name:...,
     *      user_id:..., //the user id of player thinking
     * }
     * 
     * @param {type} prop
     * @returns {undefined}
     */
    displayThinking: function (prop) {

        if (!this.checkAccess(prop)) {
            return;
        }

        var match = this.config.match; //using this match object since prop contain subset of the match properties

        if (this.config.white === true || this.config.white === false) {//must be true of false
            this.feedbackEl({
                container: 'game-view-b-feedback',
                text: 'Thinking...'
            });

            this.feedbackEl({
                container: 'game-view-feedback',
                text: 'Thinking...'
            });


        } else {//watch game view
            var is_white = prop.user_id === match.players[0].user_id;
            this.feedbackEl({
                container: 'game-watch-white-feedback',
                text: is_white ? 'Thinking...' : ''
            });

            this.feedbackEl({
                container: 'game-watch-black-feedback',
                text: !is_white ? 'Thinking...' : ''
            });
        }
    },

    feedbackEl: function (obj) {
        var container;
        if (Main.util.isString(obj.container)) {
            container = obj.container.charAt('#') === 0 ? obj.container.substring(1) : obj.container;
        }

        var act_el = document.getElementById(container);

        if (!act_el) {
            return;
        }

        var cel, text_el, action_wrapper, action_el;

        cel = act_el.querySelector('span[data-game-feedback="content"]');

        if (cel) {
            text_el = cel.querySelector('span[data-game-feedback="text"]');
            action_el = cel.querySelector('a[data-game-feedback="action"]');
        } else {

            cel = document.createElement('span');
            cel.style.color = '#ddd';
            cel.setAttribute('data-game-feedback', 'content');

            text_el = document.createElement('span');
            text_el.setAttribute('data-game-feedback', 'text');

            action_wrapper = document.createElement('span');
            action_wrapper.style.marginLeft = '5px';
            action_el = document.createElement('a');
            action_el.style.cursor = 'pointer';
            action_el.style.color = '#00D800';//green
            action_el.setAttribute('data-game-feedback', 'action');

            cel.appendChild(text_el);
            cel.appendChild(action_wrapper);
            action_wrapper.appendChild(action_el);
            act_el.innerHTML = '';
            act_el.appendChild(cel);

        }

        if (typeof obj.text !== 'undefined' && obj.text !== null) {
            text_el.innerHTML = obj.text;
        } else {
            text_el.innerHTML = '';
        }

        if (obj.action) {
            action_el.style.display = 'inline-block';
            action_el.innerHTML = obj.action.text;
            action_el.onclick = obj.action.fn;
        } else {
            action_el.style.display = 'none';
        }


    },

    remoteMakeMove: function (notation, match) {

        if (!this.checkAccess(match)) {
            return;
        }

        this.clearFeedback();

        var path = this.notationToPath(notation, this.isWhiteTurn());

        var me = this;
        var _to = path.to;
        var index = -1;
        if (Main.util.isArray(path.to)) {
            index = 0;
            _to = path.to[index];
        }

        doRemoteMove.call(me, path.from, _to, path.promotion, index);

        function doRemoteMove(from, to, promotion, index) {
            var move = {from: from, to: to, promotion: promotion};
            var moveResult = me.makeMove(move);

            try {

                me.validateMoveResult(moveResult);

                me.markCapturedPiece(moveResult);

                var pce_from = from;
                if (index > 0) {
                    pce_from = path.to[index - 1];
                }

                var to_num = me.toNumericSq(to);
                var from_num = me.toNumericSq(pce_from);
                var to_num2, from_num2;
                if (moveResult.another) {//castle
                    to_num2 = me.toNumericSq(moveResult.another.to);
                    from_num2 = me.toNumericSq(moveResult.another.from);
                }

                if (me.isBoardFlip) {
                    to_num = me.flipSquare(to_num);
                    from_num = me.flipSquare(from_num);
                    to_num2 = me.flipSquare(to_num2);
                    from_num2 = me.flipSquare(from_num2);
                }

                me.movePiece({
                    from: from_num,
                    to: to_num,
                    another: moveResult.another ? {from: from_num2, to: to_num2} : null,
                    promotion: moveResult.promotion,
                    capture: moveResult.capture,
                    callback: moveCallback.bind(moveResult, match)
                });

                function moveCallback(match) {

                    me.isGameOver = me.checkGameOver();

                    var move_result = this;

                    me.afterMoveComplete(match, move_result);

                    if (move_result.done || move_result.error) {
                        return;
                    }
                    var to_sq = path.to;
                    if (Main.util.isArray(path.to)) {
                        ++index;
                        to_sq = path.to[index];
                    }

                    doRemoteMove.call(me, path.from, to_sq, path.promotion, index);
                }

            } catch (e) {
                console.log(e);
            }

            if (moveResult.done || moveResult.error) {

                me.updateRobotMatch(match, moveResult);

                if (moveResult.board_position === match.game_position) {
                    me.setMatch(match);
                    me.displayTurn(match);
                    return; //all is well
                }
                if (moveResult.error) {//this should not happen
                    console.log('Something is wrong - opponent or remote player move generate error!', moveResult.error);
                } else {//board positions is different (incorrect). likely cause is none up-to-date match object
                    console.log('Something is wrong - opponent or remote player move cause inconsistent board position!', moveResult.error);
                }

                //So, reload the game with the match object passed as parament to remoteMakeMove
                me.reloadGame(match);

                return;
            }

        }

    },

    restartGame: function (match, toast_text) {
        match.game_position = null;

        delete match._unsentMove;
        delete match._unsentGamePosition;

        this.reloadGame(match, toast_text);
    },

    reloadGame: function (match, toast_text) {

        if (!this.checkAccess(match)) {
            return;
        }

        var obj = this.config;
        if (match) {
            obj.match = match;
        }

        obj._skipCheckUpdate = true;

        Ns.ui.GamePanel.loadGame(obj);

        if (typeof toast_text !== 'undefined' && toast_text !== null) {
            Main.toast.show(toast_text);
        }

        return true;
    },

    updateRobotMatch: function (match, moveResult) {
        if (match && match.robot === true) {
            //since the robot is played locally just update
            //the match object game position and move counter
            match.game_position = moveResult.board_position;
            match.move_counter++;
            this.setMatch(match);
        }
    },

    setMatch: function (match) {

        if (!this.checkAccess(match)) {
            return;
        }

        if (match) {
            this.config.match = match;
        }

    },

    checkUpdate: function (match) {

        if (this.config.isTesting) {
            return;
        }

        Main.ro.match.checkMatchUpdate(match.game_id, match.current_set, match.move_counter, match.game_position)
                .get(function (data) {
                    Main.event.fire(Ns.Const.EVT_UPDATE_MATCH, data);
                })
                .error(function (err, err_code, connect_err) {
                    if (connect_err) {
                        Main.toast.show('Please check connection. Could not check game update!');
                    } else {
                        Main.toast.show('Could not check game update!');
                    }
                    console.log(err);
                });
    },

    sendGameMove: function (move_notation, game_position) {

        this.feedbackEl({
            container: 'game-view-feedback',
            text: 'Sending...'
        });

        if (this.config.communication === 'internet') {
            this._internetSendMove(move_notation, game_position);
        } else if (this.config.communication === 'bluetooth') {
            this._bluetoothSendMove(move_notation, game_position);
        } else if (this.config.communication === 'worker') {
            this._workerSendMove(game_position);
        }

    },

    _internetSendMove: function (move_notation, game_position) {

        this.config.match._unsentMove = move_notation;
        this.config.match._unsentGamePosition = game_position;
        Ns.Match.updateMatchList(this.config.match);

        Main.countdown.stop(this.moveResendCountdownFn);

        var winner_user_id = null;//must the initialized as null
        if (this.isGameOver) {
            var win_side = this.getWinnerSide();
            if (win_side === 'w') {
                winner_user_id = this.config.match.players[0].user_id;
            }
            if (win_side === 'b') {
                winner_user_id = this.config.match.players[1].user_id;
            }
        }

        var me = this;

        var user_id = Ns.view.UserProfile.appUser.user_id;
        var player_id_1 = this.config.match.players[0].user_id;
        var player_id_2 = this.config.match.players[1].user_id;
        var opponent_id = player_id_1 !== user_id ? player_id_1 : player_id_2;

        var data = {
            user_id: user_id,
            opponent_ids: opponent_id, //opponent(s) - can be array of opponents ids or a single string of opponent id
            next_turn_player_user_id: opponent_id, //next turn player id
            game_name: this.config.match.game_name,
            game_id: this.config.match.game_id,
            current_set: this.config.match.current_set,
            move_counter: this.config.match.move_counter,
            notation: move_notation,
            game_position: game_position,
            is_game_over: this.isGameOver,
            winner_user_id: winner_user_id
        };

        function bindFn() {
            return me.config.match;
        }

        var is_sent = false;
        me.moveResendCountdownFn = function (value, finish) {
            if (is_sent) {
                return;
            }
            me.feedbackEl({
                container: 'game-view-feedback',
                text: 'Resend move in ' + value + ' sec...',
                action: {
                    text: 'Retry now',
                    fn: Main.rcall.resend  //resend any pending request immediately
                }
            });

        };

        Main.ro.match.sendMove(data, bindFn)
                .timeout(Ns.Const.SEND_MOVE_TIMEOUT)
                .retry(function (sec_remaining) {//retry on connection failure
                    var matchObj = this;
                    if (!me.checkAccess(matchObj)) {//the view has changed
                        return;//so leave
                    }

                    Main.countdown.stop(me.moveResendCountdownFn);
                    Main.countdown.start(me.moveResendCountdownFn, sec_remaining);

                })
                .get(function (res) {

                    is_sent = true;

                    var matchObj = this;
                    if (!me.checkAccess(matchObj)) {//the view has changed
                        return;
                    }


                })
                .error(function (err, err_code, connect_err) {

                    console.log(err);

                    Main.toast.show(err);

                    var matchObj = this;
                    if (!me.checkAccess(matchObj)) {//the view has changed
                        return;//so leave
                    }

                    if (!connect_err) { //if not a connection problem
                        me.reloadGame(me.config.match);
                        return;
                    }


                });


    },

    _bluetoothSendMove: function (move_notation, game_position, is_game_over, winner_user_id) {

        console.log('TODO _bluetoothSendMove - send move via bluetooth');


    },

    _workerSendMove: function (game_position) {

        if (typeof window.Worker === 'undefined') {
            return;
        }

        var match = this.config.match;

        if (!this.gameEngineWorker) {
            if (Main.util.isWebAssemblySupported()) {
                this.gameEngineWorker = new Worker(this.getGameEngineWorkerJs());
            } else {
                this.gameEngineWorker = new Worker(this.getGameEngineWorkerJsAsm());
            }
        }

        this.robotSearchMove(game_position);

        this.displayThinking(match);

        var me = this;
        this.gameEngineWorker.onmessage = onWorkerMessage.bind(this.config.match);
        this.gameEngineWorker.onerror = onWorkerError.bind(this.config.match);

        function onWorkerMessage(evt) {

            var best_move = me.getBestMoveFromGameEngineOutput(evt.data);
            if (!best_move) {
                return;
            }

            var matchObj = this;
            if (!me.checkAccess(matchObj)) {//the view has changed
                return;
            }


            me.remoteMakeMove(best_move, matchObj);

        }

        function onWorkerError(evt) {
            var matchObj = this;
            if (!me.checkAccess(matchObj)) {//the view has changed
                return;
            }

            console.error(evt);

        }
    },

    stopGameEngineWorker: function () {
        if (this.gameEngineWorker) {
            this.gameEngineWorker.terminate();
            this.gameEngineWorker = undefined;//so we can reuse it!
        }
    },

    arrangeBoard: function (container, piece_theme) {
        var box = container.getBoundingClientRect();

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;
        var ratio = this.pieceSquarRatio();
        if (!ratio) {
            ratio = 0.8;
        }
        var pw = sq_w * ratio; // piece width
        var ph = sq_h * ratio; //piece height
        this.pieceWidth = pw;
        this.pieceHeight = ph;
        this.squareSize = sq_w;

        //range pieces
        var SQ_COUNT = this.boardRowCount * this.boardRowCount;
        for (var i = 0; i < SQ_COUNT; i++) {
            var sq = i;

            var sqn = this.toSquareNotation(sq);
            var ibPce = this.getInternalPiece(sqn);
            if (!ibPce) {
                continue;
            }


            if (this.isBoardFlip) {
                sq = this.flipSquare(sq);
            }

            //create piece element

            var pe = this.createPieceElement(ibPce, piece_theme);

            pe.dataset.type = "piece";
            pe.style.width = pw + 'px';
            pe.style.height = ph + 'px';

            var center = this.squareCenter(sq);
            var py = center.y - ph / 2;
            var px = center.x - pw / 2;
            pe.style.cursor = 'pointer';
            pe.style.position = 'absolute';
            pe.style.top = py + 'px';
            pe.style.left = px + 'px';

            this.squarePieces[sq] = pe;

            container.appendChild(pe);

            //console.log(ibPce);
            //console.log(pe.getBoundingClientRect());
        }

    },

    board: function (container) {
        var table = document.createElement('table');
        //table.className = board_cls;/*Deprecated*/

        table.style.width = '100%';
        table.style.height = '100%';
        table.style.borderCollapse = 'collapse';

        var me = this;

        var clickBoard = function (evt) {
            me.onClickBoard(evt, this);
        };

        var touchStartBoard = function (evt) {
            me.onTouchStartBoard(evt, this);
        };

        var hoverBoard = function (evt) {
            me.onHoverBoard(evt, this);
        };

        var hoverBoardEnd = function (evt) {
            me.onHoverBoardEnd(evt, this);
        };


        if (this.userSide) {//enable board listener only if the user is playing game

            var is_event_set = '_is_Board_Event_Set';

            if (!container[is_event_set]) {
                if (Main.device.isMobileDeviceReady) {
                    container.addEventListener('touchstart', touchStartBoard);
                    container.addEventListener('touchmove', hoverBoard);
                    container.addEventListener('touchend', hoverBoardEnd);
                    container.addEventListener('touchcancel', hoverBoardEnd);
                } else {
                    container.addEventListener('click', clickBoard);
                    container.addEventListener('mousemove', hoverBoard);
                    container.addEventListener('mouseleave', hoverBoardEnd);//mouseout behaviour is not appropriate because is fires for every children
                }
                container[is_event_set] = true;
            }
        }


        for (var i = 0; i < this.boardRowCount; i++) {
            var tr = document.createElement('tr');
            tr.style.border = 'none';
            for (var k = 0; k < this.boardRowCount; k++) {
                var td = document.createElement('td');
                td.style.border = 'none';
                td.dataset.square = '';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }


        var rw = table.children;
        var sq = -1;
        for (var i = rw.length - 1; i > -1; i--) {
            var sqs = rw[i].children;
            for (var k = 0; k < sqs.length; k++) {
                sq++;
                this.squareList[sq] = sqs[k];
                this.squareList[sq].dataset.square = sq;//for identifying the squares
            }
        }

        this.arrangeBoard(container, this.getPieceTheme());

        return table;
    },
    toNumericSq: function (notation) {

        notation = notation + "";
        var a = notation.charAt(0);
        var b = notation.substring(1);
        var b = (b - 1) * this.boardRowCount - 1;

        switch (a) {
            case 'a':
                a = 1;
                break;
            case 'b':
                a = 2;
                break;
            case 'c':
                a = 3;
                break;
            case 'd':
                a = 4;
                break;
            case 'e':
                a = 5;
                break;
            case 'f':
                a = 6;
                break;
            case 'g':
                a = 7;
                break;
            case 'h':
                a = 8;
                break;
            case 'i':
                a = 9;
                break;
            case 'j':
                a = 10;
                break;
            case 'k':
                a = 11;
                break;
            case 'l':
                a = 12;
                break;
        }


        return b + a;
    },
    toSquareNotation: function (sq) {

        var row = Math.floor(sq / this.boardRowCount);
        var col = sq % this.boardRowCount;
        row += 1;
        switch (col) {
            case 0:
                col = 'a';
                break;
            case 1:
                col = 'b';
                break;
            case 2:
                col = 'c';
                break;
            case 3:
                col = 'd';
                break;
            case 4:
                col = 'e';
                break;
            case 5:
                col = 'f';
                break;
            case 6:
                col = 'g';
                break;
            case 7:
                col = 'h';
                break;
            case 8:
                col = 'i';
                break;
            case 9:
                col = 'j';
                break;
            case 10:
                col = 'k';
                break;
            case 11:
                col = 'l';
                break;
        }

        return col + row;
    },

    movePiece: function (mObj) {
        var target = mObj.pce,
                from = mObj.from,
                to = mObj.to,
                another = mObj.another, //in the castle of castle, holds the rook 'from' and 'to'
                capture = mObj.capture,
                promotion = mObj.promotion,
                callback = mObj.callback;


        if (another) {
            window.setTimeout(this.movePiece.bind(this), 0, another);
        }

        if (!target) {
            target = this.getPieceOnSquare(from);
            if (!target) {
                console.warn('piece not found on sqare ', from);
                return;
            }
        }

        //capture piece
        if (capture) {
            this.capturePiece(capture);
        }
        var from_pos;
        for (var i = 0; i < this.squarePieces.length; i++) {
            if (target === this.squarePieces[i]) {
                from_pos = i;
                this.squarePieces[i] = null; //remove from old location
                break;
            }
        }

        this.squarePieces[to] = target;// new location

        var from_center = this.squareCenter(from_pos);
        var from_y = from_center.y - this.pieceHeight / 2;
        var from_x = from_center.x - this.pieceWidth / 2;

        var to_center = this.squareCenter(to);
        var to_y = to_center.y - this.pieceHeight / 2;
        var to_x = to_center.x - this.pieceWidth / 2;

        var dx = Math.abs(from_x - to_x);
        var dy = Math.abs(from_y - to_y);

        var prop = {
            top: to_y,
            left: to_x
        };
        var me = this;

        target.style.zIndex = 1000; // so as to fly over
        var dist = Math.sqrt(dx * dx + dy * dy);
        var board_width = this.boardContainer.getBoundingClientRect().width;

        this.isPieceAnim = true;

        Main.anim.to(target, this.ANIM_MAX_DURATION * dist / board_width, prop, function () {

            me.isPieceAnim = false;

            //making sure the piece is on the right spot just in
            //case the orientation changes or the board is resized
            to_center = me.squareCenter(to);
            to_y = to_center.y - me.pieceHeight / 2;
            to_x = to_center.x - me.pieceWidth / 2;
            target.style.top = to_y + 'px';
            target.style.left = to_x + 'px';
            target.style.zIndex = null;
            if (promotion) {
                me.promotePiece(target, promotion);
            }
            if (Main.util.isFunc(callback)) {
                callback();
            }
        });

    },
    /**
     * The method is required if the board is flipped
     *  black-to-white direction.ie black is down and white up
     *  @argument {Integer} sq 
     */
    flipSquare: function (sq) {
        var row = Math.floor(sq / this.boardRowCount);
        var col = sq % this.boardRowCount;

        var flip_row = this.boardRowCount - row - 1;
        var flip_col = this.boardRowCount - col - 1;

        var flip_sq = flip_row * this.boardRowCount + flip_col;

        return flip_sq;
    },
    squareCenter: function (sq) {

        var box = this.boardContainer.getBoundingClientRect();
        var center_x, center_y;

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;

        var row = Math.floor(sq / this.boardRowCount);
        var col = this.boardRowCount - sq % this.boardRowCount - 1;

        center_x = (this.boardRowCount - col) * sq_w - sq_w / 2;
        center_y = (this.boardRowCount - row) * sq_h - sq_h / 2;

        return {
            x: center_x,
            y: center_y
        };
    },

    highlightSquare: function (sqEl, style) {
        if (sqEl) {
            sqEl.style = style;
        }
    },

    getPieceOnSquare: function (sq) {
        //var center = this.squareCenter(sq);
        return this.squarePieces[sq];
    },

    pickPieceOnSquare: function (sq) {
        if (this.pickedPiece) {
            return;
        }

        this.pickedPiece = this.getPieceOnSquare(sq);

        this.pickedPiece.style.zIndex = 1000;
    },

    capturePiece: function (capture) {

        if (capture.constructor === Array) {//an array
            for (var i = 0; i < capture.length; i++) {
                capture[i] = this.toNumericSq(capture[i]);
            }
        } else {//not an array
            capture = [this.toNumericSq(capture)]; //mare array
        }

        var me = this;

        //remove captured piece from the board
        for (var i = 0; capture && i < capture.length; i++) {

            var cap_sq = capture[i];

            if (this.isBoardFlip) {//new
                cap_sq = this.flipSquare(cap_sq);
            }

            var pce = this.squarePieces[cap_sq];

            this.squarePieces[cap_sq] = null;// clear the square
            var box = pce.getBoundingClientRect();
            var dist = box.width ? box.width : '200';
            var hd = dist / 2;
            dist = '-' + dist + 'px';
            hd = '-' + hd + 'px';

            if (i === 0) {
                me.isCaptureAnim = true;
            }
            pce.style.zIndex = 1000; // so as to fly over
            Main.anim.to(pce, 1000, {top: dist}, function () {

                me.isCaptureAnim = false;

                var pce_el = this;
                var disappear = {opacity: 0, width: 0, height: 0, top: hd}; //make the piece disappear

                Main.anim.to(pce_el, 1000, disappear, function () {
                    pce_el.style.zIndex = null;
                });
            }.bind(pce));
        }


    },

    isPieceMoving: function () {
        return this.isPieceAnim || this.isCaptureAnim;
    },

    undoMove: function (from, to) {
        //TODO
    },

    markCapturedPiece: function (moveResult) {
        if (moveResult.mark_capture) {
            var cap_sq = this.toNumericSq(moveResult.mark_capture);

            if (this.isBoardFlip) {//new
                cap_sq = this.flipSquare(cap_sq);
            }

            if (this.squareList[cap_sq]) {
                this.highlightSquare(this.squareList[cap_sq], this.CAPTURED_SQUARE_STYLE);
                this.captureSquareList.push(this.squareList[cap_sq]);
            }

        }
    },

    afterMoveComplete: function (match, moveResult) {
        var me = this;
        if (moveResult.done && this.isGameOver) {
            me.showGameOver(match);
        }

        if (moveResult.done || moveResult.error) {
            this.pickedSquare = null;
            this.pickedPiece = null;
            var capSqLst = this.captureSquareList;
            this.captureSquareList = [];
            window.setTimeout(function (me, el_list) {
                for (var i = 0; i < el_list.length; i++) {
                    me.highlightSquare(el_list[i], '');//remove the highlight
                }
            }, 300, this, capSqLst);
        }
    },

    _doMakeMove: function (picked_from_sq, picked_to_sq, from_pos, to_pos, promotion) {
        var me = this;
        // NOTE it is valid for 'from square' to be equal to 'to square'
        //especially in the game of draughts in a roundabout trip capture
        //move where the jumping piece eventaully returns to its original 
        //square. So it is upto the subsclass to check for where 'from square'
        //ie equal to 'to square' where necessary  an code accordingly

        var moveResult = this.makeMove({from: from_pos, to: to_pos, promotion: promotion});

        //validate the move result returned by the subclass.
        //the result must contain neccessary fields
        this.validateMoveResult(moveResult);

        this.isGameOver = this.checkGameOver();

        this.updateRobotMatch(this.config.match, moveResult);

        if (moveResult.done
                && moveResult.notation
                && !moveResult.error
                && !this.config.isTesting) {

            this.sendGameMove(moveResult.notation, moveResult.board_position);
        }


        this.markCapturedPiece(moveResult);

        var bndMoveAnimComplete = moveAnimComplete.bind(moveResult, this.config.match);

        var to_num2, from_num2;
        if (moveResult.another) {//castle
            to_num2 = this.toNumericSq(moveResult.another.to);
            from_num2 = this.toNumericSq(moveResult.another.from);

            if (this.isBoardFlip) {
                to_num2 = this.flipSquare(to_num2);
                from_num2 = this.flipSquare(from_num2);
            }
        }


        if (moveResult.error) {

            Main.toast.show(moveResult.error);

            console.log('move error:', moveResult.error);

            //animate the piece by to the original position
            this.movePiece({
                pce: this.pickedPiece, //can become null if orientation change so 'from' field can be used to obtain the picked piece
                from: picked_from_sq, //this can be used to obatin the picked piece if orientation change and the board is refreshed
                to: picked_from_sq, //Yes! return back
                capture: null,
                promotion: moveResult.promotion,
                callback: bndMoveAnimComplete
            });
            //this.movePiece(this.pickedPiece, pk_sq, null, bndMoveAnimComplete);
        } else {
            this.movePiece({
                pce: this.pickedPiece, //can become null if orientation change so 'from' field can be used to obtain the picked piece
                from: picked_from_sq, //this can be used to obatin the picked piece if orientation change and the board is refreshed
                to: picked_to_sq,
                another: moveResult.another ? {from: from_num2, to: to_num2} : null,
                capture: moveResult.capture,
                promotion: moveResult.promotion,
                callback: bndMoveAnimComplete
            });
            //this.movePiece(this.pickedPiece, this.boardSq, moveResult.capture, bndMoveAnimComplete);
        }

        function moveAnimComplete(match) {
            var move_result = this;
            //nullify the picked square if move is completed or a move error occur                
            me.afterMoveComplete(match, move_result);
        }

    },

    playPiece: function () {
        var me = this;
        var picked_from_sq = this.pickedSquare.dataset.square;
        var picked_to_sq = this.boardSq;
        var from = this.toSquareNotation(picked_from_sq);
        var to = this.toSquareNotation(picked_to_sq);
        var from_pos = from, to_pos = to;

        if (this.isBoardFlip) {
            from_pos = this.flipSquare(picked_from_sq);
            from_pos = this.toSquareNotation(from_pos);

            to_pos = this.flipSquare(this.boardSq);
            to_pos = this.toSquareNotation(to_pos);
        }

        this.showPomotionDialog(from_pos, to_pos, function (promotion) {
            me._doMakeMove(picked_from_sq, picked_to_sq, from_pos, to_pos, promotion);
        });


    },

    validateMoveResult: function (moveResult) {
        if (!('done' in moveResult)) {
            throw Error('Move result returned by subcalss must contain the field, "done"');
        } else if (!('hasMore' in moveResult)) {
            throw Error('Move result returned by subcalss must contain the field, "hasMore"');
        } else if (!('error' in moveResult)) {
            throw Error('Move result returned by subcalss must contain the field, "error"');
        } else if (!('capture' in moveResult)) {
            throw Error('Move result returned by subcalss must contain the field, "capture"');
        } else if (!('notation' in moveResult)) {
            throw Error('Move result returned by subcalss must contain the field, "notation"');
        } else if (!('board_position' in moveResult)) {
            throw Error('Move result returned by subcalss must contain the field, "board_position"');
        }
    },

    onClickBoard: function (evt, container, is_tap) {

        if (this.isPieceMoving()) {//block user iteraction on the board
            return;
        }

        var me = this;
        if (this.isGameOver) {
            return;
        }

        if (is_tap) {
            this.boardX = this.startTouchBoardX;
            this.boardY = this.startTouchBoardY;
            this.boardRow = this.startTouchBoardRow;
            this.boardCol = this.startTouchBoardCol;
            this.boardSq = this.startTouchBoardSq;

        } else {
            this.boardXY(container, evt, is_tap);
        }


        if (this.pickedSquare) {
            if (this.captureSquareList.indexOf(this.pickedSquare) === -1) {
                this.highlightSquare(this.pickedSquare, '');//remove the highlight
            }

            if (this.pickedPiece) {
                this.playPiece();
            }

            return;
        }

        if (!Main.device.isMobileDeviceReady) {//desktop

            if (evt.target.dataset.type !== 'piece') {//must click the piece not the container
                return;
            }
        }

        var sq = this.boardSq;
        var sq_pos = sq;
        if (this.isBoardFlip) {
            sq_pos = this.flipSquare(sq_pos);
        }

        var sqn = this.toSquareNotation(sq_pos);

        var ibPce = this.getInternalPiece(sqn);
        if (!ibPce) {
            console.log('No piece on internal board square -', sqn);
            return;
        }
        var turn = this.isWhiteTurn();
        var side = this.userSide === 'w';
        if ((ibPce
                && turn === side)
                || this.config.isTesting
                ) {
            this.pickedSquare = this.squareList[sq];
            this.highlightSquare(this.pickedSquare, this.PICKED_SQUARE_STYLE);
            this.pickPieceOnSquare(sq);
        }

    },
    onTouchStartBoard: function (evt, container) {

        if (this.isPieceMoving()) {//block user iteraction on the board
            return;
        }

        if (this.isGameOver) {
            return;
        }

        if (evt.touches) {
            if (evt.touches.length === 1) {
                evt.preventDefault();//important!
                this.boardXY(container, evt, true);
            }
        }
    },
    onHoverBoard: function (evt, container) {

        if (this.isPieceMoving()) {//block user iteraction on the board
            return;
        }

        if (this.isGameOver) {
            return;
        }

        if (evt.touches) {
            if (evt.touches.length === 1) {
                evt.preventDefault();
                this.boardXY(container, evt);
                this.isTouchingBoard = true;
            }
        } else {
            //mouse move
            this.boardXY(container, evt);
        }

        if (this.pickedPiece && !this.pickedPiece.style.zIndex) {
            this.pickedPiece.style.zIndex = 1000;
        }

        if (this.pickedPiece && Ns.Options.isDragPiece) {
            //drag piece
            py = this.boardY - this.pieceHeight / 2;
            px = this.boardX - this.pieceWidth / 2;
            this.pickedPiece.style.top = py + 'px';
            this.pickedPiece.style.left = px + 'px';
        }

        var sq = this.boardSq;
        if (this.squareList[sq] === this.pickedSquare) {
            if (this.hoverSquare !== this.pickedSquare) {
                if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                    this.highlightSquare(this.hoverSquare, '');//remove the highlight
                }
            }
            return;
        }

        if (this.hoverSquare !== this.pickedSquare) {
            if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
        }
        this.hoverSquare = this.squareList[sq];
        if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
            this.highlightSquare(this.hoverSquare, this.HOVER_SQUARE_STYLE);
        }

    },

    onHoverBoardEnd: function (evt) {

        if (this.isPieceMoving()) {//block user iteraction on the board
            return;
        }

        if (this.isGameOver) {
            return;
        }

        if (evt.touches && !this.isTouchingBoard) {// tap detected
            this.onClickBoard(null, null, true);
            return;
        }
        this.boardX = -1;
        this.boardY = -1;
        this.isTouchingBoard = false;
        if (this.hoverSquare !== this.pickedSquare) {
            if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
        }
    },
    boardXY: function (container, e, is_start_touch) {
        var posx = 0;
        var posy = 0;

        if (!e)
            var e = window.event;
        if (e.touches && e.touches.length) {
            posx = e.touches[0].pageX;
            posy = e.touches[0].pageY;
        } else if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
        }
        // posx and posy contain the mouse position relative to the document

        var box = container.getBoundingClientRect();
        var x = posx - box.left;
        var y = posy - box.top;

        //row and col

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;

        if (Main.device.isMobileDeviceReady
                && !Main.device.isLarge()) {//for only smart phones and tablets of medium size
            //Now make the y offset allow easy pick of piece especailly on small device
            if (y < box.height - sq_h / 2) {//above middle of first row
                y -= sq_h; // offset y by square height
            }
        }

        var row = Math.floor((box.height - y) / sq_h);
        var col = this.boardRowCount - Math.floor((box.width - x) / sq_w) - 1;


        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        if (x > box.width) {
            x = box.width;
        }
        if (y > box.height) {
            y = box.height;
        }


        if (row < 0
                || col < 0
                || row > this.boardRowCount - 1
                || col > this.boardRowCount - 1) {//OFF BOARD

            this.boardX = x;
            this.boardY = y;
            this.boardRow = -1;
            this.boardCol = -1;
            this.boardSq = -1;
            //Clear highlighted squares
            if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
            this.hoverSquare = null;
            //console.log('leave');
            return;
        }


        /*if (this.isBoardFlip) {
         row = this.boardRowCount - row - 1;
         col = this.boardRowCount - col - 1;
         }*/


        var sq = row * this.boardRowCount + col;

        if (is_start_touch) {
            this.startTouchBoardX = x;
            this.startTouchBoardY = y;
            this.startTouchBoardRow = row;
            this.startTouchBoardCol = col;
            this.startTouchBoardSq = sq;
        } else {
            this.boardX = x;
            this.boardY = y;
            this.boardRow = row;
            this.boardCol = col;
            this.boardSq = sq;
        }


        //console.log(posx, posy);
        //console.log(x, y);
        //console.log('x=', x, 'y=', y, 'row=', row, 'col=', col, 'sq=', sq);

    }
};