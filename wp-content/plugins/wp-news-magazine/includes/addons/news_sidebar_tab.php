<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_Adds_Sidebar_Tab extends Widget_Base {

    public function get_name() {
        return 'htmagazine-newssidebartabs';
    }
    
    public function get_title() {
        return __( 'News Sidebar Tab', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-tabs';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

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
                    'default' => 4,
                    'separator'=>'before',
                ]
            );

            $this->add_control(
                'large_post_limit',
                [
                    'label' => __('Large Post Limit', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default' => 2,
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
                'show_date',
                [
                    'label' => esc_html__( 'Date', 'ht-magazine' ),
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
                ]
            );

            $this->add_control(
                'content_length',
                [
                    'label' => __('Content Lenght', 'ht-magazine'),
                    'type' => Controls_Manager::NUMBER,
                    'default'=> 0,
                ]
            );

        $this->end_controls_section(); // Content Option End

        // Tab Menu Style
        $this->start_controls_section(
            'tab_menu_style_section',
            [
                'label' => __( 'Tab Menu', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
            
            $this->start_controls_tabs('tab_menu_normal_style_tabs');
                
                $this->start_controls_tab(
                    'tab_menu_normal_style_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'tab_menu_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#444444',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-tab-list a' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'tab_menu_typography',
                            'label' => __( 'Typography', 'ht-magazine' ),
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .sidebar-tab-list a',
                        ]
                    );

                    $this->add_control(
                        'tab_menu_bg_color',
                        [
                            'label' => __( 'Background Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#ffffff',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-tab-list a' => 'background-color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_control(
                        'tab_menu_bf_af_color',
                        [
                            'label' => __( 'Menu Area Before/After Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#008bff',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-block-wrapper .head::before' => 'background-color: {{VALUE}}',
                                '{{WRAPPER}} .sidebar-block-wrapper .head::after' => 'background-color: {{VALUE}}',
                            ],
                        ]
                    );

                $this->end_controls_tab();
                
                // Tab Menu Active
                $this->start_controls_tab(
                    'tab_menu_active_style_tab',
                    [
                        'label' => __( 'Active', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'tab_menu_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#ffffff',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-tab-list a:hover' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .sidebar-tab-list a.active' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_control(
                        'tab_menu_bg_hover_color',
                        [
                            'label' => __( 'Background Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#008bff',
                            'selectors' => [
                                '{{WRAPPER}} .sidebar-tab-list a:hover' => 'background-color: {{VALUE}}',
                                '{{WRAPPER}} .sidebar-tab-list a.active' => 'background-color: {{VALUE}}',
                            ],
                        ]
                    );

                $this->end_controls_tab();

            $this->end_controls_tabs();

        $this->end_controls_section();

        // News Title Menu Style
        $this->start_controls_section(
            'news_title_style_section',
            [
                'label' => __( 'News Title', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'title_length!' => 0,
                ]
            ]
        );

            $this->start_controls_tabs('tab_news_title_normal_style_tabs');
                
                $this->start_controls_tab(
                    'news_title_normal_style_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );
                    
                    $this->add_control(
                        'news_title_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#444444',
                            'selectors' => [
                                '{{WRAPPER}} .post .post-wrap .content .title a' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'news_title_typography',
                            'label' => __( 'Typography', 'ht-magazine' ),
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .post .post-wrap .content .title',
                        ]
                    );

                $this->end_controls_tab();

                // Title Hover Section
                $this->start_controls_tab(
                    'news_title_hover_style_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'news_title_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#00c8fa',
                            'selectors' => [
                                '{{WRAPPER}} .post .post-wrap .content .title a:hover' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                $this->end_controls_tab();

            $this->end_controls_tabs();

        $this->end_controls_section();

        // News Content Style
        $this->start_controls_section(
            'news_content_style_section',
            [
                'label' => __( 'News Content', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'content_length!'=>0,
                ]
            ]
        );
            $this->add_control(
                'news_content_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#666666',
                    'selectors' => [
                        '{{WRAPPER}} .post .post-wrap .content p' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'news_content_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post .post-wrap .content p',
                ]
            );

        $this->end_controls_section();

        // News Meta Style
        $this->start_controls_section(
            'news_meta_style_section',
            [
                'label' => __( 'News Meta', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );
            $this->add_control(
                'news_meta_color',
                [
                    'label' => __( 'Color', 'ht-magazine' ),
                    'type' => Controls_Manager::COLOR,
                    'scheme' => [
                        'type' => Scheme_Color::get_type(),
                        'value' => Scheme_Color::COLOR_1,
                    ],
                    'default'=>'#666666',
                    'selectors' => [
                        '{{WRAPPER}} .post .post-wrap .content .meta .meta-item' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'news_meta_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post .post-wrap .content .meta .meta-item',
                ]
            );

        $this->end_controls_section();

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();

        $custom_order_ck    = $this->get_settings_for_display('custom_order');
        $orderby            = $this->get_settings_for_display('orderby');
        $postorder          = $this->get_settings_for_display('postorder');
        $larg_post_count    = $this->get_settings_for_display('large_post_limit');
        $id                 = $this->get_id();
        $post_title_length  = $settings['title_length'];
        $post_excerpt_length = $settings['content_length'];

        $this->add_render_attribute( 'newstab_attr', 'class', 'htmagazine-tabs-area' );

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

        $posts = new \WP_Query( $args );

        ?>
            <div <?php echo $this->get_render_attribute_string( 'newstab_attr' ); ?>>

                <div class="sidebar-block-wrapper">

                    <!-- Sidebar Block Head Start -->
                    <div class="head education-head">

                        <div class="sidebar-tab-list education-sidebar-tab-list nav">
                            <?php
                                $catmenucount=0;
                                foreach( $grid_cats as $catname ){
                                    $catmenucount++;
                                    ?>
                                        <a class="<?php if($catmenucount == 1){echo 'active';}?>" data-toggle="tab" href="#<?php echo 'tab'.$id.$catname;?>"><?php echo esc_attr( $catname );?></a>
                                    <?php
                                }
                            ?>
                        </div>

                    </div><!-- Sidebar Block Head End -->                    

                    <div class="body">

                        <?php if ( isset( $get_categories ) ): ?>
                            <div class="tab-content">
                                <?php
                                    $i=0;
                                    foreach( $grid_cats as $cats ){
                                        $i++;
                                        $args['category_name'] = $cats;
                                        $posts = new \WP_Query( $args );
                                ?>
                                <div class="tab-pane fade <?php if($i==1){echo 'show active';}?>" id="<?php echo 'tab'.$id.$cats;?>">

                                    <?php
                                        if( $posts->have_posts() ):
                                            $countrow=1;
                                            while( $posts->have_posts() ): $posts->the_post();
                                    ?>
                                    <!-- Small Post Start -->
                                    <div class="post post-small post-list education-post post-separator-border">
                                        <div class="post-wrap">
                                            <a class="image" href="post-details.html">
                                                <?php the_post_thumbnail('thumbnail'); ?>
                                            </a>
                                            <div class="content">
                                                <?php if( $post_title_length > 0 ): ?>
                                                <h5 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h5>
                                                <?php endif; if( $post_excerpt_length > 0 ): ?>
                                                    <p><?php echo wp_trim_words( get_the_content(), $post_excerpt_length, '' ); ?></p>
                                                <?php endif; if( $settings['show_date'] == 'yes' ):?>
                                                    <div class="meta fix">
                                                        <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                    </div>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div><!-- Small Post End -->
                                    <?php endwhile; endif; ?>

                                </div>
                                <?php } ?>
                            </div>
                        <?php endif; ?> 
                    </div>


                </div>

            </div>

        <?php

    }

}