
/* global Main, Ns */


/* global Main, Ns */


Ns.game.three.Draughts3D = {

    extend: 'Ns.game.AbstractBoard3D',
    capturePath: [],
    createPiece: function (pce, piece_theme) {
        var pe = document.createElement('div');
        pe.className = pce.white ? 'white-piece-o' : 'black-piece-o';
        pe.dataset.crowned = pce.crowned;

        if (pce.crowned) {
            //TODO display crown on the piece

        }

        return pe;
    },

    pieceSquarRatio: function () {
        return 0.6;
    },

    isWhite: function (pce) {
        return pce.white;
    },

    makeMove: function (from, to) {
        var caps = this.internalGame.capturableSAN(from);
        var resObj = {
            done: false,
            hasMore: false, //whether jumping in on
            capture: null, //capture squares
            error: null
        };
        //we know caps is two dimensional array
        if (caps.length > 0 && caps[0].length > 0) {//capture
            if (!this.capturePath) {
                this.capturePath = [];
            }
            var last = this.capturePath[this.capturePath.length - 1];
            if (last !== to) {//avoid a situation when the player click on same square more than once
                this.capturePath.push(to);
            }

            //check if the player is moving on a valid capture path
            var all_match;
            var match_len;
            var cap_move;
            var cap_sq = -1;
            for (var i = 0; i < caps.length; i++) {
                var p = caps[i];
                if (this.capturePath.length <= p.length) {
                    all_match = true;
                    match_len = p.length;
                    cap_move = from;
                    cap_sq = -1;
                    for (var k = 0; k < this.capturePath.length; k++) {
                        if (this.capturePath[k] !== p[k].to_sq) {
                            all_match = false;
                            break;
                        }
                        cap_sq =  p[k].cap_sq;
                        cap_move += 'x' + this.capturePath[k];
                    }
                    if (all_match) {
                        break;
                    }
                }
            }

            if (all_match && match_len === this.capturePath.length) {
                var result = this.internalGame.move(cap_move);
                resObj.done = !result.error;
                resObj.hasMore = false;
                resObj.mark_capture = cap_sq;  // for the purpose of highlighting captured square
                resObj.capture = result.capture;
                resObj.error = result.error;
            } else if (all_match && this.capturePath.length < match_len) {
                resObj.done = false;
                resObj.hasMore = true;
                resObj.mark_capture = cap_sq; // for the purpose of highlighting captured square
                resObj.error = null;
            } else {//some did not match so error
                resObj.done = false;
                resObj.hasMore = false;
                resObj.error = 'Invalid capture path!';
            }

        } else if (to !== from) {
                var result = this.internalGame.move(from + '-' + to);
                resObj.done = !result.error;
                resObj.hasMore = false;
                resObj.error = result.error;
        }else{//where to === from
            resObj.done = true;//just drop the piece
        }

        if (resObj.done || resObj.error) {
            this.capturePath = [];
        }


        return resObj;
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.getPiece(sqn);
    },

    getBoardClass: function (inverse_board) {
        if (inverse_board) {
            return 'game9ja-draughts-board-inverse';
        } else {
            return 'game9ja-draughts-board';
        }
    },
    getVariant: function (variant) {
        var v = {};
        switch (variant) {
            case'international-draughts':
                {
                    v.name = 'international-draughts';
                    v.size = '10x10';
                    //v.rule =... TODO
                }
                break;
            case'english-draughts':
                {
                    v.name = 'english-draughts';
                    v.size = '8x8';
                    //v.rule =... TODO
                }
                break;
            case'american-draughts':
                {
                    v.name = 'american-draughts';
                    v.size = '8x8';
                    //v.rule =... TODO
                }
                break;
        }

        return v;
    }
};