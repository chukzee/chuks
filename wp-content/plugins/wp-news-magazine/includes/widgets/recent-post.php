<?php 

// register Foo_Widget widget
function register_resent_widget() {
    register_widget( 'HTmagazine_recent_post_Widget' );
}
add_action( 'widgets_init', 'register_resent_widget' );

class HTmagazine_recent_post_Widget extends WP_Widget {
	/**
	 * Register widget with WordPress.
	 */
	function __construct() {
		$widget_ops = array('classname' => 'htmagazine_recent', 'description' => esc_html__('WPNews: Recent Posts Widget','ht-magazine') );
		$control_ops = array('id_base' => 'htmagazine_recent-widget');
		parent::__construct('htmagazine_recent-widget', esc_html__('WPNews: Recent Posts','ht-magazine'), $widget_ops, $control_ops);
	}
	function widget($args, $instance){
		extract($args);
		$title = apply_filters('widget_title', $instance['title']);
		$number = $instance['number'];
		$categories = isset($instance['categories'])?(array)$instance['categories']:array();
		$show_date = isset( $instance['show_date'] ) ? $instance['show_date'] : false;
		$popularnews = isset( $instance['popularnews'] ) ? $instance['popularnews'] : false;
		$num_title_word = ( ! empty( $instance['num_title_word'] ) ) ? absint( $instance['num_title_word'] ) : 6;
		$extclass = $instance['extclasswi'];
		echo $before_widget;

		if($title) {
			echo $before_title.esc_attr( $title ).$after_title;
		}
		
		?>

		<!-- start coding  -->
			<div class="<?php if($extclass != ''){echo $extclass;}?>">
				<?php
				$args = array(
					'post_type' => 'post',
					'posts_per_page' => $number,
					'has_password' => false,
					'order' => 'DESC',
					'tax_query' => array(
                        array(
                            'taxonomy' => 'post_format',
                            'field' => 'slug',
                            'terms' => 'post-format-video',
                            'operator' => 'NOT IN',
                        ),
                    ),
				);
				if( is_array($categories) && count($categories) > 0 ){
					$args['category__in'] = $categories;
				}
				if( $popularnews ) { $args['meta_key'] = 'post_views_count'; }

				$post = new WP_Query($args);
					if($post->have_posts()):
				?>
				<?php while($post->have_posts()): $post->the_post(); ?>

					<div class="footer-widget-post">
                        <div class="post-wrap">
                            <a href="<?php the_permalink(); ?>" class="image">
								<?php
									if ( has_post_thumbnail() ){
										the_post_thumbnail( 'ht-magazine_recent_post_thumb_size' );
									}else{ ?>
										<img src="<?php echo get_template_directory_uri() . '/images/placeholder120x100.png'; ?>" alt="<?php esc_html__('Thumb', 'ht-magazine'); ?>">
									<?php
									}
								?>
                            </a>
                            <div class="content">
                                <h5 class="title"><a href="<?php the_permalink(); ?>"><?php echo wp_trim_words( get_the_title(), $num_title_word,' '); ?></a></h5>
                                <?php if ($show_date): ?>
	                                <div class="meta fix">
	                                    <span class="meta-item date"><i class="fa fa-clock-o"></i><?php the_time(esc_html__('d F, Y','ht-magazine')); ?></span>
	                                </div>
	                            <?php endif;?>
                            </div>
                        </div>
                    </div>

				<?php  endwhile; endif; 
					wp_reset_postdata();
				?>			
			</div>
		<!-- start code here -->

		<?php
		echo $after_widget;
	}

	function update($new_instance, $old_instance){
		$instance = $old_instance;
		$instance['title'] = $new_instance['title'];
		$instance['number'] = $new_instance['number'];
		$instance['categories'] = $new_instance['categories'];
		$instance['show_date'] = isset( $new_instance['show_date'] ) ? (bool) $new_instance['show_date'] : false;
		$instance['popularnews'] = isset( $new_instance['popularnews'] ) ? (bool) $new_instance['popularnews'] : false;
		$instance['num_title_word'] = (int) $new_instance['num_title_word'];
		$instance['extclasswi'] = $new_instance['extclasswi'];
		return $instance;
	}

