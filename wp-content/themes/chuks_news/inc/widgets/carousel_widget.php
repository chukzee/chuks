<?php
/**
 * Adds Carousel_Widget widget.
 */
class CarouselWidget extends WP_Widget {

     private $SLIDE_COUNT = 3;
    /**
     * Register widget with WordPress.
     */
    public function __construct() {
        // actual widget processes
        parent::__construct(
                'carousel_widget', // Base ID
                'Carousel_Widget', // Name
                array('description' => __('A Carousel Widget', 'chuks_news'),) // Args
        );
    }

    private function frontend_html($args, $instance) {
        
        
        $arr = array();    
        for ($i = 1; $i < $this->SLIDE_COUNT + 1; $i++) {
            $arr[$i-1]['slide_image'] = (!empty($instance['slide_'.$i.'_image']) ) ? get_template_directory_uri(). $instance['slide_'.$i.'_image'] : '';
            $arr[$i-1]['slide_heading'] = (!empty($instance['slide_'.$i.'_heading']) ) ? $instance['slide_'.$i.'_heading'] : '';
            $arr[$i-1]['slide_text'] = (!empty($instance['slide_'.$i.'_text']) ) ? $instance['slide_'.$i.'_text'] : '';
            $arr[$i-1]['slide_extra_html'] = (!empty($instance['slide_'.$i.'_extra_html']) ) ? $instance['slide_'.$i.'_extra_html'] : '';
            $arr[$i-1]['slide_overlayed_image'] = (!empty($instance['slide_'.$i.'_overlayed_image']) ) ?  get_template_directory_uri(). $instance['slide_'.$i.'_overlayed_image'] : '';
            $arr[$i-1]['slide_overlayed_image_animation'] = (!empty($instance['slide_'.$i.'_overlayed_image_animation']) ) ? $instance['slide_'.$i.'_overlayed_image_animation'] : '';            
        }
        
        
        echo '<!-- section featured -->
            <section id="featured">

                <!-- slideshow start here -->

                <div class="camera_wrap" id="camera-slide">

                    <!-- slide 1 here -->
                    <div data-src="' .$arr[0]['slide_image']. '">
                        <div class="camera_caption fadeFromLeft">
                            <div class="container">
                                <div class="row">
                                    <div class="span6">
                                        <h2 class="animated fadeInDown">' .$arr[0]['slide_heading']. '</h2>
                                        <p class="animated fadeInUp">' .$arr[0]['slide_text']. '</p>
                                        ' .$arr[0]['slide_extra_html']. '
                                    </div>
                                    <div class="span6">
                                        <img src="' .$arr[0]['slide_overlayed_image']. '" alt="" '.($arr[0]['slide_overlayed_image_animation'] != '' ? 'class="animated bounceInDown delay1"':''). ' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- slide 2 here -->
                    <div data-src="' .$arr[1]['slide_image']. '">
                        <div class="camera_caption fadeFromLeft">
                            <div class="container">
                                <div class="row">
                                    <div class="span6">
                                        <img src="' .$arr[1]['slide_overlayed_image']. '" alt=""  '.($arr[1]['slide_overlayed_image_animation'] != '' ? 'class="animated bounceInDown delay1"':''). ' />
                                    </div>
                                    <div class="span6">
                                        <h2 class="animated fadeInDown">' .$arr[1]['slide_heading']. '</h2>
                                        <p class="animated fadeInUp"> ' .$arr[1]['slide_text']. '</p>
                                        ' .$arr[1]['slide_extra_html']. '
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- slide 3 here -->
                    <div data-src="' .$arr[2]['slide_image']. '">
                        <div class="camera_caption fadeFromLeft">
                            <div class="container">
                                <div class="row">
                                    <div class="span12 aligncenter">
                                        <h2 class="animated fadeInDown">' .$arr[2]['slide_heading']. '</h2>
                                        <p class="animated fadeInUp">' .$arr[2]['slide_text']. '</p>
                                        ' .$arr[2]['slide_extra_html']. '    
                                        <img src="' .$arr[2]['slide_overlayed_image']. '" alt=""  '.($arr[2]['slide_overlayed_image_animation'] != '' ? 'class="animated bounceInDown delay1"':''). ' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- slideshow end here -->

            </section>
            <!-- /section featured -->';
    }

