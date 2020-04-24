<?php
/**
* All Widgets
*
*
* @package news_magazine_and_blog_elements
*/
if ( ! defined( 'WPINC' ) ) {
	die;
}
add_action( 'widgets_init', 'ata_news_register_widgets' );
if ( ! function_exists( 'ata_news_register_widgets' ) ) :

	/**
	 * Register widgets.
	 *
	 * @since 1.0.0
	 */
	function ata_news_register_widgets() {

		// News Ticker widget.
		register_widget( 'ATA_News_Ticker_Widgets' );
		
		// News Carsoul widget.
		register_widget( 'ATA_Posts_Carsoul_Widgets' );
		
		// News Slider widget.
		register_widget( 'ATA_Posts_Slider_Widgets' );
		
		// News Hero Block widget.
		register_widget( 'ATA_Posts_Hero_Block_Widgets' );
		
		// News Hero Block widget.
		register_widget( 'ATA_Posts_News_Block_Widgets' );
		
		// News Grids widget.
		register_widget( 'ATA_Posts_Grids_Widgets' );
		
		// News Grids widget.
		register_widget( 'ATA_Posts_List_Widgets' );
	}

endif;



if ( ! class_exists( 'ATA_Posts_List_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_Posts_List_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_list_extended';
			$args['label'] = esc_html__( 'ATA :  News / Posts List', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_list_extended',
				'description'                 => esc_html__( 'ATA :  News / Posts List widget To show latest / popular Posts', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
				'title' => array(
					'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
					'type'  => 'text',
					'class' => 'widefat',
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
				 'separator_2' => array(
					'type'            => 'separator',
					),	
						
				'image_size' => array(
					'label'   => esc_html__( 'Select Image:', 'ATA_NEWS_LANG' ),
					'type'    => 'select',
					'default' => 'thumbnail',
					'choices' => ata_get_image_sizes_options( false ),
				 ),	
				'category' => array(
					'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'posted_date' => array(
					'label'   => esc_html__( 'Display posted date ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => true,
				),
				'comment' => array(
					'label'   => esc_html__( 'Display posted comment ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'author' => array(
					'label'   => esc_html__( 'Display posted author ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
				),
				'content' => array(
					'label'   => esc_html__( 'Display posted Content ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'show_read_more' => array(
					'label'   => esc_html__( 'Read More Link :', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
					),	
			 	'content_length' => array(
					'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
					'type'    => 'number',
					'default' => 80,
					'min'     => 1,
					),
							
				
				);

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];
			
			
			// Render widget title.
			if ( ! empty( $values['title'] ) ) {
				echo $args['before_title'] . $values['title']  . $args['after_title'];
			}

			echo ata_news_posts_list_wdigets( $values );
			
			echo $args['after_widget'];

		}

	}

endif;

if ( ! class_exists( 'ATA_Posts_Grids_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_Posts_Grids_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_grids_extended';
			$args['label'] = esc_html__( 'ATA :  News / Posts Grids', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_grids_extended',
				'description'                 => esc_html__( 'ATA :  News / Posts Grids widget', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
				'title' => array(
					'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
					'type'  => 'text',
					'class' => 'widefat',
					),
				'style' => array(
						'label'   => esc_html__( 'Grids Style:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
							'1' => esc_html__( 'Grids', 'ATA_NEWS_LANG' ), 
							'5' => esc_html__( 'Masonry Grids', 'ATA_NEWS_LANG' ), 
							'2' => esc_html__( 'Portfolio', 'ATA_NEWS_LANG' ), 
							'3' => esc_html__( 'Left Image / Content', 'ATA_NEWS_LANG' ), 
							'4' => esc_html__( 'Single Rows', 'ATA_NEWS_LANG' ), 
						 ),
					),
				'number_of_colums' => array(
						'label'   => esc_html__( 'Number of Columns ( Desktop )', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => '4',
						'choices' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
					),
					'number_of_colums_sm' => array(
						'label'   => esc_html__( 'Number of Columns ( Tablets )', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => '2',
						'choices' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
					),
					'number_of_colums_xs' => array(
						'label'   => esc_html__( 'Number of Columns ( Phones )', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => '12',
						'choices' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
					),		
				'separator_1' => array(
					'type'            => 'separator',
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
				 'separator_2' => array(
					'type'            => 'separator',
					),	
				 'title_and_meta_position' => array(
						'label'   => esc_html__( 'Posts Title & Meta position:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'bottom',
						'choices' => array( 
							'top' => esc_html__( 'Top', 'ATA_NEWS_LANG' ), 
							'bottom' => esc_html__( 'Bottom', 'ATA_NEWS_LANG' ), 
						 ),
					),		
				'image_size' => array(
					'label'   => esc_html__( 'Select Image:', 'ATA_NEWS_LANG' ),
					'type'    => 'select',
					'default' => 'full',
					'choices' => ata_get_image_sizes_options( false ),
				 ),	
				'category' => array(
					'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'posted_date' => array(
					'label'   => esc_html__( 'Display posted date ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => true,
				),
				'comment' => array(
					'label'   => esc_html__( 'Display posted comment ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'author' => array(
					'label'   => esc_html__( 'Display posted author ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
				),
				'content' => array(
					'label'   => esc_html__( 'Display posted Content ?', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'show_read_more' => array(
					'label'   => esc_html__( 'Read More Link :', 'ATA_NEWS_LANG' ),
					'type'    => 'checkbox',
					'default' => false,
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
						'choices' => array( 
							'0' => esc_html__( 'No Pagination', 'ATA_NEWS_LANG' ), 
							'default' => __( 'Default (Older / Newer Post)', 'ATA_NEWS_LANG' ),
							'numeric' => esc_html__( 'Numeric List', 'ATA_NEWS_LANG' ),
							
						  ),
					),	
				);

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];
			
			
			// Render widget title.
			if ( ! empty( $values['title'] ) ) {
				echo $args['before_title'] . $values['title']  . $args['after_title'];
			}

			if( $values['style'] == 1 ){
				
				echo ata_news_grids_style_1( $values );
				
			}elseif ( $values['style'] == 2 ) {
				
				echo ata_news_grids_style_2( $values );
				
			}elseif ( $values['style'] == 3 ) {
				
				echo ata_news_grids_style_3( $values );
				
			}elseif ( $values['style'] == 4 ) {
				
				echo ata_news_grids_style_4( $values );
				
			}elseif ( $values['style'] == 5 ) {
				
				echo ata_news_grids_style_5( $values );
				
			}else{
				echo ata_news_grids_style_3( $values );
			}
			
	
			echo $args['after_widget'];

		}

	}

endif;



if ( ! class_exists( 'ATA_Posts_News_Block_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_Posts_News_Block_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_block_extended';
			$args['label'] = esc_html__( 'ATA : News / Posts Block', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_block_extended',
				'description'                 => esc_html__( 'ATA :  News / Posts Block widget', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
				'title' => array(
					'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
					'type'  => 'text',
					'class' => 'widefat',
					
					),
				'style' => array(
						'label'   => esc_html__( 'Carsoul Style:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
						'choices' => array( 
							'top' => esc_html__( 'Top', 'ATA_NEWS_LANG' ), 
							'bottom' => esc_html__( 'Bottom', 'ATA_NEWS_LANG' ), 
						 ),
					),		
				'image_size' => array(
					'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
					'type'    => 'select',
					'default' => 'large',
					'choices' => ata_get_image_sizes_options( false ),
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
				'content' => array(
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
					'choices' => ata_get_image_sizes_options( false ),
				 ),	
				'child_category' => array(
					'label'   => esc_html__( 'Display Child Posts Category ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'child_posted_date' => array(
					'label'   => esc_html__( 'Display Child posted date ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => true,
				),
				'child_comment' => array(
					'label'   => esc_html__( 'Display Child posted comment ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'child_author' => array(
					'label'   => esc_html__( 'Display Child posted author ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),
				'child_content' => array(
					'label'   => esc_html__( 'Display Child posted Content ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),		
			 	'child_content_length' => array(
					'label'   => esc_html__( 'Posts Child Content Length :', 'ATA_NEWS_LANG' ),
					'type'    => 'number',
					'default' => 80,
					'min'     => 1,
					),			
				);
				
				

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];
			
			// Render widget title.
			if ( ! empty( $values['title'] ) ) {
				echo $args['before_title'] . $values['title']  . $args['after_title'];
			}
			
			if( $values['style'] == 1 ){
				
				echo ata_news_news_block_style_1( $values );
				
			}elseif ( $values['style'] == 2 ) {
				
				echo ata_news_news_block_style_2( $values );
				
			}elseif ( $values['style'] == 3 ) {
				
				echo ata_news_news_block_style_3( $values );
				
			}elseif ( $values['style'] == 4 ) {
				
				echo ata_news_news_block_style_4( $values );
				
			}elseif ( $values['style'] == 5 ) {
				
				echo ata_news_news_block_style_5( $values );
				
			}elseif ( $values['style'] == 6 ) {
				
				echo ata_news_news_block_style_6( $values );
				
			}elseif ( $values['style'] == 7 ) {
				
				echo ata_news_news_block_style_7( $values );
				
			}else{
				echo ata_news_news_block_style_1( $values );
			}
			

			echo $args['after_widget'];

		}

	}

endif;

if ( ! class_exists( 'ATA_Posts_Hero_Block_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_Posts_Hero_Block_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_hero_block_extended';
			$args['label'] = esc_html__( 'ATA :  News / Posts Hero Block', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_hero_block_extended',
				'description'                 => esc_html__( 'ATA :  News / Posts Hero Block widget', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
				'title' => array(
					'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
					'type'  => 'text',
					'class' => 'widefat',
					'default' => esc_html__( 'Hero Block', 'ATA_NEWS_LANG' ),
					),
				'style' => array(
						'label'   => esc_html__( 'Slider Style:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
							'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
							'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
						 ),
					),		
				'separator_1' => array(
					'type'            => 'separator',
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
				'separator_2' => array(
					'type'            => 'separator',
					),	 
				'image_size' => array(
					'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
					'type'    => 'select',
					'default' => 'full',
					'choices' => ata_get_image_sizes_options( false ),
				 ),	
				'category' => array(
					'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'posted_date' => array(
					'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => true,
				),
				'comment' => array(
					'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'author' => array(
					'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),
				'content' => array(
					'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),		
			 	'content_length' => array(
					'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
					'type'    => 'number',
					'default' => 80,
					'min'     => 1,
					),	
				);

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];

			if( $values['style'] == 1 ){
				echo ata_news_hero_block( $values );
			}else{
				echo ata_news_hero_block_style_2( $values );
			}
			
			

			echo $args['after_widget'];

		}

	}

endif;

if ( ! class_exists( 'ATA_Posts_Slider_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_Posts_Slider_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_slider_extended';
			$args['label'] = esc_html__( 'ATA :  News / Posts Slider', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_slider_extended',
				'description'                 => esc_html__( 'ATA :  News / Posts Slider widget', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
				'title' => array(
					'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
					'type'  => 'text',
					'class' => 'widefat',
					'default' => esc_html__( 'Breaking News', 'ATA_NEWS_LANG' ),
					),
				'style' => array(
						'label'   => esc_html__( 'Slider Style:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
							'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
							'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
							'3' => esc_html__( 'Style 3', 'ATA_NEWS_LANG' ), 
						 ),
					),	
				'separator_1' => array(
					'type'            => 'separator',
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
				 'separator_2' => array(
					'type'            => 'separator',
					),	
				'image_size' => array(
					'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
					'type'    => 'select',
					'default' => 'full',
					'choices' => ata_get_image_sizes_options( false ),
				 ),	
				'category' => array(
					'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'posted_date' => array(
					'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => true,
				),
				'comment' => array(
					'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'author' => array(
					'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),
				'content' => array(
					'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),		
			 	'content_length' => array(
					'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
					'type'    => 'number',
					'default' => 80,
					'min'     => 1,
					),	
				);

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];

			if( $values['style'] == 1 ){
				echo ata_posts_slider_style_1( $values );
			}elseif ( $values['style'] == 2 ) {
				echo ata_posts_slider_style_2( $values );
			}else{
				echo ata_posts_slider_style_3( $values );
			}
			
			

			echo $args['after_widget'];

		}

	}

endif;



if ( ! class_exists( 'ATA_Posts_Carsoul_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_Posts_Carsoul_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_carsoul_extended';
			$args['label'] = esc_html__( 'ATA :  News / Posts Carsoul', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_carsoul_extended',
				'description'                 => esc_html__( 'ATA :  News / Posts Carsoul widget', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
				'title' => array(
					'label' => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
					'type'  => 'text',
					'class' => 'widefat',
					'default' => esc_html__( 'Breaking News', 'ATA_NEWS_LANG' ),
					),
				'style' => array(
						'label'   => esc_html__( 'Carsoul Style:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
							'1' => esc_html__( 'Style 1', 'ATA_NEWS_LANG' ), 
							'2' => esc_html__( 'Style 2', 'ATA_NEWS_LANG' ), 
						 ),
					),
					
				 'number_of_colums' => array(
						'label'   => esc_html__( 'Number of Columns ( Desktop )', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => '4',
						'choices' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
					),
					'number_of_colums_sm' => array(
						'label'   => esc_html__( 'Number of Columns ( Tablets )', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => '2',
						'choices' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
					),
					'number_of_colums_xs' => array(
						'label'   => esc_html__( 'Number of Columns ( Phones )', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => '12',
						'choices' => array( '12' => esc_html__( '1 Colums', 'ATA_NEWS_LANG' ), '6' => esc_html__( '2 Colums', 'ATA_NEWS_LANG' ), '4' => esc_html__( '3 Colums', 'ATA_NEWS_LANG' ), '3' => esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) ),
					),			
				'separator_1' => array(
					'type'            => 'separator',
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
				 'separator_2' => array(
					'type'            => 'separator',
					),	
				'image_size' => array(
					'label'   => esc_html__( 'Select Image:', 'newsgreen' ),
					'type'    => 'select',
					'default' => 'large',
					'choices' => ata_get_image_sizes_options( false ),
				 ),	
				'category' => array(
					'label'   => esc_html__( 'Display post Category ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'posted_date' => array(
					'label'   => esc_html__( 'Display posted date ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => true,
				),
				'comment' => array(
					'label'   => esc_html__( 'Display posted comment ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),	
				'author' => array(
					'label'   => esc_html__( 'Display posted author ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),
				'content' => array(
					'label'   => esc_html__( 'Display posted Content ?', 'newsgreen' ),
					'type'    => 'checkbox',
					'default' => false,
				),		
			 	'content_length' => array(
					'label'   => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
					'type'    => 'number',
					'default' => 80,
					'min'     => 1,
					),	
				);

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];
			
			// Render widget title.
			if ( ! empty( $values['title'] ) ) {
				echo $args['before_title'] . $values['title']  . $args['after_title'];
			}
			

			if( $values['style'] == 1 ){
				
				ata_news_carsoul_style_1( $values );
				
			}else{
				ata_news_carsoul_style_2( $values );
			}
			

			echo $args['after_widget'];

		}

	}

endif;


if ( ! class_exists( 'ATA_News_Ticker_Widgets' ) ) :

	/**
	 * Recent posts extended widget class.
	 *
	 * @since 1.0.0
	 */
	class ATA_News_Ticker_Widgets extends eD_News_Widget_Helper {

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		function __construct() {
			$args['id']    = 'eds_news_ticker_extended';
			$args['label'] = esc_html__( 'ATA :  News Ticker', 'ATA_NEWS_LANG' );

			$args['widget'] = array(
				'classname'                   => 'eds_news_ticker_extended',
				'description'                 => esc_html__( 'News Ticker extended widget', 'ATA_NEWS_LANG' ),
				'customize_selective_refresh' => true,
			 	'panels_groups' => array('eds_news_extension')
			);

			$args['fields'] = array(
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
						'choices' => array( 'DESC' => esc_html__( 'DESC', 'ATA_NEWS_LANG' ), 'ASC' => esc_html__( 'ASC', 'ATA_NEWS_LANG' ) ),
					),	
				'orderby' => array(
						'label'   => esc_html__( 'Posts orderby:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'date',
						'choices' => array( 'ID' => esc_html__( 'ID', 'ATA_NEWS_LANG' ), 'author' => esc_html__( 'Author', 'ATA_NEWS_LANG' ), 'title' => esc_html__( 'Title', 'ATA_NEWS_LANG' ),'rand' => esc_html__( 'Rand', 'ATA_NEWS_LANG' ) , 'comment_count' => esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) , 'views_count' => esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) , 'date' => esc_html__( 'Date', 'ATA_NEWS_LANG' ), 'modified' => esc_html__( 'Modified', 'ATA_NEWS_LANG' ) ),
					),	
				'date_query' => array(
						'label'   => esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
						'type'    => 'select',
						'default' => 'DESC',
						'choices' => array( 
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
					
			 		
				);

			parent::create_widget( $args );
		}

		/**
		 * Echo the widget content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args     Display arguments including before_title, after_title,
		 *                        before_widget, and after_widget.
		 * @param array $instance The settings for the particular instance of the widget.
		 */
		function widget( $args, $instance ) {
		
			$values = $this->get_field_values( $instance );
			
			$values['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
			
			

			echo $args['before_widget'];
			
			
			 ata_news_ticker( $values , $values['title'] );
			
			echo $args['after_widget'];

		}

	}

endif;
