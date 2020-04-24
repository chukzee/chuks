<?php
/**
 * Plugin Name: WP News Magazine
 * Description: The WP News Magazine is a elementor addons And WordPress Widges.
 * Plugin URI:  https://htplugins.com/
 * Author:      HT Plugins
 * Author URI:  https://profiles.wordpress.org/htplugins/
 * Version:     1.0.2
 * License:     GPL2
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ht-magazine
 * Domain Path: /languages
*/

if( ! defined( 'ABSPATH' ) ) exit(); // Exit if accessed directly

define( 'HTMAGAZINE_VERSION', '1.0.2' );
define( 'HTMAGAZINE_PL_URL', plugins_url( '/', __FILE__ ) );
define( 'HTMAGAZINE_PL_PATH', plugin_dir_path( __FILE__ ) );

// Required File
require_once HTMAGAZINE_PL_PATH.'includes/helpers_function.php';
require_once HTMAGAZINE_PL_PATH.'admin/admin-init.php';
require_once HTMAGAZINE_PL_PATH.'includes/init.php';


// Add settings link on plugin page.
function htmagazine_pl_setting_links( $htmagazine_links ) {
    $htmagazine_settings_link = '<a href="admin.php?page=htmagazine">'.esc_html__( 'Settings', 'ht-magazine' ).'</a>'; 
    array_unshift( $htmagazine_links, $htmagazine_settings_link );   
    return $htmagazine_links; 
} 
$htmagazine_plugin_name = plugin_basename(__FILE__);

?>