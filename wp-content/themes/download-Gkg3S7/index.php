<?php get_header(); ?>

	<div id="primary" class="content-area clear">

		<?php if (get_theme_mod('top-section-on', 'true') == true ) { ?>

		<div id="home-welcome" class="clear">

		<div id="featured-content">

		<?php		

			$args = array(
			'post_type'      => 'post',
			'posts_per_page' => 4,
		    'meta_query' => array(
		        array(
		            'key'   => 'is_featured',
		            'value' => 'true'
		        	)
		    	)				
			);

			// The Query
			$the_query = new WP_Query( $args );

			$i = 1;

			if ( $the_query->have_posts() && (!get_query_var('paged')) ) {	

		?>
			

			<?php
				// The Loop
				while ( $the_query->have_posts() ) : $the_query->the_post();
			?>	


			<?php if ($i <= 1) { ?>

			<?php if ($i == 1) { ?>
				<ul class="bxslider">
			<?php } ?>

			<li class="featured-slide hentry">

					<a class="thumbnail-link" href="<?php the_permalink(); ?>">

						<span class="gradient"></span>
						
						<div class="thumbnail-wrap">
							<?php 
							if ( has_post_thumbnail() ) {
								the_post_thumbnail('featured_large_thumb');  
							} else {
								echo '<img src="' . get_template_directory_uri() . '/assets/img/no-featured.png" alt="" />';
							}
							?>
						</div><!-- .thumbnail-wrap -->
					</a>

				<div class="entry-header clear">
					<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				</div><!-- .entry-header -->

			</li><!-- .featured-slide .hentry -->

			<?php

				if ( ( ( $i == $the_query->post_count ) && ( $the_query->post_count <= 1 ) ) || ( ( $i == 1 )  && ( $the_query->post_count > 1 ) ) ) {

			?>

				</ul><!-- .bxslider -->

			<?php } ?>
			

			<?php } else { ?>

			<div class="featured-square hentry <?php echo( $the_query->current_post + 1 === $the_query->post_count ) ? 'last' : ''; ?>">

				<?php if ( has_post_thumbnail() ) { ?>
					<a class="thumbnail-link" href="<?php the_permalink(); ?>">
						<div class="thumbnail-wrap">
							<?php 
								the_post_thumbnail('post_thumb');  
							?>
						</div><!-- .thumbnail-wrap -->
					</a>
				<?php } ?>

				<div class="entry-header">
					<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				</div><!-- .entry-header -->

			</div><!-- .hentry -->


			<?php

				}
				$i++;
				endwhile;
			?>
			<?php
				} elseif  ( !$the_query->have_posts() && (!get_query_var('paged')) ) { // else has no featured posts
			?>
				<div class="notice">
					<p><?php echo __('Please edit posts and set "Featured Posts" for this section.', 'newsnow'); ?></p>
					<p><a href="<?php echo home_url(); ?>/wp-admin/edit.php"><?php echo __('Okay, I\'m doing now &raquo;', 'newsnow'); ?></a> | <a href="<?php echo get_template_directory_uri(); ?>/assets/img/how-to-featured.png" target="_blank"><?php echo __('How To &raquo;', 'newsnow'); ?></a></p>
				</div>

			<?php
				} //end if has featured posts
				wp_reset_postdata();				
			?>

				<div class="ribbon"><span><?php echo esc_html('Featured', 'newsnow-pro'); ?></span></div>

			</div><!-- #featured-content -->

		<?php		

			$args = array(
			'post_type'      => 'post',
			'posts_per_page' => get_theme_mod('latest-posts-num', '5')+1			
			);

			// The Query
			$the_query = new WP_Query( $args );

			$i = 1;

			if ( $the_query->have_posts() && (!get_query_var('paged')) ) :	

		?>

			<div id="latest-content">
				<h3><?php esc_html_e('Latest News', 'newsnow'); ?></h3>

					<?php
						// The Loop
						while ( $the_query->have_posts() ) : $the_query->the_post();

					?>	

					<div class="latest-square hentry <?php echo( $the_query->current_post + 1 === $the_query->post_count ) ? 'last' : ''; ?>">

						<div class="entry-header clear">
							<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
						</div><!-- .entry-header -->

					</div><!-- .hentry -->

					<?php
						$i++;
						endwhile;
					?>

					<div class="more-button">
						<a class="btn" href="<?php echo get_theme_mod('all-posts-url', home_url() . '/latest/'); ?>"><?php esc_html_e('View More News', 'newsnow'); ?></a>
					</div>

			</div><!-- #latest-content -->

		<?php
			endif;
			wp_reset_postdata();
		?>					

		</div><!-- #home-welcome -->

		<?php } //end if display top content ?>

		<main id="main" class="site-main clear">

			<div id="recent-content">

			<?php if ( is_active_sidebar( 'homepage' ) ) { ?>

				<?php dynamic_sidebar( 'homepage' ); ?>

			<?php } else { ?>

				<div class="notice">
					<p><?php echo __('Put the "Home One Column" widgets to the <strong>Homepage Content</strong> widget area.', 'newsnow'); ?></p>
					<p><a href="<?php echo home_url(); ?>/wp-admin/widgets.php"><?php echo __('Okay, I\'m doing now &raquo;', 'newsnow'); ?></a>  | <a href="<?php echo get_template_directory_uri(); ?>/assets/img/how-to-home-widgets.png" target="_blank"><?php echo __('How To &raquo;', 'newsnow'); ?></a></p>
				</div>

			<?php } ?>							
			
			</div><!-- #recent-content -->		

		</main><!-- .site-main -->

	</div><!-- #primary -->

<?php get_template_part('sidebar', 'home'); ?>
<?php get_footer(); ?>
