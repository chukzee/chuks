<?php
/**
 * All Function File 
 *
 *
 * @package news_magazine_and_blog_elements
 */
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
} 
if( ! function_exists( 'ata_news_ticker' ) ){
	/**
	 * Implement News Ticker.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_ticker( $args = array(), $title = ''){
		$title = ( isset( $title ) && $title != "" ) ? $title : esc_html__( 'Breaking News', 'ATA_NEWS_LANG' );
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_news_ticker">';
		$html .= '<span class="ata_braking_news">'.$title.'</span>';
		if ( $the_query->have_posts() ) :
			
			$html .= '<ul class="ata_news_ticker_list newsticker">';
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$html .= '<li><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></li>';
			endwhile;
			$html .= '</ul>';
			
		else:
		$html .= '<ul class="ata_news_ticker_list newsticker"><li>';
		$html .= esc_html__('No Posts found.', 'ATA_NEWS_LANG');	
		$html .= '</li></ul>';
		endif;
		$html .= '<div class="clearfix"></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_ticker_view', $html );
		
	}
}


if( ! function_exists( 'ata_news_carsoul_style_1' ) ){
	/**
	 * Implement News Carsoul STYLE 1.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_carsoul_style_1( $args = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		$html = '<div class="ata_news_carsoul_wrp"><div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="ata_news_carsoul_loader owl-carousel owl-theme ata_grids_style_fly">';
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				
				$html .= '<div class="col-md-12  gird_list ata_grid_style">';
				
				$categories_list = get_the_category_list( );
				if ( $categories_list  && $helper['category'] == true ) {
				  $html .= $categories_list;
				}
                           
				if( $post_thumbnail_url[0] != "" ){
					$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
				}else{
				  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
					
				}
				$html .= '<div class="ata_caption">';
					$html .= '<h5><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h5>';
					
					$html .= ata_news_meta_return( $helper['meta'] );
					
					if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
						$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
					}
					
				$html .= '</div>';
					
				$html .= '</div>';
			endwhile;
			$html .= '</div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_carsoul_style_1', $html );
		
	}
}

if( ! function_exists( 'ata_news_carsoul_style_2' ) ){
	/**
	 * Implement News Carsoul STYLE 2.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_carsoul_style_2( $args = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		$html = '<div class="ata_news_carsoul_style_2_wrp row">';
		
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="ata_news_carsoul_loader owl-carousel owl-theme ata_grids_style_simply">';
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				
				$html .= '<div class="col-md-12  gird_list ata_grid_style">';
				
				
                           
				if( $post_thumbnail_url[0] != "" ){
					$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
				}else{
				  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
				}
				
				$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
				if ( $categories_list  && $helper['category'] == true ) {
					 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
				}
					$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
					
					$html .= ata_news_meta_return( $helper['meta'] );
					
					if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
						$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
					}
					
				
					
				$html .= '</div>';
			endwhile;
			$html .= '</div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_carsoul_style_2', $html );
		
	}
}



if( ! function_exists( 'ata_posts_slider_style_1' ) ){
	/**
	 * Implement News POSTS STYLE 1.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_posts_slider_style_1( $args = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $helper['content'] ) && $helper['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		$html = '<div class="ata_posts_slider_style_1_wrp">';
		
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="ata_posts_slider_loader owl-carousel owl-theme ata_grids_style_simply">';
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				
				$html .= '<div class="col-md-12  gird_list ata_grid_style">';
				
				
                           
				if( $post_thumbnail_url[0] != "" ){
					$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
				}else{
				  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
				}
				
				$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
				if ( $categories_list  && $helper['category'] == true ) {
					  $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
				}
					$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
					
					$html .= ata_news_meta_return( $helper['meta'] );
					
					if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
						$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
					}
					
				
					
				$html .= '</div>';
			endwhile;
			$html .= '</div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_posts_slider_style_1', $html );
		
	}
}




if( ! function_exists( 'ata_posts_slider_style_2' ) ){
	/**
	 * Implement News POSTS STYLE 2.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_posts_slider_style_2( $args = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		$html = '<div class="ata_posts_slider_style_2_wrp">';
		
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="ata_posts_slider_loader owl-carousel owl-theme ata_grids_style_fly">';
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				
				$html .= '<div class="col-md-12  gird_list ata_grid_style">';
				
				$categories_list = get_the_category_list( );
				if ( $categories_list  && $helper['category'] == true ) {
				  $html .= $categories_list;
				}
                           
				if( $post_thumbnail_url[0] != "" ){
					$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
				}else{
				  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
					
				}
				$html .= '<div class="ata_caption">';
					$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
					
					$html .= ata_news_meta_return( $helper['meta'] );
					
					if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
						$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
					}
					
				$html .= '</div>';
					
				$html .= '</div>';
			endwhile;
			$html .= '</div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_posts_slider_style_2', $html );
		
	}
}




if( ! function_exists( 'ata_posts_slider_style_3' ) ){
	/**
	 * Implement News POSTS STYLE 3.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args, array $helper
	 * @return $html
	 */
	function ata_posts_slider_style_3( $args = array(), $helper = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['category'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['category'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['category'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_posts_slider_style_3_wrp">';
		
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="ata_posts_slider_loader owl-carousel owl-theme ata_grids_style_simply">';
			
			while ( $the_query->have_posts() ) : $the_query->the_post();
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				
				$html .= '<div class="row  gird_list ata_grid_style">';
				
				
                $html .= '<div class="col-md-4">';          
				 
				if( $post_thumbnail_url[0] != "" ){
					
					$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
					
				}else{
					
				  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
				  
					
				}
				$html .= '</div><div class="col-md-8">'; 
				
					$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
					
					$html .= ata_news_meta_return( $helper['meta'] );
					
					$categories_list = get_the_category_list( );
					
					if ( $categories_list  && $helper['category'] == true ) {
						
					  $html .= '<div class="list-inline ata_meta">'.$categories_list.'</div>';
					  
					}
					if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
						
						$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						
					}
					
				$html .= '</div>';
					
				$html .= '</div>';
				
			endwhile;
			
			$html .= '</div>';
			
		endif;
		
		$html .= '<div class="clearfix"></div></div>';
		
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_posts_slider_style_3', $html );
		
	}
}




if( ! function_exists( 'ata_news_hero_block' ) ){
	/**
	 * Implement News POSTS HERO BLOCK
	 *
	 * @since 1.0.0
	 *
	 * @param array $args, array $helper
	 * @return $html
	 */
	function ata_news_hero_block( $args = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['category'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['category'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['category'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_news_hero_block"><div class="row ata_grids_style_fly">';
		
		if ( $the_query->have_posts() ) :
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				
				$categories_list = get_the_category_list( );
				
				if( $i === 1){
					
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
					
					$html .= '<div class="col-md-6  gird_list ata_grid_style force-pull-5">';
					
					if ( $categories_list  && $helper['category'] == true ) {
						  $html .= $categories_list;
						}    
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media hero_block_main_image"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '<div class="ata_caption">';
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
					
						$html .= '</div>';
					
					$html .= '</div><div class="col-md-6"><div class="row">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					if( $i == 2 || $i == 3) {
					 	$html .= '<div class="col-md-6 col-sm-6  gird_list ata_grid_style margin_bottom_5">';
					}else{
						$html .= '<div class="col-md-6 col-sm-6  gird_list ata_grid_style margin_bottom_0">';
					}
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media hero_block_child_image"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="ata_caption">';
						if ( $cat_detail != "" ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h5><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h5>';
						
						
						
						$html .= '</div>';
						
						
					
					$html .='</div>';
					
				}
				
			
			endwhile;
			
			$html .= '</div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_hero_block', $html );
		
	}
}


if( ! function_exists( 'ata_news_hero_block_style_2' ) ){
	/**
	 * Implement News POSTS HERO BLOCK
	 *
	 * @since 1.0.0
	 *
	 * @param array $args, array $helper
	 * @return $html
	 */
	function ata_news_hero_block_style_2( $args = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['category'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['category'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['category'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( array( 'posts_per_page' => 10 ) ) );
		
		$html = '<div class="ata_news_hero_block"><div class="row  ata_grids_style_fly">';
		
		if ( $the_query->have_posts() ) :
			$i = 0; $j = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++; 
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				if( $i === 3 ){
					$html .= '<div class="col-md-6  gird_list ata_grid_style force-pull-5 flex-unordered">';
					
					if ( $categories_list  && $helper['category'] == true ) {
						  $html .= $categories_list;
						}    
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '<div class="ata_caption">';
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
					
						$html .= '</div>';
					
					$html .= '</div>'; 
				}else{ $j++;
					if( $j == 1 || $j == 3 ){ $html .= '<div class="col-md-3">'; 
						$html .= '<div class="col-md-12 col-sm-12  gird_list ata_grid_style margin_bottom_10">';
					 }else{
						$html .= '<div class="col-md-12 col-sm-12  gird_list ata_grid_style ">'; 
					 }
					
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="ata_caption redo-left-right">';
						if ( $cat_detail != "" ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h5><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h5>';
						
						
						
						$html .= '</div>';
						
						
					
					$html .='</div>';
					
					
					if( $j == 2 ){ $html .='</div>'; $j=0; }else if( $i === count( $the_query->posts ) ) { $html .='</div>'; }
				}
				
			
			endwhile;
			$html .='</div>';
		
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_hero_block_style_2', $html );
		
	}
}







if( ! function_exists( 'ata_news_news_block_style_1' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_1( $args = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_news_news_block_style_1_wrp"><div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				
					$html .= '<div class="ata_grids_style_fly col-md-6"><div class=" gird_list ata_grid_style">';
					
						if ( $categories_list  && $helper['category'] == true ) {
						  $html .= $categories_list;
						}    
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '<div class="ata_caption">';
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
					
						$html .= '</div>';
					
					$html .= '</div></div><div class="col-md-6"><div class="row ata_grids_style_simply">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					
						$html .= '<div class="row  gird_list ata_grid_style ata_add_border">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="col-md-8">';
						if ( $cat_detail != "" && $helper['child_category'] === true ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_news_block_style_1', $html );
		
	}
}


if( ! function_exists( 'ata_news_news_block_style_2' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_2( $args = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		
		$html = '<div class="ata_news_news_block_style_2_wrp"> <div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					
					$html .= '<div class="ata_grids_style_simply col-md-6"><div class=" gird_list ata_grid_style">';
					
					 	if( $helper['title_and_meta_position'] === 'top' ) :
							if ( $categories_list && $helper['category'] === true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;	
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						if( $helper['title_and_meta_position'] === 'bottom' ) :
							if ( $categories_list  && $helper['category'] == true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;	
							
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
						
					
					
					$html .= '</div></div><div class="col-md-6"><div class="row ata_grids_style_simply">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					$html .= '<div class="row  gird_list ata_grid_style ata_add_border">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="col-md-8">';
						if ( $cat_detail != "" && $helper['child_category'] === true) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_news_block_style_2', $html );
		
	}
}


if( ! function_exists( 'ata_news_news_block_style_3' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_3( $args = array(), $helper = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_news_news_block_style_3_wrp"><div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					$html .= '<div class="ata_grids_style_fly col-md-12 "><div class=" gird_list ata_grid_style">';
					
					if ( $categories_list  && $helper['category'] == true ) {
						  $html .= $categories_list;
						}    
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '<div class="ata_caption">';
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
					
						$html .= '</div></div>';
					
					$html .= '</div><div class="col-md-12"><div class="ata_grids_style_simply">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					$html .= '<div class="row  gird_list ata_grid_style ata_add_border">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						
						$html .= '<div class="col-md-8">';
						$categories_list = get_the_category_list( );
						if ( $categories_list  && $helper['child_category'] == true ) {
							$html .= '<div class="list-inline ata_meta">'.$categories_list.'</div>';
						}
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_carsoul_view', $html );
		
	}
}



if( ! function_exists( 'ata_news_news_block_style_4' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_4( $args = array()){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$html = '<div class="ata_news_news_block_style_4_wrp"><div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					$html .= '<div class="ata_grids_style_simply col-md-12"><div class=" gird_list ata_grid_style">';
					
					  	if( $helper['title_and_meta_position'] === 'top' ) :
							if ( $categories_list  && $helper['category'] == true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;	
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						if( $helper['title_and_meta_position'] === 'bottom' ) :
							if ( $categories_list  && $helper['category'] == true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;	
							
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ). '</p>';
						}
						
						$html .= '</div>';
					
					$html .= '</div><div class="col-md-12"><div class=" ata_grids_style_simply">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					$html .= '<div class="row  gird_list ata_grid_style ata_add_border">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="col-md-8">';
						if ( $cat_detail != "" && $helper['child_category'] === true ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_carsoul_view', $html );
		
	}
}



if( ! function_exists( 'ata_news_news_block_style_5' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_5( $args = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$html = '<div class="ata_news_news_block_style_5_wrp">';
		
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="row">';
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					$html .= '<div class="ata_grids_style_simply col-md-12"><div class="row  gird_list ata_grid_style">';
					
					  if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-5"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
							$html .= '<div class="col-md-5">';
							if( $helper['title_and_meta_position'] === 'bottom' ) :
								if ( $categories_list  && $helper['category'] == true ) {
									 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
								}
								$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
								
								$html .= ata_news_meta_return( $helper['meta'] );
							endif;	
								
							if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
								$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
							}
							$html .= '</div>';
						$html .= '</div>';
					
					$html .= '</div><div class="col-md-12"><div class="row ata_grids_style_simply">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					$html .= '<div class="col-md-6  gird_list ata_grid_style ata_add_border"><div class="row">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="col-md-8">';
						if ( $cat_detail != ""  && $helper['child_category'] === true  ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div></div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_carsoul_view', $html );
		
	}
}


if( ! function_exists( 'ata_news_news_block_style_6' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_6( $args = array(), $helper = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_news_news_block_style_6_wrp"><div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					$html .= '<div class="ata_grids_style_fly col-md-12 margin_bottom_20"><div class=" gird_list ata_grid_style">';
					
					if ( $categories_list  && $helper['category'] == true ) {
						  $html .= $categories_list;
						}    
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '<div class="ata_caption">';
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
					
						$html .= '</div></div>';
					
					$html .= '</div><div class="col-md-12"><div class="ata_grids_style_simply"><div class="row">'; 
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					$html .= '<div class="col-md-6  gird_list ata_grid_style ata_add_border"><div class="row">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="col-md-8">';
						if ( $cat_detail != ""  && $helper['child_category'] === true  ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div></div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_news_block_style_6', $html );
		
	}
}

if( ! function_exists( 'ata_news_news_block_style_7' ) ){
	/**
	 * Implement News Block.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_news_block_style_7( $args = array(), $helper = array() ){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['child_image_size'] = ( isset( $args['child_image_size'] ) && $args['child_image_size'] != "" ) ? $args['child_image_size'] : 'thumbnail';
		$helper['child_category'] = ( isset( $args['child_category'] ) && $args['child_category'] != "" ) ? true : false;
		$helper['child_meta'] = array( 
			'posted_date' => ( isset( $args['child_posted_date'] ) && $args['child_posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['child_comment'] ) && $args['child_comment'] != "" ) ? true : false,
			'author' => ( isset( $args['child_author'] ) && $args['child_author'] != "" ) ? true : false
		);
		$helper['child_content'] = ( isset( $args['child_content'] ) && $args['child_content'] != "" ) ? true : false;
		$helper['child_content_length'] = ( isset( $args['child_content_length'] ) && $args['child_content_length'] != "" ) ? $args['child_content_length'] : 100;
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		$html = '<div class="ata_news_news_block_style_7_wrp"><div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				
				$categories_list = get_the_category_list( );
				
				
				if( $i === 1){
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
					$html .= '<div class="ata_grids_style_simply col-md-12 margin_bottom_20 "><div class=" gird_list ata_grid_style">';
					
					if( $helper['title_and_meta_position'] === 'top' ) :
							if ( $categories_list && $helper['category'] === true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;	
					
					  
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						if( $helper['title_and_meta_position'] === 'bottom' ) :
							if ( $categories_list && $helper['category'] === true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;	
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
						}
					
						$html .= '</div>';
					
					$html .= '</div><div class="col-md-12"><div class="ata_grids_style_simply"><div class="row">'; 
					
					
				}else{
					$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['child_image_size'] );
					$html .= '<div class="col-md-6  gird_list ata_grid_style ata_add_border"><div class="row">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media remove_after"><span class="redu_to_5"><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-4"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$cat_detail = ata_get_single_post_category( get_the_ID() );
						$html .= '<div class="col-md-8">';
						if ( $cat_detail != ""  && $helper['child_category'] === true  ) :
							$html .='<span class="single_post_category "> <a href="'.esc_url( $cat_detail['url'] ).'">'.esc_html( $cat_detail['name'] ).'</a></span>';
						endif;
						$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
						
						$html .= ata_news_meta_return( $helper['child_meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['child_content'] === true ){
							$html .= ata_trim_text( get_the_content(), $helper['child_content_length'] );
						}
						$html .= '</div>';
						
						
					
					$html .='</div></div>';
					
				}
				
			endwhile;
			
			$html .= '</div></div></div>';
			
		endif;
		$html .= '<div class="clearfix"></div></div></div>';
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_news_block_style_7', $html );
		
	}
}



if( ! function_exists( 'ata_news_grids_style_1' ) ){
	/**
	 * Implement News Grids.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_grids_style_1( $args = array(), $helper = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		if( get_query_var( 'paged' ) ) :
			$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		endif;
		if( get_query_var( 'page' ) ) :
			$args['paged'] = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
		endif;
			
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$colums = ( isset( $args['number_of_colums'] ) && $args['number_of_colums'] != "" ) ? $args['number_of_colums'] : '4';
		$colums_sm = ( isset( $args['number_of_colums_sm'] ) && $args['number_of_colums_sm'] != "" ) ? $args['number_of_colums_sm'] : '6';
		$colums_xs = ( isset( $args['number_of_colums_xs'] ) && $args['number_of_colums_xs'] != "" ) ? $args['number_of_colums_xs'] : '12';
		
		$html = '<div class="ata_news_grids_style_1_wrp ata_grids_style_simply"> <div class="row">';
		
		if ( $the_query->have_posts() ) :
			
		
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				
					$html .= '<div class=" gird_list ata_grid_style small-blog-box ata_add_border col-md-'.$colums.' col-sm-'.$colums_sm.' col-xs-'.$colums_xs.'">';
						
						if( $helper['title_and_meta_position'] === 'top' ) :
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							
							if ( $categories_list  && $helper['category'] === true ) {
								
								  $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;
						
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						
						if( $helper['title_and_meta_position'] === 'bottom' ) :
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							if ( $categories_list  && $helper['category'] === true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;
						
						
						
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
						}
					
					
						$helper['show_read_more'] = ( isset( $args['show_read_more'] ) && $args['show_read_more'] != "" ) ? true : false;
						if ( $helper['show_read_more'] == true ){
						 $html .= '<a href="'.esc_url( get_permalink()).'" class="btn btn-primary">'.__('Continue Reading ','newsbd24').'<i class="fa fa-fw fa-angle-double-right"></i></a>';
						}
					
					$html .='</div>';
					
				
				
			endwhile;
			$html .='</div>';
		
		
		
		
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		if( function_exists('ata_news_loop_navigation') ){
			$html .= ata_news_loop_navigation( $the_query , $args['pagination'] );
		}
		
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_grids_style_1', $html );
		
	}
}


if( ! function_exists( 'ata_news_grids_style_2' ) ){
	/**
	 * Implement News Grids Style 2.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_grids_style_2( $args = array()){
		
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		if( get_query_var( 'paged' ) ) :
			$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		endif;
		if( get_query_var( 'page' ) ) :
			$args['paged'] = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
		endif;
			
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$colums = ( isset( $args['number_of_colums'] ) && $args['number_of_colums'] != "" ) ? $args['number_of_colums'] : '4';
		$colums_sm = ( isset( $args['number_of_colums_sm'] ) && $args['number_of_colums_sm'] != "" ) ? $args['number_of_colums_sm'] : '6';
		$colums_xs = ( isset( $args['number_of_colums_xs'] ) && $args['number_of_colums_xs'] != "" ) ? $args['number_of_colums_xs'] : '12';
		
		
		$html = '<div class="ata_news_grids_style_2_wrp small-blog-box ata_grids_style_fly"> <div class="row">';
		
		if ( $the_query->have_posts() ) :
			
			
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				
				
					$html .= '<div class=" gird_list ata_grid_style col-md-'.$colums.' col-sm-'.$colums_sm.' col-xs-'.$colums_xs.'">';
					
					if ( $categories_list  && $helper['category'] == true ) {
						  $html .= $categories_list;
						}    
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '<div class="ata_caption add__15">';
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
						}
					
						 $helper['show_read_more'] = ( isset( $args['show_read_more'] ) && $args['show_read_more'] != "" ) ? true : false;
						if ( $helper['show_read_more'] == true ){
						 $html .= '<a href="'.esc_url( get_permalink()).'" class="btn btn-primary">'.__('Continue Reading ','newsbd24').'<i class="fa fa-fw fa-angle-double-right"></i></a>';
						}
					
						$html .= '</div></div>';
					
					
				
				
			endwhile;
			
			
			
		endif;
		$html .= '</div><div class="clearfix"></div></div>';
		if( function_exists('ata_news_loop_navigation') ){
			$html .= ata_news_loop_navigation( $the_query , $args['pagination'] );
		}
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_grids_style_2', $html );
		
	}
}



if( ! function_exists( 'ata_news_grids_style_3' ) ){
	/**
	 * Implement News Grids.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_grids_style_3( $args = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		if( get_query_var( 'paged' ) ) :
			$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		endif;
		if( get_query_var( 'page' ) ) :
			$args['paged'] = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
		endif;
			
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$colums = ( isset( $args['number_of_colums'] ) && $args['number_of_colums'] != "" ) ? $args['number_of_colums'] : '4';
		$colums_sm = ( isset( $args['number_of_colums_sm'] ) && $args['number_of_colums_sm'] != "" ) ? $args['number_of_colums_sm'] : '6';
		$colums_xs = ( isset( $args['number_of_colums_xs'] ) && $args['number_of_colums_xs'] != "" ) ? $args['number_of_colums_xs'] : '12';
		
		
		$html = '<div class="ata_news_grids_style_3_wrp ata_grids_style_simply">';
		
		if ( $the_query->have_posts() ) :
			
		
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				
					$html .= '<div class=" gird_list ata_grid_style small-blog-box ata_add_border row">';
					
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<div class="col-md-5"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a></div>';
						}else{
						  $html .= '<div class="col-md-5"><a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a></div>';
							
						}
						
						$html .= '<div class="col-md-7">';
						
						$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
						if ( $categories_list && $helper['category'] === true  ) {
							 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
						}
						$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
						
						$html .= ata_news_meta_return( $helper['meta'] );
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
						}
					
						 $helper['show_read_more'] = ( isset( $args['show_read_more'] ) && $args['show_read_more'] != "" ) ? true : false;
						if ( $helper['show_read_more'] == true ){
						 $html .= '<a href="'.esc_url( get_permalink()).'" class="btn btn-primary">'.__('Continue Reading ','newsbd24').'<i class="fa fa-fw fa-angle-double-right"></i></a>';
						}
					
						$html .='</div>';
						
					
					$html .='</div>';
					
				
				
			endwhile;
			
		
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		if( function_exists('ata_news_loop_navigation') ){
			$html .= ata_news_loop_navigation( $the_query , $args['pagination'] );
		}
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_grids_style_3', $html );
		
	}
}




if( ! function_exists( 'ata_news_grids_style_4' ) ){
	/**
	 * Implement News Grids.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_grids_style_4( $args = array(), $helper = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		if( get_query_var( 'paged' ) ) :
			$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		endif;
		if( get_query_var( 'page' ) ) :
			$args['paged'] = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
		endif;
			
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$colums = ( isset( $args['number_of_colums'] ) && $args['number_of_colums'] != "" ) ? $args['number_of_colums'] : '4';
		$colums_sm = ( isset( $args['number_of_colums_sm'] ) && $args['number_of_colums_sm'] != "" ) ? $args['number_of_colums_sm'] : '6';
		$colums_xs = ( isset( $args['number_of_colums_xs'] ) && $args['number_of_colums_xs'] != "" ) ? $args['number_of_colums_xs'] : '12';
		
		$html = '<div class="ata_news_grids_style_4_wrp ata_grids_style_simply"> <div class="row">';
		
		if ( $the_query->have_posts() ) :
			
		
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				
					$html .= '<div class=" gird_list ata_grid_style small-blog-box ata_add_border col-md-12  blog-box grid-item clearfix">
					<div class="entry-content blog-desc text-center">';
						
						if( $helper['title_and_meta_position'] === 'top' ) :
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							
							if ( $categories_list  && $helper['category'] === true ) {
								
								 $html .= '<span class="cat-links cat__link__wrp">'.$categories_list.'</span>';
							}
							$html .= '<h2><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h2>';
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;
						
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						
						if( $helper['title_and_meta_position'] === 'bottom' ) :
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							if ( $categories_list  && $helper['category'] === true ) {
								 $html .= '<span class="cat-links cat__link__wrp">'.$categories_list.'</span>';
							}
							$html .= '<h2><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h2>';
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;
						
						
						
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
						}
					
						$helper['show_read_more'] = ( isset( $args['show_read_more'] ) && $args['show_read_more'] != "" ) ? true : false;
						if ( $helper['show_read_more'] == true ){
						 $html .= '<a href="'.esc_url( get_permalink()).'" class="btn btn-primary">'.__('Continue Reading ','newsbd24').'<i class="fa fa-fw fa-angle-double-right"></i></a>';
						}
					
					$html .='</div></div>';
					
				
				
			endwhile;
			$html .='</div>';
		
		
		
		
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		if( function_exists('ata_news_loop_navigation') ){
			$html .= ata_news_loop_navigation( $the_query , $args['pagination'] );
		}
		
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_grids_style_1', $html );
		
	}
}



if( ! function_exists( 'ata_news_grids_style_5' ) ){
	/**
	 * Implement News Grids.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_grids_style_5( $args = array(), $helper = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		if( get_query_var( 'paged' ) ) :
			$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		endif;
		if( get_query_var( 'page' ) ) :
			$args['paged'] = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
		endif;
			
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		
		
		$colums = ( isset( $args['number_of_colums'] ) && $args['number_of_colums'] != "" ) ? $args['number_of_colums'] : '4';
		$colums_sm = ( isset( $args['number_of_colums_sm'] ) && $args['number_of_colums_sm'] != "" ) ? $args['number_of_colums_sm'] : '6';
		$colums_xs = ( isset( $args['number_of_colums_xs'] ) && $args['number_of_colums_xs'] != "" ) ? $args['number_of_colums_xs'] : '12';
		
		$html = '<div class="ata_news_grids_style_5_wrp ata_grids_style_simply"> <div class="row news_mag_plugins_masonry_grid">';
		$html .= '<div class=" gird_list ata_grid_style small-blog-box ata_grid-sizer ata_add_border col-md-'.$colums.' col-sm-'.$colums_sm.' col-xs-'.$colums_xs.'"></div>';
		if ( $the_query->have_posts() ) :
			
		
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				
					$html .= '<div class=" gird_list ata_grid_style ata_grid-item small-blog-box ata_add_border col-md-'.$colums.' col-sm-'.$colums_sm.' col-xs-'.$colums_xs.'">';
						
						if( $helper['title_and_meta_position'] === 'top' ) :
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							
							if ( $categories_list  && $helper['category'] === true ) {
								
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;
						
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						
						if( $helper['title_and_meta_position'] === 'bottom' ) :
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							if ( $categories_list  && $helper['category'] === true ) {
								 $html .= '<div class="category__style__1"><span class="ata_block">'.$categories_list.'</span></div>';
							}
							$html .= '<h4><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h4>';
							$html .= ata_news_meta_return( $helper['meta'] );
						endif;
						
						
						
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
						}
					
					
						$helper['show_read_more'] = ( isset( $args['show_read_more'] ) && $args['show_read_more'] != "" ) ? true : false;
						if ( $helper['show_read_more'] == true ){
						 $html .= '<a href="'.esc_url( get_permalink()).'" class="btn btn-primary">'.__('Continue Reading ','newsbd24').'<i class="fa fa-fw fa-angle-double-right"></i></a>';
						}
					
					$html .='</div>';
					
				
				
			endwhile;
			$html .='</div>';
		
		
		
		
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		if( function_exists('ata_news_loop_navigation') ){
			$html .= ata_news_loop_navigation( $the_query , $args['pagination'] );
		}
		
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_grids_style_1', $html );
		
	}
}



if( ! function_exists( 'ata_news_posts_list_wdigets' ) ){
	/**
	 * Implement News List.
	 *
	 * @since 1.0.0
	 *
	 * @param $id, $args, $style
	 * @return $html
	 */
	function ata_news_posts_list_wdigets( $args = array() ){
		$helper['image_size'] = ( isset( $args['image_size'] ) && $args['image_size'] != "" ) ? $args['image_size'] : 'full';
		$helper['category'] = ( isset( $args['category'] ) && $args['category'] != "" ) ? true : false;
		$helper['meta'] = array( 
			'posted_date' => ( isset( $args['posted_date'] ) && $args['posted_date'] != "" ) ? true : false,
			'comment' => ( isset( $args['comment'] ) && $args['comment'] != "" ) ? true : false,
			'author' => ( isset( $args['author'] ) && $args['author'] != "" ) ? true : false
		);
		$helper['content'] = ( isset( $args['content'] ) && $args['content'] != "" ) ? true : false;
		$helper['content_length'] = ( isset( $args['content_length'] ) && $args['content_length'] != "" ) ? $args['content_length'] : 100;
		
		
		$helper['title_and_meta_position'] = ( isset( $args['title_and_meta_position'] ) && $args['title_and_meta_position'] != "" ) ? $args['title_and_meta_position'] : 'bottom';
		
		if( get_query_var( 'paged' ) ) :
			$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		endif;
		if( get_query_var( 'page' ) ) :
			$args['paged'] = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
		endif;
			
		
		$the_query = new WP_Query( ata_set_query_builder( $args ) );
		$html = '';
	
		if ( $the_query->have_posts() ) :
			
			$html .= '<div class="ata_widget_list">';
			$i = 0;
			while ( $the_query->have_posts() ) : $the_query->the_post(); $i++;
			
				$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
				$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
				$categories_list = get_the_category_list( );
				
				
					$html .= '<div class="row padding_bootom_10">';
						
						$html .= '<div class="col-md-4 col-sm-4">';
						if( $post_thumbnail_url[0] != "" ){
							$html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark" class="ata_media"><span><img src="'.esc_url( $post_thumbnail_url[0] ).'" alt="'.get_the_title().'" /></span></a>';
						}else{
						  $html .= '<a href="'.esc_url( get_permalink( get_the_id() ) ).'" rel="bookmark"><img src="'.ATA_VAR_URL.'/assets/img/no-image.png" alt="'.esc_html__( 'Thumbnail not found', 'ATA_NEWS_LANG' ).'" /></a>';
							
						}
						$html .= '</div><div class="col-md-8 col-sm-8">';
						
						
						
							$categories_list = get_the_category_list( esc_html__( ', ', 'ATA_NEWS_LANG' ) );
							if ( $categories_list  && $helper['category'] === true ) {
								 $html .= ''.$categories_list.'';
							}
							$html .= '<h6><a href="'.esc_url( get_permalink( get_the_id() ) ).'">'.get_the_title().'</a></h6>';
							$html .= ata_news_meta_return( $helper['meta'] );
						
						
						
						
						
						if( function_exists( 'ata_trim_text' ) && $helper['content'] == true ){
							$html .= '<p>'.ata_trim_text( get_the_content(), $helper['content_length'] ).'</p>';
						}
					
					
						$helper['show_read_more'] = ( isset( $args['show_read_more'] ) && $args['show_read_more'] != "" ) ? true : false;
						if ( $helper['show_read_more'] == true ){
						 $html .= '<a href="'.esc_url( get_permalink()).'" class="btn btn-primary">'.__('Continue Reading ','newsbd24').'<i class="fa fa-fw fa-angle-double-right"></i></a>';
						}
					
					$html .='</div></div>';
					
				
				
			endwhile;
		
		
		
		
		
			
		endif;
		$html .= '<div class="clearfix"></div></div>';
		
		do_action('ata_reset');	
		
		echo apply_filters( 'ata_news_grids_style_1', $html );
		
	}
}

