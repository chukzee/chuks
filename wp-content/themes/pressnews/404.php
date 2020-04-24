<?php get_header(); ?>

<?php get_template_part( 'template-part', 'head' ); ?>

<?php get_template_part( 'template-part', 'topnav' ); ?>

<!-- start content container -->
<div class="row rsrc-content">

	<?php //left sidebar ?>
	<?php get_sidebar( 'left' ); ?>

	<div class="col-md-<?php pressnews_main_content_width(); ?> rsrc-main">
		<h2><?php esc_html_e( 'Sorry This Page Does Not Exist!', 'pressnews' ); ?></h2>
	</div>

	<?php //get the right sidebar ?>
	<?php get_sidebar( 'right' ); ?>

</div>
<!-- end content container -->

<?php get_footer(); ?>