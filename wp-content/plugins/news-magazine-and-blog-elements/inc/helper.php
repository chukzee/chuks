<?php
/**
 * All Helper Function 
 *
 *
 * @package news_magazine_and_blog_elements
 */
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
 if ( ! function_exists( 'ata_get_image_sizes_options' ) ) :

	/**
	 * Returns image sizes options.
	 *
	 * @since 1.0.0
	 *
	 * @param bool  $add_disable    True for adding No Image option.
	 * @param array $allowed        Allowed image size options.
	 * @param bool  $show_dimension True for showing dimension.
	 * @return array Image size options.
	 */
	function ata_get_image_sizes_options( $add_disable = true, $allowed = array(), $show_dimension = true ) {

		global $_wp_additional_image_sizes;

		$choices = array();

		if ( true === $add_disable ) {
			$choices['disable'] = esc_html__( 'No Image', 'newsgreen' );
		}

		$choices['thumbnail'] = esc_html__( 'Thumbnail', 'newsgreen' );
		$choices['medium']    = esc_html__( 'Medium', 'newsgreen' );
		$choices['large']     = esc_html__( 'Large', 'newsgreen' );
		$choices['full']      = esc_html__( 'Full (original)', 'newsgreen' );

		if ( true === $show_dimension ) {
			foreach ( array( 'thumbnail', 'medium', 'large' ) as $key => $_size ) {
				$choices[ $_size ] = $choices[ $_size ] . ' (' . get_option( $_size . '_size_w' ) . 'x' . get_option( $_size . '_size_h' ) . ')';
			}
		}

		if ( ! empty( $_wp_additional_image_sizes ) && is_array( $_wp_additional_image_sizes ) ) {
			foreach ( $_wp_additional_image_sizes as $key => $size ) {
				$choices[ $key ] = $key;
				if ( true === $show_dimension ) {
					$choices[ $key ] .= ' (' . $size['width'] . 'x' . $size['height'] . ')';
				}
			}
		}

		if ( ! empty( $allowed ) ) {
			foreach ( $choices as $key => $value ) {
				if ( ! in_array( $key, $allowed, true ) ) {
					unset( $choices[ $key ] );
				}
			}
		}

		return $choices;

	}

endif;


 if ( ! function_exists( 'ata_vc_get_image_sizes_options' ) ) :

	/**
	 * Returns image sizes options.
	 *
	 * @since 1.0.0
	 *
	 * @param bool  $add_disable    True for adding No Image option.
	 * @param array $allowed        Allowed image size options.
	 * @param bool  $show_dimension True for showing dimension.
	 * @return array Image size options.
	 */
	function ata_vc_get_image_sizes_options( $add_disable = true, $allowed = array(), $show_dimension = true ) {

		global $_wp_additional_image_sizes;

		$choices = array();

		if ( true === $add_disable ) {
			$choices['disable'] = esc_html__( 'No Image', 'newsgreen' );
		}

		$choices['thumbnail'] = esc_html__( 'Thumbnail', 'newsgreen' );
		$choices['medium']    = esc_html__( 'Medium', 'newsgreen' );
		$choices['large']     = esc_html__( 'Large', 'newsgreen' );
		$choices['full']      = esc_html__( 'Full (original)', 'newsgreen' );

		if ( true === $show_dimension ) {
			foreach ( array( 'thumbnail', 'medium', 'large' ) as $key => $_size ) {
				$choices[ $_size ] = $choices[ $_size ] . ' (' . get_option( $_size . '_size_w' ) . 'x' . get_option( $_size . '_size_h' ) . ')';
			}
		}

		if ( ! empty( $_wp_additional_image_sizes ) && is_array( $_wp_additional_image_sizes ) ) {
			foreach ( $_wp_additional_image_sizes as $key => $size ) {
				$choices[ $key ] = $key;
				if ( true === $show_dimension ) {
					$choices[ $key ] .= ' (' . $size['width'] . 'x' . $size['height'] . ')';
				}
			}
		}

		$vc_choices = array();
		foreach ( $choices as $key => $value ) {
			$vc_choices[ $value ] = $key;
		}
		

		return $vc_choices;

	}

endif;

if ( ! function_exists( 'ata_get_single_post_category' ) ) :

	/**
	 * Get single post category.
	 *
	 * @since 1.0.0
	 *
	 * @param int $id Post ID.
	 * @return array Category detail.
	 */
	function ata_get_single_post_category( $id ) {
		$output = array();

		$cats = get_the_category( $id );

		if ( ! empty( $cats ) ) {
			$cat  = array_shift( $cats );
			$output['name'] = $cat->name;
			$output['slug'] = $cat->name;
			$output['url']  = get_term_link( $cat );
		}

		return $output;
	}

