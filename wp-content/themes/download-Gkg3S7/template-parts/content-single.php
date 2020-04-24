<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package newsnow
 */	
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header clear">
	
		<div class="entry-category-icon"><?php newsnow_first_category(); ?></div>

		<?php
		if ( is_single() ) :
			the_title( '<h1 class="entry-title">', '</h1>' );
		else :
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;

		if ( 'post' === get_post_type() ) : ?>

		<?php get_template_part( 'template-parts/entry', 'meta' ); ?>

		<?php
		endif; ?>

	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php 
			if ( has_post_thumbnail() && ( get_theme_mod('single-featured-on', false) == true ) ) :
				the_post_thumbnail('single_thumb'); 
			endif;
		?>	
		<?php
			the_content( sprintf(
				/* translators: %s: Name of current post. */
				wp_kses( __( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'newsnow' ), array( 'span' => array( 'class' => array() ) ) ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			) );

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'newsnow' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<span class="entry-tags">

		<?php if (has_tag()) { ?><span class="tag-links"><?php the_tags(' ', ' '); ?></span><?php } ?>
			
		<?php
			edit_post_link(
				sprintf(
					/* translators: %s: Name of current post */
					esc_html__( 'Edit %s', 'newsnow' ),
					the_title( '<span class="screen-reader-text">"', '"</span>', false )
				),
				'<span class="edit-link">',
				'</span>'
			);
		?>
	</span><!-- .entry-tags -->

</article><!-- #post-## -->