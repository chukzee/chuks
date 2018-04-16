
/* global Main, Ns */


Ns.game.two.Chess2D = {
    
    extend: 'Ns.game.AbstractBoard2D',

    arrangeBoard: function (container, piece_theme) {
        var box = container.getBoundingClientRect();

        var sq_w = box.width / this.boardRowCount;
        var sq_h = box.height / this.boardRowCount;

        var pw = sq_w * 0.8; // piece width
        var ph = sq_h * 0.8; //piece height

        //range pieces
        for (var i = 0; i < 64; i++) {
            var nsq = this.toSquareNotation(i);
            var pce = this.internalGame.get(nsq);
            if (!pce) {
                continue;
            }
            var sq = i;
            if (this.isBoardFlip) {
                sq = this.flipSquare(i);
            }

            //create piece element
            var pe = document.createElement('img');

            pe.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
            pe.style.width = pw + 'px';
            pe.style.height = ph + 'px';
            var center = this.squareCenter(sq);
            var py = center.y - ph / 2;
            var px = center.x - pw / 2;
            pe.style.position = 'absolute';
            pe.style.top = py + 'px';
            pe.style.left = px + 'px';

            container.appendChild(pe);

            console.log(pce);
        }

    },
    
    getInternalPiece: function(sqn){
        return this.internalGame.get(sqn);
    },

    getBoardClass: function () {
        return 'game9ja-chess-board';
    }
};