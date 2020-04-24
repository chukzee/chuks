<?php

class aThemeArtShortcodes {

    function __construct()
    {
    	define( 'ATA_VERSION', '2.0' );

    	// Plugin folder path
    	if ( ! defined( 'ATA_PLUGIN_DIR' ) ) {
    		define( 'ATA_PLUGIN_DIR', ATA_VAR_PATH .'/vendors/ata-shortcodes/' );
    	}

    	// Plugin folder URL
    	if ( ! defined( 'ATA_PLUGIN_URL' ) ) {
    		define( 'ATA_PLUGIN_URL', ATA_VAR_URL .'/vendors/ata-shortcodes/' );
    	}

    	require_once( ATA_PLUGIN_DIR .'includes/shortcodes.php' );

        add_action( 'init', array(&$this, 'init') );
        add_action( 'admin_init', array(&$this, 'admin_init') );
	}

	/**
	 * Enqueue front end scripts and styles
	 *
	 * @return	void
	 */
	function init()
	{
		if( ! is_admin() )
		{
			wp_enqueue_style( 'zilla-shortcodes', ATA_PLUGIN_URL . 'assets/css/shortcodes.css' );
			wp_enqueue_script( 'zilla-shortcodes-lib', ATA_PLUGIN_URL . 'assets/js/zilla-shortcodes-lib.js', array('jquery', 'jquery-ui-accordion', 'jquery-ui-tabs') );
		}
	}

	/**
	 * Enqueue Scripts and Styles
	 *
	 * @return	void
	 */
	function admin_init()
	{
		include_once( ATA_PLUGIN_DIR . 'includes/class-tzsc-admin-insert.php' );

		// css
		wp_enqueue_style( 'zilla-popup', ATA_PLUGIN_URL . 'assets/css/admin.css', false, '1.0', 'all' );

		// js
		wp_enqueue_script( 'jquery-ui-sortable' );
		wp_localize_script( 'jquery', 'aThemeArtShortcodes', array('plugin_folder' => WP_PLUGIN_URL .'/zilla-shortcodes') );
	}
}
new aThemeArtShortcodes();

?>