endif;


if ( ! function_exists( 'ata_get_single_post_category' ) ) :

	/**
	 * Get single post category.
	 *
	 * @since 1.0.0
	 *
	 * @param int $id Post ID.
	 * @return array Category detail.
	 */
	function ata_get_single_post_category( $id ) {
		$output = array();

		$cats = get_the_category( $id );

		if ( ! empty( $cats ) ) {
			$cat  = array_shift( $cats );
			$output['name'] = $cat->name;
			$output['slug'] = $cat->name;
			$output['url']  = get_term_link( $cat );
		}

		return $output;
	}

endif;


if ( !function_exists( 'ata_reset' ) ){
	/**
	 * Get ata_reset.
	 *
	 * @since 1.0.0
	 *
	 */
	function ata_reset( ) {
			wp_reset_postdata();
		wp_reset_query();
	}
}
add_action('ata_reset','ata_reset');


if ( !function_exists( 'ata_set_query_builder' ) ){
	/**
	 * Get ata_query_builder.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args
	 * @return array $WP_Query.
	 */
	function ata_set_query_builder(  $args = array() ) {
		
		do_action('ata_reset');
		
		if( isset( $args['post_type'] ) && $args['post_type'] != "" ){
			$query['post_type'] = $args['post_type'];
		}
		
		$query['post_status'] = ( isset( $args['post_status'] ) && $args['post_status'] != "" ) ? $args['post_status'] : 'publish';
		
		if( isset( $args['post_category'] ) && $args['post_category'] != "" && absint( $args['post_category'] ) > 0 ){
			$query['cat'] = absint( $args['post_category'] );
		}
		
		if( isset( $args['category__not_in'] ) && $args['category__not_in'] != "" && in_array ( $args['category__not_in'] )  ){
			$query['category__not_in'] = $args['category__not_in'];
		}
		$query['order'] =  ( isset( $args['order'] ) && $args['order'] != "" ) ? $args['order'] : 'DESC';
		
		if( isset( $args['orderby'] ) && $args['orderby'] != ""  && $args['orderby'] != "views_count" ){
			$query['orderby'] = $args['orderby'];
		}
				
		if( isset( $args['paged'] ) && $args['paged'] != "" && absint( $args['paged'] ) > 0  ){
			$query['paged'] = $args['paged'];
		}
		
		if( isset( $args['page'] ) && $args['page'] != "" && absint( $args['page'] ) > 0  ){
			$query['paged'] = $args['page'];
		}
		
		if( isset( $args['post_tag'] ) && $args['post_tag'] != "" && absint( $args['post_tag'] ) > 0 ){
			$query['tag'] = absint( $args['post_tag'] );
		}
		if( isset( $args['tag_slug__in'] ) && $args['tag_slug__in'] != "" && in_array ( $args['tag_slug__in'] )  ){
			$query['tag_slug__in'] = $args['tag_slug__in'];
		}
		
		$query['posts_per_page'] = ( isset( $args['post_number'] ) && $args['post_number'] != "" && absint( $args['post_number'] ) > 0  ) ? absint( $args['post_number'] ) : 5;
		
		
		if (isset($args['date_query']) && $args['date_query'] != "") {
			 switch ($args['date_query']){
                    case 'today':
                        $today = getdate();
                        $query['date_query'][]['year']=$today['year'];
                        $query['date_query'][]['month']=$today['mon'];
                        $query['date_query'][]['day']=$today['mday'];
                        break;
                    case 'yesterday':
                        $query['date_query'][]['year']=date("Y", time() - 60 * 60 * 24);
                        $query['date_query'][]['month']=date("m", time() - 60 * 60 * 24);
                        $query['date_query'][]['day']=date("d", time() - 60 * 60 * 24);
                        break;
                    case 'this_month':
                        $today = getdate();
                        $query['date_query'][]['year']=$today['year'];
                        $query['date_query'][]['month']=$today['mon'];
                        break;
                    case 'this_year':
                        $today = getdate();
                        $query['date_query'][]['year']=$today['year'];
                        break;
                    case 'last7':
                        $today = getdate();
                        $query['date_query'][]['after']='7 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;
                    case '30':
                        $today = getdate();
                        $query['date_query'][]['after']='30 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;
				    case '30':
                        $today = getdate();
                        $query['date_query'][]['after']='30 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;	
                    case '60':
                        $today = getdate();
                        $query['date_query'][]['after']='60 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;
				   case '60':
                        $today = getdate();
                        $query['date_query'][]['after']='60 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;
				   case '90':
                        $today = getdate();
                        $query['date_query'][]['after']='90 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;
				   case '120':
                        $today = getdate();
                        $query['date_query'][]['after']='120 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;	
					case '160':
                        $today = getdate();
                        $query['date_query'][]['after']='120 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;			
                    case '365':
                        $today = getdate();
                        $query['date_query'][]['after']='365 days ago';
                        $query['date_query'][]['inclusive']=true;
                        break;
                    
                }
		}
		
		if( isset( $args['orderby'] ) && $args['orderby'] == "views_count" ){
			$query['orderby'] = 'meta_value_num';
			$query['meta_key'] = 'wpb_post_views_count';
		}
		$qargs = apply_filters( 'ata_get_query_builder', wp_parse_args ( $query ) );
		
		return $qargs;
		
		
	}
}



