<?php

/*
  Plugin Name: Chuks News
  Plugin URI: chuksplugin.org
  Description: This a Chuks News plugin
  Version: 1.0.0
  Author: Chuks
  Author URI: https:chuksalimele
  Text Domain: chuks_news
  GitHub Plugin URI: https://github.com/chuks_news.
 */


class RegisterPostTypes {

    private $post_type_supports = array(
        'title',
        'editor', //(content)
        'author',
        'thumbnail', //(featured image, current theme must also support post-thumbnails)
        'excerpt',
        'trackbacks',
        'custom-fields',
        'comments', //(also will see comment count balloon on edit screen)
        'revisions', //(will store revisions)
        'page-attributes', //(menu order, hierarchical must be true to show Parent option)
        'post-formats'//add post formats, see Post Formats
    );

    function __construct() {
        
    }
    
    function registerAll(){
        add_action('init', array(&$this, 'chuks_news_tws_events_post_type'));
        add_action('init', array(&$this, 'chuks_news_tws_stories_post_type'));        
    }

    public function chuks_news_tws_events_post_type() {
        register_post_type('chuks_news_events', array(
            'supports' => $this->post_type_supports,
            'labels' => array(
                'name' => __('TWS Events'),
                'singular_name' => __('TWS Event'),
            ),
            'public' => true,
            'has_archive' => true,
                )
        );
    }

    public function chuks_news_tws_stories_post_type() {
        register_post_type('chuks_news_stories', array(
            'supports' => $this->post_type_supports,
            'labels' => array(
                'name' => __('TWS Stories'),
                'singular_name' => __('TWS Story'),
            ),
            'public' => true,
            'has_archive' => true,
                )
        );
    }

}

$resgisterPostType = new RegisterPostTypes();
$resgisterPostType->registerAll();
