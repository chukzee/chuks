<?php if ( has_nav_menu( 'main_menu' ) ) : ?>
	<div class="row rsrc-top-menu" >
		<nav id="site-navigation" class="navbar navbar-inverse" role="navigation">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-1-collapse">
					<span class="sr-only"><?php esc_html_e( 'Toggle navigation', 'pressnews' ); ?></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
			</div>              
			<?php
			wp_nav_menu( array(
				'theme_location'	 => 'main_menu',
				'depth'				 => 3,
				'container'			 => 'div',
				'container_class'	 => 'collapse navbar-collapse navbar-1-collapse',
				'menu_class'		 => 'nav navbar-nav',
				'fallback_cb'		 => 'wp_bootstrap_navwalker::fallback',
				'walker'			 => new wp_bootstrap_navwalker() )
			);
			?>
		</nav>
	</div>
<?php endif; ?>
