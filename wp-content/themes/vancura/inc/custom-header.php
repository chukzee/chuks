<?php
/**
 * Custom header implementation
 */

function vancura_custom_header_setup() {

	add_theme_support( 'custom-header', apply_filters( 'vancura_custom_header_args', array(

		'default-text-color'     => 'fff',
		'header-text' 			 =>	false,
		'width'                  => 1600,
		'height'                 => 400,
		'wp-head-callback'       => 'vancura_header_style',
	) ) );
}

add_action( 'after_setup_theme', 'vancura_custom_header_setup' );

if ( ! function_exists( 'vancura_header_style' ) ) :
/**
 * Styles the header image and text displayed on the blog
 *
 * @see vancura_custom_header_setup().
 */
add_action( 'wp_enqueue_scripts', 'vancura_header_style' );
function vancura_header_style() {
	//Check if user has defined any header image.
	if ( get_header_image() ) :
	$custom_css = "
        .top-header {
			background-image:url('".esc_url(get_header_image())."');
			background-position: center top;
		}";
	   	wp_add_inline_style( 'vancura-basic-style', $custom_css );
	endif;
}
endif; // vancura_header_style