    /**
     * Front-end display of widget.
     *
     * @see WP_Widget::widget()
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget($args, $instance) {
        // outputs the content of the widget
        $this->frontend_html($args, $instance);
    }

    private function slide_html($instance, $i) {

        echo '<fieldset>';
        echo '<legend><h3>Slide  ' .$i. ' </h3></legend>';

        //slide image
        $slide_image_name = 'slide_'.$i.'_image';
        $slide_placeholder = 'Enter slide ' .$i. ' image';
        $slide_image = '';

        if (isset($instance[$slide_image_name])) {
            $slide_image = $instance[$slide_image_name];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($slide_image_name) . '" name="' . $this->get_field_name($slide_image_name) . '" type="text" value="' . esc_attr($slide_image) . '" placeholder="' . esc_attr($slide_placeholder) . '" />';
        echo '<hr>';

        //slide heading
        $slide_heading_name = 'slide_'.$i.'_heading';
        $slide_placeholder = 'Enter slide ' .$i. ' heading';
        $slide_heading = '';

        if (isset($instance[$slide_heading_name])) {
            $slide_heading = $instance[$slide_heading_name];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($slide_heading_name) . '" name="' . $this->get_field_name($slide_heading_name) . '" type="text" value="' . esc_attr($slide_heading) . '" placeholder="' . esc_attr($slide_placeholder) . '" />';
        echo '<hr>';

       
        //slide text
        $slide_text_name = 'slide_'.$i.'_text';
        $slide_placeholder = 'Enter slide ' .$i. ' text';
        $slide_text = '';

        if (isset($instance[$slide_text_name])) {
            $slide_text = $instance[$slide_text_name];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($slide_text_name) . '" name="' . $this->get_field_name($slide_text_name) . '" type="text" value="' . esc_attr($slide_text) . '" placeholder="' . esc_attr($slide_placeholder) . '" />';
        echo '<hr>';
       
        //slide extra html
        $slide_extra_html_name = 'slide_'.$i.'_extra_html';
        $slide_placeholder = 'Enter slide ' .$i. ' extra_html';
        $slide_extra_html = '';

        if (isset($instance[$slide_extra_html_name])) {
            $slide_extra_html = $instance[$slide_extra_html_name];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($slide_extra_html_name) . '" name="' . $this->get_field_name($slide_extra_html_name) . '" type="text" value="' . esc_attr($slide_extra_html) . '" placeholder="' . esc_attr($slide_placeholder) . '" />';
        echo '<hr>';
        
        
        //slide image overlay
        $slide_overlayed_image_name = 'slide_'.$i.'_overlayed_image';
        $slide_placeholder = 'Enter slide ' .$i. ' overlayed image';
        $slide_overlayed_image = '';

        if (isset($instance[$slide_overlayed_image_name])) {
            $slide_overlayed_image = $instance[$slide_overlayed_image_name];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($slide_overlayed_image_name) . '" name="' . $this->get_field_name($slide_overlayed_image_name) . '" type="text" value="' . esc_attr($slide_overlayed_image) . '" placeholder="' . esc_attr($slide_placeholder) . '" />';
        echo '<hr>';
        
        
        //slide overlay image animation
        $slide_overlayed_image_animation_name = 'slide_'.$i.'_overlayed_image_animation';
        $slide_animate_overlayed_image = 'Animate overlayed image';
        $slide_overlayed_image_animation = '';

        if (isset($instance[$slide_overlayed_image_animation_name])) {
            $slide_overlayed_image_animation = $instance[$slide_overlayed_image_animation_name];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($slide_overlayed_image_animation_name) . '" name="' . $this->get_field_name($slide_overlayed_image_animation_name) . '" type="checkbox" '.($slide_overlayed_image_animation?'checked':'').' />';
        echo '<label for="' . $this->get_field_id($slide_overlayed_image_animation_name) . '">'.$slide_animate_overlayed_image.'</label>';
        echo '<hr>';
        
        
        echo '</fieldset>';
    }


    /**
     * Back-end widget form.
     *
     * @see WP_Widget::form()
     *
     * @param array $instance Previously saved values from database.
     */
    public function form($instance) {

        // outputs the options form in the admin

        for ($i = 1; $i < $this->SLIDE_COUNT +1; $i++) {
            $this->slide_html($instance, $i);
        }
        
    }

    /**
     * Sanitize widget form values as they are saved.
     *
     * @see WP_Widget::update()
     *
     * @param array $new_instance Values just sent to be saved.
     * @param array $old_instance Previously saved values from database.
     *
     * @return array Updated safe values to be saved.
     */
    public function update($new_instance, $old_instance) {

        // processes widget options to be saved

        $instance = array();

        for ($i = 1; $i < $this->SLIDE_COUNT +1; $i++) {
            $this->slide_update($new_instance, $instance, $i);
        }
        return $instance;
    }

    private function slide_update($new_instance, & $instance, $i) {
        $slide_image = 'slide_'.$i.'_image';
        $slide_heading = 'slide_'.$i.'_heading';
        $slide_text = 'slide_'.$i.'_text';
        $slide_extra_html = 'slide_'.$i.'_extra_html';
        $slide_overlayed_image = 'slide_'.$i.'_overlayed_image';
        $slide_overlayed_image_animation = 'slide_'.$i.'_overlayed_image_animation';

        $instance[$slide_image] = (!empty($new_instance[$slide_image]) ) ? $new_instance[$slide_image] : '';
        $instance[$slide_heading] = (!empty($new_instance[$slide_heading]) ) ? $new_instance[$slide_heading] : '';
        $instance[$slide_text] = (!empty($new_instance[$slide_text]) ) ? $new_instance[$slide_text] : '';
        $instance[$slide_extra_html] = (!empty($new_instance[$slide_extra_html]) ) ? $new_instance[$slide_extra_html] : '';
        $instance[$slide_overlayed_image] = (!empty($new_instance[$slide_overlayed_image]) ) ? $new_instance[$slide_overlayed_image] : '';
        $instance[$slide_overlayed_image_animation] = (!empty($new_instance[$slide_overlayed_image_animation]) ) ? $new_instance[$slide_overlayed_image_animation] : '';

        return $instance;
    }

}

// Register Carousel_Widget widget
add_action('widgets_init', 'register_carousel_widget');

function register_carousel_widget() {
    register_widget('CarouselWidget');
}


