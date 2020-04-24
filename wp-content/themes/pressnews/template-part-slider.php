<div id="slider" class="flexslider row slider-loading" >										   
	<ul class="slides">										        									     
		<?php
		$get_featured_posts = new WP_Query( array(
			'posts_per_page' => 5,
			'post_type'		 => 'post',
			'category__in'	 => get_theme_mod( 'featured-categories' )
		) );
		while ( $get_featured_posts->have_posts() ):$get_featured_posts->the_post();
			?>                    	     
			<li>                    	        
				<div class="flex-img col-md-8">                    	           
					<a href="<?php the_permalink(); ?>">                                         
						<?php if ( has_post_thumbnail() ) { ?>        												           
							<div class="featured-thumbnail"><?php the_post_thumbnail( 'pressnews-slider' ); ?></div>      											         
						<?php } else { ?>                                       
							<img src="<?php echo get_template_directory_uri(); ?>/img/noprew-slider.jpg" alt="<?php the_title_attribute(); ?>">       									               
						<?php } ?>                              
					</a>                                                                
				</div>                               
				<div class="flex-caption col-md-4">		                     						         
					<div class="flex-title home-header">                      						                                                                                                     
						<header>
							<h2 class="page-header">                                
								<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>" rel="bookmark">
									<?php the_title(); ?>
								</a>                            
							</h2> 
							<?php get_template_part( 'template-part', 'postmeta' ); ?>
						</header>                                                      
						<div class="entry-summary">
							<?php the_excerpt(); ?>  
						</div><!-- .entry-summary -->                                                                                                                       
						<div class="clear"></div>
						<p class="text-left">                                      
							<a class="btn btn-primary btn-md outline" href="<?php the_permalink(); ?>">
								<?php esc_html_e( 'Read more', 'pressnews' ); ?> 
							</a>                                  
						</p>                                                                                        
					</div>                                  
				</div>                            
			</li>  											     
		<?php endwhile;
		wp_reset_postdata();
		?>  										   
	</ul>									 
</div>
