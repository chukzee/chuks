<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_Category_List extends Widget_Base {

    public function get_name() {
        return 'htmagazine-addonscategorymenu';
    }
    
    public function get_title() {
        return __( 'Categories List', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-editor-list-ul';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'category_setting_content',
            [
                'label' => __( 'Category', 'ht-magazine' ),
            ]
        );
            $this->add_control(
                'category_section_title',
                [
                    'label' => __( 'Title', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Type your title here', 'ht-magazine' ),
                ]
            );

            $this->add_control(
                'show_postcount',
                [
                    'label' => __( 'Show Post Count', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
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
                    'category_section_title!'=>'',
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
                    'default'=>'#ec0000',
                    'selectors' => [
                        '{{WRAPPER}} .head .title' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'section_title_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .head .title',
                ]
            );

            $this->add_responsive_control(
                'section_title_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .head .title' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                        '{{WRAPPER}} .head .title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                    'default'=>'#ec0000',
                    'selectors' => [
                        '{{WRAPPER}} .head::before' => 'background-color: {{VALUE}}',
                        '{{WRAPPER}} .head::after' => 'background-color: {{VALUE}}',
                    ],
                ]
            );

        $this->end_controls_section();

        // Category Menu Style
        $this->start_controls_section(
            'category_menu_style_section',
            [
                'label' => __( 'Category Menu', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

            $this->start_controls_tabs( 'category_menu_style_tabs' );

                $this->start_controls_tab(
                    'menu_normal_style_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'menu_normal_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#666666',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-category.video-category li' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .sidebar-category.video-category li a' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'menu_normal_typography',
                            'label' => __( 'Typography', 'ht-magazine' ),
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .sidebar-category.video-category li,{{WRAPPER}} .sidebar-category.video-category li a',
                        ]
                    );

                $this->end_controls_tab();

                $this->start_controls_tab(
                    'menu_hover_style_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );
                    $this->add_control(
                        'menu_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#ec0000',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-category.video-category li:hover' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .sidebar-category.video-category li a:hover' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                $this->end_controls_tab();

            $this->end_controls_tabs();

        $this->end_controls_section();

    }

    protected function render( $instance = [] ) {

        $settings          = $this->get_settings_for_display();
        $post_count_show   = $this->get_settings_for_display('show_postcount');

        $this->add_render_attribute( 'category_attr', 'class', 'htmega-category' );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'category_attr' ); ?>>
                
                <div class="sidebar-block-wrapper">
                    <?php if( !empty( $settings['category_section_title'] ) ):?>
                        <div class="head video-head">
                            <h4 class="title"><?php echo esc_html( $settings['category_section_title'] ) ;?></h4>
                        </div>
                    <?php endif;?>
                    <div class="body">
                        <ul class="sidebar-category video-category">
                            <?php wp_list_categories( array(
                                'orderby'    => 'name',
                                'show_count' => $post_count_show,
                                'title_li'   => '',
                            ) ); ?>
                        </ul>
                    </div>
                </div>

            </div>

        <?php

    }

}