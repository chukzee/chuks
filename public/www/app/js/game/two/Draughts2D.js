
/* global Main, Ns */


/* global Main, Ns */


Ns.game.two.Draughts2D = {

    extend: 'Ns.game.AbstractBoard2D',
    capturePath: [],

    constructor: function () {

        var obj = {
            match: 'game/Match'
        };

        Main.rcall.live(obj);

        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_PIECE_2D_CHANGE, this.onOptionPieceChange.bind(this));
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_BOARD_TOP_CHANGE, this.onOptionBoardTopChange.bind(this));
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_BOARD_FRAME_CHANGE, this.onOptionBoardFrameChange.bind(this));
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_SOUND_CHANGE, this.onOptionSoundChange.bind(this));

    },

    robotSearchMove: function (game_position) {
        var obj = {
            position: game_position,
            depth: 9
        };

        this.gameEngineWorker.postMessage(JSON.stringify(obj));

    },

    getGameEngineWorkerJs: function () {
        return Main.pathname() + 'app/resources/game_engines/draftgame.js';
    },

    getGameEngineWorkerJsAsm: function () {
        return Main.pathname() + 'app/resources/game_engines/draftgame.js';
    },

    getBestMoveFromGameEngineOutput: function (output) {
        /*var arr = output.split(' ');
         for (var i = 0; i < arr.length; i++) {
         if (arr[i] === '') {//just in case there was multiple space delimiter in the output - though we expect single space delimiter
         arr.splice(i, 1);
         i--;
         }
         }
         if (arr[0] === 'bestmove' && arr[1]) {
         return arr[1];
         }*/
        var best_move = JSON.parse(output);

        return best_move.notation;
    },

    checkGameOver: function () {
        //first check the match status field because in the case of draw offer
        //the internal game cannot tell if there was a draw offer
        if (this.config.match && this.config.match.status === 'finish') {
            return true;
        }
        return this.internalGame.isGameOver();
    },
    getGameOverMessage: function () {
        var messgage = '';
        var is_white_winner;
        var is_draw;
        var match = this.config.match;
        //first check the match status field because in the case of draw offer
        //the internal game cannot tell if there was a draw offer
        if (match.status === 'finish') {
            if (match.winner) {
                is_white_winner = match.players[0].user_id === match.winner;
            } else {
                is_draw = true;
            }
        } else if (this.internalGame.isGameOver()) {
            is_white_winner = this.internalGame.getWinner() === 'w';
            is_draw = !this.internalGame.getWinner();
        } else {
            return '';
        }

        //At this point the game is over

        messgage = '';
        if (is_draw) {
            messgage += 'Draw!';
        } else if (this.config.white === true || this.config.white === false) {//must be true of false - own game view
            var user_id = Ns.view.UserProfile.appUser.user_id;
            var is_white_player = match.players[0].user_id === user_id;
            messgage += is_white_winner === is_white_player ? 'You win!' : 'You loss!';
        } else {//watch game view
            messgage += is_white_winner ? 'White wins!' : 'Black wins!';
        }


        return messgage;
    },

    /**
     * must return 'w' for white and 'b' for black
     * @returns {unresolved}
     */
    getWinnerSide: function () {
        return this.internalGame.getWinner();
    },

    getGamePostion: function () {
        return this.internalGame.toFEN();
    },

    getBoardThemeUrl: function (inverted_board) {
        return Ns.Options.getDraughtsBoardThemeUrl(inverted_board);
    },

    getBoardFrameThemeUrl: function () {
        return Ns.Options.getDraughtsBoardFrameThemeUrl();
    },

    getPieceTheme: function () {
        return Ns.Options.get2DDraughtsPieceTheme();
    },

    setPieceAppearance: function (pceEl, piece_theme) {

    },

    crownPieceElement: function (pieceElement) {

        var crownEl = document.createElement('span');
        crownEl.className = "fa fa-crown";
        crownEl.style.fontSize = '11px';
        crownEl.style.color = '#ccc';
        crownEl.style.textAlign = 'center';
        crownEl.style.width = '100%';
        crownEl.style.height = '100%';

        crownEl.dataset.type = pieceElement.dataset.type;

        pieceElement.appendChild(crownEl);
    },

    promotePiece: function (pieceElement, promotion) {

        if (pieceElement.dataset.crowned === 'true') { // yes string 'true' since not boolean value in html
            return;//already crowned
        }

        pieceElement.dataset.crowned = 'true';
        this.crownPieceElement(pieceElement);
    },

    showPomotionDialog: function (from, to, callback) {
        callback();
    },

    createPieceElement: function (pce, piece_theme) {
        var pieceElement = document.createElement('div');
        pieceElement.className = pce.white ? 'white-piece-o' : 'black-piece-o';

        if (pce.crowned) {
            this.crownPieceElement(pieceElement);
        } else {
            pieceElement.dataset.crowned = 'false';
        }

        return pieceElement;
    },

    pieceSquarRatio: function () {
        return 0.6;
    },

    isWhiteTurn: function () {
        return this.internalGame.turn;
    },

    isWhite: function (pce) {
        return pce.white;
    },

    notationToPath: function (notation) {
        var from, to;
        if (notation.indexOf('-') > -1) {
            var arr = notation.split('-');
            from = arr[0];
            to = arr[1];
        } else {
            var arr = notation.split('x');
            to = [];
            for (var i = 0; i < arr.length; i++) {
                if (i === 0) {
                    from = arr[i];
                } else {
                    to.push(arr[i]);
                }
            }
        }
        return {from: from, to: to};
    },

    makeMove: function (param) {
        var to, from;
        if (typeof param === 'object') {
            to = param.to;
            from = param.from;
        } else if (typeof param === 'string') {
            param = this.notationToPath(param);
            to = param.to;
            from = param.from;
        } else {
            throw Error('invalid move parameter type - expect object or string');
        }

        var caps = this.internalGame.capturableSAN(from);
        var resObj = {
            done: false,
            hasMore: false, //whether jumping in on
            capture: null, //capture squares
            error: null,
            notation: null,
            board_position: null
        };

        if (!caps) {
            resObj.done = false;
            resObj.hasMore = false;
            resObj.error = 'unexpected result! may be cause by no piece on internal board square or less likely, internal board piece square error - see respective internal game caller method.';
            return;
        }

        //we know caps is two dimensional array
        if (caps.length > 0 && caps[0].length > 0) {//capture
            if (!this.capturePath) {
                this.capturePath = [];
            }
            var last = this.capturePath[this.capturePath.length - 1];
            if (last !== to) {//avoid a situation when the player click on same square more than once
                this.capturePath.push(to);
            }

            //check if the player is moving on a valid capture path
            var all_match;
            var match_len;
            var cap_move;
            var cap_sq = -1;
            for (var i = 0; i < caps.length; i++) {
                var p = caps[i];
                if (this.capturePath.length <= p.length) {
                    all_match = true;
                    match_len = p.length;
                    cap_move = from;
                    cap_sq = -1;
                    for (var k = 0; k < this.capturePath.length; k++) {
                        if (this.capturePath[k] !== p[k].to_sq) {
                            all_match = false;
                            break;
                        }
                        cap_sq = p[k].cap_sq;
                        cap_move += 'x' + this.capturePath[k];
                    }
                    if (all_match) {
                        break;
                    }
                }
            }

            if (all_match && match_len === this.capturePath.length) {
                var result = this.internalGame.move(cap_move);
                resObj.done = !result.error;
                resObj.hasMore = false;
                resObj.mark_capture = cap_sq;  // for the purpose of highlighting captured square
                resObj.capture = result.capture;
                resObj.error = result.error;
                resObj.notation = result.notation;
                resObj.board_position = result.board_position;
                resObj.promotion = result.promotion;
            } else if (all_match && this.capturePath.length < match_len) {
                resObj.done = false;
                resObj.hasMore = true;
                resObj.mark_capture = cap_sq; // for the purpose of highlighting captured square
                resObj.error = null;
            } else {//some did not match so error
                resObj.done = false;
                resObj.hasMore = false;
                resObj.error = 'Invalid capture path!';
            }

        } else if (to !== from) {
            var result = this.internalGame.move(from + '-' + to);
            resObj.done = !result.error;
            resObj.hasMore = false;
            resObj.error = result.error;
            resObj.notation = result.notation;
            resObj.board_position = result.board_position;
            resObj.promotion = result.promotion;
        } else {//where to === from
            resObj.done = true;//just drop the piece
        }

        if (resObj.done || resObj.error) {
            this.capturePath = [];
        }


        return resObj;
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.getPiece(sqn);
    },

    getBoardClass: function (inverse_board) {
        if (inverse_board) {
            return 'game9ja-draughts-board-inverse';
        } else {
            return 'game9ja-draughts-board';
        }
    },
    getVariant: function (variant) {
        var v = {};
        switch (variant) {
            case'international-draughts':
                {
                    v.name = 'international-draughts';
                    v.size = '10x10';
                    //v.rule =... TODO
                }
                break;
            case'english-draughts':
                {
                    v.name = 'english-draughts';
                    v.size = '8x8';
                    //v.rule =... TODO
                }
                break;
            case'american-draughts':
                {
                    v.name = 'american-draughts';
                    v.size = '8x8';
                    //v.rule =... TODO
                }
                break;
        }

        return v;
    }
};