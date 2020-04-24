<?php
/**
 * Defines customizer options
 *
 * @package Customizer Library Demo
 */

function customizer_library_demo_options() {

	// Theme defaults
	$primary_color = '#0091cd';
	$secondary_color = '#004b79';
	$link_hover_color = "#ff0000";

	// Stores all the controls that will be added
	$options = array();

	// Stores all the sections to be added
	$sections = array();

	// Stores all the panels to be added
	$panels = array();

	// Adds the sections to the $options array
	$options['sections'] = $sections;

	// More Examples
	$section = 'examples';

	// Arrays 

	$layout_choices = array(
		'choice-1' => 'Responsive Layout',
		'choice-2' => 'Fixed Layout'
	);

	$ad_position_choices = array(
		'1','2', '3','4','5','6','7','8','9','10'													
	);
	
	$sections[] = array(
		'id' => $section,
		'title' => __( 'Theme Settings', 'newsnow' ),
		'priority' => '10'
	);

	$options['logo'] = array(
		'id' => 'logo',
		'label'   => __( 'Logo', 'newsnow' ),
		'section' => $section,
		'type'    => 'image',
		'default' => get_template_directory_uri().'/assets/img/logo.png'
	);

	$options['favicon'] = array(
		'id' => 'favicon',
		'label'   => __( 'Favicon', 'newsnow' ),
		'section' => $section,
		'type'    => 'image',
		'default' => ''
	);	

	$options['site-layout'] = array(
		'id' => 'site-layout',
		'label'   => __( 'Site Layout', 'newsnow' ),
		'section' => $section,
		'type'    => 'radio',
		'choices' => $layout_choices,
		'default' => 'choice-1'
	);

	$options['header-search-on'] = array(
		'id' => 'header-search-on',
		'label'   => __( 'Display header search form', 'newsnow' ),
		'section' => $section,
		'type'    => 'checkbox',
		'default' => true,
	);	

	$options['primary-nav-heading'] = array(
		'id' => 'primary-nav-heading',
		'label'   => __( 'Mobile Primary Menu Heading Text', 'newsnow' ),
		'section' => $section,
		'type'    => 'text',
		'default' => __('Pages', 'newsnow'),
	);

	$options['secondary-nav-heading'] = array(
		'id' => 'secondary-nav-heading',
		'label'   => __( 'Mobile Secondary Menu Heading Text', 'newsnow' ),
		'section' => $section,
		'type'    => 'text',
		'default' => __('Categories', 'newsnow'),
	);					

	$options['top-section-on'] = array(
		'id' => 'top-section-on',
		'label'   => __( 'Display top section (featured & latest) on homepage', 'newsnow' ),
		'section' => $section,
		'type'    => 'checkbox',
		'default' => 1,
	);

	$options['latest-posts-num'] = array(
		'id' => 'latest-posts-num',
		'label'   => __( 'Number of latest posts to show', 'newsnow' ),
		'section' => $section,
		'type'    => 'select',
		'choices' => $ad_position_choices,		
		'default' => '5',
	);

	$options['all-posts-url'] = array(
		'id' => 'all-posts-url',
		'label'   => __( 'Page URL to display all latest posts', 'newsnow' ),
		'section' => $section,
		'type'    => 'url',
		'default' => home_url() . '/latest',
	);	

	$options['home-excerpt-length'] = array(
		'id' => 'home-excerpt-length',
		'label'   => __( 'Number of excerpt words (home)', 'newsnow' ),
		'section' => $section,
		'type'    => 'text',
		'default' => '18',		
	);

	$options['archive-excerpt-length'] = array(
		'id' => 'archive-excerpt-length',
		'label'   => __( 'Number of excerpt words (archive)', 'newsnow' ),
		'section' => $section,
		'type'    => 'text',
		'default' => '33',		
	);

	$options['single-featured-on'] = array(
		'id' => 'single-featured-on',
		'label'   => __( 'Display featured image on single posts', 'newsnow' ),
		'section' => $section,
		'type'    => 'checkbox',
		'default' => false,
	);	
	
	$options['footer-widgets-on'] = array(
		'id' => 'footer-widgets-on',
		'label'   => __( 'Display footer widgets', 'newsnow' ),
		'section' => $section,
		'type'    => 'checkbox',
		'default' => 1,
	);
		
	//$options['example-range'] = array(
	//	'id' => 'example-range',
	//	'label'   => __( 'Example Range Input', 'newsnow' ),
	//	'section' => $section,
	//	'type'    => 'range',
	//	'input_attrs' => array(
	//      'min'   => 0,
	//        'max'   => 10,
	//        'step'  => 1,
	//       'style' => 'color: #0a0',
	//	)
	//);

	// Adds the sections to the $options array
	$options['sections'] = $sections;

	// Adds the panels to the $options array
	$options['panels'] = $panels;

	$customizer_library = Customizer_Library::Instance();
	$customizer_library->add_options( $options );

	// To delete custom mods use: customizer_library_remove_theme_mods();

}
add_action( 'init', 'customizer_library_demo_options' );