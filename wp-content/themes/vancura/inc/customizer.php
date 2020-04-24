<?php
/**
 * vancura: Customizer
 *
 * @package WordPress
 * @subpackage vancura
 * @since 1.0
 */

use WPTRT\Customize\Section\Vancura_Button;

add_action( 'customize_register', function( $manager ) {

	$manager->register_section_type( Vancura_Button::class );

	$manager->add_section(
		new Vancura_Button( $manager, 'vancura_pro', [
			'title'       => __( 'Vancura Pro', 'vancura' ),
			'priority'    => 0,
			'button_text' => __( 'Go Pro', 'vancura' ),
			'button_url'  => 'https://www.luzuk.com/themes/vancura-business-wordpress-theme/'
		] )
	);

} );

// Load the JS and CSS.
add_action( 'customize_controls_enqueue_scripts', function() {

	$version = wp_get_theme()->get( 'Version' );

	wp_enqueue_script(
		'vancura-customize-section-button',
		get_theme_file_uri( 'vendor/wptrt/customize-section-button/public/js/customize-controls.js' ),
		[ 'customize-controls' ],
		$version,
		true
	);

	wp_enqueue_style(
		'vancura-customize-section-button',
		get_theme_file_uri( 'vendor/wptrt/customize-section-button/public/css/customize-controls.css' ),
		[ 'customize-controls' ],
 		$version
	);

} );

