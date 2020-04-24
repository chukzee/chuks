<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_ContactForm extends Widget_Base {

    public function get_name() {
        return 'htmagazine-contactform';
    }
    
    public function get_title() {
        return __( 'Contact Form', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-mail';
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

            $this->add_control(
                'contact_form_id',
                [
                    'label' => __( 'Contact Form', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'options' => htmagazine_contact_form_seven(),
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

        // Input Field style tab start
        $this->start_controls_section(
            'contactform_input_style',
            [
                'label'     => __( 'Input', 'ht-magazine' ),
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
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"]'   => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"]'  => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"]'    => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"]' => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"]'    => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"]'   => 'height: {{SIZE}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select'         => 'height: {{SIZE}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_control(
                'input_box_background',
                [
                    'label'     => __( 'Background Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"]'   => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"]'  => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"]'    => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"]' => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"]'    => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"]'   => 'background-color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select'         => 'background-color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'input_box_typography',
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select',
                ]
            );

            $this->add_control(
                'input_box_text_color',
                [
                    'label'     => __( 'Text Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"]'   => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"]'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"]'    => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"]' => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"]'    => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"]'   => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select'         => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Border::get_type(),
                [
                    'name' => 'input_box_border',
                    'label' => __( 'Border', 'ht-magazine' ),
                    'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"], {{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select',
                ]
            );

            $this->add_responsive_control(
                'input_box_border_radius',
                [
                    'label' => __( 'Border Radius', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"]' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
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
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"]' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="text"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="email"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="url"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="number"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="tel"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap input[type*="date"]' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap .wpcf7-select' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

        $this->end_controls_section(); // Input Field style tab end

        // Textarea style tab start
        $this->start_controls_section(
            'contactform_textarea_style',
            [
                'label'     => __( 'Textarea', 'ht-magazine' ),
                'tab'       => Controls_Manager::TAB_STYLE,
            ]
        );
            $this->add_control(
                'textarea_box_height',
                [
                    'label' => __( 'Height', 'ht-magazine' ),
                    'type'  => Controls_Manager::SLIDER,
                    'range' => [
                        'px' => [
                            'max' => 500,
                        ],
                    ],
                    'default' => [
                        'size' => 100,
                    ],

                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea'   => 'height: {{SIZE}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_control(
                'textarea_box_background',
                [
                    'label'     => __( 'Background Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea'   => 'background-color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'textarea_box_typography',
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea',
                ]
            );

            $this->add_control(
                'textarea_box_text_color',
                [
                    'label'     => __( 'Text Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea'   => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_control(
                'textarea_box_placeholder_color',
                [
                    'label'     => __( 'Placeholder Color', 'ht-magazine' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea::-webkit-input-placeholder'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea::-moz-placeholder'  => 'color: {{VALUE}};',
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea:-ms-input-placeholder'  => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Border::get_type(),
                [
                    'name' => 'textarea_box_border',
                    'label' => __( 'Border', 'ht-magazine' ),
                    'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea',
                ]
            );

            $this->add_responsive_control(
                'textarea_box_border_radius',
                [
                    'label' => __( 'Border Radius', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'textarea_box_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'textarea_box_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .wpcf7-form .wpcf7-form-control-wrap textarea' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

        $this->end_controls_section(); // Textarea style tab end

        // Label style tab start
        $this->start_controls_section(
            'contactform_label_style',
            [
                'label'     => __( 'Label', 'htmega-addons' ),
                'tab'       => Controls_Manager::TAB_STYLE,
            ]
        );

            $this->add_control(
                'label_background',
                [
                    'label'     => __( 'Background Color', 'htmega-addons' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} form.wpcf7-form label'   => 'background-color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_control(
                'label_text_color',
                [
                    'label'     => __( 'Text Color', 'htmega-addons' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [
                        '{{WRAPPER}} form.wpcf7-form label'   => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'label_typography',
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} form.wpcf7-form label',
                ]
            );

            $this->add_group_control(
                Group_Control_Border::get_type(),
                [
                    'name' => 'label_border',
                    'label' => __( 'Border', 'htmega-addons' ),
                    'selector' => '{{WRAPPER}} form.wpcf7-form label',
                ]
            );

            $this->add_responsive_control(
                'label_border_radius',
                [
                    'label' => __( 'Border Radius', 'htmega-addons' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'selectors' => [
                        '{{WRAPPER}} form.wpcf7-form label' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'label_padding',
                [
                    'label' => __( 'Padding', 'htmega-addons' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} form.wpcf7-form label' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'label_margin',
                [
                    'label' => __( 'Margin', 'htmega-addons' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} form.wpcf7-form label' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

        $this->end_controls_section(); // // Label style tab end

        // Input submit button style tab start
        $this->start_controls_section(
            'contactform_inputsubmit_style',
            [
                'label'     => __( 'Button', 'htmega-addons' ),
                'tab'       => Controls_Manager::TAB_STYLE,
            ]
        );
            $this->start_controls_tabs('submit_style_tabs');

                // Button Normal tab start
                $this->start_controls_tab(
                    'submit_style_normal_tab',
                    [
                        'label' => __( 'Normal', 'htmega-addons' ),
                    ]
                );

                    $this->add_control(
                        'input_submit_height',
                        [
                            'label' => __( 'Height', 'htmega-addons' ),
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
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit' => 'height: {{SIZE}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'input_submit_typography',
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-submit',
                        ]
                    );

                    $this->add_control(
                        'input_submit_text_color',
                        [
                            'label'     => __( 'Text Color', 'htmega-addons' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit'  => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'input_submit_background_color',
                        [
                            'label'     => __( 'Background Color', 'htmega-addons' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit'  => 'background-color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_responsive_control(
                        'input_submit_padding',
                        [
                            'label' => __( 'Padding', 'htmega-addons' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                    $this->add_responsive_control(
                        'input_submit_margin',
                        [
                            'label' => __( 'Margin', 'htmega-addons' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'input_submit_border',
                            'label' => __( 'Border', 'htmega-addons' ),
                            'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-submit',
                        ]
                    );

                    $this->add_responsive_control(
                        'input_submit_border_radius',
                        [
                            'label' => __( 'Border Radius', 'htmega-addons' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                            'separator' =>'before',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Box_Shadow::get_type(),
                        [
                            'name' => 'input_submit_box_shadow',
                            'label' => __( 'Box Shadow', 'htmega-addons' ),
                            'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-submit',
                        ]
                    );

                $this->end_controls_tab(); // Button Normal tab end

                // Button Hover tab start
                $this->start_controls_tab(
                    'submit_style_hover_tab',
                    [
                        'label' => __( 'Hover', 'htmega-addons' ),
                    ]
                );

                    $this->add_control(
                        'input_submithover_text_color',
                        [
                            'label'     => __( 'Text Color', 'htmega-addons' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit:hover'  => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'input_submithover_background_color',
                        [
                            'label'     => __( 'Background Color', 'htmega-addons' ),
                            'type'      => Controls_Manager::COLOR,
                            'selectors' => [
                                '{{WRAPPER}} .wpcf7-form .wpcf7-submit:hover'  => 'background-color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'input_submithover_border',
                            'label' => __( 'Border', 'htmega-addons' ),
                            'selector' => '{{WRAPPER}} .wpcf7-form .wpcf7-submit:hover',
                        ]
                    );

                $this->end_controls_tab(); // Button Hover tab end

            $this->end_controls_tabs();

        $this->end_controls_section(); // Input submit button style tab end

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $this->add_render_attribute( 'contactinfo_attr', 'class', 'post-block-wrapper' );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'contactinfo_attr' ); ?>>

                <?php if( !empty( $settings['section_title'] ) ){ echo '<div class="head"><h4 class="title">'.esc_attr( $settings['section_title']).'</h4></div>'; } ?>

                <?php
                    if( !empty($settings['contact_form_id']) ){
                        echo do_shortcode( '[contact-form-7  id="'.$settings['contact_form_id'].'"]' ); 
                    }else{
                        echo '<div class="form_no_select">' .__('Please Select contact form.','ht-magazine'). '</div>';
                    }
                ?>

            </div>

        <?php

    }

}