	function form($instance)
	{
		$defaults = array('title' => 'Recent Posts', 'number' => 3,'extclasswi' => 'Your Class','categories' => array());
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : false;
		$popularnews = isset( $instance['popularnews'] ) ? (bool) $instance['popularnews'] : false;
		$num_title_word    = isset( $instance['num_title_word'] ) ? absint( $instance['num_title_word'] ) : 6;
		$instance = wp_parse_args((array) $instance, $defaults); 
		$categories = $this->get_list_categories(0);
		if( !is_array($instance['categories']) ){
			$instance['categories'] = array();
		}
		
		?>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title','ht-magazine'); ?>:</label>
			<input class="widefat" type="text" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" value="<?php echo esc_attr($instance['title']); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('number')); ?>"><?php esc_html_e('Number of Posts to show','ht-magazine'); ?>:</label>
			<input class="widefat" type="number" id="<?php echo esc_attr($this->get_field_id('number')); ?>" name="<?php echo esc_attr($this->get_field_name('number')); ?>" value="<?php echo esc_attr($instance['number']); ?>" />
		</p>
		<p>
			<label><?php esc_html_e('Select categories', 'ht-magazine'); ?></label>
			<div class="categorydiv">
				<div class="tabs-panel">
					<ul class="categorychecklist">
						<?php foreach($categories as $cat){ ?>
						<li>
							<label>
								<input type="checkbox" name="<?php echo $this->get_field_name('categories'); ?>[<?php esc_attr($cat->term_id); ?>]" value="<?php echo esc_attr($cat->term_id); ?>" <?php echo (in_array($cat->term_id,$instance['categories']))?'checked':''; ?> />
								<?php echo esc_html($cat->name); ?>
							</label>
							<?php $this->get_list_sub_categories($cat->term_id, $instance); ?>
						</li>
						<?php } ?>
					</ul>
				</div>
			</div>
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'num_title_word' )); ?>"><?php echo esc_html__( 'Title Word','ht-magazine' ); ?></label>
			<input class="tiny-text" id="<?php echo esc_attr(esc_attr($this->get_field_id( 'num_title_word' ))); ?>" name="<?php echo esc_attr($this->get_field_name( 'num_title_word' )); ?>" type="number" step="1" min="1" value="<?php echo esc_attr($num_title_word); ?>" size="3">
		</p>
		<p>
			<input class="checkbox" type="checkbox" <?php checked( $show_date ); ?> id="<?php echo esc_attr($this->get_field_id( 'show_date' )); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_date' )); ?>" />
			<label for="<?php echo esc_attr($this->get_field_id( 'show_date' )); ?>"><?php echo esc_html__( 'Display post date?','ht-magazine' ); ?></label>
		</p>
		<p>
			<input class="checkbox" type="checkbox" <?php checked( $popularnews ); ?> id="<?php echo esc_attr($this->get_field_id( 'popularnews' )); ?>" name="<?php echo esc_attr($this->get_field_name( 'popularnews' )); ?>" />
			<label for="<?php echo esc_attr($this->get_field_id( 'popularnews' )); ?>"><?php echo esc_html__( 'Popular News ( If check this box show popular post. )','ht-magazine' ); ?></label>
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id('extclasswi')); ?>"><?php esc_html_e('Widget area class','ht-magazine'); ?>:</label>
			<input class="widefat" type="text" id="<?php echo esc_attr($this->get_field_id('extclasswi')); ?>" name="<?php echo esc_attr($this->get_field_name('extclasswi')); ?>" value="<?php echo esc_attr($instance['extclasswi']); ?>" />
		</p>
	<?php
	}

	function get_list_categories( $cat_parent_id ){
		$args = array(
				'hierarchical'		=> 1
				,'parent'			=> $cat_parent_id
				,'title_li'			=> ''
				,'child_of'			=> 0
			);
		$cats = get_categories($args);
		return $cats;
	}
		
	function get_list_sub_categories( $cat_parent_id, $instance ){
		$sub_categories = $this->get_list_categories($cat_parent_id); 
		if( count($sub_categories) > 0){
		?>
			<ul class="children">
				<?php foreach( $sub_categories as $sub_cat ){ ?>
					<li>
						<label>
							<input type="checkbox" name="<?php echo $this->get_field_name('categories'); ?>[<?php esc_attr($sub_cat->term_id); ?>]" value="<?php echo esc_attr($sub_cat->term_id); ?>" <?php echo (in_array($sub_cat->term_id,$instance['categories']))?'checked':''; ?> />
							<?php echo esc_html($sub_cat->name); ?>
						</label>
						<?php $this->get_list_sub_categories($sub_cat->term_id, $instance); ?>
					</li>
				<?php } ?>
			</ul>
		<?php }
	}
}