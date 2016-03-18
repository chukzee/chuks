/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.controls.Controller;
import de.lessvoid.nifty.controls.NiftyControl;
import de.lessvoid.nifty.controls.Parameters;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.input.NiftyInputEvent;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.tools.SizeValue;
import java.util.List;

/**
 *
 * @author USER
 */
public class ScrollPanelController implements de.lessvoid.nifty.controls.Controller {

    private Element element;
    private Element base_panel_handle;
    private Element up_arrow;
    private Element horizontal_slide_bar;
    private Element vertical_slide_bar;
    private Element horizontal_left_track;
    private Element horizontal_right_track;
    private Element vertical_up_track;
    private Element vertical_down_track;
    private int arrow_step = 20;
    private int track_step = arrow_step * 4;
    private int content_Y = 0;
    private Element base_panel;
    private int content_X = 0;
    private int children_count;
    private int content_width;
    private Element horizontal_track;
    private Element vertical_track;
    private boolean isHDrag;
    private boolean isVDrag;
    private int prevDragY;
    private int prevDragX;

    public ScrollPanelController() {
    }

    enum Slide {

        UP, DOWN, LEFT, RIGHT
    }

    public void bind(Nifty nifty, Screen screen, Element elmnt, Parameters prmtrs) {
        this.element = elmnt;

        base_panel_handle = this.element.findElementById("content_container_handle");//
        base_panel = this.element.findElementById("content_container");//
        up_arrow = this.element.findElementById("up_arrow_control");
        horizontal_track = this.element.findElementById("vertical_track");
        horizontal_track = this.element.findElementById("horizontal_track");
        horizontal_left_track = this.element.findElementById("horizontal_left_track");
        horizontal_right_track = this.element.findElementById("horizontal_right_track");
        vertical_track = this.element.findElementById("vertical_track");
        vertical_up_track = this.element.findElementById("vertical_up_track");
        vertical_down_track = this.element.findElementById("vertical_down_track");
        horizontal_slide_bar = this.element.findElementById("horizotal_slide_bar");
        vertical_slide_bar = this.element.findElementById("vertical_slide_bar");

    }

    public void init(Parameters prmtrs) {
    }

    public void onStartScreen() {
    }

    public void onFocus(boolean bln) {
    }

    public boolean inputEvent(NiftyInputEvent nie) {

        return true;
    }

    private int getWidth() {
        return this.element.getWidth() - this.up_arrow.getWidth();
    }

    private int getHeight() {
        return this.element.getHeight() - this.up_arrow.getHeight();
    }

    private int normalizeY(int y) {
        int upper_limit = this.getHeight() - this.base_panel.getHeight();
        int lower_limit = 0;
        if (y > lower_limit) {
            return 0;
        }

        if (y < upper_limit) {
            return upper_limit;
        }

        return y;
    }

    private int normalizeX(int x) {
        int left_limit = this.getWidth() - base_panel.getWidth();
        int right_limit = 0;

        if (x < left_limit) {
            return left_limit;
        }

        if (x > right_limit) {
            return 0;
        }

        return x;
    }

    private void repaintHorizontalBar() {

        int hrz_sliderX = horizontal_slide_bar.getConstraintX().getValueAsInt(horizontal_slide_bar.getParent().getWidth());
        int hrz_track_width = horizontal_track.getWidth();

        this.horizontal_left_track.setConstraintWidth(SizeValue.px(hrz_sliderX));
        this.horizontal_left_track.setConstraintX(SizeValue.px(0));
        horizontal_left_track.getParent().layoutElements();//recalculate layout

        this.horizontal_right_track.setConstraintWidth(SizeValue.px(hrz_track_width - hrz_sliderX - horizontal_slide_bar.getWidth()));
        this.horizontal_right_track.setConstraintX(SizeValue.px(hrz_sliderX + horizontal_slide_bar.getWidth()));
        horizontal_right_track.getParent().layoutElements();//recalculate layout

        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

    }

    private void repaintVerticalBar() {

        int vtc_sliderY = vertical_slide_bar.getConstraintY().getValueAsInt(vertical_slide_bar.getParent().getHeight());
        int vtc_track_height = vertical_track.getHeight();

        this.vertical_up_track.setConstraintHeight(SizeValue.px(vtc_sliderY));
        this.vertical_up_track.setConstraintY(SizeValue.px(0));
        vertical_up_track.getParent().layoutElements();//recalculate layout

        this.vertical_down_track.setConstraintHeight(SizeValue.px(vtc_track_height - vtc_sliderY - vertical_slide_bar.getHeight()));
        this.vertical_down_track.setConstraintY(SizeValue.px(vtc_sliderY + vertical_slide_bar.getHeight()));
        vertical_down_track.getParent().layoutElements();//recalculate layout

        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

    }

    public boolean onClickUpArrow() {

        System.out.println("onClickUpArrow()");
        System.out.println("before up current_Y" + content_Y);

        moveVerticalSlider(Slide.UP, content_Y, arrow_step);

        content_Y += this.arrow_step;
        content_Y = normalizeY(content_Y);
        base_panel_handle.setConstraintY(SizeValue.px(content_Y));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout


        System.out.println("after up current_Y" + content_Y);

        return true;
    }

