<?php

require get_template_directory() . '/inc/widgets.php';
require get_template_directory() . '/inc/shortcodes.php';

function chuks_news_script_enqueue() {

    //header    
    //css 
    wp_enqueue_style('chuks_news_styles_1', get_template_directory_uri() . 'https://fonts.googleapis.com/css?family=Handlee|Open+Sans:300,400,600,700,800', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_2', get_template_directory_uri() . '/assets/css/bootstrap.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_3', get_template_directory_uri() . '/assets/css/bootstrap-responsive.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_4', get_template_directory_uri() . '/assets/css/flexslider.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_5', get_template_directory_uri() . '/assets/css/prettyPhoto.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_6', get_template_directory_uri() . '/assets/css/prettyPhoto.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_7', get_template_directory_uri() . '/assets/css/camera.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_8', get_template_directory_uri() . '/assets/css/jquery.bxslider.css', false, null, 'all');
    wp_enqueue_style('chuks_news_styles_9', get_template_directory_uri() . '/assets/css/style.css', false, null, 'all');

    //Theme skin
    wp_enqueue_style('chuks_news_styles_10', get_template_directory_uri() . '/assets/color/default.css', false, null, 'all');


    //footer    
    $is_in_footer = true;

    // javascript
    //================================================== -->
    // Placed at the end of the document so the pages load faster
    wp_enqueue_script('chuks_news_js1', get_template_directory_uri() . '/assets/js/jquery.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js2', get_template_directory_uri() . '/assets/js/jquery.easing.1.3.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js3', get_template_directory_uri() . '/assets/js/bootstrap.js', array(), null, $is_in_footer);

    wp_enqueue_script('chuks_news_js4', get_template_directory_uri() . '/assets/js/modernizr.custom.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js5', get_template_directory_uri() . '/assets/js/toucheffects.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js6', get_template_directory_uri() . '/assets/js/google-code-prettify/prettify.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js7', get_template_directory_uri() . '/assets/js/jquery.bxslider.min.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js8', get_template_directory_uri() . '/assets/js/camera/camera.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js9', get_template_directory_uri() . '/assets/js/camera/setting.js', array(), null, $is_in_footer);

    wp_enqueue_script('chuks_news_js10', get_template_directory_uri() . '/assets/js/jquery.prettyPhoto.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js11', get_template_directory_uri() . '/assets/js/portfolio/jquery.quicksand.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js12', get_template_directory_uri() . '/assets/js/portfolio/setting.js', array(), null, $is_in_footer);

    wp_enqueue_script('chuks_news_js13', get_template_directory_uri() . '/assets/js/jquery.flexslider.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js14', get_template_directory_uri() . '/assets/js/animate.js', array(), null, $is_in_footer);
    wp_enqueue_script('chuks_news_js15', get_template_directory_uri() . '/assets/js/inview.js', array(), null, $is_in_footer);

    //Template Custom JavaScript File 
    wp_enqueue_script('chuks_news_js16', get_template_directory_uri() . '/assets/js/custom.js', array(), null, $is_in_footer);
}

add_action('wp_enqueue_scripts', 'chuks_news_script_enqueue');

function chuks_news_custom_header_setup() {
    $args = array(
        // Default Header Image to display
        'default-image' => get_template_directory_uri() . '/assets/img/logo.png',
        // Display the header text along with the image
        'header-text' => true,
        // Header text color default
        'default-text-color' => '000',
        // Header image width (in pixels)
        'width' => 1000,
        // Header image height (in pixels)
        'height' => 198,
        // Header image random rotation default
        'random-default' => false,
        // Enable upload of image file in admin 
        'uploads' => true,
            // function to be called in theme head section
            //'wp-head-callback'      => 'wphead_cb',
            //  function to be called in preview page head section
            //'admin-head-callback'       => 'adminhead_cb',
            // function to produce preview markup in the admin screen
            //'admin-preview-callback'    => 'adminpreview_cb',
    );

    add_theme_support('custom-header', $args);
}

add_action('after_setup_theme', 'chuks_news_custom_header_setup');

function chuks_news_custom_logo_setup() {
    $defaults = array(
        'height' => 100,
        'width' => 400,
        'flex-height' => true,
        'flex-width' => true,
        'header-text' => array('site-title', 'site-description'),
    );
    add_theme_support('custom-logo', $defaults);
}

add_action('after_setup_theme', 'chuks_news_custom_logo_setup');

function register_chuks_news_menus() {
    register_nav_menus(
            array(
                'social-network-menu' => __('Social Network Menu'),
                'top-nav-menu' => __('Top Navigation Menu')
            )
    );
}

add_action('init', 'register_chuks_news_menus');

add_theme_support('post-thumbnails');

add_theme_support('post-formats', array('aside', 'gallery', 'quote', 'image', 'video'));
