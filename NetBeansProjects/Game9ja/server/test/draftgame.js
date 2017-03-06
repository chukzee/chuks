
function Draft9ja(size) {

    var squares = [];
    var SIZE = 10; //default is 10 by 10
    var SQ_COUNT, LAST_SQ_INDEX;

    var up_right = 1,
            up_left = 2,
            down_right = 3,
            down_left = 4;

    initBoard(size);

    function initBoard(size) {

        if (size) {
            SIZE = size;
        }

        SQ_COUNT = size * size;
        LAST_SQ_INDEX = SQ_COUNT - 1;

        var len = SQ_COUNT;
        var r = (SIZE - 2) / 2;
        for (var i = 0; i < len; i++) {
            var square = {};

            var pce = new Piece();
            var row = getRow(i);
            var col = getCol(i);
            pce.sqLoc = i;

            if (i <= SIZE * r) {
                pce.white = true;
            } else if (i >= SIZE * (SIZE - r)) {
                pce.white = false;
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
                    || (i >= SIZE * r && i < SIZE * (SIZE - r));


            square.sq = i;
            square.upLeft = leftUp(i);
            square.upRight =  rightUp(i);
            square.downLeft = leftDown(i);
            square.downRight = rightDown(i);

            square.piece = !isEmptySq ? pce : null;

            squares[i] = square;

        }
    }


    function Piece() {
        this.sqLoc = -1;
        this.crowned = false;
        this.white = true;

        return this;
    }

    function getRow(sq) {
        if (!sq || sq < 0 || sq > LAST_SQ_INDEX) {
            return;
        }
        return Math.floor(sq / SIZE);
    }

    function getCol(sq) {
        if (!sq || sq < 0 || sq > LAST_SQ_INDEX) {
            return;
        }
        return sq - (sq % SIZE) * SIZE;
    }

    function leftUp(sq) {
        if (!sq || sq < 0 || sq > LAST_SQ_INDEX) {
            return -1;
        }
        var loc = sq + SIZE - 1;
        if (getRow(sq) + 1 !== getRow(loc)
                || loc > LAST_SQ_INDEX) {
            return -1;
        }
        return loc;
    }

    function  rightUp(sq) {
        if (!sq || sq < 0 || sq > LAST_SQ_INDEX) {
            return -1;
        }
        var loc = sq + SIZE + 1;
        if (getRow(sq) + 1 !== getRow(loc)
                || loc > LAST_SQ_INDEX) {
            return -1;
        }
        return loc;
    }

    function leftDown(sq) {
        if (!sq || sq < 0 || sq > LAST_SQ_INDEX) {
            return -1;
        }
        var loc = sq - SIZE - 1;
        if (getRow(sq) - 1 !== getRow(loc)
                || loc < 0) {
            return -1;
        }
        return loc;
    }

    function rightDown(sq) {
        if (!sq || sq < 0 || sq > LAST_SQ_INDEX) {
            return -1;
        }
        var loc = sq - SIZE + 1;
        if (getRow(sq) - 1 !== getRow(loc)
                || loc < 0) {
            return -1;
        }
        return loc;
    }

    /**
     * Attempts to capture all capturable pieces from a given square
     * in all four directions.
     * Return the type (ie white or black) captured and an array of
     * square captured in all four directions
     * 
     * @param {type} sq
     * @return {Array, undefined}
     */
    function capture(sq) {
        var pce = squares[sq].piece;
        if (!pce) {//no piece on square
            return null;
        }

        if (pce.sqLoc !== sq) {
            console.warn("Invalid piece square location - Piece does not bear the exact square " + sq + " it is found on!");
            return;
        }
        //create the possible four directions of capture
        var caps = [[], [], [], []]; // pls do not use Array.fill() - i observed a behaviour that can easily cause bug!

        //do the capture
        return doCapture(pce.crowned, sq, sq, -1, pce.white, null, caps);
    }

    function doCapture(crowned, origin_sq, from_sq, old_from, white, captive, caps) {

        var c0, c1, c2, c3;

        c0 = nextCapture(crowned, origin_sq, from_sq, old_from, up_right, !white);
        c1 = nextCapture(crowned, origin_sq, from_sq, old_from, up_left, !white);
        c2 = nextCapture(crowned, origin_sq, from_sq, old_from, down_right, !white);
        c3 = nextCapture(crowned, origin_sq, from_sq, old_from, down_left, !white);

        if (c0) {
            if (captive) {
                caps[0].push(captive);
            }
            doCapture(crowned, origin_sq, c0.dest_sq, from_sq, white, c0.captive, caps);
        }

        if (c1) {
            if (captive) {
                caps[1].push(captive);
            }
            doCapture(crowned, origin_sq, c1.dest_sq, from_sq, white, c1.captive, caps);
        }
        if (c2) {
            if (captive) {
                caps[2].push(captive);
            }
            doCapture(crowned, origin_sq, c2.dest_sq, from_sq, white, c2.captive, caps);
        }
        if (c3) {
            if (captive) {
                caps[3].push(captive);
            }
            doCapture(crowned, origin_sq, c3.dest_sq, from_sq, white, c3.captive, caps);
        }

        return {white: !white, caps: caps};
    }

    function nextCapture(crowned, origin_sq, from_sq, old_from, direction, opponent) {
        var dest_sq = -1;
        var cap_sq = -1;
        switch (direction) {
            case up_right:
                {
                    cap_sq =  rightUp(from_sq);                    
                    if (crowned) {
                        //find captuable piece on the path
                        while(cap_sq > -1) {
                            if (squares[cap_sq].piece) {
                                break;//found!
                            }
                            cap_sq = rightUp(cap_sq);
                        }
                    }

                    dest_sq =  rightUp(cap_sq);
                }
                break;
            case up_left:
                {
                    cap_sq = leftUp(from_sq);
                    if (crowned) {
                        //find captuable piece on the path
                        while(cap_sq > -1) {
                            if (squares[cap_sq].piece) {
                                break;//found!
                            }
                            cap_sq = leftUp(cap_sq);
                        }
                    }

                    dest_sq = leftUp(cap_sq);
                }
                break;
            case down_right:
                {
                    cap_sq = rightDown(from_sq);
                    if (crowned) {
                        //find captuable piece on the path
                        while(cap_sq > -1) {
                            if (squares[cap_sq].piece) {
                                break;//found!
                            }
                            cap_sq = rightDown(cap_sq);
                        }
                    }

                    dest_sq = rightDown(cap_sq);
                }
                break;
            case down_left:
                {
                    cap_sq = leftDown(from_sq);
                    if (crowned) {
                        //find captuable piece on the path
                        while(cap_sq > -1) {
                            if (squares[cap_sq].piece) {
                                break;//found!
                            }
                            cap_sq = leftDown(cap_sq);
                        }
                    }

                    dest_sq = leftDown(cap_sq);
                }
                break;
            default:
                return;
        }

        if (dest_sq === old_from) {
            //destination square is the same as the previous destionation
            //on this path so do not capture.
            return;
        }

        if (!cap_sq || cap_sq === -1 || !dest_sq || dest_sq === -1) {
            //captive square or destination square is undefined or
            //out of board so dont capture.
            return;
        }

        var cap_pce = squares[cap_sq].piece;
        if (cap_pce.white !== opponent) {
            //captive is not opponent so dont capture.
            return;
        }

        var dest_pce = squares[dest_sq].piece;
        if (dest_pce.white === opponent) {
            //destination square is occupied by opponent piece so dont capture
            return;
        }

        if (dest_pce.white !== opponent && dest_sq !== origin_sq) {
            //destination square is occupied by own piece so dont capture except
            //if the destination square is same as origin square. Since not
            //same as origin square do not capture.
            return;
        }

        //at this point there is a capture
        return {captive: cap_pce, dest_sq: dest_sq};
    }


    this.printBoard = function () {
        for (var i = 0; i < SQ_COUNT; i++) {
            console.log(squares[i]);
        }
    };

    return this;
}

Draft9ja().printBoard();
