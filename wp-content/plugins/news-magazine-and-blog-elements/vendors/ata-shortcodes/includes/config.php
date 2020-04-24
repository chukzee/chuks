<?php
/**
 * Define the shortcode parameters
 *
 * @package aThemeArtShortcodes
 * @since 1.0
 */


/**
* ShortCode Generate FOR News BLOCK.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-news-block-shortcode'] = array(
	'title' => __('ATA Posts / News Block Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-news-block-shortcode',
	'template' => '[ata_news_block {{attributes}}/]',
	'params' => array(
		/* START PARAMS */
			'style' => array(
				'label'   => esc_html__( 'Carsoul Style:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'DESC',
				'options' => array( 
					'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
					'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
					'3' => esc_html__( 'Style 3', 'ATA_NEWS_LANG' ), 
					'4' => esc_html__( 'Style 4', 'ATA_NEWS_LANG' ), 
					'5' => esc_html__( 'Style 5 ( 2 Columns Child )', 'ATA_NEWS_LANG' ),
					'6' => esc_html__( 'Style 6 ( 2 Columns Child )', 'ATA_NEWS_LANG' ), 
					'7' => esc_html__( 'Style 7 ( 2 Columns Child )', 'ATA_NEWS_LANG' ), 
				 ),
			),
					
			'post_number' => array(
				'label'   => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				'type'    => 'number',
				'default' => 8,
				'min'     => 1,
				'max'     => 100000000,
			),
			'post_category' => array(
			'label'           => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
			'type'            => 'dropdown-taxonomies',
			'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
			),
			
			'order' => array(
				'label'   => esc_html__( 'Posts Order:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'DESC',
				'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
			),	
			'orderby' => array(
				'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'date',
				'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
			),	
			'date_query' => array(
				'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'DESC',
				'options' => array( 
					'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
					'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
					'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
					'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
					'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
					'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
					'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
					'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
					'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
					'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
					'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
					'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
				 ),
			),	
			/*-----------------------------
			// Styling QUERY
			//--------------------------------*/	
			
			'title_and_meta_position' => array(
				'label'   => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'bottom',
				'options' => array( 
					'top' => esc_html__( 'Top', 'ATA_NEWS_LANG' ), 
					'bottom' => esc_html__( 'Bottom', 'ATA_NEWS_LANG' ), 
				 ),
			),		
			'image_size' => array(
			'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
			'type'    => 'select',
			'default' => 'large',
			'options' => ata_get_image_sizes_options( false ),
			),	
			'category' => array(
			'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
			'type'    => 'checkbox',
			'default' => true,
			),	
			'posted_date' => array(
			'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
			'type'    => 'checkbox',
			'default' => true,
			),
			'comment' => array(
			'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
			'type'    => 'checkbox',
			'default' => true,
			),	
			'author' => array(
			'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
			'type'    => 'checkbox',
			'default' => true,
			),
			'posted_content' => array(
			'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
			'type'    => 'checkbox',
			'default' => true,
			),		
			'content_length' => array(
			'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
			'type'    => 'number',
			'default' => 80,
			'min'     => 1,
			),	
			
			/*-----------------------------
			// Child Style
			//--------------------------------*/	
			
			'child_image_size' => array(
			'label'   => esc_html__( 'Child Posts Select Image:', 'newsgreen' ),
			'type'    => 'select',
			'default' => 'thumbnail',
			'options' => ata_get_image_sizes_options( false ),
			),	
			'child_category' => array(
			'label'   => esc_html__( 'Display Child Posts Category ?', 'newsgreen' ),
			'type'    => 'checkbox',
			
			),	
			'child_posted_date' => array(
			'label'   => esc_html__( 'Display Child posted date ?', 'newsgreen' ),
			'type'    => 'checkbox',
			'default' => true,
			),
			'child_comment' => array(
			'label'   => esc_html__( 'Display Child posted comment ?', 'newsgreen' ),
			'type'    => 'checkbox',
			
			),	
			'child_author' => array(
			'label'   => esc_html__( 'Display Child posted author ?', 'newsgreen' ),
			'type'    => 'checkbox',
			
			),
			'child_content' => array(
			'label'   => esc_html__( 'Display Child posted Content ?', 'newsgreen' ),
			'type'    => 'checkbox',
			
			),		
			'child_content_length' => array(
			'label'   => esc_html__( 'Posts Child Content Length :', 'ATA_NEWS_LANG' ),
			'type'    => 'number',
			'default' => 80,
			'min'     => 1,
			),
		/* END PARAMS */				
	)
);




