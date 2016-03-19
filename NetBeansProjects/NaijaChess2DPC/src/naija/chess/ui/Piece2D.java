/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.chess.ui;

import naija.game.client.chess.PieceName;
import java.awt.Image;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Piece2D {

    private Image image;
    private int square;
    private PieceName name;
    private boolean is_white;
    private boolean is_captured;
    private boolean is_picked;
    private boolean is_animating;
    private int capture_square = -1;

    private Piece2D() {

    }

    public Piece2D(PieceName name, boolean is_white, int square, Image image) {
        this.name = name;
        this.is_white = is_white;
        this.square = square;
        this.image = image;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public int getSquare() {
        return square;
    }

    public int getCaptureSquare() {
        return capture_square;
    }

    public void setSquare(int square) {
        this.square = square;
    }

    public PieceName getName() {
        return name;
    }

    public void setName(PieceName name) {
        this.name = name;
    }

    public boolean isCaptured() {
        return is_captured;
    }

    public boolean isWhite() {
        return is_white;
    }

    public void setIsCaptured(boolean is_captured) {
        if (is_captured) {
            capture_square = square < 0 || square > 63 ? -1 : square;
            square = -1;
        } else {
            square = capture_square;
        }
        
        this.is_captured = is_captured;
    }

    public void setIsPicked(boolean is_picked) {
        this.is_picked = is_picked;
        if (is_picked) {
            is_animating = false;
        }
    }

    public boolean isPicked() {
        return this.is_picked;
    }

    void setIsAnimating(boolean is_animating) {
        this.is_animating = is_animating;
        if (is_animating) {
            is_picked = false;
        }
    }

    public boolean isAnimating() {
        return this.is_animating;
    }

}
