<?php

/**
*
* Video popup widget.
*
**/

if ( !class_exists('HTmagazine_Video_Popup') ) {
	class HTmagazine_Video_Popup extends WP_Widget{

		function __construct(){

			$widget_options = array(
				'description' 					=> esc_html__('This widget show video thumbnail and video', 'ht-magazine'), 
				'customize_selective_refresh' 	=> true,
			);

			parent:: __construct('HTmagazine_Video_Popup', esc_html__( 'WPNews: Video PopUp', 'ht-magazine'), $widget_options );

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

			$title = isset( $instance['title'] ) ? $instance['title'] : '';
			$content = isset( $instance['content'] ) ? $instance['content'] : '';
			$bg_image = isset( $instance['bg_image'] ) ? $instance['bg_image'] : '';
			$video_link = isset( $instance['video_link'] ) ? $instance['video_link'] : '';


			?>
			
	        <?php echo $args['before_widget']; 

			if ( !empty( $title ) ) {
			 	echo $args['before_title']; echo esc_html( $title ); echo $args['after_title'];
			 }  ?>

            <div class="sidebar-video">
                <div class="video-img">
					
					<?php if (!empty( $bg_image )): ?>
						<img src="<?php echo esc_url($bg_image); ?>" alt="<?php esc_html_e('video popup bg image', 'ht-magazine') ?>">
					<?php endif ?>
					
					<?php if (!empty($video_link)): ?>
						<a class="video-popup" href="<?php echo esc_url($video_link); ?>">
						    <i class="fa fa-play"></i>
						</a>
					<?php endif ?>
                </div>
                <?php if ( !empty( $content ) ): ?>
                <div class="video-title">
	                <h5><?php echo esc_html( $content ); ?></h5>
                </div>
                <?php endif ?>
            </div>
	        	
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
			$instance['title'] = ( !empty($new_instance['title']) ) ? strip_tags ( $new_instance['title'] ) : '';
			$instance['content'] = ( !empty($new_instance['content']) ) ? strip_tags ( $new_instance['content'] ) : '';
			$instance['bg_image'] = ( !empty($new_instance['bg_image']) ) ? strip_tags ( $new_instance['bg_image'] ) : '';
			$instance['video_link'] = ( !empty($new_instance['video_link']) ) ? strip_tags ( $new_instance['video_link'] ) : '';
			



			if ( current_user_can( 'unfiltered_html' ) ) {
			        $instance['content'] = $new_instance['content'];
			} else {
			        $instance['content'] = wp_kses_post( $new_instance['content'] );
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
			 
			$title = !empty( $instance['title'] ) ? $instance['title'] : ''; 
			$content = !empty( $instance['content'] ) ? $instance['content'] : ''; 
			$bg_image = !empty( $instance['bg_image'] ) ? $instance['bg_image'] : ''; 
			$video_link = !empty( $instance['video_link'] ) ? $instance['video_link'] : ''; 

			?>
			
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php echo esc_html__('Title:' ,'ht-magazine') ?></label>
				<input id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" class="widefat" value="<?php echo esc_html( $title ); ?>">
			</p>
			<div class="image_box_wrap" style="margin:20px 0 15px 0; width: 100%;">
				<button class="button button-primary popup_video_bg_image">
					<?php esc_html_e('Upload Image', 'ht-magazine'); ?>
				</button>
				<div class="image_box widefat">
					<img src="<?php if( !empty($bg_image)){echo esc_html($bg_image);} ?>" style="margin:15px 0 0 0;padding:0;max-width: 100%;display:inline-block; height: auto;" alt="<?php esc_html_e('', 'ht-magazine'); ?>" />
				</div>
				<input type="text" class="widefat bg_image_link" name="<?php echo esc_attr($this->get_field_name('bg_image')); ?>" id="<?php echo esc_attr($this->get_field_id('bg_image')); ?>" value="<?php echo esc_attr($bg_image); ?>" style="margin:15px 0 0 0;">
			</div>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('video_link')); ?>"><?php echo esc_html__('Video Link:' ,'ht-magazine') ?></label>
				<input id="<?php echo esc_attr($this->get_field_id('video_link')); ?>" name="<?php echo esc_attr($this->get_field_name('video_link')); ?>" type="text" class="widefat" value="<?php echo esc_html( $video_link ); ?>">
			</p>
			<p>
				<label for="<?php echo esc_attr($this->get_field_id('content')); ?>"><?php echo esc_html__('Content:' ,'ht-magazine') ?></label>
				<textarea id="<?php echo esc_attr($this->get_field_id('content')); ?>" name="<?php echo esc_attr($this->get_field_name('content')); ?>"  class="widefat" rows="6"><?php echo esc_textarea( $content ); ?></textarea>

			</p>
		<?php }


	} // end extends class
} // end exists class


// Register Author information widget.

function HTmagazine_Video_Popup() {
    register_widget( 'HTmagazine_Video_Popup' );
}
add_action( 'widgets_init', 'HTmagazine_Video_Popup' );