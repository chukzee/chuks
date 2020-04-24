<?php
    if( ! defined( 'ABSPATH' ) ) exit(); // Exit if accessed directly

    if( !class_exists('HTmagazine_Init') ){

        class HTmagazine_Init{

            public function __construct(){

                $this->htmagazine_includes_wp_widgets();

                add_action( 'init', array ( $this, 'htmagazine_after_setup_theme' ) );
                add_action( 'elementor/editor/after_enqueue_styles', array ( $this, 'htmagazine_editor_styles' ) );
                add_action( 'elementor/frontend/after_enqueue_styles', array ( $this, 'htmagazine_enqueue_styles' ), 10 );
                add_action( 'elementor/frontend/after_enqueue_scripts', array ( $this, 'htmagazine_enqueue_scripts' ), 10 );
                add_action( 'elementor/frontend/after_register_scripts', array ( $this, 'htmagazine_register_fronted_scripts' ), 10 );
                add_action( 'elementor/widgets/widgets_registered', array ( $this, 'htmagazine_includes_widgets' ) );
            }

            // Include Elementor Addons File
            public function htmagazine_includes_widgets(){
                require_once HTMAGAZINE_PL_PATH.'includes/widgets_control.php';
            }

            // Include WordPress Widgets File
            public function htmagazine_includes_wp_widgets(){
                foreach ( glob( realpath( dirname( __FILE__ ) ) .'/widgets/*.php' ) as $widgetfilename ) {
                    include_once $widgetfilename;
                }
            }

            // Add Image size
            public function htmagazine_after_setup_theme() {
                add_image_size( 'htmagazine_grid', 640, 218, true );
            }

            // Addons Icon
            public function htmagazine_editor_styles() {
                wp_enqueue_style('htmagazine-element-editor', HTMAGAZINE_PL_URL . 'assests/css/elementor-editor.css', '', HTMAGAZINE_VERSION );
            }

            public function htmagazine_google_font_url(){

                $fonts_url = '';
                $fonts     = array();
                $subsets   = 'latin,latin-ext';

                if ( 'off' !== _x( 'on', 'Open Sans font: on or off', 'ht-magazine' ) ) {
                    $fonts[] = 'Open Sans:300,400,600,700,800';
                }

                if ( 'off' !== _x( 'on', 'Poppins font: on or off', 'ht-magazine' ) ) {
                    $fonts[] = 'Poppins:100,100i,200,200i,300,300i,400,400i,500,600,700,800,900';
                }

                if ( $fonts ) {
                    $fonts_url = add_query_arg( array(
                        'family' => urlencode( implode( '|', $fonts ) ),
                        'subset' => urlencode( $subsets ),
                    ), 'https://fonts.googleapis.com/css' );
                }

                return $fonts_url;
            }

            // Enqueue stylesheet
            public function htmagazine_enqueue_styles(){

                wp_enqueue_style( 'htmagazine-font', $this->htmagazine_google_font_url() );

                wp_enqueue_style(
                    'bootstrap',
                    HTMAGAZINE_PL_URL . 'assests/css/bootstrap.min.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

                wp_enqueue_style(
                    'font-awesome',
                    HTMAGAZINE_PL_URL . 'assests/css/font-awesome.min.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

                wp_enqueue_style(
                    'animate',
                    HTMAGAZINE_PL_URL . 'assests/css/animate.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

                wp_enqueue_style(
                    'slick',
                    HTMAGAZINE_PL_URL . 'assests/css/slick.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

                wp_enqueue_style(
                    'magnific-popup',
                    HTMAGAZINE_PL_URL . 'assests/css/magnific-popup.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

                wp_enqueue_style(
                    'rypp',
                    HTMAGAZINE_PL_URL . 'assests/css/rypp.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

                wp_enqueue_style(
                    'htmagazine-style',
                    HTMAGAZINE_PL_URL . 'assests/css/style.css',
                    array(),
                    HTMAGAZINE_VERSION
                );

            }

            // Enqueue Script
            public function htmagazine_enqueue_scripts(){

                $google_map_api_key = htmagazine_get_option( 'google_map_api_key','htinstagram_general_tabs' );

                wp_enqueue_script(
                    'popper', 
                    HTMAGAZINE_PL_URL . 'assests/js/popper.min.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'bootstrap', 
                    HTMAGAZINE_PL_URL . 'assests/js/bootstrap.min.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'slick', 
                    HTMAGAZINE_PL_URL . 'assests/js/slick.min.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'news-ticker', 
                    HTMAGAZINE_PL_URL . 'assests/js/advanced-news-ticker.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'scrollup', 
                    HTMAGAZINE_PL_URL . 'assests/js/scrollup.min.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'magnific-popup', 
                    HTMAGAZINE_PL_URL . 'assests/js/magnific-popup.min.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'nicescroll', 
                    HTMAGAZINE_PL_URL . 'assests/js/nicescroll.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'rypp', 
                    HTMAGAZINE_PL_URL . 'assests/js/rypp.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

                wp_enqueue_script(
                    'htmagazine-main', 
                    HTMAGAZINE_PL_URL . 'assests/js/htmagazine-main.js', 
                    array('jquery'), 
                    HTMAGAZINE_VERSION, 
                    TRUE 
                );

            }

            public function htmagazine_register_fronted_scripts(){
                if( !empty( $google_map_api_key ) ){
                    wp_register_script(
                        'google-map-api',
                        'https://maps.googleapis.com/maps/api/js?key='.$google_map_api_key,
                        array('jquery'),
                        NULL,
                        TRUE
                    );
                }else{
                    wp_register_script(
                        'google-map-api',
                        'http://maps.googleapis.com/maps/api/js?sensor=false',
                        array('jquery'),
                        NULL,
                        TRUE
                    );
                }
            }

        }

        new HTmagazine_Init();

    }


?>