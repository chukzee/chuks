
/* global Main, Ns */


Ns.game.three.Chess3D = {

    extend: 'Ns.game.AbstractBoard3D',
    model_loader: new THREE.TDSLoader(),
    pieceModels: {},

    loadPieceModel: function (name, is_white, piece_theme, callback) {
        var path = '../resources/games/chess/3D/pieces/themes/' + piece_theme + '/3ds/' + name + '.3ds';
        if (this.pieceModels[path]) {
            var pce_model = this.chessPiece(is_white, path);
            callback(pce_model);
            return;
        }


        var me = this;
        this.model_loader.load(path, function (model) {

            var prop = me.getAbituaryProperties(name, piece_theme);

            model.userData.name = name; //e.g pawn, king e.t.c
            model.userData.bottom = prop.bottom;

            model.scale.set(prop.scale, prop.scale, prop.scale);

            //console.log(geometry);
            // geometry is a group of children.
            // If a child has one additional child it's probably a mesh
            model.children.forEach(function (child) {
                //console.log(child);
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0x222222});
                    child.material.side = THREE.DoubleSide;
                    child.material = child.material.clone();

                    //no get the lowest point of the model
                    /*var vertices = child.geometry.vertices;
                     var z = Number.MAX_VALUE;
                     for (var i = 0; i < vertices.length; i++) {
                     if (z > vertices[i].z) {
                     z = vertices[i].z;
                     }
                     }
                     model.userData.bottom = z;
                     */

                }
                //console.log(child);
            });
            model.castShadow = true;

            me.pieceModels[path] = model;
            var pce_model = me.chessPiece(is_white, path);
            callback(pce_model);

        });

    },
    chessPiece: function (is_white, path) {

        var cloned_model = this.pieceModels[path].clone();
        if (is_white) {
            cloned_model.children.forEach(function (child) {
                //console.log(child);
                if (child instanceof THREE.Mesh) {
                    child.material =  new THREE.MeshPhongMaterial({color: 0xcccccc}); // lighter color
                }
            });
            
        }
        return cloned_model;
    },
    createPiece: function (pce, piece_theme, callback) {

        var name;
        switch (pce.type) {
            case'k':
            {
                name = 'king';
                break;

            }
            case'q':
            {
                name = 'queen';
                break;
            }
            case'r':
            {
                name = 'rook';
                break;
            }
            case'n':
            {
                name = 'knight';
                break;
            }
            case'b':
            {
                name = 'bishop';
                break;
            }
            case'p':
            {
                name = 'pawn';
                break;
            }
        }




        this.loadPieceModel(name, this.isWhite(pce), piece_theme, callback);

    },
    getModelBottom: function (model) {
        return model.userData.bottom;
    },
    getAbituaryProperties: function (name, piece_theme) {
        var prop = {
            scale: 1,
            bottom: 0
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
                            prop.bottom = 0;
                            break;
                        case 'knight':
                            prop.bottom = 1.8;
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

    getBoardClass: function () {
        return 'game9ja-chess-board';
    },
    enpassantCapturSquare: function (from, to) {
        var to_col = to.charAt(0);
        var from_rank = from.charAt(1);
        var en_pass_cap_sq = to_col + from_rank;
        return en_pass_cap_sq;
    }
};