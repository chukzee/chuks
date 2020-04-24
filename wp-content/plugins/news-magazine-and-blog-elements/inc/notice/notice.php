<?php
/**
 * newsbd24 Admin Class.
 *
 * @author  eDataStyle
 * @package newsbd24
 * @since   1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATA_News_Admin' ) ) :

/**
 * ATA_News_Admin Class.
 */
class ATA_News_Admin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		
		add_action( 'wp_loaded', array( __CLASS__, 'hide_notices' ) );
		add_action( 'admin_notices', array( $this, 'welcome_notice' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
	}


	/**
	 * Add admin notice.
	 */
	public function enqueue_styles() {
		
		wp_enqueue_style( 'ata-pro-message', ATA_VAR_URL . '/inc/notice/message.css', array(), '1.0' );

		
	}

	/**
	 * Hide a notice if the GET variable is set.
	 */
	public static function hide_notices() {
		if ( isset( $_GET['ata-news-hide-notice'] ) && isset( $_GET['_ata_news_notice_nonce'] ) ) {
			if ( ! wp_verify_nonce( wp_unslash($_GET['_ata_news_notice_nonce']), 'ata_news_hide_notices_nonce' ) ) {
				/* translators: %s: plugin name. */
				wp_die( esc_html__( 'Action failed. Please refresh the page and retry.', 'newsbd24' ) );
			}

			if ( ! current_user_can( 'manage_options' ) ) 
			/* translators: %s: plugin name. */{
				wp_die( esc_html__( 'Cheatin&#8217; huh?', 'newsbd24' ) );
			}

			$hide_notice = sanitize_text_field( wp_unslash( $_GET['newsbd24-hide-notice'] ) );
			update_option( 'ata_news_admin_notice_' . $hide_notice, 1 );
			update_option( 'ata_news_admin_notice_hide', 1 );
		}
	}

	/**
	 * Show welcome notice.
	 */
	public function welcome_notice() {
		if ( get_option( 'ata_news_admin_notice_hide' ) == 1 ) {return false ;}
		?>
		<div id="message" class="updated ata-message">
			<a class="ata-message-close notice-dismiss" href="<?php echo esc_url( wp_nonce_url( remove_query_arg( array( 'activated' ), add_query_arg( 'ata-news-hide-notice', 'welcome' ) ), 'ata_news_hide_notices_nonce', '_ata_news_notice_nonce' ) ); ?>"></a>
			<p><?php printf( /* translators: %s: plugin name. */  esc_html__( 'Thank you for choosing News, Magazine and Blog Elements! To take full advantage of the plugins ( visual composer addons , Unlock all feature of widgets & ShortCode ) . please make sure you visit our %1$s pluings page%2$s.', 'ATA_NEWS_LANG' ), '<a target="_blank" href="' . ATA_PRO . '">', '</a>' ); ?></p>
			<p class="submit">
				<a class="button-secondary" target="_blank" href="<?php echo ATA_PRO; ?>"><?php esc_html_e( 'upgrade pro', 'ATA_NEWS_LANG' ); ?></a>
			</p>
		</div>
		<?php
	}

}

endif;

return new ATA_News_Admin();
