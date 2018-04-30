
/* global Main, Ns */


Ns.game.three.Chess3D = {

    extend: 'Ns.game.AbstractBoard3D',
    model_loader: new THREE.TDSLoader(),
    pieceModels: {},

    loadPieceModel: function (name, piece_theme, scale, callback) {
        var path = '../resources/games/chess/3D/pieces/themes/' + piece_theme + '/3ds/' + name + '.3ds';
        if (this.pieceModels[path]) {
            var cloned = this.pieceModels[path].clone();
            callback(cloned);
            return;
        }


        var me = this;
        this.model_loader.load(path, function (model) {

            model.userData.name = name; //e.g pawn, king e.t.c
            model.scale.set(scale, scale, scale);

            //console.log(geometry);
            // geometry is a group of children.
            // If a child has one additional child it's probably a mesh
            model.children.forEach(function (child) {
                //console.log(child);
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0xAAAAAA});
                    child.material.side = THREE.DoubleSide;
                    child.material = child.material.clone();
                    
                    //no get the lowest point of the model
                    var vertices = child.geometry.vertices;
                    var z = Number.MAX_VALUE;
                    for(var i=0; i<vertices.length; i++){
                        if(z > vertices[i].z){
                            z = vertices[i].z;
                        }
                    }
                    model.userData.bottom = z;
                    
                }
                //console.log(child);
            });
            model.castShadow = true;

            me.pieceModels[path] = model;
            var cloned_model = model.clone();
            callback(cloned_model);

        });

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


        
        var scale = this.getScaleFactor(piece_theme);
        this.loadPieceModel(name,piece_theme, scale, callback);

    },
    getModelBottom: function(model){
      return model.userData.bottom;  
    },
    getScaleFactor: function (piece_theme) {
        switch (piece_theme) {
            case 'normal':
                return 1.2;
            default:
                return 1;
        }
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