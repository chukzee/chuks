<?php get_header(); ?>

<?php get_template_part( 'template-part', 'head' ); ?>

<?php get_template_part( 'template-part', 'topnav' ); ?>

<?php //slider section ?>
<?php if ( get_theme_mod( 'featured-categories', '' ) != '' && get_theme_mod( 'get-featured', '0' ) != '0' ) : ?>
	<?php get_template_part( 'template-part', 'slider' ); ?>
<?php endif; ?>

<!-- start content container -->
<div class="row rsrc-content">

	<?php //left sidebar ?>
	<?php get_sidebar( 'left' ); ?>


    <div class="col-md-<?php pressnews_main_content_width(); ?> rsrc-main">
		<?php if ( is_active_sidebar( 'front_page_content_top_section' ) ) { ?>
			<div id="content-top-section" class="clearfix">
				<?php
				// Calling the header sidebar if it exists.
				if ( !dynamic_sidebar( 'front_page_content_top_section' ) ):
				endif;
				?>
			</div>
		<?php } ?>

		<?php
		// theloop
		if ( have_posts() ) : while ( have_posts() ) : the_post();

				/* Include the Post-Format-specific template for the content.
				 * If you want to overload this in a child theme then include a file
				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
				 */
				get_template_part( 'content', get_post_format() );

			endwhile;

			the_posts_pagination();

		else:

			get_404_template();

		endif;
		?>

	</div>

	<?php //get the right sidebar  ?>
	<?php get_sidebar( 'right' ); ?>

</div>
<!-- end content container -->



<?php get_footer(); ?>

