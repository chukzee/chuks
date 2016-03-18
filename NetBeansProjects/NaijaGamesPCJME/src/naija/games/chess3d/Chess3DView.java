/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.chess3d;

import naija.games.View3D;
import com.jme3.app.SimpleApplication;
import com.jme3.asset.AssetManager;
import com.jme3.audio.AudioNode;
import com.jme3.bounding.BoundingBox;
import com.jme3.collision.CollisionResult;
import com.jme3.collision.CollisionResults;
import com.jme3.font.BitmapFont;
import com.jme3.font.BitmapText;
import com.jme3.input.InputManager;
import com.jme3.input.MouseInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.MouseButtonTrigger;
import com.jme3.light.DirectionalLight;
import com.jme3.light.Light;
import com.jme3.light.LightList;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Ray;
import com.jme3.math.Vector2f;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.scene.shape.Box;
import com.jme3.scene.shape.Quad;
import com.jme3.texture.Texture;
import com.jme3.ui.Picture;
import de.lessvoid.nifty.tools.Color;
import java.util.Iterator;
import java.util.concurrent.Callable;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import naija.game.client.BoardEvent;
import naija.game.client.BoardPosition;
import naija.game.client.Player;
import naija.game.client.Side;
import naija.game.client.chess.ChessBoardEvent;
import naija.game.client.chess.ChessBoardListener;
import naija.game.client.chess.ChessPlayer;
import naija.game.client.chess.PieceName;
import static naija.game.client.chess.PieceName.bishop;
import static naija.game.client.chess.PieceName.knight;
import static naija.game.client.chess.PieceName.queen;
import static naija.game.client.chess.PieceName.rook;
import naija.game.client.chess.board.ChessBoardPosition;
import naija.game.client.chess.board.Constants;
import naija.game.client.chess.board.PieceDescription;
import naija.game.client.chess.util.ChessUtil;
import static naija.games.chess3d.ChessModelType.PIECES_A;
import static naija.games.chess3d.ChessModelType.PIECES_B;

/**
 *
 * @author USER
 */
public class Chess3DView extends View3D implements ChessBoardListener, ActionListener {

    private String white_texture_file;
    private String black_texture_file;
    private ColorRGBA white_color_name;
    private ColorRGBA black_color_name;
    private boolean is_white_turn;
    private String board_texture_name;
    private String board_model_name;
    private ChessModelType piece_model_type;
    private ChessModelType board_base_model_type;
    private float board_outer_size = 6.0f;
    private float board_border_size = 0.0f;
    private float board_inner_size = board_outer_size - board_border_size;
    private Piece3D[] pieces3d = new Piece3D[32];
    private Texture black_texture;
    private Texture white_texture;
    private Material board_mat;
    private Material black_pce_mat;
    private Material white_pce_mat;
    final public String boardName = "board";
    final Node pickableNode = new Node();//holds the chess board
    final private String PICK_PIECE = "PICK_PICK";
    private InputManager inputManager;
    static private Geometry board_plane;
    final private int SELECT_PIECE = 10;
    final private int MOVE_SELECTED_PIECE = 12;
    private int expectedInteraction = SELECT_PIECE;
    private int from_square = -1;
    private Piece3D selectedPiece;
    static private float tallestPieceHeight;
    static private AudioNode captureSound;
    static private AudioNode opponentMoveSound;
    static private AudioNode selfMoveSound;
    static private AudioNode gameOverSound;
    private boolean isStarted;
    private ChessPlayer turnPlayer;
    private boolean isWhiteTurn;
    private boolean isLocalPlayerTurn;
    private boolean isLocalPlayerWhite;
    SimpleApplication app;
    private BitmapText scoreDisplay;
    private Picture white_player_image;
    private Picture black_palyer_image;
    private BitmapText blackPlayerName;
    private BitmapText whitePlayerName;
    private Vector2f prev_mouse_pos = new Vector2f();
    private int prev_mouse_square = Constants.NOTHING;
    private Geometry square_highligt;
    private Geometry selection_highligt;
    static private Spatial board_base;
    private ChessPieceModels models;
    private DirectionalLight modelLight;

    private Chess3DView() {
        super(null, null);
    }

    private Chess3DView(Builder builder) {

        super(builder.app.getCamera(), builder.app.getRootNode());
        app = builder.app;
        white_texture_file = builder.white_texture_file;
        black_texture_file = builder.black_texture_file;
        white_color_name = builder.white_color_name;
        black_color_name = builder.black_color_name;
        is_white_turn = builder.is_white_turn;
        board_texture_name = builder.board_texture_name;
        board_model_name = builder.board_model_name;
        piece_model_type = builder.piece_model_type;
        board_base_model_type = builder.board_base_model_type;

        createView(builder.app);
        inputManager = builder.app.getInputManager();
        inputManager.addListener(this, new String[]{PICK_PIECE});
        inputManager.addMapping(PICK_PIECE, new MouseButtonTrigger(MouseInput.BUTTON_LEFT));

    }

    Piece3D getPiece(int index) {
        return this.pieces3d[index];
    }

    Piece3D[] getPieces() {
        return this.pieces3d;
    }

