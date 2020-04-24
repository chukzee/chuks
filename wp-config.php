<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'transparencywatch' );

/** MySQL database username */
define( 'DB_USER', 'chukzee' );

/** MySQL database password */
define( 'DB_PASSWORD', 'kachukwu' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Zd:QumD=,$qcvxBAVuF^s5qEhn1Uw%_}1&{(MfaJ)J!S*6eRlF99_9&!n_QEeReZ' );
define( 'SECURE_AUTH_KEY',  'l3_VQ-:JE>tgmghSB2,z!gSpb38=xqN$Q7Vz9J=(PruG2ciK.G>BBq[J|mE4P[N>' );
define( 'LOGGED_IN_KEY',    'h)prjU~xe?aOxU?0~<u-YW7p2Wj!:V=A:J(x?qW]yFc3B[/~=fwpL8U2gcZ1fuOJ' );
define( 'NONCE_KEY',        's?+(B!u6r)eJ/|ku}ClP)dtz5`}[@W!!#dK ??qs)>;(#r#E/lcH}af@po_Sxu?|' );
define( 'AUTH_SALT',        'TL6>RI^v*|dU;W.z)m2o/XYatfgtX^&gf3`<sW:1|J===9Vtn#);a/elnD(n;?`4' );
define( 'SECURE_AUTH_SALT', 'akI~fN9!60xVl L|cr:/,lo3C3dcFm_XUh|.QpE)9qP~n.=F.8m844m[z&DQDJHy' );
define( 'LOGGED_IN_SALT',   '8{4PygJ)6B~Jt`d!dH`Y}Mj5Kcc_dTgY9X*`B80`L~5VoN-<~c9GyY3@AbN6!*$.' );
define( 'NONCE_SALT',       'g#jU-3~_FbdOSVvl=m}Xy>c0}4:f~%a?8[m/ST<9>9rev(.R+Y`<TI[QMY34L7^h' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', true );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
