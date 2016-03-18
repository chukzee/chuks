/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.chess3d;

import com.jme3.asset.AssetManager;
import com.jme3.math.FastMath;
import com.jme3.scene.Spatial;
import naija.game.client.chess.PieceName;
import static naija.games.chess3d.ChessModelType.PIECES_A;
import static naija.games.chess3d.ChessModelType.PIECES_B;
import static naija.games.chess3d.ChessModelType.PIECES_C;
import static naija.games.chess3d.ChessModelType.PIECES_D;

/**
 *
 * @author USER
 */
public class ChessPieceModels {

    private Spatial pawn;
    private Spatial rook;
    private Spatial knight;
    private Spatial bishop;
    private Spatial queen;
    private Spatial king;
    //the y offset correction is the correction to add to the model y posiotion
    //so it can stand exactly on the board. the offset correction is as a result of the
    //fact that some models y postion is not 0.0f by default from the modelling software
    //thus making the model not stand on the board as expected.
    private float pawn_y_offset_correction = 0.0f;
    private float rook_y_offset_correction = 0.0f;
    private float knight_y_offset_correction = 0.0f;
    private float bishop_y_offset_correction = 0.0f;
    private float queen_y_offset_correction = 0.0f;
    private float king_y_offset_correction = 0.0f;

    public ChessPieceModels(AssetManager assetMngr, ChessModelType type) {
        String dir = "naija/games/assets/chess/models/";

        float scale = 1.0f;//NOTE THIS WILL VARY DEPENDING ON THE IMPORTED MODELS - SEE NEXT LINE BELOW
        float knight_deg_rotation = 0.0f;
        switch (type) {
            case PIECES_A: {
                dir += "pieces_a/";
                scale = 0.35f;
                knight_deg_rotation = -90.0f;
                pawn_y_offset_correction = 0.5f;
                rook_y_offset_correction = 0.0f;
                knight_y_offset_correction = 0.6f;
                bishop_y_offset_correction = 0.0f;
                queen_y_offset_correction = 0.0f;
                king_y_offset_correction = 0.0f;
            }
            break;
            case PIECES_B: {
                dir += "pieces_b/";
                scale = 0.35f;//NOT TESTED
                knight_deg_rotation = 0.0f;//NOT TESTED
                pawn_y_offset_correction = 0.0f;//NOT TESTED
                rook_y_offset_correction = 0.0f;//NOT TESTED
                knight_y_offset_correction = 0.0f;//NOT TESTED
                bishop_y_offset_correction = 0.0f;//NOT TESTED
                queen_y_offset_correction = 0.0f;//NOT TESTED
                king_y_offset_correction = 0.0f;//NOT TESTED
            }
            break;
            case PIECES_C: {
                dir += "pieces_c/";
                scale = 0.35f;//NOT TESTED
                knight_deg_rotation = 0.0f;//NOT TESTED
                pawn_y_offset_correction = 0.0f;//NOT TESTED
                rook_y_offset_correction = 0.0f;//NOT TESTED
                knight_y_offset_correction = 0.0f;//NOT TESTED
                bishop_y_offset_correction = 0.0f;//NOT TESTED
                queen_y_offset_correction = 0.0f;//NOT TESTED
                king_y_offset_correction = 0.0f;//NOT TESTED
            }
            break;
            case PIECES_D: {
                dir += "pieces_d/";
                scale = 0.35f;//NOT TESTED
                knight_deg_rotation = 0.0f;//NOT TESTED
                pawn_y_offset_correction = 0.0f;//NOT TESTED
                rook_y_offset_correction = 0.0f;//NOT TESTED
                knight_y_offset_correction = 0.0f;//NOT TESTED
                bishop_y_offset_correction = 0.0f;//NOT TESTED
                queen_y_offset_correction = 0.0f;//NOT TESTED
                king_y_offset_correction = 0.0f;//NOT TESTED
            }
            break;

        }

        pawn = assetMngr.loadModel(dir + "pawn_smooth.blend");
        bishop = assetMngr.loadModel(dir + "bishop_smooth.blend");
        knight = assetMngr.loadModel(dir + "knight_smooth.blend");
        rook = assetMngr.loadModel(dir + "rook_smooth.blend");
        queen = assetMngr.loadModel(dir + "queen_smooth.blend");
        king = assetMngr.loadModel(dir + "king_smooth.blend");

        pawn.setLocalScale(scale);
        bishop.setLocalScale(scale);
        knight.setLocalScale(scale);
        rook.setLocalScale(scale);
        queen.setLocalScale(scale);
        king.setLocalScale(scale);

        //rotate the knight
        knight.rotate(0.0f, knight_deg_rotation * FastMath.DEG_TO_RAD, 0.0f);


    }

    Spatial getClonedPawn() {
        return pawn.clone();
    }

    Spatial getClonedRook() {
        return rook.clone();
    }

    Spatial getClonedKnight() {
        return knight.clone();
    }

    Spatial getClonedBishop() {
        return bishop.clone();
    }

    Spatial getClonedQueen() {
        return queen.clone();
    }

    Spatial getClonedKing() {
        return king.clone();
    }

    float getPawnOffsetY() {
        return this.pawn_y_offset_correction;
    }

    float getRookOffsetY() {
        return this.rook_y_offset_correction;
    }

    float getKnightOffsetY() {
        return this.knight_y_offset_correction;
    }

    float getBishopOffsetY() {
        return this.bishop_y_offset_correction;
    }

    float getQueenOffsetY() {
        return this.queen_y_offset_correction;
    }

    float getKingOffsetY() {
        return this.king_y_offset_correction;
    }

    Spatial getClone(PieceName name) {
        switch (name) {
            case king:
                return getClonedKing();
            case queen:
                return getClonedQueen();
            case rook:
                return getClonedRook();
            case bishop:
                return getClonedBishop();
            case knight:
                return getClonedKnight();
            case pawn:
                return getClonedPawn();

        }

        return null;
    }
}
