<?php

////////////////////////////////////////////////////////////////////
// Settig Theme-options
////////////////////////////////////////////////////////////////////
include_once( trailingslashit( get_template_directory() ) . 'lib/plugin-activation.php' );
include_once( trailingslashit( get_template_directory() ) . 'lib/theme-config.php' );
require_once( trailingslashit( get_template_directory() ) . 'lib/customize-pro/class-customize.php' );

add_action( 'after_setup_theme', 'pressnews_setup' );

if ( !function_exists( 'pressnews_setup' ) ) :

	function pressnews_setup() {

		// Theme lang
		load_theme_textdomain( 'pressnews', get_template_directory() . '/languages' );

		// Add Title Tag Support
		add_theme_support( 'title-tag' );

		// Register Menus
		register_nav_menus(
		array(
			'main_menu' => __( 'Main Menu', 'pressnews' ),
		)
		);

		// Add support for a featured image and the size
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 300, 300, true );
		add_image_size( 'pressnews-home', 438, 246, true );
		add_image_size( 'pressnews-slider', 765, 430, true );
		add_image_size( 'pressnews-single', 1170, 400, true );

		// Adds RSS feed links to for posts and comments.
		add_theme_support( 'automatic-feed-links' );

	}

endif;

// Display a admin notices
add_action( 'admin_notices', 'pressnews_admin_notice' );

function pressnews_admin_notice() {
	global $current_user;
	$user_id = $current_user->ID;
	/* Check that the user hasn't already clicked to ignore the message */
	if ( !get_user_meta( $user_id, 'pressnews_ignore_notice' ) ) {
		echo '<div class="updated notice-info point-notice" style="position:relative;"><p>';
		printf( __( 'Like PressNews theme? You will <strong>LOVE PressNews PRO</strong>! ', 'pressnews' ) . '<a href="' . esc_url( 'http://themes4wp.com/product/pressnews-pro/' ) . '" target="_blank">' . __( 'Click here for all the exciting features.', 'pressnews' ) . '</a><a href="%1$s" class="dashicons dashicons-dismiss dashicons-dismiss-icon" style="position: absolute; top: 8px; right: 8px; color: #222; opacity: 0.4; text-decoration: none !important;"></a>', '?pressnews_notice_ignore=0' );
		echo "</p></div>";
	}
}

add_action( 'admin_init', 'pressnews_notice_ignore' );

function pressnews_notice_ignore() {
	global $current_user;
	$user_id = $current_user->ID;
	/* If user clicks to ignore the notice, add that to their user meta */
	if ( isset( $_GET[ 'pressnews_notice_ignore' ] ) && '0' == $_GET[ 'pressnews_notice_ignore' ] ) {
		add_user_meta( $user_id, 'pressnews_ignore_notice', 'true', true );
	}
}

////////////////////////////////////////////////////////////////////
// Enqueue Styles (normal style.css and bootstrap.css)
////////////////////////////////////////////////////////////////////
function pressnews_theme_stylesheets() {
	wp_enqueue_style( 'pressnews-bootstrap-css', get_template_directory_uri() . '/css/bootstrap.css', array(), '1', 'all' );
	wp_enqueue_style( 'pressnews-stylesheet', get_stylesheet_uri(), array(), '1', 'all' );
	// load Font Awesome css
	wp_enqueue_style( 'pressnews-font-awesome', get_template_directory_uri() . '/css/font-awesome.min.css' );
	// load Flexslider css
	wp_enqueue_style( 'pressnews-stylesheet-flexslider', get_template_directory_uri() . '/css/flexslider.css', 'style' );
}

add_action( 'wp_enqueue_scripts', 'pressnews_theme_stylesheets' );

