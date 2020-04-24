<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMagazine_Elementor_Widget_News_OverlayGrid extends Widget_Base {

    public function get_name() {
        return 'htmagazine-newsoverlay';
    }
    
    public function get_title() {
        return __( 'News Overlay Grid', 'ht-magazine' );
    }

    public function get_icon() {
        return 'htelementor-icon eicon-posts-grid';
    }
    public function get_categories() {
        return [ 'htnews-addons' ];
    }

    protected function _register_controls() {

        // Content Option Start
        $this->start_controls_section(
            'overlay_news_content',
            [
                'label' => __( 'Layout', 'ht-magazine' ),
            ]
        );

            $this->add_control(
                'news_layout',
                [
                    'label' => __( 'Layout', 'ht-magazine' ),
                    'type' => Controls_Manager::SELECT,
                    'default' => '1',
                    'options' => [
                        '1'   => __( 'Layout One', 'ht-magazine' ),
                        '2'   => __( 'Layout Two', 'ht-magazine' ),
                    ],
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
                'show_category',
                [
                    'label' => esc_html__( 'Category', 'ht-magazine' ),
                    'type' => Controls_Manager::SWITCHER,
                    'return_value' => 'yes',
                    'default' => 'yes',
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

        $this->end_controls_section(); // Content Option End

        // Style Title tab section
        $this->start_controls_section(
            'post_grid_title_style_section',
            [
                'label' => __( 'Title', 'ht-magazine' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition'=>[
                    'title_length!'=>'',
                ]
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
                        '{{WRAPPER}} .post .post-wrap .content .title a' => 'color: {{VALUE}} !important',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'title_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post .post-wrap .title a',
                ]
            );

            $this->add_responsive_control(
                'title_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post .post-wrap .title' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                        '{{WRAPPER}} .post .post-wrap .title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                        '{{WRAPPER}} .post .post-wrap .title' => 'text-align: {{VALUE}};',
                    ],
                    'default' => 'left',
                ]
            );

        $this->end_controls_section();

        
        // Style Date tab section
        $this->start_controls_section(
            'post_grid_date_style_section',
            [
                'label' => __( 'Date', 'ht-magazine' ),
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
                        '{{WRAPPER}} .post-wrap .meta .meta-item' => 'color: {{VALUE}}',
                    ],
                ]
            );

            $this->add_group_control(
                Group_Control_Typography::get_type(),
                [
                    'name' => 'date_typography',
                    'label' => __( 'Typography', 'ht-magazine' ),
                    'scheme' => Scheme_Typography::TYPOGRAPHY_1,
                    'selector' => '{{WRAPPER}} .post-wrap .meta .meta-item',
                ]
            );

            $this->add_responsive_control(
                'date_margin',
                [
                    'label' => __( 'Margin', 'ht-magazine' ),
                    'type' => Controls_Manager::DIMENSIONS,
                    'size_units' => [ 'px', '%', 'em' ],
                    'selectors' => [
                        '{{WRAPPER}} .post-wrap .meta' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                        '{{WRAPPER}} .post-wrap .meta' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
                        '{{WRAPPER}} .post-wrap .meta' => 'text-align: {{VALUE}};',
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
                'condition'=>[
                    'show_category'=>'yes',
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

    }

    protected function render( $instance = [] ) {

        $settings   = $this->get_settings_for_display();
        $custom_order_ck    = $this->get_settings_for_display('custom_order');
        $orderby            = $this->get_settings_for_display('orderby');
        $postorder          = $this->get_settings_for_display('postorder');

        $this->add_render_attribute( 'htmagazine_ovgrid', 'class', 'htmega-overlay' );

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
            <div <?php echo $this->get_render_attribute_string( 'htmagazine_ovgrid' ); ?>>

                <div class="row">
                    <div class="col">
                        <div class="row <?php if( $settings['news_layout'] != '2' ){ echo 'row-1' ;}?>">
                            <?php
                                $countrow = 0;
                                $gdc = 1;
                                $roclass = 'col-lg-4 col-md-4';
                                while( $grid_post->have_posts() ) : $grid_post->the_post();
                                $countrow++;
                                $gdc++;
                                if( $gdc > 6){ $gdc = 1; }

                                if( $settings['news_layout'] == '2' ){
                                    $roclass = 'col-lg-6 col-md-6';
                                }else{
                                    if( $countrow > 3){ $roclass = 'col-lg-6 col-md-6'; }else{ $roclass = $roclass; }
                                }
                            ?>
                                <div class="<?php echo esc_attr( $roclass ); ?> col-12">
                                    <div class="post post-overlay gradient-overlay-<?php echo esc_attr($gdc);?> hero-post">
                                        <div class="post-wrap">
                                            <div class="image"><?php the_post_thumbnail(); ?></div>
                                            <?php
                                                if( $settings['show_category'] == 'yes' ){
                                                    $i=0;
                                                    foreach ( get_the_category() as $category ) {
                                                        $i++;
                                                        $term_link = get_term_link( $category );
                                                        ?>
                                                            <a href="<?php echo esc_url( $term_link ); ?>" class="category <?php echo esc_attr( $category->slug ); ?>"><?php echo esc_attr( $category->name );?></a>
                                                        <?php
                                                        if($i==1){break;}
                                                    }
                                                }
                                            ?>
                                            <div class="content">
                                                <h4 class="title"><a href="<?php the_permalink();?>"><?php echo wp_trim_words( get_the_title(), $settings['title_length'], '' ); ?></a></h4>
                                                <?php if( $settings['show_date'] == 'yes' ): ?>
                                                    <div class="meta fix">
                                                        <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F Y','ht-magazine'));?></span>
                                                    </div>
                                                <?php endif;?>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            <?php endwhile; ?>
                        </div>
                    </div>
                </div>

            </div>

        <?php

    }

}