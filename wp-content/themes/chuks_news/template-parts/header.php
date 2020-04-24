<!-- start header -->
<header  style="background-image: url(<?php header_image(); ?>)">
    <div class="top">
        <div class="container">
            <div class="row">
                <div class="span6">
                    <!--<p class="topcontact"><i class="icon-phone"></i> +62 088 999 123</p>-->
                </div>
                <div class="span3">

                    <!--<ul class="social-network">
                        <li><a href="#" data-placement="bottom" title="Facebook"><i class="icon-facebook icon-white"></i></a></li>
                        <li><a href="#" data-placement="bottom" title="Twitter"><i class="icon-twitter icon-white"></i></a></li>
                        <li><a href="#" data-placement="bottom" title="Linkedin"><i class="icon-linkedin icon-white"></i></a></li>
                        <li><a href="#" data-placement="bottom" title="Pinterest"><i class="icon-pinterest  icon-white"></i></a></li>
                        <li><a href="#" data-placement="bottom" title="Google +"><i class="icon-google-plus icon-white"></i></a></li>
                        <li><a href="#" data-placement="bottom" title="Dribbble"><i class="icon-dribbble icon-white"></i></a></li>
                    </ul>-->

                    <?php
                    wp_nav_menu(array(
                        'menu' => "social-network-menu", // (int|string|WP_Term) Desired menu. Accepts a menu ID, slug, name, or object.
                        'menu_class' => "social-network", // (string) CSS class to use for the ul element which forms the menu. Default 'menu'.
                        //'menu_id'           => "", // (string) The ID that is applied to the ul element which forms the menu. Default is the menu slug, incremented.
                        'container' => "ul", // (string) Whether to wrap the ul, and what to wrap it with. Default 'div'.
                        //'container_class'   => "", // (string) Class that is applied to the container. Default 'menu-{menu slug}-container'.
                        //'container_id'      => "", // (string) The ID that is applied to the container.
                        //'fallback_cb'       => "", // (callable|bool) If the menu doesn't exists, a callback function will fire. Default is 'wp_page_menu'. Set to false for no fallback.
                        //'before'            => "", // (string) Text before the link markup.
                        //'after'             => "", // (string) Text after the link markup.
                        //'link_before'       => "", // (string) Text before the link text.
                        //'link_after'        => "", // (string) Text after the link text.
                        //'echo'              => "", // (bool) Whether to echo the menu or return it. Default true.
                        'depth' => 0, // (int) How many levels of the hierarchy are to be included. 0 means all. Default 0.
                        //'walker'            => "", // (object) Instance of a custom walker class.
                        'theme_location' => "social-network-menu", // (string) Theme location to be used. Must be registered with register_nav_menu() in order to be selectable by the user.
                    ));
                    ?>

                </div>

                <div class="span3">
                    <?php dynamic_sidebar('search-sidebar'); ?>
                </div>
            </div>
        </div>
    </div>
    <div class="container">

        <div class="row nomargin">
            <div class="span3">
                <div class="logo">
                  <!--<a href="index.html"><img src="<?php echo get_template_directory_uri() ?>/assets/img/logo.png" alt="" /></a>-->

                    <?php
                    $custom_logo_id = get_theme_mod('custom_logo');
                    $logo = wp_get_attachment_image_src($custom_logo_id, 'full');
                    if (has_custom_logo()) {
                        echo '<img src="' . get_template_directory_uri() . '/assets/img/logo.png' . '" alt="' . get_bloginfo('name') . '">';
                    } else {
                        dynamic_sidebar('sidebar-site-title');
                    }
                    ?> 

                </div>
            </div>

            <div class="span6">
                <?php get_template_part('template-parts/header', 'navbar'); ?>
            </div>
            
            <div class="span3">
                <span class="widget" style="display: inline-block; margin: 2px;">
                    <?php dynamic_sidebar('nav-sidebar-1'); ?>                    
                </span>

                <span class="widget" style="display: inline-block;  margin: 2px;">
                    <?php dynamic_sidebar('nav-sidebar-2'); ?>
                </span>
            </div>
        </div>
    </div>
</header>
<!-- end header -->