////////////////////////////////////////////////////////////////////
// Register Bootstrap JS with jquery
////////////////////////////////////////////////////////////////////
function pressnews_theme_js() {
	wp_enqueue_script( 'pressnews-bootstrap-js', get_template_directory_uri() . '/js/bootstrap.min.js', array( 'jquery' ) );
	wp_enqueue_script( 'pressnews-theme-js', get_template_directory_uri() . '/js/customscript.js', array( 'jquery' ) );
	wp_enqueue_script( 'pressnews-flexslider-js', get_template_directory_uri() . '/js/jquery.flexslider-min.js', array( 'jquery' ) );
}

add_action( 'wp_enqueue_scripts', 'pressnews_theme_js' );

////////////////////////////////////////////////////////////////////
// Register Custom Navigation Walker include custom menu widget to use walkerclass
////////////////////////////////////////////////////////////////////

require_once('lib/wp_bootstrap_navwalker.php');

////////////////////////////////////////////////////////////////////
// Theme Info page
////////////////////////////////////////////////////////////////////

if ( is_admin() ) {
	require_once(trailingslashit( get_template_directory() ) . 'lib/theme-info.php');
}


////////////////////////////////////////////////////////////////////
// Register the Sidebar(s)
////////////////////////////////////////////////////////////////////
add_action( 'widgets_init', 'pressnews_widgets_init' );

function pressnews_widgets_init() {
	register_sidebar(
	array(
		'name'			 => __( 'Right Sidebar', 'pressnews' ),
		'id'			 => 'right-sidebar',
		'before_widget'	 => '<div id="%1$s" class="widget %2$s">',
		'after_widget'	 => '</div>',
		'before_title'	 => '<h3 class="widget-title">',
		'after_title'	 => '</h3>',
	) );

	register_sidebar(
	array(
		'name'			 => __( 'Left Sidebar', 'pressnews' ),
		'id'			 => 'left-sidebar',
		'before_widget'	 => '<div id="%1$s" class="widget %2$s">',
		'after_widget'	 => '</div>',
		'before_title'	 => '<h3 class="widget-title">',
		'after_title'	 => '</h3>',
	) );

	register_sidebar(
	array(
		'name'			 => __( 'Front Page: Content Top Section', 'pressnews' ),
		'id'			 => 'front_page_content_top_section',
		'description'	 => __( 'Content Top Section', 'pressnews' ),
		'before_widget'	 => '<div id="%1$s" class="widget %2$s">',
		'after_widget'	 => '</div>',
		'before_title'	 => '<h3 class="widget-title">',
		'after_title'	 => '</h3>',
	) );

	register_sidebar(
	array(
		'name'			 => __( 'Area After First Post', 'pressnews' ),
		'id'			 => 'post-area',
		'description'	 => __( 'Suitable for text widget.', 'pressnews' ),
		'before_widget'	 => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'	 => '</aside>',
		'before_title'	 => '<h3 class="widget-title">',
		'after_title'	 => '</h3>',
	) );
}

////////////////////////////////////////////////////////////////////
// Register hook and action to set Main content area col-md- width based on sidebar declarations
////////////////////////////////////////////////////////////////////

add_action( 'pressnews_main_content_width_hook', 'pressnews_main_content_width_columns' );

function pressnews_main_content_width_columns() {

	$columns = '12';

	if ( get_theme_mod( 'rigth-sidebar-check', 1 ) != 0 ) {
		$columns = $columns - esc_attr( get_theme_mod( 'right-sidebar-size', 3 ) );
	}

	if ( get_theme_mod( 'left-sidebar-check', 0 ) != 0 ) {
		$columns = $columns - esc_attr( get_theme_mod( 'left-sidebar-size', 3 ) );
	}

	echo $columns;
}

function pressnews_main_content_width() {
	do_action( 'pressnews_main_content_width_hook' );
}

////////////////////////////////////////////////////////////////////
// Set Content Width
////////////////////////////////////////////////////////////////////

function pressnews_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'pressnews_content_width', 800 );
}
add_action( 'after_setup_theme', 'pressnews_content_width', 0 );

