<?php
/**
 * All enqueue script & Style
 *
 *
 * @package news_magazine_and_blog_elements
 */
 // If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
 if( ! function_exists( 'ata_news_enqueue_script_n_style' ) ){
	/**
	 * Implement script & Style.
	 *
	 * @since 1.0.0
	 */
	function ata_news_enqueue_script_n_style(){
		/**
		* @Core
		*/
		wp_enqueue_script('jquery');
		
		/**
		* @vendor
		*/
		wp_enqueue_style( 'font-awesome', ATA_VAR_URL.'vendors/font-awesome-4.7.0/css/css/font-awesome.css');
		wp_enqueue_style( 'bootstrap', ATA_VAR_URL.'vendors/bootstrap/css/bootstrap.min.css');
		wp_enqueue_script('bootstrap', ATA_VAR_URL.'vendors/bootstrap/js/bootstrap.min.js',0,array('4'),true);
		
		// News Ticker
		wp_enqueue_script('jquery-advanced-news-ticker', ATA_VAR_URL.'vendors/jquery-advanced-news-ticker/js/jquery.newsTicker.min.js',0,array('1.0.11'),true);
		
		// OwlCarousel
		wp_enqueue_style( 'owl.carousel_2', ATA_VAR_URL.'vendors/owlCarousel/assets/owl.carousel.css');
		wp_enqueue_style( 'owl.theme.default_2', ATA_VAR_URL.'vendors/owlCarousel/assets/owl.theme.default.css');
		wp_enqueue_script('owl.carousel_2', ATA_VAR_URL.'vendors/owlCarousel/owl.carousel.js',0,array('2.2.1'),true);
		// masonry
		wp_enqueue_script('masonry', ATA_VAR_URL.'/vendors/masonry/masonry.js',0,0,true);
		wp_enqueue_script( 'jquery.imagesloaded',ATA_VAR_URL. '/vendors/masonry/imagesloaded.masonry.js' , 0,'4.1.3',true  );
		/**
		* @Loader
		*/
		wp_enqueue_style( 'news_magazine_and_blog_elements', ATA_VAR_URL.'assets/news_magazine_and_blog_elements.css');
		wp_enqueue_script('news_magazine_and_blog_elements', ATA_VAR_URL.'assets/news_magazine_and_blog_elements.js',0,0,true);
		
		//wp_enqueue_script('jquery.tickerNews', ATA_VAR_URL.'vendors/jquery.tickerNews/jquery.tickerNews.js',0,0,true);
	}
	
	add_action( 'wp_enqueue_scripts','ata_news_enqueue_script_n_style',99 );
}
