/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.EndNotify;
import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.builder.ControlBuilder;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.layout.manager.VerticalLayout;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.tools.SizeValue;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import naija.games.gui.builder.scroll.ScrollPanelDefinitionBuilder;

/**
 *
 * @author USER
 */
public class ScrollPanelControl {

    private Nifty nifty;
    private Screen screen;
    private Element parent;
    private final String horizontal_scrollbar = "horizontal_scrollbar";
    private final String vertical_scrollbar = "vertical_scrollbar";
    private final String scrollpanel = "scrollpanel";
    private final String scrollpanel_id = "scrollpanel_id";
    private Element scrollPanel;
    private Element horizontalSlider;
    private Element verticalSlider;
    private Element currentContent;
    private Element contentPanel;
    private int children_count;
    private int content_width;
    private double initial_width;
    private double initial_height;
    private int MINIMUM_SLIDER_SIZE = 7;
    private double initial_horizontal_slider_width;
    private double initial_vertical_slider_height;
    private Element verticalUpTrack;
    private Element verticalDownTrack;
    private Element horizontalLeftTrack;
    private Element horizontalRightTrack;
    private Element verticalTrack;
    private Element horizontalTrack;

    private ScrollPanelControl() {
    }

    public ScrollPanelControl(Nifty nifty, Screen screen, Element parent) {

        this.nifty = nifty;
        this.screen = screen;
        this.parent = parent;

        new ScrollPanelDefinitionBuilder(scrollpanel, parent, 0)
                .registerControlDefintion(nifty);

        scrollPanel = new ControlBuilder(scrollpanel_id, scrollpanel)
                .build(nifty, screen, parent);

        horizontalSlider = scrollPanel
                .findElementById("horizotal_slide_bar");

        initial_horizontal_slider_width = horizontalSlider.getWidth();


        verticalSlider = scrollPanel
                .findElementById("vertical_slide_bar");

        initial_vertical_slider_height = verticalSlider.getHeight();

        verticalTrack = scrollPanel
                .findElementById("vertical_track");
        
        verticalUpTrack = scrollPanel
                .findElementById("vertical_up_track");

        verticalDownTrack = scrollPanel
                .findElementById("vertical_down_track");
        

        horizontalTrack = scrollPanel
                .findElementById("horizontal_track");
                
        
        horizontalLeftTrack = scrollPanel
                .findElementById("horizontal_left_track");

        horizontalRightTrack = scrollPanel
                .findElementById("horizontal_right_track");
        
        contentPanel = scrollPanel
                .findElementById("content_container");

        
        initial_width = contentPanel.getWidth();
        initial_height = contentPanel.getHeight();
    }

    public void addElement(ControlBuilder builder, Nifty nifty, Screen screen) {

        Element element = builder.build(nifty, screen, contentPanel);

        modifyContentPanelWidth(element);
        modifySliderSize();
    }

    public void addElement(Element element) {

        contentPanel.addChild(element);

        modifyContentPanelWidth(element);
        modifySliderSize();
    }

    /**
     * call this method if an element is removed from the scroll panel
     *
     */
    public void revalidate() {

        if (children_count != contentPanel.getChildrenCount()) {
            children_count = contentPanel.getChildrenCount();
            List<Element> lstChd = contentPanel.getChildren();
            content_width = (int) initial_width;
            for (int i = 0; i < children_count; i++) {
                Element e = lstChd.get(i);
                if (initial_width < e.getWidth()) {
                    if (content_width < e.getWidth()) {
                        content_width = e.getWidth();
                    }
                }
            }
        }

        contentPanel.setWidth(content_width);
        modifySliderSize();
    }

    Element findElementById(String comment_id) {
        return this.contentPanel.findElementById(comment_id);
    }

    private void modifyContentPanelWidth(Element element) {
        if (contentPanel.getWidth() < element.getWidth()) {
            contentPanel.setWidth(element.getWidth());
        }
    }

    private void modifySliderSize() {
        modifyVerticalBar();
        modifyHorizontalBar();
        contentPanel.getParent().layoutElements();//important! force recalculation of the layout.
    }

    private void modifyHorizontalBar() {
        double factor = this.initial_width / this.contentPanel.getWidth();
        int new_h_slider_width = (int) (factor * initial_horizontal_slider_width);

        if (new_h_slider_width < this.MINIMUM_SLIDER_SIZE) {
            new_h_slider_width = MINIMUM_SLIDER_SIZE;
        } else if (new_h_slider_width > this.initial_horizontal_slider_width) {
            new_h_slider_width = (int) initial_horizontal_slider_width;
        }

        this.horizontalSlider.setConstraintWidth(SizeValue.px(new_h_slider_width));
        horizontalSlider.getParent().layoutElements();//recalculate layout

        int hrz_sliderX =horizontalSlider.getConstraintX().getValueAsInt(horizontalSlider.getParent().getWidth());
        int hrz_track_width = horizontalTrack.getWidth();
        
        this.horizontalLeftTrack.setConstraintWidth(SizeValue.px(hrz_sliderX));
        this.horizontalLeftTrack.setConstraintX(SizeValue.px(0));
        horizontalLeftTrack.getParent().layoutElements();//recalculate layout
        
        this.horizontalRightTrack.setConstraintWidth(SizeValue.px(hrz_track_width - hrz_sliderX - new_h_slider_width));
        this.horizontalRightTrack.setConstraintX(SizeValue.px( hrz_sliderX + new_h_slider_width));
        horizontalRightTrack.getParent().layoutElements();//recalculate layout
        
    }

    private void modifyVerticalBar() {
        double factor = this.initial_height / this.contentPanel.getHeight();
        int new_v_slider_height = (int) (factor * initial_vertical_slider_height);

        if (new_v_slider_height < this.MINIMUM_SLIDER_SIZE) {
            new_v_slider_height = MINIMUM_SLIDER_SIZE;
        } else if (new_v_slider_height > this.initial_vertical_slider_height) {
            new_v_slider_height = (int) initial_vertical_slider_height;
        }

        this.verticalSlider.setConstraintHeight(SizeValue.px(new_v_slider_height));
        verticalSlider.getParent().layoutElements();//recalculate layout

        int vtc_sliderY =verticalSlider.getConstraintY().getValueAsInt(verticalSlider.getParent().getHeight());
        int vtc_track_height = verticalTrack.getHeight();
        
        this.verticalUpTrack.setConstraintHeight(SizeValue.px(vtc_sliderY));
        this.verticalUpTrack.setConstraintY(SizeValue.px(0));
        verticalUpTrack.getParent().layoutElements();//recalculate layout
        
        this.verticalDownTrack.setConstraintHeight(SizeValue.px(vtc_track_height - vtc_sliderY - new_v_slider_height));
        this.verticalDownTrack.setConstraintY(SizeValue.px(vtc_sliderY + new_v_slider_height));
        verticalDownTrack.getParent().layoutElements();//recalculate layout
        
    }
}
