
function Draft9ja(size) {

    var squares = [];
    var SIZE = 10; //default is 10 by 10
    initBoard(size);
    function initBoard(size) {
        if (size) {
            SIZE = size;
        }
        var len = SIZE * SIZE;
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
            square.upLeft = upLeft(i);
            square.upRight = upRight(i);
            square.downLeft = downLeft(i);
            square.downRight = downRight(i);

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
        return Math.floor(sq / SIZE);
    }

    function getCol(sq) {
        return sq - (sq % SIZE) * SIZE;
    }

    function upLeft(sq) {
        var loc = sq + SIZE - 1;
        if (getRow(sq) + 1 !== getRow(loc)
                || loc > SIZE * SIZE - 1) {
            return -1;
        }
        return loc;
    }

    function upRight(sq) {
        var loc = sq + SIZE + 1;
        if (getRow(sq) + 1 !== getRow(loc)
                || loc > SIZE * SIZE - 1) {
            return -1;
        }
        return loc;
    }

    function downLeft(sq) {
        var loc = sq - SIZE - 1;
        if (getRow(sq) - 1 !== getRow(loc)
                || loc < 0) {
            return -1;
        }
        return loc;
    }

    function downRight(sq) {
        var loc = sq - SIZE + 1;
        if (getRow(sq) - 1 !== getRow(loc)
                || loc < 0) {
            return -1;
        }
        return loc;
    }


    this.printBoard = function () {
        for (var i = 0; i < SIZE * SIZE; i++) {
            console.log(squares[i]);
        }
    };

    return this;
}
