package naija.games.chess3d;

import com.jme3.math.ColorRGBA;
import com.jme3.renderer.RenderManager;
import naija.game.client.LocalUser;
import naija.game.client.Robot;
import naija.game.client.Session;
import naija.game.client.Spectator;
import naija.game.client.chess.Chess;
import naija.game.client.chess.board.ChessBoardPosition;
import naija.game.client.event.GameSessionListener;
import naija.games.AbstractGameMain;

/**
 * test
 *
 * @author normenhansen
 */
public class ChessMain extends AbstractGameMain implements GameSessionListener{
    
    private Chess3DView chessView;

    public void onGameStart(Session session) {
    }

    public void onGameEnd(Session session) {
    }

    public void onGameResume(Session session) {
    }

    public void onSpectatorJoinSession(Spectator spectator) {
    }

    public void onSpectatorLeaveSession(Spectator spectator) {
    }

    public static void main(String[] args){
        ChessMain chessMain=new ChessMain();
    }
    
    @Override
    public void showGameView() {
                
        chessView = new Chess3DView.Builder()
                                .SimpleApplication(this)
                                .whitePieceColor(ColorRGBA.LightGray)
                                .blackPieceColor(ColorRGBA.Brown)
                                .pieceModelType(ChessModelType.PIECES_A)
                                .boardBaseModelType(ChessModelType.BOARD_BASE_A)//the board base
                                .boardModelName("board_model_1")
                                .boardTexture("naija/games/assets/chess/texture/Chess_Board.jpg")//board plane
                                .build();

        
        String strFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
       
        ChessBoardPosition boardPosition = new ChessBoardPosition(strFEN);
        
        Chess chess = new Chess.ChessBuilder( this.chessView)
                .whitePlayer(new LocalUser())
                .blackPlayer(new Robot("computer"))
                .setBoardPosition(boardPosition)
                .build();

       
        //chessBoard2D.initBoard(boardPosition);
        
    }
        
    @Override
    public void simpleUpdate(float tpf) {
            chessView.highlightSquareOnBoard();
    }

    @Override
    public void simpleRender(RenderManager rm) {
        //TODO: add render code
    }

}
