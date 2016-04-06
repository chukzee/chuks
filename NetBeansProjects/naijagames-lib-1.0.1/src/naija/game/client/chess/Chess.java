/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.Game;
import naija.game.client.GameImpl;
import naija.game.client.GameSession;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.Score;
import naija.game.client.chess.algorithm.Algorithm;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.BoardAnalyzer;
import naija.game.client.Side;
import naija.game.client.chess.board.ChessBoardPosition;


/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Chess extends GameImpl {

    private ChessPlayer white_player;
    private ChessPlayer black_player;
    private int search_depth;
    private BoardAnalyzer board_analyzer;
    private ChessBoardListener boardListener;
    private ChessPlayer[] players;
    final private Object lock = new Object();
  
    @Override
    public boolean isRobotVsRobot() {
        return isRobotVsRobot;
    }

    @Override
    public boolean isHumanVsRobot() {
        return isHumanVsRobot;
    }

    public ChessPlayer getWhitePlayer() {
        return white_player;
    }

    public ChessPlayer getBlackPlayer() {
        return black_player;
    }

    @Override
    public Player[] getPlayers() {
        if (players == null) {
            players = new ChessPlayer[]{white_player, black_player};
        }
        return players;
    }

    @Override
    public Player getPlayer(int player_index) {
        if (players == null) {
            players = new ChessPlayer[]{white_player, black_player};
        }
        return players[player_index];
    }
    
    private Chess(){ 
    }
    
    private Chess(ChessBuilder chessBuilder) {

                
        this.session_id = chessBuilder.session_id;
        this.boardListener = chessBuilder.boardListener;
        this.white_player = chessBuilder.white_player;
        this.black_player = chessBuilder.black_player;
        this.game_position = chessBuilder.board_position;
        this.score = chessBuilder.score;
        this.time_control = chessBuilder.time_control;
        this.algorithm = chessBuilder.algorithm;
        this.search_depth = chessBuilder.search_depth;
        this.game_variant = chessBuilder.chess_variant;

        if (boardListener == null) {
            throw new NullPointerException("board listener cannot be null!");
        }else{
            boardListener.initializeGamePosition(chessBuilder.board_position, new Player[]{white_player, black_player});
        }

        if (game_position == null && game_variant == 0) {
            gameBase = new Board(true);//default gameBase setup - normal chess
            //OK, player's turn will be set AUTOMATICALLY to white in the gameBase constructor which is the default
        } else if (game_position == null && game_variant != 0) {
            gameBase = new Board(game_variant);//setup default gameBase based on the specified chess game_variant e.g Chess960
            //OK, player's turn will be set AUTOMATICALLY to white in the gameBase constructor which is the default
        } else if (game_position != null && game_variant != 0) {
            gameBase = new Board(game_position.toString(), game_variant);//setup gameBase postion using specified ches game_variant
            //OK, player's turn will be set AUTOMATICALLY in the gameBase constructor using the gameBase position
        } else if (game_position != null && game_variant == 0) {
            gameBase = new Board(game_position.toString());//setup gameBase position using normal chess
            //OK, player's turn will be set AUTOMATICALLY in the gameBase constructor using the gameBase position
        } else {
            throw new IllegalStateException("could not setup internal board! - invalid setup parameter");
        }

        board_analyzer = new BoardAnalyzer((Board)gameBase);

        if (white_player.isRobot() && black_player.isRobot()) {
            //computer vs computer
            robotEngineA = new ChessRobotEngine((Board)gameBase, white_player, search_depth, algorithm);
            robotEngineB = new ChessRobotEngine((Board)gameBase, black_player, search_depth, algorithm);
            isRobotVsRobot = true;
            startEngine();
        }

        if ((white_player.isHuman() && black_player.isRobot())
                || (white_player.isRobot() && black_player.isHuman())) {
            //computer vs human
            ChessPlayer player = white_player.isRobot() ? white_player : black_player;
            robotEngineA = new ChessRobotEngine((Board)gameBase, player, search_depth, algorithm);
            isHumanVsRobot = true;
            startEngine();//
        }

        //fire onNextTurn event to kick off the game
        ChessPlayer turn_player = ((Board)gameBase).turn == Side.white ? white_player : black_player;
        boardListener.onNextTurn(new ChessBoardEvent(turn_player, ((Board)gameBase).turn));

        isReady = true;
    }

    Board getBoard() {
        return (Board)gameBase;
    }

    BoardAnalyzer getBoardAnalyzer() {
        return board_analyzer;
    }

    ChessBoardListener getBoardListener() {
        return boardListener;
    }

    ChessPlayer getOppontent(int side) {
        if (side == Side.white) {
            return this.black_player;
        } else {
            return this.white_player;
        }
    }

    public static class ChessBuilder {

        private final ChessBoardListener boardListener;
        private ChessPlayer white_player;
        private ChessPlayer black_player;
        private ChessBoardPosition board_position;
        private Score score;
        private String time_control;
        private int algorithm = Algorithm.AlphaBeta;//default
        private int search_depth = 5;//default
        private int chess_variant;
        private final String session_id;

        public ChessBuilder(String session_id , ChessBoardListener boardListener) {
            this.boardListener = boardListener;
            this.session_id = session_id;
        }

        public ChessBuilder whitePlayer(LocalUser user) {
            this.white_player = new ChessPlayer(user, true);
            return this;
        }

        public ChessBuilder blackPlayer(LocalUser user) {
            this.black_player = new ChessPlayer(user, false);
            return this;
        }

        public ChessBuilder whitePlayer(RemoteUser user) {
            this.white_player = new ChessPlayer(user, true);
            return this;
        }

        public ChessBuilder whitePlayer(WhiteChessPlayer white_player) {
            this.white_player = white_player;
            return this;
        }
        public ChessBuilder blackPlayer(RemoteUser user) {
            this.black_player = new ChessPlayer(user, false);
            return this;
        }

        public ChessBuilder whitePlayer(Robot robot) {
            this.white_player = new ChessPlayer(robot, true);
            return this;
        }

        public ChessBuilder blackPlayer(Robot robot) {
            this.black_player = new ChessPlayer(robot, false);
            return this;
        }

        public ChessBuilder blackPlayer(BlackChessPlayer black_player) {
            this.black_player = black_player;
            return this;
        }

        public ChessBuilder boardPosition(ChessBoardPosition board_position) {
            this.board_position = board_position;
            return this;
        }

        public ChessBuilder score(Score score) {
            this.score = score;
            return this;
        }

        public ChessBuilder timeControl(String time_control) {//come back
            this.time_control = time_control;
            return this;
        }

        public ChessBuilder chessAI(int algorithm, int search_depth) {
            this.algorithm = algorithm;
            this.search_depth = search_depth;
            return this;
        }

        public ChessBuilder chessVariant(int chess_variant) {
            this.chess_variant = chess_variant;
            return this;
        }

        public Chess build() {

            if (white_player == null) {
                throw new NullPointerException("winner player cannot be null!");
            }

            if (black_player == null) {
                throw new NullPointerException("black player cannot be null!");
            }

            Chess chess = new Chess(this);
            white_player.setChess(chess);
            black_player.setChess(chess);

            return chess;
        }

    }
}
