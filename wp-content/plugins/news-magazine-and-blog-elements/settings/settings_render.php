<?php
/**
* WordPress settings API Render
*
*/
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
} 
if ( !class_exists('aThemeArt_News_Settings_API_Render' ) ):
class aThemeArt_News_Settings_API_Render {
	
	function __construct() {
      add_action( 'wp_head', array($this, 'style_render'),9999 );
	  add_action( 'wp_enqueue_scripts',  array($this, 'fonts_loader') );
    }
	function style_render(){
		$options = get_option('ata_news_typography');
		$primary_heading = isset( $options['primary_heading'] ) ? $options['primary_heading'] : array();
		$secondary_heading = isset( $options['secondary_heading'] ) ? $options['secondary_heading'] : array();
		$quaternary_heading = isset( $options['quaternary_heading'] ) ? $options['quaternary_heading'] : array();
	    $content_font = isset( $options['content_font'] ) ? $options['content_font'] : array();
		$meta_font = isset( $options['meta_font'] ) ? $options['meta_font'] : array();
		
	
	?>
	<style type="text/css">
     <?php if( isset( $options['primary_heading'] ) && $options['primary_heading']['font']  != 'default') : ?>
	.ata_grid_style h4,
	.ata_grid_style h4 a,
	.ata_grid_style h3,
	.ata_grid_style h3 a{
		  <?php echo $primary_heading['font'] != "" ? 'font-family:\''.$primary_heading['font'] .'\', sans-serif; ': '';?>
			<?php echo absint($primary_heading['size']) ? 'font-size:'.absint($primary_heading['size']) .'px; ': '';?>
            <?php echo absint($primary_heading['height']) ? 'line-height:'.absint($primary_heading['height']) .'px; ': '';?>
           
	 }
	 <?php endif;?>   
	 
	  <?php if( isset( $options['secondary_heading'] ) && $options['secondary_heading']['font']  != 'default') : ?>
	 .ata_grid_style h5,
	 .ata_grid_style h5 a{
		  <?php echo $secondary_heading['font'] != "" ? 'font-family:\''.$secondary_heading['font'] .'\', sans-serif; ': '';?>
			<?php echo absint($secondary_heading['size']) ? 'font-size:'.absint($secondary_heading['size']) .'px; ': '';?>
            <?php echo absint($secondary_heading['height']) ? 'line-height:'.absint($secondary_heading['height']) .'px; ': '';?>
           
	 }
	 <?php endif;?> 
	 
	  <?php if( isset( $options['quaternary_heading'] ) && $options['quaternary_heading']['font']  != 'default') : ?>
	 .ata_grid_style h6,
	 .ata_grid_style h6 a{
		  <?php echo $secondary_heading['font'] != "" ? 'font-family:\''.$secondary_heading['font'] .'\', sans-serif; ': '';?>
			<?php echo absint($secondary_heading['size']) ? 'font-size:'.absint($secondary_heading['size']) .'px; ': '';?>
            <?php echo absint($secondary_heading['height']) ? 'line-height:'.absint($secondary_heading['height']) .'px; ': '';?>
           
	 }
	 <?php endif;?> 
	 
	 <?php if( isset( $options['content_font'] ) && $options['content_font']['font']  != 'default') : ?>
	.ata_grid_style,
	.ata_grid_style p{
		<?php echo $content_font['font'] != "" ? 'font-family:\''.$content_font['font'] .'\', sans-serif; ': '';?>
		<?php echo absint($content_font['size']) ? 'font-size:'.absint($content_font['size']) .'px; ': '';?>
		<?php echo absint($content_font['height']) ? 'line-height:'.absint($content_font['height']) .'px; ': '';?>
	}
	 <?php endif;?> 
	 
	 <?php if( isset( $options['meta_font'] ) && $options['meta_font']['font']  != 'default') : ?>
	.ata_grid_style .category__style__1 .ata_block,
	.ata_grid_style .category__style__1 .ata_block a,
	.gird_list .ata_meta,
	.gird_list .ata_meta a{
		<?php echo $meta_font['font'] != "" ? 'font-family:\''.$meta_font['font'] .'\', sans-serif; ': '';?>
		<?php echo absint($meta_font['size']) ? 'font-size:'.absint($meta_font['size']) .'px; ': '';?>
		<?php echo absint($meta_font['height']) ? 'line-height:'.absint($meta_font['height']) .'px; ': '';?>
	}
	<?php endif;?> 
	 
	<?php
	$color = get_option('ata_news_color_scheme');
	
	?>  
	
	   
	 <?php if( isset( $color['primary_color'] ) && $color['primary_color'] != '') : ?>
	.ata_grid_style .category__style__1 .ata_block,
	.ata_grid_style .category__style__1 .ata_block a:hover,
	.ata_grid_style h4,
	.ata_grid_style h3,
	.ata_grid_style h5,
	.ata_grid_style h6,
	.ata_grid_style h4 a,
	.ata_grid_style h3 a,
	.ata_grid_style h5 a,
	.ata_grid_style h6 a,
	.ata_grid_style a,
	.ata_grid_style .ata_meta a:hover{
		<?php echo $color['primary_color'] != "" ? 'color:'.$color['primary_color'] .'!important;': '';?>
	}
	<?php endif;?>  
	
	 <?php if( isset( $color['secondary_color'] ) && $color['secondary_color'] != '') : ?>
	.ata_grid_style .category__style__1 .ata_block,
	.ata_grid_style .category__style__1 .ata_block a:hover,
	.ata_grid_style h4 a:hover,
	.ata_grid_style h3 a:hover,
	.ata_grid_style h5 a:hover,
	.ata_grid_style h6 a:hover,
	.ata_grid_style a:hover,
	.ata_grid_style .ata_meta a {
		<?php echo $color['secondary_color'] != "" ? 'color:'.$color['secondary_color'] .'!important;': '';?>
	}
	<?php endif;?>      
	<?php if( isset( $color['secondary_color'] ) && $color['secondary_color'] != '') : ?>		 
	.ata_grid_style	.btn-primary,
	.ata_grid_style	a.btn-primary  {
		color: <?php echo $color['secondary_color'];?>!important;
		background:none!important;
		border-color:<?php echo $color['secondary_color'];?>;
	}
	<?php endif;?> 
	
	<?php if( isset( $color['secondary_color'] ) && $color['secondary_color'] != '') : ?>		 
	.ata_grid_style	.btn-primary:hover,
	.ata_grid_style	a.btn-primary:hover,
	.single_post_category a  {
		color: <?php echo $color['quaternary_color'];?>!important;
		background:<?php echo $color['secondary_color'];?>!important;
		border-color:<?php echo $color['secondary_color'];?>;
	}
	<?php endif;?>  
	
	 <?php if( isset( $color['quaternary_color'] ) && $color['quaternary_color'] != '') : ?>
	.ata_grid_style .ata_caption .category__style__1 .ata_block,
	.ata_grid_style .ata_caption .category__style__1 .ata_block a:hover,
	.ata_grid_style .ata_caption h4 a:hover,
	.ata_grid_style .ata_caption h3 a:hover,
	.ata_grid_style .ata_caption h5 a:hover,
	.ata_grid_style .ata_caption h6 a:hover,
	.ata_grid_style .ata_caption a:hover,
	.ata_grid_style .ata_caption .ata_meta a,
	.ata_grid_style .ata_caption .category__style__1 .ata_block,
	.ata_grid_style .ata_caption .category__style__1 .ata_block a:hover,
	.ata_grid_style .ata_caption h4,
	.ata_grid_style .ata_caption h3,
	.ata_grid_style .ata_caption h5,
	.ata_grid_style .ata_caption h6,
	.ata_grid_style .ata_caption h4 a,
	.ata_grid_style .ata_caption h3 a,
	.ata_grid_style .ata_caption h5 a,
	.ata_grid_style .ata_caption h6 a,
	.ata_grid_style .ata_caption a,
	.ata_grid_style .ata_caption .ata_meta a:hover,
	.ata_grid_style .ata_caption  {
		<?php echo $color['quaternary_color'] != "" ? 'color:'.$color['quaternary_color'] .'!important;': '';?>
	}
	<?php endif;?>  
    </style>
    <?php
	}
	
