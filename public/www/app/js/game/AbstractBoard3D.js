
/* global Main, Ns */


Ns.game.AbstractBoard3D = {

    internalGame: null, // the game engine. e.g chessj.s and my draftgame.js
    userSide: null, //whether 'b' or 'w'. ie black or white. default is null for watched game
    isBoardFlip: false, //whether black to white direction. default is white to black (false)
    BOARD_PLANE_SIZE: 20,
    ANIM_MAX_DURATION: 500,
    HOVER_SQUARE_STYLE: 'background: red', //TODO - use beautiful bacground, possibly beautiful imgage
    PICKED_SQUARE_STYLE: 'background: yellow', //TODO - use beautiful bacground, possibly beautiful imgage
    CAPTURED_SQUARE_STYLE: 'background: blue', //TODO - use beautiful bacground, possibly beautiful imgage
    squareList: {},
    squarePieces: [],
    hoverSquare: null,
    pickedSquare: null,
    captureSquareList: [],
    pickedPiece: null,
    boardRowCount: 8, //default is 8
    boardContainer: null,
    pieceWidth: null,
    pieceHeight: null,
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
     * @param {type} internal_game
     * @param {type} obj
     * @param {type} callback
     * @returns {undefined}
     */
    load: function (internal_game, obj, callback) {
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
        this.boardContainer = el;
        el.innerHTML = '';//clear any previous
        //var board_cls = this.getBoardClass(obj.inverseBoard);
        this.board(el, obj.pieceTheme, obj.boardTheme);

        callback(this); // note for 3D which may be asynchronous this may not be call here but after the async proccess

    },
    
    getModelBottom: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },
    
    createPiece: function () {
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

    arrangePiecesOnBoard: function (renderer, scene, camera, piece_theme) {

        var ratio = this.pieceSquarRatio();
        if (!ratio) {
            ratio = 0.8;
        }

        var me = this;
        var count = 0;
        var positionPiece = function (model) {

            var center = me.squareCenter(this.sq);

            console.log('center', center,'model',model, 'sq', this.sq);

            model.position.x = center.x;
            model.position.y = center.y;
            model.position.z = Math.abs(me.getModelBottom(model));

            scene.add(model);

            count++;
            if (count === this.total) {
                renderer.render(scene, camera);
                console.log('all pieces loaded - ' + count);
            }

        };

        var pObjArr = [];
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

            pObjArr.push({
                pce: pce,
                sq: sq
            });
        }

        for (var i = 0; i < pObjArr.length; i++) {
            var pObj = pObjArr[i];
            //create piece
            var bindObj = {
                sq: pObj.sq,
                total: pObjArr.length
            };
            this.createPiece(pObj.pce, piece_theme, positionPiece.bind(bindObj));
        }

        if (pObjArr.length === 0) {//if no piece on board
            renderer.render(scene, camera);
        }

    },

    board: function (container, piece_theme, board_theme) {

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


        //create board plane
        //-------
        var box = container.getBoundingClientRect();

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45
                , box.width / box.height
                , 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();

        renderer.setSize(box.width, box.height);
        //var axes = new THREE.AxesHelper(20);
        //scene.add(axes);

        var light = new THREE.AmbientLight(0x555555); // soft white light
        scene.add(light);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(50, 100, 50);

        spotLight.castShadow = true;

        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;

        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;

        scene.add(spotLight);

        camera.position.x = 0;
        camera.position.y = -20;//the higher the closer to the eye - so -8 is closer than -10
        camera.position.z = 20;
        camera.lookAt(scene.position);

        container.innerHTML = null; ////clear 
        //$(container).append(renderer.domElement);

        container.appendChild(renderer.domElement);

        var loader = new THREE.TextureLoader();
        var me = this;
        loader.load('../resources/games/chess/board/themes/' + board_theme + '/60.png', function (texture) {
            texture.repeat.set(4, 4);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            var boardGeometry = new THREE.PlaneGeometry(me.BOARD_PLANE_SIZE, me.BOARD_PLANE_SIZE);

            var boardMaterial = new THREE.MeshBasicMaterial({
                map: texture,
            });

            var board_plane = new THREE.Mesh(boardGeometry, boardMaterial);
            
            board_plane.receiveShadow = true;
            
            board_plane.position.x = 0;
            board_plane.position.y = 0;
            board_plane.position.z = 0;
            scene.add(board_plane);

            me.arrangePiecesOnBoard(renderer, scene, camera, piece_theme);

        });

        //-------------------


        /*var rw = table.children;
         var sq = -1;
         for (var i = rw.length - 1; i > -1; i--) {
         var sqs = rw[i].children;
         for (var k = 0; k < sqs.length; k++) {
         sq++;
         this.squareList[sq] = sqs[k];
         this.squareList[sq].dataset.square = sq;//for identifying the squares
         }
         }*/





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
        var py, px;
        /*
         py = center.y - this.pieceHeight / 2;
         px = center.x - this.pieceWidth / 2;
         */
        var prop = {
            top: py,
            left: px
        };
        var me = this;

        var dist = Math.sqrt(px * px + py * py);
        var board_width = this.boardContainer.getBoundingClientRect().width;
        Main.anim.to(target, this.ANIM_MAX_DURATION * dist / board_width, prop, function () {
            //making sure the piece is on the right spot just in
            //case the orientation changes or the board is resized
            center = me.squareCenter(to);

            /*py = center.y - this.pieceHeight / 2;
             px = center.x - this.pieceWidth / 2;
             target.style.top = py + 'px';
             target.style.left = px + 'px';
             target.style.zIndex = null;*/
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

        var center_x, center_y;

        var sq_size = this.BOARD_PLANE_SIZE / this.boardRowCount;

        var row = Math.floor(sq / this.boardRowCount);
        var col = this.boardRowCount - sq % this.boardRowCount - 1;

        center_x = (this.boardRowCount - col) * sq_size - sq_size / 2;
        center_y = (this.boardRowCount - row) * sq_size - sq_size / 2;
        if (sq === 56) {
            console.log('center_y', center_y, 'row', row, );
        }
        return {
            x: center_x - this.BOARD_PLANE_SIZE / 2,
            y: center_y - this.BOARD_PLANE_SIZE / 2
        };
    },

    highlightSquare: function (sqEl, style) {

    },

    getPieceOnSquare: function (sq) {

    },

    pickPieceOnSquare: function (sq) {

    },

    capturePiece: function (capture) {


    },

    onClickBoard: function (evt, container, is_tap) {



    },
    onTouchStartBoard: function (evt, container) {

    },
    onHoverBoard: function (evt, container) {

    },

    onHoverBoardEnd: function (evt) {
    },
};