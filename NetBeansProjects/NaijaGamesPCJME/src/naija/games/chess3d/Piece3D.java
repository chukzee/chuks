/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.chess3d;

import com.jme3.animation.LoopMode;
import com.jme3.bounding.BoundingBox;
import com.jme3.cinematic.MotionPath;
import com.jme3.cinematic.MotionPathListener;
import com.jme3.cinematic.events.MotionEvent;
import com.jme3.cinematic.events.MotionTrack;
import com.jme3.math.Spline.SplineType;
import com.jme3.math.Vector3f;
import com.jme3.scene.Spatial;
import naija.game.client.PieceName;
import naija.game.client.chess.board.Constants;
import static naija.games.chess3d.ChessSound.SELF_MOVE_SOUND;

/**
 *
 * @author USER
 */
public class Piece3D {

    private Spatial piece_model;
    private boolean is_captured;
    private PieceName pieceName;
    private boolean is_white;
    private int square = Constants.NOTHING;
    private float y_offset;
    private boolean is_animating;
    public static final float ANIMATION_DURATION = 1.5f;
    private float last_capture_z = Integer.MAX_VALUE;
    private float min_capture_z = Integer.MAX_VALUE;
    private float max_capture_z = Integer.MIN_VALUE;
    static private int white_capture_count;
    static private int black_capture_count;
            
    private Piece3D() {
    }

    public Piece3D(Spatial piece_model, PieceName pieceName, int square, boolean is_white, float y_offset) {

        this.piece_model = piece_model;
        this.pieceName = pieceName;
        this.is_white = is_white;
        this.square = square;
        this.y_offset = y_offset;
    }

    /**call this when the piece is arranged for a different game
     * 
     */
    public static void staticRefresh(){
        white_capture_count = 0;
        black_capture_count = 0;
    }
    
    public int getSquare() {
        return square;
    }

    public void setSquare(int sq) {
        square = sq;
    }

    /**
     * mainly used to disable animation of other pieces if this one is in motion
     *
     * @return
     */
    public boolean isAnimating() {
        return is_animating;
    }

    public void moveTo(float x, float z, Piece3D captured, ChessSound sound) {
        move(new Vector3f(x, this.YBase(), z), captured, sound, true);
    }

    public void moveTo(Vector3f vector3f, Piece3D captured, ChessSound sound) {
        move(vector3f, captured, sound, true);
    }

    private void move(Vector3f vector3f, Piece3D captured, ChessSound sound, boolean do_animation) {
        if (do_animation) {
            //do animation to destination
            doAnitmation(vector3f, captured, sound);
        } else {
            //instant move 
            if (vector3f != null) {
                this.piece_model.setLocalTranslation(vector3f);
            } else {
                //TODO - captue - remove from the board
            }
        }
    }

    public void captureMe() {
        this.is_captured = true;
        move(null, null, null, false);
        square = Constants.NOTHING;//meaning captured
        positionCapturedPiece();
    }

    public boolean isCaptured() {
        return this.is_captured;
    }

    Spatial getModel() {
        return piece_model;
    }

    public boolean isWhite() {
        return this.is_white;
    }

    public boolean isBlack() {
        return !this.is_white;
    }

    public float YBase() {
        return this.y_offset;
    }

    public PieceName getName() {
        return this.pieceName;
    }

    private void doAnitmation(final Vector3f endPoint, final Piece3D captured, final ChessSound sound) {

        is_animating = true;
        Vector3f startPoint = piece_model.getWorldTranslation();
        //calculate the intermediary points
        Vector3f midPoint1 = new Vector3f();
        midPoint1.interpolate(startPoint, endPoint, 0.25f);
        midPoint1.setY(y_offset + Chess3DView.tallestPieceHeight() * 0.5f);

        Vector3f midPoint2 = new Vector3f();
        midPoint2.interpolate(startPoint, endPoint, 0.7f);

        midPoint1.setY(y_offset + Chess3DView.tallestPieceHeight() * 0.2f);

        System.out.println("startPoint " + startPoint);

        System.out.println("midPoint1 " + midPoint1);

        System.out.println("midPoint2 " + midPoint2);

        System.out.println("endPoint " + endPoint);

        final MotionPath path = new MotionPath();

        path.addWayPoint(startPoint);//start point
        path.addWayPoint(midPoint1);
        path.addWayPoint(midPoint2);
        path.addWayPoint(endPoint);//destination

        path.setPathSplineType(SplineType.CatmullRom);

        path.setCurveTension(0.8f);
        path.setCycle(false);
        //path.enableDebugShape(assetManager, rootNode);

        MotionEvent motionControl = new MotionEvent(this.piece_model, path);
        motionControl.setDirectionType(MotionEvent.Direction.None);
        motionControl.setInitialDuration(ANIMATION_DURATION);
        //motionControl.setSpeed(4);//come back   
        motionControl.play();
        motionControl.setLoopMode(LoopMode.DontLoop);

        path.addListener(new MotionPathListener() {
            public void onWayPointReach(MotionEvent motionControl, int wayPointIndex) {

                is_animating = false;

                if (wayPointIndex == path.getNbWayPoints() - 1) {//end of animation
                    //play chess sound here
                    piece_model.setLocalTranslation(endPoint);//finish off the move since the intepolation does not get the exact point
                    switch (sound) {
                        case SELF_MOVE_SOUND:
                            Chess3DView.playSelfMoveSound();
                            break;
                        case OPPONENT_MOVE_SOUND:
                            Chess3DView.playOpponentMoveSound();
                            break;
                        default:
                            Chess3DView.playGameOverSound();//game over
                            break;
                    }

                }

                if (captured != null) {
                    if (wayPointIndex == path.getNbWayPoints() - 2) {
                        Chess3DView.playCaptureSound();
                        captured.captureMe();
                    }
                }

            }
        });
    }

    public void setName(PieceName name) {
        this.pieceName = name;
    }

    public void setModel(Spatial cloned_model) {
        this.piece_model = cloned_model;
    }

    private void positionCapturedPiece() {
        float x = 0;
        float y = 0;
        float z = 0;
        Vector3f vector3f;
        
        vector3f = Chess3DView.getBoardPlane().getWorldTranslation();
        BoundingBox bb = (BoundingBox)Chess3DView.getBoardPlane().getWorldBound();

        if (last_capture_z == Integer.MAX_VALUE) {
            z = (vector3f.getZ() - bb.getZExtent())/2;
        }else{
            z = last_capture_z;
        }

        
        if(this.is_white){
            
        }else{
            
        }
        
        last_capture_z = z;
        
        if(z < min_capture_z){
            min_capture_z = z;
        }
        
        if(z > max_capture_z){
            max_capture_z = z;
        }
    }
}
