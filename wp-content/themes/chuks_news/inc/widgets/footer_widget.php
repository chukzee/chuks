<?php
include_once get_template_directory() . '/inc/util.php';
/**
 * Adds Footer_Widget widget.
 */
class FooterWidget extends WP_Widget {

    /**
     * Register widget with WordPress.
     */
    public function __construct() {
        // actual widget processes
        parent::__construct(
                'footer_widget', // Base ID
                'Footer_Widget', // Name
                array('description' => __('A Footer Widget', 'chuks_news'),) // Args
        );
    }

    private function frontend_html($args, $instance) {
        $column_1_label = 'column_1_title';
        $column_1_heading = (!empty($instance[$column_1_label]) ) ? $instance[$column_1_label] : '';
        $column_1_heading = '<h5 class="widgetheading">' . $column_1_heading . '</h5>';

        $link_html = '';
        for ($i = 1; $i < 7; $i++) {

            $link_label = 'link_' . $i . '_label';
            $link_url = 'link_' . $i . '_url';

            $label = (!empty($instance[$link_label]) ) ? $instance[$link_label] : '';
            $url = (!empty($instance[$link_url]) ) ? $instance[$link_url] : '#';
            if ($label == '') {
                continue;
            }
            
            $href = normalize_href($url);
            $link_html .= '<li><a href="' . $href . '">' . $label . '</a></li>';
        }

        $column_2_label = 'column_2_title';
        $column_2_heading = (!empty($instance[$column_2_label]) ) ? '<h5 class="widgetheading">' . $instance[$column_2_label] . '</h5>' : '';

        $company_name_label = 'company_name';
        $company_name_html = (!empty($instance[$company_name_label]) ) ? '<strong>' . $instance[$company_name_label] . '</strong><br>' : '';

        $company_address_label = 'company_address';
        $company_address_html = (!empty($instance[$company_address_label]) ) ? $instance[$company_address_label] : '';
        $phone_nos = array();
        $company_phone_1_label = 'company_phone_1';
        $company_phone_1_html = (!empty($instance[$company_phone_1_label]) ) ? $instance[$company_phone_1_label] : '';
        $n = -1;
        if ($company_phone_1_html != '') {
            $phone_nos[++$n] = $company_phone_1_html;
        }

        $company_phone_2_label = 'company_phone_2';
        $company_phone_2_html = (!empty($instance[$company_phone_2_label]) ) ? $instance[$company_phone_2_label] : '';
        if ($company_phone_2_html != '') {
            $phone_nos[++$n] = $company_phone_2_html;
        }
        $company_phone_label = '';
        for ($i = 0; $i < $n + 1; $i++) {
            if ($i == 0) {
                $company_phone_label .= '<i class="icon-phone"></i> ' . $phone_nos[$i];
            } else {
                $company_phone_label .= ' - ' . $phone_nos[$i] . ' <br>';
            }
        }

        $company_email_label = 'company_email';
        $company_email_html = (!empty($instance[$company_email_label]) ) ? '<i class="icon-envelope-alt"></i> ' . $instance[$company_email_label] : '';



        $column_3_label = 'column_3_title';
        $column_3_heading = (!empty($instance[$column_3_label]) ) ? '<h5 class="widgetheading">' . $instance[$column_3_label] . '</h5>' : '';

        $descriptive_text_label = 'descriptive_text';
        $descriptive_text = (!empty($instance[$descriptive_text_label]) ) ? '<p>' . $instance[$descriptive_text_label] . '</p>' : '';


        echo '<footer>
        <div class="container">
            <div class="row">
                <div class="span4">
                    <div class="widget">
                        ' . $column_1_heading . '
                        <ul class="link-list">
                            ' . $link_html . '
                        </ul>

                    </div>
                </div>
                <div class="span4">
                    <div class="widget">
                        ' . $column_2_heading . '
                        <address>
                            ' . $company_name_html . '
                            ' . $company_address_html . '
                        </address>
                        <p>
                            ' . $company_phone_label . '
                            ' . $company_email_html . '
                        </p>
                    </div>
                </div>
                <div class="span4">
                    <div class="widget">
                        ' . $column_3_heading . '
                        ' . $descriptive_text . '
                        <form class="subscribe">
                            <div class="input-append">
                                <input class="span2" id="appendedInputButton" type="text">
                                <button class="btn btn-theme" type="submit">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div id="sub-footer">
            <div class="container">
                <div class="row">
                    <div class="span6">
                        <div class="copyright">
                            <p><span>&copy; Eterna company. All right reserved</span></p>
                        </div>

                    </div>

                    <div class="span6">
                        <div class="credits">
                            <!--
                              All the links in the footer should remain intact.
                              You can delete the links only if you purchased the pro version.
                              Licensing information: https://bootstrapmade.com/license/
                              Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=Eterna
                            -->
                            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>';
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

    private function column_1_html($instance) {

        echo '<fieldset>';
        echo '<legend><h3>Column 1</h3></legend>';
        echo '<p>Displays a list of links vertically</p>';

        $column_1_label = 'column_1_title';
        $column_1_placeholder = 'Enter column 1 title';
        $column_1_title = '';

        if (isset($instance[$column_1_label])) {
            $column_1_title = $instance[$column_1_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($column_1_label) . '" name="' . $this->get_field_name($column_1_label) . '" type="text" value="' . esc_attr($column_1_title) . '" placeholder="' . esc_attr($column_1_placeholder) . '" />';
        echo '<hr>';

        for ($i = 1; $i < 7; $i++) {

            $link_label = 'link_' . $i . '_label';
            $link_url = 'link_' . $i . '_url';

            $link_n_label = '';
            $link_n_url = '';
            $link_n_label_placeholder = 'Enter link ' . $i . ' lable';
            $link_n_url_placeholder = 'Enter link ' . $i . ' url';

            if (isset($instance[$link_label])) {
                $link_n_label = $instance[$link_label];
            }

            if (isset($instance[$link_url])) {
                $link_n_url = $instance[$link_url];
            }



            echo '<input class="widefat" id="' . $this->get_field_id($link_label) . '" name="' . $this->get_field_name($link_label) . '" type="text" value="' . esc_attr($link_n_label) . '" placeholder="' . esc_attr($link_n_label_placeholder) . '" />';
            echo '<br/><br/>';
            echo '<input class="widefat" id="' . $this->get_field_id($link_url) . '" name="' . $this->get_field_name($link_url) . '" type="text" value="' . esc_attr($link_n_url) . '"  placeholder="' . esc_attr($link_n_url_placeholder) . '" />';
            echo '<hr>';
        }
        echo '</fieldset>';
    }

    public function column_2_html($instance) {

        echo '<fieldset>';
        echo '<legend><h3>Column 2</h3></legend>';
        echo '<p>Displays company contact details </p>';

        //column title
        $column_2_label = 'column_2_title';
        $column_2_placeholder = 'Enter column 2 title';
        $column_2_title = '';

        if (isset($instance[$column_2_label])) {
            $column_2_title = $instance[$column_2_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($column_2_label) . '" name="' . $this->get_field_name($column_2_label) . '" type="text" value="' . esc_attr($column_2_title) . '" placeholder="' . esc_attr($column_2_placeholder) . '" />';
        echo '<hr>';

        //company name
        $company_name_label = 'company_name';
        $company_name_placeholder = 'Enter company name';
        $company_name_title = '';

        if (isset($instance[$company_name_label])) {
            $company_name_title = $instance[$company_name_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($company_name_label) . '" name="' . $this->get_field_name($company_name_label) . '" type="text" value="' . esc_attr($company_name_title) . '" placeholder="' . esc_attr($company_name_placeholder) . '" />';
        echo '<hr>';


        //company address
        $company_address_label = 'company_address';
        $company_address_placeholder = 'Enter company address';
        $company_address_title = '';

        if (isset($instance[$company_address_label])) {
            $company_address_title = $instance[$company_address_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($company_address_label) . '" name="' . $this->get_field_name($company_address_label) . '" type="text" value="' . esc_attr($company_address_title) . '" placeholder="' . esc_attr($company_address_placeholder) . '" />';
        echo '<hr>';


        //company phone 1
        $company_phone_1_label = 'company_phone_1';
        $company_phone_1_placeholder = 'Enter company phone 1';
        $company_phone_1_title = '';

        if (isset($instance[$company_phone_1_label])) {
            $company_phone_1_title = $instance[$company_phone_1_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($company_phone_1_label) . '" name="' . $this->get_field_name($company_phone_1_label) . '" type="text" value="' . esc_attr($company_phone_1_title) . '" placeholder="' . esc_attr($company_phone_1_placeholder) . '" />';
        echo '<hr>';

        //company phone 2
        $company_phone_2_label = 'company_phone_2';
        $company_phone_2_placeholder = 'Enter company phone 2';
        $company_phone_2_title = '';

        if (isset($instance[$company_phone_2_label])) {
            $company_phone_2_title = $instance[$company_phone_2_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($company_phone_2_label) . '" name="' . $this->get_field_name($company_phone_2_label) . '" type="text" value="' . esc_attr($company_phone_2_title) . '" placeholder="' . esc_attr($company_phone_2_placeholder) . '" />';
        echo '<hr>';

        //company email
        $company_email_label = 'company_email';
        $company_email_placeholder = 'Enter company email';
        $company_email_title = '';

        if (isset($instance[$company_email_label])) {
            $company_email_title = $instance[$company_email_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($company_email_label) . '" name="' . $this->get_field_name($company_email_label) . '" type="text" value="' . esc_attr($company_email_title) . '" placeholder="' . esc_attr($company_email_placeholder) . '" />';
        echo '<hr>';


        echo '</fieldset>';
    }

    public function column_3_html($instance) {

        echo '<fieldset>';
        echo '<legend><h3>Column 3</h3></legend>';
        echo '<p>Displays newsletter subscription form </p>';

        //title
        $column_3_label = 'column_3_title';
        $column_3_placeholder = 'Enter column 2 title';
        $column_3_title = '';

        if (isset($instance[$column_3_label])) {
            $column_3_title = $instance[$column_3_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($column_3_label) . '" name="' . $this->get_field_name($column_3_label) . '" type="text" value="' . esc_attr($column_3_title) . '" placeholder="' . esc_attr($column_3_placeholder) . '" />';
        echo '<hr>';


        //descriptive text
        $descriptive_text_label = 'descriptive_text';
        $descriptive_text_placeholder = 'Enter descriptive text';
        $descriptive_text = '';

        if (isset($instance[$descriptive_text_label])) {
            $descriptive_text = $instance[$descriptive_text_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($descriptive_text_label) . '" name="' . $this->get_field_name($descriptive_text_label) . '" type="text" value="' . esc_attr($descriptive_text) . '" placeholder="' . esc_attr($descriptive_text_placeholder) . '" />';
        echo '<hr>';


        echo '</fieldset>';
    }

    public function bottom_html($instance) {

        echo '<fieldset>';
        echo '<legend><h3>Bottom</h3></legend>';
        echo '<p>Displays copyright and design by </p>';

        //copyright
        $copyright_label = 'copyright';
        $column_2_placeholder = 'Enter copyright label';
        $copyright = '';

        if (isset($instance[$copyright_label])) {
            $copyright = $instance[$copyright_label];
        }
        echo '<input class="widefat" id="' . $this->get_field_id($copyright_label) . '" name="' . $this->get_field_name($copyright_label) . '" type="text" value="' . esc_attr($copyright) . '" placeholder="' . esc_attr($column_2_placeholder) . '" />';
        echo '<hr>';


        //design by
        $design_by_name = 'design_by_name';
        $design_by_label_placeholder = 'Enter designed by name';
        $design_by_label_name = '';

        $design_by_url = 'design_by_url';
        $design_by_url_placeholder = 'Enter designed by url';
        $design_by_url_name = '';

        if (isset($instance[$design_by_name])) {
            $design_by_label_name = $instance[$design_by_name];
        }

        if (isset($instance[$design_by_url])) {
            $design_by_url_name = $instance[$design_by_url];
        }

        echo '<input class="widefat" id="' . $this->get_field_id($design_by_name) . '" name="' . $this->get_field_name($design_by_name) . '" type="text" value="' . esc_attr($design_by_label_name) . '" placeholder="' . esc_attr($design_by_label_placeholder) . '" />';
        echo '<br/><br/>';
        echo '<input class="widefat" id="' . $this->get_field_id($design_by_url) . '" name="' . $this->get_field_name($design_by_url) . '" type="text" value="' . esc_attr($design_by_url_name) . '" placeholder="' . esc_attr($design_by_url_placeholder) . '" />';
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

        $this->column_1_html($instance);
        $this->column_2_html($instance);
        $this->column_3_html($instance);
        $this->bottom_html($instance);
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

        $this->column_1_update($new_instance, $instance);
        $this->column_2_update($new_instance, $instance);
        $this->column_3_update($new_instance, $instance);
        $this->bottom_update($new_instance, $instance);

        return $instance;
    }

    private function column_1_update($new_instance, & $instance) {
        $column_1_label = 'column_1_title';

        $instance[$column_1_label] = (!empty($new_instance[$column_1_label]) ) ? $new_instance[$column_1_label] : '';

        for ($i = 1; $i < 7; $i++) {

            $link_label = 'link_' . $i . '_label';
            $link_url = 'link_' . $i . '_url';

            $instance[$link_label] = (!empty($new_instance[$link_label]) ) ? $new_instance[$link_label] : '';
            $instance[$link_url] = (!empty($new_instance[$link_url]) ) ? $new_instance[$link_url] : '';
        }

        return $instance;
    }

    private function column_2_update($new_instance, & $instance) {
        $column_2_label = 'column_2_title';
        $company_name_label = 'company_name';
        $company_address_label = 'company_address';
        $company_phone_1_label = 'company_phone_1';
        $company_phone_2_label = 'company_phone_2';
        $company_email_label = 'company_email';

        $instance[$column_2_label] = (!empty($new_instance[$column_2_label]) ) ? $new_instance[$column_2_label] : '';
        $instance[$company_name_label] = (!empty($new_instance[$company_name_label]) ) ? $new_instance[$company_name_label] : '';
        $instance[$company_address_label] = (!empty($new_instance[$company_address_label]) ) ? $new_instance[$company_address_label] : '';
        $instance[$company_phone_1_label] = (!empty($new_instance[$company_phone_1_label]) ) ? $new_instance[$company_phone_1_label] : '';
        $instance[$company_phone_2_label] = (!empty($new_instance[$company_phone_2_label]) ) ? $new_instance[$company_phone_2_label] : '';
        $instance[$company_email_label] = (!empty($new_instance[$company_email_label]) ) ? $new_instance[$company_email_label] : '';

        return $instance;
    }

    private function column_3_update($new_instance, & $instance) {
        $column_3_label = 'column_3_title';
        $descriptive_text_label = 'descriptive_text';

        $instance[$column_3_label] = (!empty($new_instance[$column_3_label]) ) ? $new_instance[$column_3_label] : '';
        $instance[$descriptive_text_label] = (!empty($new_instance[$descriptive_text_label]) ) ? $new_instance[$descriptive_text_label] : '';

        return $instance;
    }

    private function bottom_update($new_instance, & $instance) {
        $copyright_label = 'copyright';
        $design_by_name = 'design_by_name';
        $design_by_url = 'design_by_url';

        $instance[$copyright_label] = (!empty($new_instance[$copyright_label]) ) ? $new_instance[$copyright_label] : '';
        $instance[$design_by_name] = (!empty($new_instance[$design_by_name]) ) ? $new_instance[$design_by_name] : '';
        $instance[$design_by_url] = (!empty($new_instance[$design_by_url]) ) ? $new_instance[$design_by_url] : '';

        return $instance;
    }

}

// Register Footer_Widget widget
add_action('widgets_init', 'register_footer_widget');

function register_footer_widget() {
    register_widget('FooterWidget');
}


