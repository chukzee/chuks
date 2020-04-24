
<?php include_once get_template_directory() . '/inc/util.php'; ?>


    <div class="navbar navbar-static-top">
        <div class="navigation">
            <nav>
                <?php
                wp_nav_menu(array(
                    'menu' => "top-nav-menu", // (int|string|WP_Term) Desired menu. Accepts a menu ID, slug, name, or object.
                    'menu_class' => "nav topnav", // (string) CSS class to use for the ul element which forms the menu. Default 'menu'.
                    //'menu_id'           => "", // (string) The ID that is applied to the ul element which forms the menu. Default is the menu slug, incremented.
                    'container' => "ul", // (string) Whether to wrap the ul, and what to wrap it with. Default 'div'.
                    //'container_class'   => "", // (string) Class that is applied to the container. Default 'menu-{menu slug}-container'.
                    //'container_id'      => "", // (string) The ID that is applied to the container.
                    //'fallback_cb'       => "", // (callable|bool) If the menu doesn't exists, a callback function will fire. Default is 'wp_page_menu'. Set to false for no fallback.
                    //'before'            => "", // (string) Text before the link markup.
                    //'after'             => "", // (string) Text after the link markup.
                    //'link_before'       => '', // (string) Text before the link text.
                    //'link_after'        => '', // (string) Text after the link text.
                    //'echo'              => "", // (bool) Whether to echo the menu or return it. Default true.
                    'depth' => 0, // (int) How many levels of the hierarchy are to be included. 0 means all. Default 0.
                    'walker' => new Wp_Sublevel_Walker(), // (object) Instance of a custom walker class.
                    'theme_location' => "top-nav-menu", // (string) Theme location to be used. Must be registered with register_nav_menu() in order to be selectable by the user.
                ));

                class Wp_Sublevel_Walker extends Walker_Nav_Menu {

                    function start_lvl(&$output, $depth = 0, $args = array()) {
                        $indent = str_repeat("\t", $depth);
                        $output .= "\n$indent<ul class='dropdown-menu'>\n";
                    }

                    function end_lvl(&$output, $depth = 0, $args = array()) {
                        $indent = str_repeat("\t", $depth);
                        $output .= "$indent</ul>\n";
                    }

                    /**
                     * This method content was directly copied from the parent class method with
                     * slight modification
                     * 
                     * @param type $output
                     * @param type $item
                     * @param type $depth
                     * @param type $args
                     * @param type $id
                     */
                    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
                        if (isset($args->item_spacing) && 'discard' === $args->item_spacing) {
                            $t = '';
                            $n = '';
                        } else {
                            $t = "\t";
                            $n = "\n";
                        }
                        $indent = ( $depth ) ? str_repeat($t, $depth) : '';

                        $classes = empty($item->classes) ? array() : (array) $item->classes;
                        $classes[] = 'menu-item-' . $item->ID;

                        /**
                         * Filters the arguments for a single nav menu item.
                         *
                         * @since 4.4.0
                         *
                         * @param stdClass $args  An object of wp_nav_menu() arguments.
                         * @param WP_Post  $item  Menu item data object.
                         * @param int      $depth Depth of menu item. Used for padding.
                         */
                        $args = apply_filters('nav_menu_item_args', $args, $item, $depth);

                        /**
                         * Filters the CSS classes applied to a menu item's list item element.
                         *
                         * @since 3.0.0
                         * @since 4.1.0 The `$depth` parameter was added.
                         *
                         * @param string[] $classes Array of the CSS classes that are applied to the menu item's `<li>` element.
                         * @param WP_Post  $item    The current menu item.
                         * @param stdClass $args    An object of wp_nav_menu() arguments.
                         * @param int      $depth   Depth of menu item. Used for padding.
                         */
                        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
                        $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';

                        /**
                         * Filters the ID applied to a menu item's list item element.
                         *
                         * @since 3.0.1
                         * @since 4.1.0 The `$depth` parameter was added.
                         *
                         * @param string   $menu_id The ID that is applied to the menu item's `<li>` element.
                         * @param WP_Post  $item    The current menu item.
                         * @param stdClass $args    An object of wp_nav_menu() arguments.
                         * @param int      $depth   Depth of menu item. Used for padding.
                         */
                        $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth);
                        $id = $id ? ' id="' . esc_attr($id) . '"' : '';

                        $output .= $indent . '<li' . $id . $class_names . '>';

                        $atts = array();
                        $atts['title'] = !empty($item->attr_title) ? $item->attr_title : '';
                        $atts['target'] = !empty($item->target) ? $item->target : '';
                        if ('_blank' === $item->target && empty($item->xfn)) {
                            $atts['rel'] = 'noopener noreferrer';
                        } else {
                            $atts['rel'] = $item->xfn;
                        }

                        $atts['href'] = !empty($item->url) ? $item->url : '';
                        $atts['href'] = normalize_href($atts['href']); //added by chuks

                        $atts['aria-current'] = $item->current ? 'page' : '';

                        /**
                         * Filters the HTML attributes applied to a menu item's anchor element.
                         *
                         * @since 3.6.0
                         * @since 4.1.0 The `$depth` parameter was added.
                         *
                         * @param array $atts {
                         *     The HTML attributes applied to the menu item's `<a>` element, empty strings are ignored.
                         *
                         *     @type string $title        Title attribute.
                         *     @type string $target       Target attribute.
                         *     @type string $rel          The rel attribute.
                         *     @type string $href         The href attribute.
                         *     @type string $aria_current The aria-current attribute.
                         * }
                         * @param WP_Post  $item  The current menu item.
                         * @param stdClass $args  An object of wp_nav_menu() arguments.
                         * @param int      $depth Depth of menu item. Used for padding.
                         */
                        $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args, $depth);

                        $attributes = '';
                        foreach ($atts as $attr => $value) {
                            if (is_scalar($value) && '' !== $value && false !== $value) {
                                $value = ( 'href' === $attr ) ? esc_url($value) : esc_attr($value);
                                $attributes .= ' ' . $attr . '="' . $value . '"';
                            }
                        }

                        /** This filter is documented in wp-includes/post-template.php */
                        $title = apply_filters('the_title', $item->title, $item->ID);

                        /**
                         * Filters a menu item's title.
                         *
                         * @since 4.4.0
                         *
                         * @param string   $title The menu item's title.
                         * @param WP_Post  $item  The current menu item.
                         * @param stdClass $args  An object of wp_nav_menu() arguments.
                         * @param int      $depth Depth of menu item. Used for padding.
                         */
                        $title = apply_filters('nav_menu_item_title', $title, $item, $args, $depth);

                        $item_output = $args->before;
                        $item_output .= '<a' . $attributes . '>';
                        $item_output .= $args->link_before . $title . $args->link_after;
                        $item_output .= '</a>';
                        $item_output .= $args->after;

                        /**
                         * Filters a menu item's starting output.
                         *
                         * The menu item's starting output only includes `$args->before`, the opening `<a>`,
                         * the menu item's title, the closing `</a>`, and `$args->after`. Currently, there is
                         * no filter for modifying the opening and closing `<li>` for a menu item.
                         *
                         * @since 3.0.0
                         *
                         * @param string   $item_output The menu item's starting HTML output.
                         * @param WP_Post  $item        Menu item data object.
                         * @param int      $depth       Depth of menu item. Used for padding.
                         * @param stdClass $args        An object of wp_nav_menu() arguments.
                         */
                        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
                    }

                }
                ?>
                
            </nav>



        </div>
        <!-- end navigation -->
    </div>
