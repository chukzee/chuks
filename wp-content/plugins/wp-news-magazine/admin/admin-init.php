<?php

if( ! defined( 'ABSPATH' ) ) exit(); // Exit if accessed directly

class HTMagazine_Admin_Setting{

    public function __construct(){
        add_action('admin_enqueue_scripts', array( $this, 'htmagazine_enqueue_admin_scripts' ) );
        $this->htmagazine_admin_settings_page();
    }

    /*
    *  Setting Page
    */
    public function htmagazine_admin_settings_page() {
        require_once( 'include/class.settings-api.php' );
        require_once( 'include/admin-setting.php' );
        require_once( 'include/admin_notice.php' );
    }

    /*
    *  Enqueue admin scripts
    */
    public function htmagazine_enqueue_admin_scripts(){
        wp_enqueue_style( 'htnews-admin', HTMAGAZINE_PL_URL . 'admin/assets/css/admin_optionspanel.css', FALSE, HTMAGAZINE_VERSION );
    }

}

new HTMagazine_Admin_Setting();