
/* global Main, Ns */

Ns.game.two.Chess2D = {

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
     *        container: 'the_container', //compulsory 
     *        gamePosition: 'the_game_posiont', //optional<br>
     *        pieceTheme: 'the_piece_theme', //optional<br>
     *        boardTheme: 'the_board_theme'  //optional<br>
     * }<br>
     *
     * 
     * @param {type} obj
     * @returns {undefined}
     */
    load: function (obj) {
        var el = document.getElementById(obj.container);
        el.innerHTML = '';//clear any previous
        var chessboad = Ns.game.two.Chess2D.board();
        el.appendChild(chessboad);
        
        
    },

    board: function () {
        var rows = 8;
        var table = document.createElement('table');
        table.className = 'game9ja-chess-board';
        
        table.addEventListener('mouseenter', this.onMouseEnter);
        table.addEventListener('mousemove', this.onMouseMove);
        table.addEventListener('mouseout', this.onMouseOut);
        
        for (var i = 0; i < rows; i++) {
            var tr = document.createElement('tr');
            for (var k = 0; k < rows; k++) {
                var td = document.createElement('td');
                td.dataset.square = '';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        
        return table;
    },
    
    getPieceOnSquare:function(sq){
        
    },
    
    setPieceOnSquare:function(pieces, sq){
        
    },
    
    movePiece:function(from_sq, to_sq){
        
    },
    
    onMouseEnter: function(evt){
        
    },    
    
    onMouseMove: function(evt){
        
    },
    
    onMouseOut: function(evt){
        
    },
    
    
};