/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games;

import com.jme3.app.SimpleApplication;
import com.jme3.light.AmbientLight;
import com.jme3.light.DirectionalLight;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.texture.Texture;

/**
 *
 * @author USER
 */
public abstract class View3D {

    private float z_len_fac = 0.5f;
    private float z_pos_look_at = 0.0f;
    private float cam_x_pos = 0.0f;
    private float cam_y_pos = 7.0f;
    private float cam_z_pos = 3.0f;
    private final Camera cam;
    private final Node rootNode;
    private DirectionalLight dl;

    public View3D(Camera cam, Node rootNode) {
        this.cam = cam;
        this.rootNode = rootNode;

    }

    protected abstract void createView(SimpleApplication app);

    protected abstract float getGameViewBoundSize();

    protected Camera getCamera() {
        return this.cam;
    }

    protected void resetView() {
        float view_bound = getGameViewBoundSize();
        z_len_fac = 0.5f;
        z_pos_look_at = -z_len_fac * view_bound;//somewhere on the board plane along z axis

        cam_z_pos = view_bound / 2;
        cam_y_pos = view_bound + 1;

        //getCamera().setLocation(new Vector3f(0f, 4f, -3f));//TESTING
        //getCamera().lookAt(new Vector3f(0.0f, 1.0f, z_pos_look_at), Vector3f.UNIT_Y);//TESTING
        getCamera().setLocation(new Vector3f(cam_x_pos, cam_y_pos, cam_z_pos));//uncomment later
        getCamera().lookAt(new Vector3f(0.0f, 1.0f, z_pos_look_at), Vector3f.UNIT_Y);//uncomment later

    }

    protected void lightUpTheScene() {
        ColorRGBA lightColor = ColorRGBA.White;
        rootNode.addLight(this.getDirectionalLight(new Vector3f(0, -0.5f, 0.0f), lightColor));
        //make light brigter
        AmbientLight al = new AmbientLight();
        al.setColor(lightColor.mult(1.3f));//makes the light brighter
        //rootNode.addLight(al);
    }

    protected DirectionalLight getDirectionalLight(Vector3f directionVector3f, ColorRGBA lightColor) {
        if (dl == null) {
            dl = new DirectionalLight();
        }
        dl.setDirection(directionVector3f.normalizeLocal());
        dl.setColor(lightColor);
        return dl;
    }

    protected void camMoveLeft(float change) {
    }

    protected void camMoveRight(float change) {
    }

    protected void camMoveUp(float change) {
    }

    protected void camMoveDown(float change) {
    }

    /**
     * Show Top orthogonal view of the scene
     *
     */
    protected void camTopOrtho() {
        z_len_fac = 0.5f;
        z_pos_look_at = -z_len_fac * getGameViewBoundSize();//somewhere on the board plane along z axis

        getCamera().setLocation(new Vector3f(0.0f, 10.0f, -getGameViewBoundSize() / 2));
        getCamera().lookAt(new Vector3f(0.0f, 1.0f, z_pos_look_at), Vector3f.UNIT_Y);

    }

    /**
     * This is used to shift view by moving the camera up to make the objects
     * smaller and then move the camera further to the right to make the view
     * pan to the left<br>
     * This is required if the right panel is shown.
     *
     *
     */
    protected void setViewLeft() {
    }

    /**
     * This is used to shift view by moving the camera up to make the objects
     * smaller and then move the camera further to the left to make the view pan
     * to the right<br>
     * This is required if the left panel is shown.
     *
     *
     */
    protected void setViewRight() {
    }

    /**
     * This is used to shift view by moving the camera up to make the objects
     * smaller and then move the camera to the center of the view<br>
     * This is required if the left and right panel is shown.
     *
     *
     */
    protected void setViewCenter() {
    }

    protected Node getRootNode() {
        return this.rootNode;
    }
}
