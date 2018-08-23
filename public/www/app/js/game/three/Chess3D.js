
/* global Main, Ns */


Ns.game.three.Chess3D = {

    extend: 'Ns.game.AbstractBoard3D',
    model_loader: new THREE.TDSLoader(),
    pieceModels: {},

    loadPieceModel: function (name, is_white, piece_theme, callback) {
        var path = '../resources/games/chess/3D/pieces/themes/' + piece_theme + '/3ds/' + name + '.3ds';

        if (!this.pieceModels[path]) {
            this.pieceModels[path] = {};
        }

        if (this.pieceModels[path].model) {
            var pce_model = this.chessPiece(is_white, path);
            callback(pce_model);
            return;
        }

        if (!this.pieceModels[path].listeners) {
            this.pieceModels[path].listeners = [];
        }
        var obj = {
            is_white: is_white,
            fn: callback
        };

        this.pieceModels[path].listeners.push(obj);

        if (this.pieceModels[path].listeners.length > 1) {
            return;
        }

        var me = this;
        this.model_loader.load(path, function (model) {

            var prop = me.getAbituaryProperties(name, piece_theme);

            model.userData.bottom = prop.bottom;
            model.userData.rotation = prop.rotation;

            model.scale.set(prop.scale, prop.scale, prop.scale);

            //console.log(geometry);
            // geometry is a group of children.
            // If a child has one additional child it's probably a mesh
            model.children.forEach(function (child) {
                //console.log(child);
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0x444444});
                    child.material.side = THREE.DoubleSide;
                    child.material = child.material.clone();
                }
                //console.log(child);
            });
            //model.castShadow = true;

            me.pieceModels[path].model = model;

            //callback(pce_model);
            var listeners = me.pieceModels[path].listeners;
            for (var i = 0; i < listeners.length; i++) {
                var lstnr = listeners[i];
                var is_white_pce = lstnr.is_white;
                var fn = lstnr.fn;
                var pce_model = me.chessPiece(is_white_pce, path);
                fn(pce_model);
            }

            //clear the listeners
            delete me.pieceModels[path].listeners;
        });

    },
    chessPiece: function (is_white, path) {

        var cloned_model = this.pieceModels[path].model.clone();
        cloned_model.userData.is_white = is_white;
        if (is_white) {
            cloned_model.children.forEach(function (child) {
                //console.log(child);
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0x996515}); // lighter color
                }
            });
        }

        if (cloned_model.userData.rotation) {
            cloned_model.rotation.z = is_white ?
                    -cloned_model.userData.rotation
                    : cloned_model.userData.rotation;
        }

        return cloned_model;
    },

    getPieceName: function (pce) {

        switch (pce.type) {
            case'k':
            {
                return 'king';
            }
            case'q':
            {
                return 'queen';
            }
            case'r':
            {
                return 'rook';
            }
            case'n':
            {
                return 'knight';
            }
            case'b':
            {
                return 'bishop';
            }
            case'p':
            {
                return 'pawn';
            }
        }
    },
    createPiece: function (pce, piece_theme, callback) {

        var name = this.getPieceName(pce);

        this.loadPieceModel(name, this.isWhite(pce), piece_theme, callback);

    },
    getModelBottom: function (model) {
        return model.userData.bottom;
    },
    getAbituaryProperties: function (name, piece_theme) {
        var prop = {
            scale: 1,
            bottom: 0,
            rotation: 0 // usually for knight
        };
        switch (piece_theme) {
            case 'normal':
                {
                    prop.scale = 1.2;
                    switch (name) {
                        case 'king':
                            prop.bottom = 0;
                            break;
                        case 'queen':
                            prop.bottom = 0.1;
                            break;
                        case 'knight':
                            prop.bottom = 1.8;
                            prop.rotation = Math.PI / 2; // usually knight
                            break;
                        case 'bishop':
                            prop.bottom = 2.3;
                            break;
                        case 'rook':
                            prop.bottom = 0;
                            break;
                        case 'pawn':
                            prop.bottom = 1.15;
                            break;
                    }
                }
                break;
                //next 

            default:
                return prop;
        }

        return prop;
    },
    pieceSquarRatio: function () {
        return 0.8;
    },

    isWhite: function (pce) {
        return pce.color === 'w';
    },

    isWhitePieceModel: function (model) {
        return model.userData.is_white;
    },

    makeMove: function (from, to) {

        var resObj = {
            done: false,
            hasMore: false,
            capture: null,
            error: null
        };

        if (from === to) {
            resObj.done = true; //just drop the piece
            return resObj;
        }

        var obj = {
            from: from,
            to: to//,
                    //promotion : TODO - see chessjs doc LATER for how to use this field 
        };

        var result = this.internalGame.move(obj);
        var cap;
        if (result && result.captured) {
            if (result.flags === 'e') {//en passant capture
                cap = this.enpassantCapturSquare(from, to);
            } else {
                cap = result.to;
            }
        }

        console.log(result);

        resObj.done = result ? true : false;
        resObj.capture = cap;
        resObj.error = !result ? 'Invalid move' : null;

        return resObj;
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.get(sqn);
    },

    /**
     * Determines and returns an array of captured white pieces using the 
     * provided white pieces on the board
     *
     * @param {color} wht_pieces - provided white pieces on the board
     * @returns {undefined}    
     */
    determineWhiteCaptives: function (wht_pieces) {
        return this._determineCaptives(wht_pieces, 'w');
    },

    /**
     * Determines and returns an array of captured black pieces using the 
     * provided black pieces on the board
     *
     * @param {color} blk_pieces - provided black pieces on the board
     * @returns {undefined}    
     */
    determineBlackCaptives: function (blk_pieces) {
        return this._determineCaptives(blk_pieces, 'b');
    },
    _determineCaptives: function (pieces, color) {
        var pce_arr = [];

        var queen_count = 0,
                king_count = 0, //not necessary anyway before king is never captured
                rook_count = 0,
                bishop_count = 0,
                knight_count = 0,
                pawn_count = 0,
                promotion_count = 0;

        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].color !== color) {
                continue;
            }

            if (pieces[i].type === 'k') {//not necessary anyway before king is never captured
                king_count++;
            }
            if (pieces[i].type === 'q') {
                queen_count++;
            }
            if (pieces[i].type === 'r') {
                rook_count++;
            }
            if (pieces[i].type === 'b') {
                bishop_count++;
            }
            if (pieces[i].type === 'n') {
                knight_count++;
            }
            if (pieces[i].type === 'p') {
                pawn_count++;
            }
        }

        if (queen_count < 1) {
            this.pushPieces(pce_arr, {color: color, type: 'q'}, 1 - queen_count);
        } else if (queen_count > 1) {//promotion detected
            promotion_count += queen_count - 1;
        }

        if (rook_count < 2) {
            this.pushPieces(pce_arr, {color: color, type: 'r'}, 2 - rook_count);
        } else if (rook_count > 2) {//promotion detected
            promotion_count += rook_count - 2;
        }

        if (bishop_count < 2) {
            this.pushPieces(pce_arr, {color: color, type: 'b'}, 2 - bishop_count);
        } else if (bishop_count > 2) {//promotion detected
            promotion_count += bishop_count - 2;
        }

        if (knight_count < 2) {
            this.pushPieces(pce_arr, {color: color, type: 'n'}, 2 - knight_count);
        } else if (knight_count > 2) {//promotion detected
            promotion_count += knight_count - 2;
        }

        if (pawn_count < 8 - promotion_count) {
            this.pushPieces(pce_arr, {color: color, type: 'p'}, 8 - promotion_count - pawn_count);
        }

        return pce_arr;
    },

    pushPieces: function (pce_arr, pce, count) {
        for (var i = 0; i < count; i++) {
            pce_arr.push(pce);
        }
    },

    getBoardClass: function () {
        return 'game9ja-chess-board';
    },
    enpassantCapturSquare: function (from, to) {
        var to_col = to.charAt(0);
        var from_rank = from.charAt(1);
        var en_pass_cap_sq = to_col + from_rank;
        return en_pass_cap_sq;
    },

    animate: function () {
        var me = Ns.game.three.Chess3D;
        requestAnimationFrame(me.animate);

        me.render();

    },

    render: function () {

        var delta = this.clock.getDelta();

        if (this.animationMixer) {

            this.animationMixer.update(delta);

        }

        this.renderer.render(this.scene, this.camera);

        this.stats.update();

    }
};