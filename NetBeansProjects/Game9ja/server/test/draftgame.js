
function Draft9ja(size) {

    this.turn = true; //white
    var squares = [];
    var pieces = [];
    var SIZE = 10; //default is 10 by 10
    var SQ_COUNT, OFF_BOARD, LAST_SQ_INDEX;

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

    this.setPiece = function (sq, white, crowned) {

        var r = (SIZE - 2) / 2;
        var square = {};

        var pce;

        if (!squares[sq] || !squares[sq].piece) {
            for (var i = 0; i < pieces.length; i++) {
                if (pieces[i].sqLoc === OFF_BOARD) {
                    pce = pieces[i];
                    break;
                }
            }
        } else {
            pce = squares[sq].piece;
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

        if (!squares[sq]) {
            squares[sq] = square;
        } else {
            squares[sq].piece = square.piece;
        }

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

        squares[SQ_COUNT] = {};
        squares[SQ_COUNT].sq = OFF_BOARD;
        squares[SQ_COUNT].rightUp = OFF_BOARD;
        squares[SQ_COUNT].leftUp = OFF_BOARD;
        squares[SQ_COUNT].rightDown = OFF_BOARD;
        squares[SQ_COUNT].leftDown = OFF_BOARD;

        squares[SQ_COUNT].SquareRightUp = squares[SQ_COUNT];
        squares[SQ_COUNT].SquareLeftUp = squares[SQ_COUNT];
        squares[SQ_COUNT].SquareRightDown = squares[SQ_COUNT];
        squares[SQ_COUNT].SquareLeftDown = squares[SQ_COUNT];

        for (var i = 0; i < len; i++) {
            setPiece(i);
        }

        for (var i = 0; i < SQ_COUNT; i++) {
            squares[i].SquareRightUp = squares[squares[i].rightUp];
            squares[i].SquareLeftUp = squares[squares[i].leftUp];
            squares[i].SquareRightDown = squares[squares[i].rightDown];
            squares[i].SquareLeftDown = squares[squares[i].leftDown];

        }

    }


    function Piece(sq, white, crowned) {
        //the piece id is set during board initializatin - see initBoard function
        if (arguments.length === 0) {
            this.sqLoc = OFF_BOARD;
            this.white = true;
            this.crowned = false;
        } else {
            this.sqLoc = sq;
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
        var pce = squares[sq].piece;
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
                        var next = squares[from_sq].SquareRightUp;
                        return manCaptive(next, next.SquareRightUp, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareRightUp', opponent);
                    }
                }
                break;
            case up_left:
                {

                    if (!crowned) {
                        var next = squares[from_sq].SquareLeftUp;
                        return manCaptive(next, next.SquareLeftUp, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareLeftUp', opponent);
                    }

                }
                break;
            case down_right:
                {
                    if (!crowned) {
                        var next = squares[from_sq].SquareRightDown;
                        return manCaptive(next, next.SquareRightDown, opponent);
                    } else {
                        return kingCaptive(from_sq, 'SquareRightDown', opponent);
                    }

                }
                break;
            case down_left:
                {

                    if (!crowned) {
                        var next = squares[from_sq].SquareLeftDown;
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

        var next = squares[from][lookupDirection];

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

        if (squares[sq].SquareLeftUp.piece
                && squares[sq].SquareLeftUp.piece.white === opponent
                && squares[sq].SquareLeftUp.SquareLeftUp.sq !== OFF_BOARD
                && !squares[sq].SquareLeftUp.SquareLeftUp.piece) {
            return true;
        }

        if (squares[sq].SquareRightUp.piece
                && squares[sq].SquareRightUp.piece.white === opponent
                && squares[sq].SquareRightUp.SquareRightUp.sq !== OFF_BOARD
                && !squares[sq].SquareRightUp.SquareRightUp.piece) {
            return true;
        }

        if (squares[sq].SquareLeftDown.piece
                && squares[sq].SquareLeftDown.piece.white === opponent
                && squares[sq].SquareLeftDown.SquareLeftDown.sq !== OFF_BOARD
                && !squares[sq].SquareLeftDown.SquareLeftDown.piece) {
            return true;
        }

        if (squares[sq].SquareRightDown.piece
                && squares[sq].SquareRightDown.piece.white === opponent
                && squares[sq].SquareRightDown.SquareRightDown.sq !== OFF_BOARD
                && !squares[sq].SquareRightDown.SquareRightDown.piece) {
            return true;
        }

        return false;
    }


    function canKingCapture(sq, opponent) {

        for (var i = 0; i < LOOKUP_DIRECTIONS.length; i++) {
            var next = squares[sq][LOOKUP_DIRECTIONS[i]];
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
        var pce = squares[from].piece;
        var to = path;
        if (path.constructor === Array) {
            //remove the captured pieces from the square

            for (var i = 0; i < path.length; i++) {
                var cap_sq = path[i].capture;

                if (squares[cap_sq].piece) {
                    squares[cap_sq].piece.sqLoc = OFF_BOARD;//yes
                    squares[cap_sq].piece = null;//yes also
                } else {
                    console.warn("Warning!!! captive not found on square " + cap_sq);
                }
            }
            //set the destination square
            to = path[path.length - 1].dest_sq;
        }

        squares[from].piece = null;
        squares[to].piece = null;//prevent reference issue
        squares[to].piece = pce;
        squares[to].piece.sqLoc = to;



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
        if (to !== OFF_BOARD && !squares[to].piece) {
            if (white && (squares[from].leftUp === to || squares[from].rightUp === to)) {
                return true;
            } else if (!white && (squares[from].leftDown === to || squares[from].rightDown === to)) {
                return true;
            }
        }

        //at this point the move is invalid
        if (to === OFF_BOARD) {
            fn({error: "Not a square."});
        } else if (squares[to].piece) {
            fn({error: "Square is not empty."});
        } else if (!squares[to].dark) {
            fn({error: "Cannot play on a light square."});
        } else {
            fn({error: "Invalid move."});
        }


        return false;
    }

    function validateKingMove(from, to, fn) {

        for (i = 0; i < LOOKUP_DIRECTIONS.length; i++) {
            var lookup = LOOKUP_DIRECTIONS[i];
            var next = squares[from][lookup];
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
        } else if (squares[to].piece) {
            fn({error: "Square is not empty."});
        } else if (!squares[to].dark) {
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
        if (sq === OFF_BOARD || !squares[sq].piece) {
            return false;
        }

        if (!squares[sq].piece.crowned) {
            return canManCapture(sq, !squares[sq].piece.white);
        } else {
            return canKingCapture(sq, !squares[sq].piece.white);
        }

    };

    function validateMove(from, to, fn) {

        if (!squares[from].piece) {
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
            if (squares[from].piece.crowned) {
                return validateKingMove(from, to, fn);
            } else {
                return validateManMove(from, to, squares[from].piece.white, fn);
            }
        }

    }

    function manPlainMoves(from_sq) {
        var moves = [];
        if (squares[from_sq].piece.white) {//white

            if (squares[from_sq].SquareRightUp.sq !== OFF_BOARD
                    && !squares[from_sq].SquareRightUp.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= squares[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
            if (squares[from_sq].SquareLeftUp.sq !== OFF_BOARD
                    && !squares[from_sq].SquareLeftUp.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= squares[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }

        } else {//black
            if (squares[from_sq].SquareRightDown.sq !== OFF_BOARD
                    && !squares[from_sq].SquareRightDown.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= squares[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
            if (squares[from_sq].SquareLeftDown.sq !== OFF_BOARD
                    && !squares[from_sq].SquareLeftDown.piece) {

                var bit_move = 0;//initialize - it is important to initialize
                bit_move |= from_sq;
                bit_move |= squares[from_sq].SquareRightUp.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

            }
        }
        return moves;
    }

    function manKingMoves(from_sq) {
        var moves = [];
        var bit_move = 0;//initialize - it is important to initialize

        for (var i = 0; i < LOOKUP_DIRECTIONS.length; i++) {
            var next = squares[from_sq][LOOKUP_DIRECTIONS[i]];
            while (next.sq !== OFF_BOARD && !next.piece) {

                bit_move |= from_sq;
                bit_move |= next.sq << TO_SQUARE_SHIFT;
                moves.push(bit_move);

                next = next[LOOKUP_DIRECTIONS[i]];
            }
        }

        return moves;
    }

    this.possibleMoves = function (from_sq) {
        if (!squares[from_sq].piece) {
            return [];
        }

        if (!squares[from_sq].piece.crowned) {
            if (canManCapture(from_sq, !squares[from_sq].piece.white)) {
                return searchCaputrePaths(from_sq);
            }
            return manPlainMoves(from_sq);
        } else {
            if (canKingCapture(from_sq, !squares[from_sq].piece.white)) {
                return searchCaputrePaths(from_sq);
            }
            return manKingMoves(from_sq);
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

    this.undoMove = function (move) {


    };

    this.clearBoard = function () {
        for (var i = 0; i < SQ_COUNT; i++) {
            if (squares[i].piece) {
                squares[i].piece.sqLoc = OFF_BOARD;//remove the piece from the board
                squares[i].piece = null;//nullify the piece reference on the square
            }
        }
    };


    this.printBoard = function () {

        for (var i = 0; i < SQ_COUNT; i++) {
            console.log(squares[i]);
        }

    };


    this.Engine = function () {

        var draft = Draft9ja();
        var DEPTH = 5;
        var p_index;
        var eval_count;
        var prune_count;

        function initEngine() {
            p_index = -1;
            eval_count = 0;
            prune_count = 0;
        }

        return function (depth) {

            if (depth) {
                DEPTH = depth;
            }

            function evalPosition(piece, is_maximizer) {
                //COME BACK - NOT OK YET!!!
                var cost = 0;

                //var piece_evalute=evaluatePiecesOnBoardCost();        
                //var threat_attack_cost = possibleThreatCost(piece);

                //cost= evalute;//TESTING!!! COMMENT HERE LATER

                //cost= piece_evalute + threat_attack_cost; // REMOVE COMMENT LATER

                //cost = is_maximizer ? cost : -cost;//come back        

                //if(cost==0)
                //  cost=(int)(Math.random()*(Constants.pawn_cost-5));
                //return 0;        
                return cost;
            }

            function generateMoves() {

                var moves;

                if (p_index === pieces.length) {
                    p_index = 0;
                }


                if (pieces[p_index].white === draft.turn
                        || pieces[p_index].sqLoc === OFF_BOARD) {
                    p_index++;
                    generateMoves();
                }

                moves = draft.possibleMoves(pieces[p_index].sqLoc);


                return moves;
            }

            function search(is_maximizer, alpha, beta, n_depth, max_depth, piece) {

                n_depth++; // must be initialize to -1. Take note

                if (n_depth === max_depth) {
                    eval_count++;
                    var eval = evalPosition(is_maximizer);//uncomment later                  
                    return eval;//return            
                }

                var value = is_maximizer ? -Infinity : Infinity;//come back  
                var next_turn = !draft.turn;
                var node_turn = draft.turn;

                var moves = generateMoves();

                for (var i = 0; i < moves.length; i++) {

                    var pre_value = value;

                    draft.turn = next_turn;//assign board turn used by the child node

                    value = search(!is_maximizer,
                            alpha,
                            beta,
                            n_depth,
                            max_depth,
                            piece);



                    draft.turn = node_turn;
                    draft.undoMove(moves[i]);


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

        var s = squares[64].SquareLeftUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareLeftUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = squares[22].SquareRightUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareRightUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = squares[64].SquareLeftUp;
        while (s.sq !== OFF_BOARD) {
            console.log("sq ", s.sq);
            var s1 = s.SquareLeftUp;
            //s = null;
            s = s1;
        }

        console.log("-----------------------");

        s = squares[22].SquareRightUp;
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