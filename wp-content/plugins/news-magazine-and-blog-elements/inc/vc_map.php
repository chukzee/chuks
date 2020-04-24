<?php
/**
 * visual composer Class.
 *
 * @package News_Green
 */
 
 // Prohibit direct script loading.
defined('ABSPATH') || die('No direct script access allowed!');
if( !class_exists('ata_news_vc_map') ){
	class ata_news_vc_map {
		/**
		 * @var striang
		 */
		protected $path;
		/**
		 * @var striang
		 */
		protected $url;
		
		/**
		 * Initialize all controllers, by loading Plugin and User Options.
		 */
		public function __construct() {
			$this->path = ATA_VAR_PATH;
			$this->url = ATA_VAR_URL;
			add_action( 'vc_before_init', array( $this, 'vc_map' ) );
		} 
		/**
		 * Initialize visual composer
		 */
		public function vc_map(){
			
			
			/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA :  News Ticker', 'ATA_NEWS_LANG'),
			"base" => "ata_news_ticker",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
			
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Title:', 'ATA_NEWS_LANG' ),
				  "param_name" => "title",
				  "value" => esc_html__( 'Breaking News', 'ATA_NEWS_LANG' ),
				),
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
					'std' => 'large',
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				
				/**********end params*/
			)
			) );	
			/* END VC MAP */
			
			
			/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA :  News / Posts List', 'ATA_NEWS_LANG'),
			"base" => "ata_posts_list",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
					'std' => 'large',
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				
				/**********end params*/
			)
			) );	
			/* END VC MAP */
			
			
			/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA :  News / Posts Hero Block', 'ATA_NEWS_LANG'),
			"base" => "ata_hero_block",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Posts Type:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'style',
				  'value' => array(
					esc_html__( 'Style 1', 'ATA_NEWS_LANG' ) => '1',
					esc_html__( 'Style 2', 'ATA_NEWS_LANG' ) =>  '2',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
					'std' => 'large',
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				
				/**********end params*/
			)
			) );	
			/* END VC MAP */
			
			
			/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA :  News / Posts Slider', 'ATA_NEWS_LANG'),
			"base" => "ata_posts_slider",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Posts Type:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'style',
				  'value' => array(
					esc_html__( 'Style 1', 'ATA_NEWS_LANG' ) => '1',
					esc_html__( 'Style 2', 'ATA_NEWS_LANG' ) =>  '2',
					esc_html__( 'Style 3', 'ATA_NEWS_LANG' ) =>  '3',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
					'std' => 'large',
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				
				/**********end params*/
			)
			) );	
			/* END VC MAP */
				/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA :  News / Posts Carsoul', 'ATA_NEWS_LANG'),
			"base" => "ata_posts_carsoul",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Posts Type:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'style',
				  'value' => array(
					esc_html__( 'Style 1', 'ATA_NEWS_LANG' ) => '1',
					esc_html__( 'Style 2', 'ATA_NEWS_LANG' ) =>  '2',
					
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Number of Columns ( Desktop )', 'ATA_NEWS_LANG' ),
				  'param_name' => 'number_of_colums',
				  'value' => array(
					esc_html__( '1 Colums', 'ATA_NEWS_LANG' ) =>'12',
					esc_html__( '2 Colums', 'ATA_NEWS_LANG' ) =>'6',
					esc_html__( '3 Colums', 'ATA_NEWS_LANG' ) =>'4',
					esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) =>'3',
				  ),
				  'std' => '4',
				   
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Number of Columns ( Tablets )', 'ATA_NEWS_LANG' ),
				  'param_name' => 'number_of_colums_sm',
				  'value' => array(
					esc_html__( '1 Colums', 'ATA_NEWS_LANG' ) =>'12',
					esc_html__( '2 Colums', 'ATA_NEWS_LANG' ) =>'6',
					esc_html__( '3 Colums', 'ATA_NEWS_LANG' ) =>'4',
					esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) =>'3',
				  ),
				  'std' => '6',
				   
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Number of Columns ( Phones )', 'ATA_NEWS_LANG' ),
				  'param_name' => 'number_of_colums_sm',
				  'value' => array(
					esc_html__( '1 Colums', 'ATA_NEWS_LANG' ) =>'12',
					esc_html__( '2 Colums', 'ATA_NEWS_LANG' ) =>'6',
					esc_html__( '3 Colums', 'ATA_NEWS_LANG' ) =>'4',
					esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) =>'3',
				  ),
				  'std' => '12',
				   
				),
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
					'std' => 'large',
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				
				/**********end params*/
			)
			) );	
			/* END VC MAP */
			
			
				/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA : News / Posts Grids', 'ATA_NEWS_LANG'),
			"base" => "ata_posts_grids",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Posts Type:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'style',
				  'value' => array(
					esc_html__( 'Grids', 'ATA_NEWS_LANG' ) => '1',
					esc_html__( 'Masonry Grids', 'ATA_NEWS_LANG' ) =>  '5',
					esc_html__( 'Portfolio', 'ATA_NEWS_LANG' ) => '2',
					esc_html__( 'Left Image / Content', 'ATA_NEWS_LANG' ) => '3',
					esc_html__( 'Single Rows', 'ATA_NEWS_LANG' ) => '4',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Number of Columns ( Desktop )', 'ATA_NEWS_LANG' ),
				  'param_name' => 'number_of_colums',
				  'value' => array(
					esc_html__( '1 Colums', 'ATA_NEWS_LANG' ) =>'12',
					esc_html__( '2 Colums', 'ATA_NEWS_LANG' ) =>'6',
					esc_html__( '3 Colums', 'ATA_NEWS_LANG' ) =>'4',
					esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) =>'3',
				  ),
				  'std' => '4',
				   
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Number of Columns ( Tablets )', 'ATA_NEWS_LANG' ),
				  'param_name' => 'number_of_colums_sm',
				  'value' => array(
					esc_html__( '1 Colums', 'ATA_NEWS_LANG' ) =>'12',
					esc_html__( '2 Colums', 'ATA_NEWS_LANG' ) =>'6',
					esc_html__( '3 Colums', 'ATA_NEWS_LANG' ) =>'4',
					esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) =>'3',
				  ),
				  'std' => '6',
				   
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Number of Columns ( Phones )', 'ATA_NEWS_LANG' ),
				  'param_name' => 'number_of_colums_sm',
				  'value' => array(
					esc_html__( '1 Colums', 'ATA_NEWS_LANG' ) =>'12',
					esc_html__( '2 Colums', 'ATA_NEWS_LANG' ) =>'6',
					esc_html__( '3 Colums', 'ATA_NEWS_LANG' ) =>'4',
					esc_html__( '4 Colums', 'ATA_NEWS_LANG' ) =>'3',
				  ),
				  'std' => '12',
				   
				),
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
					'std' => 'large',
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'std' => '',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Pagination Type', 'ATA_NEWS_LANG' ),
				  'param_name' => 'pagination',
				  'std' => 'true',
				  'value' => array(
					esc_html__( 'No Pagination', 'ATA_NEWS_LANG' ) =>'0',
					esc_html__( 'Default (Older / Newer Post)', 'ATA_NEWS_LANG' )=>'default',
					esc_html__( 'Numeric List', 'ATA_NEWS_LANG' )=>'numeric'
				  )
				),
				
				/**********end params*/
			)
			) );	
			/* END VC MAP */
			
			/* START VC MAP */
			vc_map( array(
			"name" => esc_html__('ATA : News / Posts Block', 'ATA_NEWS_LANG'),
			"base" => "ata_news_block",
			"class" => "",
			'category' => __( 'ATA : News Extension', 'ATA_NEWS_LANG' ),
			"icon"=> $this->url.'/assets/img/vc_icon.png',
			"params" => array(
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Posts Type:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'style',
				  'value' => array(
					esc_html__( 'Style 1', 'ATA_NEWS_LANG' ) => '1',
					esc_html__( 'Style 2', 'ATA_NEWS_LANG' ) => '2',
					esc_html__( 'Style 3', 'ATA_NEWS_LANG' ) => '3',
					esc_html__( 'Style 4', 'ATA_NEWS_LANG' ) => '4',
					esc_html__( 'Style 5 ( 2 Columns Child )', 'ATA_NEWS_LANG' ) => '5',
					esc_html__( 'Style 6 ( 2 Columns Child )', 'ATA_NEWS_LANG' ) => '6',
					esc_html__( 'Style 7 ( 2 Columns Child )', 'ATA_NEWS_LANG' ) => '7',
				  )
				),
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Category:', 'ATA_NEWS_LANG' ),
					"param_name" => "post_category",
					"value" => $this->categories(),
					"description" => esc_html__( "filter the Slide by Category ! leave this to show all ", "newsgreen" )
				),
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Number of Posts:', 'ATA_NEWS_LANG' ),
				  "param_name" => "post_number",
				  "value" => 9,
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order by:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'orderby',
				  'value' => array(
					esc_html__( 'DESC', 'newsgreen' ) => 'DESC',
					esc_html__( 'ASC', 'newsgreen' ) => 'ASC',
					esc_html__( 'Rand', 'newsgreen' ) => 'rand',
				  )
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Order:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'order',
				  'value' => array(
					esc_html__( 'ID', 'ATA_NEWS_LANG' ) => 'ID',
					esc_html__( 'Author', 'ATA_NEWS_LANG' ) => 'author',
					esc_html__( 'Title', 'ATA_NEWS_LANG' ) => 'title',
					esc_html__( 'Rand', 'ATA_NEWS_LANG' ) => 'rand',
					esc_html__( 'Popular Posts ( Comment )', 'ATA_NEWS_LANG' ) => 'comment_count',
					esc_html__( 'Popular Posts ( Views )', 'ATA_NEWS_LANG' ) => 'views_count',
					esc_html__( 'Date', 'ATA_NEWS_LANG')  => 'date',
					esc_html__( 'Modified', 'ATA_NEWS_LANG')  => 'modified',
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' =>esc_html__( 'Posts Date Range:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'date_query',
				  'value' => array(
					esc_html__( 'All', 'ATA_NEWS_LANG' ) =>'all',
					esc_html__( 'Today', 'ATA_NEWS_LANG' ) => 'today',
					esc_html__( 'Yesterday', 'ATA_NEWS_LANG' ) => 'yesterday',
					esc_html__( 'This month', 'ATA_NEWS_LANG' ) =>'this_month',
					esc_html__( 'This Year', 'ATA_NEWS_LANG' ) => 'this_year',
					esc_html__( 'Last 7 Days', 'ATA_NEWS_LANG' ) => '7',
					esc_html__( 'Last 30 Days', 'ATA_NEWS_LANG' ) =>'30',
					esc_html__( 'Last 60 Days', 'ATA_NEWS_LANG' ) =>'60',
					esc_html__( 'Last 90 Days', 'ATA_NEWS_LANG' ) =>'90',
					esc_html__( 'Last 120 Days', 'ATA_NEWS_LANG' ) =>'120',
					esc_html__( 'Last 160 Days', 'ATA_NEWS_LANG' ) =>'160',
					esc_html__( 'Last 365 Days', 'ATA_NEWS_LANG' ) =>'365' ,
				  )
				),
				
				/*------------------------------*/
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Parents Title & Meta position:', 'ATA_NEWS_LANG' ),
				  'param_name' => 'title_and_meta_position',
				  'value' => array(
					esc_html__( 'Bottom', 'newsgreen' ) => 'bottom',
					esc_html__( 'Top', 'newsgreen' ) => 'top',
				  )
				),
				
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display post Category ?', 'newsgreen' ),
				  'param_name' => 'category',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted date ?', 'newsgreen' ),
				  'param_name' => 'posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'comment',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Author ?', 'newsgreen' ),
				  'param_name' => 'author',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Posted Content ?', 'newsgreen' ),
				  'param_name' => 'posted_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "content_length",
				  "value" =>120,
				),
				/*------------------------------*/
				array(
					"type" => "dropdown",
					"holder" => "div",
					"class" => "",
					'admin_label' => true,
					"heading" => esc_html__( 'Select Child Image Size:', 'ATA_NEWS_LANG' ),
					"param_name" => "child_image_size",
					"value" => ata_vc_get_image_sizes_options( false ),
				),
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Child post Category ?', 'newsgreen' ),
				  'param_name' => 'child_category',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Child posted date ?', 'newsgreen' ),
				  'param_name' => 'child_posted_date',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Child posted comment Count ?', 'newsgreen' ),
				  'param_name' => 'child_comment',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Child Posted Author ?', 'newsgreen' ),
				  'param_name' => 'child_author',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  'type' => 'dropdown',
				  'heading' => esc_html__( 'Display Child Posted Content ?', 'newsgreen' ),
				  'param_name' => 'child_content',
				  'value' => array(
					esc_html__( 'True', 'newsgreen' ) => 'true',
					esc_html__( 'False', 'newsgreen' ) => ''
				  )
				),
				
				array(
				  "type" => "textfield",
				  "holder" => "div",
				  "class" => "",
				  "heading" => esc_html__( 'Posts  Child Content Length :', 'ATA_NEWS_LANG' ),
				  "param_name" => "child_content_length",
				  "value" => 80,
				),
				/**********end params*/
			)
			) );	
			/* END VC MAP */
 			
		}
		private function categories(){
			$categories_array = array();
			$categories_array[ esc_html__('Choose a Category:', 'newsgreen') ] = ''; 
			$categories = get_categories();
			if( count($categories) > 0 ){
				foreach( $categories as $category ){
				  $categories_array[$category->name] = $category->term_id; 
				}
			}
			return $categories_array; 
		}
		
		
	}
	
	new ata_news_vc_map();
}