/**
* ShortCode Generate FOR News Ticker.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-news-posts-list-shortcode'] = array(
	'title' => __('ATA Posts / News List Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-news-posts-list-shortcode',
	'template' => '[ata_posts_list {{attributes}}/]',
	'params' => array(
		/* START PARAMS */
			
		'post_number' => array(
			'label'   => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
			'type'    => 'number',
			'default' => 8,
			'min'     => 1,
			'max'     => 100000000,
		),
		'post_category' => array(
			'label'           => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
			'type'            => 'dropdown-taxonomies',
			'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
		),
		'order' => array(
			'label'   => esc_html__( 'Posts Order:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
		),	
		'orderby' => array(
			'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'date',
			'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
		),	
		'date_query' => array(
			'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
				'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
				'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
				'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
				'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
				'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
				'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
				'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
				'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
				'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
				'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
				'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
			 ),
		),	
		/*-----------------------------
		// Styling QUERY
		//--------------------------------*/	
		
		'image_size' => array(
			'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
			'type'    => 'select',
			'default' => 'thumbnail',
			'options' => ata_get_image_sizes_options( false ),
		),	
		'category' => array(
			'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
			'type'    => 'checkbox',
		),	
		'posted_date' => array(
			'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
			'type'    => 'checkbox',
		
		),
		'comment' => array(
			'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
			'type'    => 'checkbox',
		
		),	
		'author' => array(
			'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
			'type'    => 'checkbox',
		
		),
		'posted_content' => array(
			'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
			'type'    => 'checkbox',
		
		),		
		'content_length' => array(
			'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
			'type'    => 'number',
			'default' => 80,
			'min'     => 1,
		),
		/* END PARAMS */				
	)
);


