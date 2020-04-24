<?php
// If this file is called directly, abort.

$html .= '<div class="ata_news_carsoul_loader owl-carousel owl-theme ata_grids_style_fly">';
while ( $the_query->have_posts() ) : $the_query->the_post();
	$post_thumbnail_id = get_post_thumbnail_id( get_the_ID() );
	$post_thumbnail_url = wp_get_attachment_image_src( $post_thumbnail_id, $helper['image_size'] );
	
	$html .= '<div class="col-md-12 gird_list">';
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
		
		if( function_exists( 'ata_trim_text' ) && $helper['content'] === true ){
			$html .= ata_trim_text( get_the_content(), $helper['content_length'] );
		}
		
	$html .= '</div>';
		
	$html .= '</div>';
endwhile;
$html .= '</div>';
?>