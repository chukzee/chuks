
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
    gamePieceModels: [],
    scene: null,
    renderer: null,
    camera: null,
    floorPlane: null, //modifiable in user settings
    basePlane: null, //modifiable in user settings
    boardPlane: null, //modifiable in user settings
    spotLight: null, //adjustable in user settings
    ambientLight: null,
    raycaster: new THREE.Raycaster(),
    animationMixer: null,
    clock: null,
    stats: null,
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
     *        variant:'the variant', //compulsory for draughts only <br>
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
        this.pieceTheme = obj.pieceTheme;
        this.boardTheme = obj.boardTheme;
        this.blackThrowOutFwd = true;
        this.whiteThrowOutFwd = true;
        this.blackThrowOutX = -1;
        this.whiteThrowOutX = -1;
        this.blackThrowOutY = -1;
        this.whiteThrowOutY = -1;
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
        this.boardContainer = el;
        el.innerHTML = '';//clear any previous
        //var board_cls = this.getBoardClass(obj.invertedBoard);
        this.board(el);

        callback(this); // note for 3D which may be asynchronous this may not be call here but after the async proccess

    },
    getPieceName: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },
    isWhitePieceModel: function () {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    /**
     * Determines and returns an array of captured white pieces using the 
     * provided white pieces on the board
     *
     * @param {type} wht_pieces - provided white pieces on the board
     * @returns {undefined}    
     */
    determineWhiteCaptives: function (wht_pieces) {
        throw Error('Abstract method expected to be implemented by subclass.');
    },

    /**
     * Determines and returns an array of captured black pieces using the 
     * provided black pieces on the board
     *
     * @param {type} blk_pieces - provided black pieces on the board
     * @returns {undefined}    
     */
    determineBlackCaptives: function (blk_pieces) {
        throw Error('Abstract method expected to be implemented by subclass.');
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
    nextThrowOutXY: function (model) {
        var sq_size = this.BOARD_PLANE_SIZE / this.boardRowCount;
        if (this.isWhitePieceModel(model)) {

            if (this.whiteThrowOutX === -1) {
                this.whiteThrowOutX = -this.BOARD_PLANE_SIZE / 2 - sq_size;
            }

            if (this.whiteThrowOutY === -1) {
                this.whiteThrowOutY = 0;
            } else {
                if (this.whiteThrowOutFwd) {
                    this.whiteThrowOutY = Math.abs(this.whiteThrowOutY);
                    this.whiteThrowOutY += sq_size;
                } else {
                    this.whiteThrowOutY = -this.whiteThrowOutY;
                }

                this.whiteThrowOutFwd = !this.whiteThrowOutFwd;
            }

            if (this.whiteThrowOutY >= this.BOARD_PLANE_SIZE / 2
                    || this.whiteThrowOutY <= -this.BOARD_PLANE_SIZE / 2) {
                this.whiteThrowOutFwd = true;
                this.whiteThrowOutY = 0;
                this.whiteThrowOutX -= sq_size;
            }

            return {x: this.whiteThrowOutX, y: this.whiteThrowOutY};

        } else {

            if (this.blackThrowOutX === -1) {
                this.blackThrowOutX = this.BOARD_PLANE_SIZE / 2 + sq_size;
            }

            if (this.blackThrowOutY === -1) {
                this.blackThrowOutY = 0;
            } else {
                if (this.blackThrowOutFwd) {
                    this.blackThrowOutY = Math.abs(this.blackThrowOutY);
                    this.blackThrowOutY += sq_size;
                } else {
                    this.blackThrowOutY = -this.blackThrowOutY;
                }

                this.blackThrowOutFwd = !this.blackThrowOutFwd;
            }

            if (this.blackThrowOutY >= this.BOARD_PLANE_SIZE / 2
                    || this.blackThrowOutY <= -this.BOARD_PLANE_SIZE / 2) {
                this.blackThrowOutFwd = true;
                this.blackThrowOutY = 0;
                this.blackThrowOutX += sq_size;
            }

            return {x: this.blackThrowOutX, y: this.blackThrowOutY};
        }
    },
    takeOffBoard: function (model, animate) {
        var out = this.nextThrowOutXY(model);
        var to_x = out.x;
        var to_y = out.y;

        var to_z = this.floorPlane.position.z + this.getModelBottom(model);  //sit on the floor
        if (animate) {
            //TODO
        } else {
            model.position.set(to_x, to_y, to_z);
        }

    },

    arrangePiecesOnBoard: function () {

        var me = this;
        var count = 0;
        var OFF_BOARD = -1;
        var positionPiece = function (model) {
            var pce_name = me.getPieceName(this.pce);
            if (!pce_name) {
                throw Error('invalid piece name -' + pce_name);
            }
            model.userData.name = pce_name;
            if (this.sq !== OFF_BOARD) {
                var center = me.squareCenter(this.sq);
                model.position.x = center.x;
                model.position.y = center.y;
                model.position.z = me.getModelBottom(model);
            } else {
                me.takeOffBoard(model, false);
            }

            me.scene.add(model); //uncomment later
            me.gamePieceModels.push(model);
            count++;
            if (count === this.total) {
                me.renderer.render(me.scene, me.camera);

                console.log('all pieces loaded - ' + count);
                //me.animate(); //TESING!!! ABEG O!!!!!!!!
            }

        };

        var pObjArr = [];
        var w_arr = [];
        var b_arr = [];

        var SQ_COUNT = this.boardRowCount * this.boardRowCount;
        for (var i = 0; i < SQ_COUNT; i++) {
            var sqn = this.toSquareNotation(i);
            var pce = this.getInternalPiece(sqn);

            if (!pce) {
                continue;
            }

            if (this.isWhite(pce)) {
                w_arr.push(pce);
            } else {
                b_arr.push(pce);
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

        var w_caps = this.determineWhiteCaptives(w_arr);
        var b_caps = this.determineBlackCaptives(b_arr);

        for (var i = 0; i < w_caps.length; i++) {
            var pce = w_caps[i];
            pObjArr.push({
                pce: pce,
                sq: OFF_BOARD
            });
        }

        for (var i = 0; i < b_caps.length; i++) {
            var pce = b_caps[i];
            pObjArr.push({
                pce: pce,
                sq: OFF_BOARD
            });
        }
        for (var i = 0; i < pObjArr.length; i++) {
            var pObj = pObjArr[i];
            //create piece
            var bindObj = {
                pce: pObj.pce,
                sq: pObj.sq,
                total: pObjArr.length
            };
            this.createPiece(pObj.pce, this.pieceTheme, positionPiece.bind(bindObj));
        }

    },

    getMatchIndexOnModels: function (pce, model_list) {
        for (var i = 0; i < model_list.length; i++) {
            var model = model_list[i];
            if (this.isWhite(pce) === this.isWhitePieceModel(model)
                    && this.getPieceName(pce) === model.userData.name) {
                return i;
            }
        }
        return -1;
    },

    boardReOrder: function () {
        console.log('this.scene.children.length', this.scene.children.length);
        /*        
         for (var i = 0; i < this.gamePieceModels.length; i++) {//TESTING!!!
         var model = this.gamePieceModels[i];
         this.scene.remove(model);
         console.log('this.scene.remove(model); ', model.userData.name);
         }
         console.log('this.scene.children.length', this.scene.children.length);
         */
        var OFF_BOARD = -1;
        var count = 0;
        var me = this;
        var rePositionPiece = function (model, exist) {

            if (this.sq !== OFF_BOARD) {
                var center = me.squareCenter(this.sq);
                model.position.x = center.x;
                model.position.y = center.y;
                model.position.z = me.getModelBottom(model);
            } else {
                me.takeOffBoard(model, false);
            }

            if (!exist) {
                me.scene.add(model);
            }
            me.gamePieceModels.push(model);//populate afresh since we emptied it early - see below

            count++;
            if (count === this.total) {
                me.renderer.render(me.scene, me.camera);

                console.log('all pieces rearranged - ' + count);
                console.log('me.scene.children.length', me.scene.children.length);
            }

        };
        var pObjArr = [];
        var w_arr = [];
        var b_arr = [];

        var SQ_COUNT = this.boardRowCount * this.boardRowCount;
        for (var i = 0; i < SQ_COUNT; i++) {
            var sqn = this.toSquareNotation(i);
            var pce = this.getInternalPiece(sqn);

            if (!pce) {
                continue;
            }

            if (this.isWhite(pce)) {
                w_arr.push(pce);
            } else {
                b_arr.push(pce);
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

        var w_caps = this.determineWhiteCaptives(w_arr);
        var b_caps = this.determineBlackCaptives(b_arr);

        for (var i = 0; i < w_caps.length; i++) {
            var pce = w_caps[i];
            pObjArr.push({
                pce: pce,
                sq: OFF_BOARD
            });
        }

        for (var i = 0; i < b_caps.length; i++) {
            var pce = b_caps[i];
            pObjArr.push({
                pce: pce,
                sq: OFF_BOARD
            });
        }

        var matchedModels = [];
        var unmatched = [];

        for (var i = 0; i < pObjArr.length; i++) {
            var pObj = pObjArr[i];
            var match_index = this.getMatchIndexOnModels(pObj.pce, this.gamePieceModels);
            if (match_index > -1) {
                var fmObj = {
                    pObj: pObj,
                    model: this.gamePieceModels[match_index]
                };
                matchedModels.push(fmObj); //store
                this.gamePieceModels.splice(match_index, 1);//remove
            } else {
                unmatched.push(pObj);
            }

        }

        //removed the unmatched models from the scene
        for (var i = 0; i < this.gamePieceModels.length; i++) {
            var model = this.gamePieceModels[i];
            this.scene.remove(model);
        }

        this.gamePieceModels = []; //empty it now!

        for (var i = 0; i < matchedModels.length; i++) {
            var pObj = matchedModels[i].pObj;
            var model = matchedModels[i].model;
            //create piece
            var bindObj = {
                sq: pObj.sq,
                total: pObjArr.length
            };

            rePositionPiece.call(bindObj, model, true);

        }

        for (var i = 0; i < unmatched.length; i++) {
            var pObj = unmatched[i];

            var bindObj = {
                sq: pObj.sq,
                total: pObjArr.length
            };
            //create piece
            this.createPiece(pObj.pce, this.pieceTheme, rePositionPiece.bind(bindObj));
        }

    },

    board: function (container) {

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


        container.innerHTML = null; ////clear 
        if (!this.renderer) {
            //READ!!! If in andriod nothing shows then remove the antialias - someone claims it does not work in android but not yet comfirmed though
            //since others observed it worked after setting the devicePixelRatio as we have done below already.
            this.renderer = new THREE.WebGLRenderer({antialias: true}); // remove antialias if too slow
            this.renderer.autoClear = false;
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }

        window.onresize = function (evt) {
            var rect = container.getBoundingClientRect();
            me.renderer.setSize(rect.width, rect.height);
            me.camera.aspect = rect.width / rect.height;
            me.camera.fov = me.cameraFOV(rect.width, rect.height);
            me.camera.updateProjectionMatrix();
            me.renderer.render(me.scene, me.camera);
        };

        container.appendChild(this.renderer.domElement);

        this.stats = new Stats();//TESTING!!!
        document.body.appendChild(this.stats.dom);//TESTING!!!
        
        //

        this.clock = new THREE.Clock();
        var bound = container.getBoundingClientRect();

        this.renderer.setSize(bound.width, bound.height);
        //this.renderer.shadowMap.enabled = true;

        if (this.scene) {
            this.boardReOrder();
            return;
        }

        //create board plane
        //-------

        this.scene = new THREE.Scene();

        //var axes = new THREE.AxesHelper(20);
        //this.scene.add(axes);

        this.ambientLight = new THREE.AmbientLight(0xAAAAAA); // soft white light
        this.scene.add(this.ambientLight);

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(0, 0, 50);

        //this.spotLight.castShadow = true;

        //this.spotLight.shadow.mapSize.width = 10;
        //this.spotLight.shadow.mapSize.height = 10;
        //this.spotLight.shadow.camera.near = 50;
        //this.spotLight.shadow.camera.far = 400;
        //this.spotLight.shadow.camera.fov = 30;

        this.scene.add(this.spotLight);

        this.camera = this.createCamera('perspective', bound);
        this.camera.lookAt(this.scene.position);


        var loader = new THREE.TextureLoader();
        var me = this;
        var base_height = this.BOARD_PLANE_SIZE / (this.boardRowCount * 2);

        //base_height = 0.001;//To flatten the board base uncomment this line

        loader.load('../resources/images/wood_base_2.jpg', function (floor_texture) {
            floor_texture.repeat.set(14, 14);
            floor_texture.wrapS = THREE.RepeatWrapping;
            floor_texture.wrapT = THREE.RepeatWrapping;
            var fac = 5.5;
            var floorGeometry = new THREE.PlaneGeometry(me.BOARD_PLANE_SIZE * fac, me.BOARD_PLANE_SIZE * fac);

            var floorMaterial = new THREE.MeshPhongMaterial({
                map: floor_texture,
            });

            me.floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);

            me.floorPlane.material.side = THREE.DoubleSide;

            me.floorPlane.position.x = 0;
            me.floorPlane.position.y = 0;
            me.floorPlane.position.z = -0.1 - base_height;
            me.scene.add(me.floorPlane);


            loader.load('../resources/images/wood_base_2.jpg', function (base_texture) {
                base_texture.repeat.set(10, 10);
                base_texture.wrapS = THREE.RepeatWrapping;
                base_texture.wrapT = THREE.RepeatWrapping;
                var fac = 1.1;
                var baseGeometry = new THREE.CubeGeometry(me.BOARD_PLANE_SIZE * fac, me.BOARD_PLANE_SIZE * fac, base_height);

                var baseMaterial = new THREE.MeshPhongMaterial({
                    color: 0x996515, //0x996515 , 0x777777
                    map: base_texture,
                });

                me.basePlane = new THREE.Mesh(baseGeometry, baseMaterial);

                me.basePlane.material.side = THREE.DoubleSide;

                me.basePlane.position.x = 0;
                me.basePlane.position.y = 0;
                me.basePlane.position.z = -0.05 - base_height / 2;
                me.scene.add(me.basePlane);

                loader.load('../resources/games/chess/board/themes/' + me.boardTheme + '/60.png', function (texture) {
                    texture.repeat.set(4, 4);
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;

                    var boardGeometry = new THREE.PlaneGeometry(me.BOARD_PLANE_SIZE, me.BOARD_PLANE_SIZE);

                    var boardMaterial = new THREE.MeshLambertMaterial({
                        map: texture,
                    });

                    me.boardPlane = new THREE.Mesh(boardGeometry, boardMaterial);

                    me.boardPlane.material.side = THREE.DoubleSide;

                    //me.boardPlane.receiveShadow = true;

                    me.boardPlane.position.x = 0;
                    me.boardPlane.position.y = 0;
                    me.boardPlane.position.z = 0;
                    me.scene.add(me.boardPlane);

                    me.arrangePiecesOnBoard();

                });

            });
        });

    },
    cameraFOV: function (width, height) {
        if (width >= height) {
            return 45;
        } else {// e.g portrait view
            return 75;
        }
    },
    createCamera: function (type, bound) {
        var fov = this.cameraFOV(bound.width, bound.height);
        if (type === 'perspective') {
            var camera = new THREE.PerspectiveCamera(fov
                    , bound.width / bound.height
                    , 0.1, 1000);
            camera.position.x = 0;
            camera.position.y = -22;//the higher the closer to the eye - so -8 is closer than -10
            camera.position.z = 25;


            //camera.position.y = -25;
            //camera.position.z = 40;

            //camera.position.x = 10;//testing!!!
            //camera.position.y = -22;//testing!!!
            //camera.position.z = 0;//testing!!!
        } else {
            var camera = new THREE.OrthographicCamera(bound.width / -36, bound.width / 36
                    , bound.height / -36, bound.height / 36
                    , -200, 200);
            camera.position.x = 1;
            camera.position.y = 15;
            camera.position.z = 3;

        }
        return camera;
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
        center_y = (row + 1) * sq_size - sq_size / 2;

        //console.log('center_y', center_y, 'row', row, );

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
        if (is_tap) {
            this.boardX = this.startTouchBoardX;
            this.boardY = this.startTouchBoardY;
            this.boardRow = this.startTouchBoardRow;
            this.boardCol = this.startTouchBoardCol;
            this.boardSq = this.startTouchBoardSq;
        } else {
            this.boardXY(container, evt, is_tap);
        }



    },
    onTouchStartBoard: function (evt, container) {

    },
    onHoverBoard: function (evt, container) {

    },

    onHoverBoardEnd: function (evt) {
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

        var scene_rect = container.getBoundingClientRect();

        var x_in_canvas = posx - scene_rect.left;
        var y_in_canvas = posy - scene_rect.top;

        var vector2d = new THREE.Vector2();
        vector2d.x = (x_in_canvas / scene_rect.width) * 2 - 1;
        vector2d.y = -(y_in_canvas / scene_rect.height) * 2 + 1;

        this.raycaster.setFromCamera(vector2d, this.camera);
        var intersects = this.raycaster.intersectObjects([this.boardPlane]);
        var x, y;
        if (intersects.length > 0) {
            x = intersects[0].point.x;
            y = intersects[0].point.y;
        }

        //row and col

        var sq_w = this.BOARD_PLANE_SIZE / this.boardRowCount;
        var sq_h = this.BOARD_PLANE_SIZE / this.boardRowCount;

        if (Main.device.isMobileDeviceReady
                && !Main.device.isLarge()) {//for only smart phones and tablets of medium size
            //Now make the y offset allow easy pick of piece especailly on small device
            if (y < this.BOARD_PLANE_SIZE - sq_h / 2) {//above middle of first row
                y -= sq_h; // offset y by square height
            }
        }

        var row = this.boardRowCount - Math.floor((this.BOARD_PLANE_SIZE / 2 - y) / sq_h) - 1;
        var col = this.boardRowCount - Math.floor((this.BOARD_PLANE_SIZE / 2 - x) / sq_w) - 1;

        console.log('x=', x, 'y=', y, 'row=', row, 'col=', col, 'sq=', sq);

        if (x < -this.BOARD_PLANE_SIZE / 2) {
            x = -this.BOARD_PLANE_SIZE / 2;
        }
        if (y < -this.BOARD_PLANE_SIZE / 2) {
            y = -this.BOARD_PLANE_SIZE / 2;
        }

        if (x > this.BOARD_PLANE_SIZE / 2) {
            x = this.BOARD_PLANE_SIZE / 2;
        }
        if (y > this.BOARD_PLANE_SIZE / 2) {
            y = this.BOARD_PLANE_SIZE / 2;
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
        console.log('x=', x, 'y=', y, 'row=', row, 'col=', col, 'sq=', sq);

    },

    testAnim: function (model) {
        var mesh;
        model.children.forEach(function (child) {
            //console.log(child);
            if (child instanceof THREE.Mesh) {
                mesh = child;
            }
        });

        var shakeScale = 1.2;
        var duration = 30;
        var times = [], values = [], tmp = new THREE.Vector3();

        for (var i = 0; i < duration * 10; i++) {

            times.push(i / 10);
            values.push(Math.floor(Math.random() * 10.0), 0, 2);

            /*tmp.set(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0).
             multiply(shakeScale).
             toArray(values, values.length);*/

        }

        var trackName = '.position';

        var track = new THREE.VectorKeyframeTrack(trackName, [0, 3], [0, 0, 0, 0, 10, 50]);

        var clip = new THREE.AnimationClip('ChukClip', duration, [track]);
        this.animationMixer = new THREE.AnimationMixer(mesh);

        var action = this.animationMixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.startAt(0);                // delay in seconds
        action.clampWhenFinished = true;
        action.play();


        /*mesh.position.x = 0;
         mesh.position.y = 0;
         mesh.position.z = 1.6;
         
         this.renderer.render(this.scene, this.camera);*/
        //if(!this.runRender){
        //this.runRender = true;
        //this.render();
        //}
    }



};