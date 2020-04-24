<?php
/*
Plugin Name: Users Ultra Lite - Core Plugin
Plugin URI: http://usersultra.com
Description: This is a powerful user profiles plugin for WordPress.
Version: 1.5.98
Author: Users Ultra
Author URI: https://usersultra.com
*/

include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

if ( !is_plugin_active( 'users-ultra-pro/xoousers.php' ) ) {

define('xoousers_lite_url',plugin_dir_url(__FILE__ ));
define('xoousers_lite_path',plugin_dir_path(__FILE__ ));
define('xoousers_lite_template','basic');
define('MY_PLUGIN_SETTINGS_URL',"?page=userultra&tab=pro");

// Get plugin version from header
function xoousersultra_get_plugin_version_lite()
{
    $default_headers = array( 'Version' => 'Version' );
    $plugin_data = get_file_data( __FILE__, $default_headers, 'plugin' );
    return $plugin_data['Version'];
}


$plugin = plugin_basename(__FILE__);

/* Loading Function */
require_once (xoousers_lite_path . 'functions/functions.php');

/* Init */
define('uultraxoousers_pro_url','https://usersultra.com/');
/* Load plugin text domain (localization) */

function xoousers_load_textdomain_lite() 
{
       $locale = apply_filters( 'plugin_locale', get_locale(), 'users-ultra' );	   
       $mofile = xoousers_lite_path . "languages/xoousers-$locale.mo";
			
		// Global + Frontend Locale
		load_textdomain( 'xoousers', $mofile );
		load_plugin_textdomain( 'xoousers', false, dirname(plugin_basename(__FILE__)).'/languages/' );
}

}
	



if ( !is_plugin_active( 'users-ultra-pro/xoousers.php' ) ) {
	
	add_action('init', 'xoousers_load_textdomain_lite');

	/* Master Class  */
	require_once (xoousers_lite_path . 'xooclasses/xoo.userultra.class.php');
	
	$xoouserultra = new XooUserUltraLite();
	$xoouserultra->plugin_init();

	
	/* load addons */
	require_once xoousers_lite_path . 'addons/photocategories/index.php';
	require_once xoousers_lite_path . 'addons/maintenance/index.php';
	
	register_activation_hook(__FILE__, 'uultra_my_plugin_activate_lite');
	add_action('admin_init', 'uultra_my_plugin_redirect_lite');
	
	function uultra_my_plugin_activate_lite() 
	{
		add_option('uultra_plugin_do_activation_redirect', true);
	}
	
	function uultra_my_plugin_redirect_lite() 
	{
		if (get_option('uultra_plugin_do_activation_redirect', false)) {
			delete_option('uultra_plugin_do_activation_redirect');
			wp_redirect(MY_PLUGIN_SETTINGS_URL);
		}
	}

}

