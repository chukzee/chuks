<?php
/**
 * Displays footer site info
 *
 * @package WordPress
 * @subpackage vancura
 * @since 1.0
 * @version 1.4
 */

?>
<div class="site-info">
	<p><?php echo esc_html(get_theme_mod('vancura_footer_copy',__('Vancura WordPress Theme By','vancura'))); ?> <?php vancura_credit(); ?></p>
</div>