
function Draft9ja(size) {

    var squares = [];
    var SIZE = 10; //default is 10 by 10
    var SQ_COUNT, OFF_BOARD, LAST_SQ_INDEX;

    var up_right = 1,
            up_left = 2,
            down_right = 3,
            down_left = 4;

    var REVERSE_DIRECTION = [];

    REVERSE_DIRECTION[up_right] = down_left;
    REVERSE_DIRECTION[up_left] = down_right;
    REVERSE_DIRECTION[down_right] = up_left;
    REVERSE_DIRECTION[down_left] = up_right;

    var LOOKUP_DIRECTIONS = ['SquareRightUp', 'SquareLeftUp', 'SquareRightDown', 'SquareLeftDown'];

    this.setPiece = function (sq, white, crowned) {

        var r = (SIZE - 2) / 2;
        var square = {};

        var pce = new Piece();
        var row = getRow(sq);
        var col = getCol(sq);
        pce.sqLoc = sq;

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
        return findCaptives(pce.crowned, sq, 0, pce.white, null, caps, false);
    };

    function findCaptives(crowned, from_sq, old_direction, white, node, caps, cyclic) {


        //first check if it is going roundabout.
        if (cyclic) {
            return caps;//avoid roundabout trip which causes stackoverflow on recursion
        }

        var c0, c1, c2, c3;

        c0 = nextCaptive(crowned, from_sq, old_direction, up_right, !white);
        c1 = nextCaptive(crowned, from_sq, old_direction, up_left, !white);
        c2 = nextCaptive(crowned, from_sq, old_direction, down_right, !white);
        c3 = nextCaptive(crowned, from_sq, old_direction, down_left, !white);

        if (c0) {
            var node0 = {};
            node0.prev = node;
            node0.cap = c0;

            node0.visited = node0.prev ? node0.prev.visited : {};
            cyclic = node0.visited[c0.captive.sqLoc] === 1; //detect if captive square has already been visited to avoid aroundabout (cyclic) trip capable of causing stackoverflow on recursion.
            node0.visited[c0.captive.sqLoc] = 1;

            findCaptives(crowned, c0.dest_sq, up_right, white, node0, caps, cyclic);

            c0 = cyclic ? null : c0;
        }
        if (c1) {
            var node1 = {};
            node1.prev = node;
            node1.cap = c1;

            node1.visited = node1.prev ? node1.prev.visited : {};
            cyclic = node1.visited[c1.captive.sqLoc] === 1; //detect if captive square has already been visited to avoid aroundabout (cyclic) trip capable of causing stackoverflow on recursion.
            node1.visited[c1.captive.sqLoc] = 1;

            findCaptives(crowned, c1.dest_sq, up_left, white, node1, caps, cyclic);

            c1 = cyclic ? null : c1;

        }
        if (c2) {
            var node2 = {};
            node2.prev = node;
            node2.cap = c2;

            node2.visited = node2.prev ? node2.prev.visited : {};
            cyclic = node2.visited[c2.captive.sqLoc] === 1; //detect if captive square has already been visited to avoid aroundabout (cyclic) trip capable of causing stackoverflow on recursion.
            node2.visited[c2.captive.sqLoc] = 1;

            findCaptives(crowned, c2.dest_sq, down_right, white, node2, caps, cyclic);

            c2 = cyclic ? null : c2;

        }
        if (c3) {
            var node3 = {};
            node3.prev = node;
            node3.cap = c3;

            node3.visited = node3.prev ? node3.prev.visited : {};
            cyclic = node3.visited[c3.captive.sqLoc] === 1; //detect if captive square has already been visited to avoid aroundabout (cyclic) trip capable of causing stackoverflow on recursion.
            node3.visited[c3.captive.sqLoc] = 1;

            findCaptives(crowned, c3.dest_sq, down_left, white, node3, caps, cyclic);

            c3 = cyclic ? null : c3;

        }

        if (!c0 && !c1 && !c2 && !c3) {
            var node_caps = [];
            var prev_node = node;
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
            return {captive: next.piece, dest_sq: after_next.sq};
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

                    return {captive: pce, dest_sq: sqs};
                }
                return;//leave - square blocked by own piece
            }

            next = next[lookupDirection];
        }
    }

    //NOT YET TESTED FOR CORRECTNESS!!!
    function filterCapturePath(cps, p) {

        var o = {};
        var max = 0;
        for (var i = 0; i < cps.length; i++) {
            var c = cps[i];
            var count = 0;
            for (var k = 0; k < c.length; k++) {
                for (var m = 0; m < p.length; m++) {
                    if (p[m] === c[k]) {
                        count++;
                    }
                }
            }
            if (max < count) {
                max = count;
            }
            if (!o[count]) {
                o[count] = {};
                o[count].index = i;
                o[count].dup = false;//duplicate is false
            } else {
                o[count].dup = true;//duplicate is true
            }
        }


        if (o[max] && !o[max].dup) {
            var index = o[max].index;
            return cps[index];
        }

    }


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

        for (var i = 0; i < LOOKUP_DIRECTIONS; i++) {
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
        var to = path, captives_sq;
        if (path.constructor === Array) {
            //remove the captured pieces from the square
            captives_sq = [];
            for (var i = 0; i < path.lenth; i++) {
                var cap_sq = path[i].captive.sqLoc;
                captives_sq.push(cap_sq);
                if (squares[cap_sq].piece) {
                    squares[cap_sq].piece.sqLoc = OFF_BOARD;
                    squares[cap_sq].piece = null;
                } else {
                    console.warn("Warning!!! captive not found on square " + cap_sq);
                }
            }
            //set the destination square
            to = path[path.length - 1].dest_sq;
            if (to.dest_sq.constructor === Array) {
                if (to.length === 1) {
                    to = to[0];
                } else {
                    throw new Error("Invalid capture array parameter! Ambitigious destination. Please provide the final destination square.");
                }
            }
        }

        squares[from].piece = null;
        squares[to] = null;//prevent reference issue
        squares[to] = pce;
        pce.sqLoc = to;

        if (fn) {

            fn({
                error: null, //yes, the user must check for error
                from: from,
                to: to,
                target: pce,
                capture: captives_sq ? captives_sq : []
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
        if (caps.length) {            
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
                var td = to[k].dest_sq.constructor === Array ? to[k].dest_sq[0] : to[k].dest_sq;
                var cd = c[k].dest_sq.constructor === Array ? c[k].dest_sq[0] : c[k].dest_sq;
                if (td !== cd
                        || to[k].captive.sqLoc !== c[k].captive.sqLoc) {
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

    this.moveTo = function (from, to, fn) {
        if (fn) {
            if (!validateMove(from, to, fn)) {
                return;
            }
        }
        effectMove(from, to, fn);
    };

    this.clearBoard = function () {
        for (var i = 0; i < SQ_COUNT; i++) {
            squares[i].piece = null;
        }
    };


    this.printBoard = function () {

        for (var i = 0; i < SQ_COUNT; i++) {
            console.log(squares[i]);
        }

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