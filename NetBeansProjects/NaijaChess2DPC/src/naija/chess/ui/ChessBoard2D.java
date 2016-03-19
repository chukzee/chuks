/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.chess.ui;

import naija.game.client.chess.PieceName;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;
import javax.swing.Timer;
import naija.game.client.event.GameEvent;
import naija.game.client.GamePosition;
import naija.game.client.Player;
import naija.game.client.chess.Chess;
import naija.game.client.chess.ChessBoardListener;
import naija.game.client.chess.ChessPlayer;
import naija.game.client.chess.ChessBoardEvent;
import naija.game.client.Side;
import naija.game.client.chess.board.ChessBoardPosition;
import naija.game.client.chess.board.PieceDescription;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ChessBoard2D extends JPanel implements ChessBoardListener, MouseListener, MouseMotionListener {

    private static boolean isLoaded;

    private static BufferedImage imgWhiteRook;
    private static BufferedImage imgWhiteKnight;
    private static BufferedImage imgWhiteBishop;
    private static BufferedImage imgWhiteKing;
    private static BufferedImage imgWhiteQueen;
    private static BufferedImage imgWhitePawn;

    private static BufferedImage imgBlackRook;
    private static BufferedImage imgBlackKnight;
    private static BufferedImage imgBlackBishop;
    private static BufferedImage imgBlackKing;
    private static BufferedImage imgBlackQueen;
    private static BufferedImage imgBlackPawn;

    private static BufferedImage imgBoardPart;
    private static BufferedImage imgBoardPartUp;
    private static BufferedImage imgBoardPartDown;

    private boolean isAnimationInProgress = false;

    private int pieceX = 100;
    private int pieceY = 100;
    private int qc_size = 120;
    private int sq_size = qc_size / 2;
    private int pce_size = qc_size / 2;
    private int normalize_panel_size = 0;
    private Piece2D[] pieces = new Piece2D[32];

    /**
     * signify that a piece is in motion due to move operation of the mouse. The
     * move operation of the mouse is preceded by a click action on a square
     * containing the specified piece. if the piece is valid for PICKING then
     * the PICK mode is active thus causing the piece to follow the movement of
     * the mouse until the desired square is clicked to end the PICK mode
     *
     */
    private final int PICK_MODE = 10;

    /**
     * signify that a piece is in motion due to drag operation of the mouse. the
     * DRAG mode ends on a square where the drag action of the mouse ends.
     *
     */
    private final int DRAG_MODE = 11;

    /**
     * this signify the end of PICK or DRAG mode. ie a piece which was in motion
     * during PICK or DRAG mode has stop moving.
     *
     */
    private final int DROP_MODE = 12;

    /**
     * this may be PICK , DRAG OR DROP mode<br>
     * the default is DROP mode
     */
    private int mode = DROP_MODE;

    /**
     * determines the piece side enabled for pick or drag mode
     *
     */
    private int fromSquare;
    private Piece2D pieceOnFocus;
    private int aminX;
    private int aminY;
    private ChessPlayer turnPlayer;
    private boolean isWhiteTurn;
    private boolean isStarted;
    private boolean isLocalPlayerTurn;
    private boolean isWhiteFaceUpwardBoard = true;//default
    static final public int WHITE_UPWARD = 10;
    static final public int WHITE_DOWNWARD = 20;
    private boolean isQueenPromotion;
    private boolean isBishopPromotion;
    private boolean isKnightPromotion;
    private boolean isRookPromotion;
    private boolean isEnPassant;
    private boolean isLongCastle;
    private boolean isShortCastle;
    private int pce_scale_size;
    private PieceDescription pce_desc;

    public ChessBoard2D() {

        try {

            if (!isLoaded) {

                imgBoardPartUp = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/boards/blue/60.gif"));
                imgBoardPartDown = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/boards/blue/60.gif"));

                imgBoardPart = imgBoardPartUp;

                //load white pieces
                imgWhiteKing = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/wk.png"));
                imgWhiteQueen = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/wq.png"));
                imgWhiteBishop = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/wb.png"));
                imgWhiteKnight = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/wn.png"));
                imgWhiteRook = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/wr.png"));
                imgWhitePawn = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/wp.png"));

                //load black pieces
                imgBlackKing = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/bk.png"));
                imgBlackQueen = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/bq.png"));
                imgBlackBishop = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/bb.png"));
                imgBlackKnight = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/bn.png"));
                imgBlackRook = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/br.png"));
                imgBlackPawn = ImageIO.read(getClass().getClassLoader().getResource("resources/chess/pieces/alpha/60/bp.png"));

                isLoaded = true;
            }

        } catch (IOException ex) {
            Logger.getLogger(ChessBoard2D.class.getName()).log(Level.SEVERE, null, ex);
        }

        arrangePieces();

        this.addMouseListener(this);
        this.addMouseMotionListener(this);
    }

    private void arrangePieces() {

        for (int i = 0; i < 16; i++) {

            boolean is_white = true;
            PieceName name;
            Image image;
            int square = i;

            switch (square) {
                case 0:
                    name = PieceName.rook;
                    image = imgWhiteRook;
                    break;

                case 1:
                    name = PieceName.knight;
                    image = imgWhiteKnight;
                    break;

                case 2:
                    name = PieceName.bishop;
                    image = imgWhiteBishop;
                    break;

                case 3:
                    name = PieceName.queen;
                    image = imgWhiteQueen;
                    break;

                case 4:
                    name = PieceName.king;
                    image = imgWhiteKing;
                    break;

                case 5:
                    name = PieceName.bishop;
                    image = imgWhiteBishop;
                    break;

                case 6:
                    name = PieceName.knight;
                    image = imgWhiteKnight;
                    break;

                case 7:
                    name = PieceName.rook;
                    image = imgWhiteRook;
                    break;

                default:
                    name = PieceName.pawn;
                    image = imgWhitePawn;

            }

            pieces[i] = new Piece2D(name, is_white, square, image);
        }

        for (int i = 16; i < 32; i++) {

            boolean is_white = false;//black piece
            PieceName name;
            Image image;
            int square = i + 32;

            switch (square) {
                case 56:
                    name = PieceName.rook;
                    image = imgBlackRook;
                    break;

                case 57:
                    name = PieceName.knight;
                    image = imgBlackKnight;
                    break;

                case 58:
                    name = PieceName.bishop;
                    image = imgBlackBishop;
                    break;

                case 59:
                    name = PieceName.queen;
                    image = imgBlackQueen;
                    break;

                case 60:
                    name = PieceName.king;
                    image = imgBlackKing;
                    break;

                case 61:
                    name = PieceName.bishop;
                    image = imgBlackBishop;
                    break;

                case 62:
                    name = PieceName.knight;
                    image = imgBlackKnight;
                    break;

                case 63:
                    name = PieceName.rook;
                    image = imgBlackRook;
                    break;

                default:
                    name = PieceName.pawn;
                    image = imgBlackPawn;

            }

            pieces[i] = new Piece2D(name, is_white, square, image);
        }

    }

    private void scalePieces() {
        if (pce_scale_size == pce_size) {
            return;
        }
        pce_scale_size = pce_size;

        for (Piece2D piece : pieces) {
            Image img = null;
            switch (piece.getName()) {
                case king:
                    img = piece.isWhite() ? imgWhiteKing : imgBlackKing;
                    break;
                case queen:
                    img = piece.isWhite() ? imgWhiteQueen : imgBlackQueen;
                    break;
                case bishop:
                    img = piece.isWhite() ? imgWhiteBishop : imgBlackBishop;
                    break;
                case knight:
                    img = piece.isWhite() ? imgWhiteKnight : imgBlackKnight;
                    break;
                case rook:
                    img = piece.isWhite() ? imgWhiteRook : imgBlackRook;
                    break;
                case pawn:
                    img = piece.isWhite() ? imgWhitePawn : imgBlackPawn;
                    break;
            }
            img = img.getScaledInstance(pce_scale_size, pce_scale_size, Image.SCALE_SMOOTH);
            piece.setImage(img);
        }
    }

    public void setBoardOrientation(int orientation) {
        if (orientation == WHITE_UPWARD) {
            isWhiteFaceUpwardBoard = true;
            imgBoardPart = imgBoardPartUp;
            repaint();
        } else if (orientation == WHITE_DOWNWARD) {
            isWhiteFaceUpwardBoard = false;
            imgBoardPart = imgBoardPartDown;
            repaint();
        }
    }

    private int boardSize() {
        return sq_size * 8;
    }

    public synchronized void animatePiece(int from_square, final int to_square) {

        while (isAnimationInProgress) {
            //wait for the current animation to finish
        }

        isAnimationInProgress = true;

        final Piece2D amimPiece = getPieceOnSquare((int) from_square);

        System.out.println("REMIND: DO SAME IN ANDROID - getXOfSquareCenter");

        final double from_x = getXOfSquareCenter(from_square);//REMIND: DO SAME IN ANDROID
        final double from_y = getYOfSquareCenter(from_square);//REMIND: DO SAME IN ANDROID

        final double to_x = getXOfSquareCenter(to_square);//REMIND: DO SAME IN ANDROID
        final double to_y = getYOfSquareCenter(to_square);//REMIND: DO SAME IN ANDROID

        final double distance_btw = Math.sqrt(Math.pow(to_x - from_x, 2) + Math.pow(to_y - from_y, 2));
        final double sin_ang = (to_x - from_x) / distance_btw;
        final double cos_ang = (to_y - from_y) / distance_btw;

        amimPiece.setIsAnimating(true);
        final int duration = 1000;

        new Thread(new Runnable() {
            @Override
            public void run() {
                //Animate along path
                long start_time = System.currentTimeMillis();
                int sleep = 1000;
                int initial_sleep = sleep;
                final int distance = (int) distance_btw;
                int step = 1;
                int initial_step = step;
                for (int d = 0; d < distance; d += step) {

                    final int st = step;
                    final int n = d;
                    final int nav_x = (int) (from_x + d * sin_ang);//Compute the x positon
                    final int nav_y = (int) (from_y + d * cos_ang);//Compute the y positon
                    SwingUtilities.invokeLater(new Runnable() {
                        @Override
                        public void run() {

                            if (n + st < distance) {
                                aminX = nav_x;
                                aminY = nav_y;
                                repaint();

                            }

                        }
                    });
                    try {
                        Thread.sleep(sleep / distance);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(ChessBoard2D.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    long elapse = System.currentTimeMillis() - start_time;
                    int expected_elapse = (int) (n / (double) distance * duration);

                    if (elapse != 0 && expected_elapse != 0) {//avoid division by zero
                        if (elapse > expected_elapse) {
                            step = (int) Math.ceil(elapse / (double) expected_elapse);
                            sleep = initial_sleep;
                            if (step < 1) {
                                step = 1;//avoid zero step
                            }

                        } else {
                            step = initial_step;
                            sleep = (int) (initial_sleep * expected_elapse / (double) elapse);
                        }
                    }
                }

                //drop the animating piece 
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {

                        //but first capture any piece occupying the square
                        Piece2D capture_pce = getPieceOnSquare(to_square);
                        if (capture_pce != null) {
                            capture_pce.setIsCaptured(true);
                        }

                        //now drop the animating piece
                        amimPiece.setSquare((int) to_square);
                        amimPiece.setIsAnimating(false);
                        repaint();
                        isAnimationInProgress = false;

                    }
                });
            }
        }).start();

    }

    @Override
    protected void paintComponent(Graphics g) {

        super.paintComponent(g);

        int pnl_width = this.getWidth();
        int pnl_height = this.getHeight();
        this.normalize_panel_size = pnl_height;
        if (pnl_width < pnl_height) {
            normalize_panel_size = pnl_width;
        }

        normalize_panel_size = normalize_panel_size * 4 / 4;//convert to multiple of 4 only
        qc_size = normalize_panel_size / 4;
        sq_size = qc_size / 2;
        pce_size = (int) (qc_size / 2 * 0.9);

        scalePieces();//DO NOT CALL THIS IN ANDROID

        for (int x = 0; x < 4; x++) {
            for (int y = 0; y < 4; y++) {
                g.drawImage(imgBoardPart, qc_size * x, qc_size * y, qc_size, qc_size, null);
            }
        }

        Piece2D animating_piece = null;
        Piece2D picked_piece = null;

        for (Piece2D piece :pieces) {
            
            if (piece==null) {
                continue;
            }
            
            if (piece.isCaptured()) {
                continue;
            }
            if (piece.isAnimating()) {
                animating_piece = piece;//draw later so as to be drawn on top of others - see below
            } else if (piece.isPicked()) {
                picked_piece = piece;//draw later so as to be drawn on top of others - see below
            } else {
                int x = getPeiceX(piece.getSquare());
                int y = getPeiceY(piece.getSquare());
                g.drawImage(piece.getImage(), x, y, pce_size, pce_size, null);
            }
        }

        //draw the animating piece on top of others
        if (animating_piece != null) {
            g.drawImage(animating_piece.getImage(), aminX, aminY, pce_size, pce_size, null);
        }

        //draw the picked piece on top of others
        if (picked_piece != null) {
            //move the picked piece
            g.drawImage(picked_piece.getImage(), pieceX, pieceY, pce_size, pce_size, null);
        }
    }

    int getSquareCenter(int p) {
        if (this.isWhiteFaceUpwardBoard) {
            int fac = ((qc_size / 2) - this.pce_size) / 2;
            int n = p / (qc_size / 2);
            n *= (qc_size / 2);
            return n + fac + 1;
        } else {
            int fac = p / this.sq_size;//must be declared as int in android
            int c = fac * sq_size + (this.sq_size - this.pce_size);//declare as float in android            
            return c;
        }
    }

    double getXOfSquareCenter(int square) {
        int x = -1;
        if (this.isWhiteFaceUpwardBoard) {
            x = getSquareCenter(square % 8 * this.sq_size);
        } else {
            x = getSquareCenter(square % 8 * this.sq_size);//similarly - ok
        }

        return x;
    }

    double getYOfSquareCenter(int square) {
        int y = -1;
        if (this.isWhiteFaceUpwardBoard) {
            y = getSquareCenter((7 - (square) / 8) * this.sq_size);
        } else {
            y = getSquareCenter((square / 8) * this.sq_size);//not simiar in the case of y
        }

        return y;
    }

    @Override
    public void mouseClicked(MouseEvent e) {

        if (!isLocalPlayerTurn) {
            //disable picking
            return;
        }

        if (!this.isPlayerTurn(e)) {
            //disable picking
            return;
        }

        if (isOffBoard(e)) {
            return;
        }

        if (mode != this.DROP_MODE) {

            this.pieceX = this.getSquareCenter(e.getX());
            this.pieceY = this.getSquareCenter(e.getY());
            this.repaint();

            mode = this.DROP_MODE;
            int to_square = this.getSquare(e);
            pieceOnFocus.setSquare(to_square);
            pieceOnFocus.setIsPicked(false);
            this.turnPlayer.localMove(pieceOnFocus.getName(), fromSquare, to_square);
            pieceOnFocus = null;
        } else {
            Piece2D pce = pickPieceOnSquare(e);
            if (pce != null) {
                mode = this.PICK_MODE;
                pieceOnFocus = pce;
                this.fromSquare = this.getSquare(e);
            }

        }

    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {

        if (isOffBoard(e)) {
            return;
        }

        if (this.mode == this.DRAG_MODE) {
            this.pieceX = this.getSquareCenter(e.getX());
            this.pieceY = this.getSquareCenter(e.getY());
            this.repaint();

            this.mode = this.DROP_MODE;
            int to_square = this.getSquare(e);
            pieceOnFocus.setSquare(to_square);
            pieceOnFocus.setIsPicked(false);

            this.turnPlayer.localMove(pieceOnFocus.getName(), fromSquare, to_square);
            pieceOnFocus = null;
        }

    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void mouseDragged(MouseEvent e) {

        if (!isLocalPlayerTurn) {
            //disable picking
            return;
        }

        if (!this.isPlayerTurn(e)) {
            //disable picking
            return;
        }

        if (isOffBoard(e)) {
            returnPieceBack();
            return;
        }

        if (this.mode == this.DROP_MODE) {
            Piece2D pce = this.pickPieceOnSquare(e);
            if (pce != null) {
                this.mode = this.DRAG_MODE;
                pieceOnFocus = pce;
                this.fromSquare = this.getSquare(e);
            }

        }

        if (this.mode == this.DRAG_MODE) {
            this.pieceX = e.getX() - sq_size / 2;
            this.pieceY = e.getY() - sq_size / 2;

            this.repaint();
        }

    }

    @Override
    public void mouseMoved(MouseEvent e) {

        if (isOffBoard(e)) {
            return;
        }

        if (this.mode == this.PICK_MODE) {
            this.pieceX = e.getX() - sq_size / 2;
            this.pieceY = e.getY() - sq_size / 2;

            this.repaint();
        }
    }

    private int getPeiceX(int square) {

        if (this.isWhiteFaceUpwardBoard) {

            int b = (square) % 8;
            int fac = ((qc_size / 2) - this.pce_size) / 2;
            int l = qc_size / 2;
            return (fac + 1) + l * b;

        } else {

            int col = square % 8;//must remain declard as int in android - do not change it
            int x = col * this.sq_size + (this.sq_size - this.pce_size);//declare as float in android

            return x;
        }

    }

    private int getPeiceY(int square) {

        if (this.isWhiteFaceUpwardBoard) {

            int b = (square) / 8;
            int fac = ((qc_size / 2) - this.pce_size) / 2;
            int l = qc_size / 2;
            return fac + 1 + l * (7 - b);
        } else {
            int row = square / 8;//must remain declard as int in android - do not change it
            int y = row * this.sq_size + (this.sq_size - this.pce_size);//declare as float in android

            return y;

        }
    }

    private int getSquare(MouseEvent e) {
        int sq = -1;
        int x = e.getX();
        int y = e.getY();

        if (this.isWhiteFaceUpwardBoard) {

            int n = x / this.sq_size;
            int m = Math.abs(y / this.sq_size - 7);
            sq = m * 8 + n;

        } else {

            int n = x / this.sq_size;//think out the declaration type in android
            int m = y / this.sq_size;//think out the declaration type in android
            sq = m * 8 + n;

        }

        return sq;
    }

    /**
     * used to select a piece to be moved or dragged
     *
     * @param e
     * @return
     */
    private Piece2D pickPieceOnSquare(MouseEvent e) {

        int square = getSquare(e);

        Piece2D pce = null;
        for (Piece2D piece : pieces) {
                     
            if (piece==null) {
                continue;
            }
            
            if (piece.getSquare() == square) {
                piece.setIsPicked(true);
                pce = piece;
            } else {
                piece.setIsPicked(false);
            }
        }

        return pce;
    }

    private Piece2D getPieceOnSquare(MouseEvent e) {
        return getPieceOnSquare(getSquare(e));
    }

    private Piece2D getPieceOnSquare(int square) {
        if (square < 0 || square > 63) {
            return null;
        }

        for (Piece2D piece : pieces) {
                     
            if (piece==null) {
                continue;
            }
            
            if (piece.getSquare() == square) {
                return piece;
            }
        }

        return null;
    }

    private void returnPieceBack() {
        if (this.pieceOnFocus == null || this.mode == this.DROP_MODE) {
            return;
        }
        this.pieceOnFocus.setSquare(this.fromSquare);
        this.pieceOnFocus.setIsPicked(false);
        this.pieceOnFocus = null;
        this.mode = this.DROP_MODE;
        this.repaint();
    }

    private boolean isOffBoard(MouseEvent e) {
        int board_size = this.boardSize();
        int border = 1;
        return e.getX() > board_size - border
                || e.getY() > board_size - border
                || e.getX() < 0 + border
                || e.getY() < 0 + border;
    }

    private boolean isPlayerTurn(MouseEvent e) {
        if (!isStarted) {
            return false;
        }
        Piece2D pce = this.getPieceOnSquare(e);
        if (mode == this.DROP_MODE) {
            if (pce != null) {
                return pce.isWhite() == isWhiteTurn;
            }
        } else {
            //pick or drag mode
            return pieceOnFocus.isWhite() == isWhiteTurn;
        }

        return false;
    }

    private Piece2D getWhitePieceOnSquare(int square) {
        if (square < 0 || square > 63) {
            return null;
        }

        for (Piece2D piece : pieces) {
                     
            if (piece==null) {
                continue;
            }
            
            if (piece.isWhite()) {
                if (piece.getSquare() == square) {
                    return piece;
                }
            }
        }

        return null;
    }

    private Piece2D getBlackPieceOnSquare(int square) {
        if (square < 0 || square > 63) {
            return null;
        }

        for (Piece2D piece : pieces) {
                     
            if (piece==null) {
                continue;
            }
            
            if (!piece.isWhite()) {
                if (piece.getSquare() == square) {
                    return piece;
                }
            }
        }

        return null;
    }

    private void doPromotion(boolean is_white, PieceName name, int from_square,
            int to_square) {

        this.animatePiece(from_square, to_square);// animate the piece

        Piece2D pce = this.getPieceOnSquare(to_square);
        pce.setName(name);
        switch (name) {
            case queen:
                pce.setImage(is_white ? imgWhiteQueen : imgBlackQueen);
                break;
            case rook:
                pce.setImage(is_white ? imgWhiteRook : imgBlackRook);
                break;
            case bishop:
                pce.setImage(is_white ? imgWhiteBishop : imgBlackBishop);
                break;
            case knight:
                pce.setImage(is_white ? imgWhiteKnight : imgBlackKnight);
                break;
        }

        this.repaint();//re-paint to reflect the changes due to promotion
    }

    
    @Override
    public void initializeGamePosition(ChessBoardPosition fen_board_position, Player... players) {
        pieces = new Piece2D[32];//initialize
        int index = -1;
        for (int square = 0; square < 64; square++) {
            pce_desc = fen_board_position.getPieceDescription(square);
            if (pce_desc == null) {
                continue;
            }
            PieceName pce_name = pce_desc.getPieceName();
            boolean is_white = pce_desc.isWhite();
            index++;
            switch (pce_name) {
                case king:
                    pieces[index] = new Piece2D(pce_name, is_white, square, is_white ? imgWhiteKing : imgBlackKing);
                    break;
                case queen:
                    pieces[index] = new Piece2D(pce_name, is_white, square, is_white ? imgWhiteQueen : imgBlackQueen);
                    break;
                case bishop:
                    pieces[index] = new Piece2D(pce_name, is_white, square, is_white ? imgWhiteBishop : imgBlackBishop);
                    break;
                case knight:
                    pieces[index] = new Piece2D(pce_name, is_white, square, is_white ? imgWhiteKnight : imgBlackKnight);
                    break;
                case rook:
                    pieces[index] = new Piece2D(pce_name, is_white, square, is_white ? imgWhiteRook : imgBlackRook);
                    break;
                case pawn:
                    pieces[index] = new Piece2D(pce_name, is_white, square, is_white ? imgWhitePawn : imgBlackPawn);
                    break;
            }
            
        }

        pce_scale_size = 0;//this will force re-scaling - THIS LINE IS NOT REQUIRED IN ANDROID
        
        repaint();

    }

    @Override
    public void onRobotMove(ChessBoardEvent e) {

        //animate piece while disabling piece picking
        handleMoveAnimation(e);

        System.out.println("robot reply - " + e.getMoveNotation());
        System.out.println(e.printBoard());
    }

    @Override
    public void onRemotePlayerMove(ChessBoardEvent e) {

        //animate piece while disabling piece picking
        handleMoveAnimation(e);

        System.out.println("remote player reply - " + e.getMoveNotation());
        System.out.println(e.printBoard());
    }

    @Override
    public void onLocalPlayerMove(ChessBoardEvent e) {

        //A good place for local player to  effect capture
        System.out.println("local player reply - " + e.getMoveNotation());

        System.out.println(e.printBoard());

        int capture_square = e.getMoveToSquare();

        if (e.isEnPassant()) {
            capture_square = e.getEnPassantCaptureSquare();
        }

        Piece2D opponent_pce;
        int turn = e.getCurrentTurn();
        opponent_pce = turn == Side.white
                ? this.getBlackPieceOnSquare(capture_square)
                : this.getWhitePieceOnSquare(capture_square);

        if (opponent_pce != null) {
            //capture the piece
            opponent_pce.setIsCaptured(true);
            repaint();
        }

    }

    @Override
    public void onNextTurn(ChessBoardEvent e) {
        
        System.out.println("onNextTurn");
        isStarted = true;
        turnPlayer = e.getTurnPlayer();
        isWhiteTurn = turnPlayer.isWhite();

        isLocalPlayerTurn = turnPlayer.isLocalPlayer();

    }

    @Override
    public void onGameOver(ChessBoardEvent e) {

        String msg = "";

        if (e.isCheckmate()) {
            msg = e.getWinner().isWhite() ? "white wins by checkmate" : "black wins by checkmate";
        } else if (e.isStalement()) {
            msg = "game ends in stalemate";
        } else if (e.isFiftyMoveRule()) {
            msg = "game ends in draw by fifty move rule";
        } else if (e.isThreeFoldRepitition()) {
            msg = "game ends in draw by three fold repitition";
        } else if (e.isInsufficientMaterial()) {
            msg = "game ends in draw by insufficient material";
        }

        System.out.println(msg);

    }

    @Override
    public void onInvalidMove(ChessBoardEvent e) {
                
        int illegal_from_sq = e.getIllegalMoveFromSquare();
        int illegal_to_sq = e.getIllegalMoveToSquare();

        pieceOnFocus.setSquare(illegal_from_sq);
        repaint();

        String msg = e.getMessage();

        System.err.println(msg);

    }

    @Override
    public void onError(ChessBoardEvent e) {

        //COME BACK FOR BETTER IMPLEMENTATION
        String msg = e.getMessage();

        System.err.println(msg);

    }

    private void handleMoveAnimation(ChessBoardEvent event) {

        int from_square = event.getMoveFromSquare();
        int to_square = event.getMoveToSquare();

        System.out.println("handleMoveAnimation from_square " + from_square
                + "  to_square " + to_square);

        boolean is_white_turn = event.getCurrentTurn() == Side.white;

        if (event.isQueenPromotion()) {
            doPromotion(is_white_turn, PieceName.queen, from_square, to_square);
        } else if (event.isBishopPromotion()) {
            doPromotion(is_white_turn, PieceName.bishop, from_square, to_square);
        } else if (event.isRookPromotion()) {
            doPromotion(is_white_turn, PieceName.rook, from_square, to_square);
        } else if (event.isKnightPromotion()) {
            doPromotion(is_white_turn, PieceName.knight, from_square, to_square);
        } else if (event.isEnPassant()) {

            int en_passant_capture_square = event.getEnPassantCaptureSquare();
            this.animatePiece(from_square, to_square);
            Piece2D pce = this.getPieceOnSquare(en_passant_capture_square);
            pce.setIsCaptured(true);
            repaint();

        } else if (event.isLongCastle()) {

            int king_from_square = event.getLongCastleKingFromSquare();
            int king_to_square = event.getLongCastleKingToSquare();
            this.animatePiece(king_from_square, king_to_square);

            int rook_from_square = event.getLongCastleRookFromSquare();
            int rook_to_square = event.getLongCastleRookToSquare();
            this.animatePiece(rook_from_square, rook_to_square);

        } else if (event.isShortCastle()) {

            int king_from_square = event.getShortCastleKingFromSquare();
            int king_to_square = event.getShortCastleKingToSquare();
            this.animatePiece(king_from_square, king_to_square);

            int rook_from_square = event.getShortCastleRookFromSquare();
            int rook_to_square = event.getShortCastleRookToSquare();
            this.animatePiece(rook_from_square, rook_to_square);

        } else {

            this.animatePiece(from_square, to_square);
        }

    }

    @Override
    public void onInvalidTurn(ChessBoardEvent e) {
        
        String msg = "Not your turn! It's " + (e.getCurrentTurn() == Side.white ? "white's turn." : "black's turn.");
        System.out.println(msg);

    }

    @Override
    public void onShortCastleBeginByKing(ChessBoardEvent event) {
        System.out.println("onShortCastleBeginByKing");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());

        int rook_from_square = event.getShortCastleRookFromSquare();
        int rook_to_square = event.getShortCastleRookToSquare();

        event.getPlayer().localMove(PieceName.rook, rook_from_square, rook_to_square);
        this.animatePiece(rook_from_square, rook_to_square);

    }

    @Override
    public void onShortCastleEndByRook(ChessBoardEvent event) {
        System.out.println("onShortCastleEndByRook");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());
    }

    @Override
    public void onLongCastleBeginByKing(ChessBoardEvent event) {
        System.out.println("onLongCastleBeginByKing");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());

        int rook_from_square = event.getLongCastleRookFromSquare();
        int rook_to_square = event.getLongCastleRookToSquare();

        event.getPlayer().localMove(PieceName.rook, rook_from_square, rook_to_square);
        this.animatePiece(rook_from_square, rook_to_square);
    }

    @Override
    public void onLongCastleEndByRook(ChessBoardEvent event) {
        System.out.println("onLongCastleEndByRook");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());
    }

}