    PieceName getPieceName(int index) {
        return this.pieces3d[index].getName();
    }

    Node getPickableNode() {
        return this.pickableNode;
    }

    static public float tallestPieceHeight() {
        return tallestPieceHeight;
    }

    public void initializeBoardPosition(final ChessBoardPosition board_position, Player... players) {
        //final ChessBoardPosition chess_board_position = (ChessBoardPosition) board_position;

        app.enqueue(new Callable() {
            public Object call() throws Exception {
                arrangePieceModels(board_position);
                return null;
            }
        });
    }

    public void onRobotMove(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        //animate piece while disabling piece picking
        handleMoveAnimation(e);

        System.out.println("robot reply - " + e.getMoveNotation());
        System.out.println(e.printBoard());

    }

    public void onRemotePlayerMove(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        //animate piece while disabling piece picking
        handleMoveAnimation(e);

        System.out.println("remote player reply - " + e.getMoveNotation());
        System.out.println(e.printBoard());

    }

    public void onLocalPlayerMove(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        System.out.println("local player reply - " + e.getMoveNotation());

        this.handleMoveAnimation(e);
    }

    public void onShortCastleBeginByKing(ChessBoardEvent event) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        System.out.println("onShortCastleBeginByKing");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());

        int king_from_square = event.getShortCastleKingFromSquare();
        int king_to_square = event.getShortCastleKingToSquare();

        this.animatePiece(king_from_square, king_to_square, null);

        int rook_from_square = event.getShortCastleRookFromSquare();
        int rook_to_square = event.getShortCastleRookToSquare();

        event.getPlayer().localMove(PieceName.rook, rook_from_square, rook_to_square);
    }

    public void onShortCastleEndByRook(ChessBoardEvent event) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        System.out.println("onShortCastleEndByRook");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());

        int rook_from_square = event.getShortCastleRookFromSquare();
        int rook_to_square = event.getShortCastleRookToSquare();

        this.animatePiece(rook_from_square, rook_to_square, null);
    }

    public void onLongCastleBeginByKing(ChessBoardEvent event) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        System.out.println("onLongCastleBeginByKing");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());

        int king_from_square = event.getLongCastleKingFromSquare();
        int king_to_square = event.getLongCastleKingToSquare();

        this.animatePiece(king_from_square, king_to_square, null);

        int rook_from_square = event.getLongCastleRookFromSquare();
        int rook_to_square = event.getLongCastleRookToSquare();

        event.getPlayer().localMove(PieceName.rook, rook_from_square, rook_to_square);

    }

    public void onLongCastleEndByRook(ChessBoardEvent event) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        System.out.println("onLongCastleEndByRook");
        System.out.println("local player reply - " + event.getMoveNotation());
        System.out.println(event.printBoard());

        int rook_from_square = event.getLongCastleRookFromSquare();
        int rook_to_square = event.getLongCastleRookToSquare();

        this.animatePiece(rook_from_square, rook_to_square, null);
    }

    public void onNextTurn(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        System.out.println("onNextTurn");
        isStarted = true;
        turnPlayer = e.getTurnPlayer();
        isWhiteTurn = turnPlayer.isWhite();

        isLocalPlayerTurn = turnPlayer.isLocalPlayer();

        if (turnPlayer.isLocalPlayer()) {
            isLocalPlayerWhite = turnPlayer.isWhite();
        } else {
            isLocalPlayerWhite = !turnPlayer.isWhite();//opposite
        }
    }

    public void onGameOver(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

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

        //Play Game Over sound

        //Piece3D.ANIMATION_DURATION;
        int attempts = 4;
        float sub_anim_dur = Piece3D.ANIMATION_DURATION / attempts;

        for (int i = 0; i < attempts; i++) {
            if (!isAnyPieceAnimating()) {
                app.enqueue(new Callable() {
                    public Object call() throws Exception {
                        playGameOverSound();
                        return null;
                    }
                });
                break;
            }
            try {
                Thread.sleep((long) (sub_anim_dur * 1000));
            } catch (InterruptedException ex) {
                Logger.getLogger(Chess3DView.class.getName()).log(Level.SEVERE, null, ex);
            }

        }


    }

    public void onInvalidMove(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc


        int illegal_from_sq = e.getIllegalMoveFromSquare();
        int illegal_to_sq = e.getIllegalMoveToSquare();

        //pieceOnFocus.setSquare(illegal_from_sq);
        //repaint();

        String msg = e.getMessage();

        System.err.println(msg);

    }

    public void onError(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        //COME BACK FOR BETTER IMPLEMENTATION
        String msg = e.getMessage();

        System.err.println(msg);
    }

    public void onInvalidTurn(ChessBoardEvent e) {
        //REMIND: Use enqueue to modify the scene - by jME3  doc

        String msg = "Not your turn! It's " + (e.getCurrentTurn() == Side.white ? "white's turn." : "black's turn.");
        System.out.println(msg);

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
            Piece3D pce = this.getPieceOnSquare(en_passant_capture_square);
            this.animatePiece(from_square, to_square, pce);

        } else if (event.isLongCastle()) {

            int king_from_square = event.getLongCastleKingFromSquare();
            int king_to_square = event.getLongCastleKingToSquare();
            this.animatePiece(king_from_square, king_to_square, null);

            int rook_from_square = event.getLongCastleRookFromSquare();
            int rook_to_square = event.getLongCastleRookToSquare();
            this.animatePiece(rook_from_square, rook_to_square, null);

        } else if (event.isShortCastle()) {

            int king_from_square = event.getShortCastleKingFromSquare();
            int king_to_square = event.getShortCastleKingToSquare();
            this.animatePiece(king_from_square, king_to_square, null);

            int rook_from_square = event.getShortCastleRookFromSquare();
            int rook_to_square = event.getShortCastleRookToSquare();
            this.animatePiece(rook_from_square, rook_to_square, null);

        } else {

            this.animatePiece(from_square, to_square, null);
        }

    }

    private void doPromotion(boolean is_white, PieceName name, int from_square,
            int to_square) {

        this.animatePiece(from_square, to_square, null);// animate the piece

        final Piece3D pce = this.getPieceOnSquare(to_square);
        pce.setName(name);

        float sq_x = getSquareX(to_square);
        float sq_y = pce.YBase();
        float sq_z = getSquareZ(to_square);
        final Vector3f sqVector3f = new Vector3f(sq_x, sq_y, sq_z);
        Piece3D promo_pce = null;
        switch (name) {
            case queen:
                promo_pce = getPieceByName(queen, is_white);
                break;
            case rook:
                promo_pce = getPieceByName(rook, is_white);
                break;
            case bishop:
                promo_pce = getPieceByName(bishop, is_white);
                break;
            case knight:
                promo_pce = getPieceByName(knight, is_white);
                break;
        }

        final Piece3D promo_piece = promo_pce;

        app.enqueue(new Callable() {
            public Object call() throws Exception {
                if (promo_piece != null) {

                    Spatial cloned_model = promo_piece.getModel().clone();
                    Node parent = pce.getModel().getParent();
                    pce.getModel().removeFromParent();//remove the old pawn model
                    parent.attachChild(cloned_model);
                    pce.setModel(cloned_model);
                    cloned_model.setLocalTranslation(sqVector3f);
                }
                return null;
            }
        });

        //this.repaint();//re-paint to reflect the changes due to promotion
    }

    void animatePiece(int from_sq, int to_sq, Piece3D enpasant_pce_capture) {
        final Piece3D pce = this.getPieceOnSquare(from_sq);
        final Piece3D capture_pce = enpasant_pce_capture != null
                ? enpasant_pce_capture
                : this.getPieceOnSquare(to_sq);

        if (pce == null) {
            return;
        }

        pce.setSquare(to_sq);//new piece square

        final float x = this.getSquareX(to_sq);
        final float z = this.getSquareZ(to_sq);
        final ChessSound sound;
        if (isLocalPlayerWhite == pce.isWhite()) {
            sound = ChessSound.SELF_MOVE_SOUND;
        } else {
            sound = ChessSound.OPPONENT_MOVE_SOUND;
        }

        /*if (capture_pce != null) {
         //sound = ChessSound.CAPTURE_SOUND;//NO NEED. see doAnitmation() method where the capture is detected and CAPTURE_SOUND played
         }*/

        app.enqueue(new Callable() {
            public Object call() throws Exception {
                pce.moveTo(x, z, capture_pce, sound);//will also detect if there is a capture and will ChessSound.CAPTURE_SOUND - see doAnitmation() method
                return null;
            }
        });

    }

    Piece3D getPieceByName(PieceName name, boolean is_white) {
        for (int i = 0; i < this.pieces3d.length; i++) {
            if (this.pieces3d[i].getName().equals(name)
                    && this.pieces3d[i].isWhite() == is_white) {
                return this.pieces3d[i];
            }
        }

        return null;
    }

    Piece3D getPieceOnSquare(int square) {
        for (int i = 0; i < this.pieces3d.length; i++) {
            if (this.pieces3d[i].getSquare() == square) {
                return this.pieces3d[i];
            }
        }

        return null;
    }

    boolean isAnyPieceAnimating() {
        for (int i = 0; i < this.pieces3d.length; i++) {
            if (this.pieces3d[i].isAnimating()) {
                return true;
            }
        }

        return false;
    }

    Piece3D getWhitePieceOnSquare(int square) {
        for (int i = 0; i < this.pieces3d.length; i++) {
            if (this.pieces3d[i].getSquare() == square && pieces3d[i].isWhite()) {
                return this.pieces3d[i];
            }
        }

        return null;
    }

    Piece3D getBlackPieceOnSquare(int square) {
        for (int i = 0; i < this.pieces3d.length; i++) {
            if (this.pieces3d[i].getSquare() == square && pieces3d[i].isBlack()) {
                return this.pieces3d[i];
            }
        }

        return null;
    }

    protected void createView(SimpleApplication app) {
        createChessBoard(app);
        initializeChessPieces();
        configChessSound(app);
        guiNodeDisplay();

        app.getRootNode().attachChild(pickableNode);//add the pickable node to root node

        //position the camera and set light to the scene
        resetView();

        modelLight = this.getDirectionalLight(Vector3f.ZERO, ColorRGBA.White);

        for (int i = 0; i < pieces3d.length; i++) {
            Spatial model = this.pieces3d[i].getModel();
            decoratePieceModel(this.pieces3d[i].getModel(), this.pieces3d[i].isWhite());
            //add light to the models
            model.addLight(modelLight);
        }

        lightUpTheScene();

    }

    @Override
    protected float getGameViewBoundSize() {
        return board_outer_size;
    }

    private float getBoardInnerSize() {
        return this.board_outer_size - this.board_border_size;
    }

    private void createChessBoard(SimpleApplication app) {

        createBoardPlane(app);
        loadBoardBase(app);
        createSquareHighliters();
        createBoardLabels();

    }

    private void createBoardPlane(SimpleApplication app) {
        Quad quad = new Quad(board_outer_size, board_outer_size);
        board_plane = new Geometry(boardName, quad); // using Quad object
        board_mat = new Material(app.getAssetManager(),
                "Common/MatDefs/Light/Lighting.j3md");
        Texture texture = app.getAssetManager().loadTexture(board_texture_name);
        board_mat.setTexture("DiffuseMap", texture);
        board_mat.setTexture("SpecularMap", texture);
        board_mat.setFloat("Shininess", 5f);
        board_plane.setMaterial(board_mat);

        pickableNode.attachChild(board_plane);//add to pickable node

        //move the board to the desired location
        board_plane.setLocalTranslation(-board_outer_size / 2, 0, 0);

        //orientate the board horizontally
        board_plane.rotate(-FastMath.DEG_TO_RAD * 90, 0, 0);

    }

    private void loadBoardBase(SimpleApplication app) {
        //REMIND: the board base will not be added to the pickableNode but the root node since it is not pickable by design

        String file = "naija/games/assets/chess/models/board/";

        float scale = 1.0f;//NOTE THIS WILL VARY DEPENDING ON THE IMPORTED MODELS - SEE NEXT LINE BELOW
        switch (this.board_base_model_type) {
            case BOARD_BASE_A: {
                file += "board_base_a.blend";
                scale = 1.0f;
            }
            break;
            case BOARD_BASE_B: {
                file += "board_base_a.blend";
                scale = 1.0f;
            }
            break;
            case BOARD_BASE_C: {
                file += "board_base_a.blend";
                scale = 1.0f;
            }
            break;
            case BOARD_BASE_D: {
                file += "board_base_a.blend";
                scale = 1.0f;
            }
            break;

        }

        board_base = app.getAssetManager().loadModel(file);
        board_base.setLocalScale(scale);
        Material mat = new Material(app.getAssetManager(),
                "Common/MatDefs/Light/Lighting.j3md");

        mat.setColor("Diffuse", ColorRGBA.Brown);
        mat.setColor("Specular", ColorRGBA.Brown);
        mat.setFloat("Shininess", 3.0f);
        board_base.setMaterial(mat);
        //board_base.center();
        BoundingBox bbox = (BoundingBox) board_base.getWorldBound();

        float clearance = 0.01f;// just to make the board plane visible

        float x = 0.0f;
        float y = -bbox.getYExtent() * 2 - clearance;
        float z = -this.getBoardInnerSize() / 2;

        board_base.setLocalTranslation(x, y, z);


        app.getRootNode().attachChild(board_base);

    }

    private void createSquareHighliters() {
        float square_size = this.getBoardInnerSize() / 8;
        float extra_size = square_size * 0.00f;
        float highlight_size = square_size + extra_size; //importnat! must be slightly better square size

        Quad quad = new Quad(highlight_size, highlight_size);
        square_highligt = new Geometry("SquareHighlight", quad); // using Quad object
        Material mat = board_mat.clone();
        mat.setColor("Diffuse", ColorRGBA.Blue);
        mat.setColor("Specular", ColorRGBA.Cyan);
        mat.setFloat("Shininess", 3f);
        square_highligt.setMaterial(mat);

        app.getRootNode().attachChild(square_highligt);

        //move the geometry to the desired location
        float hide_y = this.board_plane.getLocalTranslation().getY() - 0.01f;
        float z = -this.getBoardInnerSize() / 2;//mid
        square_highligt.setLocalTranslation(0, hide_y, z);

        //orientate the geometry horizontally
        square_highligt.rotate(-FastMath.DEG_TO_RAD * 90, 0, 0);

        quad = new Quad(square_size, square_size);
        selection_highligt = new Geometry("Selection Highlight", quad); // using Quad object
        mat = board_mat.clone();
        mat.setColor("Diffuse", ColorRGBA.Orange);
        mat.setColor("Specular", ColorRGBA.Gray);
        mat.setFloat("Shininess", 3f);
        selection_highligt.setMaterial(mat);

        app.getRootNode().attachChild(selection_highligt);

        //move the geometry to the desired location
        selection_highligt.setLocalTranslation(0, hide_y, z);

        //orientate the geometry horizontally
        selection_highligt.rotate(-FastMath.DEG_TO_RAD * 90, 0, 0);

    }

    private void createBoardLabels() {
        /*BitmapFont guiFont = app.getAssetManager().loadFont("Interface/Fonts/Default.fnt");
         BitmapText ch = new BitmapText(guiFont, false);
         ch.setSize(guiFont.getCharSet().getRenderedSize());

         ch.setText("CHUKS");

         ch.setColor(new ColorRGBA(1f,0.8f,0.3f,0.8f));
         //app.getRootNode().attachChild(ch);
         app.getGuiNode().attachChild(ch);*/
    }

    /**
     * For display score , white player name and image on the left and black
     * player name and image on the right. This will also be used to display
     * Game Over image in the center of screen when the game is over.
     *
     */
    private void guiNodeDisplay() {

        /**
         * Write text on the screen (HUD)
         */
        //app.getGuiNode().detachAllChildren();
        BitmapFont guiFont = app.getAssetManager().loadFont("Interface/Fonts/Default.fnt");
        scoreDisplay = new BitmapText(guiFont, false);
        scoreDisplay.setSize(guiFont.getCharSet().getRenderedSize());
        scoreDisplay.setText("Score: 0 - 0");
        scoreDisplay.setLocalTranslation(400, 450, 0);//COME BACK TO SET PROPERLY
        app.getGuiNode().attachChild(scoreDisplay);

        white_player_image = new Picture("White Player Pics");
        white_player_image.setImage(app.getAssetManager(), "naija/games/images/BVN_54.png", true);
        white_player_image.setWidth(35);
        white_player_image.setHeight(35);
        white_player_image.setLocalTranslation(250, 450, 0);//COME BACK TO SET PROPERLY
        app.getGuiNode().attachChild(white_player_image);

        whitePlayerName = new BitmapText(guiFont, false);
        whitePlayerName.setSize(guiFont.getCharSet().getRenderedSize());
        whitePlayerName.setText("James A.");
        whitePlayerName.setLocalTranslation(250, 400, 0);//COME BACK TO SET PROPERLY
        app.getGuiNode().attachChild(whitePlayerName);


        black_palyer_image = new Picture("Black Player Pics");
        black_palyer_image.setImage(app.getAssetManager(), "naija/games/images/BVN_54.png", true);
        black_palyer_image.setWidth(35);
        black_palyer_image.setHeight(35);
        black_palyer_image.setLocalTranslation(600, 450, 0);//COME BACK TO SET PROPERLY
        app.getGuiNode().attachChild(black_palyer_image);


        blackPlayerName = new BitmapText(guiFont, false);
        blackPlayerName.setSize(guiFont.getCharSet().getRenderedSize());
        blackPlayerName.setText("Shebu T.");
        blackPlayerName.setLocalTranslation(600, 400, 0);//COME BACK TO SET PROPERLY
        app.getGuiNode().attachChild(blackPlayerName);
    }

    private void initializeChessPieces() {

        if (models == null) {
            models = new ChessPieceModels(app.getAssetManager(), this.piece_model_type);
        }

        Piece3D.staticRefresh();//important for every re-arranging of the chess board for a fresh game

        //create white pieces
        for (int pce_index = 0; pce_index < pieces3d.length; pce_index++) {
            boolean is_white = pce_index < 16 ? true : false;

            int n;
            if (pce_index < 8 || pce_index > 23) {
                if (pieces3d[pce_index] == null) {
                    pieces3d[pce_index] = createPiece(is_white, pce_index);
                }
            } else {
                if (pieces3d[pce_index] == null) {
                    pieces3d[pce_index] = createPiece(is_white, pce_index);//pawn
                } else if (!pieces3d[pce_index].getName().equals(PieceName.pawn)) {//if promoted
                    //first hold the previous model in a variable - we need it briefly
                    Spatial prev_model = pieces3d[pce_index].getModel();//promotion piece like queen, rook, bishop or knight/
                    //remove the previous model from its parent
                    prev_model.removeFromParent();
                    //remove the promotion
                    pieces3d[pce_index] = createPiece(is_white, pce_index);//pawn - remove promotion
                    decoratePieceModel(pieces3d[pce_index].getModel(), is_white);
                    //get the light previous model if any and assign to the new one
                    Iterator<Light> l = prev_model.getLocalLightList().iterator();
                    while (l.hasNext()) {
                        pieces3d[pce_index].getModel().addLight(l.next());
                    }
                }
            }

        }

    }

    private Piece3D createPiece(boolean is_white, int pce_index) {

        int n = pce_index < 8 ? pce_index : pce_index - 24;

        PieceName name;
        Spatial pce;
        float y_offset;
        switch (n) {
            case 0:
                name = PieceName.rook;
                pce = models.getClonedRook();
                y_offset = models.getRookOffsetY();
                break;
            case 1:
                name = PieceName.knight;
                pce = models.getClonedKnight();
                y_offset = models.getKnightOffsetY();
                break;
            case 2:
                name = PieceName.bishop;
                pce = models.getClonedBishop();
                y_offset = models.getBishopOffsetY();
                break;
            case 3:
                name = PieceName.queen;
                pce = models.getClonedQueen();
                y_offset = models.getQueenOffsetY();
                break;
            case 4:
                name = PieceName.king;
                pce = models.getClonedKing();
                y_offset = models.getKingOffsetY();
                break;
            case 5:
                name = PieceName.bishop;
                pce = models.getClonedBishop();
                y_offset = models.getBishopOffsetY();
                break;
            case 6:
                name = PieceName.knight;
                pce = models.getClonedKnight();
                y_offset = models.getKnightOffsetY();
                break;
            case 7:
                name = PieceName.rook;
                pce = models.getClonedRook();
                y_offset = models.getRookOffsetY();
                break;
            default:
                name = PieceName.pawn;
                pce = models.getClonedPawn();
                y_offset = models.getPawnOffsetY();
        }

        //now rotate black knight to face white or face opposite direction as the case may be
        if (name == PieceName.knight && !is_white) {
            pce.rotate(0.0f, 180 * FastMath.DEG_TO_RAD, 0.0f);
        }

        BoundingBox bb = (BoundingBox) pce.getWorldBound();
        if (tallestPieceHeight < bb.getYExtent()) {
            tallestPieceHeight = bb.getYExtent();
        }

        //pickableNode.attachChild(pce);//add to pickable node
        app.getRootNode().attachChild(pce);
        return new Piece3D(pce, name, Constants.NOTHING, is_white, y_offset);
    }

    private void decoratePieceModel(Spatial pce, boolean is_white) {

        boolean matWasNull = false;
        if (is_white) {
            if (white_pce_mat == null) {
                white_pce_mat = new Material(app.getAssetManager(),
                        "Common/MatDefs/Light/Lighting.j3md");
                matWasNull = true;
            }
            //set white material
            if (this.white_color_name != null) {
                if (!matWasNull) {
                    pce.setMaterial(white_pce_mat);
                } else {
                    setColor(pce, white_pce_mat, this.white_color_name);
                }
            } else {
                if (!matWasNull) {
                    pce.setMaterial(white_pce_mat);
                } else {
                    setTexture(app, pce, white_pce_mat, this.white_texture_file);
                }
            }
        } else {

            if (black_pce_mat == null) {
                black_pce_mat = new Material(app.getAssetManager(),
                        "Common/MatDefs/Light/Lighting.j3md");
                matWasNull = true;
            }
            //set black material
            if (this.black_color_name != null) {
                if (!matWasNull) {
                    pce.setMaterial(black_pce_mat);
                } else {
                    setColor(pce, black_pce_mat, this.black_color_name);
                }
            } else {
                if (!matWasNull) {
                    pce.setMaterial(black_pce_mat);
                } else {
                    setTexture(app, pce, black_pce_mat, this.black_texture_file);
                }
            }
        }
    }

    private void configChessSound(SimpleApplication app) {

        captureSound = new AudioNode(app.getAssetManager(), "naija/games/assets/chess/sound/capture.wav");
        selfMoveSound = new AudioNode(app.getAssetManager(), "naija/games/assets/chess/sound/move_self.wav");
        opponentMoveSound = new AudioNode(app.getAssetManager(), "naija/games/assets/chess/sound/move_opponent.wav");
        gameOverSound = new AudioNode(app.getAssetManager(), "naija/games/assets/chess/sound/game_over.wav");

        captureSound.setReverbEnabled(false);
        selfMoveSound.setReverbEnabled(false);
        opponentMoveSound.setReverbEnabled(false);
        gameOverSound.setReverbEnabled(false);

    }

    public static void playCaptureSound() {
        captureSound.play();
    }

    public static void playSelfMoveSound() {
        selfMoveSound.play();
    }

    public static void playOpponentMoveSound() {
        opponentMoveSound.play();
    }

    public static void playGameOverSound() {
        gameOverSound.play();
    }

    private void setTexture(SimpleApplication app, Spatial pce, Material mat, String texture_name) {
        Texture texture = null;
        if (texture_name.equals(this.black_texture_file)) {
            if (black_texture == null) {
                black_texture = app.getAssetManager().loadTexture(texture_name);
            }
            texture = black_texture;

        } else {
            if (white_texture == null) {
                white_texture = app.getAssetManager().loadTexture(texture_name);
            }
            texture = white_texture;
        }

        mat.setTexture("DiffuseMap", texture);
        mat.setTexture("SpecularMap", texture);
        mat.setFloat("Shininess", 3f);
        pce.setMaterial(mat);
    }

    private void setColor(Spatial pce, Material mat, ColorRGBA color_name) {

        mat.setColor("Diffuse", color_name);
        mat.setColor("Specular", color_name);
        mat.setFloat("Shininess", 3f);
        pce.setMaterial(mat);
    }

    public void changePieceTextureAppearance(String white_texture_name, String black_texture_name) {
        //first initialize
        initializeMaterial();

        for (int i = 0; i < pieces3d.length; i++) {
            if (pieces3d[i].isWhite()) {
                //TODO change the appearance
            } else {
                //TODO change the appearance
            }
        }

        //TODO change the appearance
    }

    public void changePieceColorAppearance(ColorRGBA white_color_name, ColorRGBA black_color_name) {
        //first initialize
        initializeMaterial();

        //TODO change the appearance

        for (int i = 0; i < pieces3d.length; i++) {
            if (pieces3d[i].isWhite()) {
                //TODO change the appearance
            } else {
                //TODO change the appearance
            }
        }
    }

    private void initializeMaterial() {
        this.black_texture = null;
        this.white_texture = null;
    }

    private void arrangePieceModels(ChessBoardPosition chess_board_position) {

        //REMIND : consider the case of promotion to restore back the pawn models. 
        //also consider the case of model that was remove from parent - OR I MAY AVOID REMOVING models from parent instead translate far of the scene


        initializeChessPieces();

        Vector3f vector3f = new Vector3f();

        for (int sq = 0; sq < 64; sq++) {

            PieceDescription piece_desc = chess_board_position.getPieceDescription(sq);
            if (piece_desc == null) {
                continue;//no piece
            }

            PieceName name = piece_desc.getPieceName();
            boolean is_white = piece_desc.isWhite();

            for (int k = 0; k < pieces3d.length; k++) {
                if (pieces3d[k].getName().equals(name)
                        && pieces3d[k].isWhite() == is_white
                        && pieces3d[k].getSquare() == Constants.NOTHING) {
                    pieces3d[k].setSquare(sq);
                    vector3f = getSquareVector3f(sq, pieces3d[k].YBase(), vector3f);
                    pieces3d[k].getModel().setLocalTranslation(vector3f);
                    break;
                }
            }

        }

        //TODO consider promotion

        //arrange piece captured
        for (int i = 0; i < pieces3d.length; i++) {
            if (pieces3d[i].getSquare() == Constants.NOTHING) {
                pieces3d[i].captureMe();
                break;
            }
        }

    }

    private void setModel(Piece3D pce, PieceName name) {

        Spatial model = models.getClone(name);
        if (pce.getModel() != null) {
            Iterator<Light> l = pce.getModel().getLocalLightList().iterator();
            while (l.hasNext()) {
                model.addLight(l.next());
            }
        }


        //rotate the black knight to face the white
        if (name == PieceName.knight && pce.isBlack()) {
            model.rotate(0.0f, 180 * FastMath.DEG_TO_RAD, 0.0f);
        }

        decoratePieceModel(model, pce.isWhite());

        pce.setModel(model);

    }

    private Vector3f getSquareVector3f(int square, float y_base, Vector3f vector3f) {
        float x = getSquareX(square);
        float z = getSquareZ(square);

        vector3f.setX(x);
        vector3f.setY(y_base);
        vector3f.setZ(z);
        return vector3f;

    }

    private float getSquareX(int square) {
        float inner_size = this.getBoardInnerSize();
        float left_edge_x = board_plane.getWorldTranslation().getX() + this.board_border_size;
        float square_size = inner_size / 8;
        float x = left_edge_x + square_size / 2 + ChessUtil.getColumnIndex(square) * square_size;
        return x;
    }

    private float getSquareZ(int square) {
        float inner_size = this.getBoardInnerSize();
        float front_edge_z = board_plane.getWorldTranslation().getZ() - this.board_border_size;
        float square_size = inner_size / 8;
        float z = front_edge_z - square_size / 2 - ChessUtil.getRowIndex(square) * square_size;
        return z;
    }

    static Spatial getBoardBase() {
        return board_base;
    }

    static Geometry getBoardPlane() {
        return board_plane;
    }

    void handleBoardInteraction(PickXZ pick_xz) {

        System.out.println("Square " + pick_xz.getSquare());
        System.out.println("expectedInteraction " + expectedInteraction);

        if (pick_xz.getPiece() != null) {
            System.out.println(pick_xz.getPiece().getName());

            //check if the local player picked his own piece
            if (!this.isLocalPlayerTurn) {
                System.out.println("can not pick opponent piece!");
                return;
            }

            if (pick_xz.getPiece().isWhite() != this.isWhiteTurn) {
                System.out.println("not your turn!");
                return;
            }
        }

        float tiny_extra = 0.00f;
        float x = pick_xz.getCornerLeftX() - tiny_extra;
        float z = pick_xz.getCornerZ() + tiny_extra;
        this.selection_highligt.setLocalTranslation(x, 0.02f, z);


        if (expectedInteraction == SELECT_PIECE && pick_xz.getPiece() != null) {
            System.out.println("done " + expectedInteraction);

            from_square = pick_xz.getSquare();
            selectedPiece = pick_xz.getPiece();
            expectedInteraction = this.MOVE_SELECTED_PIECE;

            System.out.println("new expectedInteraction " + expectedInteraction);

            return;
        }

        if (expectedInteraction == MOVE_SELECTED_PIECE) {
            System.out.println("done " + expectedInteraction);

            this.turnPlayer.localMove(selectedPiece.getName(), from_square, pick_xz.getSquare());

            expectedInteraction = this.SELECT_PIECE;

            System.out.println("new expectedInteraction " + expectedInteraction);
        }


    }

    public void onAction(String name, boolean isPressed, float tpf) {

        System.out.println("value " + isPressed + " tpf " + tpf);

        if (name.equals(PICK_PIECE) && !isPressed) {
            PickXZ pick = new PickXZ();
            if (pick.isObjectSelection()) {
                handleBoardInteraction(pick);
            }
        }


    }

    void highlightSquareOnBoard() {

        Vector2f mouse_pos = app.getInputManager().getCursorPosition();
        if (prev_mouse_pos != null) {
            if (mouse_pos.getX() == prev_mouse_pos.getX()
                    && mouse_pos.getY() == prev_mouse_pos.getY()) {
                return;// no mouse position change
            }
        }

        prev_mouse_pos.set(mouse_pos);

        PickXZ pick = new PickXZ();

        if (pick.getSquare() == prev_mouse_square) {
            return;
        }

        prev_mouse_square = pick.getSquare();


        if (!pick.isObjectSelection()) {
            this.square_highligt.setLocalTranslation(0, -0.1f, -this.getBoardInnerSize() / 2);//hide
            return;
        }


        //at this point the mouse is on different square
        float tiny_extra = 0.00f;
        float x = pick.getCornerLeftX() - tiny_extra;
        float z = pick.getCornerZ() + tiny_extra;

        this.square_highligt.setLocalTranslation(x, 0.01f, z);

    }

    class PickXZ {

        private float x;
        private float z;
        private float center_x;
        private float center_z;
        private Piece3D pce;
        private int square;
        private boolean isSelected;
        private final float bx;
        private final float bz;
        private final float square_size;

        PickXZ() {

            Vector3f origin = getCamera().getWorldCoordinates(inputManager.getCursorPosition(), 0.0f);
            Vector3f direction = getCamera().getWorldCoordinates(inputManager.getCursorPosition(), 0.3f);
            direction.subtractLocal(origin).normalizeLocal();

            Ray ray = new Ray(origin, direction);

            CollisionResults results = new CollisionResults();
            pickableNode.collideWith(ray, results);

            for (int i = 0; i < results.size(); i++) {
                String hit = results.getCollision(i).getGeometry().getName();
                Spatial p = results.getCollision(i).getGeometry();

                if (hit.equals(boardName)) {
                    Vector3f point = results.getCollision(i).getContactPoint();
                    x = point.getX();
                    z = point.getZ();
                    isSelected = true;
                    break;
                }
            }

            //calculate the square

            Vector3f b_trans = board_plane.getWorldTranslation();
            bx = b_trans.getX();
            bz = b_trans.getZ();
            float x_diff = Math.abs(x - bx);
            float z_diff = Math.abs(z - bz);
            square_size = getBoardInnerSize() / 8;
            int col = (int) (x_diff / square_size);
            int row = (int) (z_diff / square_size);

            square = ChessUtil.getSquare(row, col);

            //calculate center_x and center_z
            center_x = bx + col * square_size + square_size / 2;//toward positive axiz
            center_z = bz - (row * square_size + square_size / 2);//toward negative axis

            pce = getPieceOnSquare(square);

        }

        Piece3D getPiece() {
            return pce;
        }

        float getX() {
            return x;
        }

        float getZ() {
            return z;
        }

        float getCenterX() {
            return center_x;
        }

        float getCenterZ() {
            return center_z;
        }

        float getCornerLeftX() {
            return bx + square_size * ChessUtil.getColumnIndex(square);
        }

        float getCornerRightX() {
            return getCornerLeftX() + square_size;
        }

        float getCornerZ() {
            return bz - square_size * ChessUtil.getRowIndex(square);
        }

        int getSquare() {
            return square;
        }

        private boolean isObjectSelection() {
            return this.isSelected;
        }
    }

    public static class Builder {

        private String white_texture_file;
        private String black_texture_file;
        private ColorRGBA white_color_name;
        private ColorRGBA black_color_name;
        private boolean is_white_turn;
        private String board_texture_name;
        private String board_model_name;
        private SimpleApplication app;
        private ChessModelType piece_model_type = ChessModelType.PIECES_A; //default
        private ChessModelType board_base_model_type = ChessModelType.BOARD_BASE_A;//default

        public Builder whitePieceTexture(String texture_file) {
            this.white_texture_file = texture_file;
            return this;
        }

        public Builder whitePieceColor(ColorRGBA color_name) {
            this.white_color_name = color_name;
            return this;
        }

        public Builder blackPieceTexture(String texture_file) {
            this.black_texture_file = texture_file;
            return this;
        }

        public Builder blackPieceColor(ColorRGBA color_name) {
            this.black_color_name = color_name;
            return this;
        }

        public Builder whiteTurn(boolean is_white) {
            is_white_turn = is_white;
            return this;
        }

        public Builder boardTexture(String boardTexture) {
            this.board_texture_name = boardTexture;
            return this;
        }

        public Builder boardModelName(String board_model_name) {
            this.board_model_name = board_model_name;
            return this;
        }

        public Builder pieceModelType(ChessModelType pce_model_type) {
            this.piece_model_type = pce_model_type;
            return this;
        }

        public Builder boardBaseModelType(ChessModelType board_base_model_type) {
            this.board_base_model_type = board_base_model_type;
            return this;
        }

        public Builder SimpleApplication(SimpleApplication app) {
            this.app = app;
            return this;
        }

        public Chess3DView build() {
            return new Chess3DView(this);
        }
    }
}
