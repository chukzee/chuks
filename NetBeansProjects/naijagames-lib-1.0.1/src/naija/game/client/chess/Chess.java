/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.Game;
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
public class Chess implements Game, Runnable {

    private ChessPlayer white_player;
    private ChessPlayer black_player;
    private ChessBoardPosition board_position;
    private Score score;
    private String time_control;
    private int algorithm;
    private int search_depth;
    private int chess_variant;
    private Board board;
    private BoardAnalyzer board_analyzer;
    private ChessBoardListener boardListener;
    private RobotEngine chessEngineA;
    private RobotEngine chessEngineB;
    private boolean isRobotVsRobot;
    private boolean isHumanVsRobot;
    private Thread engineThread;
    private boolean isStop;
    private ChessPlayer[] players;
    private boolean isReady;
    private boolean isRobotWait;
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
    public String getInitialBoardPosition() {
        return board_position.toString();
    }

    @Override
    public Score getScore() {
        return score;
    }

    @Override
    public String getTimeControl() {
        
        return time_control;
    }

    @Override
    public int getAlgorithm() {
        return algorithm;
    }
    private Chess(){
        
    }
    private Chess(ChessBuilder chessBuilder) {

                
        this.boardListener = chessBuilder.boardListener;
        this.white_player = chessBuilder.white_player;
        this.black_player = chessBuilder.black_player;
        this.board_position = chessBuilder.board_position;
        this.score = chessBuilder.score;
        this.time_control = chessBuilder.time_control;
        this.algorithm = chessBuilder.algorithm;
        this.search_depth = chessBuilder.search_depth;
        this.chess_variant = chessBuilder.chess_variant;

        if (boardListener == null) {
            throw new NullPointerException("board listener cannot be null!");
        }else{
            boardListener.initializeGamePosition(chessBuilder.board_position, new Player[]{white_player, black_player});
        }

        if (board_position == null && chess_variant == 0) {
            board = new Board(true);//default board setup - normal chess
            //OK, player's turn will be set AUTOMATICALLY to white in the board constructor which is the default
        } else if (board_position == null && chess_variant != 0) {
            board = new Board(chess_variant);//setup default board based on the specified chess variant e.g Chess960
            //OK, player's turn will be set AUTOMATICALLY to white in the board constructor which is the default
        } else if (board_position != null && chess_variant != 0) {
            board = new Board(board_position.toString(), chess_variant);//setup board postion using specified ches variant
            //OK, player's turn will be set AUTOMATICALLY in the board constructor using the board position
        } else if (board_position != null && chess_variant == 0) {
            board = new Board(board_position.toString());//setup board position using normal chess
            //OK, player's turn will be set AUTOMATICALLY in the board constructor using the board position
        } else {
            throw new IllegalStateException("could not setup internal board! - invalid setup parameter");
        }

        board_analyzer = new BoardAnalyzer(board);

        if (white_player.isRobot() && black_player.isRobot()) {
            //computer vs computer
            chessEngineA = new RobotEngine(board, white_player, search_depth, algorithm);
            chessEngineB = new RobotEngine(board, black_player, search_depth, algorithm);
            isRobotVsRobot = true;
            startEngine();
        }

        if ((white_player.isHuman() && black_player.isRobot())
                || (white_player.isRobot() && black_player.isHuman())) {
            //computer vs human
            ChessPlayer player = white_player.isRobot() ? white_player : black_player;
            chessEngineA = new RobotEngine(board, player, search_depth, algorithm);
            isHumanVsRobot = true;
            startEngine();//
        }

        //fire onNextTurn event to kick off the game
        ChessPlayer turn_player = board.turn == Side.white ? white_player : black_player;
        boardListener.onNextTurn(new ChessBoardEvent(turn_player, board.turn));

        isReady = true;
    }

    private void startEngine() {
        if (engineThread != null) {
            return;//already started
        }
        engineThread = new Thread(this);
        engineThread.start();
    }

    Board getBoard() {
        return board;
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

    void setRobotEngineWait(boolean isRobotWait) {
        synchronized (lock) {
            this.isRobotWait = isRobotWait;
        }
    }

    @Override
    public void run() {

        while (!isReady) {
            //wait till the Chess object is fully created
        }

        while (!isStop) {
            synchronized (lock) {
                if (isRobotWait) {
                    continue;
                }
                if (!runEngineReply()) {
                    break;
                }
            }

        }
    }

    private boolean runEngineReply() {
        if (chessEngineA != null) {
            chessEngineA.nextReply(board);
            if (chessEngineA.isGameOver()) {
                return false;
            }
        }

        if (chessEngineB != null) {
            chessEngineB.nextReply(board);
            if (chessEngineB.isGameOver()) {
                return false;
            }
        }

        return true;
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

        public ChessBuilder(ChessBoardListener boardListener) {
            this.boardListener = boardListener;
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

        public ChessBuilder setBoardPosition(ChessBoardPosition board_position) {
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
