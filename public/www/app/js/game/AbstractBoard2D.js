
/* global Main, Ns */


Ns.game.AbstractBoard2D = {

    internalGame: null,// the game engine. e.g chessj.s and my draftgame.js
    userSide: null, //whether 'b' or 'w'. ie black or white. default is null for watched game
    isBoardFlip: false, //whether black to white direction. default is white to black (false)
    squareList: {},
    hoverSquare: null,
    pickedSquare: null,
    boardRowCount: 8, //default is 8
    boardContainer: null,
    boardX: -1,
    boardY: -1,
    boardRow: -1,
    boardCol: -1,
    boardSq: -1,
    startTouchBoardX: -1,
    startTouchBoardY: -1,
    startTouchBoardRow: -1,
    startTouchBoardCol: -1,
    startTouchBoardSq: -1,
    isTouchingBoard: false,
    /**
     * Loads and sets up the game on the specified contaner using
     * the provided game position. If the game position is not provided
     * then the starting position is setup. The provided theme is used
     * if provided otherwise the default is used.<br>
     * 
     * The argument is expected to be an object with the following 
     * properties:<br>
     * <br>
     * obj = {<br>
     *        container: 'the_container', //compulsory <br>
     *        variant:'the variant', //compulsory for draft only <br>
     *        gamePosition: 'the_game_posiont', //optional<br>
     *        white: true, //whether the user is white or black. For watched games this field in absent<br>
     *        flip: true, //used in watched games only. whether the board should face black to white direction. ie black is below and white above<br>
     *        pieceTheme: 'the_piece_theme', //optional<br>
     *        boardTheme: 'the_board_theme'  //optional<br>
     * }<br>
     *
     * The gameboard squares are indexed as illustrated below:
     * 
     *   +----+----+----+----+----+----+----+----+
     * 8 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 |
     *   +----+----+----+----+----+----+----+----+
     * 7 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 |
     *   +----+----+----+----+----+----+----+----+
     * 6 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 |
     *   +----+----+----+----+----+----+----+----+
     * 5 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
     *   +----+----+----+----+----+----+----+----+
     * 4 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 |
     *   +----+----+----+----+----+----+----+----+
     * 3 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
     *   +----+----+----+----+----+----+----+----+
     * 2 |  8 |  9 | 10 | 11 | 12 | 13 | 14 | 15 |
     *   +----+----+----+----+----+----+----+----+
     * 1 |  0 |  1 |  2 |  3 |  4 |  5 |  6 |  7 |
     *   +----+----+----+----+----+----+----+----+
     *      a    b    c    d    e    f    g    h
     *      
     * @param {type} obj
     * @returns {undefined}
     */
    load: function (internal_game, obj, callback) {
        this.internalGame = internal_game;
        this.userSide = obj.white === true ? 'w' : (obj.white === false ? 'b' : null); //strictly true or false
        this.isBoardFlip = obj.flip;

        var el = document.getElementById(obj.container);
        this.boardContainer = el;
        el.innerHTML = '';//clear any previous
        var board_cls = this.getBoardClass(obj.inverseBoard);
        var gameboard = this.board(el, board_cls, obj.pieceTheme, obj.bordTheme);
        el.appendChild(gameboard);

        callback(this); // note for 3D which may be asynchronous this may not be call here but after the async proccess

    },

    board: function (container, board_cls ,piece_theme, board_theme) {
        var table = document.createElement('table');
        table.className = board_cls;
        
        var me = this;
        
        var clickBoard = function(evt){
            me.onClickBoard(evt, this);
        };
        
        var touchStartBoard = function(evt){
            me.onTouchStartBoard(evt, this);
        };
        
        var hoverBoard = function(evt){
            me.onHoverBoard(evt, this);
        };
        
        var hoverBoardEnd = function(evt){
            me.onHoverBoardEnd(evt, this);
        };
        
        
        if (this.userSide) {//enable board listener only if the user is playing game
            if (Main.device.isMobileDeviceReady) {
                container.addEventListener('touchstart', touchStartBoard);
                container.addEventListener('touchmove', hoverBoard);
                container.addEventListener('touchend', hoverBoardEnd);
                container.addEventListener('touchcancel', hoverBoardEnd);
            } else {
                container.addEventListener('click', clickBoard);
                container.addEventListener('mousemove', hoverBoard);
                container.addEventListener('mouseleave', hoverBoardEnd);//mouseout behaviour is not appropriate because is fires for every children
            }
        }
        
        

        for (var i = 0; i < this.boardRowCount; i++) {
            var tr = document.createElement('tr');
            for (var k = 0; k < this.boardRowCount; k++) {
                var td = document.createElement('td');
                td.dataset.square = '';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }


        var rw = table.children;
        var sq = -1;
        for (var i = rw.length - 1; i > -1; i--) {
            var sqs = rw[i].children;
            for (var k = 0; k < sqs.length; k++) {
                sq++;
                this.squareList[sq] = sqs[k];
            }
        }

        this.arrangeBoard(container, piece_theme);

        return table;
    },
    toNumericSq: function (notation) {
        notation = notation + "";
        var a = notation.charAt(0);
        var b = notation.charAt(1);
        var b = (b - 1) * this.boardRowCount - 1;

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
        }

        return b + a;
    },
    toSquareNotation: function (sq) {

        var row = Math.floor(sq / this.boardRowCount);
        var col = sq % this.boardRowCount;
        row += 1;
        switch (col) {
            case 0:
                col = 'a';
                break;
            case 1:
                col = 'b';
                break;
            case 2:
                col = 'c';
                break;
            case 3:
                col = 'd';
                break;
            case 4:
                col = 'e';
                break;
            case 5:
                col = 'f';
                break;
            case 6:
                col = 'g';
                break;
            case 7:
                col = 'h';
                break;
        }

        return col + row;
    },
    getPieceOnSquare: function (sq) {

    },

    setPieceOnSquare: function (pieces, sq) {

    },

    movePiece: function (from_sq, to_sq) {
        if (this.isBoardFlip) {
            from_sq = this.flipSquare(from_sq);
            to_sq = this.flipSquare(to_sq);
        }

        var el = this.getPieceOnSquare(from_sq);
        if (!el) {
            console.warn('piece not found on sqare ', from_sq);
            return;
        }

        var duration = 1000; //in milliseconds
        var center = this.squareCenter(to_sq);
        var prop = {
            top: center.y,
            left: center.x
        };
        var me = this;
        Main.anim.to(el, duration, prop, function () {
            //making sure the piece is on the right spot just in
            //case the orientation changes or the board is resized
            center = me.squareCenter(to_sq);
            el.style.top = center.y + 'px';
            el.style.left = center.x + 'px';
        });
    },
    /**
     * The method is required if the board is flipped
     *  black-to-white direction.ie black is down and white up
     *  @argument {Integer} sq 
     */
    flipSquare: function (sq) {
        var row = Math.floor(sq / this.boardRowCount);
        var col = sq % this.boardRowCount;

        var flip_row = this.boardRowCount - row - 1;
        var flip_col = this.boardRowCount - col - 1;

        var flip_sq = flip_row * this.boardRowCount + flip_col;

        return flip_sq;
    },
    squareCenter: function (sq) {

        var box = this.boardContainer.getBoundingClientRect();
        var center_x, center_y;

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;

        var row = Math.floor(sq / this.boardRowCount);
        var col = this.boardRowCount - sq % this.boardRowCount - 1;

        center_x = (this.boardRowCount - col) * sq_w - sq_w / 2;
        center_y = (this.boardRowCount - row) * sq_h - sq_h / 2;

        return {
            x: center_x,
            y: center_y
        };
    },
    highlightSquare: function (sqEl, style) {
        if (sqEl) {
            sqEl.style = style;
        }
    },
    
    onClickBoard: function (evt, container ,is_tap) {
        if (is_tap) {
            this.boardX = this.startTouchBoardX;
            this.boardY = this.startTouchBoardY;
            this.boardRow = this.startTouchBoardRow;
            this.boardCol = this.startTouchBoardCol;
            this.boardSq = this.startTouchBoardSq;
        } else {
            this.boardXY(container, evt, is_tap);
        }

        if (this.pickedSquare) {
            this.highlightSquare(this.pickedSquare, '');//remove the highlight
            this.pickedSquare = null;
            return;
        }

        var sq = this.boardSq;
        var sqn = this.toSquareNotation(sq);        
        var pce = this.getInternalPiece(sqn);
        if (pce && pce.color === this.userSide) {
            this.pickedSquare = this.squareList[sq];
            this.highlightSquare(this.pickedSquare, 'background: yellow');
        }
    },
    onTouchStartBoard: function (evt, container) {
        if (evt.touches) {
            if (evt.touches.length === 1) {
                evt.preventDefault();//important!
                this.boardXY(container, evt, true);
            }
        }
    },
    onHoverBoard: function (evt, container) {
        if (evt.touches) {
            if (evt.touches.length === 1) {
                evt.preventDefault();
                this.boardXY(container, evt);
                this.isTouchingBoard = true;
            }
        } else {
            //mouse move
            this.boardXY(container, evt);
        }
        //small problem still dey - come back later
        var sq = this.boardSq;
        if (this.squareList[sq] === this.pickedSquare) {
            if (this.hoverSquare !== this.pickedSquare) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
            return;
        }

        if (this.hoverSquare !== this.pickedSquare) {
            this.highlightSquare(this.hoverSquare, '');//remove the highlight
        }
        this.hoverSquare = this.squareList[sq];
        this.highlightSquare(this.hoverSquare, 'background: red');

    },

    onHoverBoardEnd: function (evt) {
        if (evt.touches && !this.isTouchingBoard) {// tap detected
            this.onClickBoard(null, null, true);
            return;
        }
        this.boardX = -1;
        this.boardY = -1;
        this.isTouchingBoard = false;
        if (this.hoverSquare !== this.pickedSquare) {
            this.highlightSquare(this.hoverSquare, '');//remove the highlight
        }
    },
    boardXY: function (container, e, is_start_touch) {
        var posx = 0;
        var posy = 0;

        if (!e)
            var e = window.event;
        if (e.touches && e.touches.length) {
            posx = e.touches[0].pageX;
            posy = e.touches[0].pageY;
        } else if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
        }
        // posx and posy contain the mouse position relative to the document

        var box = container.getBoundingClientRect();
        var x = posx - box.left;
        var y = posy - box.top;

        //row and col

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;

        if (Main.device.isMobileDeviceReady
                && !Main.device.isLarge()) {//for only smart phones and tablets of medium size
            //Now make the y offset allow easy pick of piece especailly on small device
            if (y < box.height - sq_h / 2) {//above middle of first row
                y -= sq_h; // offset y by square height
            }
        }

        var row = Math.floor((box.height - y) / sq_h);
        var col = this.boardRowCount - Math.floor((box.width - x) / sq_w) - 1;

        if (row < 0
                || col < 0
                || row > this.boardRowCount - 1
                || col > this.boardRowCount - 1) {//OFF BOARD

            this.boardX = -1;
            this.boardY = -1;
            this.boardRow = -1;
            this.boardCol = -1;
            this.boardSq = -1;
            //Clear highlighted squares
            this.highlightSquare(this.hoverSquare, '');//remove the highlight
            this.hoverSquare = null;
            console.log('leave');
            return;
        }

        var sq = row * this.boardRowCount + col;

        if (is_start_touch) {
            this.startTouchBoardX = x;
            this.startTouchBoardY = y;
            this.startTouchBoardRow = row;
            this.startTouchBoardCol = col;
            this.startTouchBoardSq = sq;
        } else {
            this.boardX = x;
            this.boardY = y;
            this.boardRow = row;
            this.boardCol = col;
            this.boardSq = sq;
        }

        //console.log(posx, posy);
        //console.log(x, y);
        //console.log('x=', x, 'y=', y, 'row=', row, 'col=', col, 'sq=', sq);

    }
};