<?php 
/**
 * Adds short description Widget.
 */
 if( !class_exists('HTmagazine_description_Widget') ){
	class HTmagazine_description_Widget extends WP_Widget{
		/**
		 * Register widget with WordPress.
		 */
		function __construct(){
			$widget_ops = array( 'description' => esc_html__('Our short description .','ht-magazine'),'customize_selective_refresh' => true, );
			parent:: __construct('HTmagazine_description_Widget', esc_html__('WPNews: Short Description','ht-magazine'),$widget_ops );
		}
		/**
		 * Front-end display of widget.
		 *
		 * @see WP_Widget::widget()
		 *
		 * @param array $args     Widget arguments.
		 * @param array $instance Saved values from database.
		 */
		public function widget($args, $instance){
            $title   = isset( $instance['title'] ) ? $instance['title'] : '';
			$image   = isset( $instance['image'] ) ? $instance['image'] : '';
			$text = isset( $instance['text'] ) ? $instance['text'] : '';
			$facebook   = isset( $instance['facebook'] ) ? $instance['facebook'] : '';
			$google   = isset( $instance['google'] ) ? $instance['google'] : '';
			$twitter   = isset( $instance['twitter'] ) ? $instance['twitter'] : '';
			$dribbble   = isset( $instance['dribbble'] ) ? $instance['dribbble'] : '';
			$linked   = isset( $instance['linked'] ) ? $instance['linked'] : '';

            $title = apply_filters('widget_title', $instance['title']);
			?>
			<?php echo $args['before_widget']; 
                if($title) {
					echo '<h4 class="widget-title">'.$title.'</h4>';
				}
            ?>
				<div class="single_footer">
				    <?php if($image !=''):?>
					<div class="footer-logo">
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-footer"><img src="<?php echo esc_url( $image ) ; ?>
						" alt="<?php echo esc_attr('Footer logo'); ?>"></a>
					</div>
					<?php endif;?>
					<div class="content fix">                                     
					    <?php echo wpautop($text); ?>
					    <div class="footer-social">
					    	<?php if( $facebook ):?>
							<a class="facebook" href="<?php echo esc_url( $facebook ); ?>" title="Facebook"><i class="fa fa-facebook"></i></a>
							<?php endif; if( $google ): ?>
								<a class="google-plus" href="<?php echo esc_url( $google ); ?>" title="Google Plus"><i class="fa fa-google-plus"></i></a>
							<?php endif; if( $twitter ): ?>
								<a class="twitter" href="<?php echo esc_url( $twitter ); ?>" title="Twitter"><i class="fa fa-twitter"></i></a>
							<?php endif; if( $dribbble ): ?>
								<a class="dribbble" href="<?php echo esc_url( $dribbble ); ?>" title="dribbble"><i class="fa fa-dribbble"></i></a>
							<?php endif; if( $linked ): ?>
								<a class="facebook" href="<?php echo esc_url( $linked ); ?>" title="Linkedin"><i class="fa fa-linkedin"></i></a>
							<?php endif; ?>
					    </div>
					</div>

				</div>
			<?php echo $args['after_widget']; ?>

			<?php
		}
		/**
		 * Sanitize widget form values as they are saved.
		 *
		 * @see WP_Widget::update()
		 *
		 * @param array $new_instance Values just sent to be saved.
		 * @param array $old_instance Previously saved values from database.
		 *
		 * @return array Updated safe values to be saved.
		 */

		public function update($new_instance, $old_instance){
		    $instace = array();
            $instance['title']   	= ( !empty( $new_instance['title'] ) ) ? strip_tags ( $new_instance['title'] ) : '';
		    $instance['image']   = ( !empty( $new_instance['image'] ) ) ? strip_tags ( $new_instance['image'] ) : '';
		    $instance['facebook']   = ( !empty($new_instance['facebook']) ) ? strip_tags ( $new_instance['facebook'] ) : '';
		    $instance['google']   = ( !empty($new_instance['google']) ) ? strip_tags ( $new_instance['google'] ) : '';
		    $instance['twitter']   = ( !empty($new_instance['twitter']) ) ? strip_tags ( $new_instance['twitter'] ) : '';
		    $instance['dribbble']   = ( !empty($new_instance['dribbble']) ) ? strip_tags ( $new_instance['dribbble'] ) : '';
		    $instance['linked']   = ( !empty($new_instance['linked']) ) ? strip_tags ( $new_instance['linked'] ) : '';

		    if ( current_user_can( 'unfiltered_html' ) ) {
		        $instance['text'] = $new_instance['text'];
		    } else {
		        $instance['text'] = wp_kses_post( $new_instance['text'] );
		    }

		    return $instance;
		}

		/**
		 * Back-end widget form.
		 *
		 * @see WP_Widget::form()
		 *
		 * @param array $instance Previously saved values from database.
		 */
		public function form($instance){
            $title 		 = !empty($instance['title']) ? $instance['title'] : '';
			$image 		 = !empty($instance['image']) ? $instance['image'] : '';
			$text = !empty($instance['text']) ? $instance['text'] : '';
			$facebook = !empty($instance['facebook']) ? $instance['facebook'] : '';
			$google = !empty($instance['google']) ? $instance['google'] : '';
			$twitter = !empty($instance['twitter']) ? $instance['twitter'] : '';
			$dribbble = !empty($instance['dribbble']) ? $instance['dribbble'] : '';
			$linked = !empty($instance['linked']) ? $instance['linked'] : '';
				
		?>
		
		    <p>
				<label for="<?php echo esc_attr($this->get_field_id('title')); ?>">
					<?php esc_html_e('Title:','ht-magazine'); ?>
				</label>
				<input class="widefat" type="text" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" value="<?php echo esc_attr($title); ?>" />
			</p>
		
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('image')); ?>"><?php echo esc_html__('Upload Image:','ht-magazine');?></label>
					<?php if(!empty($image)) :?>
						<img class="custom_media_image" src="<?php echo esc_html($image);?>" style="margin:0;padding:0;max-width:100px;display:inline-block" />
					<?php endif;?>
					<input type="text" class="widefat custom_media_url" name="<?php echo esc_attr($this->get_field_name('image')); ?>" id="<?php echo esc_attr($this->get_field_id('image')); ?>" value="<?php echo esc_attr($image); ?>">
					<a href="#" id="custom_media_button" style="margin-top:10px;" class="button button-primary custom_media_button"><?php esc_html_e('Upload', 'ht-magazine'); ?></a>
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('text')); ?>"><?php echo esc_html__('Content:' ,'ht-magazine') ?></label>
				<textarea id="<?php echo esc_attr($this->get_field_id('text')); ?>" name="<?php echo esc_attr($this->get_field_name('text')); ?>" rows="15" class="widefat"><?php echo esc_textarea( $text ); ?></textarea>
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('facebook')); ?>"><?php echo esc_html__('Facebook Link:' ,'ht-magazine') ?></label>
				<input type="text" id="<?php echo esc_attr($this->get_field_id('facebook')); ?>" class="widefat" name="<?php echo esc_attr($this->get_field_name('facebook')); ?>" value="<?php echo esc_attr( $facebook ); ?>" />
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('google')); ?>"><?php echo esc_html__('Google Plus Link:' ,'ht-magazine') ?></label>
				<input type="text" id="<?php echo esc_attr($this->get_field_id('google')); ?>" class="widefat" name="<?php echo esc_attr($this->get_field_name('google')); ?>" value="<?php echo esc_attr( $google ); ?>" />
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('twitter')); ?>"><?php echo esc_html__('Twitter Link:' ,'ht-magazine') ?></label>
				<input type="text" id="<?php echo esc_attr($this->get_field_id('twitter')); ?>" class="widefat" name="<?php echo esc_attr($this->get_field_name('twitter')); ?>" value="<?php echo esc_attr( $twitter ); ?>" />
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('dribbble')); ?>"><?php echo esc_html__('Dribbble Link:' ,'ht-magazine') ?></label>
				<input type="text" id="<?php echo esc_attr($this->get_field_id('dribbble')); ?>" class="widefat" name="<?php echo esc_attr($this->get_field_name('dribbble')); ?>" value="<?php echo esc_attr( $dribbble ); ?>" />
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('linked')); ?>"><?php echo esc_html__('Linkedin Link:' ,'ht-magazine') ?></label>
				<input type="text" id="<?php echo esc_attr($this->get_field_id('linked')); ?>" class="widefat" name="<?php echo esc_attr($this->get_field_name('linked')); ?>" value="<?php echo esc_attr( $linked ); ?>" />
			</p>
			
		<?php
		}
	}
}
// register Short description widget
function HTmagazine_description_Widget() {
    register_widget( 'HTmagazine_description_Widget' );
}
add_action( 'widgets_init', 'HTmagazine_description_Widget' );