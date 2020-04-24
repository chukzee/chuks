<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_Adds_Banner extends Widget_Base {

    public function get_name() {
        return 'htmagazine-addbanner';
    }
    
    public function get_title() {
        return __( 'Adds Banner', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-image';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'add_banner_content',
            [
                'label' => __( 'Banner', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'banner_image',
                [
                    'label' => __( 'Image', 'ht-magazine' ),
                    'type' => Controls_Manager::MEDIA,
                    'default' => [
                        'url' => Utils::get_placeholder_image_src(),
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Image_Size::get_type(),
                [
                    'name' => 'banner_image_size',
                    'default' => 'large',
                    'separator' => 'none',
                ]
            );

            $this->add_control(
                'banner_link',
                [
                    'label' => __( 'Banner Link', 'ht-magazine' ),
                    'type' => Controls_Manager::URL,
                    'placeholder' => __( 'https://your-link.com', 'ht-magazine' ),
                    'show_external' => true,
                    'default' => [
                        'url' => '#',
                        'is_external' => false,
                        'nofollow' => false,
                    ],
                ]
            );
            
        $this->end_controls_section();


    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $this->add_render_attribute( 'adds_banner', 'class', 'htmagazine-banner' );

        // URL Generate
        $this->add_render_attribute( 'url', 'class', 'sidebar-banner' );

        if ( ! empty( $settings['banner_link']['url'] ) ) {
            
            $this->add_render_attribute( 'url', 'href', $settings['banner_link']['url'] );
            if ( $settings['banner_link']['is_external'] ) {
                $this->add_render_attribute( 'url', 'target', '_blank' );
            }

            if ( ! empty( $settings['banner_link']['nofollow'] ) ) {
                $this->add_render_attribute( 'url', 'rel', 'nofollow' );
            }
        }

        ?>
            <div <?php echo $this->get_render_attribute_string( 'adds_banner' ); ?>>
                <div class="single-sidebar">
                    <a <?php echo $this->get_render_attribute_string( 'url' ); ?>>
                        <?php
                            echo Group_Control_Image_Size::get_attachment_image_html( $settings, 'banner_image_size', 'banner_image' );
                        ?>
                    </a>
                </div>
            </div>

        <?php

    }

}