<?php

/**
*
* Single Banner widget.
*
**/

if ( !class_exists('HTmagazine_Single_Banner') ) {
	class HTmagazine_Single_Banner extends WP_Widget{

		function __construct(){
			$widget_options = array(
				'description' 					=> esc_html__('This widget show banner', 'ht-magazine'), 
				'customize_selective_refresh' 	=> true,
			);
			parent:: __construct('HTmagazine_Single_Banner', esc_html__( 'WPNews: Banner', 'ht-magazine'), $widget_options );

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
			$image = isset( $instance['image'] ) ? $instance['image'] : '';
			$title = isset( $instance['title'] ) ? $instance['title'] : '';
			$banner_link = isset( $instance['banner_link'] ) ? $instance['banner_link'] : '';


			?>
			
	        <?php echo $args['before_widget']; 
		        if ( !empty( $title ) ) {
				 	echo $args['before_title']; echo esc_html( $title ); echo $args['after_title'];
				}  
				if ( !empty($image) ): ?>
        			<div class="sidebar-banner">
        				<?php if ($banner_link): ?><a href="<?php echo esc_url( $banner_link ); ?>"> <?php endif ?><img src="<?php echo esc_url( $image ) ; ?>" alt="<?php esc_html_e('Banner Image', 'ht-magazine'); ?>"><?php if ($banner_link): ?>
        					</a>
        				<?php endif ?>
        			</div>
        		<?php endif ?>
	        <?php echo $args['after_widget']; ?>

		<?php }


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
			$instance['image'] = ( !empty($new_instance['image']) ) ? strip_tags ( $new_instance['image'] ) : '';
			$instance['title'] = ( !empty($new_instance['title']) ) ? strip_tags ( $new_instance['title'] ) : '';
			$instance['banner_link'] = ( !empty($new_instance['banner_link']) ) ? strip_tags ( $new_instance['banner_link'] ) : '';
			

			if ( current_user_can( 'unfiltered_html' ) ) {
			        $instance['title'] = $new_instance['title'];
			} else {
			        $instance['title'] = wp_kses_post( $new_instance['title'] );
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
			
			$image = !empty( $instance['image'] ) ? $instance['image'] : ''; 
			$title = !empty( $instance['title'] ) ? $instance['title'] : ''; 
			$banner_link = !empty( $instance['banner_link'] ) ? $instance['banner_link'] : ''; 

			?>

			<p>
				<label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php echo esc_html__('Title:' ,'ht-magazine') ?></label>
				<input id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" class="widefat" value="<?php echo esc_textarea( $title ); ?>">
			</p>
			<div class="image_box_wrap" style="margin:20px 0 15px 0; width: 100%;">
				<button class="button button-primary author_info_image">
					<?php esc_html_e('Upload Image', 'ht-magazine'); ?>
				</button>
				<div class="image_box widefat">
					<img src="<?php if( !empty($image)){echo esc_html($image);} ?>" style="margin:15px 0 0 0;padding:0;max-width: 100%;display:inline-block; height: auto;" alt="<?php esc_html_e('', 'ht-magazine'); ?>" />
				</div>
				<input type="text" class="widefat image_link" name="<?php echo esc_attr($this->get_field_name('image')); ?>" id="<?php echo esc_attr($this->get_field_id('image')); ?>" value="<?php echo esc_attr($image); ?>" style="margin:15px 0 0 0;">
			</div>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('banner_link')); ?>"><?php echo esc_html__('Banner Link:' ,'ht-magazine') ?></label>
				<input id="<?php echo esc_attr($this->get_field_id('banner_link')); ?>" name="<?php echo esc_attr($this->get_field_name('banner_link')); ?>" type="text" class="widefat" value="<?php echo esc_textarea( $banner_link ); ?>">
			</p>

		<?php }

	} // end extends class
} // end exists class


// Register Author information widget.

function HTmagazine_Single_Banner() {
    register_widget( 'HTmagazine_Single_Banner' );
}
add_action( 'widgets_init', 'HTmagazine_Single_Banner' );