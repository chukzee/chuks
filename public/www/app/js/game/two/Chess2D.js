
/* global Main, Ns */


Ns.game.two.Chess2D = {

    extend: 'Ns.game.AbstractBoard2D',

    constructor: function () {

        var obj = {
            match: 'game/Match'
        };

        Main.rcall.live(obj);

        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_PIECE_2D_CHANGE, this.onOptionPieceChange.bind(this));
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_BOARD_TOP_CHANGE, this.onOptionBoardTopChange.bind(this));
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_SOUND_CHANGE, this.onOptionSoundChange.bind(this));

    },

    getGameEngineWorkerJs: function () {
        return 'resources/game_engines/stockfish.js';
    },

    getGameEngineWorkerJsAsm: function () {
        return 'resources/game_engines/stockfish.asm.js';
    },

    getBestMoveFromGameEngineOutput: function (output) {
        var arr = output.split(' ');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === '') {//just in case there was multiple space delimiter in the output - though we expect single space delimiter
                arr.splice(i, 1);
                i--;
            }
        }
        if (arr[0] === 'bestmove' && arr[1]) {
            return arr[1];
        }

    },

    checkGameOver: function () {
        return this.internalGame.game_over();
    },

    getGameOverMessage: function () {

        var match = this.config.match;

        var messgage = '';
        if (this.internalGame.insufficient_material()) {
            messgage = 'Draw by insufficient material!';
        } else if (this.internalGame.in_threefold_repetition()) { // depends on the rule i think
            messgage = 'Draw by threefold repitition!';
        } else if (this.internalGame.in_stalemate()) {
            messgage = 'Draw by stalemate!';
        } else if (this.internalGame.in_draw()) {//at this point the draw should be due to fifty move rule 
            messgage = 'Draw by fifty move rule!';
        } else if (this.internalGame.in_checkmate()) {
            messgage = 'Checkmate! ';
            var side = this._winnerSide(true);
            var is_white_winner = side === 'w';
            if (this.config.white === true || this.config.white === false) {//must be true of false - own game view
                var user_id = Ns.view.UserProfile.appUser.user_id;
                var is_white_player = match.players[0].user_id === user_id;
                messgage += is_white_winner === is_white_player ? 'You win!' : 'You loss!';
            } else {//watch game view
                messgage += is_white_winner ? 'White wins!' : 'Black wins!';
            }
        }

        return messgage;
    },

    /**
     * must return 'w' for white and 'b' for black
     * @returns {unresolved}
     */
    getWinnerSide: function () {
        var chatemate = this.internalGame.in_checkmate();
        return this._winnerSide(chatemate);
    },

    _winnerSide: function (chatemate) {
        if (chatemate) {
            var turn = this.internalGame.turn();//the side to move that has been checkmated
            return turn === 'w' ? 'b' : 'w';//if white  then black is the winner and vice versa
        }
        return null;
    },

    getGamePostion: function () {
        return this.internalGame.fen();
    },

    getBoardThemeUrl: function () {
        return Ns.Options.getChessBoardThemeUrl();
    },

    getPieceTheme: function () {
        return Ns.Options.get2DChessPieceTheme();
    },

    setPieceAppearance: function (pceEl, piece_theme) {
        var type = pceEl.dataset.name.charAt(0);
        pceEl.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pceEl.dataset.color + type + '.png';
    },

    createPieceElement: function (pce, piece_theme) {
        var pieceElement = document.createElement('img');
        pieceElement.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
        pieceElement.dataset.color = pce.color;

        switch (pce.type) {
            case'k':
            {
                pieceElement.dataset.name = 'king';
                break;
            }
            case'q':
            {
                pieceElement.dataset.name = 'queen';
                break;
            }
            case'r':
            {
                pieceElement.dataset.name = 'rook';
                break;
            }
            case'n':
            {
                pieceElement.dataset.name = 'knight';
                break;
            }
            case'b':
            {
                pieceElement.dataset.name = 'bishop';
                break;
            }
            case'p':
            {
                pieceElement.dataset.name = 'pawn';
                break;
            }
        }

        return pieceElement;
    },
    pieceSquarRatio: function () {
        return 0.8;
    },

    isWhiteTurn: function () {
        return this.internalGame.turn() === 'w';
    },

    isWhite: function (pce) {
        return pce.color === 'w';
    },

    notationToPath: function (notation) {
        var moveObj = {from: null,
            to: null,
            promotion: null,
            is_capture: false,
            castle: null //k for king side and q for queen side castle
        };
        if (notation === '0-0' || notation === 'O-O') {
            moveObj.castle = 'k';//kingside or short castling
        } else if (notation === '0-0-0' || notation === 'O-O-O') {
            moveObj.castle = 'q';//queenside or long castling
        }  else if (notation.indexOf('-') > -1) {//e.g e2-e4 or e7-e8Q (queen promotion) 
            moveObj.from = notation.substring(0, 2);
            moveObj.to = notation.substring(3, 5);
            moveObj.promotion = notation.substring(5, notation.length);
        } else if (notation.indexOf('x') > -1) {//e.g e2xe4 or e7xe8Q (capture with queen promotion)
            moveObj.from = notation.substring(0, 2);
            moveObj.to = notation.substring(3, 5);
            moveObj.promotion = notation.substring(5, notation.length);
            moveObj.is_capture = true;
        } else {//eg. e2e4 or e7e8Q (queen promotion) - no move notation seperator
            moveObj.from = notation.substring(0, 2);
            moveObj.to = notation.substring(2, 4);
            moveObj.promotion = notation.substring(4, notation.length);
        }

        if (moveObj.promotion && moveObj.promotion.startsWith('=')) {//e.g e7e8=Q, e7-e8=Q, e7xe8=Q
            moveObj.promotion = moveObj.promotion.substring(1);
        }

        return moveObj;
    },

    makeMove: function (from, to, promotion, castle) {

        var resObj = {
            done: false,
            hasMore: false,
            capture: null,
            error: null,
            notation: null,
            board_position: null
        };

        if (from === to) {
            resObj.done = true; //just drop the piece
            return resObj;
        }

        var obj = {
            from: from,
            to: to//,
                    //promotion : TODO - see chessjs doc LATER for how to use this field 
        };

        var result = this.internalGame.move(obj, {sloppy: true});
        var cap;
        if (result && result.captured) {
            if (result.flags === 'e') {//en passant capture
                cap = this.enpassantCapturSquare(from, to);
            } else {
                cap = result.to;
            }
        }

        console.log(result);

        var err_msg = null;

        if (!result) {
            if (this.internalGame.in_check()) {
                err_msg = 'King in check!';
            } else {
                err_msg = 'Invalid move!';
            }
        }

        resObj.notation = !result ? null : result.from + (cap ? 'x' : '-') + result.to;
        resObj.board_position = this.internalGame.fen();
        resObj.done = result ? true : false;
        resObj.capture = cap;
        resObj.error = err_msg;

        return resObj;
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.get(sqn);
    },

    getBoardClass: function () {
        return 'game9ja-chess-board';
    },
    enpassantCapturSquare: function (from, to) {
        var to_col = to.charAt(0);
        var from_rank = from.charAt(1);
        var en_pass_cap_sq = to_col + from_rank;
        return en_pass_cap_sq;
    }
};