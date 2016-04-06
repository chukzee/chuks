/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games;

import com.jme3.math.ColorRGBA;
import naija.game.client.chess.algorithm.Algorithm;
import naija.game.client.chess.board.Board;
import naija.games.chess3d.ChessModelType;

/**
 *
 * @author USER
 */
public class ClientConfig {
    public static String host = "localhost";
    public static int port = 80;

    public static String facebook_token = "";
    public static int facebook_expiry = 0;//come back
    
    public static String twitter_token = "";
    public static String twitter_secret = "";
    public static long twitter_user_id = 0;
    
    public static int CHESS_AI_ALGORITHM = Algorithm.AlphaBeta;//configurable by user in user preference
    public static int CHESS_SEARCH_DEPTH = 5;//configurable by user in user preference
    public static int CHESS_VARIANT = Board.NORMAL_CHESS;//configurable by user in user preference
    public static ColorRGBA CHESS_WHITE_PIECE_COLOR = ColorRGBA.LightGray;//configurable by user in user preference
    public static ColorRGBA CHESS_BLACK_PIECE_COLOR = ColorRGBA.Brown;//configurable by user in user preference
    public static ChessModelType CHESS_PIECE_MODEL_TYPE = ChessModelType.PIECES_A;//configurable by user in user preference
    public static ChessModelType CHESS_BOARD_BASE_MODEL_TYPE = ChessModelType.BOARD_BASE_A;//configurable by user in user preference
    public static String CHESS_BOARD_MODEL_NAME = "board_model_1";//configurable by user in user preference
    public static String CHESS_BOARD_TEXTURE = "naija/games/assets/chess/texture/Chess_Board.jpg";//configurable by user in user preference
    
    
}
