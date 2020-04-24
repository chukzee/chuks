<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_ContactInfo extends Widget_Base {

    public function get_name() {
        return 'htmagazine-contactinfo';
    }
    
    public function get_title() {
        return __( 'Contact Info', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-price-list';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'contactinfo_content',
            [
                'label' => __( 'Contact Info', 'ht-magazine' ),
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

            $repeater = new Repeater();

            $repeater->add_control(
                'contact_info_icon',
                [
                    'label'   => __( 'Icon', 'ht-magazine' ),
                    'type'    => Controls_Manager::ICON,
                    'default' => __( 'fa fa-home', 'ht-magazine' ),
                ]
            );

            $repeater->add_control(
                'contact_info',
                [
                    'label' => __( 'Contact Info', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXTAREA,
                    'rows' => 10,
                ]
            );

            $this->add_control(
                'contact_info_list',
                [
                    'type'    => Controls_Manager::REPEATER,
                    'fields'  => array_values( $repeater->get_controls() ),
                    'default' => [

                        [
                            'contact_info_icon' => __( 'fa fa-home', 'ht-magazine' ),
                            'contact_info' => __( 'House No 08, Road No 08 Din Bari, Dhaka, Bangladesh', 'ht-magazine' ),
                        ],

                    ],
                    'title_field' => '{{{ contact_info }}}',
                ]
            );

        $this->end_controls_section();

        
        // Tab Section Title Style
        $this->start_controls_section(
            'section_title_style_section',
            [
                'label' => __( 'Section Title', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'section_title!'=>'',
                ]
            ]
        );
            
            $this->add_control(
                'section_title_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#00c8fa',
                    'selectors' => [
                        '{{WRAPPER}} .post-block-wrapper .head .title' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'section_title_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post-block-wrapper .head .title',
                ]
            );

            $this->add_responsive_control(
                'section_title_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-block-wrapper .head .title' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_responsive_control(
                'section_title_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-block-wrapper .head .title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_control(
                'section_title_before_after_color',
                [
                    'label' => __( 'Title Before/After Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#00c8fa',
                    'selectors' => [
                        '{{WRAPPER}} .post-block-wrapper .head::before' => 'background-color: {{VALUE}}',
                        '{{WRAPPER}} .post-block-wrapper .head::after' => 'background-color: {{VALUE}}',
                    ],
                ]
            );

        $this->end_controls_section();

        // Tab Contact info icon Style
        $this->start_controls_section(
            'contact_info_icon_style',
            [
                'label' => __( 'Icon', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

            $this->add_control(
                'contact_info_icon_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#00c8fa',
                    'selectors' => [
                        '{{WRAPPER}} .single-contact i' => 'color: {{VALUE}}',
                    ],
                ]
            );

        $this->end_controls_section();

        // Tab Contact info Style
        $this->start_controls_section(
            'contact_info_style',
            [
                'label' => __( 'Contact Info', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

            $this->add_control(
                'contact_info_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#666666',
                    'selectors' => [
                        '{{WRAPPER}} .single-contact p' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'contact_info_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .single-contact p',
                ]
            );

        $this->end_controls_section();

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $this->add_render_attribute( 'contactinfo_attr', 'class', 'post-block-wrapper' );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'contactinfo_attr' ); ?>>

                <?php if( !empty( $settings['section_title'] ) ){ echo '<div class="head"><h4 class="title">'.esc_attr( $settings['section_title']).'</h4></div>'; } ?>

                <?php if( isset( $settings['contact_info_list'] ) ): ?>
                    <div class="body">
                        <div class="contact-info row">
                            <?php foreach( $settings['contact_info_list'] as $contactlist ): ?>
                                <div class="single-contact text-center col-md-4">
                                    <i class="<?php echo esc_attr( $contactlist['contact_info_icon'] );?>"></i>
                                    <p><?php echo $contactlist['contact_info']; ?></p>
                                </div>
                            <?php endforeach;?>
                        </div>
                    </div>
                <?php endif;?>

            </div>

        <?php

    }

}