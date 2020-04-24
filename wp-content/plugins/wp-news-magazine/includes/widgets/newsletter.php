<?php
/**
 * Adds Newsletter Widget.
 */
 if( !class_exists('HTmagazine_Newsletter_Widget') ){
	class HTmagazine_Newsletter_Widget extends WP_Widget{
		/**
		 * Register widget with WordPress.
		 */
		function __construct(){
			$widget_ops = array( 'description' => esc_html__('WpNews contact for address email and phone no.','ht-magazine'),'customize_selective_refresh' => true, );
			parent:: __construct('HTmagazine_Newsletter_Widget',
				esc_html__('WPNews: Newsletter','ht-magazine'), $widget_ops );
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
			$title    = isset( $instance['title'] ) ? $instance['title'] : 'Contact us';
			$description = isset( $instance['description'] ) ? $instance['description'] : '';
			$shortcode   = isset( $instance['shortcode'] ) ? $instance['shortcode'] : '';
			
			echo $args['before_widget'];
				if(!empty ($title)){ echo $args['before_title']; echo esc_attr( $title ); echo $args['after_title']; }
				?>
					<div class="sidebar-subscribe">
						<?php echo wpautop($description); ?>
						<?php echo do_shortcode($shortcode); ?>
					</div>
				<?php 
			echo $args['after_widget'];
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
		public function update($new_instance,$old_instance){
			$instance = array();  
		$instance['title']    = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['shortcode']    = ( ! empty( $new_instance['shortcode'] ) ) ? strip_tags( $new_instance['shortcode'] ) : '';
			if ( current_user_can( 'unfiltered_html' ) ) {
				$instance['description'] = $new_instance['description'];
			} else {
				$instance['description'] = wp_kses_post( $new_instance['description'] );
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
			$title   = ! empty ( $instance['title'] ) ? $instance['title'] : '';
			$description = !empty($instance['description']) ? $instance['description'] : '';
			$shortcode = !empty($instance['shortcode']) ? $instance['shortcode'] : '';

			?>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id( 'title' ) ); ?>"><?php esc_html_e('Title:', 'ht-magazine');?></label>
				<input type="text" name="<?php echo esc_attr($this->get_field_name( 'title' ) ); ?>" id="<?php echo esc_attr($this->get_field_id( 'title' ) ); ?>" value="<?php echo esc_attr( $title ); ?>" class="widefat" />
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('description')); ?>"><?php esc_html_e('Description:' ,'ht-magazine') ?></label>
				<textarea id="<?php echo esc_attr($this->get_field_id('description')); ?>" name="<?php echo esc_attr($this->get_field_name('description')); ?>" rows="3" class="widefat"><?php echo esc_attr( $description ); ?></textarea>
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('shortcode')); ?>"><?php esc_html_e('Shortcode:' ,'ht-magazine') ?></label>
				<input type="text" id="<?php echo esc_attr($this->get_field_id( 'shortcode' )); ?>" name="<?php echo esc_attr($this->get_field_name( 'shortcode' )); ?>" value="<?php echo esc_attr( $shortcode ); ?>" class="widefat " />
			</p>
			<?php
		}
	}
 }
// register Contact  Widget widget
function HTmagazine_Newsletter_Widget() {
    register_widget( 'HTmagazine_Newsletter_Widget' );
}
add_action( 'widgets_init', 'HTmagazine_Newsletter_Widget' ); 