/**
* ShortCode Generate FOR News Ticker.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-news-hero-block-shortcode'] = array(
	'title' => __('ATA Posts / News Hero Block Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-news-hero-block-shortcode',
	'template' => '[ata_hero_block {{attributes}}/]',
	'params' => array(
		/* START PARAMS */
		'style' => array(
			'label'   => esc_html__( 'Carsoul Style:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
				'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
			 ),
		),
			
		'post_category' => array(
		'label'           => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
		'type'            => 'dropdown-taxonomies',
		'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
		),
		
		'order' => array(
			'label'   => esc_html__( 'Posts Order:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
		),	
		'orderby' => array(
			'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'date',
			'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
		),	
		'date_query' => array(
			'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
				'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
				'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
				'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
				'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
				'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
				'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
				'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
				'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
				'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
				'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
				'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
			 ),
		),	
		/*-----------------------------
		// Styling QUERY
		//--------------------------------*/	
		
		'image_size' => array(
		'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
		'type'    => 'select',
		'default' => 'large',
		'options' => ata_get_image_sizes_options( false ),
		),	
		'category' => array(
		'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
		'type'    => 'checkbox',
		),	
		'posted_date' => array(
		'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
		'type'    => 'checkbox',
		'default' => true,
		),
		'comment' => array(
		'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),	
		'author' => array(
		'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),
		'posted_content' => array(
		'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),		
		'content_length' => array(
		'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
		'type'    => 'number',
		'default' => 80,
		'min'     => 1,
		),
		/* END PARAMS */				
	)
);

/**
* ShortCode Generate FOR News Ticker.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-news-slider-shortcode'] = array(
	'title' => __('ATA Posts / News Slider Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-news-slider-shortcode',
	'template' => '[ata_posts_slider {{attributes}}/]',
	'params' => array(
		/* START PARAMS */
		'style' => array(
			'label'   => esc_html__( 'Carsoul Style:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
				'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
				'3' => esc_html__( 'Style 3', 'ATA_NEWS_LANG' ), 
			 ),
		),
					
		'post_number' => array(
		'label'   => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
		'type'    => 'number',
		'default' => 8,
		'min'     => 1,
		'max'     => 100000000,
		),
		'post_category' => array(
		'label'           => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
		'type'            => 'dropdown-taxonomies',
		'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
		),
		
		'order' => array(
			'label'   => esc_html__( 'Posts Order:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
		),	
		'orderby' => array(
			'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'date',
			'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
		),	
		'date_query' => array(
			'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
				'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
				'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
				'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
				'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
				'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
				'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
				'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
				'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
				'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
				'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
				'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
			 ),
		),	
		/*-----------------------------
		// Styling QUERY
		//--------------------------------*/	
		
		'image_size' => array(
		'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
		'type'    => 'select',
		'default' => 'large',
		'options' => ata_get_image_sizes_options( false ),
		),	
		'category' => array(
		'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
		'type'    => 'checkbox',
		),	
		'posted_date' => array(
		'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
		'type'    => 'checkbox',
		'default' => true,
		),
		'comment' => array(
		'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),	
		'author' => array(
		'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),
		'posted_content' => array(
		'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),		
		'content_length' => array(
		'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
		'type'    => 'number',
		'default' => 80,
		'min'     => 1,
		),
		/* END PARAMS */				
	)
);


/**
* ShortCode Generate FOR News Ticker.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-news-carsoul-shortcode'] = array(
	'title' => __('ATA Posts / News Carsoul Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-news-carsoul-shortcode',
	'template' => '[ata_posts_carsoul {{attributes}}/]',
	'params' => array(
		/* START PARAMS */
		'style' => array(
			'label'   => esc_html__( 'Carsoul Style:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
				'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
			 ),
		),
		
		'number_of_colums' => array(
			'label'   => esc_html__( 'Number of Columns ( Desktop )', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => '4',
			'options' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
		),
		'number_of_colums_sm' => array(
			'label'   => esc_html__( 'Number of Columns ( Tablets )', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => '2',
			'options' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
		),
		'number_of_colums_xs' => array(
			'label'   => esc_html__( 'Number of Columns ( Phones )', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => '12',
			'options' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
		),			
					
		'post_number' => array(
		'label'   => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
		'type'    => 'number',
		'default' => 8,
		'min'     => 1,
		'max'     => 100000000,
		),
		'post_category' => array(
		'label'           => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
		'type'            => 'dropdown-taxonomies',
		'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
		),
		
		'order' => array(
			'label'   => esc_html__( 'Posts Order:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
		),	
		'orderby' => array(
			'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'date',
			'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
		),	
		'date_query' => array(
			'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
				'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
				'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
				'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
				'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
				'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
				'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
				'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
				'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
				'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
				'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
				'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
			 ),
		),	
		/*-----------------------------
		// Styling QUERY
		//--------------------------------*/	
		
		'image_size' => array(
		'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
		'type'    => 'select',
		'default' => 'large',
		'options' => ata_get_image_sizes_options( false ),
		),	
		'category' => array(
		'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
		'type'    => 'checkbox',
		),	
		'posted_date' => array(
		'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
		'type'    => 'checkbox',
		'default' => true,
		),
		'comment' => array(
		'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),	
		'author' => array(
		'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),
		'posted_content' => array(
		'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
		'type'    => 'checkbox',
		
		),		
		'content_length' => array(
		'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
		'type'    => 'number',
		'default' => 80,
		'min'     => 1,
		),
		/* END PARAMS */				
	)
);



/**
* ShortCode Generate FOR News Ticker.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-news-ticker-shortcode'] = array(
	'title' => __('ATA Posts / News Ticker Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-news-ticker-shortcode',
	'template' => '[ata_news_ticker {{attributes}}/]',
	'params' => array(
		/* START PARAMS */
		'title' => array(
			'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
			'type'  => 'text',
			'class' => 'widefat',
			'default' => esc_html__( 'Breaking News', 'ATA_NEWS_LANG' ),
			),
		'post_number' => array(
			'label'   => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
			'type'    => 'number',
			'default' => 5,
			'min'     => 1,
			'max'     => 100000000,
			),
		 'post_category' => array(
			'label'           => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
			'type'            => 'dropdown-taxonomies',
			'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
			),
		 'post_tag' => array(
			'label'           => esc_html__( 'Select Tags:', 'ATA_NEWS_LANG' ),
			'type'            => 'dropdown-taxonomies',
			'show_option_all' => esc_html__( 'All Tags', 'ATA_NEWS_LANG' ),
			'taxonomy'            => 'post_tag',
			),
		'order' => array(
				'label'   => esc_html__( 'Posts Order:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'DESC',
				'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
			),	
		'orderby' => array(
				'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'date',
				'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
			),	
		'date_query' => array(
				'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'DESC',
				'options' => array( 
					'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
					'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
					'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
					'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
					'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
					'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
					'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
					'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
					'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
					'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
					'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
					'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
				 ),
			),	
		/* END PARAMS */				
	)
);



/**
* ShortCode Generate FOR POSTS GRIDS.
*
* @since 1.0.0
*/
$zilla_shortcodes['ata-posts-grids-shortcode'] = array(
	'title' => __('ATA Posts Grids Shortcode', 'ATA_NEWS_LANG'),
	'id' => 'ata-posts-grids-shortcode',
	'template' => '[ata_posts_grids {{attributes}}/]',
	'params' => array(
		
		'style' => array(
			'type' => 'select',
			'label' => esc_html__( 'Grids Style:', 'ATA_NEWS_LANG' ),
			'options' => array(
				'1' => esc_html__( 'Grids', 'ATA_NEWS_LANG' ), 
				'5' => esc_html__( 'Masonry Grids', 'ATA_NEWS_LANG' ), 
				'2' => esc_html__( 'Portfolio', 'ATA_NEWS_LANG' ), 
				'3' => esc_html__( 'Left Image / Content', 'ATA_NEWS_LANG' ), 
				'4' => esc_html__( 'Single Rows', 'ATA_NEWS_LANG' ), 
			)
		),
		
		'number_of_colums' => array(
			'type' => 'select',
			'label' => esc_html__( 'Number of Columns ( Desktop )', 'ATA_NEWS_LANG' ),
			'default' => 4,
			'options' => array(
				'12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ),
				'6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ),
				'4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), 
				'3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' )
			)
		),
		
		'number_of_colums_sm' => array(
			'type' => 'select',
			'label' => esc_html__( 'Number of Columns ( Tablets )', 'ATA_NEWS_LANG' ),
			'default' => 6,
			'options' => array(
				'12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ),
				'6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ),
				'4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), 
				'3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' )
			)
		),
		
		'number_of_colums_xs' => array(
			'type' => 'select',
			'label' => esc_html__( 'Number of Columns ( Phones )', 'ATA_NEWS_LANG' ),
			'default' => 12,
			'options' => array(
				'12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ),
				'6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ),
				'4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), 
				'3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' )
			)
		),
		
		
		'post_number' => array(
			'default' => 5,
			'type' => 'number',
			'label' => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
		),
		
		'post_category' => array(
			'label'           => esc_html__( 'Select Category', 'ATA_NEWS_LANG' ),
			'type'            => 'dropdown-taxonomies',
			'show_option_all' => esc_html__( 'All Categories', 'ATA_NEWS_LANG' ),
			),
		'order' => array(
				'label'   => esc_html__( 'Posts Order', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'DESC',
				'options' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
			),	
		'orderby' => array(
				'label'   => esc_html__( 'Posts orderby', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => 'date',
				'options' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
			),	
		'date_query' => array(
			'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'DESC',
			'options' => array( 
				'all' => esc_html__( 'All', 'ATA_NEWS_LANG' ), 
				'today' => esc_html__( 'Today', 'ATA_NEWS_LANG' ), 
				'yesterday' => esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ), 
				'this_month' => esc_html__( 'This month', 'ATA_NEWS_LANG' ),
				'this_year' => esc_html__( 'This Year', 'ATA_NEWS_LANG' ),
				'7' => esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ),
				'30' => esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ),
				'60' => esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ),
				'90' => esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ),
				'120' => esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ),
				'160' => esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ),
				'365' => esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ),
			 ),
		),
	
		'title_and_meta_position' => array(
			'label'   => esc_html__( 'Posts Title & Meta position:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'bottom',
			'options' => array( 
			'top' => esc_html__( 'Top', 'ATA_NEWS_LANG' ), 
			'bottom' => esc_html__( 'Bottom', 'ATA_NEWS_LANG' ), 
			),
		),		
		'image_size' => array(
			'label'   => esc_html__( 'Select Image:', 'ATA_NEWS_LANG' ),
			'type'    => 'select',
			'default' => 'full',
			'options' => ata_get_image_sizes_options( false ),
		),	
		
		'category' => array(
			'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
			'type'    => 'checkbox',
			
		),	
		'posted_date' => array(
			'label'   => esc_html__( 'Display posted date ?', 'ATA_NEWS_LANG' ),
			'type'    => 'checkbox',
			'default' => true,
		),
		'comment' => array(
			'label'   => esc_html__( 'Display posted comment ?', 'ATA_NEWS_LANG' ),
			'type'    => 'checkbox',
			
		),	
		'author' => array(
			'label'   => esc_html__( 'Display posted author ?', 'ATA_NEWS_LANG' ),
			'type'    => 'checkbox',
			
		),
		'posted_content' => array(
			'label'   => esc_html__( 'Display posted Content ?', 'ATA_NEWS_LANG' ),
			'type'    => 'checkbox',
			
		),	
		'show_read_more' => array(
			'label'   => esc_html__( 'Read More Link :', 'ATA_NEWS_LANG' ),
			'type'    => 'checkbox',
			
			),	
		'content_length' => array(
			'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
			'type'    => 'number',
			'default' => 80,
			'min'     => 1,
			),
					
		'pagination' => array(
				'label'   => esc_html__( 'Pagination Type', 'ATA_NEWS_LANG' ),
				'type'    => 'select',
				'default' => '0',
				'options' => array( 
					'0' => esc_html__( 'No Pagination', 'ATA_NEWS_LANG' ), 
					'default' => __( 'Default (Older / Newer Post)', 'ATA_NEWS_LANG' ),
					'numeric' => esc_html__( 'Numeric List', 'ATA_NEWS_LANG' ),
					
				  ),
			),	
		
							
	)
);


?>