function vancura_customize_register( $wp_customize ) {

	$wp_customize->add_panel( 'vancura_panel_id', array(
	    'priority' => 10,
	    'capability' => 'edit_theme_options',
	    'theme_supports' => '',
	    'title' => __( 'Theme Settings', 'vancura' ),
	    'description' => __( 'Description of what this panel does.', 'vancura' ),
	) );

	$wp_customize->add_section( 'vancura_theme_options_section', array(
    	'title'      => __( 'General Settings', 'vancura' ),
		'priority'   => 30,
		'panel' => 'vancura_panel_id'
	) );

	// Add Settings and Controls for Layout
	$wp_customize->add_setting('vancura_theme_options',array(
        'default' => __('Right Sidebar','vancura'),
        'sanitize_callback' => 'vancura_sanitize_choices'	        
	));

	$wp_customize->add_control('vancura_theme_options',array(
        'type' => 'radio',
        'label' => __('Do you want this section','vancura'),
        'section' => 'vancura_theme_options_section',
        'choices' => array(
            'Left Sidebar' => __('Left Sidebar','vancura'),
            'Right Sidebar' => __('Right Sidebar','vancura'),
            'One Column' => __('One Column','vancura'),
            'Three Columns' => __('Three Columns','vancura'),
            'Four Columns' => __('Four Columns','vancura'),
            'Grid Layout' => __('Grid Layout','vancura')
        ),
	));

	// Top Bar
	$wp_customize->add_section( 'vancura_top_bar', array(
    	'title'      => __( 'Contact Details', 'vancura' ),
		'priority'   => null,
		'panel' => 'vancura_panel_id'
	) );

	$wp_customize->add_setting('vancura_phone_number',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_phone_number',array(
		'label'	=> __('Add Phone Number','vancura'),
		'section'=> 'vancura_top_bar',
		'setting'=> 'vancura_phone_number',
		'type'=> 'text'
	));

	$wp_customize->add_setting('vancura_email_address',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_email_address',array(
		'label'	=> __('Add Email Address','vancura'),
		'section'=> 'vancura_top_bar',
		'setting'=> 'vancura_email_address',
		'type'=> 'text'
	));

	$wp_customize->add_setting('vancura_address',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_address',array(
		'label'	=> __('Add Address','vancura'),
		'section'=> 'vancura_top_bar',
		'setting'=> 'vancura_address',
		'type'=> 'text'
	));

	$wp_customize->add_setting('vancura_btn_text',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_btn_text',array(
		'label'	=> __('Add Button Text','vancura'),
		'section'	=> 'vancura_top_bar',
		'setting'	=> 'vancura_btn_text',
		'type'	=> 'text'
	));

	$wp_customize->add_setting('vancura_btn_link',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_btn_link',array(
		'label'	=> __('Add Button Link','vancura'),
		'section'	=> 'vancura_top_bar',
		'setting'	=> 'vancura_btn_link',
		'type'	=> 'url'
	));

	//social icons
	$wp_customize->add_section( 'vancura_social', array(
    	'title'      => __( 'Social Icons', 'vancura' ),
		'priority'   => null,
		'panel' => 'vancura_panel_id'
	) );

	$wp_customize->add_setting('vancura_facebook_url',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_facebook_url',array(
		'label'	=> __('Add Facebook link','vancura'),
		'section'	=> 'vancura_social',
		'setting'	=> 'vancura_facebook_url',
		'type'	=> 'url'
	));

	$wp_customize->add_setting('vancura_twitter_url',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_twitter_url',array(
		'label'	=> __('Add Twitter link','vancura'),
		'section'	=> 'vancura_social',
		'setting'	=> 'vancura_twitter_url',
		'type'	=> 'url'
	));

	$wp_customize->add_setting('vancura_google_plus_url',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_google_plus_url',array(
		'label'	=> __('Add Google Plus link','vancura'),
		'section'	=> 'vancura_social',
		'setting'	=> 'vancura_google_plus_url',
		'type'	=> 'url'
	));

	$wp_customize->add_setting('vancura_linkedin_url',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));
	$wp_customize->add_control('vancura_linkedin_url',array(
		'label'	=> __('Add Linkedin link','vancura'),
		'section'	=> 'vancura_social',
		'setting'	=> 'vancura_linkedin_url',
		'type'	=> 'url'
	));

	$wp_customize->add_setting('vancura_rss_url',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_rss_url',array(
		'label'	=> __('Add RSS link','vancura'),
		'section'	=> 'vancura_social',
		'setting'	=> 'vancura_rss_url',
		'type'	=> 'url'
	));

	$wp_customize->add_setting('vancura_youtube_url',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_youtube_url',array(
		'label'	=> __('Add Youtube link','vancura'),
		'section'	=> 'vancura_social',
		'setting'	=> 'vancura_youtube_url',
		'type'	=> 'url'
	));

	//home page slider
	$wp_customize->add_section( 'vancura_slider_section' , array(
    	'title'      => __( 'Slider Settings', 'vancura' ),
		'priority'   => null,
		'panel' => 'vancura_panel_id'
	) );

	$wp_customize->add_setting('vancura_slider_hide_show',array(
       	'default' => 'true',
       	'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('vancura_slider_hide_show',array(
	   	'type' => 'checkbox',
	   	'label' => __('Show / Hide slider','vancura'),
	   	'description' => __('Image Size ( 1400px x 800px )','vancura'),
	   	'section' => 'vancura_slider_section',
	));

	$wp_customize->add_setting('vancura_slider_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_slider_number',array(
		'label'	=> __('Number of Sliders to show','vancura'),
		'section'	=> 'vancura_slider_section',
		'type'		=> 'number'
	));

	$slider =  get_theme_mod('vancura_slider_number');

	for ( $count = 1; $count <= $slider; $count++ ) {

		$wp_customize->add_setting( 'vancura_slider' . $count, array(
			'default'           => '',
			'sanitize_callback' => 'vancura_sanitize_dropdown_pages'
		) );

		$wp_customize->add_control( 'vancura_slider' . $count, array(
			'label'    => __( 'Select Slide Image Page', 'vancura' ),
			'section'  => 'vancura_slider_section',
			'type'     => 'dropdown-pages'
		) );
	}

	// Our Services 
	$wp_customize->add_section('vancura_service_section',array(
		'title'	=> __('Our Services','vancura'),
		'description'=> __('This section will appear below the slider.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_title_page',array(
		'default' => '',
		'sanitize_callback' => 'vancura_sanitize_dropdown_pages',
	));
	$wp_customize->add_control('vancura_title_page',array(
		'label' => __('Select Service Title page','vancura'),
		'description' => __('Image Size ( 263px x 278px )','vancura'),
		'section' => 'vancura_service_section',
		'type'    => 'dropdown-pages',
	));

	$wp_customize->add_setting('vancura_service_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_service_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'section'	=> 'vancura_service_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_service_cat1',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_service_cat1',array(
		'type'    => 'select',
		'choices' => $cat_pst,
		'label' => __('Select Category to display Left Side Posts','vancura'),
		'description' => __('Image Size ( 68px x 26px )','vancura'),
		'section' => 'vancura_service_section',
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst2[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst2[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_service_cat2',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_service_cat2',array(
		'type'    => 'select',
		'choices' => $cat_pst2,
		'label' => __('Select Category to display Right Side Posts','vancura'),
		'description' => __('Image Size ( 68px x 26px )','vancura'),
		'section' => 'vancura_service_section',
	));

	//About Us
	$wp_customize->add_section('vancura_about',array(
		'title'	=> __('About Us','vancura'),
		'description'	=> __('Add About Us below.','vancura'),
		'panel' => 'vancura_panel_id',
	));

	$wp_customize->add_setting('vancura_about_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_about_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_about',
		'setting'	=> 'vancura_about_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_about_page',array(
		'default' => '',
		'sanitize_callback' => 'vancura_sanitize_dropdown_pages',
	));
	$wp_customize->add_control('vancura_about_page',array(
		'label' => __('Select About page','vancura'),
		'description' => __('Image Size ( 483px x 489px )','vancura'),
		'section' => 'vancura_about',
		'type'    => 'dropdown-pages',
	));

	// Our steps 
	$wp_customize->add_section('vancura_steps_section',array(
		'title'	=> __('Our Steps','vancura'),
		'description'=> __('This section will appear below the About section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_steps_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_steps_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_steps_section',
		'setting'	=> 'vancura_steps_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_steps_subline',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_steps_subline',array(
		'label'	=> __('Add section subtitle','vancura'),
		'section'	=> 'vancura_steps_section',
		'setting'	=> 'vancura_steps_subline',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_steps_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_steps_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'section'	=> 'vancura_steps_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst3[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst3[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_steps_cat',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_steps_cat',array(
		'type'    => 'select',
		'choices' => $cat_pst3,
		'label' => __('Select Category to display steps Posts','vancura'),
		'section' => 'vancura_steps_section',
	));

	// Counter Section
	$wp_customize->add_section('vancura_counter_section',array(
		'title'	=> __('Counter Section','vancura'),
		'description'=> __('This section will appear below the Our Steps section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_counter_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_counter_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_counter_section',
		'setting'	=> 'vancura_counter_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_counter_subline',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_counter_subline',array(
		'label'	=> __('Add section subtitle','vancura'),
		'section'	=> 'vancura_counter_section',
		'setting'	=> 'vancura_counter_subline',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_counter_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_counter_number',array(
		'label'	=> __('Number of counter to display','vancura'),
		'section'	=> 'vancura_counter_section',
		'type'		=> 'number'
	));

	$j =  get_theme_mod('vancura_counter_number','4');

	for ($i=1; $i <= $j; $i++) { 
		
		$wp_customize->add_setting('vancura_counter_count '. $i,array(
			'default'	=> '',
			'sanitize_callback'	=> 'sanitize_text_field',
		));
		$wp_customize->add_control('vancura_counter_count '. $i,array(
			'label'	=> __('Count ','vancura'). $i,
			'section'	=> 'vancura_counter_section',
			'type'		=> 'number'
		));

		$wp_customize->add_setting('vancura_counter_name '. $i,array(
			'default'	=> '',
			'sanitize_callback'	=> 'sanitize_text_field'
		));	
		$wp_customize->add_control('vancura_counter_name '. $i,array(
			'label'	=> __('Add Counter Name ','vancura'). $i,
			'section'	=> 'vancura_counter_section',
			'setting'	=> 'vancura_counter_name '. $i,
			'type'		=> 'text'
		));

	}

	// Our Team 
	$wp_customize->add_section('vancura_team_section',array(
		'title'	=> __('Our Team','vancura'),
		'description'=> __('This section will appear below the Counter section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_team_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_team_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_team_section',
		'setting'	=> 'vancura_team_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_team_subline',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_team_subline',array(
		'label'	=> __('Add section subtitle','vancura'),
		'section'	=> 'vancura_team_section',
		'setting'	=> 'vancura_team_subline',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_team_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_team_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'description' => __('Image Size ( 254px x 282px )','vancura'),
		'section'	=> 'vancura_team_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst4[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst4[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_team_cat',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_team_cat',array(
		'type'    => 'select',
		'choices' => $cat_pst4,
		'label' => __('Select Category to display Team Posts','vancura'),
		'section' => 'vancura_team_section',
	));

	// Our Facilities 
	$wp_customize->add_section('vancura_facilities_section',array(
		'title'	=> __('Our Facilities','vancura'),
		'description'=> __('This section will appear below the Team section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_facilities_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_facilities_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_facilities_section',
		'setting'	=> 'vancura_facilities_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_facilities_subline',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_facilities_subline',array(
		'label'	=> __('Add section subtitle','vancura'),
		'section'	=> 'vancura_facilities_section',
		'setting'	=> 'vancura_facilities_subline',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_facilities_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_facilities_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'description' => __('Image Size ( 43px x 35px )','vancura'),
		'section'	=> 'vancura_facilities_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst5[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst5[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_facilities_cat',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_facilities_cat',array(
		'type'    => 'select',
		'choices' => $cat_pst5,
		'label' => __('Select Category to display Facilities Posts','vancura'),
		'section' => 'vancura_facilities_section',
	));

	// Recent Projects
	$wp_customize->add_section('vancura_projects_section',array(
		'title'	=> __('Recent Projects','vancura'),
		'description'=> __('This section will appear below the Team section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_projects_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_projects_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_projects_section',
		'setting'	=> 'vancura_projects_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_projects_subline',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_projects_subline',array(
		'label'	=> __('Add section subtitle','vancura'),
		'section'	=> 'vancura_projects_section',
		'setting'	=> 'vancura_projects_subline',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_projects_number',array(
		'default'	=> 0,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_projects_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'section'	=> 'vancura_projects_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst8[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst8[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_projects_cat',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_projects_cat',array(
		'type'    => 'select',
		'choices' => $cat_pst8,
		'label' => __('Select Category to display Recent Projects Posts','vancura'),
		'section' => 'vancura_projects_section',
	));

	// Testimonials Section
	$wp_customize->add_section('vancura_testimonials_section',array(
		'title'	=> __('Testimonials Section','vancura'),
		'description'=> __('This section will appear below the Recent Projects section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_testimonials_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_testimonials_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_testimonials_section',
		'setting'	=> 'vancura_testimonials_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_testimonials_number',array(
		'default'	=> 2,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_testimonials_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'description' => __('Image Size ( 43px x 35px )','vancura'),
		'section'	=> 'vancura_testimonials_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst6[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst6[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_testimonials_cat',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_testimonials_cat',array(
		'type'    => 'select',
		'choices' => $cat_pst6,
		'label' => __('Select Category to display Testimonials Posts','vancura'),
		'section' => 'vancura_testimonials_section',
	));

	// Our Clients 
	$wp_customize->add_section('vancura_clients_section',array(
		'title'	=> __('Our Clients Section','vancura'),
		'description'=> __('This section will appear below the Testimonials section.','vancura'),
		'panel' => 'vancura_panel_id',
	));
	
	$wp_customize->add_setting('vancura_clients_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_clients_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_clients_section',
		'setting'	=> 'vancura_clients_title',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_clients_subline',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_clients_subline',array(
		'label'	=> __('Add section subtitle','vancura'),
		'section'	=> 'vancura_clients_section',
		'setting'	=> 'vancura_clients_subline',
		'type'		=> 'text'
	));

	$wp_customize->add_setting('vancura_clients_number',array(
		'default'	=> 4,
		'sanitize_callback'	=> 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_clients_number',array(
		'label'	=> __('Number of posts to show in a category','vancura'),
		'description' => __('Image Size ( 360px x 350px )','vancura'),
		'section'	=> 'vancura_clients_section',
		'type'		=> 'number'
	));

	$categories = get_categories();
	$cats = array();
	$i = 0;
	$cat_pst7[]= 'select';
	foreach($categories as $category){
		if($i==0){
			$default = $category->slug;
			$i++;
		}
		$cat_pst7[$category->slug] = $category->name;
	}

	$wp_customize->add_setting('vancura_clients_cat',array(
		'default'	=> 'select',
		'sanitize_callback' => 'sanitize_text_field',
	));
	$wp_customize->add_control('vancura_clients_cat',array(
		'type'    => 'select',
		'choices' => $cat_pst7,
		'label' => __('Select Category to display Clients Posts','vancura'),
		'section' => 'vancura_clients_section',
	));

	//Latest Posts
	$wp_customize->add_section( 'vancura_latest_posts', array(
    	'title'      => __( 'Latest Posts', 'vancura' ),
		'priority'   => null,
		'panel' => 'vancura_panel_id'
	) );

	$wp_customize->add_setting('vancura_latest_posts_title',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_latest_posts_title',array(
		'label'	=> __('Section Title','vancura'),
		'section'	=> 'vancura_latest_posts',
		'setting'	=> 'vancura_latest_posts_title',
		'type'	=> 'text'
	));

	$wp_customize->add_setting('vancura_latest_posts_btn_text',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_latest_posts_btn_text',array(
		'label'	=> __('Add Button Text','vancura'),
		'section'	=> 'vancura_latest_posts',
		'setting'	=> 'vancura_latest_posts_btn_text',
		'type'	=> 'text'
	));

	$wp_customize->add_setting('vancura_latest_posts_btn_link',array(
		'default'	=> '',
		'sanitize_callback'	=> 'esc_url_raw'
	));	
	$wp_customize->add_control('vancura_latest_posts_btn_link',array(
		'label'	=> __('Add Button Link','vancura'),
		'section'	=> 'vancura_latest_posts',
		'setting'	=> 'vancura_latest_posts_btn_link',
		'type'	=> 'url'
	));

	//Footer
    $wp_customize->add_section( 'vancura_footer', array(
    	'title'      => __( 'Footer Text', 'vancura' ),
		'priority'   => null,
		'panel' => 'vancura_panel_id'
	) );

    $wp_customize->add_setting('vancura_footer_copy',array(
		'default'	=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));	
	$wp_customize->add_control('vancura_footer_copy',array(
		'label'	=> __('Footer Text','vancura'),
		'section'	=> 'vancura_footer',
		'setting'	=> 'vancura_footer_copy',
		'type'		=> 'text'
	));

	$wp_customize->get_setting( 'blogname' )->transport          = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport   = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport  = 'postMessage';

	$wp_customize->selective_refresh->add_partial( 'blogname', array(
		'selector' => '.site-title a',
		'render_callback' => 'vancura_customize_partial_blogname',
	) );
	$wp_customize->selective_refresh->add_partial( 'blogdescription', array(
		'selector' => '.site-description',
		'render_callback' => 'vancura_customize_partial_blogdescription',
	) );

	//front page
	$num_sections = apply_filters( 'vancura_front_page_sections', 4 );

	// Create a setting and control for each of the sections available in the theme.
	for ( $i = 1; $i < ( 1 + $num_sections ); $i++ ) {
		$wp_customize->add_setting( 'panel_' . $i, array(
			'default'           => false,
			'sanitize_callback' => 'vancura_sanitize_dropdown_pages',
			'transport'         => 'postMessage',
		) );

		$wp_customize->add_control( 'panel_' . $i, array(
			/* translators: %d is the front page section number */
			'label'          => sprintf( __( 'Front Page Section %d Content', 'vancura' ), $i ),
			'description'    => ( 1 !== $i ? '' : __( 'Select pages to feature in each area from the dropdowns. Add an image to a section by setting a featured image in the page editor. Empty sections will not be displayed.', 'vancura' ) ),
			'section'        => 'theme_options',
			'type'           => 'dropdown-pages',
			'allow_addition' => true,
			'active_callback' => 'vancura_is_static_front_page',
		) );

		$wp_customize->selective_refresh->add_partial( 'panel_' . $i, array(
			'selector'            => '#panel' . $i,
			'render_callback'     => 'vancura_front_page_section',
			'container_inclusive' => true,
		) );
	}
}
add_action( 'customize_register', 'vancura_customize_register' );

function vancura_customize_partial_blogname() {
	bloginfo( 'name' );
}

function vancura_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

function vancura_is_static_front_page() {
	return ( is_front_page() && ! is_home() );
}

function vancura_is_view_with_layout_option() {
	// This option is available on all pages. It's also available on archives when there isn't a sidebar.
	return ( is_page() || ( is_archive() && ! is_active_sidebar( 'sidebar-1' ) ) );
}
