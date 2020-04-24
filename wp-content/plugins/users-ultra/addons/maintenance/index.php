<?php
define('uultra_maintenance_url_lite',plugin_dir_url(__FILE__ ));
define('uultra_maintenance_path_lite',plugin_dir_path(__FILE__ ));

	/* functions */
	foreach (glob(uultra_maintenance_path_lite. 'functions/*.php') as $filename) { require_once $filename; }
	
	/* administration */
	if (is_admin()){
		foreach (glob(uultra_maintenance_path_lite . 'admin/*.php') as $filename) { include $filename; }
	}