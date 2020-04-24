<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package newsnow
 */


/**
 * Get Post Views.
 */
if ( ! function_exists( 'newsnow_get_post_views' ) ) :

function newsnow_get_post_views($postID){
    $count_key = 'post_views_count';
    $count = get_post_meta($postID, $count_key, true);
    if($count==''){
        delete_post_meta($postID, $count_key);
        add_post_meta($postID, $count_key, '0');
        return '<strong class="view-count">0</strong> Views';
    }
    return '<strong class="view-count">' . number_format($count) . '</strong> ' . __('Views', 'newsnow');
}

endif;

/**
 * Set Post Views.
 */
if ( ! function_exists( 'newsnow_set_post_views' ) ) :

function newsnow_set_post_views($postID) {
    $count_key = 'post_views_count';
    $count = get_post_meta($postID, $count_key, true);
    if($count==''){
        $count = 0;
        delete_post_meta($postID, $count_key);
        add_post_meta($postID, $count_key, '0');
    }else{
        $count++;
        update_post_meta($postID, $count_key, $count);
    }
}

endif;

/**
 * Search Filter 
 */
if ( ! function_exists( 'newsnow_search_filter' ) ) :

function newsnow_search_filter($query) {
	if ($query->is_search) {
		$query->set('post_type', 'post');
	}
	return $query;
}

add_filter('pre_get_posts','newsnow_search_filter');

endif;

/**
 * Custom Excerpt
 */
if ( ! function_exists( 'newsnow_custom_excerpt' ) ) :

function newsnow_custom_excerpt($limit) {

    $excerpt = explode(' ', get_the_excerpt(), $limit);

    if (count($excerpt)>=$limit) {
        array_pop($excerpt);
        $excerpt = implode(" ",$excerpt).'...';
    } else {

    $excerpt = implode(" ",$excerpt);

    }
    $excerpt = preg_replace('`[[^]]*]`','',$excerpt);
    return $excerpt;
}
endif;

/**
 * Add custom meta box.
 */
if ( ! function_exists( 'newsnow_add_custom_meta_box' ) ) :

function newsnow_add_custom_meta_box()
{
    add_meta_box("demo-meta-box", "Post Options", "newsnow_custom_meta_box_markup", "post", "side", "high", null);
}

add_action("add_meta_boxes", "newsnow_add_custom_meta_box");

endif;
/**
 * Displaying fields in a custom meta box.
 */
if ( ! function_exists( 'newsnow_custom_meta_box_markup' ) ) :

function newsnow_custom_meta_box_markup($object)
{
    wp_nonce_field(basename(__FILE__), "meta-box-nonce");

    ?>
        <div>
            <label for="is_featured"><?php echo __('Featured this post on homepage', 'newsnow'); ?> </label>
            <?php
                $checkbox_value = get_post_meta($object->ID, "is_featured", true);

                if($checkbox_value == "")
                {
                    ?>
                        <input name="is_featured" type="checkbox" value="true">
                    <?php
                }
                else if($checkbox_value == "true")
                {
                    ?>  
                        <input name="is_featured" type="checkbox" value="true" checked>
                    <?php
                }
            ?>
        </div>
    <?php  
}

endif;

/**
 * Storing Meta Data.
 */
if ( ! function_exists( 'newsnow_save_custom_meta_box' ) ) :

function newsnow_save_custom_meta_box($post_id, $post, $update)
{
    if (!isset($_POST["meta-box-nonce"]) || !wp_verify_nonce($_POST["meta-box-nonce"], basename(__FILE__)))
        return $post_id;

    if(!current_user_can("edit_post", $post_id))
        return $post_id;

    if(defined("DOING_AUTOSAVE") && DOING_AUTOSAVE)
        return $post_id;

    $slug = "post";
    if($slug != $post->post_type)
        return $post_id;

    $meta_box_text_value = "";
    $meta_box_textarea_value = "";
    $meta_box_checkbox_value = "";

    if(isset($_POST["is_featured"]))
    {
        $meta_box_checkbox_value = $_POST["is_featured"];
    }   
    update_post_meta($post_id, "is_featured", $meta_box_checkbox_value);
}

add_action("save_post", "newsnow_save_custom_meta_box", 10, 3);

endif;

/**
 * Display the first (single) category of post.
 */
if ( ! function_exists( 'newsnow_first_category' ) ) :
function newsnow_first_category() {
    $category = get_the_category();
    if ($category) {
      echo '<a href="' . get_category_link( $category[0]->term_id ) . '" title="' . sprintf( __( "View all posts in %s", 'newsnow' ), $category[0]->name ) . '" ' . '>' . $category[0]->name.'</a> ';
    }    
}
endif;

/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
if ( ! function_exists( 'newsnow_categorized_blog' ) ) :

function newsnow_categorized_blog() {
    if ( false === ( $all_the_cool_cats = get_transient( 'newsnow_categories' ) ) ) {
        // Create an array of all the categories that are attached to posts.
        $all_the_cool_cats = get_categories( array(
            'fields'     => 'ids',
            'hide_empty' => 1,
            // We only need to know if there is more than one category.
            'number'     => 2,
        ) );

        // Count the number of categories that are attached to the posts.
        $all_the_cool_cats = count( $all_the_cool_cats );

        set_transient( 'newsnow_categories', $all_the_cool_cats );
    }

    if ( $all_the_cool_cats > 1 ) {
        // This blog has more than 1 category so newsnow_categorized_blog should return true.
        return true;
    } else {
        // This blog has only 1 category so newsnow_categorized_blog should return false.
        return false;
    }
}

