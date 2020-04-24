<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_News_Tabs extends Widget_Base {

    public function get_name() {
        return 'htmagazine-newstabs';
    }
    
    public function get_title() {
        return __( 'News Tab', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-tabs';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'news_tab_content',
            [
                'label' => __( 'News Tab', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'news_tab_layout',
                [
                    'label' => __( 'Layout', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => '1',
                    'options' => [
                        '1'   => __( 'Layout One', 'ht-magazine' ),
                        '2'   => __( 'Layout Two', 'ht-magazine' ),
                        '3'   => __( 'Layout Three', 'ht-magazine' ),
                        '4'   => __( 'Layout Four', 'ht-magazine' ),
                        '5'   => __( 'Layout Five', 'ht-magazine' ),
                    ],
                ]
            );

            $this->add_control(
                'tab_section_title',
                [
                    'label' => __( 'Section Title', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __( 'Featured News', 'ht-magazine' ),
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
                    'default'=> 10,
                ]
            );

            $this->add_control(
                'readmore_btn_title',
                [
                    'label' => __( 'Read More Button', 'ht-magazine' ),
                    'type' => Controls_Manager::TEXT,
                    'condition'=>[
                        'news_tab_layout' => '5'
                    ]
                ]
            );

        $this->end_controls_section(); // Content Option End

        // Tab Section Title Style
        $this->start_controls_section(
            'tab_title_style_section',
            [
                'label' => __( 'Section Title', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'tab_section_title!'=>'',
                ]
            ]
        );
            
            $this->add_control(
                'tab_title_color',
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
                'tab_title_before_after_color',
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
                                '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li > a' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li .dropdown-menu li a' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'tab_menu_typography',
                            'label' => __( 'Typography', 'ht-magazine' ),
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li > a',
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
                            'default'=>'#00c8fa',
                            'selectors' => [
                                '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li > a.active' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li > a:hover' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li .dropdown-menu li a:hover' => 'color: {{VALUE}}',
                                '{{WRAPPER}} .post-block-wrapper .head .post-block-tab-list > li .dropdown-menu li a.active' => 'color: {{VALUE}}',
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

        // News Title Menu Style
        $this->start_controls_section(
            'news_readmore_style_section',
            [
                'label' => __( 'Read More Button', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' =>[
                    'news_tab_layout' => '5',
                ]
            ]
        );

            $this->start_controls_tabs('tab_news_readmore_normal_style_tabs');
                
                $this->start_controls_tab(
                    'news_readmore_normal_style_tab',
                    [
                        'label' => __( 'Normal', 'ht-magazine' ),
                    ]
                );
                    
                    $this->add_control(
                        'news_readmore_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#666666',
                            'selectors' => [
                                '{{WRAPPER}} .post .content .read-more' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                    $this->add_group_control(
                        Group_Control_Typography::get_type(),
                        [
                            'name' => 'news_readmore_typography',
                            'label' => __( 'Typography', 'ht-magazine' ),
                            'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                            'selector' => '{{WRAPPER}} .post .content .read-more',
                        ]
                    );

                $this->end_controls_tab();

                // Title Hover Section
                $this->start_controls_tab(
                    'news_readmore_hover_style_tab',
                    [
                        'label' => __( 'Hover', 'ht-magazine' ),
                    ]
                );

                    $this->add_control(
                        'news_readmore_hover_color',
                        [
                            'label' => __( 'Color', 'ht-magazine' ),
                            'type' => Controls_Manager::COLOR,
                            'scheme' => [
                                'type' => Scheme_Color::get_type(),
                                'value' => Scheme_Color::COLOR_1,
                            ],
                            'default'=>'#008bff',
                            'selectors' => [
                                '{{WRAPPER}} .post .content .read-more:hover' => 'color: {{VALUE}}',
                            ],
                        ]
                    );

                $this->end_controls_tab();

            $this->end_controls_tabs();

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

                <div class="post-block-wrapper">

                    <!-- Post Block Head Start -->
                    <div class="head">
                        <?php
                            if( !empty( $settings['tab_section_title'] ) ){ echo '<h4 class="title">'.esc_attr( $settings['tab_section_title'] ).'</h4>'; }
                            
                            if ( isset( $get_categories ) ): 
                        ?>
                            <!-- Tab List Start -->
                            <ul class="post-block-tab-list nav d-none d-md-block">
                                <?php
                                    $catmenucount=0;
                                    foreach( $grid_cats as $catname ){
                                        $catmenucount++;
                                        if( $catmenucount > 4 ){
                                            echo '<li><a class="dropdown-toggle" data-toggle="dropdown" href="#">'.esc_html__('More','ht-magazine').'</a><ul class="dropdown-menu">';
                                        }
                                        ?>
                                            <li><a class="<?php if($catmenucount == 1){echo 'active';}?>" data-toggle="tab" href="#<?php echo 'tab'.$id.$catname;?>"><?php echo esc_attr( $catname );?></a></li>
                                        <?php 
                                        if( count( $grid_cats) == $catmenucount ){ echo '</ul></li>'; }
                                    }
                                ?>
                            </ul><!-- Tab List End -->

                            <!-- Tab List Start -->
                            <ul class="post-block-tab-list feature-post-tab-list nav d-sm-block d-md-none">
                                <li><a class="dropdown-toggle" data-toggle="dropdown" href="#"><?php esc_html_e('Category','ht-magazine');?></a>
                                    <!-- Dropdown -->
                                    <ul class="dropdown-menu">
                                        <?php
                                            $n=0;
                                            foreach( $grid_cats as $catname ){
                                                $n++;
                                        ?>
                                        <li><a class="<?php if( $n == 1 ){echo 'active';}?>" data-toggle="tab" href="#<?php echo 'tab'.$id.$catname;?>"><?php echo esc_attr( $catname );?></a></li>
                                        <?php } ?>
                                    </ul>
                                </li>
                            </ul><!-- Tab List End -->

                        <?php endif;?>

                    </div><!-- Post Block Head End -->

                    <div class="body <?php if( $settings['news_tab_layout'] != '4' ){echo 'pb-0';}?>">

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
                                    
                                    <div class="row">
                                        <!-- Layout Three -->
                                        <?php if( $settings['news_tab_layout'] == '3' ):?>
                                            <div class="col-lg-8 col-12">
                                                <div class="row">
                                                    <?php
                                                        if( $posts->have_posts() ):
                                                            $countrow=1;
                                                            while( $posts->have_posts() ): $posts->the_post();

                                                                $post_style_class = 'post post-overlay post-large sports-post col-12 mb-20';
                                                                if($countrow > 1 && $countrow <= 3 ){ 
                                                                    $post_style_class = 'post post-overlay sports-post col-md-6 mb-20';
                                                                }elseif( $countrow > 3 ){
                                                                    $post_style_class = 'col-lg-12 col-md-6 col-12 mb-20';
                                                                }
                                                    ?>


                                                    <?php if( $countrow < 5): ?>
                                                        <!-- Overlay Post Start -->
                                                        <div class="<?php echo esc_attr( $post_style_class );?>">

                                                            <?php if( $countrow < 4):?>

                                                                <div class="post-wrap">
                                                                    <div class="image">
                                                                        <?php
                                                                            if($countrow == 1){ the_post_thumbnail();
                                                                            }else{ the_post_thumbnail(); } 
                                                                        ?>
                                                                    </div>
                                                                    <div class="content">
                                                                        <h2 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h2>
                                                                        <div class="meta fix">
                                                                            <?php if($countrow == 1):?>
                                                                                <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="meta-item author"><i class="fa fa-user"></i>
                                                                                    <?php the_author();?>
                                                                                </a>
                                                                                <span class="meta-item date"><i class="fa fa-clock-o"></i>
                                                                                    <?php the_time(esc_html__('d F Y','hashnews'));?>
                                                                                </span>
                                                                            <?php else:?>
                                                                                <span class="meta-item date"><i class="fa fa-clock-o"></i>
                                                                                    <?php the_time(esc_html__('d F Y','hashnews'));?>
                                                                                </span>
                                                                            <?php endif;?>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            <?php elseif( $countrow == 4):?>
                                                                <!-- Post Start -->
                                                                <div class="post sports-post">
                                                                    <div class="post-wrap">
                                                                        <!-- Image -->
                                                                        <a class="image" href="<?php the_permalink();?>"><?php the_post_thumbnail(); ?></a>
                                                                        <!-- Content -->
                                                                        <div class="content">
                                                                            <!-- Title -->
                                                                            <h4 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h4>
                                                                            <!-- Meta -->
                                                                            <div class="meta fix">
                                                                                <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="meta-item author"><i class="fa fa-user"></i>
                                                                                    <?php the_author();?>
                                                                                </a>
                                                                                <span class="meta-item date"><i class="fa fa-clock-o"></i>
                                                                                    <?php the_time(esc_html__('d F Y','hashnews'));?>
                                                                                </span>
                                                                            </div>
                                                                            <!-- Description s-->
                                                                            <p>
                                                                                <?php echo wp_trim_words( get_the_content(), $post_excerpt_length, '' ); ?>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div><!-- Post End -->
                                                            <?php else:?>
                                                                
                                                            <?php endif;?>

                                                        </div><!-- Overlay Post End -->

                                                <?php else: if( $countrow == 5): ?>
                                                    <div class="<?php echo esc_attr( $post_style_class );?>">
                                                    <?php endif;?>
                                                        <!-- Small Post Start -->
                                                        <div class="post post-small post-list sports-post post-separator-border">
                                                            <div class="post-wrap">
                                                                <a class="image" href="<?php the_permalink();?>"><?php the_post_thumbnail('thumbnail'); ?></a>
                                                                <div class="content">
                                                                    <h5 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h5>
                                                                    <div class="meta fix">
                                                                        <span class="meta-item date"><i class="fa fa-clock-o"></i>
                                                                            <?php the_time(esc_html__('d F Y','hashnews'));?>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div><!-- Small Post End -->

                                                  <?php if( $countrow == $posts->post_count ){ echo '</div>'; } endif;?>

                                                    <?php if ( $countrow % 3 == 0 && ( $countrow<=3 )) { ?>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-12">
                                                <div class="row">
                                                    <?php } $countrow++; endwhile; endif; ?>
                                                </div>
                                            </div>

                                        <?php elseif( $settings['news_tab_layout'] == '4' ):?>
                                            <?php
                                                if( $posts->have_posts() ):
                                                    $countrow = 0;
                                                    while( $posts->have_posts() ): $posts->the_post();
                                                        $countrow++;
                                            ?>
                                                <!-- Overlay Post Start -->
                                                <div class="<?php if( $countrow == 1 ){ echo 'post post-large post-overlay life-style-post post-separator-border col-12'; }else{ echo 'post post-small post-list life-style-post post-separator col-md-6 col-12'; }?>">
                                                    <div class="post-wrap">

                                                        <!-- Image -->
                                                        <div class="image"><?php the_post_thumbnail(); ?></div>

                                                        <!-- Content -->
                                                        <div class="content">

                                                            <!-- Title -->
                                                            <h4 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h4>

                                                            <!-- Meta -->
                                                            <div class="meta fix">
                                                                <?php if( $countrow == 1 ):?>
                                                                    <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="meta-item author"><i class="fa fa-user"></i>
                                                                        <?php the_author();?>
                                                                    </a>
                                                                <?php endif;?>
                                                                <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div><!-- Overlay Post End -->
                                            <?php endwhile; endif;?>

                                        <?php elseif( $settings['news_tab_layout'] == '5' ):?>
                                            <?php
                                                if( $posts->have_posts() ):
                                                    $countrow = 0;
                                                    while( $posts->have_posts() ): $posts->the_post();
                                                        $countrow++;
                                            ?>
                                                <!-- Post Start -->
                                                <div class="post education-post col-md-6 col-12 mb-20">
                                                    <div class="post-wrap">
                                                        <a class="image" href="<?php the_permalink();?>">
                                                            <?php the_post_thumbnail(); ?>
                                                        </a>
                                                        <div class="content">
                                                            <h4 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h4>
                                                            <a href="<?php the_permalink();?>" class="read-more">
                                                                <?php 
                                                                    if( !empty( $settings['readmore_btn_title'] ) ){
                                                                        echo esc_html( $settings['readmore_btn_title'] );
                                                                    }else{
                                                                        esc_html_e( 'continue reading', 'ht-magazine' );
                                                                    }
                                                                ?>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div><!-- Post End -->
                                            <?php endwhile; endif;?>


                                         <!-- Layout One/Two    -->
                                        <?php else:?>
                                            <div class="col-md-6 col-12 mb-20">
                                                <?php
                                                    if( $posts->have_posts() ):
                                                        $countrow=1;
                                                        while( $posts->have_posts() ): $posts->the_post();
                                                ?>

                                                <!-- Post Start -->
                                                <div class="post feature-post post-separator-border <?php if( $countrow > $larg_post_count ){ echo 'post-small post-list'; } if( $settings['news_tab_layout'] == '2' && $countrow <= 2 ){ echo 'post-overlay'; }?>">
                                                    <div class="post-wrap">
                                                        <?php if( $settings['news_tab_layout'] == '2' ):?>
                                                            <a class="image" href="<?php the_permalink();?>">
                                                                <?php
                                                                    if( $countrow > $larg_post_count ){ the_post_thumbnail(); }
                                                                        else{ the_post_thumbnail(); }
                                                                ?>
                                                            </a>
                                                            <div class="content">
                                                                <h4 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h4>
                                                                <div class="meta fix">
                                                                    <?php if( $countrow <= $larg_post_count ): ?>
                                                                        <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="meta-item author"><i class="fa fa-user"></i>
                                                                            <?php the_author();?>
                                                                        </a>
                                                                    <?php endif;?>
                                                                    <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                                </div>
                                                            </div>
                                                        <?php else:?>

                                                        <a class="image" href="<?php the_permalink();?>">
                                                            <?php
                                                                if( $countrow > $larg_post_count ){ the_post_thumbnail(); }
                                                                    else{ the_post_thumbnail(); }
                                                            ?>
                                                        </a>    
                                                        <div class="content">
                                                            <h4 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $post_title_length, '' ); ?></a></h4>
                                                            <div class="meta fix">
                                                                <?php if( $countrow > $larg_post_count ): ?>
                                                                    <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                                    <?php
                                                                    else: ?>
                                                                        <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="meta-item author"><i class="fa fa-user"></i>
                                                                            <?php the_author();?>
                                                                        </a>
                                                                        <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                                        <span class="meta-item comments"><i class="fa fa-comments"></i><?php esc_html_e('(','ht-magazine'); comments_popup_link( esc_html__('0','ht-magazine'), esc_html__('1','ht-magazine'), esc_html__('%','ht-magazine'), 'post-comment', esc_html__('Comments off','ht-magazine') ); esc_html_e(')','ht-magazine');?></span>
                                                                    <?php
                                                                    endif;
                                                                ?>
                                                            </div>
                                                            <?php if( $countrow <= $larg_post_count ){ echo '<p>'.wp_trim_words( get_the_content(), $post_excerpt_length, '' ).'</p>'; } ?>
                                                        </div>
                                                    <?php endif;?>

                                                    </div>
                                                </div><!-- Post End -->

                                                <?php if ( $countrow % $larg_post_count == 0 && ($countrow <= $larg_post_count )) { ?>
                                            </div>
                                            <div class="col-md-6 col-12 mb-20">
                                                <?php } $countrow++; endwhile; endif; ?>
                                            </div>

                                        <?php endif;?>

                                    </div>

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