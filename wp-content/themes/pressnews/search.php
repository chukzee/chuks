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
		<?php
		//if this was a search we display a page header with the results count. If there were no results we display the search form.
		if ( is_search() ) :
			if ( function_exists( 'pressnews_breadcrumb' ) && get_theme_mod( 'breadcrumbs-check', 1 ) != 0 ) {
				pressnews_breadcrumb();
			}
			$total_results = $wp_query->found_posts;

			echo "<h2 class='text-center'>" . sprintf( __( '%s Search Results for "%s"', 'pressnews' ), $total_results, get_search_query() ) . "</h2>";

			if ( $total_results == 0 ) :
				get_search_form( true );
			endif;

		endif;
		?>
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

