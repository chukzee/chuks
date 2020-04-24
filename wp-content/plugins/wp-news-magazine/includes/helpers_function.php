<?php
    /*
     * Elementor category
     */
    function htmagazine_elementor_init(){
        \Elementor\Plugin::instance()->elements_manager->add_category(
            'htnews-addons',
            [
                'title'  => 'WP News',
                'icon' => 'font'
            ],
            1
        );
    }
    add_action('elementor/init','htmagazine_elementor_init');

    /*
     * Get Taxonomy
     * return array
     */
    function htmagazine_get_taxonomies( $htmagazine_texonomy = 'category' ){
        $terms = get_terms( array(
            'taxonomy' => $htmagazine_texonomy,
            'hide_empty' => true,
        ));
        if ( ! empty( $terms ) && ! is_wp_error( $terms ) ){
            foreach ( $terms as $term ) {
                $options[ $term->slug ] = $term->name;
            }
            return $options;
        }
    }

    /*
     * Get Post Type
     * return array
     */
    function htmagazine_get_post_types( $args = [] ) {
       
        $post_type_args = [
            'show_in_nav_menus' => true,
        ];
        if ( ! empty( $args['post_type'] ) ) {
            $post_type_args['name'] = $args['post_type'];
        }
        $_post_types = get_post_types( $post_type_args , 'objects' );

        $post_types  = [];
        foreach ( $_post_types as $post_type => $object ) {
            $post_types[ $post_type ] = $object->label;
        }
        return $post_types;
    }

    /*
     * Contact form list
     * return array
     */
    function htmagazine_contact_form_seven(){
        $countactform = array();
        $htmagazine_forms_args = array( 'posts_per_page' => -1, 'post_type'=> 'wpcf7_contact_form' );
        $htmagazine_forms = get_posts( $htmagazine_forms_args );

        if( $htmagazine_forms ){
            foreach ( $htmagazine_forms as $htmagazine_form ){
                $countactform[$htmagazine_form->ID] = $htmagazine_form->post_title;
            }
        }else{
            $countactform[ esc_html__( 'No contact form found', 'ht-magazine' ) ] = 0;
        }
        return $countactform;
    }

    /*
     * Plugins Options value Fetch
     */
    function htmagazine_get_option( $option, $section, $default = '' ){

        $options = get_option( $section );
        if ( isset( $options[$option] ) ) {
            return $options[$option];
        }
        return $default;
    }

?>