endif;

/**
 * Flush out the transients used in newsnow_categorized_blog.
 */
if ( ! function_exists( 'newsnow_category_transient_flusher' ) ) :

function newsnow_category_transient_flusher() {
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    // Like, beat it. Dig?
    delete_transient( 'newsnow_categories' );
}
add_action( 'edit_category', 'newsnow_category_transient_flusher' );
add_action( 'save_post',     'newsnow_category_transient_flusher' );

endif;

/**
 * Disable specified widgets.
 */
/**
 * Enqueues scripts and styles.
 */
if ( ! function_exists( 'newsnow_disable_specified_widgets' ) ) :

function newsnow_disable_specified_widgets( $sidebars_widgets ) {

    if ( isset($sidebars_widgets['homepage']) ) {
        if ( is_home() && is_array($sidebars_widgets['homepage']) ) {
            foreach($sidebars_widgets['homepage'] as $i => $widget) {
                if( (strpos($widget, 'happythemes-home') === false) ) {
                    unset($sidebars_widgets['homepage'][$i]);
                }
            }
        }
    }

    if ( isset($sidebars_widgets['homepage-sidebar']) ) {
        if ( is_array($sidebars_widgets['homepage-sidebar']) ) {
            foreach($sidebars_widgets['homepage-sidebar'] as $i => $widget) {
                if(strpos($widget, 'happythemes-home-') !== false) {
                    unset($sidebars_widgets['homepage-sidebar'][$i]);
                }
            }
        }   
    }

    if ( isset($sidebars_widgets['sidebar-1']) ) {
        if ( is_array($sidebars_widgets['sidebar-1']) ) {
            foreach($sidebars_widgets['sidebar-1'] as $i => $widget) {
                if(strpos($widget, 'happythemes-home-') !== false) {
                    unset($sidebars_widgets['sidebar-1'][$i]);
                }
            }
        }    
    }

    if ( isset($sidebars_widgets['footer-1']) ) {
        if ( is_array($sidebars_widgets['footer-1']) ) {
            foreach($sidebars_widgets['footer-1'] as $i => $widget) {
                if(strpos($widget, 'happythemes-home-') !== false) {
                    unset($sidebars_widgets['footer-1'][$i]);
                }
            }
        } 
    }

    if ( isset($sidebars_widgets['footer-2']) ) {
        if ( is_array($sidebars_widgets['footer-2']) ) {
            foreach($sidebars_widgets['footer-2'] as $i => $widget) {
                if(strpos($widget, 'happythemes-home-') !== false) {
                    unset($sidebars_widgets['footer-2'][$i]);
                }
            }
        }   
    }

    if ( isset($sidebars_widgets['footer-3']) ) {
        if ( is_array($sidebars_widgets['footer-3']) ) {
            foreach($sidebars_widgets['footer-3'] as $i => $widget) {
                if(strpos($widget, 'happythemes-home-') !== false) {
                    unset($sidebars_widgets['footer-3'][$i]);
                }
            }
        }   
    }

    if ( isset($sidebars_widgets['footer-4']) ) {
        if ( is_array($sidebars_widgets['footer-4']) ) {
            foreach($sidebars_widgets['footer-4'] as $i => $widget) {
                if(strpos($widget, 'happythemes-home-') !== false) {
                    unset($sidebars_widgets['footer-4'][$i]);
                }
            }
        }                      
    }
    return $sidebars_widgets;
}
add_filter( 'sidebars_widgets', 'newsnow_disable_specified_widgets' );

endif;

/** 
 * Create a new page on theme activation.
 */
if (isset($_GET['activated']) && is_admin()){
    add_action('init', 'newsnow_create_initial_pages');
}

if ( ! function_exists( 'newsnow_create_initial_pages' ) ) :

function newsnow_create_initial_pages() {

    $pages = array( 
         // Page Title and URL (a blank space will end up becomeing a dash "-")
    //   'All Categories' => array(
    //      // Page Content           // Template to use (if left blank the default template will be used)
    //     'Browse our latest videos by category' => 'page-templates/all-categories.php'),

        'Latest' => array(
            'Browse our latest posts' => 'page-templates/all-posts.php'),

    );

    foreach($pages as $page_url_title => $page_meta) {

        $id = get_page_by_title($page_url_title);

        foreach ($page_meta as $page_content=>$page_template){

            $page = array(
                'post_type'   => 'page',
                'post_title'  => $page_url_title,
                'post_name'   => $page_url_title,
                'post_status' => 'publish',
                'post_content' => $page_content,
                'post_author' => 1,
                'post_parent' => ''
            );

            if(!isset($id->ID)){
                $new_page_id = wp_insert_post($page);
                if(!empty($page_template)){
                    update_post_meta($new_page_id, '_wp_page_template', $page_template);
                }
            }
        }
    }
}

endif;

/**
 * Add link to Admin Bar.
 */

if ( ! function_exists( 'newsnow_custom_toolbar_link' ) ) :

function newsnow_custom_toolbar_link($wp_admin_bar) {
    $args = array(
        'id' => 'happythemes',
        'title' => 'Upgrade to Pro Theme', 
        'href' => 'https://www.happythemes.com/wordpress-themes/newsnow/', 
        'meta' => array(
            'class' => 'happythemes', 
            'title' => '',
            'target'=> '_blank',
            )
    );
    $wp_admin_bar->add_node($args);
}
add_action('admin_bar_menu', 'newsnow_custom_toolbar_link', 999);

endif;

