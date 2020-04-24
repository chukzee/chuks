<?php
/*
Plugin Name: News, Magazine and Blog Elements
Plugin URI: https://athemeart.com/downloads/newspaper-blog-magazine-wordpress-plugins/
Description: News, Magazine and Blog Elements will dramatically revolutionize how you use and display your posts and improve the way your visitors interact with your content on news, magazine websites and blogs or just about any project you are working on that uses posts to generate and present content.  
Version: 1.3
Author: aThemeArt 
Author URI: https://athemeart.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
$my_theme = wp_get_theme();

if ( $my_theme->get( 'Name' ) != 'Newsbd24 PRO'   ) :
defined( 'ATA_VAR_PATH' )   		or  define( 'ATA_VAR_PATH',    plugin_dir_path( __FILE__ ) );
defined( 'ATA_VAR_URL' )   		or  define( 'ATA_VAR_URL',    plugin_dir_url( __FILE__ ) );
defined( 'ATA_PREFIX' )    		or  define( 'ATA_PREFIX','athemeart_prefix');
defined( 'ATA_VAR_SETTINGS' ) 	or  define( 'ATA_VAR_SETTINGS','ATA_VAR_SETTINGS');
defined( 'ATA_VAR_FILE' )   		or  define( 'ATA_VAR_FILE', plugin_basename( __FILE__ ) );




if( $my_theme->get( 'Name' ) == 'newsbd24' ){
defined( 'ATA_PRO' )   		or  define( 'ATA_PRO', apply_filters('ata_plugins_pro', esc_url( 'https://athemeart.com/downloads/newsbd24/' )) );
}else{
defined( 'ATA_PRO' )   		or  define( 'ATA_PRO', apply_filters('ata_plugins_pro', esc_url( 'https://athemeart.com/downloads/newspaper-blog-magazine-wordpress-plugins/' )) );	
}

 
load_plugin_textdomain( 'ATA_NEWS_LANG', false, plugin_dir_path(__FILE__) . 'languages/' ); 

if( !class_exists('aThemeArt_News_Elements_Main_Class') ){
	class aThemeArt_News_Elements_Main_Class {
		/**
		 * @var striang
		 */
		protected $version;
		/**
		 * @var striang
		 */
		protected $path;
		/**
		 * @var striang
		 */
		protected $url;
		/**
		 * @var striang
		 */
		protected $post_type;
		/**
		 * @var striang
		 */
		protected $prefix;
	
		/**
		 * @var array
		 */
		protected $meta_settings;
		
		/**
		 * Initialize all controllers, by loading Plugin and User Options.
		 */
		public function __construct() {
			$this->version = '1.0';
			$this->path = ATA_VAR_PATH;
			$this->url = ATA_VAR_URL;
			$this->prefix = ATA_PREFIX;
			$this->settings = ATA_VAR_SETTINGS;
			$this->file = ATA_VAR_FILE;
		
			$this->load_dependencies();
			//$this->define_admin_hooks();
			
			
		}
		/**
		 * dependencies class all .
		 */
		private function load_dependencies() {
			require_once $this->path. 'vendors/widgets-helper/class-widget-helper.php';
			require_once $this->path. 'inc/helper.php';
			require_once $this->path . 'inc/functions.php';
			require_once $this->path . 'inc/enqueue.php';
			require_once $this->path . 'inc/widgets.php';
			require_once $this->path . 'inc/shortcode.php';
			require_once $this->path . '/vendors/ata-shortcodes/athemeart-shortcodes.php';
			require_once $this->path . '/settings/class.settings-api.php';
			require_once apply_filters('ata_news_settings_options',$this->path . '/settings/settings.php');
			require_once $this->path . '/inc/notice/notice.php';
		}
		
	}
	new aThemeArt_News_Elements_Main_Class();
}

endif;


