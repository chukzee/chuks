<article> 
	<div <?php post_class(); ?>>                            
		<?php if ( has_post_thumbnail() ) : ?>                                
			<div class="featured-thumbnail zig-style col-md-6"><?php the_post_thumbnail( 'pressnews-home' ); ?></div>                                                           
		<?php endif; ?>
		<div class="home-header col-md-6"> 
			<header>
				<h2 class="page-header">                                
					<a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( sprintf( __( 'Permalink to %s', 'pressnews' ), the_title_attribute( 'echo=0' ) ) ); ?>" rel="bookmark">
						<?php the_title(); ?>
					</a>                            
				</h2> 
				<?php get_template_part( 'template-part', 'postmeta' ); ?>
			</header>                                                      
			<div class="entry-summary">
				<?php the_excerpt(); ?> 
			</div><!-- .entry-summary -->                                                                                                                       
			<div class="clear"></div>                                                            
		</div>                      
	</div>
	<div class="clear"></div>
</article>
<?php if ( $wp_query->current_post == 0 && is_active_sidebar( 'post-area' ) ) { ?>
	<div class="first-textarea">
		<?php dynamic_sidebar( 'post-area' ); ?>
	</div> 
<?php } ?>