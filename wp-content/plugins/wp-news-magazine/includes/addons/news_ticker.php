<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_NewsTicker extends Widget_Base {

    public function get_name() {
        return 'htmagazine-newsticker-addons';
    }
    
    public function get_title() {
        return __( 'News Ticker', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-posts-ticker';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'news_ticker',
            [
                'label' => __( 'News Ticker', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'ticker_label',
                [
                    'label' => __( 'Ticker Label', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Breaking News', 'ht-magazine' ),
                    'separator'=>'after',
                ]
            );

            $this->add_control(
                'label_icon',
                [
                    'label' => __( 'Label Icon', 'ht-magazine' ),
                    'type' => Controls_Manager::ICON,
                ]
            );

            $this->add_control(
                'rowheight',
                [
                    'label' => __('Row Height', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 40,
                ]
            );

            $this->add_control(
                'maxrow',
                [
                    'label' => __('Maxium Row', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 1,
                ]
            );

            $this->add_control(
                'animationspeed',
                [
                    'label' => __('Animation Speed', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 600,
                ]
            );

            $this->add_control(
                'animateduration',
                [
                    'label' => __('Animatied duration', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 5000,
                ]
            );

            $this->add_control(
                'direction',
                [
                    'label' => __( 'Direction', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => 'up',
                    'options' => [
                        'up'   => __( 'Up', 'ht-magazine' ),
                        'down'   => __( 'Down', 'ht-magazine' ),
                    ],
                ]
            );

            $this->add_control(
                'autostart',
                [
                    'label' => esc_html__( 'Auto Start', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
                    'separator'=>'before',
                ]
            );

            $this->add_control(
                'pauseonhover',
                [
                    'label' => esc_html__( 'Pause on hover', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'no',
                ]
            );
            
        $this->end_controls_section();

        $this->start_controls_section(
            'news_ticker_content',
            [
                'label' => __( 'Content Option', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'news_categories',
                [
                    'label' => esc_html__( 'Categories', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT2,
                    'label_block' => true,
                    'multiple' => true,
                    'options' => htmagazine_get_taxonomies(),
                ]
            );

            $this->add_control(
                'newslimit',
                [
                    'label' => __('News Limit', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 3,
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
                'order',
                [
                    'label' => esc_html__( 'order', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => 'DESC',
                    'options' => [
                        'DESC'  => esc_html__('Descending','ht-magazine'),
                        'ASC'   => esc_html__('Ascending','ht-magazine'),
                    ],
                    'condition' => [
                        'custom_order' => 'yes',
                    ]
                ]
            );

        $this->end_controls_section();

        // Navigation Button
        $this->start_controls_section(
            'news_navigation',
            [
                'label' => __( 'Navigation Button', 'ht-magazine' ),
            ]
        );
            
            $this->add_control(
                'navigation_show',
                [
                    'label' => esc_html__( 'Show', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
                ]
            );

            $this->add_control(
                'button_prev_icon',
                [
                    'label' => __( 'Previous Icon', 'ht-magazine' ),
                    'type' => Controls_Manager::ICON,
                    'default'=>'fa fa-angle-left',
                    'condition' =>[
                        'navigation_show' =>'yes',
                    ],
                ]
            );

            $this->add_control(
                'button_next_icon',
                [
                    'label' => __( 'Next Icon', 'ht-magazine' ),
                    'type' => Controls_Manager::ICON,
                    'default'=>'fa fa-angle-right',
                    'condition' =>[
                        'navigation_show' =>'yes',
                    ],
                ]
            );

        $this->end_controls_section();

    
        // Style tab section
        $this->start_controls_section(
            'htmagazine_newsticker_style_section',
            [
                'label' => __( 'Style', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
            
            $this->add_group_control(
                Group_Control_Background::get_type(),
                [
                    'name' => 'htmagazine_newsticker_background',
                    'label' => __( 'Background', 'ht-magazine' ),
                    'types' => [ 'classic', 'gradient' ],
                    'selector' => '{{WRAPPER}} .breaking-news-section',
                ]
            );

            $this->add_group_control(
                Group_Control_Border::get_type(),
                [
                    'name' => 'htmagazine_newsticker_border',
                    'label' => __( 'Border', 'ht-magazine' ),
                    'selector' => '{{WRAPPER}} .breaking-news-section',
                ]
            );

            $this->add_responsive_control(
                'htmagazine_newsticker_border_radius',
                [
                    'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-section' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                    ],
                ]
            );
            
            $this->add_responsive_control(
                'htmagazine_newsticker_section_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-section' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

            $this->add_responsive_control(
                'htmagazine_newsticker_section_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-section' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

        $this->end_controls_section();

        // Style content tab section
        $this->start_controls_section(
            'htmagazine_newsticker_contnet_style',
            [
                'label' => __( 'Content', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
            $this->add_control(
                'htmagazine_newsticker_contnet_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default' => '#ffffff',
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-ticker li a' => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'htmagazine_newsticker_contnet_typography',
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .breaking-news-ticker li a',
                ]
            );

        $this->end_controls_section();

        // Style Label tab section
        $this->start_controls_section(
            'htmagazine_newsticker_label_style',
            [
                'label' => __( 'Label', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'ticker_label!' =>'',
                ],
            ]
        );
            
            $this->add_control(
                'htmagazine_newsticker_label_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default' => '#ffffff',
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-title' => 'color: {{VALUE}};',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'htmagazine_newsticker_label_typography',
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .breaking-news-title',
                ]
            );

            $this->add_group_control(
                Group_Control_Background::get_type(),
                [
                    'name' => 'htmagazine_newsticker_label_background',
                    'label' => __( 'Background', 'ht-magazine' ),
                    'types' => [ 'classic', 'gradient' ],
                    'selector' => '{{WRAPPER}} .breaking-news-title',
                ]
            );

            $this->add_group_control(
                Group_Control_Border::get_type(),
                [
                    'name' => 'htmagazine_newsticker_label_border',
                    'label' => __( 'Border', 'ht-magazine' ),
                    'selector' => '{{WRAPPER}} .breaking-news-title',
                ]
            );

            $this->add_responsive_control(
                'htmagazine_newsticker_border_label_radius',
                [
                    'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-title' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                    ],
                ]
            );
            
            $this->add_responsive_control(
                'htmagazine_newsticker_label_padding',
                [
                    'label' => __( 'Padding', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .breaking-news-title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    ],
                    'separator' =>'before',
                ]
            );

        $this->end_controls_section();

        // Style navigation tab section
        $this->start_controls_section(
            'htmagazine_newsticker_navigation_style',
            [
                'label' => __( 'Navigation', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'navigation_show' =>'yes',
                ],
            ]
        );
            $this->start_controls_tabs('button_style_tabs');

                // Button Normal
                $this->start_controls_tab(
                    'button_style_normal_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );
                    
                    $this->add_control(
                        'htmagazine_newsticker_button_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default' => '#ffffff',
                            'selectors' => [
                                '{{WRAPPER}} .breaking-news-nav button i' => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Background::get_type(),
                        [
                            'name' => 'htmagazine_newsticker_button_background',
                            'label' => __( 'Background', 'ht-magazine' ),
                            'types' => [ 'classic', 'gradient' ],
                            'selector' => '{{WRAPPER}} .breaking-news-nav button',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'htmagazine_newsticker_button_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .breaking-news-nav button',
                        ]
                    );

                    $this->add_responsive_control(
                        'htmagazine_newsticker_button_border_radius',
                        [
                            'label' => esc_html__( 'Border Radius', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'selectors' => [
                                '{{WRAPPER}} .breaking-news-nav button' => 'border-radius: {{TOP}}px {{RIGHT}}px {{BOTTOM}}px {{LEFT}}px;',
                            ],
                        ]
                    );
                    
                    $this->add_responsive_control(
                        'htmagazine_newsticker_button_padding',
                        [
                            'label' => __( 'Padding', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .breaking-news-nav button' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                    $this->add_responsive_control(
                        'htmagazine_newsticker_button_margin',
                        [
                            'label' => __( 'Margin', 'ht-magazine' ),
                            'type' => Controls_Manager::DIMENSIONS,
                            'size_units' => [ 'px', '%', 'em' ],
                            'selectors' => [
                                '{{WRAPPER}} .breaking-news-nav button' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                            ],
                            'separator' =>'before',
                        ]
                    );

                $this->end_controls_tab();

                // Button Hover
                $this->start_controls_tab(
                    'button_style_hover_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );
                    $this->add_control(
                        'htmagazine_newsticker_button_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default' => '#ffffff',
                            'selectors' => [
                                '{{WRAPPER}} .breaking-news-nav button:hover i' => 'color: {{VALUE}};',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Background::get_type(),
                        [
                            'name' => 'htmagazine_newsticker_button_hover_background',
                            'label' => __( 'Background', 'ht-magazine' ),
                            'types' => [ 'classic', 'gradient' ],
                            'selector' => '{{WRAPPER}} .breaking-news-nav button:hover',
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Border::get_type(),
                        [
                            'name' => 'htmagazine_newsticker_button_hover_border',
                            'label' => __( 'Border', 'ht-magazine' ),
                            'selector' => '{{WRAPPER}} .breaking-news-nav button:hover',
                        ]
                    );

                $this->end_controls_tab();

            $this->end_controls_tabs();

        $this->end_controls_section();

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $settings           = $this->get_settings_for_display();
        $custom_order_ck    = $this->get_settings_for_display('custom_order');
        $orderby            = $this->get_settings_for_display('orderby');
        $order              = $this->get_settings_for_display('order');
        $id = $this->get_id();

        $this->add_render_attribute( 'htmagazine_newswrap', 'class', 'breaking-news-section' );

        $newsticker_slider_settings = [
            'rowheight'     => absint( $settings['rowheight'] ),
            'maxrows'       => absint( $settings['maxrow'] ),
            'speed'         => absint( $settings['animationspeed'] ),
            'duration'      => absint( $settings['animateduration'] ),
            'autostart'     => ( $settings['autostart'] == 'yes' ? 1 : 0 ),
            'pauseonhover'  => ( $settings['pauseonhover'] == 'yes' ? 1 : 0 ),
            'direction'     => $settings['direction'],
            'navbutton'     => $settings['navigation_show'],
            'activeid'      => '.ticker-active-'.$id,
            'unicidprev'    => '.htnewsprev-'.$id,
            'unicidnext'    => '.htnewsnext-'.$id,
        ];

        // List UL attr
        $this->add_render_attribute('newsticker_options_attr', 'data-newstrickeropt', wp_json_encode( $newsticker_slider_settings ));
        $this->add_render_attribute( 'newsticker_options_attr', 'class', 'breaking-news-ticker float-left' );
        $this->add_render_attribute( 'newsticker_options_attr', 'class', 'ticker-active-'.$id );

        $args = array(
            'post_type'             => 'post',
            'post_status'           => 'publish',
            'ignore_sticky_posts'   => 1,
            'posts_per_page'        => !empty( $settings['newslimit'] ) ? $settings['newslimit'] : 3,
        );

        // Custom Order
        if( $custom_order_ck == 'yes' ){
            $args['orderby']    = $orderby;
            $args['order']      = $order;
        }

        
        $get_categories = $settings['news_categories'];
        
        $news_cats = str_replace(' ', '', $get_categories);
        if (  !empty( $get_categories ) ) {
            if( is_array($news_cats) && count($news_cats) > 0 ){
                $field_name = is_numeric( $news_cats[0] ) ? 'term_id' : 'slug';
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'category',
                        'terms' => $news_cats,
                        'field' => $field_name,
                        'include_children' => false
                    )
                );
            }
        }
        $news_ticker = new \WP_Query( $args );

       
        ?>
            <div <?php echo $this->get_render_attribute_string( 'htmagazine_newswrap' ); ?>>

                <!-- Breaking News Wrapper Start -->
                <div class="breaking-news-wrapper">

                    <!-- Breaking News Title -->
                    <?php
                        if( !empty( $settings['ticker_label'] ) ){
                            if( !empty($settings['label_icon']) ){
                                echo '<h5 class="breaking-news-title float-left">'.esc_html__($settings['ticker_label'],'ht-magazine').' <i class="'.esc_attr($settings['label_icon'],'ht-magazine').'"></i></h5>';
                            }else{
                                echo '<h5 class="breaking-news-title float-left" >'.esc_html__($settings['ticker_label'],'ht-magazine').'</h5>';
                            }
                        }
                    ?>

                    <!-- Breaking Newsticker Start -->
                    <ul <?php echo $this->get_render_attribute_string( 'newsticker_options_attr' ); ?> >
                        <?php
                            if( $news_ticker->have_posts() ){
                                while ( $news_ticker->have_posts() ) {
                                    $news_ticker->the_post();
                                    ?>
                                        <li>
                                            <a href="<?php echo esc_url(get_permalink()); ?>">
                                                <?php the_title(); ?>
                                            </a>
                                        </li>
                                    <?php
                                }
                            }else{
                                ?>
                                    <li><a href="#"><?php esc_html_e('Content Not Found','ht-magazine') ?></a></li>
                                <?php
                            }
                            wp_reset_postdata();
                        ?>
                    </ul><!-- Breaking Newsticker Start -->

                    <!-- Breaking News Nav -->
                    <?php if( $settings['navigation_show'] == 'yes' ): ?>
                        <div class="breaking-news-nav">
                            <button class="news-ticker-prev htnewsprev-<?php echo esc_attr( $id ); ?>"><i class="<?php echo esc_attr__($settings['button_prev_icon'],'ht-magazine');?>"></i></button>
                            <button class="news-ticker-next htnewsnext-<?php echo esc_attr( $id ); ?>"><i class="<?php echo esc_attr__($settings['button_next_icon'],'ht-magazine');?>"></i></button>
                        </div>
                    <?php endif; ?>
                    
                </div><!-- Breaking News Wrapper End -->

            </div>

        <?php

    }

}