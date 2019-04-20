
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
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_BOARD_FRAME_CHANGE, this.onOptionBoardFrameChange.bind(this));
        Main.event.on(Ns.Const.EVT_GAME_OPTIONS_SOUND_CHANGE, this.onOptionSoundChange.bind(this));

    },

    getMoveSearcTime: function () {

        //TODO - The search time will depend on game difficulty level

        return 5000;
    },

    robotSearchMove: function (game_position) {

        this.gameEngineWorker.postMessage('position fen ' + game_position);
        this.gameEngineWorker.postMessage('go movetime ' + this.getMoveSearcTime());

    },

    getGameEngineWorkerJs: function () {
        return Main.pathname() + 'app/resources/game_engines/stockfish.js';
    },

    getGameEngineWorkerJsAsm: function () {
        return Main.pathname() + 'app/resources/game_engines/stockfish.asm.js';
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

    getBoardFrameThemeUrl: function () {
        return Ns.Options.getChessBoardFrameThemeUrl();
    },

    getPieceTheme: function () {
        return Ns.Options.get2DChessPieceTheme();
    },

    setPieceAppearance: function (pceEl, piece_theme) {
        var pce_name = pceEl.dataset.name;
        var type;
        if(pce_name === 'knight'){
            type = 'n';
        }else{
            type = pce_name.charAt(0);
        }
        pceEl.src = Main.pathname() + 'app/resources/games/chess/2D/pieces/' + piece_theme + '/' + pceEl.dataset.color + type + '.png';
    },

    promotePiece: function (pieceElement, promotion) {
        var color = pieceElement.dataset.color;
        var piece_theme = this.getPieceTheme();

        switch (promotion) {

            case'q':
            {
                pieceElement.src = Main.pathname() + 'app/resources/games/chess/2D/pieces/' + piece_theme + '/' + color + promotion + '.png';
                pieceElement.dataset.name = 'queen';
                break;
            }
            case'r':
            {
                pieceElement.src = Main.pathname() + 'app/resources/games/chess/2D/pieces/' + piece_theme + '/' + color + promotion + '.png';
                pieceElement.dataset.name = 'rook';
                break;
            }
            case'n':
            {
                pieceElement.src = Main.pathname() + 'app/resources/games/chess/2D/pieces/' + piece_theme + '/' + color + promotion + '.png';
                pieceElement.dataset.name = 'knight';
                break;
            }
            case'b':
            {
                pieceElement.src = Main.pathname() + 'app/resources/games/chess/2D/pieces/' + piece_theme + '/' + color + promotion + '.png';
                pieceElement.dataset.name = 'bishop';
                break;
            }
        }
    },

    createPieceElement: function (pce, piece_theme) {
        var pieceElement = document.createElement('img');
        pieceElement.src = Main.pathname() + 'app/resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
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

    needPromotion: function (from, to) {
        var ibPce = this.getInternalPiece(from);
        if (!ibPce) {
            return;
        }

        if (ibPce.type !== 'p') {
            return;
        }

        //At this point the piece is a pawn

        if (this.isWhiteTurn() && to.charAt(1) === '8') {
            return true;
        }

        if (!this.isWhiteTurn() && to.charAt(1) === '1') {
            return true;
        }

    },

    showPomotionDialog: function (from, to, callback) {

        if (!this.needPromotion(from, to)) {
            callback();
            return;
        }

        //At this piont the pawn must be promoted

        Ns.ui.Dialog.selectList({
            title: 'Promote Pawn',
            url: 'simple-list-a-tpl.html',
            multiSelect: false,
            items: ['Queen', 'Knight', 'Bishop', 'Rook'],
            width: 200,
            maxWidth: window.innerWidth * 0.8,
            onRender: function (tpl_var, data) {
                if (tpl_var === 'data') {
                    return data;
                }
            },
            onSelect: function (item) {
                item = item.toLowerCase();
                var promotion;
                if (item === 'queen') {
                    promotion = 'q';
                } else if (item === 'knight') {
                    promotion = 'n';//it is 'n' and not 'k'
                } else if (item === 'bishop') {
                    promotion = 'b';
                } else if (item === 'rook') {
                    promotion = 'r';
                }
                callback(promotion);
            }
        });

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

    notationToPath: function (notation, turn) {
        var moveObj = {from: null,
            to: null,
            promotion: null,
            is_capture: false,
            castle: null, //k for king side and q for queen side castle
            enpassant: null
        };
        if (notation === '0-0' || notation === 'O-O') {
            moveObj.castle = 'k';//kingside or short castling        
            var castleMoveObj = this.castleMoveObject(moveObj.castle, turn);
            moveObj.from = castleMoveObj.king_from;
            moveObj.to = castleMoveObj.king_to;
        } else if (notation === '0-0-0' || notation === 'O-O-O') {
            moveObj.castle = 'q';//queenside or long castling
            var castleMoveObj = this.castleMoveObject(moveObj.castle, turn);
            moveObj.from = castleMoveObj.king_from;
            moveObj.to = castleMoveObj.king_to;
        } else {
            if (notation.indexOf('x') > -1) {
                moveObj.is_capture = true;
            }
            notation = notation.replace('x', '');//e2xe4 to e2e4 (we already know it is capture move above)
            notation = notation.replace('-', '');//e2-e4 -> e2e4
            notation = notation.replace(' ', '');//e2 e4 -> e2e4

            moveObj.from = notation.substring(0, 2);
            moveObj.to = notation.substring(2, 4);

            var extra = notation.substring(4, notation.length);
            if (extra) {
                if (extra.indexOf('.') > -1) {//found e.p or the likes (may be)
                    moveObj.enpassant = true;
                } else {
                    extra = extra.toLowerCase();
                    moveObj.promotion = extra;
                    if (extra.startsWith('=')) {//e.g e7e8=Q, e7-e8=Q, e7xe8=Q
                        moveObj.promotion = extra.substring(1);
                    }
                }
            }

        }

        return moveObj;
    },

    makeMove: function (param) {

        var to, from, promotion, castleMoveObj, enpassant;

        if (typeof param === 'object') {
            to = param.to;
            from = param.from;
            promotion = param.promotion;
            enpassant = param.enpassant;
        } else if (typeof param === 'string') {
            param = this.notationToPath(param);
            to = param.to;
            from = param.from;
            promotion = param.promotion;
            enpassant = param.enpassant;
        } else {
            throw Error('invalid move parameter type - expect object or string');
        }

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

        var move_param = {
            from: from,
            to: to
        };

        if (promotion) {
            move_param.promotion = promotion;
        }

        var turn = this.isWhiteTurn();

        var result = this.internalGame.move(move_param, {sloppy: true});
        var cap;
        var promo;
        var castleMoveObj;
        if (result) {
            if (result.captured) {
                if (result.flags === 'e') {//en passant capture
                    cap = this.enpassantCapturSquare(from, to);
                } else {
                    cap = result.to;
                }
            }

            if (result.promotion) {
                promo = result.promotion;
            }

            if (result.flags === 'k' || result.flags === 'q') {
                castleMoveObj = this.castleMoveObject(result.flags, turn);
                resObj.from = castleMoveObj.king_from;
                resObj.to = castleMoveObj.king_to;
                resObj.another = {};
                resObj.another.from = castleMoveObj.rook_from;
                resObj.another.to = castleMoveObj.rook_to;
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

        resObj.notation = !result ? null : result.from + (cap ? 'x' : '-') + result.to + (promo ? promo : '');
        resObj.board_position = this.internalGame.fen();
        resObj.done = result ? true : false;
        resObj.capture = cap;
        resObj.promotion = promo;
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
        var enpassant_cap_sq = to_col + from_rank;
        return enpassant_cap_sq;
    },

    castleMoveObject: function (castle_flag, white_turn) {
        var cObj = {
            king_from: null,
            king_to: null,
            rook_from: null,
            rook_to: null
        };

        if (white_turn) {//1st rank
            if (castle_flag === 'k') {//kingside (short) castling
                cObj.king_from = 'e1';
                cObj.king_to = 'g1';
                cObj.rook_from = 'h1';
                cObj.rook_to = 'f1';
            } else {// === 'q' -> queenside (long) castling
                cObj.king_from = 'e1';
                cObj.king_to = 'c1';
                cObj.rook_from = 'a1';
                cObj.rook_to = 'd1';
            }
        } else {//8th rank
            if (castle_flag === 'k') {//kingside (short) castling
                cObj.king_from = 'e8';
                cObj.king_to = 'g8';
                cObj.rook_from = 'h8';
                cObj.rook_to = 'f8';
            } else {// === 'q' -> queenside (long) castling
                cObj.king_from = 'e8';
                cObj.king_to = 'c8';
                cObj.rook_from = 'a8';
                cObj.rook_to = 'd8';
            }
        }

        return cObj;
    }

};