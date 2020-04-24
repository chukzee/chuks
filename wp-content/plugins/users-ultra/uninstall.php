<?php
if( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) 
	exit();


define('xoousers_lite_url',plugin_dir_url(__FILE__ ));
define('xoousers_lite_path',plugin_dir_path(__FILE__ ));
define('xoousers_lite_template','basic');

$plugin = plugin_basename(__FILE__);

/* Loading Function */
require_once (xoousers_lite_path . 'functions/functions.php');

/* Init */
require_once (xoousers_lite_path . 'init/init.php');

/* Master Class  */
require_once (xoousers_lite_path . 'xooclasses/xoo.userultra.class.php');

// For Single site
if ( !is_multisite() ) 
{
	//	
	$xoouserultra = new XooUserUltraLite();	
	$xoouserultra->uultra_uninstall();
} 
// For Multisite
else 
{
    // For regular options.	
	
   
}
?>