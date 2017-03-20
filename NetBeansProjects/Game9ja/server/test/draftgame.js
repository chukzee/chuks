
function Draft9ja(size) {

    this.turn = true; //white
    var board = [];
    var pieces = [];
    var capSquarePce = [];//hold the pieces captured at an index equal to the square captured from - this is to ensure quick access by the game engine to captured pieces
    var SIZE = 10; //default is 10 by 10
    var SQ_COUNT, OFF_BOARD, LAST_SQ_INDEX;
    this.whiteCount = 0;
    this.blackCount = 0;
    this.whiteKingCount = 0;
    this.blackKingCount = 0;
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

    var LOOKUP_DIRECTIONS = ['SquareRightUp', 'SquareLeftUp', 'SquareRightDown', 'SquareLeftDown'];

    var FROM_SQUARE_MASK = 127;// 0 - 127 with max 127
    var TO_SQUARE_MASK = 127;// 0 - 127 with max 127 

    var FROM_SQUARE_SHIFT = 0;
    var TO_SQUARE_SHIFT = FROM_SQUARE_SHIFT + 7;

    this.getBoard = function () {
        return board;
    };

    this.boardPosition = function (boardPositonObj) {
        board = [];
        pieces = [];

        this.turn = boardPositonObj.turn;
        initBoard(boardPositonObj.size);
        var gm_pieces = boardPositonObj.pieces;

        //check for duplicate piece id
        for (var i = 0; i < gm_pieces.length; i++) {
            for (var k = 0; k < gm_pieces.length; k++) {
                if (gm_pieces[i].id !== null
                        && typeof gm_pieces[i].id !== "undefined"
                        && gm_pieces[i].id === gm_pieces[k].id) {
                    throw new Error("duplicate piece id - " + id);
                }
            }
        }

        if (boardPositonObj.pieces.length < BoardPieceCount[SIZE]) {
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

            var cw = BoardPieceCount[SIZE] / 2 - w;
            var cb = BoardPieceCount[SIZE] / 2 - b;

            if (cw < 0 || cb) {
                throw new Error("number of " + (cw ? "white" : "black") + " pieces is greater than maximum of " + BoardPieceCount[SIZE] / 2);
            }

            //white off board
            for (var i = 0; i < cw; i++) {
                gm_pieces.push(new Piece(OFF_BOARD, true, false));
            }
            //black off board
            for (var i = 0; i < cb; i++) {
                gm_pieces.push(new Piece(OFF_BOARD, false, false));
            }

        }

        for (var i = 0; i < gm_pieces.length; i++) {
            var pce = gm_pieces[i];
            this.setPiece(pce.sqLoc, pce.white, pce.crowned);
        }

        //now prevserse the ids

        for (var i = 0; i < gm_pieces.length; i++) {
            var pce = gm_pieces[i];
            if (pce.sqLoc === pieces[i].sqLoc
                    && pce.id !== pieces[i].id) {
                pieces[i].id = pce.id;//set the id
                //now check if any other id already has this id
                for (var k = 0; k < gm_pieces.length; k++) {
                    if (k === i) {
                        continue;//skip
                    }

                    if (pieces[i].id === pce.id) {//found so cancel the id
                        pieces[i].id = null;//cancel in the meantime
                    }
                }
            }
        }

        //now reassign any cancelled id
        for (var i = 0; i < pieces.length; i++) {

            if (!pieces[i].id && pieces[i].id !== 0) {
                for (var id = 0; id < pieces.length; id++) {
                    var found = false;
                    //check if it already exist
                    for (var k = 0; k < pieces.length; k++) {
                        if (id === pieces[i].id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //does not ready exist so assign it.
                        pieces[i].id = id;
                    }
                }
            }
        }

        //finally
        recordBoardPieces();
    };

    function recordBoardPieces() {

        whiteCount = 0;//is used - Do not mind NetBeans misleading statement that it is not used
        blackCount = 0;//is used - Do not mind NetBeans misleading statement that it is not used
        whiteKingCount = 0;//is used - Do not mind NetBeans misleading statement that it is not used
        blackKingCount = 0;//is used - Do not mind NetBeans misleading statement that it is not used

        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].white && pieces[i].sqLoc !== OFF_BOARD) {
                whiteCount++;
                if (pieces[i].crowned) {
                    whiteKingCount++;
                }
            }

            if (!pieces[i].white && pieces[i].sqLoc !== OFF_BOARD) {
                blackCount++;
                if (pieces[i].crowned) {
                    blackKingCount++;
                }
            }

        }

        console.log('whiteCount ', whiteCount);
        console.log('blackCount ', blackCount);
        console.log('whiteKingCount ', whiteKingCount);
        console.log('blackKingCount ', blackKingCount);
    }

    this.setPiece = function (sq, white, crowned) {

        var r = (SIZE - 2) / 2;
        var square = {};

        var pce;

        if (!board[sq] || !board[sq].piece) {
            for (var i = 0; i < pieces.length; i++) {
                if (pieces[i].sqLoc === OFF_BOARD) {
                    pce = pieces[i];
                    break;
                }
            }
        } else {
            pce = board[sq].piece;
        }

        if (!pce) {
            pce = new Piece(); // dummy piece any! just to avoid NullPionterException
        }

        var row = getRow(sq);
        var col = getCol(sq);

        if (arguments.length === 1) {
            if (sq <= SIZE * r) {
                pce.white = true;
            } else if (sq >= SIZE * (SIZE - r)) {
                pce.white = false;
            }
        } else {
            pce.white = white;
            pce.crowned = crowned;
        }

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
                || ((sq >= SIZE * r && sq < SIZE * (SIZE - r)) && arguments.length === 1);


        square.sq = sq;
        square.leftUp = leftUp(sq);
        square.rightUp = rightUp(sq);
        square.leftDown = leftDown(sq);
        square.rightDown = rightDown(sq);

        square.piece = !isEmptySq ? pce : null;
        if (square.piece) {
            square.piece.sqLoc = sq;
        }

        if (!board[sq]) {
            board[sq] = square;
        } else {
            board[sq].piece = square.piece;
        }

        //finally
        recordBoardPieces();
    };

    initBoard(size);

    function initBoard(size) {


        if (size) {
            SIZE = size;
        }

        SQ_COUNT = SIZE * SIZE;
        OFF_BOARD = SQ_COUNT;
        LAST_SQ_INDEX = SQ_COUNT - 1;

        //initialize pieces array
        for (var i = 0; i < BoardPieceCount[SIZE]; i++) {
            pieces.push(new Piece());
            pieces[i].id = i;
            pieces[i].sqLoc = OFF_BOARD;
        }

        var len = SQ_COUNT;

        board[SQ_COUNT] = {};
        board[SQ_COUNT].sq = OFF_BOARD;
        board[SQ_COUNT].rightUp = OFF_BOARD;
        board[SQ_COUNT].leftUp = OFF_BOARD;
        board[SQ_COUNT].rightDown = OFF_BOARD;
        board[SQ_COUNT].leftDown = OFF_BOARD;

        board[SQ_COUNT].SquareRightUp = board[SQ_COUNT];
        board[SQ_COUNT].SquareLeftUp = board[SQ_COUNT];
        board[SQ_COUNT].SquareRightDown = board[SQ_COUNT];
        board[SQ_COUNT].SquareLeftDown = board[SQ_COUNT];

        for (var i = 0; i < len; i++) {
            setPiece(i);
        }

        for (var i = 0; i < SQ_COUNT; i++) {
            board[i].SquareRightUp = board[board[i].rightUp];
            board[i].SquareLeftUp = board[board[i].leftUp];
            board[i].SquareRightDown = board[board[i].rightDown];
            board[i].SquareLeftDown = board[board[i].leftDown];
        }
        
        //initialize capSquarePce
        for (var i = 0; i < SQ_COUNT; i++) {
            capSquarePce[i] = null;//ensure null in all
        }
    }


    function Piece(sq, white, crowned) {
        //the piece id is set during board initializatin - see initBoard function
        if (arguments.length === 0) {
            this.sqLoc = OFF_BOARD;
            this.sqCap = null;//square captured from
            this.white = true;
            this.crowned = false;
        } else {
            this.sqLoc = sq;
            this.sqCap = null;//square captured from
            this.white = white;
            this.crowned = crowned;
        }

        return this;
    }

    function getRow(sq) {
        return sq > -1 && sq < SQ_COUNT ? Math.floor(sq / SIZE) : null;
    }

    function getCol(sq) {
        return sq > -1 && sq < SQ_COUNT ? sq - (sq % SIZE) * SIZE : null;
    }

    function leftUp(sq) {
        if (sq > -1 && sq < SQ_COUNT) {
            var loc = sq + SIZE - 1;
            if (getRow(sq) + 1 !== getRow(loc)
                    || loc > LAST_SQ_INDEX) {
                return OFF_BOARD;
            }
            return loc;
        }
        return OFF_BOARD;
    }

    function  rightUp(sq) {
        if (sq > -1 && sq < SQ_COUNT) {
            var loc = sq + SIZE + 1;
            if (getRow(sq) + 1 !== getRow(loc)
                    || loc > LAST_SQ_INDEX) {
                return OFF_BOARD;
            }
            return loc;
        }
        return OFF_BOARD;
    }

    function leftDown(sq) {
        if (sq > -1 && sq < SQ_COUNT) {
            var loc = sq - SIZE - 1;
            if (getRow(sq) - 1 !== getRow(loc)
                    || loc < 0) {
                return OFF_BOARD;
            }
            return loc;
        }
        return OFF_BOARD;
    }

    function rightDown(sq) {
        if (sq > -1 && sq < SQ_COUNT) {
            var loc = sq - SIZE + 1;
            if (getRow(sq) - 1 !== getRow(loc)
                    || loc < 0) {
                return OFF_BOARD;
            }
            return loc;
        }
        return OFF_BOARD;
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
     * Searches capturable pieces from a given square.
     * 
     * Return the type (ie white or black) captured and an array of object
     * containing all possible captures
     * 
     * @param {type} sq
     * @return {Array, undefined}
     */
    this.searchCaputrePaths = function (sq) {
        var pce = board[sq].piece;
        if (!pce) {//no piece on square
            return null;
        }

        if (pce.sqLoc !== sq) {
            console.warn("Invalid piece square location - Piece does not bear the exact square " + sq + " it is found on!");
            return;
        }

        var caps = [];

        //do the capture
        findCaptives(pce.crowned, sq, 0, pce.white, null, caps, false);

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

    function findCaptives(crowned, from_sq, old_direction, white, last_node, caps, cyclic) {

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
            c = nextCaptive(crowned, from_sq, old_direction, direction, !white);
            if (c) {

                var node = {};
                node.prev = last_node;
                node.cap = c;

                node.visited = node.prev ? node.prev.visited : {};
                cyclic = node.visited[c.capture] === 1; //detect if capture square has already been visited to avoid aroundabout (cyclic) trip capable of causing stackoverflow on recursion.
                node.visited[c.capture] = 1;

                findCaptives(crowned, c.dest_sq, direction, white, node, caps, cyclic);

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

    function nextCaptive(crowned, from_sq, old_direction, direction, opponent) {

        if (old_direction === REVERSE_DIRECTION[direction]) {
            //avoid immediate reverse direction
            return;
        }

        switch (direction) {
            case up_right:
                {
                    if (!crowned) {
                        var next = board[from_sq].SquareRightUp;
                        return manCaptive(next, next.SquareRightUp, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareRightUp', opponent);
                    }
                }
                break;
            case up_left:
                {

                    if (!crowned) {
                        var next = board[from_sq].SquareLeftUp;
                        return manCaptive(next, next.SquareLeftUp, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareLeftUp', opponent);
                    }

                }
                break;
            case down_right:
                {
                    if (!crowned) {
                        var next = board[from_sq].SquareRightDown;
                        return manCaptive(next, next.SquareRightDown, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareRightDown', opponent);
                    }

                }
                break;
            case down_left:
                {

                    if (!crowned) {
                        var next = board[from_sq].SquareLeftDown;
                        return manCaptive(next, next.SquareLeftDown, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareLeftDown', opponent);
                    }
                }
                break;
            default:
                return;
        }

    }

    function manCaptive(next, after_next, opponent) {

        if (next.piece
                && next.piece.white === opponent
                && after_next.sq !== OFF_BOARD
                && !after_next.piece) {
            return {capture: next.piece.sqLoc, dest_sq: after_next.sq};
        }
    }

    function kingCaptive(from_sq, lookupDirection, opponent) {

        var from = from_sq.constructor === Array ? from_sq[0] : from_sq;

        var next = board[from][lookupDirection];

        while (next.sq !== OFF_BOARD) {
            if (next.piece) {
                if (next.piece.white === opponent
                        && next[lookupDirection].sq !== OFF_BOARD
                        && !next[lookupDirection].piece) {
                    var sqs = [];
                    var pce = next.piece;
                    next = next[lookupDirection];
                    do {
                        sqs.push(next.sq);
                        next = next[lookupDirection];
                    } while (next.sq !== OFF_BOARD && !next.piece)

                    return {capture: pce.sqLoc, dest_sq: sqs};
                }
                return;//leave - square blocked by own piece
            }

            next = next[lookupDirection];
        }
    }

    this.filterPaths = function (from, tos) {

        var caps = searchCaputrePaths(from);
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
        return sq > -1 && sq < SQ_COUNT;
    }

    function canManCapture(sq, opponent) {

        if (board[sq].SquareLeftUp.piece
                && board[sq].SquareLeftUp.piece.white === opponent
                && board[sq].SquareLeftUp.SquareLeftUp.sq !== OFF_BOARD
                && !board[sq].SquareLeftUp.SquareLeftUp.piece) {
            return true;
        }

        if (board[sq].SquareRightUp.piece
                && board[sq].SquareRightUp.piece.white === opponent
                && board[sq].SquareRightUp.SquareRightUp.sq !== OFF_BOARD
                && !board[sq].SquareRightUp.SquareRightUp.piece) {
            return true;
        }

        if (board[sq].SquareLeftDown.piece
                && board[sq].SquareLeftDown.piece.white === opponent
                && board[sq].SquareLeftDown.SquareLeftDown.sq !== OFF_BOARD
                && !board[sq].SquareLeftDown.SquareLeftDown.piece) {
            return true;
        }

        if (board[sq].SquareRightDown.piece
                && board[sq].SquareRightDown.piece.white === opponent
                && board[sq].SquareRightDown.SquareRightDown.sq !== OFF_BOARD
                && !board[sq].SquareRightDown.SquareRightDown.piece) {
            return true;
        }

        return false;
    }


    function canKingCapture(sq, opponent) {

        for (var i = 0; i < LOOKUP_DIRECTIONS.length; i++) {
            var next = board[sq][LOOKUP_DIRECTIONS[i]];
            while (next.sq !== OFF_BOARD) {
                if (next.piece) {
                    if (next.piece.white === opponent
                            && next[LOOKUP_DIRECTIONS[i]].sq !== OFF_BOARD
                            && !next[LOOKUP_DIRECTIONS[i]].piece) {
                        return true;
                    }
                    break;//path blocked by own piece so break from loop
                }
                next = next[LOOKUP_DIRECTIONS[i]];
            }
        }

        return false;
    }


    function effectMove(from, path, fn) {
        var pce = board[from].piece;
        var to = path;
        if (path.constructor === Array) {
            //remove the captured pieces from the square

            for (var i = 0; i < path.length; i++) {
                var cap_sq = path[i].capture;

                if (board[cap_sq].piece) {
                    if (board[cap_sq].piece.white) {
                        whiteCount--;
                        if (board[cap_sq].piece.crowned) {
                            whiteKingCount--;
                        }
                    } else {
                        blackCount--;
                        if (board[cap_sq].piece.crowned) {
                            blackKingCount--;
                        }
                    }
                    capSquarePce[cap_sq] = board[cap_sq].piece;
                    capSquarePce[cap_sq].sqCap = cap_sq;//yes
                    board[cap_sq].piece.sqLoc = OFF_BOARD;//yes
                    board[cap_sq].piece = null;//yes also
                } else {
                    console.warn("Warning!!! captive not found on square " + cap_sq);
                }
            }
            //set the destination square
            to = path[path.length - 1].dest_sq;
        }

        board[from].piece = null;
        board[to].piece = null;//prevent reference issue
        board[to].piece = pce;
        board[to].piece.sqLoc = to;

        //promote piece if necessary
        if (to < SIZE && !pce.white) {//is black and on king row in the white end
            pce.crowned = true;//crown the piece
        } else if (to >= SQ_COUNT - SIZE && pce.white) {//is white and on king row in the black end - note that we know the piece is not OFF_BOARD at this piont. so the test is not buggy
            pce.crowned = true;//crown the piece
        }

        if (fn) {
            fn({
                error: null, //yes, the user must check for error
                from: from,
                to: to,
                target: pce,
                path: path
            });

        }

    }

    function validateManMove(from, to, white, fn) {
        if (to !== OFF_BOARD && !board[to].piece) {
            if (white && (board[from].leftUp === to || board[from].rightUp === to)) {
                return true;
            } else if (!white && (board[from].leftDown === to || board[from].rightDown === to)) {
                return true;
            }
        }

        //at this point the move is invalid
        if (to === OFF_BOARD) {
            fn({error: "Not a square."});
        } else if (board[to].piece) {
            fn({error: "Square is not empty."});
        } else if (!board[to].dark) {
            fn({error: "Cannot play on a light square."});
        } else {
            fn({error: "Invalid move."});
        }


        return false;
    }

    function validateKingMove(from, to, fn) {

        for (i = 0; i < LOOKUP_DIRECTIONS.length; i++) {
            var lookup = LOOKUP_DIRECTIONS[i];
            var next = board[from][lookup];
            while (true) {
                if (next.sq === OFF_BOARD || next.piece) {
                    break;
                }
                if (next.sq === to) {
                    return true;
                }
                next = next[lookup];
            }
        }

        //at this point the move is invalid
        if (to === OFF_BOARD) {
            fn({error: "Not a square."});
        } else if (board[to].piece) {
            fn({error: "Square is not empty."});
        } else if (!board[to].dark) {
            fn({error: "Cannot play on a light square."});
        } else {
            fn({error: "Invalid move."});
        }



        return false;
    }

    function validateCapture(from, to, fn) {
        var caps = searchCaputrePaths(from);
        if (caps.length === 0
                || (caps.length === 1 && caps[0].length === 0)) {
            fn({error: "No capture opportunity."});
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

        fn({error: "No matching capture path found."});

        return false;
    }

    this.needCapture = function (sq) {
        if (sq === OFF_BOARD || !board[sq].piece) {
            return false;
        }

        if (!board[sq].piece.crowned) {
            return canManCapture(sq, !board[sq].piece.white);
        } else {
            return canKingCapture(sq, !board[sq].piece.white);
        }

    };

    function validateMove(from, to, fn) {

        if (!board[from].piece) {
            fn({error: "No piece on square."});
            return false;
        }

        if (needCapture(from) && to.constructor !== Array) {
            fn({error: "Expected a capture move."});
            return false;
        }

        if (to.constructor === Array) {
            return validateCapture(from, to, fn);
        } else {
            if (board[from].piece.crowned) {
                return validateKingMove(from, to, fn);
            } else {
                return validateManMove(from, to, board[from].piece.white, fn);
            }
        }

    }

    function manPlainMoves(from_sq, moves) {

        if (board[from_sq].piece.white) {//white

            if (board[from_sq].SquareRightUp.sq !== OFF_BOARD
                    && !board[from_sq].SquareRightUp.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= board[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
            if (board[from_sq].SquareLeftUp.sq !== OFF_BOARD
                    && !board[from_sq].SquareLeftUp.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= board[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }

        } else {//black
            if (board[from_sq].SquareRightDown.sq !== OFF_BOARD
                    && !board[from_sq].SquareRightDown.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= board[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
            if (board[from_sq].SquareLeftDown.sq !== OFF_BOARD
                    && !board[from_sq].SquareLeftDown.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= board[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
        }
        return moves;
    }

    function manKingMoves(from_sq, moves) {

        var bit_move = 0;//initialize - it is important to initialize

        for (var i = 0; i < LOOKUP_DIRECTIONS.length; i++) {
            var next = board[from_sq][LOOKUP_DIRECTIONS[i]];
            while (next.sq !== OFF_BOARD && !next.piece) {

                bit_move |= from_sq;
                bit_move |= next.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

                next = next[LOOKUP_DIRECTIONS[i]];
            }
        }

        return moves;
    }

    this.possibleMoves = function (from_sq, moves) {
        if (!board[from_sq].piece) {
            return moves;
        }

        if (!board[from_sq].piece.crowned) {
            if (canManCapture(from_sq, !board[from_sq].piece.white)) {
                var caps = searchCaputrePaths(from_sq);
                for (var i = 0; i < caps.length; i++) {
                    moves.push({from: from_sq, path: caps[i]});
                }
                return;
            }
            return manPlainMoves(from_sq, moves);
        } else {
            if (canKingCapture(from_sq, !board[from_sq].piece.white)) {
                var caps = searchCaputrePaths(from_sq);
                for (var i = 0; i < caps.length; i++) {
                    moves.push({from: from_sq, path: caps[i]});
                }
                return;
            }
            manKingMoves(from_sq, moves);
        }

    };

    this.moveTo = function (from, path, fn) {
        if (fn) {
            if (!validateMove(from, path, fn)) {
                return;
            }
        }
        effectMove(from, path, fn);
    };

    this.undoMove = function (from, path, was_crowned) {
        var pce = board[from].piece;
        var to = path;
        if (path.constructor === Array) {
            //return the captured pieces to the squares they where captured from
            for (var i = 0; i < path.length; i++) {
                var cap_sq = path[i].capture;
                var pce = capSquarePce[cap_sq];
                capSquarePce[cap_sq] = null;
                pce.sqCap = null;//yes
                pce.sqLoc = cap_sq;
                board[cap_sq].piece = pce;

                if (pce.white) {
                    whiteCount++;
                    if (pce.crowned) {
                        whiteKingCount++;
                    }
                } else {
                    blackCount++;
                    if (pce.crowned) {
                        blackKingCount++;
                    }
                }
            }
            //set the destination square
            to = path[path.length - 1].dest_sq;
        }

        //return the moved piece back
        board[from].piece = board[to].piece;
        board[from].piece.sqLoc = from;
        board[from].piece.crowned = was_crowned;
        board[to].piece = null;



    };

    this.clearBoard = function () {
        for (var i = 0; i < SQ_COUNT; i++) {
            if (board[i].piece) {
                board[i].piece.sqLoc = OFF_BOARD;//remove the piece from the board
                board[i].piece = null;//nullify the piece reference on the square
            }
        }
    };


    this.printBoard = function () {

        for (var i = 0; i < SQ_COUNT; i++) {
            console.log(board[i]);
        }

    };


    this.Engine = function () {

        var draft;
        var DEPTH = 5;

        var eval_count;
        var prune_count;

        function initEngine() {

            eval_count = 0;
            prune_count = 0;
        }

        return function (boardPositonObj, depth) {

            if (depth) {
                DEPTH = depth;
            }
            draft = new Draft9ja();
            draft.boardPosition(boardPositonObj);

            function evalPosition(piece, is_maximizer) {

                var cost = 0;
                var CROWN_FACTOR = 4;
                var piece_evalute = 0;
                if (piece.white) {
                    piece_evalute = draft.whiteCount + CROWN_FACTOR * draft.whiteKingCount;
                } else {
                    piece_evalute = draft.blackCount + CROWN_FACTOR * draft.blackKingCount;
                }
                var threat_attack_cost = 0; /*possibleThreatCost(piece)*/

                cost = piece_evalute + threat_attack_cost; // REMOVE COMMENT LATER

                cost = is_maximizer ? cost : -cost;//come back        

                return cost;
            }

            function generateMoves() {

                var moves;

                for (var p_index = 0; p_index < pieces.length; p_index++) {

                    if (pieces[p_index].white === draft.turn
                            || pieces[p_index].sqLoc === OFF_BOARD) {
                        continue;
                    }

                    draft.possibleMoves(pieces[p_index].sqLoc, moves);
                }

                return moves;
            }

            function search(is_maximizer, alpha, beta, n_depth, max_depth, piece) {

                n_depth++; // must be initialize to -1. Take note

                if (n_depth === max_depth) {
                    eval_count++;
                    var eval = evalPosition(piece, is_maximizer);//uncomment later                  
                    return eval;//return            
                }

                var value = is_maximizer ? -Infinity : Infinity;//come back  
                var next_turn = !draft.turn;
                var node_turn = draft.turn;

                var moves = generateMoves();
                var from, to;
                for (var i = 0; i < moves.length; i++) {

                    if (!moves[i].path) {
                        from = (moves[i] >> FROM_SQUARE_SHIFT)
                                & FROM_SQUARE_MASK;
                        to = (moves[i] >> TO_SQUARE_SHIFT)
                                & TO_SQUARE_MASK;
                    } else {
                        from = moves[i].from;
                        to = moves[i].path;
                    }
                    var was_crowned = draft.board[from].piece.crowned; //needed to get the correct status when undoing move
                    draft.moveTo(from, to);

                    var pre_value = value;

                    draft.turn = next_turn;//assign board turn used by the child node

                    value = search(!is_maximizer,
                            alpha,
                            beta,
                            n_depth,
                            max_depth,
                            draft.board[from].piece);



                    draft.turn = node_turn;
                    draft.undoMove(from, to, was_crowned);


                    if (is_maximizer) {

                        if (n_depth === 0) {

                            if (value > pre_value) {
                                //best_move = new Move(moves[i], node_turn, value, caputre_id, piece_name, -1);
                            }
                        }

                        if (value >= beta) {
                            prune_count++;
                            break;//prune                        
                        }

                        if (value < pre_value) {
                            value = pre_value;//bigger value                        
                            alpha = value;
                        }

                    } else {//if minimizer                
                        if (value <= alpha) {
                            prune_count++;
                            break;//prune                        
                        }

                        if (value > pre_value) {
                            value = pre_value;//smaller value                        
                            beta = value;
                        }
                    }

                    //update alpha or beta value                
                    alpha = is_maximizer ? value : alpha;
                    beta = !is_maximizer ? value : beta;

                }

            }

            function bestMove() {

                initEngine();

                var best = search(true, // is maximizer.
                        Infinity, //alpha value.
                        -Infinity, //beta value.            
                        -1, //depth : must first be initialize to -1.
                        DEPTH, //max search depth.
                        null
                        );


                return best;
            }


            this.play = function (fn) {
                var best = bestMove();
                draft.moveTo(best.from, best.path, fn);
            };
        };
    };


    this.Game = function (size) {

        var draft = Draft9ja(size);

        return function () {

            this.move = function (from, path, fn) {

                draft.moveTo(from, path, fn);
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

        var s = board[64].SquareLeftUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareLeftUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = board[22].SquareRightUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareRightUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = board[64].SquareLeftUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareLeftUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = board[22].SquareRightUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareRightUp;
            //s = null;
            s = s1;
        }

    };

    return this;
}


module.exports = Draft9ja;