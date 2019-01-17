
var draft = {};

var Draughts = draftFn.bind(draft); //bind the 'this' of draftFn to draft - this technique is twice faster than not using the bind method - I have tested it!!!

function draftFn(size) {
    this.MAX_VALUE = 1000000;
    this.turn = true; //white
    this.board = [];
    this.pieces = [];
    this.SIZE = 10; //default is 10 by 10
    this.SQ_COUNT;
    this.OFF_BOARD;
    this.LAST_SQ_INDEX;
    this.whiteCount = 0;
    this.blackCount = 0;
    this.whiteKingCount = 0;
    this.blackKingCount = 0;
    this.DEPTH = 5;
    this.lastError = null;
    this.SAN = {}; // Mapping for the Standard Algebraic Notation (SAN) to the internal square number (or square index).
    this.NN = {};// Mappping for the  Numeric Notation (NN) to the internal square number (or square index).
    this.SqNumber = {};// Mapping for the internal square number (or square index) to the Standard Algebraic Notation (SAN) and Numeric Notation (NN).
    var eval_count = 0;
    var prune_count = 0;
    var node_count = 0;
    this.DefaultBoardPostion = {
        turn: true, //white
        size: 0, //set automatically upon initialization
        pieces: null //set automatically upon initialization
    };
    var up_right = 1,
            up_left = 2,
            down_right = 3,
            down_left = 4;

    var REVERSE_DIRECTION = [];
    BoardPieceCount = {//these are the supported
        10: 40, //10 x 10 = 40 pieces
        8: 24 // 8 x 8    = 24 pieces
    };
    REVERSE_DIRECTION[up_right] = down_left;
    REVERSE_DIRECTION[up_left] = down_right;
    REVERSE_DIRECTION[down_right] = up_left;
    REVERSE_DIRECTION[down_left] = up_right;

    this.LOOKUP_DIRECTIONS = ['SquareRightUp', 'SquareLeftUp', 'SquareRightDown', 'SquareLeftDown'];

    this.FROM_SQUARE_MASK = 127;// 0 - 127 with max 127
    this.TO_SQUARE_MASK = 127;// 0 - 127 with max 127 

    this.FROM_SQUARE_SHIFT = 0;
    this.TO_SQUARE_SHIFT = this.FROM_SQUARE_SHIFT + 7;

    this.getBoard = function () {
        return this.board;
    };
    /*
     * Set the current board position of the game.
     * This method takes a string or an object as parameter<br>
     * 
     * If the parameter is string then it is assumed to be the game
     * position represent in Forsyth-Edwards Notation FEN<br> 
     * 
     * If the parameter is an object the following compulsory properties
     * must be provided:<br>
     * 
     * turn -  player's turn. ie white or black<br>
     * size - The size of the game<br>
     * pieces - The pieces on the board or the entire pieces of the game.<br>
     *          NOTE: if only the pieces on the board are provided, the rest <br>
     *          will be automaticcally set with their square location set to<br>
     *          OFF_BOARD and other default properties.<br>
     * 
     * @param {type} boardPositonObj
     * @return {undefined}
     */
    this.boardPosition = function (board_positon) {
        if (typeof board_positon === 'string') {
            board_positon = parseFEN.call(this, board_positon);
        }

        if (board_positon.turn !== true && board_positon.turn !== false) {
            throw new Error("board position must have the turn set to true or false");
        }
        var brd_size = board_positon.size - 0;//implicitly convert to numeric
        if (isNaN(brd_size)) {
            throw new Error("board size must be a number");
        }

        this.turn = board_positon.turn;
        initBoard.call(this, brd_size);
        var gm_pieces = board_positon.pieces;

        //validate pieces : e.g check for duplicate piece id ; check piece properties
        for (var i = 0; i < gm_pieces.length; i++) {
            for (var k = 0; k < gm_pieces.length; k++) {
                if (k === i) {
                    continue;
                }
                if (gm_pieces[i].id !== null
                        && typeof gm_pieces[i].id !== "undefined"
                        && gm_pieces[i].id === gm_pieces[k].id) {
                    throw new Error("duplicate piece id - " + gm_pieces[i].id);
                }
            }

            if (!isSquare(gm_pieces[i].sqCap) && gm_pieces[i].sqCap !== this.OFF_BOARD) {
                throw new Error("piece sqCap must be a valid square or OFF_BOARD value ");
            }

            if (!isSquare(gm_pieces[i].sqLoc)) {
                throw new Error("piece sqLoc must be a valid square");
            }

            if (gm_pieces[i].white !== true && gm_pieces[i].white !== false) {
                throw new Error("piece must be white or black");
            }

            if (gm_pieces[i].crowned !== true && gm_pieces[i].crowned !== false) {
                throw new Error("piece crowned must be a true or false");
            }
        }

        if (board_positon.pieces.length < BoardPieceCount[this.SIZE]) {
            //first count white and black captured
            var w = 0;
            var b = 0;
            for (var i = 0; i < gm_pieces.length; i++) {
                if (gm_pieces[i].white) {
                    w++;
                } else {
                    b++;
                }
            }

            var cw = BoardPieceCount[this.SIZE] / 2 - w;
            var cb = BoardPieceCount[this.SIZE] / 2 - b;

            if (cw < 0 || cb) {
                throw new Error("number of " + (cw ? "white" : "black") + " pieces is greater than maximum of " + BoardPieceCount[SIZE] / 2);
            }

            //white off board
            for (var i = 0; i < cw; i++) {
                gm_pieces.push(new Piece(this.OFF_BOARD, true, false));
            }
            //black off board
            for (var i = 0; i < cb; i++) {
                gm_pieces.push(new Piece(this.OFF_BOARD, false, false));
            }

        }

        for (var i = 0; i < gm_pieces.length; i++) {
            var pce = gm_pieces[i];
            this.setPiece(pce.sqLoc, pce.white, pce.crowned);
        }

        //now prevserse the ids
        for (var i = 0; i < gm_pieces.length; i++) {
            var pce = gm_pieces[i];
            if (pce.sqLoc === this.pieces[i].sqLoc
                    && pce.id !== this.pieces[i].id) {
                this.pieces[i].id = pce.id;//set the id
                //now check if any other id already has this id
                for (var k = 0; k < gm_pieces.length; k++) {
                    if (k === i) {
                        continue;//skip
                    }

                    if (this.pieces[i].id === pce.id) {//found so cancel the id
                        this.pieces[i].id = null;//cancel in the meantime
                    }
                }
            }
        }

        //now reassign any cancelled id and set captured pieces
        for (var i = 0; i < this.pieces.length; i++) {

            if (!this.pieces[i].id && this.pieces[i].id !== 0) {
                for (var id = 0; id < this.pieces.length; id++) {
                    var found = false;
                    //check if it already exist
                    for (var k = 0; k < this.pieces.length; k++) {
                        if (id === this.pieces[i].id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //does not ready exist so assign it.
                        this.pieces[i].id = id;
                    }
                }
            }

        }

        //finally
        boardPiecesCount.call(this);
    };

    function parseFEN(fen) {
        var position = {
            turn: null,
            size: this.SIZE,
            pieces: null
        };

        if (fen.charAt(0) !== '[' || fen.charAt(fen.length - 1) !== ']') {
            throw Error('Invalid FEN  - openning or closing square brackets missing!');
        }

        fen = fen.substring(1, fen.length - 1);

        fen = fen.split(' ');

        if (fen[0] !== 'FEN') {
            throw Error('Invalid FEN  - missing FEN header!');
        }

        if (fen.length > 2) {
            throw Error('Invalid FEN  - space is not allowed in FEN body and only a single space can separate the header and body!');
        }

        fen = fen[1];

        if (!fen) {
            throw Error('Invalid FEN  - missing FEN body');
        }

        if (fen.charAt(0) !== '"' || fen.charAt(fen.length - 1) !== '"') {
            throw Error('Invalid FEN body  - openning or closing double quote missing!');
        }

        fen = fen.split(':');
        if (fen[0] === 'W' || fen[0] === 'w') {
            position.turn = true;//white
        } else if (fen[0] === 'B' || fen[0] === 'B') {
            position.turn = false;//black
        } else {
            throw Error('Invalid FEN body - invalid turn token, expecte W or B!');
        }

        var w_pos, b_pos;
        if (fen[1].charAt(0) === 'W' || fen[1].charAt(0) === 'w') {
            w_pos = fen[1];
        } else if (fen[1].charAt(0) === 'B' || fen[1].charAt(0) === 'b') {
            b_pos = fen[1];
        } else if (fen[2].charAt(0) === 'W' || fen[2].charAt(0) === 'w') {
            w_pos = fen[2];
        } else if (fen[2].charAt(0) === 'B' || fen[2].charAt(0) === 'b') {
            b_pos = fen[2];
        }

        if (!w_pos) {
            throw Error('Invalid FEN body - white game position missing!');
        }

        if (!b_pos) {
            throw Error('Invalid FEN body - black game position missing!');
        }

        w_pos = w_pos.substring(1);
        b_pos = b_pos.substring(1);

        if (w_pos.indexOf(',') > -1) {
            w_pos = w_pos.split(',');
        } else {
            w_pos = w_pos.split('-');
            w_pos[0] = w_pos[0] - 0;//implicitly convert to numeric
            w_pos[1] = w_pos[1] - 0;//implicitly convert to numeric
            var w_p = [];
            if (w_pos.length > 2) {
                throw Error('Invalid FEN body - invalid  white game position!');
            }
            if (isNaN(w_pos[0]) || isNaN(w_pos[1])) {
                throw Error('Invalid FEN body - invalid token in white game position!');
            }
            for (var i = w_pos[0]; i < w_pos[1] + 1; i++) {
                w_p.push(i);
            }
            w_pos = w_p;
        }

        if (b_pos.indexOf(',') > -1) {
            b_pos = b_pos.split(',');
        } else {
            b_pos = b_pos.split('-');
            b_pos[0] = b_pos[0] - 0;//implicitly convert to numeric
            b_pos[1] = b_pos[1] - 0;//implicitly convert to numeric
            var b_p = [];
            if (b_pos.length > 2) {
                throw Error('Invalid FEN body - invalid  black game position!');
            }
            if (isNaN(b_pos[0]) || isNaN(b_pos[1])) {
                throw Error('Invalid FEN body - invalid token in black game position!');
            }
            for (var i = b_pos[0]; i < b_pos[1] + 1; i++) {
                b_p.push(i);
            }
            b_pos = b_p;
        }

        position.pieces = [];

        for (var i = 0; i < w_pos.length; i++) {
            var sq = w_pos[i];
            var crowned = false;
            if (sq.charAt(0) === 'K' || sq.charAt(0) === 'k') {
                sq = sq.substring(1);
                crowned = true;
            }

            if (isNaN(sq)) {//possibly Standard Algebraic Notation
                sq = this.SAN[sq];
            } else {//posibly Numeric Notation
                sq = this.NN[sq];
            }

            if (!sq && sq !== 0) {
                throw Error('Invalid FEN body - invalid token in white game position!');
            }

            if (sq >= this.SQ_COUNT) {
                throw Error('Invalid FEN body - white piece location out of range!');
            }

            var pce = new Piece(sq, true, crowned);
            position.pieces.push(pce);
        }


        for (var i = 0; i < b_pos.length; i++) {
            var sq = b_pos[i];
            var crowned = false;
            if (sq.charAt(0) === 'K' || sq.charAt(0) === 'k') {
                sq = sq.substring(1);
                crowned = true;
            }

            if (isNaN(sq)) {//possibly Standard Algebraic Notation
                sq = this.SAN[sq];
            } else {//posibly Numeric Notation
                sq = this.NN[sq];
            }

            if (!sq && sq !== 0) {
                throw Error('Invalid FEN body - invalid token in black game position!');
            }

            if (sq >= this.SQ_COUNT) {
                throw Error('Invalid FEN body - black piece location out of range!');
            }

            var pce = new Piece(sq, false, crowned);
            position.pieces.push(pce);
        }

        return position;
    }

    function initNotations() {

        for (var i = 1; i < this.SIZE + 1; i++) {
            for (var col_index = 0; col_index < this.SIZE; col_index++) {
                var prop = toRowChar.call(this, col_index) + i;
                this.SAN[prop] = toSquareInternal.call(this, prop);
            }
        }

        for (var i = 1; i < this.SQ_COUNT / 2 + 1; i++) {
            this.NN[i] = toSquareInternal.call(this, i);
        }


        for (var i = 0; i < this.SQ_COUNT; i++) {
            this.SqNumber[i] = {};
            for (var n in this.SAN) {
                if (this.SAN[n] === i) {
                    this.SqNumber[i].SAN = n;
                    break;
                }
            }

            for (var n in this.NN) {
                if (this.NN[n] === i) {
                    this.SqNumber[i].NN = n;
                    break;
                }
            }
        }

    }
    ;

    function boardPiecesCount() {

        this.whiteCount = 0;
        this.blackCount = 0;
        this.whiteKingCount = 0;
        this.blackKingCount = 0;

        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].white && this.pieces[i].sqLoc !== this.OFF_BOARD) {
                this.whiteCount++;
                if (this.pieces[i].crowned) {
                    this.whiteKingCount++;
                }
            }

            if (!this.pieces[i].white && this.pieces[i].sqLoc !== this.OFF_BOARD) {
                this.blackCount++;
                if (this.pieces[i].crowned) {
                    this.blackKingCount++;
                }
            }

        }

        //console.log('whiteCount ', whiteCount);
        //console.log('blackCount ', blackCount);
        //console.log('whiteKingCount ', whiteKingCount);
        //console.log('blackKingCount ', blackKingCount);
    }
    this.getPiece = function(sq_notation){
        var sq = this.SAN[sq_notation];
        return this.board[sq].piece;
    };
    
    this.setPiece = function (sq, white, crowned) {

        var r = (this.SIZE - 2) / 2;
        var square = {};

        var pce;

        if (!this.board[sq] || !this.board[sq].piece) {
            for (var i = 0; i < this.pieces.length; i++) {
                if (this.pieces[i].sqLoc === this.OFF_BOARD) {
                    pce = this.pieces[i];
                    break;
                }
            }
        } else {
            pce = this.board[sq].piece;
        }

        if (!pce) {
            pce = new Piece(); // dummy piece any! just to avoid NullPionterException
        }

        var row = getRow(sq);
        var col = getCol(sq);

        if (arguments.length === 1) {
            if (sq <= this.SIZE * r) {
                pce.white = true;
            } else if (sq >= this.SIZE * (this.SIZE - r)) {
                pce.white = false;
            }
        } else {
            pce.white = white;
            pce.crowned = crowned;
        }

        /*
         console.log("----------------- ");
         console.log("sq ", sq);
         console.log("row ", row);
         console.log("col ", col);
         console.log("----------------- ");
         */

        if (row % 2 === 0) {
            if (col % 2 === 0) {
                square.dark = true;
            } else {
                square.dark = false;
            }
        } else {
            if (col % 2 === 0) {
                square.dark = false;
            } else {
                square.dark = true;
            }
        }

        var isEmptySq = square.dark === false
                || ((sq >= this.SIZE * r && sq < this.SIZE * (this.SIZE - r)) && arguments.length === 1);


        square.sq = sq;
        square.row = row;
        square.col = col;
        square.leftUp = leftUp(sq);
        square.rightUp = rightUp(sq);
        square.leftDown = leftDown(sq);
        square.rightDown = rightDown(sq);

        square.piece = !isEmptySq ? pce : null;
        if (square.piece) {
            square.piece.sqLoc = sq;
        }

        if (!this.board[sq]) {
            this.board[sq] = square;
        } else {
            this.board[sq].piece = square.piece;
        }

        //finally
        boardPiecesCount.call(this);
    };

    initBoard.call(this, size);

    function initBoard(size) {

        this.board = [];
        this.pieces = [];

        if (size) {
            this.SIZE = size;
        }

        this.DefaultBoardPostion.size = this.SIZE;

        this.SQ_COUNT = this.SIZE * this.SIZE;
        this.OFF_BOARD = this.SQ_COUNT;
        this.LAST_SQ_INDEX = this.SQ_COUNT - 1;

        //initialize pieces array
        for (var i = 0; i < BoardPieceCount[this.SIZE]; i++) {
            this.pieces.push(new Piece());
            this.pieces[i].sqLoc = this.OFF_BOARD;

            //NOTE: The piece id must only be used by the game engine. It must not be
            //used in other purposes unless if the board in well synchronize between the
            //remote players, otherwise it may cause some hard-to-find bug

            this.pieces[i].id = i;
        }

        var len = this.SQ_COUNT;

        this.board[this.SQ_COUNT] = {};
        this.board[this.SQ_COUNT].sq = this.OFF_BOARD;
        this.board[this.SQ_COUNT].row = this.OFF_BOARD;
        this.board[this.SQ_COUNT].col = this.OFF_BOARD;
        this.board[this.SQ_COUNT].rightUp = this.OFF_BOARD;
        this.board[this.SQ_COUNT].leftUp = this.OFF_BOARD;
        this.board[this.SQ_COUNT].rightDown = this.OFF_BOARD;
        this.board[this.SQ_COUNT].leftDown = this.OFF_BOARD;

        this.board[this.SQ_COUNT].SquareRightUp = this.board[this.SQ_COUNT];
        this.board[this.SQ_COUNT].SquareLeftUp = this.board[this.SQ_COUNT];
        this.board[this.SQ_COUNT].SquareRightDown = this.board[this.SQ_COUNT];
        this.board[this.SQ_COUNT].SquareLeftDown = this.board[this.SQ_COUNT];

        for (var i = 0; i < len; i++) {
            this.setPiece(i);
        }

        for (var i = 0; i < this.SQ_COUNT; i++) {
            this.board[i].SquareRightUp = this.board[this.board[i].rightUp];
            this.board[i].SquareLeftUp = this.board[this.board[i].leftUp];
            this.board[i].SquareRightDown = this.board[this.board[i].rightDown];
            this.board[i].SquareLeftDown = this.board[this.board[i].leftDown];
        }

        this.DefaultBoardPostion.pieces = this.pieces;

        initNotations.call(this);
    }


    function Piece(sq, white, crowned) {
        //the piece id is set during board initializatin - see initBoard function
        //NOTE: The piece id must only be used by the game engine. It must not be
        //used in other purposes unless if the board in well synchronize between the
        //remote players, otherwise it may cause some hard-to-find bug
        if (arguments.length === 0) {
            this.sqLoc = draft.OFF_BOARD;
            this.sqCap = draft.OFF_BOARD;//square captured from
            this.white = true;
            this.crowned = false;
        } else {
            this.sqLoc = sq;
            this.sqCap = draft.OFF_BOARD;//square captured from
            this.white = white;
            this.crowned = crowned;
        }

        return this;
    }

    function getRow(sq) {
        return sq > -1 && sq < draft.SQ_COUNT ? Math.floor(sq / draft.SIZE) : null;
    }

    function getCol(sq) {

        return sq > -1 && sq < draft.SQ_COUNT ? (sq % draft.SIZE) : null;
    }

    function leftUp(sq) {
        if (sq > -1 && sq < draft.SQ_COUNT) {
            var loc = sq + draft.SIZE - 1;
            if (getRow(sq) + 1 !== getRow(loc)
                    || loc > draft.LAST_SQ_INDEX) {
                return draft.OFF_BOARD;
            }
            return loc;
        }
        return draft.OFF_BOARD;
    }

    function  rightUp(sq) {
        if (sq > -1 && sq < draft.SQ_COUNT) {
            var loc = sq + draft.SIZE + 1;
            if (getRow(sq) + 1 !== getRow(loc)
                    || loc > draft.LAST_SQ_INDEX) {
                return draft.OFF_BOARD;
            }
            return loc;
        }
        return draft.OFF_BOARD;
    }

    function leftDown(sq) {
        if (sq > -1 && sq < draft.SQ_COUNT) {
            var loc = sq - draft.SIZE - 1;
            if (getRow(sq) - 1 !== getRow(loc)
                    || loc < 0) {
                return draft.OFF_BOARD;
            }
            return loc;
        }
        return draft.OFF_BOARD;
    }

    function rightDown(sq) {
        if (sq > -1 && sq < draft.SQ_COUNT) {
            var loc = sq - draft.SIZE + 1;
            if (getRow(sq) - 1 !== getRow(loc)
                    || loc < 0) {
                return draft.OFF_BOARD;
            }
            return loc;
        }
        return draft.OFF_BOARD;
    }

    function tranverseSq(sq, diagonal, fn, done, argu) {
        var next = diagonal(sq);
        if (!isSquare(next)) {
            if (done) {
                return done(argu);
            }
            return;
        }
        if (fn(next, argu) === false) {//using strict false to terminate the tranversal through the squares
            if (done) {
                return done(argu);
            }
            return;
        }
        return tranverseSq(next, diagonal, fn, done, argu);
    }


    function ascendRight(sq, fn, done, argu) {
        return tranverseSq(sq, rightUp, fn, done, argu);
    }

    function ascendLeft(sq, fn, done, argu) {
        return tranverseSq(sq, leftUp, fn, done, argu);
    }

    function descendRight(sq, fn, done, argu) {
        return tranverseSq(sq, rightDown, fn, done, argu);
    }

    function descendLeft(sq, fn, done, argu) {
        return tranverseSq(sq, leftDown, fn, done, argu);
    }

    /**
     * This is a helper method to convert the internal square number returned
     * from the capture search path to Standard Algebraic Notation and must
     * not be called by the draughts engine for performance
     * 
     * @param {type} sq - square must be in Standard Algebraic Notation
     * @returns {undefined}
     */
    this.capturableSAN = function (sq) {
        sq = this.SAN[sq];//to the internal board square
        var paths = this.searchCapturePaths(sq);
        
        var san = [];
        for(var i=0; i<paths.length; i++){
            var p = paths[i];
            var sp = [];
            for (var k = 0; k < p.length; k++) {
                sp[k] = {};
                sp[k].cap_sq = this.SqNumber[p[k].capture].SAN;// comvert the square to SAN
                sp[k].to_sq = this.SqNumber[p[k].dest_sq].SAN;// comvert the square to SAN
            }
            san.push(sp);
        }
        
        return san;
    };

    /**
     * Searches capturable pieces from a given square.
     * 
     * Return the type (ie white or black) captured and an array of object
     * containing all possible captures
     * 
     * @param {type} sq
     * @return {Array, undefined}
     */
    this.searchCapturePaths = function (sq) {
        var origin = sq;
        var pce = this.board[sq].piece;
        if (!pce) {//no piece on square
            return null;
        }

        if (pce.sqLoc !== sq) {
            console.warn("Invalid piece square location - Piece does not bear the exact square " + sq + " it is found on!");
            return;
        }

        var caps = [];

        //do the capture
        findCaptives(pce.crowned, origin, origin, 0, pce.white, null, caps, false);

        return pce.crowned ? normalizeKingCaps(caps) : caps;
    };

    function normalizeKingCaps(caps) {

        norm_caps = [];

        for (var i = 0; i < caps.length; i++) {
            var c = caps[i];

            for (var k = 0; k < c.length; k++) {
                if (k < c.length - 1) {
                    c[k].dest_sq = c[k].dest_sq.constructor === Array ? c[k].dest_sq[0] : c[k].dest_sq;
                } else {
                    if (c[k].dest_sq.constructor === Array) {

                        for (var n = 0; n < c[k].dest_sq.length; n++) {
                            var copy = [];
                            for (var m = 0; m < c.length; m++) {

                                var cp = {
                                    cid: c[m].cid, //captured piece id
                                    capture: c[m].capture,
                                    dest_sq: m === c.length - 1 ? c[m].dest_sq[n] : c[m].dest_sq
                                };
                                copy.push(cp);

                            }
                            norm_caps.push(copy);
                        }
                    } else {
                        norm_caps.push(c);
                    }
                }
            }

        }

        return norm_caps;
    }

    function findCaptives(crowned, origin, from_sq, old_direction, white, last_node, caps, cyclic) {

        //first check if it is going roundabout.
        if (cyclic) {
            return caps;//avoid roundabout trip which causes stackoverflow on recursion
        }
        var c;
        var anyCap = false;

        /*
         * directions are:
         * 
         * up_right = 1
         * up_left = 2
         * down_right = 3
         * down_left = 4
         * 
         */
        for (var direction = 1; direction < 5; direction++) {
            c = nextCaptive(crowned, origin, from_sq, old_direction, direction, !white);
            if (c) {

                var node = {};
                node.prev = last_node;
                node.cap = c;

                node.visited = node.prev ? node.prev.visited : {};
                cyclic = node.visited[c.capture] === 1; //detect if capture square has already been visited to avoid aroundabout (cyclic) trip capable of causing stackoverflow on recursion.
                node.visited[c.capture] = 1;

                findCaptives(crowned, origin, c.dest_sq, direction, white, node, caps, cyclic);

                c = cyclic ? null : c;
                if (!cyclic) {
                    anyCap = true;
                }
            }
        }

        if (!anyCap) {
            var node_caps = [];
            var prev_node = last_node;
            while (prev_node) {
                node_caps.push(prev_node.cap);
                prev_node = prev_node.prev;
            }
            node_caps.reverse();
            caps.push(node_caps);
        }

        return caps;
    }

    function nextCaptive(crowned, origin, from_sq, old_direction, direction, opponent) {

        if (old_direction === REVERSE_DIRECTION[direction]) {
            //avoid immediate reverse direction
            return;
        }

        switch (direction) {
            case up_right:
                {
                    if (!crowned) {
                        var next = draft.board[from_sq].SquareRightUp;
                        return manCaptive(origin, next, next.SquareRightUp, opponent);
                    } else {
                        return kingCaptive(origin, from_sq, 'SquareRightUp', opponent);
                    }
                }
                break;
            case up_left:
                {

                    if (!crowned) {
                        var next = draft.board[from_sq].SquareLeftUp;
                        return manCaptive(origin, next, next.SquareLeftUp, opponent);
                    } else {
                        return kingCaptive(origin, from_sq, 'SquareLeftUp', opponent);
                    }

                }
                break;
            case down_right:
                {
                    if (!crowned) {
                        var next = draft.board[from_sq].SquareRightDown;
                        return manCaptive(origin, next, next.SquareRightDown, opponent);
                    } else {
                        return kingCaptive(origin, from_sq, 'SquareRightDown', opponent);
                    }

                }
                break;
            case down_left:
                {

                    if (!crowned) {
                        var next = draft.board[from_sq].SquareLeftDown;
                        return manCaptive(origin, next, next.SquareLeftDown, opponent);
                    } else {
                        return kingCaptive(origin, from_sq, 'SquareLeftDown', opponent);
                    }
                }
                break;
            default:
                return;
        }

    }

    function manCaptive(origin, next, after_next, opponent) {
        
        
         if (next.piece
                && next.piece.white === opponent
                && after_next.sq !== draft.OFF_BOARD
                && (!after_next.piece || after_next.sq === origin)) {
            return {cid: next.piece.id, capture: next.piece.sqLoc, dest_sq: after_next.sq};
        }
        
    }

    function kingCaptive(origin, from_sq, lookupDirection, opponent) {

        
        var from = from_sq.constructor === Array ? from_sq[0] : from_sq;

        var next = draft.board[from][lookupDirection];

        while (next.sq !== draft.OFF_BOARD) {
            if (next.piece) {
                if (next.piece.white === opponent
                        && next[lookupDirection].sq !== draft.OFF_BOARD
                        && (!next[lookupDirection].piece || next[lookupDirection].sq === origin)) {
                    var sqs = [];
                    var pce = next.piece;
                    next = next[lookupDirection];
                    do {
                        sqs.push(next.sq);
                        next = next[lookupDirection];
                    } while (next.sq !== draft.OFF_BOARD && !next.piece)

                    return {cid: pce.id, capture: pce.sqLoc, dest_sq: sqs};
                }
                return;//leave - square blocked by own piece
            }

            next = next[lookupDirection];
        }
                      
    }

    /**
     *Since it is possible for a piece to move to a square in more than one direction
     *from a give square, this method is used to match all possible capture direction
     *and return the capture path from the given square.<br>
     *It uses the provide array of 'tos' squares.
     *If the 'tos' squares match any of the capture paths (direction) from the given
     *square, that path is returned.
     *
     * @param {type} from square of the piece to move
     * @param {type} tos matching capture squares. ie all the squares the moving
     * piece jump to.
     * @returns {Array|unresolved|nm$_draftgame-1.norm_caps|Array,undefined|draftFn.searchCapturePaths.caps|nm$_draftgame-1.draftFn.filterPaths.caps|undefined|draftFn.filterPaths.caps}     */
    this.filterPaths = function (from, tos) {

        var caps = this.searchCapturePaths(from);
        if (caps.length === 0
                || (caps.length === 1 && caps[0].length === 0)) {
            return [];
        }

        for (var i = caps.length - 1; i > -1; i--) {
            var c = caps[i];
            if (c.length < tos.length) {
                caps.splice(i, 1);
                continue;
            }
            for (var k = 0; k < tos.length; k++) {

                if (tos[k] !== c[k].dest_sq) {
                    caps.splice(i, 1);
                    break
                }
            }
        }

        return caps;
    };

    function isSquare(sq) {
        return sq > -1 && sq < draft.SQ_COUNT;
    }

    function canManCapture(sq, opponent) {

        if (this.board[sq].SquareLeftUp.piece
                && this.board[sq].SquareLeftUp.piece.white === opponent
                && this.board[sq].SquareLeftUp.SquareLeftUp.sq !== this.OFF_BOARD
                && !this.board[sq].SquareLeftUp.SquareLeftUp.piece) {
            return true;
        }

        if (this.board[sq].SquareRightUp.piece
                && this.board[sq].SquareRightUp.piece.white === opponent
                && this.board[sq].SquareRightUp.SquareRightUp.sq !== this.OFF_BOARD
                && !this.board[sq].SquareRightUp.SquareRightUp.piece) {
            return true;
        }

        if (this.board[sq].SquareLeftDown.piece
                && this.board[sq].SquareLeftDown.piece.white === opponent
                && this.board[sq].SquareLeftDown.SquareLeftDown.sq !== this.OFF_BOARD
                && !this.board[sq].SquareLeftDown.SquareLeftDown.piece) {
            return true;
        }

        if (this.board[sq].SquareRightDown.piece
                && this.board[sq].SquareRightDown.piece.white === opponent
                && this.board[sq].SquareRightDown.SquareRightDown.sq !== this.OFF_BOARD
                && !this.board[sq].SquareRightDown.SquareRightDown.piece) {
            return true;
        }

        return false;
    }


    function canKingCapture(sq, opponent) {

        for (var i = 0; i < this.LOOKUP_DIRECTIONS.length; i++) {
            var next = this.board[sq][this.LOOKUP_DIRECTIONS[i]];
            while (next.sq !== this.OFF_BOARD) {
                if (next.piece) {
                    if (next.piece.white === opponent
                            && next[this.LOOKUP_DIRECTIONS[i]].sq !== this.OFF_BOARD
                            && !next[this.LOOKUP_DIRECTIONS[i]].piece) {
                        return true;
                    }
                    break;//path blocked by own piece so break from loop
                }
                next = next[this.LOOKUP_DIRECTIONS[i]];
            }
        }

        return false;
    }


    function doMove(from, path, result) {

        var pce = this.board[from].piece;
        var to = path;
        if (path.constructor === Array) {
            //remove the captured pieces from the square

            for (var i = 0; i < path.length; i++) {
                var cap_sq = path[i].capture;
                var cid = path[i].cid;

                if (this.board[cap_sq].piece) {
                    if (this.board[cap_sq].piece.white) {
                        this.whiteCount--;
                        if (this.board[cap_sq].piece.crowned) {
                            this.whiteKingCount--;
                        }
                    } else {
                        this.blackCount--;
                        if (this.board[cap_sq].piece.crowned) {
                            this.blackKingCount--;
                        }
                    }

                    this.pieces[cid].sqCap = cap_sq;//yes                   
                    this.pieces[cid].sqLoc = draft.OFF_BOARD;//yes
                    this.board[cap_sq].piece = null;//yes also


                } else {
                    console.warn("Warning!!! captive not found on square " + cap_sq);
                }
            }
            //set the destination square
            to = path[path.length - 1].dest_sq;
        }

        this.board[from].piece = null;
        this.board[to].piece = null;//prevent reference issue
        this.board[to].piece = pce;
        this.board[to].piece.sqLoc = to;

        //promote piece if necessary
        if (to < this.SIZE && !pce.white) {//is black and on king row in the white end
            pce.crowned = true;//crown the piece
        } else if (to >= this.SQ_COUNT - this.SIZE && pce.white) {//is white and on king row in the black end - note that we know the piece is not OFF_BOARD at this piont. so the test is not buggy
            pce.crowned = true;//crown the piece
        }

        if (result) {
            
            var from_san = this.SqNumber[from].SAN;
            var to_san = this.SqNumber[to].SAN;
            var move_notation = from_san;
            var capture = null;
            if (path.constructor === Array) {
                capture = [];
                for (var i = 0; i < path.length; i++) {
                    move_notation += 'x' + this.SqNumber[path[i].dest_sq].SAN;
                    capture[i] = this.SqNumber[path[i].capture].SAN;
                }
            } else {
                move_notation += '-' + to_san;
            }

            var move_result = {
                error: null, //yes, the user must check for error
                from: from_san,
                to: to_san,
                move: move_notation,
                capture: capture,
                boardPositon: toFEN.call(this)
            };

            if (result === true) {
                return move_result;
            } else if (typeof result === 'function') {
                result(move_result);
            }

        }

    }

    function validateManMove(from, to, white, fn) {
        if (to !== this.OFF_BOARD && !this.board[to].piece) {
            if (white && (this.board[from].leftUp === to || this.board[from].rightUp === to)) {
                return true;
            } else if (!white && (this.board[from].leftDown === to || this.board[from].rightDown === to)) {
                return true;
            }
        }

        //at this point the move is invalid
        if (to === this.OFF_BOARD) {
            this.lastError = "Not a square.";
        } else if (this.board[to].piece) {
            this.lastError = "Square is not empty.";
        } else if (!this.board[to].dark) {
            this.lastError = "Cannot play on a light square.";
        } else {
            this.lastError = "Invalid move.";
        }

        if (typeof fn === 'function') {
            fn({error: this.lastError});
        }

        return false;
    }

    function validateKingMove(from, to, fn) {

        for (i = 0; i < this.LOOKUP_DIRECTIONS.length; i++) {
            var lookup = this.LOOKUP_DIRECTIONS[i];
            var next = this.board[from][lookup];
            while (true) {
                if (next.sq === this.OFF_BOARD || next.piece) {
                    break;
                }
                if (next.sq === to) {
                    return true;
                }
                next = next[lookup];
            }
        }

        //at this point the move is invalid
        if (to === this.OFF_BOARD) {
            this.lastError = "Not a square.";
        } else if (this.board[to].piece) {
            this.lastError = "Square is not empty.";
        } else if (!this.board[to].dark) {
            this.lastError = "Cannot play on a light square.";
        } else {
            this.lastError = "Invalid move.";
        }

        if (typeof fn === 'function') {
            fn({error: this.lastError});
        }

        return false;
    }

    function validateCapture(from, to, fn) {
        var caps = this.searchCapturePaths(from);
        if (caps.length === 0
                || (caps.length === 1 && caps[0].length === 0)) {
            this.lastError = "No capture opportunity.";
            if (typeof fn === 'function') {
                fn({error: this.lastError});
            }
            return false;
        }
        for (var i = 0; i < caps.length; i++) {
            var c = caps[i];
            if (to.length !== c.length) {
                continue;
            }
            //at this point compare them
            var match = true;
            for (var k = 0; k < c.length; k++) {
                if (to[k].dest_sq !== c[k].dest_sq
                        || to[k].capture !== c[k].capture) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }

        this.lastError = "No matching capture path found.";
        if (typeof fn === 'function') {
            fn({error: this.lastError});
        }
        return false;
    }

    this.needCapture = function (sq) {
        if (sq === this.OFF_BOARD || !this.board[sq].piece) {
            return false;
        }

        if (!this.board[sq].piece.crowned) {
            return canManCapture.call(this, sq, !this.board[sq].piece.white);
        } else {
            return canKingCapture.call(this, sq, !this.board[sq].piece.white);
        }

    };

    function validateMove(from, to, fn) {
        this.lastError = null;
        if (!this.board[from].piece) {
            this.lastError = "No piece on square.";
            if (typeof fn === 'function') {
                fn({error: this.lastError});
            }
            return false;
        }

        if (this.needCapture(from) && to.constructor !== Array) {
            this.lastError = "Expected a capture move.";
            if (typeof fn === 'function') {
                fn({error: this.lastError});
            }
            return false;
        }

        if (to.constructor === Array) {
            return validateCapture.call(this, from, to, fn);
        } else {
            if (this.board[from].piece.crowned) {
                return validateKingMove.call(this, from, to, fn);
            } else {
                return validateManMove.call(this, from, to, this.board[from].piece.white, fn);
            }
        }

    }

    function manPlainMoves(from_sq, moves) {

        if (this.board[from_sq].piece.white) {//white

            if (this.board[from_sq].SquareRightUp.sq !== this.OFF_BOARD
                    && !this.board[from_sq].SquareRightUp.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= this.board[from_sq].SquareRightUp.sq << this.TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
            if (this.board[from_sq].SquareLeftUp.sq !== this.OFF_BOARD
                    && !this.board[from_sq].SquareLeftUp.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= this.board[from_sq].SquareLeftUp.sq << this.TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }

        } else {//black
            if (this.board[from_sq].SquareRightDown.sq !== this.OFF_BOARD
                    && !this.board[from_sq].SquareRightDown.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= this.board[from_sq].SquareRightDown.sq << this.TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
            if (this.board[from_sq].SquareLeftDown.sq !== this.OFF_BOARD
                    && !this.board[from_sq].SquareLeftDown.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= this.board[from_sq].SquareLeftDown.sq << this.TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
        }

    }

    function kingPlainMoves(from_sq, moves) {

        var bit_move;

        for (var i = 0; i < this.LOOKUP_DIRECTIONS.length; i++) {
            var next = this.board[from_sq][this.LOOKUP_DIRECTIONS[i]];
            while (next.sq !== this.OFF_BOARD && !next.piece) {

                bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= next.sq << this.TO_SQUARE_SHIFT;
                moves.push(bit_move);

                next = next[this.LOOKUP_DIRECTIONS[i]];
            }
        }

    }

    this.possibleMoves = function (from_sq, moves) {
        if (!this.board[from_sq].piece) {
            return moves;
        }

        if (!this.board[from_sq].piece.crowned) {
            if (canManCapture.call(this, from_sq, !this.board[from_sq].piece.white)) {
                //set the move index to where capture started so as to skip previous plain moves
                this.startMoveIndex = moves.length;
                this.isCapMove = true;

                var caps = this.searchCapturePaths(from_sq);
                for (var i = 0; i < caps.length; i++) {
                    moves.push({from: from_sq, path: caps[i]});
                }
                return;
            }
            manPlainMoves.call(this, from_sq, moves);
        } else {
            if (canKingCapture.call(this, from_sq, !this.board[from_sq].piece.white)) {
                //set the move index to where capture started so as to skip previous plain moves
                this.startMoveIndex = moves.length;
                this.isCapMove = true;

                var caps = this.searchCapturePaths(from_sq);
                for (var i = 0; i < caps.length; i++) {
                    moves.push({from: from_sq, path: caps[i]});
                }
                return;
            }
            kingPlainMoves.call(this, from_sq, moves);
        }

    };

    /**
     * Get the current board positon using the Forsyth Edwards Notation (FEN).
     * 
     * @param {Objet} board_position 
     * @returns {undefined}  
     */
    function toFEN(board_position) {

        var _turn, pces;
        if (board_position) {
            _turn = board_position.turn;
            pces = board_position.pieces;
        } else {
            _turn = this.turn;
            pces = this.pieces;
        }
        
        var wp = 'W';
        var bp = 'B';
        for (var i = 0; i < pces.length; i++) {
            var p = pces[i];
            if(p.sqLoc === this.OFF_BOARD){
                continue;
            }
            var sq = this.SqNumber[p.sqLoc].SAN;// convert Standard Numeric Notation 
            sq = p.crowned ? ('K' + sq) : sq;
            if (p.white) {
                wp += i < pces.length - 1 ? sq + ',' : sq;
            } else {
                bp += i < pces.length - 1 ? sq + ',' : sq;
            }
        }

        return '[FEN "' + _turn + ':' + wp + ':' + bp + '"]';

    }



    function toSquareInternal(notation) {

        if (isNaN(notation)) {//Standard Algebraic Notaion
            //e.g a1 , b2 , c1 e.t.c
            notation = notation + "";
            var a = notation.charAt(0);
            var b = notation.substring(1);

            //console.log('a', a, 'b', b);

            b = (b - 1) * this.SIZE - 1;

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

            //console.log('a', a, 'b', b, this.SIZE);

            notation = b + a;
        } else {

            notation = notation - 0;//implicitly convert to numeric

            //console.log('this.SQ_COUNT', this.SQ_COUNT);
            //console.log('notation', notation);
            //console.log('notation * 2', notation * 2);

            var start = this.SQ_COUNT - notation * 2;

            //console.log('start', start);
            //console.log('start % this.SIZE', start % this.SIZE);

            start = start - start % this.SIZE;

            //console.log('start', start);

            var end = start + this.SIZE;

            var count = (this.SQ_COUNT - end) / 2;

            //console.log('start', start, 'end', end, 'count', count);


            for (var i = start; i < end; i++) {

                //console.log('i', i, 'start', start, 'end', end, 'count', count);
                //console.log(this.board[i].piece);

                if (this.board[i].dark) {
                    count++;
                    if (count === notation) {
                        notation = this.board[i].sq;
                        break;
                    }

                }
            }
        }

        //console.log('notation', notation);

        var internal_sq_number = notation;
        return internal_sq_number;
    }
    function toRowChar(num) {

        switch (num) {
            case 0:
                num = 'a';
                break;
            case 1:
                num = 'b';
                break;
            case 2:
                num = 'c';
                break;
            case 3:
                num = 'd';
                break;
            case 4:
                num = 'e';
                break;
            case 5:
                num = 'f';
                break;
            case 6:
                num = 'g';
                break;
            case 7:
                num = 'h';
                break;
            case 8:
                num = 'i';
                break;
            case 9:
                num = 'j';
                break;
            case 10:
                num = 'k';
                break;
            case 11:
                num = 'l';
                break;
        }
        return num;
    }

    /**
     * Make move internally on the board using the provided move notation.<br>
     * 
     * examples of valid move notations are:<br>
     * 46-41  => normal move<br>
     * 46x33  => capture move<br>
     * a1-b2  => normal move<br>
     * a1xc2  => capture move<br>
     * @param {type} move_notation - the move notation
     * @returns {undefined}   
     */
    this.move = function (move_notation) {
        var s = move_notation.split(/-/g);
        var is_capture;
        if (s.length === 1) {//may be a capture sequence
            s = move_notation.split(/x/g);
            if (s.length > 1) {
                is_capture = true;
            } else {
                throw Error('Invalid move notation! must have ' - ' or \'x\' separator - e.g 46-41 or 46x41 or a1-b2 or a1xb2');
            }
        }
        var from;
        var path = [];
        for (var i = 0; i < s.length; i++) {
            //s[i] = toSquareInternal.call(this, s[i]);
            if (isNaN(s[i])) {//Standard Algebraic Notaion
                s[i] = this.SAN[s[i]];
            } else {//Numeric Notation
                s[i] = this.NN[s[i]];
            }
            if (i === 0) {
                from = s[i];
            } else if (i > 0) {
                path.push(s[i]);
            }
        }
        if (is_capture) {
            path = this.filterPaths(from, path);
            if(path.length > 1){
                this.lastError = 'Ambiguous capture path';
                return {error: this.lastError};
            }else if(path.length === 0){
                this.lastError = 'No capture path found';
                return {error: this.lastError};
            } 
            
            path = path[0];
        } else {
            path = path[0];
        }

        console.log('from', from, 'path', path);

        return this.moveTo(from, path, true);
    };

    /**
     * Make move internally on the board.
     * 
     * @param {type} from
     * @param {type} path
     * @param {type} result if value is true it return a move result. if the value
     * is a function the move result is passed are argument.
     * @returns {undefined}   
     */
    this.moveTo = function (from, path, result) {
        if (result) {
            if (!validateMove.call(this, from, path, result)) {
                if(result === true){
                    return {error: this.lastError};
                }
            }
        }
        return doMove.call(this, from, path, result);
    };

    this.undoMove = function (from, path, was_crowned) {
        var pce = this.board[from].piece;
        var to = path;
        if (path.constructor === Array) {
            //set the destination square
            to = path[path.length - 1].dest_sq;

            //return the captured pieces to the squares they where captured from
            for (var i = 0; i < path.length; i++) {
                var cap_sq = path[i].capture;
                var cid = path[i].cid;

                var pce = this.pieces[cid];
                pce.sqCap = this.OFF_BOARD;//yes
                pce.sqLoc = cap_sq;
                pce.white = !this.board[to].piece.white;//just in case! we know it must be the opponent

                this.board[cap_sq].piece = pce;

                if (pce.white) {
                    this.whiteCount++;
                    if (pce.crowned) {
                        this.whiteKingCount++;
                    }
                } else {
                    this.blackCount++;
                    if (pce.crowned) {
                        this.blackKingCount++;
                    }
                }
            }

        }

        //return the moved piece back
        this.board[from].piece = this.board[to].piece;
        this.board[from].piece.sqLoc = from;
        this.board[from].piece.crowned = was_crowned;
        this.board[to].piece = null;



    };

    this.clearBoard = function () {
        for (var i = 0; i < this.SQ_COUNT; i++) {
            if (this.board[i].piece) {
                this.board[i].piece.sqLoc = this.OFF_BOARD;//remove the piece from the board
                this.board[i].piece = null;//nullify the piece reference on the square
            }
        }
    };


    this.printBoard = function () {
        var str = "";

        var row = [];
        for (var i = 0; i < this.SIZE; i++) {
            row[i] = [];
        }
        for (var i = 0; i < this.SQ_COUNT; i++) {
            if (this.board[i].dark) {
                if (this.board[i].piece) {
                    if (this.board[i].piece.white) {
                        str = this.board[i].piece.crowned ? "W" : "w";
                    } else {
                        str = this.board[i].piece.crowned ? "B" : "b";
                    }
                } else {
                    str = "O";
                }
            } else {
                str = "-";
            }

            row[getRow(i)].push(str);

        }

        for (var i = row.length - 1; i > -1; i--) {

            var r = row[i];
            var line = "";
            for (var k = 0; k < r.length; k++) {
                line += r[k] + " ";
            }

            console.log(line);
        }


    };

    //FOR NOW THIS METHOD IS EXPERIMENTAL! MAY BE REMOVED OR REFINED LATER
    function attackAndDefenceCost(piece) {
        var ATTACK = 4;
        var DEFENCE = 3;
        var attack_cost = 0;
        var defence_cost = 0;
        var sq;
        for (var i = 0; i < this.pieces.length; i++) {
            if (pieces[i].white !== piece.white) {
                continue;
            }

            sq = pieces[i].sqLoc;

            if (sq === this.OFF_BOARD) {//pieces is off board - obviously captured
                continue;//skip
            }

            if (pieces[i].white) {

                attack_cost += this.board[sq].row * ATTACK;

                if (this.board[sq].SquareRightDown.sq === this.OFF_BOARD
                        || (this.board[sq].SquareRightDown.piece
                                && piece.white === this.board[sq].SquareRightDown.piece.white)) {
                    defence_cost += DEFENCE;
                }
                if (this.board[sq].SquareLeftDown.sq === this.OFF_BOARD
                        || (this.board[sq].SquareLeftDown.piece
                                && piece.white === this.board[sq].SquareLeftDown.piece.white)) {
                    defence_cost += DEFENCE;
                }

            } else {
                attack_cost += (this.SIZE - this.board[sq].row) * ATTACK;

                if (this.board[sq].SquareRightUp.sq === this.OFF_BOARD
                        || (this.board[sq].SquareRightUp.piece
                                && piece.white === this.board[sq].SquareRightUp.piece.white)) {
                    defence_cost += DEFENCE;
                }
                if (this.board[sq].SquareLeftUp.sq === this.OFF_BOARD
                        || (this.board[sq].SquareLeftUp.piece
                                && piece.white === this.board[sq].SquareLeftUp.piece.white)) {
                    defence_cost += DEFENCE;
                }

            }
        }

        return attack_cost + defence_cost;

    }

    function evalPosition(piece, is_maximizer) {

        var cost = 0;
        var CROWN_WORTH = 35;
        var MAN_WORTH = 9;
        var piece_evalute = 0;

        if (piece.white) {
            piece_evalute = MAN_WORTH * this.whiteCount + CROWN_WORTH * this.whiteKingCount;

        } else {
            piece_evalute = MAN_WORTH * this.blackCount + CROWN_WORTH * this.blackKingCount;
        }


        //Attack And Defence evaluation is experimental - it makes the engine slower and we
        //are not certain if it produces a better searched move since just relying on
        //the piece count on board could make a search depth of 13 which appears to
        //be even stronger. If strength is not improved from this experimation we will
        //reconsider this option of evaluation (Attack And Defence Cost).

        var attack_and_defence_cost = 0;
        //attack_and_defence_cost = attackAndDefenceCost.call(this, piece);//EXPERIMENTAL - MAY BE REMOVED IF STRENGTH AND PERFORMANCE SAY SO.


        cost = piece_evalute + attack_and_defence_cost ? attack_and_defence_cost : 0; // REMOVE COMMENT LATER

        cost = is_maximizer ? cost : -cost;//come back        

        return cost;
    }

    function generateMoves() {

        var moves = [];
        this.isCapMove = false;//initialize
        this.startMoveIndex = 0;//initialize

        for (var p_index = 0; p_index < this.pieces.length; p_index++) {

            if (this.pieces[p_index].white !== this.turn
                    || this.pieces[p_index].sqLoc === this.OFF_BOARD) {
                continue;
            }

            this.possibleMoves(this.pieces[p_index].sqLoc, moves);

            if (this.isCapMove) {
                //stop further move search since there is a capture and the
                //rule says player must capture a piece if the opportinity is available
                break;
            }
        }

        return moves;
    }

    function toMoveObj(move) {
        if (move.path) {
            return move;
        }

        var from = (move >> this.FROM_SQUARE_SHIFT)
                & this.FROM_SQUARE_MASK;
        var to = (move >> this.TO_SQUARE_SHIFT)
                & this.TO_SQUARE_MASK;

        return {from: from, path: to};

    }

    function search(is_maximizer, alpha, beta, n_depth, max_depth, piece) {

        n_depth++; // must be initialize to -1. Take note

        if (n_depth === max_depth) {
            eval_count++;
            var eval = evalPosition.call(this, piece, is_maximizer);//uncomment later                   
            return eval;//return            
        }

        var value = is_maximizer ? -this.MAX_VALUE : this.MAX_VALUE;//come back  
        var next_turn = !this.turn;
        var node_turn = this.turn;



        var moves = generateMoves.call(this);
        var from, to;
        var start = this.startMoveIndex;
        for (var i = moves.length - 1; i > start - 1; i--) {

            if (!moves[i].path) {
                from = (moves[i] >> this.FROM_SQUARE_SHIFT)
                        & this.FROM_SQUARE_MASK;
                to = (moves[i] >> this.TO_SQUARE_SHIFT)
                        & this.TO_SQUARE_MASK;
            } else {
                from = moves[i].from;
                to = moves[i].path;
            }
            var pce = this.board[from].piece;

            if (pce === null) {//testing!!!
                console.log(pce);//testing!!!
            }

            var was_crowned = pce.crowned; //needed to get the correct status when undoing move
            this.moveTo(from, to);

            //console.log('-------moved----------');
            //this.printBoard();
            /*if(node_count>1000000){//TESTING PURPOES! TO BE REMOVED
             console.log('-------node_count ---------- ', node_count);
             this.printBoard();
             }*/

            var pre_value = value;

            this.turn = next_turn;//assign board turn used by the child node

            value = search.call(this, !is_maximizer,
                    alpha,
                    beta,
                    n_depth,
                    max_depth,
                    pce);



            this.turn = node_turn;
            this.undoMove(from, to, was_crowned);

            node_count++;
            //console.log('-------undone move----------');
            //this.printBoard();

            //console.log('value ', value);

            if (is_maximizer) {

                if (n_depth === 0) {

                    if (value > pre_value) {
                        best_move = toMoveObj.call(this, moves[i]);//current move
                    } else {
                        //TODO: Investigate this else block for correctness
                        best_move = toMoveObj.call(this, moves[0]);//try first move
                    }
                    return best_move;
                }

                if (value >= beta) {
                    prune_count++;

                    //console.log('is_maximizer ', prune_count, ' value ', value, ' beta ', beta);

                    break;//prune                        
                }

                if (value < pre_value) {
                    value = pre_value;//bigger value                        
                    alpha = value;

                    //console.log('continue max ', prune_count, ' value ', value, ' pre_value ', pre_value);
                }

            } else {//if minimizer                
                if (value <= alpha) {
                    prune_count++;

                    //console.log('minimizer ', prune_count, ' value ', value, ' alpha ', alpha);

                    break;//prune                        
                }

                if (value > pre_value) {
                    value = pre_value;//smaller value                        
                    beta = value;

                    //console.log('continue min ', prune_count, ' value ', value, ' pre_value ', pre_value);
                }
            }

            //update alpha or beta value                
            alpha = is_maximizer ? value : alpha;
            beta = !is_maximizer ? value : beta;

        }

        return value;
    }

    function bestMove() {
        eval_count = 0;
        prune_count = 0;

        var best = search.call(this, true, // is maximizer.
                -Infinity, //alpha value.
                Infinity, //beta value.            
                -1, //depth : must first be initialize to -1.
                this.DEPTH, //max search depth.
                null
                );


        console.log('node_count ', node_count);
        console.log('prune_count ', prune_count);
        console.log('eval_count ', eval_count);

        return best;
    }

    this.Robot = function (boardPositonObj, depth) {

        if (depth) {
            draft.DEPTH = depth;
        }

        draft.boardPosition(boardPositonObj);

        this.play = function (fn) {

            var best = bestMove.call(draft, draft.DEPTH);
            draft.moveTo(best.from, best.path, fn);
        };
    };


    this.Game = function (size) {



        return function () {

            this.move = function (from, path, fn) {

                moveTo(from, path, fn);
            };
        };
    };


    this.test = function () {
        /*ascendRight(22, function (sq) {
         console.log(sq);
         if (sq === 77) {
         return false;//stop tranversing
         }
         });*/

        var s = this.board[64].SquareLeftUp;
        while (s.sq !== this.OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareLeftUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = this.board[22].SquareRightUp;
        while (s.sq !== this.OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareRightUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = this.board[64].SquareLeftUp;
        while (s.sq !== this.OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareLeftUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = this.board[22].SquareRightUp;
        while (s.sq !== this.OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareRightUp;
            //s = null;
            s = s1;
        }

    };

    this.test1 = function () {
        console.log('----------------TEST toInternalSquare with Numeric Notation------------------');
        for (var i = 1; i < this.SQ_COUNT / 2 + 1; i++) {
            console.log(toSquareInternal.call(this, i));
        }


    };


    this.test2 = function () {
        console.log('----------------TEST toInternalSquare with Standard Algebraic Notation------------------');
        for (var i = 1; i < this.SIZE + 1; i++) {

            console.log("a" + i, "=>", toSquareInternal.call(this, "a" + i));
            console.log("b" + i, "=>", toSquareInternal.call(this, "b" + i));
            console.log("c" + i, "=>", toSquareInternal.call(this, "c" + i));
            console.log("d" + i, "=>", toSquareInternal.call(this, "d" + i));
            console.log("e" + i, "=>", toSquareInternal.call(this, "e" + i));
            console.log("f" + i, "=>", toSquareInternal.call(this, "f" + i));
            console.log("g" + i, "=>", toSquareInternal.call(this, "g" + i));
            console.log("h" + i, "=>", toSquareInternal.call(this, "h" + i));
            console.log("i" + i, "=>", toSquareInternal.call(this, "i" + i));
            console.log("j" + i, "=>", toSquareInternal.call(this, "j" + i));
        }

    };


    this.test3 = function () {
        console.log('----------------TEST Notation initialization------------------');

        console.log("this.NN", this.NN);
        console.log("this.SAN", this.SAN);
        console.log("this.SqNumber", this.SqNumber);



    };
    return this;
}
;

if (typeof module !== "undefined" && module.exports) {
    module.exports = Draughts;
}