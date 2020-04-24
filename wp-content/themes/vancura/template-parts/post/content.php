<?php
/**
 * Template part for displaying posts
 * @package WordPress
 * @subpackage vancura
 * @since 1.0
 * @version 1.4
 */

?>

<div id="post-<?php the_ID(); ?>" <?php post_class('inner-service'); ?>>
  <div class="article_content">
    <div class="metabox"> 
      <span class="entry-author"><a href="<?php echo esc_url( get_permalink() );?>"><i class="fas fa-user"></i><?php the_author(); ?></a></span>
      <span class="entry-date"><i class="fas fa-calendar-alt"></i><?php echo esc_html( get_the_date()); ?></span>
      <span class="entry-comments"><a href="<?php echo esc_url( get_permalink() );?>"><i class="fas fa-comments"></i><?php comments_number( __('0 Comments','vancura'), __('0 Comments','vancura'), __('% Comments','vancura') ); ?></a></span>
    </div>
    <?php if(has_post_thumbnail()) { ?>
      <?php the_post_thumbnail(); ?>  
    <?php }?>
    <h3><?php the_title(); ?></h3>
    <p><?php the_excerpt(); ?></p>
    <div class="read-btn">
      <a href="<?php the_permalink();?>" title="<?php esc_attr_e( 'READ MORE', 'vancura' ); ?>"><?php esc_html_e('READ MORE','vancura'); ?><span class="screen-reader-text"><?php the_title(); ?></span></a>
    </div>
    <div class="clearfix"></div> 
  </div>
</div>