    public boolean onClickDownArrow() {

        System.out.println("onClickDownArrow()");
        System.out.println("before down current_Y" + content_Y);

        moveVerticalSlider(Slide.DOWN, content_Y, arrow_step);

        content_Y -= this.arrow_step;
        content_Y = normalizeY(content_Y);
        base_panel_handle.setConstraintY(SizeValue.px(content_Y));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

        System.out.println("after down current_Y" + content_Y);


        return true;
    }

    public boolean onClickLeftArrow() {
        System.out.println("onClickLeftArrow()");
        System.out.println("onClickLeftArrow() befor x = " + content_X);

        moveHorizontallider(Slide.LEFT, content_X, arrow_step);

        content_X += this.arrow_step;
        content_X = normalizeX(content_X);
        base_panel_handle.setConstraintX(SizeValue.px(content_X));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout


        System.out.println("onClickLeftArrow() after x = " + content_X);

        return true;
    }

    public boolean onClickRightArrow() {
        System.out.println("onClickRightArrow()");
        System.out.println("onClickRightArrow() before x = " + content_X);

        moveHorizontallider(Slide.RIGHT, content_X, arrow_step);

        content_X -= this.arrow_step;
        content_X = normalizeX(content_X);
        base_panel_handle.setConstraintX(SizeValue.px(content_X));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

        System.out.println("onClickRightArrow() after x = " + content_X);

        return true;
    }

    public boolean onClickHorizontalLeftTrack() {

        moveHorizontallider(Slide.LEFT, content_X, track_step);

        content_X += this.track_step;
        content_X = normalizeX(content_X);
        base_panel_handle.setConstraintX(SizeValue.px(content_X));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout


        System.out.println("onClickHorizontalLeftTrack()");

        return true;
    }

    public boolean onClickHorizontalRightTrack() {

        moveHorizontallider(Slide.RIGHT, content_X, track_step);

        content_X -= this.track_step;
        content_X = normalizeX(content_X);
        base_panel_handle.setConstraintX(SizeValue.px(content_X));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout


        System.out.println("onClickHorizontalRightTrack()");

        return true;
    }

    public boolean onClickVerticalUpTrack() {

        moveVerticalSlider(Slide.UP, content_Y, track_step);

        content_Y += this.track_step;
        content_Y = normalizeY(content_Y);
        base_panel_handle.setConstraintY(SizeValue.px(content_Y));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

        System.out.println("onClickVerticalUpTrack()");

        return true;
    }

    public boolean onClickVerticalDownTrack() {

        moveVerticalSlider(Slide.DOWN, content_Y, track_step);

        content_Y -= this.track_step;
        content_Y = normalizeY(content_Y);
        base_panel_handle.setConstraintY(SizeValue.px(content_Y));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

        System.out.println("onClickVerticalDownTrack()");

        return true;
    }

    public boolean onDragVerticalSlideBar(int x, int y) {

        System.out.println("onDragVerticalSlideBar()");

        if (!isVDrag) {
            prevDragY = y;
            isVDrag = true;
            System.out.println("isVDrag = " + isVDrag + " y = " + y);
            return true;
        }

        int diff_y = y - prevDragY;

        prevDragY = y;

        System.out.println("diff_y = " + diff_y + " y = " + y);

        int ph = vertical_slide_bar.getParent().getHeight();
        int v_slide_bar_y = this.vertical_slide_bar.getConstraintY().getValueAsInt(ph);
        int bar_new_y = v_slide_bar_y + diff_y;



        bar_new_y = this.normalizeSlideYPos(bar_new_y);

        this.vertical_slide_bar.setConstraintY(SizeValue.px(bar_new_y));

        repaintVerticalBar();

        System.out.println("bar_new_y = " + bar_new_y);

        if (bar_new_y == 0) {
            this.content_Y = 0;
            this.base_panel_handle.setConstraintY(SizeValue.px(content_Y));
            base_panel_handle.getParent().layoutElements();
            System.out.println("if bar_new_y = " + bar_new_y);
            return true;
        }

        int scroll_y_limit = this.vertical_track.getHeight() - this.vertical_slide_bar.getHeight();
        int content_y_limit = this.getHeight() - this.base_panel.getHeight();

        if (bar_new_y == scroll_y_limit) {
            this.content_Y = content_y_limit;
            this.base_panel_handle.setConstraintY(SizeValue.px(content_Y));
            base_panel_handle.getParent().layoutElements();
            System.out.println("if bar_new_y = " + bar_new_y + "  if bar_new_y = " + bar_new_y);
            return true;
        }


        double scroll_ratio = (double) bar_new_y / scroll_y_limit;//cast to double to get correct ratio

        content_Y = (int) (scroll_ratio * content_y_limit);
        this.base_panel_handle.setConstraintY(SizeValue.px(content_Y));
        base_panel_handle.getParent().layoutElements();

        System.out.println("scroll_ratio = " + scroll_ratio + " content_y_limit = " + content_y_limit + " content_Y = " + content_Y);

        return true;
    }

