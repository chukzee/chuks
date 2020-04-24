<?php

include_once get_template_directory() . '/inc/util.php';

function standard_postformat() {

    $content = '<article>
                    <div class="row">

                        <div class="span8">
                            <div class="post-image">
                                <div class="post-heading">
                                    <h3><a href="#">' . get_the_title() . '</a></h3>
                                </div>' .
            '<a href="' . get_the_permalink() . '" alt="' . the_title_attribute(array('echo' => false)) . '">
                                        ' . get_the_post_thumbnail() . '
                                     </a>    

                            </div>
                            <div class="meta-post">
                                <ul>
                                    <li><i class="icon-file"></i></li>
                                    <li>By <a href="#" class="author">' . get_the_author() . '</a></li>
                                    <li>On <a href="#" class="date">' . get_the_date() . '</a></li>
                                    <li>Tags: <a href="#">Design</a>, <a href="#">' . get_the_tags() . '</a></li>
                                </ul>
                            </div>
                            <div class="post-entry">
                                <p>
                                    ' . get_the_excerpt() . '
                                </p>
                                <a href="' . get_the_permalink() . '" class="readmore">Read more <i class="icon-angle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </article>';

    return $content;
}

function link_postformat() {

    $content = '';

    return $content;
}

function quote_postformat() {

    $content = '';

    return $content;
}

function slider_postformat() {

    $content = '';

    return $content;
}

function video_postformat() {

    $content = '';

    return $content;
}

/*
 * This shortcode is use to display blog content.
 * 
 * the shortcode paramenters are:
 * 
 * post_format - e.g standard, video, link, slider, quote. default is standard
 * posts_per_page - default is 5
 * post_type - default is post
 * 
 * 
 */

function register_chuks_news_blog_content_shortcode($atts, $content = '', $tag = '') {
    $POSTS_PER_PAGE = 5;
    if (isset($atts['posts_per_page']) && $atts['posts_per_page'] >= 0) {
        $POSTS_PER_PAGE = $atts['posts_per_page'];
    }


    $args = array(
        'posts_per_page' => $POSTS_PER_PAGE,
        'post_type' => isset($atts['post_type']) ? $atts['post_type'] : 'post',
    );

    // Variable to call WP_Query. 
    $the_query = new WP_Query($args);

    if ($the_query->have_posts()) :
        // Start the Loop 
        while ($the_query->have_posts()) : $the_query->the_post();
            if (!isset($atts['post_format']) || $atts['post_format'] == '' || $atts['post_format'] == 'standard') {
                $content .= standard_postformat();
            } else if (isset($atts['post_format']) && $atts['post_format'] == 'link') {
                $content .= link_postformat();
            } else if (isset($atts['post_format']) && $atts['post_format'] == 'quote') {
                $content .= quote_postformat();
            } else if (isset($atts['post_format']) && $atts['post_format'] == 'slider') {
                $content .= slider_postformat();
            } else if (isset($atts['post_format']) && $atts['post_format'] == 'video') {
                $content .= video_postformat();
            }
        // End the Loop 
        endwhile;
    else:
    // If no posts match this query, output this text. 
    //_e( 'Sorry, no posts matched your criteria.', 'textdomain' ); 
    endif;

    wp_reset_postdata();

    $content .= '<div id="pagination">
                    <span class="all">Page 1 of 3</span>
                    <span class="current">1</span>
                    <a href="#" class="inactive">2</a>
                    <a href="#" class="inactive">3</a>
                </div>';

    return $content;
}

add_shortcode('chuks_news_blog_content', 'register_chuks_news_blog_content_shortcode');

function register_chuks_news_php_code_shortcode($atts, $content = '', $tag = '') {
  
    ob_start();

    try {
        eval($content);
        $result = ob_get_contents();
    } catch (ParseError $exc) {
        $result = $exc->getTraceAsString();
    }       
     
    ob_end_clean();
    
    return $result;
}

add_shortcode('chuks_news_php_code', 'register_chuks_news_php_code_shortcode');

