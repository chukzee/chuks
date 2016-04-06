package naija.games.chess3d;

import com.jme3.renderer.RenderManager;
import naija.game.client.AbstractGameClientFactory;
import naija.game.client.Game;
import naija.game.client.GameName;
import naija.game.client.IConnection;
import naija.game.client.LocalUser;
import naija.game.client.Player;
import naija.game.client.Robot;
import naija.game.client.GameSession;
import naija.game.client.Score;
import naija.game.client.chess.BlackChessPlayer;
import naija.game.client.chess.Chess;
import naija.game.client.chess.ChessGameClientFactory;
import naija.game.client.chess.ChessPlayer;
import naija.game.client.chess.WhiteChessPlayer;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.ChessBoardPosition;
import naija.game.client.chess.ChessMove;
import naija.game.client.event.GameSessionEvent;
import naija.games.AbstractGameMain;
import naija.games.ClientConfig;
import naija.games.Game3DView;

/**
 * test
 *
 * @author normenhansen
 */
public class ChessMain extends AbstractGameMain {

    private Chess3DView chessView;
    private Score default_score;
    private String default_time_control;
    private Player default_robot_player;
    private ChessPlayer default_local_player;

    @Override
    public AbstractGameClientFactory getGameClientFactory(IConnection conn) {
        return new ChessGameClientFactory(conn);
    }

    public static void main(String[] args) {
        ChessMain chessMain = new ChessMain();
    }

    @Override
    public void simpleUpdate(float tpf) {
        chessView.highlightSquareOnBoard();
    }

    @Override
    public void simpleRender(RenderManager rm) {
        //TODO: add render code
    }

    @Override
    public Game buildGame(GameSession gameSession, Game3DView gameView) {

        if (getGameName().equals(gameSession.getGameName())) {
            //build a chess game based on the game session information.
            String strFEN = gameSession.getGamePosition();
            ChessBoardPosition boardPosition = new ChessBoardPosition(strFEN);

            ChessPlayer player_1 = (ChessPlayer) gameSession.getPlayer(0);
            ChessPlayer player_2 = (ChessPlayer) gameSession.getPlayer(1);

            current_game = new Chess.ChessBuilder(gameSession.getSessionID(), this.chessView)
                    .whitePlayer(player_1.isWhite() ? (WhiteChessPlayer) player_1 : (WhiteChessPlayer) player_2)
                    .blackPlayer(player_1.isWhite() ? (BlackChessPlayer) player_2 : (BlackChessPlayer) player_1)
                    .boardPosition(boardPosition)
                    .score(gameSession.getScore())
                    .timeControl(gameSession.TimeControl())
                    .chessVariant(gameSession.getGameVariant())
                    .chessAI(ClientConfig.CHESS_AI_ALGORITHM, ClientConfig.CHESS_SEARCH_DEPTH)//for the case of robot vs player
                    .build();
        }

        return null;
    }

    @Override
    public Game3DView buildGameView(GameSession gameSession) {
        if (getGameName().equals(gameSession.getGameName())) {
            chessView = new Chess3DView.Builder()
                    .simpleApplication(this)
                    .gameSession(gameSession)
                    .whitePieceColor(ClientConfig.CHESS_WHITE_PIECE_COLOR)
                    .blackPieceColor(ClientConfig.CHESS_BLACK_PIECE_COLOR)
                    .pieceModelType(ClientConfig.CHESS_PIECE_MODEL_TYPE)
                    .boardBaseModelType(ClientConfig.CHESS_BOARD_BASE_MODEL_TYPE)//the board base
                    .boardModelName(ClientConfig.CHESS_BOARD_MODEL_NAME)
                    .boardTexture(ClientConfig.CHESS_BOARD_TEXTURE)//board plane
                    .build();
            return chessView;
        }
        return null;
    }

    @Override
    public GameName getGameName() {
        return GameName.chess;
    }

    @Override
    public Player geDefaultLocalPlayer() {
        if (default_local_player == null) {
            default_local_player = new ChessPlayer(new LocalUser(), true);//white player
        }
        return default_local_player;
    }

    @Override
    public Player getDefaultRobotPlayer() {
        if (default_robot_player == null) {
            default_robot_player = new ChessPlayer(new Robot("Robot"), false);//black player
        }
        return default_robot_player;
    }

    @Override
    public String getDefaultTimeControl() {
        return default_time_control;
    }

    @Override
    public Score getDefaultScore() {
        return default_score;
    }

    @Override
    public String getDefaultGamePosition() {
        return Board.DEFAUT_CHESS_BOARD_POSITION;
    }

    @Override
    public int getDefaultGameVariant() {
        return Board.NORMAL_CHESS;
    }

    /**
     * Move the chess piece here using the information contained in the
     * {@link naija.game.client.event.GameSessionEvent} object. Note that there
     * could be situation where the chess board position is not up to date due
     * to missing moves cause by some circumstances e.g poor network conection.
     * In such situation, the chess board position should rather be updated to
     * the current game position which can obtained from the. To detect missing
     * move compare the move number of move obtained from
     * {@link naija.game.client.event.GameSessionEvent} with the last locally
     * known move number. A move number dedviation beyound one step is an indication
     * of missing move {@link naija.game.client.event.GameSessionEvent} object.
     *
     * @param event
     */
    @Override
    public void updateGamePosition(GameSessionEvent event) {
        ChessPlayer player_1 = (ChessPlayer) current_game.getPlayer(0);
        ChessPlayer player_2 = (ChessPlayer) current_game.getPlayer(1);


        

    }
}