    public boolean onDragHorizontalSlideBar(int x, int y) {
        System.out.println("onDragHorizontalSlideBar()");

        if (!isHDrag) {
            prevDragX = x;
            isHDrag = true;
            return true;
        }

        int diff_x = x - prevDragX;

        prevDragX = x;

        int pw = horizontal_slide_bar.getParent().getWidth();
        int h_slide_bar_x = this.horizontal_slide_bar.getConstraintX().getValueAsInt(pw);
        int bar_new_x = h_slide_bar_x + diff_x;

        bar_new_x = this.normalizeSlideXPos(bar_new_x);

        this.horizontal_slide_bar.setConstraintX(SizeValue.px(bar_new_x));

        repaintHorizontalBar();

        if (bar_new_x == 0) {
            this.content_X = 0;
            this.base_panel_handle.setConstraintX(SizeValue.px(content_X));
            base_panel_handle.getParent().layoutElements();
            return true;
        }

        int scroll_x_limit = this.horizontal_track.getWidth() - this.horizontal_slide_bar.getWidth();
        int content_x_limit = this.getWidth() - this.base_panel.getWidth();

        if (bar_new_x == scroll_x_limit) {
            this.content_X = content_x_limit;
            this.base_panel_handle.setConstraintX(SizeValue.px(content_X));
            base_panel_handle.getParent().layoutElements();
            return true;
        }


        double scroll_ratio = (double) bar_new_x / scroll_x_limit;//cast to double to get correct ratio

        content_X = (int) (scroll_ratio * content_x_limit);
        this.base_panel_handle.setConstraintX(SizeValue.px(content_X));
        base_panel_handle.getParent().layoutElements();

        return true;
    }

    public boolean onReleaseVerticalSlideBar() {
        isVDrag = false;
        return true;
    }

    public boolean onReleaseHorizontalSlideBar() {
        isHDrag = false;
        return true;
    }

    private int normalizeSlideYPos(int v_slide_bar_y) {
        int scroll_limit = this.vertical_track.getHeight() - this.vertical_slide_bar.getHeight();
        if (v_slide_bar_y < 0) {
            return 0;
        } else if (v_slide_bar_y > scroll_limit) {
            return scroll_limit;
        }

        return v_slide_bar_y;
    }

    private int normalizeSlideXPos(int h_slide_bar_x) {
        int scroll_limit = this.horizontal_track.getWidth() - this.horizontal_slide_bar.getWidth();
        if (h_slide_bar_x < 0) {
            return 0;
        } else if (h_slide_bar_x > scroll_limit) {
            return scroll_limit;
        }

        return h_slide_bar_x;
    }

    private void moveVerticalSlider(Slide slide, int init_y, int step) {

        int ph = vertical_slide_bar.getParent().getHeight();
        int v_slide_bar_y = this.vertical_slide_bar.getConstraintY().getValueAsInt(ph);


        switch (slide) {
            case UP: {
                double up_gap = v_slide_bar_y;
                double factor = up_gap / Math.abs(init_y);
                int r_track_step = (int) (factor * step);
                v_slide_bar_y -= r_track_step;

            }
            break;
            case DOWN: {
                double down_gap = this.vertical_track.getHeight() - v_slide_bar_y - this.vertical_slide_bar.getHeight();
                double factor = down_gap / (this.base_panel.getHeight() - this.getHeight() - Math.abs(init_y));
                int r_track_step = (int) (factor * step);
                v_slide_bar_y += r_track_step;

            }
            break;
        }

        v_slide_bar_y = normalizeSlideYPos(v_slide_bar_y);
        vertical_slide_bar.setConstraintY(SizeValue.px(v_slide_bar_y));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

        repaintVerticalBar();

    }

    private void moveHorizontallider(Slide slide, int init_x, int step) {

        int pw = horizontal_slide_bar.getParent().getWidth();
        int h_slide_bar_x = this.horizontal_slide_bar.getConstraintX().getValueAsInt(pw);


        switch (slide) {
            case LEFT: {
                double left_gap = h_slide_bar_x;
                double factor = left_gap / Math.abs(init_x);
                int r_track_step = (int) (factor * step);
                h_slide_bar_x -= r_track_step;

            }
            break;
            case RIGHT: {
                double right_gap = this.horizontal_track.getWidth() - h_slide_bar_x - this.horizontal_slide_bar.getWidth();
                double factor = right_gap / (base_panel.getWidth() - this.getWidth() - Math.abs(init_x));
                int r_track_step = (int) (factor * step);
                h_slide_bar_x += r_track_step;

            }
            break;
        }

        h_slide_bar_x = normalizeSlideXPos(h_slide_bar_x);
        horizontal_slide_bar.setConstraintX(SizeValue.px(h_slide_bar_x));
        base_panel_handle.getParent().layoutElements();//recaculate child elements layout

        repaintHorizontalBar();

    }

    public static void main(String args[]) {
        int n = 3;
        int m = 2;
        double r = (double) n / m;
        System.out.println(r);
    }
}
