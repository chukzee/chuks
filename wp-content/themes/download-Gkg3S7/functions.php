<?php
/**
 * newsnow functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package newsnow
 */

if ( ! function_exists( 'newsnow_setup' ) ) :

function newsnow_setup() {

	load_theme_textdomain( 'newsnow', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary Menu', 'newsnow' ),
		'secondary' => esc_html__( 'Secondary Menu', 'newsnow' ),		
		'footer' => esc_html__( 'Footer Menu', 'newsnow' ),		
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'newsnow_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );

    add_editor_style();    
}
endif;
add_action( 'after_setup_theme', 'newsnow_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function newsnow_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'newsnow_content_width', 760 );
}
add_action( 'after_setup_theme', 'newsnow_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function newsnow_sidebar_init() {

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'newsnow' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here. Display on every pages.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="widget-title"><span>',
		'after_title'   => '</span></h2>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Homepage Content', 'newsnow' ),
		'id'            => 'homepage',
		'description'   => esc_html__( 'Only put "Home One Column" widget here.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="widget-title"><span>',
		'after_title'   => '</span></h2>',
	) );	

	register_sidebar( array(
		'name'          => esc_html__( 'Homepage Sidebar', 'newsnow' ),
		'id'            => 'homepage-sidebar',
		'description'   => esc_html__( 'If empty, homepage sidebar will display the "Sidebar" widgets above.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="widget-title"><span>',
		'after_title'   => '</span></h2>',
	) );	

	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 1', 'newsnow' ),
		'id'            => 'footer-1',
		'description'   => esc_html__( 'Add widgets here.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 2', 'newsnow' ),
		'id'            => 'footer-2',
		'description'   => esc_html__( 'Add widgets here.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 3', 'newsnow' ),
		'id'            => 'footer-3',
		'description'   => esc_html__( 'Add widgets here.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 4', 'newsnow' ),
		'id'            => 'footer-4',
		'description'   => esc_html__( 'Add widgets here.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="widget footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );	

	register_sidebar( array(
		'name'          => esc_html__( 'Header Advertisement', 'newsnow' ),
		'id'            => 'header-ad',
		'description'   => esc_html__( 'Drag the "Advertisement" widget here.', 'newsnow' ),
		'before_widget' => '<div id="%1$s" class="header-ad %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );	

}
add_action( 'widgets_init', 'newsnow_sidebar_init' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */

require get_template_directory() . '/admin/customizer-library.php';

require get_template_directory() . '/admin/customizer-options.php';

require get_template_directory() . '/admin/styles.php';

require get_template_directory() . '/admin/mods.php';

require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

/**
 * Load plugins.
 */
//require get_template_directory() . '/inc/plugins.php';

/**
 * Enqueues scripts and styles.
 */
function newsnow_scripts() {

    // load jquery if it isn't

    //wp_enqueue_script('jquery');
    wp_enqueue_script('jquery', get_template_directory_uri() . '/assets/js/jquery.js', array(), '', true );

	//  Enqueues Javascripts
	wp_enqueue_script( 'superfish', get_template_directory_uri() . '/assets/js/superfish.js', array(), '', true );
	wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/assets/js/modernizr.min.js',array(), '', true ); 
	wp_enqueue_script( 'html5', get_template_directory_uri() . '/assets/js/html5.js', array(), '', true );
	wp_enqueue_script( 'custom', get_template_directory_uri() . '/assets/js/jquery.custom.js', array(), '20170628', true );

    // Enqueues CSS styles
    wp_enqueue_style( 'newsnow-style', get_stylesheet_uri(), array(), '20180523' );     
    wp_enqueue_style( 'genericons-style',   get_template_directory_uri() . '/genericons/genericons.css' );


    if ( get_theme_mod( 'site-layout', 'choice-1' ) == 'choice-1' ) {
    	wp_enqueue_style( 'responsive-style',   get_template_directory_uri() . '/responsive.css', array(), '20161209' ); 
	}
	
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }    
}
add_action( 'wp_enqueue_scripts', 'newsnow_scripts' );

/* Admin CSS Style */
function newsnow_admin_style() {
	wp_enqueue_style('admin-styles', get_template_directory_uri().'/assets/css/admin.css');
}
add_action('admin_enqueue_scripts', 'newsnow_admin_style');

/**
 * Post Thumbnails.
 */
if ( function_exists( 'add_theme_support' ) ) { 
    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 150, 150, true ); // default Post Thumbnail dimensions (cropped)
    add_image_size( 'featured_large_thumb', 720, 480, true ); // 600 * 400
    add_image_size( 'block_large_thumb', 600, 400, true ); // 430 * 287
    add_image_size( 'post_thumb', 300, 200, true );
    add_image_size( 'single_thumb', 880, 528, true );            
}

/**
 * Registers custom widgets.
 */
function newsnow_widgets_init() {

	require trailingslashit( get_template_directory() ) . 'inc/widgets/widget-ad.php';
	register_widget( 'newsnow_Ad_Widget' );	

	require trailingslashit( get_template_directory() ) . 'inc/widgets/widget-home-block-one.php';
	register_widget( 'NewsNow_Block_One_Widget' );														

}
add_action( 'widgets_init', 'newsnow_widgets_init' );

/* Fix PHP warning */
function _get($str){
    $val = !empty($_GET[$str]) ? $_GET[$str] : null;
    return $val;
}

