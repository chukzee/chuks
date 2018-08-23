
/* global Main, Ns */


Ns.game.AbstractBoard2D = {

    internalGame: null, // the game engine. e.g chessj.s and my draftgame.js
    userSide: null, //whether 'b' or 'w'. ie black or white. default is null for watched game
    isBoardFlip: false, //whether black to white direction. default is white to black (false)
    ANIM_MAX_DURATION: 500,
    HOVER_SQUARE_STYLE: 'background: red', //TODO - use beautiful bacground, possibly beautiful imgage
    PICKED_SQUARE_STYLE: 'background: yellow', //TODO - use beautiful bacground, possibly beautiful imgage
    CAPTURED_SQUARE_STYLE: 'background: blue', //TODO - use beautiful bacground, possibly beautiful imgage

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
     * @param {type} internal_game
     * @param {type} obj
     * @param {type} callback
     * @returns {undefined}
     */
    load: function (internal_game, obj, callback) {
        this.squareList = {};
        this.squarePieces = [];
        this.hoverSquare = null;
        this.pickedSquare = null;
        this.captureSquareList = [];
        this.pickedPiece = null;
        this.boardRowCount = 8; //default is 8
        this.boardContainer = null;
        this.pieceWidth = null;
        this.pieceHeight = null;
        this.boardX = -1;
        this.boardY = -1;
        this.boardRow = -1;
        this.boardCol = -1;
        this.boardSq = -1;
        this.startTouchBoardX = -1;
        this.startTouchBoardY = -1;
        this.startTouchBoardRow = -1;
        this.startTouchBoardCol = -1;
        this.startTouchBoardSq = -1;
        this.isTouchingBoard = false;

        if (obj.variant) {
            var vrnt = this.getVariant(obj.variant);
            var board_size = vrnt.size;
            var s = board_size.split('x'); //e.g 8x8, 10x10, 12x12
            this.boardRowCount = s[0] - 0;//implicitly convet to numeric
        }

        this.internalGame = internal_game;
        this.userSide = obj.white === true ? 'w' : (obj.white === false ? 'b' : null); //strictly true or false
        this.isBoardFlip = obj.flip;

        var el = document.getElementById(obj.container);

        var me = this;
        var extra_dom_prop = '_resizeBoardContainerHandler_game9ja'; // must be a constant - do not use datetime
        var old_handler = el[extra_dom_prop];
        if (old_handler) {//remove old handler
            el.addEventListener('resize', old_handler);
            el.addEventListener('orientationchange', old_handler);
        }

        var resizeBoardContainer = function (evt) {
            me.boardContainer = me.properlySizedBoardContainer(el, me.boardRowCount, obj.boardTheme, obj.inverseBoard);
        };
        
        el.addEventListener('resize', resizeBoardContainer);
        el.addEventListener('orientationchange', resizeBoardContainer);
        
        el[extra_dom_prop] = resizeBoardContainer; //register the handler for later removal
        
        resizeBoardContainer();

        el.innerHTML = '';//clear any previous
        el.appendChild(this.boardContainer);

        //var board_cls = this.getBoardClass(obj.inverseBoard);//@Deprecated

        var gameboard = this.board(el, obj.pieceTheme, obj.boardTheme);

        this.boardContainer.appendChild(gameboard);

        callback(this); // note for 3D which may be asynchronous this may not be call here but after the async proccess

    },

    /**
     * Creates a properly sized board container. This container is created
     * so that we can give it a proper size to avoid a situation where the
     * board theme image is not repeated evenly. If the width of the container
     * is not a multiple of the board number of rows then there is a possibity of 
     * the theme image not evenly repeated (a Bazaar look). 
     * Thus we will give a size which is the highest multiple of the
     * board number of rows closest to the size of the provided element
     * 
     * 
     * @param {type} el -  the provided element upon which we will create the board container
     * @param {Integer} row_count 
     * @param {Integer} board_theme 
     * @param {Integer} inverse_board 
     * @returns {undefined}
     */
    properlySizedBoardContainer: function (el, row_count, board_theme, inverse_board) {

        var proper_container = document.createElement('div');

        proper_container.style.backgroundImage = 'url(../resources/games/chess/board/themes/' + board_theme + '/60' + (inverse_board ? '-inverse' : '') + '.png)';
        proper_container.style.backgroundRepeat = 'repeat';
        proper_container.style.backgroundSize = 100 / (this.boardRowCount / 2) + '%';
        console.log(proper_container.style.backgroundSize);
        var box = el.getBoundingClientRect();

        var row_width = Math.floor(box.width / row_count); // to ensure the board theme image is properly repeated

        var cont_size = row_width * row_count;
        proper_container.style.width = cont_size + 'px';
        proper_container.style.height = cont_size + 'px';

        return proper_container;
    },
    createPieceElement: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    pieceSquarRatio: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    isWhite: function (pce) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getInternalPiece: function (sqn) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    getBoardClass: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    makeMove: function (from, to) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    arrangeBoard: function (container, piece_theme) {
        var box = container.getBoundingClientRect();

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;
        var ratio = this.pieceSquarRatio();
        if (!ratio) {
            ratio = 0.8;
        }
        var pw = sq_w * ratio; // piece width
        var ph = sq_h * ratio; //piece height
        this.pieceWidth = pw;
        this.pieceHeight = ph;

        //range pieces
        var SQ_COUNT = this.boardRowCount * this.boardRowCount;
        for (var i = 0; i < SQ_COUNT; i++) {
            var sqn = this.toSquareNotation(i);
            var pce = this.getInternalPiece(sqn);
            if (!pce) {
                continue;
            }
            var sq = i;
            if (this.isBoardFlip) {
                sq = this.flipSquare(i);
            }

            //create piece element

            var pe = this.createPieceElement(pce, piece_theme);

            pe.dataset.type = "piece";
            pe.style.width = pw + 'px';
            pe.style.height = ph + 'px';
            var center = this.squareCenter(sq);
            var py = center.y - ph / 2;
            var px = center.x - pw / 2;
            pe.style.cursor = 'pointer';
            pe.style.position = 'absolute';
            pe.style.top = py + 'px';
            pe.style.left = px + 'px';

            this.squarePieces[sq] = pe;

            container.appendChild(pe);

            console.log(pce);
        }

    },

    board: function (container, piece_theme, board_theme) {
        var table = document.createElement('table');
        //table.className = board_cls;/*Deprecated*/

        table.style.width = '100%';
        table.style.height = '100%';
        table.style.borderCollapse = 'collapse';

        var me = this;

        var clickBoard = function (evt) {
            me.onClickBoard(evt, this);
        };

        var touchStartBoard = function (evt) {
            me.onTouchStartBoard(evt, this);
        };

        var hoverBoard = function (evt) {
            me.onHoverBoard(evt, this);
        };

        var hoverBoardEnd = function (evt) {
            me.onHoverBoardEnd(evt, this);
        };


        if (this.userSide) {//enable board listener only if the user is playing game

            var is_event_set = '_is_Board_Event_Set';

            if (!container[is_event_set]) {
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
                container[is_event_set] = true;
            }
        }


        for (var i = 0; i < this.boardRowCount; i++) {
            var tr = document.createElement('tr');
            tr.style.border = 'none';
            for (var k = 0; k < this.boardRowCount; k++) {
                var td = document.createElement('td');
                td.style.border = 'none';
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
                this.squareList[sq].dataset.square = sq;//for identifying the squares
            }
        }

        this.arrangeBoard(container, piece_theme);

        return table;
    },
    toNumericSq: function (notation) {

        notation = notation + "";
        var a = notation.charAt(0);
        var b = notation.substring(1);
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
            case 8:
                col = 'i';
                break;
            case 9:
                col = 'j';
                break;
            case 10:
                col = 'k';
                break;
            case 11:
                col = 'l';
                break;
        }

        return col + row;
    },

    movePiece: function (from, to, capture) {
        var target;
        if (typeof from === 'object'
                && typeof from !== 'number'
                && typeof from !== 'string') {
            target = from; //element
        }
        if (this.isBoardFlip) {
            if (!target) {
                from = this.flipSquare(from);
            }
            to = this.flipSquare(to);
        }
        if (!target) {
            target = this.getPieceOnSquare(from);
            if (!target) {
                console.warn('piece not found on sqare ', from);
                return;
            }
        }

        //capture piece
        if (capture) {
            this.capturePiece(capture);
        }

        for (var i = 0; i < this.squarePieces.length; i++) {
            if (target === this.squarePieces[i]) {
                this.squarePieces[i] = null; //remove from old location
                break;
            }
        }

        this.squarePieces[to] = target;// new location

        var center = this.squareCenter(to);
        var py = center.y - this.pieceHeight / 2;
        var px = center.x - this.pieceWidth / 2;
        var prop = {
            top: py,
            left: px
        };
        var me = this;

        target.style.zIndex = 1000; // so as to fly over
        var dist = Math.sqrt(px * px + py * py);
        var board_width = this.boardContainer.getBoundingClientRect().width;
        Main.anim.to(target, this.ANIM_MAX_DURATION * dist / board_width, prop, function () {
            //making sure the piece is on the right spot just in
            //case the orientation changes or the board is resized
            center = me.squareCenter(to);
            py = center.y - this.pieceHeight / 2;
            px = center.x - this.pieceWidth / 2;
            target.style.top = py + 'px';
            target.style.left = px + 'px';
            target.style.zIndex = null;
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

    getPieceOnSquare: function (sq) {
        //var center = this.squareCenter(sq);        
        return this.squarePieces[sq];
    },

    pickPieceOnSquare: function (sq) {
        if (this.pickedPiece) {
            return;
        }

        this.pickedPiece = this.getPieceOnSquare(sq);

        this.pickedPiece.style.zIndex = 1000;
    },

    capturePiece: function (capture) {

        if (capture.constructor === Array) {//an array
            for (var i = 0; i < capture.length; i++) {
                capture[i] = this.toNumericSq(capture[i]);
            }
        } else {//not an array
            capture = [this.toNumericSq(capture)]; //mare array
        }

        //remove captured piece from the board
        for (var i = 0; capture && i < capture.length; i++) {
            var cap_sq = capture[i];
            var pce = this.squarePieces[cap_sq];

            this.squarePieces[cap_sq] = null;// clear the square
            var box = pce.getBoundingClientRect();
            var dist = box.width ? box.width : '200';
            dist = '-' + dist + 'px';
            Main.anim.to(pce, 1000, {right: dist, top: dist}, function () {
                //do nothing for now atleast
            });
        }


    },

    onClickBoard: function (evt, container, is_tap) {
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
            if (this.captureSquareList.indexOf(this.pickedSquare) === -1) {
                this.highlightSquare(this.pickedSquare, '');//remove the highlight
            }

            if (this.pickedPiece) {
                var pk_sq = this.pickedSquare.dataset.square;
                var from = this.toSquareNotation(pk_sq);
                var to = this.toSquareNotation(this.boardSq);

                // NOTE it is valid for 'from square' to be equal to 'to square'
                //especially in the game of draughts in a roundabout trip capture
                //move where the jumping piece eventaully return to its original 
                //square. So it is upto the subsclass to check for where 'from square'
                //ie equal to 'to square' where necessary  an code accordingly

                var moveResult = this.makeMove(from, to);

                //validate the move result returned by the subclass.
                //the result must contain neccessary fields
                if (!('done' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "done"');
                } else if (!('hasMore' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "hasMore"');
                } else if (!('error' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "error"');
                } else if (!('capture' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "capture"');
                }

                if (moveResult.mark_capture) {
                    var cap_sq = this.toNumericSq(moveResult.mark_capture);
                    if (this.squareList[cap_sq]) {
                        this.highlightSquare(this.squareList[cap_sq], this.CAPTURED_SQUARE_STYLE);
                        this.captureSquareList.push(this.squareList[cap_sq]);
                    }

                }

                if (moveResult.error) {
                    //TODO display the error message
                    console.log('TODO display the error message');
                    console.log('move error:', moveResult.error);

                    //animate the piece by to the original position
                    this.movePiece(this.pickedPiece, pk_sq);
                } else {//error
                    this.movePiece(this.pickedPiece, this.boardSq, moveResult.capture);
                }

                //nullify the picked square if move is completed or a move error occur
                if (moveResult.done || moveResult.error) {
                    this.pickedSquare = null;
                    this.pickedPiece = null;
                    var capSqLst = this.captureSquareList;
                    this.captureSquareList = [];
                    window.setTimeout(function (me, el_list) {
                        for (var i = 0; i < el_list.length; i++) {
                            me.highlightSquare(el_list[i], '');//remove the highlight
                        }
                    }, 1000, this, capSqLst);


                }

            }

            return;
        }

        if (!Main.device.isMobileDeviceReady) {//desktop

            if (evt.target.dataset.type !== 'piece') {//must click the piece not the container
                return;
            }
        }

        var sq = this.boardSq;
        var sqn = this.toSquareNotation(sq);

        var pce = this.getInternalPiece(sqn);
        var side1 = this.isWhite(pce);
        var side2 = this.userSide === 'w';
        if (pce
                /*&& side1 === side2*/ //UNCOMMENT LATER
                ) {
            this.pickedSquare = this.squareList[sq];
            this.highlightSquare(this.pickedSquare, this.PICKED_SQUARE_STYLE);
            this.pickPieceOnSquare(sq);
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

        if (this.pickedPiece && !this.pickedPiece.style.zIndex) {
            this.pickedPiece.style.zIndex = 1000;
        }

        if (this.pickedPiece && Ns.Config.DragPiece) {
            //drag piece
            py = this.boardY - this.pieceHeight / 2;
            px = this.boardX - this.pieceWidth / 2;
            this.pickedPiece.style.top = py + 'px';
            this.pickedPiece.style.left = px + 'px';
        }

        var sq = this.boardSq;
        if (this.squareList[sq] === this.pickedSquare) {
            if (this.hoverSquare !== this.pickedSquare) {
                if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                    this.highlightSquare(this.hoverSquare, '');//remove the highlight
                }
            }
            return;
        }

        if (this.hoverSquare !== this.pickedSquare) {
            if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
        }
        this.hoverSquare = this.squareList[sq];
        if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
            this.highlightSquare(this.hoverSquare, this.HOVER_SQUARE_STYLE);
        }

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
            if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
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


        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        if (x > box.width) {
            x = box.width;
        }
        if (y > box.height) {
            y = box.height;
        }


        if (row < 0
                || col < 0
                || row > this.boardRowCount - 1
                || col > this.boardRowCount - 1) {//OFF BOARD

            this.boardX = x;
            this.boardY = y;
            this.boardRow = -1;
            this.boardCol = -1;
            this.boardSq = -1;
            //Clear highlighted squares
            if (this.captureSquareList.indexOf(this.hoverSquare) === -1) {
                this.highlightSquare(this.hoverSquare, '');//remove the highlight
            }
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