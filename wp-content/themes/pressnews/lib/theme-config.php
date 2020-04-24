<?php

/**
 * Kirki Advanced Customizer
 * This is a sample configuration file to demonstrate all fields & capabilities.
 * @package pressnews
 */
// Early exit if Kirki is not installed
if ( !class_exists( 'Kirki' ) ) {
	return;
}
/* Register Kirki config */
Kirki::add_config( 'pressnews_settings', array(
	'capability'	 => 'edit_theme_options',
	'option_type'	 => 'theme_mod',
) );

/**
 * Add sections
 */
Kirki::add_section( 'sidebar_section', array(
	'title'			 => __( 'Sidebars', 'pressnews' ),
	'priority'		 => 10,
	'description'	 => __( 'Sidebar layouts.', 'pressnews' ),
) );

Kirki::add_section( 'layout_section', array(
	'title'			 => __( 'Main styling', 'pressnews' ),
	'priority'		 => 10,
	'description'	 => __( 'Define theme layout', 'pressnews' ),
) );


Kirki::add_section( 'post_section', array(
	'title'			 => __( 'Post settings', 'pressnews' ),
	'priority'		 => 10,
	'description'	 => __( 'Single post settings', 'pressnews' ),
) );

Kirki::add_section( 'site_bg_section', array(
	'title'		 => __( 'Site Background', 'pressnews' ),
	'priority'	 => 10,
) );
Kirki::add_section( 'colors_section', array(
	'title'		 => __( 'Colors', 'pressnews' ),
	'priority'	 => 10,
) );
Kirki::add_section( 'links_section', array(
	'title'		 => __( 'Theme Important Links', 'pressnews' ),
	'priority'	 => 190,
) );


/**
 * Add controls using the 'pressnews/fields' filter.
 */
Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'rigth-sidebar-check',
	'label'			 => __( 'Right Sidebar', 'pressnews' ),
	'description'	 => __( 'Enable the Right Sidebar', 'pressnews' ),
	'section'		 => 'sidebar_section',
	'default'		 => 1,
	'priority'		 => 10,
) );

Kirki::add_field( 'pressnews_settings', array(
	'type'		 => 'radio-buttonset',
	'settings'	 => 'right-sidebar-size',
	'label'		 => __( 'Right Sidebar Size', 'pressnews' ),
	'section'	 => 'sidebar_section',
	'default'	 => '3',
	'priority'	 => 10,
	'choices'	 => array(
		'1'	 => '1',
		'2'	 => '2',
		'3'	 => '3',
		'4'	 => '4',
		'5'	 => '5'
	),
	'required'	 => array(
		array(
			'setting'	 => 'rigth-sidebar-check',
			'operator'	 => '==',
			'value'		 => 1,
		),
	)
) );

Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'left-sidebar-check',
	'label'			 => __( 'Left Sidebar', 'pressnews' ),
	'description'	 => __( 'Enable the Left Sidebar', 'pressnews' ),
	'section'		 => 'sidebar_section',
	'default'		 => 0,
	'priority'		 => 10,
) );

Kirki::add_field( 'pressnews_settings', array(
	'type'		 => 'radio-buttonset',
	'settings'	 => 'left-sidebar-size',
	'label'		 => __( 'Left Sidebar Size', 'pressnews' ),
	'section'	 => 'sidebar_section',
	'default'	 => '2',
	'priority'	 => 10,
	'choices'	 => array(
		'1'	 => '1',
		'2'	 => '2',
		'3'	 => '3',
		'4'	 => '4',
		'5'	 => '5'
	),
	'required'	 => array(
		array(
			'setting'	 => 'left-sidebar-check',
			'operator'	 => '==',
			'value'		 => 1,
		),
	)
) );


Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'image',
	'settings'		 => 'header-logo',
	'label'			 => __( 'Logo', 'pressnews' ),
	'description'	 => __( 'Upload your logo', 'pressnews' ),
	'section'		 => 'layout_section',
	'default'		 => '',
	'priority'		 => 10,
) );
Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'get-featured',
	'label'			 => __( 'Slider', 'pressnews' ),
	'description'	 => __( 'Enable or disable slider on homepage', 'pressnews' ),
	'section'		 => 'layout_section',
	'default'		 => 0,
	'priority'		 => 10,
) );


Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'select',
	'settings'		 => 'featured-categories',
	'label'			 => __( 'Slider category', 'pressnews' ),
	'description'	 => __( 'Select category for slider', 'pressnews' ),
	'section'		 => 'layout_section',
	'default'		 => '',
	'priority'		 => 10,
	'choices'		 => pressnews_get_cats(),
	'required'		 => array(
		array(
			'setting'	 => 'get-featured',
			'operator'	 => '==',
			'value'		 => 1,
		),
	)
) );


Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'related-posts-check',
	'label'			 => __( 'Related posts', 'pressnews' ),
	'description'	 => __( 'Enable or disable related posts', 'pressnews' ),
	'section'		 => 'post_section',
	'default'		 => 1,
	'priority'		 => 10,
) );
Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'author-check',
	'label'			 => __( 'Author box', 'pressnews' ),
	'description'	 => __( 'Enable or disable author box', 'pressnews' ),
	'section'		 => 'post_section',
	'default'		 => 1,
	'priority'		 => 10,
) );
Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'post-nav-check',
	'label'			 => __( 'Post navigation', 'pressnews' ),
	'description'	 => __( 'Enable or disable navigation below post content', 'pressnews' ),
	'section'		 => 'post_section',
	'default'		 => 1,
	'priority'		 => 10,
) );
Kirki::add_field( 'pressnews_settings', array(
	'type'			 => 'switch',
	'settings'		 => 'breadcrumbs-check',
	'label'			 => __( 'Breadcrumbs', 'pressnews' ),
	'description'	 => __( 'Enable or disable Breadcrumbs', 'pressnews' ),
	'section'		 => 'post_section',
	'default'		 => 1,
	'priority'		 => 10,
) );

