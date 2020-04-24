<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_GoogleMap extends Widget_Base {

    public function get_name() {
        return 'htmagazine-googlemap';
    }
    
    public function get_title() {
        return __( 'Google Map', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-google-maps';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    public function get_script_depends() {
        return [
            'google-map-api',
        ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'googlemap_content',
            [
                'label' => __( 'GoogleMap', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'section_title',
                [
                    'label' => __( 'Section Title', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Enter Section Title', 'ht-magazine' ),
                ]
            );

            $this->add_control(
                'map_latitude_longitude',
                [
                    'label' => __( 'Google Maps Latitude & Longitude', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'description'   => esc_html__('Google Maps Latitude & Longitude, e.g. 40.6700, -73.9400', 'ht-magazine'),
                    'default' => '40.6700, -73.9400',
                ]
            );

            $this->add_control(
                'map_height',
                [
                    'label' => __( 'Map Height (px)', 'ht-magazine' ),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 5,
                    'max' => 1000,
                    'step' => 1,
                    'default' => 350,
                ]
            );

            $this->add_control(
                'disable_mouse_scroll',
                [
                    'label' => __( 'Disable Wheel Zoom', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'label_on' => __( 'Yes', 'ht-magazine' ),
                    'label_off' => __( 'No', 'ht-magazine' ),
                    'return_value' => 'yes',
                    'default' => 'yes',
                ]
            );

            $this->add_control(
                'map_marker',
                [
                    'label' => __( 'Map Marker', 'ht-magazine' ),
                    'type' => Controls_Manager::MEDIA,
                    'default' => [
                        'url' => Utils::get_placeholder_image_src(),
                    ],
                ]
            );

            $this->add_control(
                'map_style',
                [
                    'label' => __( 'Map Style', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXTAREA,
                    'rows' => 10,
                    'default' => base64_encode('[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]'),
                    'description'  => __( 'Go to <a href="https://snazzymaps.com/" target=_blank>Snazzy Maps</a> and Choose/Customize your Map Style. Click on your demo and copy JavaScript Style Array', 'ht-magazine' )
                ]
            );

        $this->end_controls_section();

        
        // Style Description tab section
        $this->start_controls_section(
            'default_style_section',
            [
                'label' => __( 'Style tab name', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->end_controls_section();

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();
        $id = $this->get_id();

        $this->add_render_attribute( 'htmagazine_map', 'class', 'post-block-wrapper' );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'htmagazine_map' ); ?>>

                <?php if( !empty( $settings['section_title'] ) ){ echo '<div class="head"><h4 class="title">'.esc_attr( $settings['section_title'] ).'</h4></div>';} ?>
                <div class="body">
                    <div id="contacts" class="contact-map-wrap">
                        <div id="googleMap-<?php echo esc_attr( $id ); ?>" style="width:100%;height:<?php echo esc_attr( $settings['map_height'] ); ?>px;"></div>
                    </div>
                </div>
                <!-- Google Map End -->

            </div>

            <script>
                jQuery(document).ready(function($) {

                    $disable_mouse_scroll = <?php echo esc_js( $settings['disable_mouse_scroll'] ) == 'yes' ? 'true': 'false'; ?>;
                    function init() {
                        var mapOptions = {
                            zoom: 11,
                            scrollwheel: $disable_mouse_scroll,
                            center: new google.maps.LatLng(<?php echo esc_js( $settings['map_latitude_longitude'] ); ?>),
                            styles: '<?php echo $settings['map_style']; ?>'
                        };
                        var mapElement = document.getElementById('googleMap-<?php echo esc_js( $id); ?>');
                        var map = new google.maps.Map(mapElement, mapOptions);
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(<?php echo esc_js( $settings['map_latitude_longitude'] ); ?>),
                            map: map,
                            icon: '<?php echo esc_js( $settings['map_marker']['url'] ); ?>',
                            title: '<?php echo esc_js( $settings['section_title'] ); ?>',
                        });
                    }
                    google.maps.event.addDomListener(window, 'load', init);

                });

            </script>

        <?php

    }

}