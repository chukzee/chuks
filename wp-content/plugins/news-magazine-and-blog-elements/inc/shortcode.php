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
if( ! function_exists( 'aThemeArt_News_Block_Shortcode' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $args
	 * @return $html
	 */
	function aThemeArt_News_Block_Shortcode( $atts ){
		$args = shortcode_atts( array(
			'style' =>1,
			
			'post_number' => '7',
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
			
			
			'title_and_meta_position' => 'bottom',
			'image_size' => 'large',
			'category' => 'true',
			'posted_date' => 'true',
			'comment' => '',
			'author' => 'true',
			'posted_content' => 'true',
			'show_read_more' => 'true',
			'content_length' => 80,
			
			
			'child_image_size' => 'thumbnail',
			'child_category' => '',
			'child_posted_date' => 'true',
			'child_comment' => '',
			'child_author' => 'true',
			'child_content' => 'true',
			'child_content_length' => 'true',
			
			
			
		), $atts );
		
			
			$args['content'] = $args['posted_content'];
		
			if( $args['style'] == 1 ){
				
				$html = ata_news_news_block_style_1( $args );
				
			}elseif ( $args['style'] == 2 ) {
				
				$html = ata_news_news_block_style_2( $args );
				
			}elseif ( $args['style'] == 3 ) {
				
				$html = ata_news_news_block_style_3( $args );
				
			}elseif ( $args['style'] == 4 ) {
				
				$html = ata_news_news_block_style_4( $args );
				
			}elseif ( $args['style'] == 5 ) {
				
				$html = ata_news_news_block_style_5( $args );
				
			}elseif ( $args['style'] == 6 ) {
				
				$html = ata_news_news_block_style_6( $args );
				
			}elseif ( $args['style'] == 7 ) {
				
				$html = ata_news_news_block_style_7( $args );
				
			}else{
				$html = ata_news_news_block_style_1( $args );
			}
		
		
		return $html;
	}
	add_shortcode('ata_news_block', 'aThemeArt_News_Block_Shortcode');
}



if( ! function_exists( 'aThemeArt_News_Posts_List_Shortcode' ) ){
	/**
	 * Implement News Slider ShortCode.
	 *
	 * @since 1.0.0
	 *
	 * @param $atts
	 * @return $html
	 */
	function aThemeArt_News_Posts_List_Shortcode( $atts ){
		$args = shortcode_atts( array(
		
			'post_number' => '8',
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
			'image_size' => 'thumbnail',
			'category' => '',
			'posted_date' => '',
			'comment' => '',
			'author' => '',
			'posted_content' => '',
			'content_length' => 80,
		), $atts );
	
		$args['content'] = $args['posted_content'];
		
		$html = ata_news_posts_list_wdigets( $args );
		
		return $html;
	}
	add_shortcode('ata_posts_list', 'aThemeArt_News_Posts_List_Shortcode');
}

if( ! function_exists( 'aThemeArt_News_Hero_Block_Shortcode' ) ){
	/**
	 * Implement News Hero Block ShortCode.
	 *
	 * @since 1.0.0
	 *
	 * @param $atts
	 * @return $html
	 */
	function aThemeArt_News_Hero_Block_Shortcode( $atts ){
		$args = shortcode_atts( array(
			'style' =>1,
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
			'image_size' => 'large',
			'category' => '',
			'posted_date' => '',
			'comment' => '',
			'author' => '',
			'posted_content' => '',
			'content_length' => 80,
		), $atts );
	$args['content'] = $args['posted_content'];
		
		if( $args['style'] == 1 ){
			$html = ata_news_hero_block( $args );
		}else{
			$html = ata_news_hero_block_style_2( $args );
		}
		
		return $html;
	}
	add_shortcode('ata_hero_block', 'aThemeArt_News_Hero_Block_Shortcode');
}


if( ! function_exists( 'aThemeArt_News_Slider_Shortcode' ) ){
	/**
	 * Implement News Slider ShortCode.
	 *
	 * @since 1.0.0
	 *
	 * @param $atts
	 * @return $html
	 */
	function aThemeArt_News_Slider_Shortcode( $atts ){
		$args = shortcode_atts( array(
			'style' =>1,
			'post_number' => '8',
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
			
			'image_size' => 'large',
			'category' => '',
			'posted_date' => '',
			'comment' => '',
			'author' => '',
			'posted_content' => '',
			'content_length' => 80,
		), $atts );
	$args['content'] = $args['posted_content'];
		
		if( $args['style'] == 1 ){
			$html = ata_posts_slider_style_1( $args );
		}elseif ( $args['style'] == 2 ) {
			$html = ata_posts_slider_style_2( $args );
		}else{
			$html = ata_posts_slider_style_3( $args );
		}
		
		return $html;
	}
	add_shortcode('ata_posts_slider', 'aThemeArt_News_Slider_Shortcode');
}



if( ! function_exists( 'aThemeArt_News_Ticker_Shortcode' ) ){
	/**
	 * Implement News Ticker.
	 *
	 * @since 1.0.0
	 *
	 * @param $atts
	 * @return $html
	 */
	function aThemeArt_News_Ticker_Shortcode( $atts ){
		
		extract(shortcode_atts(array(
			'title' => esc_html__( 'Breaking News', 'ATA_NEWS_LANG' ),
			'post_number' => '8',
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
		), $atts));
		 $args = array();
		 if( $post_number != "" &&  absint( $post_number ) ){
			 $args ['post_number']  = $post_number; 
		 }
		 if( $post_category != "" && absint( $post_category ) ){
			 $args ['post_category']  = $post_category; 
		 }
		 if( $order != ""){
			 $args ['order']  = $post_category; 
		 }
		 if( $orderby != ""){
			 $args ['orderby']  = $orderby; 
		 }
		 if( $date_query != ""){
			 $args ['date_query']  = $date_query; 
		 }
		
		$html = ata_news_ticker( $args , $title );
		return $html;
	}
	add_shortcode('ata_news_ticker', 'aThemeArt_News_Ticker_Shortcode');
}


if( ! function_exists( 'aThemeArt_News_Carsoul_Shortcode' ) ){
	/**
	 * Implement News Carsoul ShortCode.
	 *
	 * @since 1.0.0
	 *
	 * @param $atts
	 * @return $html
	 */
	function aThemeArt_News_Carsoul_Shortcode( $atts ){
		$args = shortcode_atts( array(
			'style' =>1,
			'number_of_colums' => '4',
			'number_of_colums_sm' => '6',
			'number_of_colums_xs' => '1',
			
			'post_number' => '8',
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
			
			'image_size' => 'large',
			'category' => '',
			'posted_date' => '',
			'comment' => '',
			'author' => '',
			'posted_content' => '',
			'content_length' => 80,
		), $atts );
	$args['content'] = $args['posted_content'];
	
		if( $args['style'] == 1 ){
			$html = ata_news_carsoul_style_1( $args );
		}else{
			$html = ata_news_carsoul_style_2( $args );
		}
		
		return $html;
	}
	add_shortcode('ata_posts_carsoul', 'aThemeArt_News_Carsoul_Shortcode');
}


if( ! function_exists( 'aThemeArt_News_Grids_Shortcode' ) ){
	/**
	 * Implement News Ticker.
	 *
	 * @since 1.0.0
	 *
	 * @param $args
	 * @return $html
	 */
	function aThemeArt_News_Grids_Shortcode( $atts){
		$args = shortcode_atts( array(
			'style' =>1,
			'number_of_colums' => '4',
			'number_of_colums_sm' => '6',
			'number_of_colums_xs' => '1',
			
			'post_number' => '9',
			'post_category' => '0',
			'order' => 'DESC',
			'orderby' => 'ID',
			'date_query' => 'all',
			
			'image_size' => 'large',
			'category' => 'true',
			'posted_date' => 'true',
			'comment' => '',
			'author' => 'true',
			'posted_content' => '',
			'show_read_more' => 'true',
			'content_length' => 80,
			'pagination' => 'default',
		), $atts );
		
		$args['content'] = $args['posted_content'];
		var_dump($args);
			if( $args['style'] == 1 ){
				
				$html = ata_news_grids_style_1( $args );
				
			}elseif ( $args['style'] == 2 ) {
				
				$html = ata_news_grids_style_2( $args );
				
			}elseif ( $args['style'] == 3 ) {
				
				$html = ata_news_grids_style_3( $args );
				
			}elseif ( $args['style'] == 4 ) {
				
				$html = ata_news_grids_style_4( $args );
				
			}elseif ( $args['style'] == 5 ) {
				
				$html = ata_news_grids_style_5( $args );
				
			}else{
				$html = ata_news_grids_style_3( $args );
			}
		
		
		return $html;
	}
	add_shortcode('ata_posts_grids', 'aThemeArt_News_Grids_Shortcode');
}


