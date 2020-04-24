/* global vancuraScreenReaderText */
/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

jQuery(function($){
 "use strict";
   jQuery('.main-menu-navigation > ul').superfish({
     delay:       500,                            
     animation:   {opacity:'show',height:'show'},  
     speed:       'fast'                        
   });

});

function resMenu_open() {
	document.getElementById("sidelong-menu").style.width = "250px";
}
function resMenu_close() {
	document.getElementById("sidelong-menu").style.width = "0";
}

(function( $ ) {
	/**** Hidden search box ***/
	jQuery('document').ready(function($){
		jQuery('.search-box a').click(function(){
	        jQuery(".serach_outer").slideDown(700);
	    });

	    jQuery('.closepop a').click(function(){
	        jQuery(".serach_outer").slideUp(700);
	    });
	});	

	//Testimonial Owl Carousel
	jQuery(document).ready(function() {
		var owl = jQuery('#testimonials .owl-carousel');
			owl.owlCarousel({
				nav: true,
				autoplay:false,
				autoplayTimeout:2000,
				autoplayHoverPause:true,
				loop: true,
				navText : ['<i class="fa fa-lg fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-lg fa-chevron-right" aria-hidden="true"></i>'],
				responsive: {
				  0: {
				    items: 1
				  },
				  600: {
				    items: 2
				  },
				  1000: {
				    items: 2
				}
			}
		})
	})

	//Our Clients Owl Carousel
	jQuery(document).ready(function() {
		var owl = jQuery('#ourclients .owl-carousel');
			owl.owlCarousel({
				nav: true,
				autoplay:true,
				autoplayTimeout:2000,
				autoplayHoverPause:true,
				loop: true,
				navText : ['<i class="fa fa-lg fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-lg fa-chevron-right" aria-hidden="true"></i>'],
				responsive: {
				  0: {
				    items: 1
				  },
				  600: {
				    items: 4
				  },
				  1000: {
				    items: 4
				}
			}
		})
	})

})( jQuery );