if ( !function_exists( 'ata_get_template' ) ){
	/**
	 * Get ata_get_template.
	 *
	 * @since 1.0.0
	 *
	 * @param string $template
	 * @return file $template.
	 */
	function ata_get_template( $template ) {
	
		// Get the template slug
		$template_slug = trim( $template, '.php' );
		$template = $template_slug . '.php';
	 
		// Check if a custom template exists in the theme folder, if not, load the plugin template file
		if ( $theme_file = locate_template( array( 'templates/' . $template ) ) ) {
			$file = $theme_file;
			
		}
		else {
			$file = ATA_PATH . '/templates/' . $template;
			
		}
		$file = apply_filters( 'rc_repl_template_' . $template, $file );
		
		if( file_exists( $file )){
			require_once($file);
		}
		
		
	}
}


if ( !function_exists( 'ata_news_meta_return' ) ){
	/**
	 * Get Retrun post Meta.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values
	 * @return html $html.
	 */
	function ata_news_meta_return( $values = array() ) {	
		
		if( $values['posted_date'] != true  && $values['comment'] != true && $values['author'] != true  ){
				
			return false;	
			
		}
		
	
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		 $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time>';
		}
		
		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);
		?>
		<?php $byline = sprintf(
        /* translators: %s: post author */
        __( 'by %s','newsgreen' ),
        '<a href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a>'
        );
         $html = '<ul class="list-inline ata_meta">';
		 
			if ( $values['posted_date'] == true ) { $html .= '<li>'.$time_string.'</li>'; }
			
			if ( $values['author'] == true ) { $html .= '<li>'. $byline .'</li>'; } 
            
            if ( $values['comment'] == true ) {
				$html .= '<li class="comments-link">';
				ob_start();
				/* translators: %s: post title */
				comments_popup_link( sprintf( wp_kses( __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'newsgreen' ), array( 'span' => array( 'class' => array() ) ) ), get_the_title() ) );
				$html .= ob_get_contents();
  				 ob_end_clean();
				$html .= '</li>';
            }
            
        $html .= '</ul>';
		
       return apply_filters( 'ata_news_meta_return', $html );
	}
}

if ( !function_exists( 'ata_trim_text' ) ){
	/**
	 * Get Trim Text.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values
	 * @return html $html.
	 */
	function ata_trim_text($input, $length, $ellipses = true, $strip_html = true) {
		//strip tags, if desired
		if ($strip_html) {
			$input = strip_tags($input);
		}
	  
		//no need to trim, already shorter than trim length
		if (strlen($input) <= $length) {
			return $input;
		}
	  
		//find last space within length
		$last_space = strrpos(substr($input, 0, $length), ' ');
		$trimmata_text = substr($input, 0, $last_space);
	  
		//add ellipses (...)
		if ($ellipses) {
			$trimmata_text .= '...';
		}
	  
		return strip_shortcodes ( $trimmata_text );
	}
}


if ( !function_exists( 'eds_news_extension_siteorigin_add_widget_tabs' ) ){
	/**
	 * Get newsgreen_siteorigin_add_widget_tabs.
	 *
	 * @since 1.0.0
	 *
	 * @param array $tabs
	 * @return array $tabs.
	 */
	function eds_news_extension_siteorigin_add_widget_tabs($tabs) {
		$tabs[] = array(
			'title' => __('ATA : NEWS EXTENSION', 'ATA_NEWS_LANG'),
			'filter' => array(
				'groups' => array('eds_news_extension')
			)
		);
	
		return $tabs;
	}
	add_filter('siteorigin_panels_widget_dialog_tabs', 'eds_news_extension_siteorigin_add_widget_tabs', 20);
}

