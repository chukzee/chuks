<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_Youtube_Player extends Widget_Base {

    public function get_name() {
        return 'htmagazine-youtubeplayer';
    }
    
    public function get_title() {
        return __( 'Youtube Player', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-play';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'player_content',
            [
                'label' => __( 'YouTube Player', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'youtube_api',
                [
                    'label' => __( 'YouTube Api Key', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'default' => __( 'AIzaSyAsvJPKTArFviBbDntKU4sHxkl8fYrj1uM', 'ht-magazine' ),
                    'label_block'=>true,
                    'placeholder' => __( 'Enter YouTube Api Key.', 'ht-magazine' ),
                    'description'   => __( 'Go to <a href="https://developers.google.com/youtube/v3/getting-started/" target=_blank>You Tube Api Key</a> Create Your Api Key and Enter.', 'ht-magazine' ),
                ]
            );

            $this->add_control(
                'youtubeplaylist_id',
                [
                    'label' => __( 'YouTube Playlist Id', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'label_block'=>true,
                    'default' => __( 'PLsmqeqKj7M-rx1GmqYA4THAa7oWj00DNU', 'ht-magazine' ),
                    'placeholder' => __( 'Enter Your api key id.', 'ht-magazine' ),
                    'separator' => 'before',
                ]
            );
            
        $this->end_controls_section();

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $this->add_render_attribute( 'player_area_attr', 'class', 'htmega-youtube' );

        $apikey_settings = [
            'youtubeapi' => $settings['youtube_api'],
        ];
        $this->add_render_attribute( 'player_area_attr', 'data-settings', wp_json_encode( $apikey_settings ) );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'player_area_attr' ); ?>>

                <div class="RYPP r16-9" data-playlist="<?php echo $settings['youtubeplaylist_id']; ?>">
                    <div class="RYPP-video">
                        <div class="RYPP-video-player"></div>
                    </div>
                    <div class="RYPP-playlist">
                        <div class="RYPP-items customScroll"></div>
                    </div>
                </div>

            </div>

        <?php

    }

}