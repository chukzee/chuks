
/* global Main, Ns */


Ns.game.two.Chess2D = {

    extend: 'Ns.game.AbstractBoard2D',

    constructor: function () {

        var obj = {
            match: 'game/Match'
        };

        Main.rcall.live(obj);

    },

    checkGameOver: function () {
        return this.internalGame.game_over();
    },

    getGameOverMessage: function () {

        var match = this.config.match;

        var messgage = '';
        if (this.internalGame.in_insufficient_material()) {
            messgage = 'Draw by insufficient material!';
        } else if (this.internalGame.in_threefold_repitition()) { // depends on the rule i think
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
        var arr;
        if (notation.indexOf('-') > -1) {
            arr = notation.split('-');
        } else {
            arr = notation.split('x');
        }
        return {from: arr[0], to: arr[1]};
    },

    makeMove: function (from, to) {

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