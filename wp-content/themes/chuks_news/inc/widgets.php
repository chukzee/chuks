<?php

require get_template_directory() . '/inc/widgets/footer_widget.php';
require get_template_directory() . '/inc/widgets/carousel_widget.php';

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function chuks_news_widgets_init() {

    register_sidebar(
            array(
                'name' => __('Site Title', 'chuks_news'),
                'id' => 'sidebar-site-title',
                'description' => __('Add site title html. Be sure to remove site logo for this title to show', 'chuks_news'),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => '',
            )
    );
    
    register_sidebar(
            array(
                'name' => __('Nav Sidebar 1', 'chuks_news'),
                'id' => 'nav-sidebar-1',
                'description' => __('Add append sidebar to header navbar', 'chuks_news'),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => '',
            )
    );
    
    register_sidebar(
            array(
                'name' => __('Nav Sidebar 2', 'chuks_news'),
                'id' => 'nav-sidebar-2',
                'description' => __('Add append sidebar to header navbar', 'chuks_news'),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => '',
            )
    );
    
    register_sidebar(
            array(
                'name' => __('Carousel Widget Area', 'chuks_news'),
                'id' => 'carousel-sidebar',
                'description' => __('Add carousel widget here.', 'chuks_news'),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => '',
            )
    );
    
    register_sidebar(
            array(
                'name' => __('Footer Widget Area', 'chuks_news'),
                'id' => 'footer-sidebar',
                'description' => __('Add widgets here to appear in your footer.', 'chuks_news'),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => '',
            )
    );
    register_sidebar(
            array(
                'name' => __('Header Search', 'chuks_news'),
                'id' => 'search-sidebar',
                'description' => __('Add search widget here.', 'chuks_news'),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => '',
            )
    );
    register_sidebar(
                array(
                    'name' => __("Popular Post Area", 'chuks_news'),
                    'id' => "sidebar-single-popular-posts",
                    'description' => __('Add widget for popular posts.', 'chuks_news'),
                    'before_widget' => '',
                    'after_widget' => '',
                    'before_title' => '',
                    'after_title' => '',
                )
        );
    register_sidebar(
                array(
                    'name' => __("Recent Posts Area", 'chuks_news'),
                    'id' => "sidebar-single-recent-posts",
                    'description' => __('Add widget for recent posts.', 'chuks_news'),
                    'before_widget' => '',
                    'after_widget' => '',
                    'before_title' => '',
                    'after_title' => '',
                )
        );
    
    //register sidebars for single post pages
    for ($i = 1; $i < 5; $i++) {
        register_sidebar(
                array(
                    'name' => __("Sidebar Single $i", 'chuks_news'),
                    'id' => "sidebar-single-$i",
                    'description' => __('Add widget here.', 'chuks_news'),
                    'before_widget' => '',
                    'after_widget' => '',
                    'before_title' => '',
                    'after_title' => '',
                )
        );
    }
}

add_action('widgets_init', 'chuks_news_widgets_init');


