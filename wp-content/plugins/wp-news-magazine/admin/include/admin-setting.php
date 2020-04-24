<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

if ( ! function_exists('is_plugin_active')){ include_once( ABSPATH . 'wp-admin/includes/plugin.php' ); }

class HTMagazine_Admin_Settings {

    private $settings_api;

    function __construct() {
        $this->settings_api = new HTMagazine_Settings_API;

        add_action( 'admin_init', array( $this, 'admin_init' ) );
        add_action( 'admin_menu', array( $this, 'admin_menu' ), 220 );
    }

    function admin_init() {

        //set the settings
        $this->settings_api->set_sections( $this->htmagazine_admin_get_settings_sections() );
        $this->settings_api->set_fields( $this->htmagazine_admin_fields_settings() );

        //initialize settings
        $this->settings_api->admin_init();
    }

    // Plugins menu Register
    function admin_menu() {
        add_menu_page( 
            __( 'WP News', 'ht-magazine' ),
            __( 'WP News', 'ht-magazine' ),
            'manage_options',
            'htmagazine',
            array ( $this, 'plugin_page' ),
            HTMAGAZINE_PL_URL.'assests/images/menu-logo.png',
            100
        );
    }

    // Options page Section register
    function htmagazine_admin_get_settings_sections() {
        $sections = array(
            
            array(
                'id'    => 'htinstagram_general_tabs',
                'title' => esc_html__( 'General', 'ht-magazine' )
            ),

        );
        return $sections;
    }

    // Options page field register
    protected function htmagazine_admin_fields_settings() {

        $settings_fields = array(

            'htinstagram_general_tabs'=>array(

                array(
                    'name'  => 'google_map_api_key',
                    'label' => __( 'Google Map API', 'ht-magazine' ),
                    'placeholder' => __( 'Google Map API Key', 'ht-magazine' ),
                    'type' => 'text',
                    'sanitize_callback' => 'sanitize_text_field'
                ),

            ),

        );
        
        return array_merge( $settings_fields );
    }


    function plugin_page() {

        echo '<div class="wrap">';
            echo '<h2>'.esc_html__( 'WP News Settings','ht-magazine' ).'</h2>';
            $this->save_message();
            $this->settings_api->show_navigation();
            $this->settings_api->show_forms();
        echo '</div>';

    }

    function save_message() {
        if( isset($_GET['settings-updated']) ) { ?>
            <div class="updated notice is-dismissible"> 
                <p><strong><?php esc_html_e('Successfully Settings Saved.', 'ht-magazine') ?></strong></p>
            </div>
            <?php
        }
    }
    

}

new HTMagazine_Admin_Settings();