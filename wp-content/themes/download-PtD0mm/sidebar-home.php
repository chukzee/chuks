<?php
/**
 * The sidebar containing the main widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package newsnow
 */


?>

<aside id="secondary" class="widget-area sidebar">

<?php if ( is_active_sidebar( 'homepage-sidebar' ) ) { ?>

	<?php dynamic_sidebar( 'homepage-sidebar' ); ?>

<?php } elseif ( is_active_sidebar( 'sidebar-1' ) ) { ?>
	
	<?php dynamic_sidebar( 'sidebar-1' ); ?>

<?php } else { ?>

	<div class="widget">
		<p><?php echo __('Please put widgets to the <strong>Homepage Sidebar</strong>', 'newsnow'); ?></p>
		<p><a href="<?php echo home_url(); ?>/wp-admin/widgets.php"><?php echo __('Okay, I\'m doing now &raquo;', 'newsnow'); ?></a></p>
	</div>

<?php } ?>

</aside><!-- #secondary -->

