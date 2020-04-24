<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_Mail_Chimp extends Widget_Base {

    public function get_name() {
        return 'htmagazine-mailchimp-wp';
    }
    
    public function get_title() {
        return __( 'Mailchimp for wp', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-mailchimp';
    }
    public function get_categories() {
        return [ 'ht-magazine' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'mailchimp_content',
            [
                'label' => __( 'Mailchimp', 'ht-magazine' ),
            ]
        );
        
            $this->add_control(
                'mailchimp_id',
                [
                    'label'       => __( 'Mailchimp ID', 'ht-magazine' ),
                    'type'        => Controls_Manager::TEXT,
                    'placeholder' => __( '193', 'ht-magazine' ),
                    'description' => __( 'For show ID <a href="admin.php?page=mailchimp-for-wp-forms" target="_blank"> Click here </a>', 'ht-magazine' ),
                    'label_block' => true,
                    'separator'   => 'before',
                ]
            );

            $this->add_control(
                'mailchimp_title',
                [
                    'label' => __( 'Title', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Type your title here', 'ht-magazine' ),
                ]
            );

            $this->add_control(
                'mailchimp_sub_title',
                [
                    'label' => __( 'Sub Title', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Type your sub title here', 'ht-magazine' ),
                ]
            );

        $this->end_controls_section();

        // Style tab section
        $this->start_controls_section(
            'mailchimp_section_style',
            [
                'label' => __( 'Style', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
            
            $this->add_responsive_control(
                'mailchimp_section_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .sidebar-subscribe' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'mailchimp_section_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .sidebar-subscribe' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_group_control(
                Group_Control_Background::get_type(),
                [
                    'name' => 'mailchimp_section_background',
                    'label' => __( 'Background', 'ht-magazine' ),
                    'types' => [ 'classic', 'gradient' ],
                    'selector' => '{{WRAPPER}} .sidebar-subscribe',
                ]
            );

            $this->add_responsive_control(
                'mailchimp_section_align',
                [
                    'label' => __( 'Alignment', 'ht-magazine' ),
                    'type' => Controls_Manager::CHOOSE,
                    'options' => [
                        'left' => [
                            'title' => __( 'Left', 'ht-magazine' ),
                            'icon' => 'fa fa-align-left',
                        ],
                        'center' => [
                            'title' => __( 'Center', 'ht-magazine' ),
                            'icon' => 'fa fa-align-center',
                        ],
                        'right' => [
                            'title' => __( 'Right', 'ht-magazine' ),
                            'icon' => 'fa fa-align-right',
                        ],
                        'justify' => [
                            'title' => __( 'Justified', 'ht-magazine' ),
                            'icon' => 'fa fa-align-justify',
                        ],
                    ],
                    'selectors' => [
                        '{{WRAPPER}} .sidebar-subscribe' => 'text-align: {{VALUE}};',
                    ],
                    'default' => 'center',
                    'separator' =>'before',
                ]
            );

        $this->end_controls_section();

        // Style tab section
        $this->start_controls_section(
            'mailchimp_title_style',
            [
                'label' => __( 'Title', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'mailchimp_title!' =>'',
                ]
            ]
        );
            
            $this->add_control(
                'title_color',
                [
                    'label' => __( 'Title Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#444444',
                    'selectors' => [
                        '{{WRAPPER}} .sidebar-subscribe h4' => 'color: {{VALUE}}',
                    ],
                ]
            );
            
            $this->add_control(
                'sub_title_color',
                [
                    'label' => __( 'Sub Title Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#666666',
                    'selectors' => [
                        '{{WRAPPER}} .sidebar-subscribe p' => 'color: {{VALUE}}',
                    ],
                ]
            );

        $this->end_controls_section();

        // Input Box style tab start
        $this->start_controls_section(
            'mailchimp_input_style',
            [
                'label'     => __( 'Input Box', 'ht-magazine' ),
                'tab'       => Controls_Manager::TAB_STYLE,
            ]
        );

            $this->add_control(
                'input_box_height',
                [
                    'label' => __( 'Height', 'ht-magazine' ),
                    'type'  => Controls_Manager::SLIDER,
                    'range' => [
                        'px' => [
                            'max' => 150,
                        ],
                    ],
                    'default' => [
                        'size' => 40,
                    ],
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]'  => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]' => 'height: {{SIZE}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'input_box_typography',
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .mc4wp-form input[type*="email"]',
                ]
            );

            $this->add_control(
                'input_box_background',
                [
                    'label'     => __( 'Background Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]'         => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]'        => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form select[name*="_mc4wp_lists"]' => 'background-color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_control(
                'input_box_text_color',
                [
                    'label'     => __( 'Text Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]' => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_control(
                'input_box_placeholder_color',
                [
                    'label'     => __( 'Placeholder Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]::-webkit-input-placeholder'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]::-moz-placeholder'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]:-ms-input-placeholder'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]::-webkit-input-placeholder' => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]::-moz-placeholder' => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]:-ms-input-placeholder' => 'color: {{VALUE}};',
                        '{{WRAPPER}} .mc4wp-form select[name*="_mc4wp_lists"]'      => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Border::get_type(),
                [
                    'name' => 'input_box_border',
                    'label' => __( 'Border', 'ht-magazine' ),
                    'selector' => '{{WRAPPER}} .mc4wp-form input[type*="email"]',
                ]
            );

            $this->add_responsive_control(
                'input_box_border_radius',
                [
                    'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'input_box_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'input_box_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .mc4wp-form input[type*="text"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .mc4wp-form input[type*="email"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );
           
        $this->end_controls_section(); // Input box style tab end

        // Input submit button style tab start
        $this->start_controls_section(
            'mailchimp_inputsubmit_style',
            [
                'label'     => __( 'Button', 'ht-magazine' ),
                'tab'       => Controls_Manager::TAB_STYLE,
            ]
        );
            
            $this->start_controls_tabs('htmega_submit_style_tabs');

                // Button Normal tab start
                $this->start_controls_tab(
                    'htmega_submit_style_normal_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'input_submit_height',
                        [
                            'label' => __( 'Height', 'ht-magazine' ),
                            'type'  => Controls_Manager::SLIDER,
                            'range' => [
                                'px' => [
                                    'max' => 150,
                                ],
                            ],
                            'default' => [
                                'size' => 40,
                            ],
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]' => 'height: {{SIZE}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'input_submit_typography',
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .mc4wp-form input[type*="submit"]',
                        ]
                    );

                    $this->add_control(
                        'htmega_input_submit_text_color',
                        [
                            'label'     => __( 'Text Color', 'ht-magazine' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]'  => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'input_submit_background_color',
                        [
                            'label'     => __( 'Background Color', 'ht-magazine' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]'  => 'background-color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_responsive_control(
                        'input_submit_padding',
                        [
                            'label' => __( 'Padding', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                    $this->add_responsive_control(
                        'input_submit_margin',
                        [
                            'label' => __( 'Margin', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'input_submit_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .mc4wp-form input[type*="submit"]',
                        ]
                    );

                    $this->add_responsive_control(
                        'input_submit_border_radius',
                        [
                            'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                            'separator' =>'before',
                        ]
                    );

                $this->end_controls_tab(); // Button Normal tab end

                // Button Hover tab start
                $this->start_controls_tab(
                    'submit_style_hover_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'input_submithover_text_color',
                        [
                            'label'     => __( 'Text Color', 'ht-magazine' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]:hover'  => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'input_submithover_background_color',
                        [
                            'label'     => __( 'Background Color', 'ht-magazine' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .mc4wp-form input[type*="submit"]:hover'  => 'background-color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'input_submithover_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .mc4wp-form input[type*="submit"]:hover',
                        ]
                    );

                $this->end_controls_tab(); // Button Hover tab end

            $this->end_controls_tabs();

        $this->end_controls_section(); // Input submit button style tab end

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $this->add_render_attribute( 'mailchimp_area_attr', 'class', 'single-sidebar' );
       
        ?>
            <div <?php echo $this->get_render_attribute_string( 'mailchimp_area_attr' ); ?> >
                <div class="sidebar-subscribe">
                    <?php 
                        if( !empty( $settings['mailchimp_title'] ) ){
                            echo '<h4>'.$settings['mailchimp_title'].'</h4>';
                        }
                        if( !empty( $settings['mailchimp_sub_title'] ) ){
                            echo '<p>'.$settings['mailchimp_sub_title'].'</p>';
                        }
                        echo do_shortcode( '[mc4wp_form  id="'.$settings['mailchimp_id'].'"]' ); 
                    ?>
                </div>
            </div>
        <?php
    }

}