if ( !function_exists( 'eds_news_extension_add_widget_icons' ) ){
	/**
	 * Get newsgreen_siteorigin_add_widget_tabs.
	 *
	 * @since 1.0.0
	 *
	 * @param array $widgets
	 * @return array $widgets.
	 */
	function newsgreen_add_widget_icons($widgets){
		$widgets['NewsGreen']['groups'] = array('eds_news_extension');
		return $widgets;
	}
	add_filter('siteorigin_panels_widgets', 'newsgreen_add_widget_icons');
}


if ( ! function_exists( 'ata_news_loop_navigation' ) ) :

	/**
	 * Post Posts Loop Navigation
	 *
	 * @since 1.0.0
	 */
	function ata_news_loop_navigation( $the_query, $type = 'default' ) {
		ob_start();
		
		if( $type === 'default' ):
			$GLOBALS['wp_query']->max_num_pages = $the_query->max_num_pages;
			$args = array (
			   'prev_text'          => '<i class="fa fa-long-arrow-left"></i>'. esc_html__('Previous Posts','newsbd24'),
			   'next_text'          =>  esc_html__('Next Posts','newsbd24').'<i class="fa fa-long-arrow-right"></i>',
			);
			echo '<div class="loop-prev-next">';
			the_posts_navigation( $args );
			echo '</div>';
		
		elseif( $type === 'numeric' ):
			$GLOBALS['wp_query']->max_num_pages = $the_query->max_num_pages;
			echo "<div class='clearfix'></div><div class='pagination justify-content-center'>";
			the_posts_pagination( array(
				'format' => '/page/%#%',
				'type' => 'list',
				'mid_size' => 2,
				'prev_text' => esc_html__( 'Previous', 'newsbd24' ),
				'next_text' => esc_html__( 'Next', 'newsbd24' ),
				'screen_reader_text' => esc_html__( '&nbsp;', 'newsbd24' ),
			) );
			echo "</div>";
		elseif( $type === 'numeric' ):
			
		endif;
		$output =  ob_get_contents();
		
		ob_end_clean();
		return $output;
	}

endif;




if ( ! function_exists( 'wpb_set_post_views' ) ) :

	/**
	 * Post wpb_set_post_views.
	 *
	 * @since 1.0.0
	 * @param int     $postID.
	 * @param WP_Post $post Post object.
	 */ 
	function wpb_set_post_views($postID) {
		
		$count_key = 'wpb_post_views_count';
		$count = get_post_meta($postID, $count_key, true);
		
		
		if($count==''){
			$count = 0;
			delete_post_meta($postID, $count_key);
			add_post_meta($postID, $count_key, '0');
		}else{
			$count++;
			update_post_meta($postID, $count_key, $count);
			
		}
		
	}
endif;



if ( ! function_exists( 'wpb_track_post_views' ) ) :

	/**
	 * Post wpb_set_post_views.
	 *
	 * @since 1.0.0
	 * @param int     $post_id.
	 * @param WP_Post $post Post object.
	 */ 
	function wpb_track_post_views ( $post_id ) {
	
		$post_id = get_the_ID();
		if ( !is_single() ) return;
		if ( empty ( $post_id ) ) {
			global $post;
			$post_id = $post->ID;    
		}
    	wpb_set_post_views( $post_id );
		
	}

endif;
add_action( 'wp_head', 'wpb_track_post_views');


if ( ! function_exists( 'wpb_get_post_views' ) ) :

	/**
	 * Post wpb_set_post_views.
	 *
	 * @since 1.0.0
	 * @param int     $postID.
	 * @param WP_Post $post Post object.
	 */ 
	function wpb_get_post_views($postID){
    	$count_key = 'wpb_post_views_count';
   		$count = get_post_meta($postID, $count_key, true);
   	 	if($count==''){
			delete_post_meta($postID, $count_key);
			add_post_meta($postID, $count_key, '0');
			return esc_html__( '0 View', 'ATA_NEWS_LANG' );
    	}
    	return $count.esc_html__( 'Views', 'ATA_NEWS_LANG' );
	}

endif;

