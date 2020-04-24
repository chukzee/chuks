<?php
/**
 * Template Name: Custom Home
 */

get_header(); ?>

<main id="wp-toolbar" role="main">
	<?php do_action( 'vancura_above_slider' ); ?>

	<?php if( get_theme_mod('vancura_slider_hide_show') != ''){ ?>
		<section id="slider">
		  	<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"> 
			    <?php $slider_pages = array();
			    $slider =  get_theme_mod('vancura_slider_number');
			      	for ( $count = 1; $count <= $slider; $count++ ) {
				        $mod = intval( get_theme_mod( 'vancura_slider' . $count ));
				        if ( 'page-none-selected' != $mod ) {
				          $slider_pages[] = $mod;
				        }
			      	}
			      	if( !empty($slider_pages) ) :
			        $args = array(
			          	'post_type' => 'page',
			          	'post__in' => $slider_pages,
			          	'orderby' => 'post__in'
			        );
			        $query = new WP_Query( $args );
			        if ( $query->have_posts() ) :
			          $i = 1;
			    ?>     
			    <div class="carousel-inner" role="listbox">
			      	<?php  while ( $query->have_posts() ) : $query->the_post(); ?>
			        <div <?php if($i == 1){echo 'class="carousel-item active"';} else{ echo 'class="carousel-item"';}?>>
			          	<a href="<?php echo esc_url( get_permalink() );?>"><img src="<?php the_post_thumbnail_url('full'); ?>"/></a>
			          	<div class="carousel-caption">
				            <div class="inner_carousel">
				              	<h2><?php the_title();?></h2>
				              	<p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,15 ) ); ?></p>
				            </div>
				            <div class="read-btn">
			            		<a href="<?php the_permalink();?>"><?php esc_html_e('EXPLORE MORE','vancura'); ?><i class="fas fa-arrow-right"></i><span class="screen-reader-text"><?php the_title(); ?></span></a>
					       	</div>
			          	</div>
			        </div>
			      	<?php $i++; endwhile; 
			      	wp_reset_postdata();?>
			    </div>
			    <?php else : ?>
			    <div class="no-postfound"></div>
			      <?php endif;
			    endif;?>
			    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
		      		<span class="carousel-control-prev-icon" aria-hidden="true"><i class="fas fa-chevron-left"></i></span>
		      		<span class="screen-reader-text"><?php esc_attr_e( 'Previous','vancura' );?></span>
			    </a>
			    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
		      		<span class="carousel-control-next-icon" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
		      		<span class="screen-reader-text"><?php esc_attr_e( 'Next','vancura' );?></span>
			    </a>
		  	</div>  
		  	<div class="clearfix"></div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_slider'); ?>

	<?php /*--Our Services Section --*/?>
	<?php if( get_theme_mod('vancura_service_cat1') != '' || get_theme_mod('vancura_title_page') != '' || get_theme_mod('vancura_service_cat2') != '' ){ ?>
		<section id="our_service">
			<div class="container">
				<div class="service-box">
		            <div class="row">
	          			<div class="col-lg-4 col-md-4">
				      		<?php $catData1=  get_theme_mod('vancura_service_cat1'); 
							if($catData1){ 
								$args = array(
									'post_type' => 'post',
									'category_name' => esc_html($catData1 ,'vancura'),
						          'posts_per_page' => get_theme_mod('vancura_service_number')
						        );
						        $i=1;
				      		$page_query = new WP_Query( $args);?>
			        		<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
								<div class="service-cat1">	
			        				<div class="row">
							      		<div class="col-lg-9 col-md-8">
									      	<h4><a href="<?php the_permalink();?>"><?php the_title();?></a></h4>
									      	<p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,10 ) ); ?></p>
			          					</div>
				        				<div class="col-lg-3 col-md-4">
								      		<?php the_post_thumbnail(); ?>
								      	</div>
								    </div>
		          				</div>
				          		<?php $i++; endwhile; 
				          	wp_reset_postdata();
				          	}?>
				        </div>
			          	<div class="col-lg-4 col-md-4">
							<?php 
					        $service_pages = array();
						        $mod = intval( get_theme_mod( 'vancura_title_page' ));
						        if ( 'page-none-selected' != $mod ) {
						          $service_pages[] = $mod;
						        }
						      	if( !empty($service_pages) ) :
						        $args = array(
						          	'post_type' => 'page',
						          	'post__in' => $service_pages,
						          	'orderby' => 'post__in'
						        );
						        $query = new WP_Query( $args );
						        if ( $query->have_posts() ) :
						          $i = 1;
						     
					            while ( $query->have_posts() ) : $query->the_post(); ?>
					            	<div class="service-headpage">
						            	<h3><a href="<?php the_permalink();?>"><?php the_title();?></a></h3>
						            	<div class="service-img">
							            	<?php if(has_post_thumbnail()) { ?>
							            		<?php the_post_thumbnail(); ?>
							            	<?php } ?>
							            </div>
						            </div>
					            <?php endwhile;  
					            wp_reset_postdata();?>
						    <?php else : ?>
						    <div class="no-postfound"></div>
						      <?php endif;
						    endif;?>  
					    </div>
			          	<div class="col-lg-4 col-md-4">
			          		<?php $catData1=  get_theme_mod('vancura_service_cat2'); 
							if($catData1){ 
								$args = array(
									'post_type' => 'post',
									'category_name' => esc_html($catData1 ,'vancura'),
						          'posts_per_page' => get_theme_mod('vancura_service_number')
						        );
						        $i=1;
				      		$page_query = new WP_Query($args);?>
				        		<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>	
				        			<div class="service-cat2">
								      	<div class="row">
					        				<div class="col-lg-3 col-md-4">
									      		<?php the_post_thumbnail(); ?>
									      	</div>
									      	<div class="col-lg-9 col-md-8">
										      	<h4><a href="<?php the_permalink();?>"><?php the_title();?></a></h4>
										      	<p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,10 ) ); ?></p>
					          				</div>
				          				</div>
				          			</div>
				          		<?php $i++; endwhile; 
				          	wp_reset_postdata();
				          	}?>
			          	</div>
		      		</div>
				</div>
				<div class="clearfix"></div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_service_section'); ?>

	<?php /*-- About Us --*/?>
	<?php if( get_theme_mod('vancura_about_title') != '' || get_theme_mod( 'vancura_about_page' )!= ''){ ?>
		<section id="aboutus">
			<div class="container">
		        <?php 
		        $about_pages = array();
			        $mod = intval( get_theme_mod( 'vancura_about_page' ));
			        if ( 'page-none-selected' != $mod ) {
			          $about_pages[] = $mod;
			        }
			      	if( !empty($about_pages) ) :
			        $args = array(
			          	'post_type' => 'page',
			          	'post__in' => $about_pages,
			          	'orderby' => 'post__in'
			        );
			        $query = new WP_Query( $args );
			        if ( $query->have_posts() ) :
			          $i = 1;
			     
		            while ( $query->have_posts() ) : $query->the_post(); ?>
			            <div class="row">
			                <div class="col-lg-6 col-md-6">
						        <?php if( get_theme_mod('vancura_about_title') != ''){ ?>
						        	<h3><?php echo esc_html(get_theme_mod('vancura_about_title','')); ?></h3>
						        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img" alt="<?php the_title(); ?> post thumbnail image">
						        <?php }?>
				                <div class="text-aboutus">
				                    <h4><?php the_title(); ?></h4>
				                    <p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,30 ) ); ?></p>
				                    <div class="read-btn">
					            		<a href="<?php the_permalink();?>" class="" title="<?php esc_attr_e( 'EXPLORE MORE', 'vancura' ); ?>"><?php esc_html_e('EXPLORE MORE','vancura'); ?><i class="fas fa-arrow-right"></i></a>
							       	</div>
				                </div>
			                </div>
			              	<div class="col-lg-6 col-md-6">
			                 	<div class="img-about"><?php if(has_post_thumbnail()) { ?><?php the_post_thumbnail(); ?><?php } ?></div>
			                </div>
			            </div>
		            <?php endwhile;  
		            wp_reset_postdata();?>
			    <?php else : ?>
			    <div class="no-postfound"></div>
			      <?php endif;
			    endif;?>  
		    </div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_about_section'); ?>

	<?php /*--- Our Steps ---*/ ?>
	<?php if( get_theme_mod('vancura_steps_title') != '' || get_theme_mod( 'vancura_steps_cat' )!= '' || get_theme_mod( 'vancura_steps_subline' )!= ''){ ?>
		<section id="oursteps">
			<div class="container">
				<div class="step-head">
					<?php if( get_theme_mod('vancura_steps_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_steps_title','')); ?></h3>
			        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img" alt="<?php esc_attr_e( 'Border Image','vancura' );?>">
			        <?php }?>
			        <?php if( get_theme_mod('vancura_steps_subline') != ''){ ?>
			        	<p><?php echo esc_html(get_theme_mod('vancura_steps_subline','')); ?></p>
			        <?php }?>
			    </div>
				<div class="row">
					<?php $catData1=  get_theme_mod('vancura_steps_cat'); 
					if($catData1){ 
			  			$args = array(
							'post_type' => 'post',
							'category_name' => esc_html($catData1 ,'vancura'),
				            'posts_per_page' => get_theme_mod('vancura_steps_number')
				        );
				        $i=1;
		      		$page_query = new WP_Query($args);?>
					<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
						<div class="col-lg-6 col-md-6 steps">
							<div class="row">
								<div class="col-lg-3 col-md-12">
									<p class="stepsno"><?php echo esc_html($i); ?></p>
								</div>
								<div class="col-lg-9 col-md-12">
									<div class="steps-box">
								      	<h4><a href="<?php the_permalink();?>"><?php the_title();?></a></h4>
								      	<p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,20 ) ); ?></p>
								    </div>	
								</div>
							</div>	
						</div>
			  		<?php $i++; endwhile; 
			      	wp_reset_postdata();
			      	}?>
		        </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_steps_section'); ?>

	<?php /*--- Counter Section ---*/ ?>
	<?php if( get_theme_mod('vancura_counter_title') != '' || get_theme_mod( 'vancura_counter_subline' )!= '' || get_theme_mod('vancura_counter_count '. $i) != '' || get_theme_mod('vancura_counter_name '. $i) != ''){ ?>
		<section id="counter">
			<div class="container">
				<div class="counter-head">
					<?php if( get_theme_mod('vancura_counter_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_counter_title','')); ?></h3>
			        <?php }?>
			        <?php if( get_theme_mod('vancura_counter_subline') != ''){ ?>
			        	<p><?php echo esc_html(get_theme_mod('vancura_counter_subline','')); ?></p>
			        <?php }?>
			    </div>
				<div class="row">
					<?php $j=get_theme_mod('vancura_counter_number');
					for($i=1; $i<=$j; $i++) { ?>
						<div class="col-lg-3 col-md-3">
							<?php if( get_theme_mod('vancura_counter_count '. $i) != ''){ ?>
					        	<h4><?php echo esc_html(get_theme_mod('vancura_counter_count '. $i,'')); ?></h4>
					        <?php }?>
					        <?php if( get_theme_mod('vancura_counter_name '. $i) != ''){ ?>
					        	<p><?php echo esc_html(get_theme_mod('vancura_counter_name '. $i,'')); ?></p>
					        <?php }?>
						</div>
					<?php }?>
		        </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_counter_section'); ?>

	<?php /*--- Our Team ---*/ ?>
	<?php if( get_theme_mod('vancura_team_title') != '' || get_theme_mod( 'vancura_team_cat' )!= '' || get_theme_mod( 'vancura_team_subline' )!= ''){ ?>
		<section id="ourteam">
			<div class="container">
				<div class="team-head">
					<?php if( get_theme_mod('vancura_team_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_team_title','')); ?></h3>
			        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img" alt="<?php esc_attr_e( 'Border Image','vancura' );?>">
			        <?php }?>
			        <?php if( get_theme_mod('vancura_team_subline') != ''){ ?>
			        	<p><?php echo esc_html(get_theme_mod('vancura_team_subline','')); ?></p>
			        <?php }?>
			    </div>
				<div class="row">
					<?php $catData1=  get_theme_mod('vancura_team_cat'); 
					if($catData1){ 
			  			$args = array(
							'post_type' => 'post',
							'category_name' => esc_html($catData1 ,'vancura'),
				            'posts_per_page' => get_theme_mod('vancura_team_number')
				        );
				        $i=1;
		      		$page_query = new WP_Query($args);?>
					<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
						<div class="col-lg-3 col-md-6 team">
							<div class="team-box">
								<div class="teambox-img">
									<?php if(has_post_thumbnail()) { ?><?php the_post_thumbnail(); ?>
									<?php } ?>
								</div>
						      	<h4><a href="<?php the_permalink();?>"><?php the_title();?></a></h4>
						    </div>	
						</div>
			  		<?php $i++; endwhile; 
			      	wp_reset_postdata();
			      	}?>
		        </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_team_section'); ?>

	<?php /*--- Our Facilities ---*/ ?>
	<?php if( get_theme_mod('vancura_facilities_title') != '' || get_theme_mod( 'vancura_facilities_cat' )!= '' || get_theme_mod( 'vancura_facilities_subline' )!= ''){ ?>
		<section id="ourfacilities">
			<div class="container">
				<div class="facilities-head">
					<?php if( get_theme_mod('vancura_facilities_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_facilities_title','')); ?></h3>
			        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img" alt="<?php esc_attr_e( 'Border Image','vancura' );?>">
			        <?php }?>
			        <?php if( get_theme_mod('vancura_facilities_subline') != ''){ ?>
			        	<p><?php echo esc_html(get_theme_mod('vancura_facilities_subline','')); ?></p>
			        <?php }?>
			    </div>
				<div class="row">
					<?php $catData1=  get_theme_mod('vancura_facilities_cat'); 
					if($catData1){ 
			  			$args = array(
							'post_type' => 'post',
							'category_name' => esc_html($catData1 ,'vancura'),
				            'posts_per_page' => get_theme_mod('vancura_facilities_number')
				        );
				        $i=1;
		      		$page_query = new WP_Query($args);?>
					<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
						<div class="col-lg-2 col-md-3 col-sm-4 facilities">
							<div class="facilities-box">
								<div class="facilitiesbox-img">
									<?php if(has_post_thumbnail()) { ?>
										<?php the_post_thumbnail(); ?>
									<?php } ?>
								</div>
						      	<h4><a href="<?php the_permalink();?>"><?php the_title();?></a></h4>
						    </div>	
						</div>
			  		<?php $i++; endwhile; 
			      	wp_reset_postdata();
			      	}?>
		        </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_facilities_section'); ?>

	<?php /*--- Recent Projects ---*/ ?>
	<?php if( get_theme_mod('vancura_projects_title') != '' || get_theme_mod( 'vancura_projects_cat' )!= '' || get_theme_mod( 'vancura_projects_subline' )!= ''){ ?>
		<section id="projects">
			<div class="container">
				<div class="projects-head">
					<?php if( get_theme_mod('vancura_projects_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_projects_title','')); ?></h3>
			        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img" alt="<?php esc_attr_e( 'Border Image','vancura' );?>" >
			        <?php }?>
			        <?php if( get_theme_mod('vancura_projects_subline') != ''){ ?>
			        	<p><?php echo esc_html(get_theme_mod('vancura_projects_subline','')); ?></p>
			        <?php }?>
			    </div>
				<div class="row">
					<?php $catData1=  get_theme_mod('vancura_projects_cat'); 
					if($catData1){ 
			  			$args = array(
							'post_type' => 'post',
							'category_name' => esc_html($catData1 ,'vancura'),
				            'posts_per_page' => get_theme_mod('vancura_projects_number')
				        );
				        $i=1;
		      		$page_query = new WP_Query($args);?>
					<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
						<div class="col-lg-4 col-md-4 projects">
							<div class="projects-box">
								<div class="read-btn">
				            		<a href="<?php the_permalink();?>" ><i class="fas fa-plus"></i><span class="screen-reader-text"><?php the_title(); ?></span></a>
						       	</div>
								<div class="projectsbox-img">
									<?php if(has_post_thumbnail()) { ?>
										<?php the_post_thumbnail(); ?>
									<?php } ?>
								</div>
								<div class="projects-content">
							      	<h4><?php the_title();?></h4>
							      	<p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,5 ) ); ?></p>
							    </div>
						    </div>	
						</div>
			  		<?php $i++; endwhile; 
			      	wp_reset_postdata();
			      	}?>
		        </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_recent_projects_section'); ?>

	<?php /*--- Testimonial Section ---*/ ?>
	<?php if( get_theme_mod('vancura_testimonials_title') != '' || get_theme_mod( 'vancura_testimonials_cat' )!= '' || get_theme_mod( 'vancura_testimonials_subline' )!= ''){ ?>
		<section id="testimonials">
			<div class="container">
				<div class="testimonials-head">
					<?php if( get_theme_mod('vancura_testimonials_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_testimonials_title','')); ?></h3>
			        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img"  alt="<?php esc_attr_e( 'Border Image','vancura' );?>">
			        <?php }?>
			    </div>
				<div class="row owl-carousel m-0">
					<?php $catData1=  get_theme_mod('vancura_testimonials_cat'); 
					if($catData1){ 
			  			$args = array(
							'post_type' => 'post',
							'category_name' => esc_html($catData1 ,'vancura'),
				            'posts_per_page' => get_theme_mod('vancura_testimonials_number')
				        );
				        $i=1;
		      		$page_query = new WP_Query($args);?>
					<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
						<div class="testimonials">
							<div class="icon-test">
								<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/testimonial-icon.png');?>" class="testimonial-img" alt="<?php esc_attr_e( 'Icon Image','vancura' );?>">
							</div>
							<p><?php $excerpt = get_the_excerpt(); echo esc_html( vancura_string_limit_words( $excerpt,20 ) ); ?></p>
							<div class="row testimonials-box">
								<div class="col-lg-3 col-md-4">
									<div class="testimonialsbox-img">
										<?php if(has_post_thumbnail()) { ?>
											<?php the_post_thumbnail(); ?>
										<?php } ?>
									</div>
								</div>
								<div class="col-lg-9 col-md-8">
									<div class="testimonial-content">
								      	<h4><a href="<?php the_permalink();?>"><?php the_title();?><span class="screen-reader-text"><?php the_title(); ?></span></a></h4>
									</div>
								</div>
						    </div>	
						</div>
			  		<?php $i++; endwhile; 
			      	wp_reset_postdata();
			      	}?>
		        </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_testimonial_section'); ?>

	<?php /*--- Our Clients Section ---*/ ?>
	<?php if( get_theme_mod('vancura_clients_title') != '' || get_theme_mod( 'vancura_clients_cat' )!= '' || get_theme_mod( 'vancura_clients_subline' )!= ''){ ?>
		<section id="ourclients">
			<div class="container">
				<div class="row m-0">
					<div class="col-lg-4 col-md-12">
						<div class="clients-head">
							<?php if( get_theme_mod('vancura_clients_title') != ''){ ?>
					        	<h3><?php echo esc_html(get_theme_mod('vancura_clients_title','')); ?></h3>
					        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img">
					        <?php }?>
					        <?php if( get_theme_mod('vancura_clients_subline') != ''){ ?>
					        	<p><?php echo esc_html(get_theme_mod('vancura_clients_subline','')); ?></p>
					        <?php }?>
					    </div>
					</div>
					<div class="col-lg-8 col-md-12 owl-carousel">
						<?php $catData1=  get_theme_mod('vancura_clients_cat'); 
						if($catData1){ 
				  			$args = array(
								'post_type' => 'post',
								'category_name' => esc_html($catData1 ,'vancura'),
					            'posts_per_page' => get_theme_mod('vancura_clients_number')
					        );
					        $i=1;
			      		$page_query = new WP_Query($args);?>
						<?php while( $page_query->have_posts() ) : $page_query->the_post(); ?>
							<div class="clientsbox-img">
								<?php if(has_post_thumbnail()) { ?>
									<a href="<?php the_permalink();?>" ><?php the_post_thumbnail(); ?><span class="screen-reader-text"><?php the_title(); ?></span></a>
								<?php } ?>
							</div>
				  		<?php $i++; endwhile; 
				      	wp_reset_postdata();
				      	}?>
			        </div>
			    </div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_clients_section'); ?>

	<?php /*--- Contact Section ---*/ ?>
	<?php if( get_theme_mod('vancura_address') != '' || get_theme_mod( 'vancura_email_address' )!= '' || get_theme_mod( 'vancura_phone_number' )!= '' || get_theme_mod( 'vancura_facebook_url' )!= '' || get_theme_mod( 'vancura_twitter_url' )!= '' || get_theme_mod( 'vancura_rss_url' )!= '' || get_theme_mod( 'vancura_google_plus_url' )!= '' || get_theme_mod( 'vancura_linkedin_url' )!= '' || get_theme_mod( 'vancura_youtube_url' )!= ''){ ?>
		<section id="contact-section">
			<div class="row m-0">
				<div class="col-lg-3 col-md-6 contacts">
					<?php if( get_theme_mod( 'vancura_address') != '') { ?>
						<i class="fas fa-map-marker-alt"></i>
						<h5><?php echo esc_html( get_theme_mod( 'vancura_address','' ) ); ?></h5>
					<?php }?>
				</div>
				<div class="col-lg-3 col-md-6 contacts">
					<?php if( get_theme_mod( 'vancura_email_address') != '') { ?>
						<i class="fas fa-envelope"></i>
						<h5><?php echo esc_html( get_theme_mod( 'vancura_email_address','' ) ); ?></h5>
					<?php }?>
				</div>
				<div class="col-lg-3 col-md-6 contacts">
					<?php if( get_theme_mod( 'vancura_phone_number') != '') { ?>
						<i class="fas fa-phone"></i>
						<h5><?php echo esc_html( get_theme_mod( 'vancura_phone_number','' ) ); ?></h5>
					<?php }?>
				</div>
				<div class="col-lg-3 col-md-6 social-details">
					<?php if( get_theme_mod( 'vancura_facebook_url') != '') { ?>
			      		<a href="<?php echo esc_url( get_theme_mod( 'vancura_facebook_url','' ) ); ?>"><i class="fab fa-facebook-f" aria-hidden="true"></i><span class="screen-reader-text"><?php esc_attr_e( 'Facebook','vancura' );?></span></a>
				    <?php } ?>
				    <?php if( get_theme_mod( 'vancura_twitter_url') != '') { ?>
				      	<a href="<?php echo esc_url( get_theme_mod( 'vancura_twitter_url','' ) ); ?>"><i class="fab fa-twitter"></i><span class="screen-reader-text"><?php esc_attr_e( 'Twitter','vancura' );?></span></a>
				    <?php } ?>
				    <?php if( get_theme_mod( 'vancura_google_plus_url') != '') { ?>
				      	<a href="<?php echo esc_url( get_theme_mod( 'vancura_google_plus_url','' ) ); ?>"><i class="fab fa-google-plus-g"></i><span class="screen-reader-text"><?php esc_attr_e( 'Google','vancura' );?></span></a>
				    <?php } ?>
				    <?php if( get_theme_mod( 'vancura_linkedin_url') != '') { ?>
			     		<a href="<?php echo esc_url( get_theme_mod( 'vancura_linkedin_url','' ) ); ?>"><i class="fab fa-linkedin-in"></i><span class="screen-reader-text"><?php esc_attr_e( 'Linkedin','vancura' );?></span></a>
				    <?php } ?>	 
				    <?php if( get_theme_mod( 'vancura_rss_url') != '') { ?>
				      	<a href="<?php echo esc_url( get_theme_mod( 'vancura_rss_url','' ) ); ?>"><i class="fas fa-rss"></i><span class="screen-reader-text"><?php esc_attr_e( 'RSS','vancura' );?></span></a>
				    <?php } ?>
				    <?php if( get_theme_mod( 'vancura_youtube_url') != '') { ?>
				      	<a href="<?php echo esc_url( get_theme_mod( 'vancura_youtube_url','' ) ); ?>"><i class="fab fa-youtube"></i><span class="screen-reader-text"><?php esc_attr_e( 'Youtube','vancura' );?></span></a>
				    <?php } ?>
				</div>
			</div>
		</section>
	<?php }?>

	<?php do_action('vancura_below_contact_section'); ?>

	<?php /*--- Latest Posts ---*/ ?>
		<section id="latest-post">
			<div class="container">
				<div class="post-head">
					<?php if( get_theme_mod('vancura_latest_posts_title') != ''){ ?>
			        	<h3><?php echo esc_html(get_theme_mod('vancura_latest_posts_title','')); ?></h3>
			        	<img src="<?php echo esc_html(get_template_directory_uri() . '/assets/images/border.png');?>" class="border-img" alt="<?php esc_attr_e( 'Border Image','vancura' );?>">
			        <?php }?>
			    </div>
			    <div class="row">
			    	<?php
			    	$args = array(
							'post_type' => 'post',
							'posts_per_page' => '2');
			    	$i=1;
		      		$page_query = new WP_Query($args);
					while ( $page_query->have_posts() ) : $page_query->the_post(); ?>
						<div class="col-lg-4 col-md-4">
							<div class="post-box">
								<?php if(has_post_thumbnail()) { ?>
							      <?php the_post_thumbnail(); ?>  
							    <?php }?>
							    <div class="post-content">
								    <p class="cat"><?php foreach((get_the_category()) as $category) { echo esc_html($category->cat_name) . ' '; } ?></p>
								    <h4><?php the_title(); ?></h4>
								    <p><?php the_excerpt(); ?></p>
								</div>
							    <div class="read-more">
							    	<span class="entry-date"><i class="fas fa-calendar-alt"></i><?php echo esc_html( get_the_date()); ?></span>
							        <a href="<?php the_permalink();?>" title="<?php esc_attr_e( 'READ MORE', 'vancura' ); ?>"><?php esc_html_e('READ MORE','vancura'); ?></a>
							    </div>
							</div>
						</div>
					<?php $i++; endwhile; ?>
				</div>
			    <?php if ( get_theme_mod('vancura_latest_posts_btn_text','') != "" || get_theme_mod('vancura_latest_posts_btn_link','') != "" ) {?>
				    <div class="read-btn">            
				    	<a href="<?php echo esc_url( get_theme_mod('vancura_latest_posts_btn_link','') ); ?>"><?php echo esc_html( get_theme_mod('vancura_latest_posts_btn_text','') ); ?><i class="fas fa-arrow-right"></i></a>
				    </div> 
				<?php }?>
			</div>
		</section>

	<div class="container">
	  	<?php while ( have_posts() ) : the_post(); ?>
	        <?php the_content(); ?>
	    <?php endwhile; // end of the loop. ?>
	</div>
</main>

<?php get_footer(); ?>