Kirki::add_field( 'pressnews_settings', array(
	'type'		 => 'color',
	'settings'	 => 'color_site_title',
	'label'		 => __( 'Site title color', 'pressnews' ),
	'help'		 => __( 'Site title text color, if not defined logo.', 'pressnews' ),
	'section'	 => 'colors_section',
	'default'	 => '#222',
	'priority'	 => 10,
	'output'	 => array(
		array(
			'element'	 => '.rsrc-header-text a',
			'property'	 => 'color',
			'units'		 => ' !important',
		),
	),
) );
Kirki::add_field( 'pressnews_settings', array(
	'type'		 => 'color',
	'settings'	 => 'color_site_desc',
	'label'		 => __( 'Site description color', 'pressnews' ),
	'help'		 => __( 'Site title text color, if not defined logo.', 'pressnews' ),
	'section'	 => 'colors_section',
	'default'	 => '#B6B6B6',
	'priority'	 => 10,
	'output'	 => array(
		array(
			'element'	 => 'h2.site-desc, h3.site-desc',
			'property'	 => 'color',
		),
	),
) );


Kirki::add_field( 'pressnews_settings', array(
	'type'		 => 'background',
	'settings'	 => 'background_site',
	'label'		 => __( 'Background', 'pressnews' ),
	'section'	 => 'site_bg_section',
	'default'	 => array(
		'background-color'		 => '#f4f4f4',
		'background-image'		 => '',
		'background-repeat'		 => 'no-repeat',
		'background-size'		 => 'cover',
		'background-attachment'	 => 'fixed',
		'background-position'	 => 'center-top',
	),
	'priority'	 => 10,
	'output'	 => array(
		array(
			'element' => 'body',
		),
	),
) );

$theme_links = array(
	'documentation'	 => array(
		'link'		 => esc_url( 'http://demo.themes4wp.com/documentation/category/pressnews/' ),
		'text'		 => __( 'Documentation', 'pressnews' ),
		'settings'	 => 'theme-docs',
	),
	'support'		 => array(
		'link'		 => esc_url( 'http://support.themes4wp.com/' ),
		'text'		 => __( 'Support', 'pressnews' ),
		'settings'	 => 'theme-support',
	),
	'demo'			 => array(
		'link'		 => esc_url( 'http://demo.themes4wp.com/pressnews/' ),
		'text'		 => __( 'View Demo', 'pressnews' ),
		'settings'	 => 'theme-demo',
	),
	'rating'		 => array(
		'link'		 => esc_url( 'https://wordpress.org/support/view/theme-reviews/pressnews?filter=5' ),
		'text'		 => __( 'Rate This Theme', 'pressnews' ),
		'settings'	 => 'theme-rate',
	)
);

foreach ( $theme_links as $theme_link ) {
	Kirki::add_field( 'blogr_settings', array(
		'type'		 => 'custom',
		'settings'	 => $theme_link[ 'settings' ],
		'section'	 => 'links_section',
		'default'	 => '<div style="padding: 10px; text-align: center; font-size: 20px; font-weight: bold;"><a target="_blank" href="' . $theme_link[ 'link' ] . '" >' . esc_attr( $theme_link[ 'text' ] ) . ' </a></div>',
		'priority'	 => 10,
	) );
}

/**
 * Configuration sample for the pressnews Customizer.
 */
function pressnews_configuration_sample() {

	$config[ 'color_back' ]		 = '#192429';
	$config[ 'color_accent' ]	 = '#008ec2';
	$config[ 'width' ]			 = '25%';

	return $config;
}

add_filter( 'kirki/config', 'pressnews_configuration_sample' );

function pressnews_get_cats() {
	/* GET LIST OF CATEGORIES */
	$layercats		 = get_categories();
	$newList		 = array();
	$newList['0']	 = __( 'All categories', 'pressnews' );
	foreach ( $layercats as $category ) {
		$newList[ $category->term_id ] = $category->cat_name;
	}
	return $newList;
}
