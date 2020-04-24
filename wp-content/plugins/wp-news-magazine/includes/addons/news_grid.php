<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_Newsgrid extends Widget_Base {

    public function get_name() {
        return 'htmagazine-addon-newsgrid';
    }
    
    public function get_title() {
        return __( 'News Grid', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-posts-grid';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'post_grid_content',
            [
                'label' => __( 'Post Grid', 'ht-magazine' ),
            ]
        );
            $this->add_control(
                'post_grid_style',
                [
                    'label' => __( 'Layout', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => '2',
                    'options' => [
                        '1'   => __( 'Slider', 'ht-magazine' ),
                        '2'   => __( 'Layout Two', 'ht-magazine' ),
                        '3'   => __( 'Layout Three', 'ht-magazine' ),
                    ],
                ]
            );

            $this->add_control(
                'section_title',
                [
                    'label' => __( 'Section Title', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Type your title here', 'ht-magazine' ),
                    'condition'=>[
                        'post_grid_style'=>'3'
                    ]
                ]
            );
            

        $this->end_controls_section();

        // Content Option Start
        $this->start_controls_section(
            'post_content_option',
            [
                'label' => __( 'Post Option', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'grid_categories',
                [
                    'label' => esc_html__( 'Categories', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT2,
                    'label_block' => true,
                    'multiple' => true,
                    'options' => htmagazine_get_taxonomies(),
                ]
            );

            $this->add_control(
                'post_limit',
                [
                    'label' => __('Limit', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 1,
                    'separator'=>'before',
                ]
            );

            $this->add_control(
                'custom_order',
                [
                    'label' => esc_html__( 'Custom order', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'no',
                ]
            );

            $this->add_control(
                'postorder',
                [
                    'label' => esc_html__( 'Order', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => 'DESC',
                    'options' => [
                        'DESC'  => esc_html__('Descending','ht-magazine'),
                        'ASC'   => esc_html__('Ascending','ht-magazine'),
                    ],
                    'condition' => [
                        'custom_order!' => 'yes',
                    ]
                ]
            );

            $this->add_control(
                'orderby',
                [
                    'label' => esc_html__( 'Orderby', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => 'none',
                    'options' => [
                        'none'          => esc_html__('None','ht-magazine'),
                        'ID'            => esc_html__('ID','ht-magazine'),
                        'date'          => esc_html__('Date','ht-magazine'),
                        'name'          => esc_html__('Name','ht-magazine'),
                        'title'         => esc_html__('Title','ht-magazine'),
                        'comment_count' => esc_html__('Comment count','ht-magazine'),
                        'rand'          => esc_html__('Random','ht-magazine'),
                    ],
                    'condition' => [
                        'custom_order' => 'yes',
                    ]
                ]
            );

            $this->add_control(
                'show_title',
                [
                    'label' => esc_html__( 'Title', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
                ]
            );

            $this->add_control(
                'show_category',
                [
                    'label' => esc_html__( 'Category', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
                    'condition' => [
                        'post_grid_style!' => '3'
                    ]
                ]
            );

            $this->add_control(
                'show_date',
                [
                    'label' => esc_html__( 'UserMeta', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
                ]
            );

            $this->add_control(
                'title_length',
                [
                    'label' => __('Title Lenght', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default'=> 7,
                    'condition' => [
                        'show_title' => 'yes',
                    ]
                ]
            );

            $this->add_control(
                'content_length',
                [
                    'label' => __('Content Lenght', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default'=> 10,
                    'condition' => [
                        'post_grid_style' => '3',
                    ]
                ]
            );

            $this->add_control(
                'readmore_txt',
                [
                    'label' => __('Read More Button', 'ht-magazine'),
                    'type' => Controls_Manager::TEXT,
                    'condition'=>[
                        'post_grid_style'=>'3',
                    ]
                ]
            );

            $this->add_group_control(
                Group_Control_Image_Size::get_type(),
                [
                    'name' => 'news_image_size',
                    'default' => 'large',
                    'separator' => 'none',
                    'condition' => [
                        'post_grid_style!' => '3'
                    ]
                ]
            );

        $this->end_controls_section(); // Content Option End

        // Slider setting
        $this->start_controls_section(
            'slider_option',
            [
                'label' => esc_html__( 'Slider Option', 'ht-magazine' ),
                'condition' => [
                    'post_grid_style' => '1',
                ]
            ]
        );

            $this->add_control(
                'slitems',
                [
                    'label' => esc_html__( 'Slider Items', 'ht-magazine' ),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 1,
                    'max' => 20,
                    'step' => 1,
                    'default' => 1,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slarrows',
                [
                    'label' => esc_html__( 'Slider Arrow', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slprevicon',
                [
                    'label' => __( 'Previous icon', 'ht-magazine' ),
                    'type' => Controls_Manager::ICON,
                    'default' => 'fa fa-angle-left',
                    'condition' => [
                        'post_grid_style' => '1',
                        'slarrows' => 'yes',
                    ]
                ]
            );

            $this->add_control(
                'slnexticon',
                [
                    'label' => __( 'Next icon', 'ht-magazine' ),
                    'type' => Controls_Manager::ICON,
                    'default' => 'fa fa-angle-right',
                    'condition' => [
                        'post_grid_style' => '1',
                        'slarrows' => 'yes',
                    ]
                ]
            );

            $this->add_control(
                'sldots',
                [
                    'label' => esc_html__( 'Slider dots', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'no',
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slpause_on_hover',
                [
                    'type' => Controls_Manager::SWITCHER,
                    'label_off' => __('No', 'ht-magazine'),
                    'label_on' => __('Yes', 'ht-magazine'),
                    'return_value' => 'yes',
                    'default' => 'yes',
                    'label' => __('Pause on Hover?', 'ht-magazine'),
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slcentermode',
                [
                    'label' => esc_html__( 'Center Mode', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'no',
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slcenterpadding',
                [
                    'label' => esc_html__( 'Center padding', 'ht-magazine' ),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 0,
                    'max' => 500,
                    'step' => 1,
                    'default' => 50,
                    'condition' => [
                        'post_grid_style' => '1',
                        'slcentermode' => 'yes',
                    ]
                ]
            );

            $this->add_control(
                'slautolay',
                [
                    'label' => esc_html__( 'Slider auto play', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'separator' => 'before',
                    'default' => 'no',
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slautoplay_speed',
                [
                    'label' => __('Autoplay speed', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 3000,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );


            $this->add_control(
                'slanimation_speed',
                [
                    'label' => __('Autoplay animation speed', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 300,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slscroll_columns',
                [
                    'label' => __('Slider item to scroll', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 1,
                    'max' => 10,
                    'step' => 1,
                    'default' => 1,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'heading_tablet',
                [
                    'label' => __( 'Tablet', 'ht-magazine' ),
                    'type' => Controls_Manager::HEADING,
                    'separator' => 'after',
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'sltablet_display_columns',
                [
                    'label' => __('Slider Items', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 1,
                    'max' => 8,
                    'step' => 1,
                    'default' => 1,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'sltablet_scroll_columns',
                [
                    'label' => __('Slider item to scroll', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 1,
                    'max' => 8,
                    'step' => 1,
                    'default' => 1,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'sltablet_width',
                [
                    'label' => __('Tablet Resolution', 'ht-magazine'),
                    'description' => __('The resolution to tablet.', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 750,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'heading_mobile',
                [
                    'label' => __( 'Mobile Phone', 'ht-magazine' ),
                    'type' => Controls_Manager::HEADING,
                    'separator' => 'after',
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slmobile_display_columns',
                [
                    'label' => __('Slider Items', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 1,
                    'max' => 4,
                    'step' => 1,
                    'default' => 1,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slmobile_scroll_columns',
                [
                    'label' => __('Slider item to scroll', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'min' => 1,
                    'max' => 4,
                    'step' => 1,
                    'default' => 1,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

            $this->add_control(
                'slmobile_width',
                [
                    'label' => __('Mobile Resolution', 'ht-magazine'),
                    'description' => __('The resolution to mobile.', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 480,
                    'condition' => [
                        'post_grid_style' => '1',
                    ]
                ]
            );

        $this->end_controls_section(); // Slider Option end

        // Style Title tab section
        $this->start_controls_section(
            'post_grid_item_style_section',
            [
                'label' => __( 'Overlay Color', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' => [
                    'post_grid_style!' => '3'
                ]
            ]
        );

            $this->add_control(
                'item_overlay_color',
                [
                    'label' => __( 'Overlay Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#000000',
                    'selectors' => [
                        '{{WRAPPER}} .post.post-overlay .post-wrap .image::before' => 'background-color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_control(
                'item_overlay_opacity',
                [
                    'label' => __( 'Overlay Opacity', 'ht-magazine' ),
                    'type' => Controls_Manager::SLIDER,
                    'size_units' => [ 'px' ],
                    'range' => [
                        'px' => [
                            'min' => 0.0,
                            'max' => 1,
                            'step' => 0.1,
                        ],
                    ],
                    'default' => [
                        'unit' => 'px',
                        'size' => 0.3,
                    ],
                    'selectors' => [
                        '{{WRAPPER}} .post.post-overlay .post-wrap .image::before' => 'opacity: {{SIZE}};',
                    ],
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

        // Style Title tab section
        $this->start_controls_section(
            'post_grid_title_style_section',
            [
                'label' => __( 'Title', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'show_title'=>'yes',
                ]
            ]
        );
            
            $this->start_controls_tabs( 'title_style_tabs' );

                $this->start_controls_tab(
                    'title_style_normal_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'title_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#ffffff',
                            'selectors' => [
                                '{{WRAPPER}} .post-wrap .content .title a' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'title_typography',
                            'label' => __( 'Typography', 'ht-magazine' ),
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .post-wrap .content .title',
                        ]
                    );

                    $this->add_responsive_control(
                        'title_margin',
                        [
                            'label' => __( 'Margin', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .post-wrap .content .title' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_responsive_control(
                        'title_padding',
                        [
                            'label' => __( 'Padding', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .post-wrap .content .title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_responsive_control(
                        'title_align',
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
                                '{{WRAPPER}} .post-wrap .content .title' => 'text-align: {{VALUE}};',
                            ],
                            'default' => 'left',
                        ]
                    );

                $this->end_controls_tab();

                $this->start_controls_tab(
                    'title_style_hover_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );
                    $this->add_control(
                        'title_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#00c8fa',
                            'selectors' => [
                                '{{WRAPPER}} .post-wrap .content .title a:hover' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                $this->end_controls_tab();

            $this->end_controls_tabs();

        $this->end_controls_section();

        // Style Content tab section
        $this->start_controls_section(
            'post_grid_content_style_section',
            [
                'label' => __( 'Content', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'post_grid_style'=>'3',
                ]
            ]
        );
            $this->add_control(
                'content_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#cccccc',
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .content p' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'content_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post-wrap .content p',
                ]
            );

            $this->add_responsive_control(
                'content_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .content p' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_responsive_control(
                'content_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .content p' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_responsive_control(
                'content_align',
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
                        '{{WRAPPER}} .post-wrap .content p' => 'text-align: {{VALUE}};',
                    ],
                    'default' => 'left',
                ]
            );

        $this->end_controls_section();

        // Style Readmore tab section
        $this->start_controls_section(
            'post_grid_readmore_style_section',
            [
                'label' => __( 'Read More Button', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'post_grid_style'=>'3',
                ]
            ]
        );
            $this->add_control(
                'readmore_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#00c8fa',
                    'selectors' => [
                        '{{WRAPPER}} .post .post-wrap .content .read-more' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'readmore_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post .post-wrap .content .read-more',
                ]
            );

        $this->end_controls_section();

        // Style Date tab section
        $this->start_controls_section(
            'post_grid_date_style_section',
            [
                'label' => __( 'UserMeta', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'show_date'=>'yes',
                ]
            ]
        );
            $this->add_control(
                'date_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#ffffff',
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .content .meta .meta-item' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'date_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post-wrap .content .meta .meta-item',
                ]
            );

            $this->add_responsive_control(
                'date_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .content .meta' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_responsive_control(
                'date_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .content .meta' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_responsive_control(
                'date_align',
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
                        '{{WRAPPER}} .post-wrap .content .meta' => 'text-align: {{VALUE}};',
                    ],
                    'default' => 'left',
                ]
            );

        $this->end_controls_section();

        // Style Category tab section
        $this->start_controls_section(
            'post_grid_category_style_section',
            [
                'label' => __( 'Category', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' => [
                    'post_grid_style!' => '3'
                ]
            ]
        );
            $this->add_control(
                'category_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#ffffff',
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap a.category' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'category_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post-wrap a.category',
                ]
            );

            $this->add_responsive_control(
                'category_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap a.category' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_responsive_control(
                'category_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap a.category' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Background::get_type(),
                [
                    'name' => 'category_background',
                    'label' => __( 'Background', 'ht-magazine' ),
                    'types' => [ 'classic', 'gradient' ],
                    'selector' => '{{WRAPPER}} .post-wrap a.category',
                ]
            );

        $this->end_controls_section();

        // Style arrow style start
        $this->start_controls_section(
            'slider_arrow_style',
            [
                'label'     => __( 'Arrow', 'ht-magazine' ),
                'tab'       => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'post_grid_style' => '1',
                    'slarrows'  => 'yes',
                ],
            ]
        );
            
            $this->start_controls_tabs( 'slider_arrow_style_tabs' );

                // Normal tab Start
                $this->start_controls_tab(
                    'slider_arrow_style_normal_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'slider_arrow_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default' => '#333333',
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow' => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'slider_arrow_fontsize',
                        [
                            'label' => __( 'Font Size', 'ht-magazine' ),
                            'type' => Controls_Manager::SLIDER,
                            'size_units' => [ 'px', '%' ],
                            'range' => [
                                'px' => [
                                    'min' => 0,
                                    'max' => 100,
                                    'step' => 1,
                                ],
                                '%' => [
                                    'min' => 0,
                                    'max' => 100,
                                ],
                            ],
                            'default' => [
                                'unit' => 'px',
                                'size' => 20,
                            ],
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow' => 'font-size: {{SIZE}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Background::get_type(),
                        [
                            'name' => 'slider_arrow_background',
                            'label' => __( 'Background', 'ht-magazine' ),
                            'types' => [ 'classic', 'gradient' ],
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'slider_arrow_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow',
                        ]
                    );

                    $this->add_responsive_control(
                        'slider_arrow_border_radius',
                        [
                            'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                        ]
                    );

                    $this->add_control(
                        'slider_arrow_height',
                        [
                            'label' => __( 'Height', 'ht-magazine' ),
                            'type' => Controls_Manager::SLIDER,
                            'size_units' => [ 'px' ],
                            'range' => [
                                'px' => [
                                    'min' => 0,
                                    'max' => 1000,
                                    'step' => 1,
                                ]
                            ],
                            'default' => [
                                'unit' => 'px',
                                'size' => 42,
                            ],
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow' => 'height: {{SIZE}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'slider_arrow_width',
                        [
                            'label' => __( 'Width', 'ht-magazine' ),
                            'type' => Controls_Manager::SLIDER,
                            'size_units' => [ 'px' ],
                            'range' => [
                                'px' => [
                                    'min' => 0,
                                    'max' => 1000,
                                    'step' => 1,
                                ]
                            ],
                            'default' => [
                                'unit' => 'px',
                                'size' => 35,
                            ],
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow' => 'width: {{SIZE}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_responsive_control(
                        'slider_arrow_padding',
                        [
                            'label' => __( 'Padding', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                $this->end_controls_tab(); // Normal tab end

                // Hover tab Start
                $this->start_controls_tab(
                    'slider_style_hover_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'slider_arrow_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default' => '#f05555',
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow:hover' => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Background::get_type(),
                        [
                            'name' => 'slider_arrow_hover_background',
                            'label' => __( 'Background', 'ht-magazine' ),
                            'types' => [ 'classic', 'gradient' ],
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow:hover',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'slider_arrow_hover_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow:hover',
                        ]
                    );

                    $this->add_responsive_control(
                        'slider_arrow_hover_border_radius',
                        [
                            'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel .slick-arrow:hover' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                        ]
                    );

                $this->end_controls_tab(); // Hover tab end

            $this->end_controls_tabs();

        $this->end_controls_section(); // Style instagram arrow style end

        // Style instagram Dots style start
        $this->start_controls_section(
            'slider_dots_style',
            [
                'label'     => __( 'Pagination', 'ht-magazine' ),
                'tab'       => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'post_grid_style' => '1',
                    'sldots'  => 'yes',
                ],
            ]
        );
            
            $this->start_controls_tabs( 'slider_dots_style_tabs' );

                // Normal tab Start
                $this->start_controls_tab(
                    'slider_dots_style_normal_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );

                    $this->add_group_control(
                        Group_Control_Background::get_type(),
                        [
                            'name' => 'slider_dots_background',
                            'label' => __( 'Background', 'ht-magazine' ),
                            'types' => [ 'classic', 'gradient' ],
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li button',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'slider_dots_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li button',
                        ]
                    );

                    $this->add_responsive_control(
                        'slider_dots_border_radius',
                        [
                            'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li button' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                        ]
                    );

                    $this->add_control(
                        'slider_dots_height',
                        [
                            'label' => __( 'Height', 'ht-magazine' ),
                            'type' => Controls_Manager::SLIDER,
                            'size_units' => [ 'px', '%' ],
                            'range' => [
                                'px' => [
                                    'min' => 0,
                                    'max' => 1000,
                                    'step' => 1,
                                ],
                                '%' => [
                                    'min' => 0,
                                    'max' => 100,
                                ],
                            ],
                            'default' => [
                                'unit' => 'px',
                                'size' => 15,
                            ],
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li button' => 'height: {{SIZE}}{{UNIT}};',
                            ],
                        ]
                    );

                    $this->add_control(
                        'slider_dots_width',
                        [
                            'label' => __( 'Width', 'ht-magazine' ),
                            'type' => Controls_Manager::SLIDER,
                            'size_units' => [ 'px', '%' ],
                            'range' => [
                                'px' => [
                                    'min' => 0,
                                    'max' => 1000,
                                    'step' => 1,
                                ],
                                '%' => [
                                    'min' => 0,
                                    'max' => 100,
                                ],
                            ],
                            'default' => [
                                'unit' => 'px',
                                'size' => 15,
                            ],
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li button' => 'width: {{SIZE}}{{UNIT}} !important;',
                            ],
                        ]
                    );

                $this->end_controls_tab(); // Normal tab end

                // Hover tab Start
                $this->start_controls_tab(
                    'slider_dots_style_hover_tab',
                    [
                        'label' => __( 'Active', 'ht-magazine' ),
                    ]
                );

                    $this->add_group_control(
                        Group_Control_Background::get_type(),
                        [
                            'name' => 'slider_dots_hover_background',
                            'label' => __( 'Background', 'ht-magazine' ),
                            'types' => [ 'classic', 'gradient' ],
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li.slick-active button, {{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li:hover button',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'slider_dots_hover_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li.slick-active button, {{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li:hover button',
                        ]
                    );

                    $this->add_responsive_control(
                        'slider_dots_hover_border_radius',
                        [
                            'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li.slick-active button' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                                '{{WRAPPER}} .htmagazine-post-carousel ul.slick-dots li:hover button' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                        ]
                    );

                $this->end_controls_tab(); // Hover tab end

            $this->end_controls_tabs();

        $this->end_controls_section(); // Style instagram dots style end

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $custom_order_ck    = $this->get_settings_for_display('custom_order');
        $orderby            = $this->get_settings_for_display('orderby');
        $postorder          = $this->get_settings_for_display('postorder');

        $this->add_render_attribute( 'post_grid_attr', 'class', 'htmagazine-grid-layout-'.$settings['post_grid_style'] );
        $this->add_render_attribute( 'post_layout_attr', 'class', 'post post-overlay hero-post' );

        if( $settings['post_grid_style'] == 3 ){
            $this->add_render_attribute( 'post_grid_attr', 'class', 'post-block-wrapper dark bg-dark' );
        }
        
        if( $settings['post_grid_style'] == 1 ){

            $this->add_render_attribute( 'post_grid_attr', 'class', 'htmagazine-post-carousel' );
            $this->add_render_attribute( 'post_layout_attr', 'class', 'post-large' );

            $slider_settings = [
                'arrows' => ('yes' === $settings['slarrows']),
                'arrow_prev_txt' => $settings['slprevicon'],
                'arrow_next_txt' => $settings['slnexticon'],
                'dots' => ('yes' === $settings['sldots']),
                'autoplay' => ('yes' === $settings['slautolay']),
                'autoplay_speed' => absint($settings['slautoplay_speed']),
                'animation_speed' => absint($settings['slanimation_speed']),
                'pause_on_hover' => ('yes' === $settings['slpause_on_hover']),
                'center_mode' => ( 'yes' === $settings['slcentermode']),
                'center_padding' => absint($settings['slcenterpadding']),
            ];

            $slider_responsive_settings = [
                'display_columns' => $settings['slitems'],
                'scroll_columns' => $settings['slscroll_columns'],
                'tablet_width' => $settings['sltablet_width'],
                'tablet_display_columns' => $settings['sltablet_display_columns'],
                'tablet_scroll_columns' => $settings['sltablet_scroll_columns'],
                'mobile_width' => $settings['slmobile_width'],
                'mobile_display_columns' => $settings['slmobile_display_columns'],
                'mobile_scroll_columns' => $settings['slmobile_scroll_columns'],

            ];

            $slider_settings = array_merge( $slider_settings, $slider_responsive_settings );

            $this->add_render_attribute( 'post_grid_attr', 'data-settings', wp_json_encode( $slider_settings ) );

        }

        // Query
        $args = array(
            'post_type'             => 'post',
            'post_status'           => 'publish',
            'ignore_sticky_posts'   => 1,
            'posts_per_page'        => !empty( $settings['post_limit'] ) ? $settings['post_limit'] : 3,
            'order'                 => $postorder
        );

        // Custom Order
        if( $custom_order_ck == 'yes' ){
            $args['orderby']    = $orderby;
        }

        
        $get_categories = $settings['grid_categories'];
        $grid_cats = str_replace(' ', '', $get_categories);

        if (  !empty( $get_categories ) ) {
            if( is_array($grid_cats) && count($grid_cats) > 0 ){
                $field_name = is_numeric( $grid_cats[0] ) ? 'term_id' : 'slug';
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'category',
                        'terms' => $grid_cats,
                        'field' => $field_name,
                        'include_children' => false
                    )
                );
            }
        }
        $grid_post = new \WP_Query( $args );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'post_grid_attr' ); ?>>

                <?php if( !empty( $settings['section_title'] ) ){ echo '<div class="head"><h4 class="title">'.esc_attr( $settings['section_title'] ).'</h4></div>';} ?>

                <?php if( $settings['post_grid_style'] == 3 ): ?>
                    <div class="body pb-0">
                        <div class="row">
                            <?php
                                $rowcount = 0;
                                while( $grid_post->have_posts() ) : $grid_post->the_post();

                                if( $rowcount == 0 ):
                            ?>
                                <div class="post post-dark col-lg-8 col-12 mb-20">
                                   <div class="post-wrap">
                                        <a class="image" href="<?php the_permalink();?>"><?php the_post_thumbnail();?></a>
                                        <div class="content">
                                            <?php
                                                if( $settings['show_title'] == 'yes' ){
                                                    echo '<h4 class="title"><a href="'.esc_url( get_the_permalink() ).'">'.wp_trim_words( get_the_title(), $settings['title_length'], '' ).'</a></h4>';
                                                }
                                            ?>
                                            <?php if( $settings['show_date'] == 'yes' ): ?>
                                                <div class="meta fix">
                                                    <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="meta-item author"><i class="fa fa-user"></i><?php the_author();?>
                                                    </a>
                                                    <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                </div>
                                            <?php endif;?>

                                            <?php
                                                if( $settings['content_length'] > 0 ){
                                                    echo '<p>'.wp_trim_words( get_the_content(), $settings['content_length'], '' ).'</p>';
                                                }
                                            ?>
                                            <a href="<?php the_permalink();?>" class="read-more">
                                                <?php 
                                                    if( !empty( $settings['readmore_txt'] ) ){ echo esc_html( $settings['readmore_txt'] );
                                                    }else{ esc_html_e( 'continue reading', 'ht-magazine' ); }
                                                ?>
                                            </a>
                                        </div>
                                   </div>
                                </div>
                            <?php else:?>
                                <div class="post post-small post-list post-dark post-separator-border col-lg-12 col-md-6 col-12">
                                   <div class="post-wrap">
                                        <a class="image" href="<?php the_permalink();?>"><?php the_post_thumbnail();?></a>
                                        <div class="content">
                                            <?php
                                                if( $settings['show_title'] == 'yes' ){
                                                    echo '<h4 class="title"><a href="'.esc_url( get_the_permalink() ).'">'.wp_trim_words( get_the_title(), $settings['title_length'], '' ).'</a></h4>';
                                                }
                                            ?>
                                            <?php if( $settings['show_date'] == 'yes' ): ?>
                                                <div class="meta fix">
                                                    <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                </div>
                                            <?php endif;?>
                                        </div>
                                   </div>
                                </div>

                            <?php endif; if ($rowcount == 0 && ($grid_post->post_count != $rowcount)) { ?>
                            <div class="col-lg-4 col-12 mb-20">
                                <div class="row">
                                    <?php  } $rowcount++; endwhile; wp_reset_query(); wp_reset_postdata(); ?>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                <?php else:?>
                    <?php while( $grid_post->have_posts() ) : $grid_post->the_post(); ?>
                        <!-- Overlay Post Start -->
                        <div <?php echo $this->get_render_attribute_string( 'post_layout_attr' ); ?>>
                            
                            <div class="post-wrap">
                                <div class="image">
                                    <a href="<?php the_permalink();?>">
                                        <?php
                                            if( $settings['news_image_size_size'] == 'custom' ){
                                                the_post_thumbnail( array( $settings['news_image_size_custom_dimension']['width'], $settings['news_image_size_custom_dimension']['height'] ) ); 
                                            }else{
                                                the_post_thumbnail( $settings['news_image_size_size'] );
                                            }
                                        ?>
                                    </a>
                                </div>
                                <?php
                                    if( $settings['show_category'] == 'yes' ){
                                        $i=0;
                                        foreach ( get_the_category() as $category ) {
                                            $i++;
                                            $term_link = get_term_link( $category );
                                            ?>
                                                <a class="category politic" href="<?php echo esc_url( $term_link ); ?>" class="category <?php echo esc_attr( $category->slug ); ?>"><?php echo esc_attr( $category->name );?></a>
                                            <?php
                                            if( $i==1 ){ break; }
                                        }
                                    }
                                ?>
                                <!-- Content -->
                                <div class="content">
                                    <h2 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), 5, '' ); ?></a></h2>
                                    <div class="meta fix">
                                        <span class="meta-item date"><i class="fa fa-clock-o"></i>
                                            <?php the_time( esc_html__( 'd F Y', 'ht-magazine' ) ); ?>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div><!-- Overlay Post End -->
                    <?php endwhile; wp_reset_query(); wp_reset_postdata(); ?>
                <?php endif;?>

            </div>

        <?php

    }

}