if ( !function_exists( 'pressnews_breadcrumb' ) ) :
	////////////////////////////////////////////////////////////////////
	// Breadcrumbs
	////////////////////////////////////////////////////////////////////
	function pressnews_breadcrumb() {
		global $post, $wp_query;
		// schema link
		$home		 = esc_html__( 'Home', 'pressnews' );
		$delimiter	 = ' &raquo; ';
		$homeLink	 = home_url();
		if ( is_home() || is_front_page() ) {
			// no need for breadcrumbs in homepage
		} else {
			echo '<div id="breadcrumbs" >';
			echo '<div class="breadcrumbs-inner text-right">';
			// main breadcrumbs lead to homepage
			echo '<span><a href="' . esc_url( $homeLink ) . '">' . '<i class="fa fa-home"></i><span>' . esc_attr( $home ) . '</span>' . '</a></span>' . $delimiter . ' ';
			// if blog page exists
			if ( get_page_by_path( 'blog' ) ) {
				if ( !is_page( 'blog' ) ) {
					echo '<span><a href="' . esc_url( get_permalink( get_page_by_path( 'blog' ) ) ) . '">' . '<span>' . _x( 'Blog', 'Breadcrumbs', 'pressnews' ) . '</span></a></span>' . $delimiter . ' ';
				}
			}
			if ( is_category() ) {
				$thisCat = get_category( get_query_var( 'cat' ), false );
				if ( $thisCat->parent != 0 ) {
					$category_link = get_category_link( $thisCat->parent );
					echo '<span><a href="' . esc_url( $category_link ) . '">' . '<span>' . esc_attr( get_cat_name( $thisCat->parent ) ) . '</span>' . '</a></span>' . $delimiter . ' ';
				}
				$category_id	 = get_cat_ID( single_cat_title( '', false ) );
				$category_link	 = get_category_link( $category_id );
				echo '<span><a href="' . esc_url( $category_link ) . '">' . '<span>' . esc_attr( single_cat_title( '', false ) ) . '</span>' . '</a></span>';
			} elseif ( is_single() && !is_attachment() ) {
				if ( get_post_type() != 'post' ) {
					$post_type	 = get_post_type_object( get_post_type() );
					$slug		 = $post_type->rewrite;
					echo '<span><a href="' . esc_url( $homeLink ) . '/' . $slug[ 'slug' ] . '">' . '<span>' . esc_attr( $post_type->labels->singular_name ) . '</span>' . '</a></span>';
					echo ' ' . $delimiter . ' ' . get_the_title();
				} else {
					$category = get_the_category();
					if ( $category ) {
						foreach ( $category as $cat ) {
							echo '<span><a href="' . esc_url( get_category_link( $cat->term_id ) ) . '">' . '<span>' . esc_attr( $cat->name ) . '</span>' . '</a></span>' . $delimiter . ' ';
						}
					}
					echo get_the_title();
				}
			} elseif ( !is_single() && !is_page() && get_post_type() != 'post' && !is_404() && !is_search() ) {
				$post_type = get_post_type_object( get_post_type() );
				echo $post_type->labels->singular_name;
			} elseif ( is_attachment() ) {
				$parent = get_post( $post->post_parent );
				echo '<span><a href="' . esc_url( get_permalink( $parent ) ) . '">' . '<span>' . esc_attr( $parent->post_title ) . '</span>' . '</a></span>';
				echo ' ' . $delimiter . ' ' . get_the_title();
			} elseif ( is_page() && !$post->post_parent ) {
				$get_post_slug	 = $post->post_name;
				$post_slug		 = str_replace( '-', ' ', $get_post_slug );
				echo '<span><a href="' . esc_url( get_permalink() ) . '">' . '<span>' . esc_attr( ucfirst( $post_slug ) ) . '</span>' . '</a></span>';
			} elseif ( is_page() && $post->post_parent ) {
				$parent_id	 = $post->post_parent;
				$breadcrumbs = array();
				while ( $parent_id ) {
					$page			 = get_page( $parent_id );
					$breadcrumbs[]	 = '<span><a href="' . esc_url( get_permalink( $page->ID ) ) . '">' . '<span>' . esc_attr( get_the_title( $page->ID ) ) . '</span>' . '</a></span>';
					$parent_id		 = $page->post_parent;
				}
				$breadcrumbs = array_reverse( $breadcrumbs );
				for ( $i = 0; $i < count( $breadcrumbs ); $i++ ) {
					echo $breadcrumbs[ $i ];
					if ( $i != count( $breadcrumbs ) - 1 )
						echo ' ' . $delimiter . ' ';
				}
				echo $delimiter . '<span><a href="' . esc_url( get_permalink() ) . '">' . '<span>' . esc_attr( the_title_attribute( 'echo=0' ) ) . '</span>' . '</a></span>';
			}
			elseif ( is_tag() ) {
				$tag_id = get_term_by( 'name', single_cat_title( '', false ), 'post_tag' );
				if ( $tag_id ) {
					$tag_link = get_tag_link( $tag_id->term_id );
				}
				echo '<span><a href="' . esc_url( $tag_link ) . '">' . '<span>' . esc_attr( single_cat_title( '', false ) ) . '</span>' . '</a></span>';
			} elseif ( is_author() ) {
				global $author;
				$userdata = get_userdata( $author );
				echo '<span><a href="' . esc_url( get_author_posts_url( $userdata->ID ) ) . '">' . '<span>' . esc_attr( $userdata->display_name ) . '</span>' . '</a></span>';
			} elseif ( is_404() ) {
				echo esc_html__( 'Search results for', 'pressnews' ) . ' ' . get_search_query();
			} elseif ( is_search() ) {
				echo 'Search results for "' . esc_attr( get_search_query() ) . '"';
			} elseif ( is_day() ) {
				echo '<span><a href="' . esc_url( get_year_link( get_the_time( 'Y' ) ) ) . '">' . '<span>' . esc_attr( get_the_time( 'Y' ) ) . '</span>' . '</a></span>' . $delimiter . ' ';
				echo '<span><a href="' . esc_url( get_month_link( get_the_time( 'Y' ) ), get_the_time( 'm' ) ) . '">' . '<span>' . esc_attr( get_the_time( 'F' ) ) . '</span>' . '</a></span>' . $delimiter . ' ';
				echo '<span><a href="' . esc_url( get_day_link( get_the_time( 'Y' ) ), get_the_time( 'm' ), get_the_time( 'd' ) ) . '">' . '<span>' . esc_attr( get_the_time( 'd' ) ) . '</span>' . '</a></span>';
			} elseif ( is_month() ) {
				echo '<span><a href="' . esc_url( get_year_link( get_the_time( 'Y' ) ) ) . '">' . '<span>' . esc_attr( get_the_time( 'Y' ) ) . '</span>' . '</a></span>' . $delimiter . ' ';
				echo '<span><a href="' . esc_url( get_month_link( get_the_time( 'Y' ), get_the_time( 'm' ) ) ) . '">' . '<span>' . esc_attr( get_the_time( 'F' ) ) . '</span>' . '</a></span>';
			} elseif ( is_year() ) {
				echo '<span><a href="' . esc_url( get_year_link( get_the_time( 'Y' ) ) ) . '">' . '<span>' . esc_attr( get_the_time( 'Y' ) ) . '</span>' . '</a></span>';
			}
			if ( get_query_var( 'paged' ) ) {
				if ( is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author() )
					echo ' (';
				echo esc_html__( 'Page', 'pressnews' ) . ' ' . get_query_var( 'paged' );
				if ( is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author() )
					echo ')';
			}
			echo '</div></div>';
		}
	}

endif;

////////////////////////////////////////////////////////////////////
// Excerpt functions
////////////////////////////////////////////////////////////////////
function pressnews_excerpt_length( $length ) {
	return 15;
}

add_filter( 'excerpt_length', 'pressnews_excerpt_length', 999 );

function pressnews_excerpt_more( $more ) {
	return '...';
}

add_filter( 'excerpt_more', 'pressnews_excerpt_more' );