	function fonts_loader(){
			$options = get_option('ata_news_typography');
			$enqueue_fonts  = array();
			
			
			if( isset( $options['primary_heading'] ) && $options['primary_heading']['font']  != 'default') :
				$enqueue_fonts[] = $options['primary_heading']['font'];
			endif;
			
			if( isset( $options['secondary_heading'] ) && $options['secondary_heading']['font']  != 'default') :
				$enqueue_fonts[] = $options['secondary_heading']['font'];
			endif;
			
			if( isset( $options['quaternary_heading'] ) && $options['quaternary_heading']['font']  != 'default') :
				$enqueue_fonts[] = $options['quaternary_heading']['font'];
			endif;
			
			if( isset( $options['content_font'] ) && $options['content_font']['font']  != 'default') :
				$enqueue_fonts[] = $options['content_font']['font'];
			endif;
			
			if( isset( $options['meta_font'] ) && $options['meta_font']['font']  != 'default') :
				$enqueue_fonts[] = $options['meta_font']['font'];
			endif;
			
			
			if ( ! empty( $enqueue_fonts ) ) :
				wp_enqueue_style( 'ata-google-fonts', esc_url( add_query_arg( 'family', urlencode( implode( '|', $enqueue_fonts ) ) , '//fonts.googleapis.com/css' ) ), array(), null );
			endif;
	}
	
}

endif;
new aThemeArt_News_Settings_API_Render();