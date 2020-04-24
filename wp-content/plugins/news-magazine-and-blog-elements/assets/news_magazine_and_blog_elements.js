jQuery.noConflict();
(function( $ ) {
  $(function() {
	"use strict";
	/*
	 * woo__mulit__layout__carousel__views
	 */
	if( $('.newsticker').length ){
		$('.newsticker').each(function(index, element) {
           $(this).newsTicker({
			row_height: 30,
			max_rows: 1,
			speed: 600,
			direction: 'up',
			duration: 4000,
			autostart: 1,
			pauseOnHover: 1
			}); 
        });
		
	}
	
	if( $('.ata_news_carsoul_loader').length ){
		$('.ata_news_carsoul_loader').owlCarousel({
			loop:true,
			margin:10,
			
			nav:true,
			dots:false,
			navText: [ '<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>' ],
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:3
				}
			}
		});
	}
	
	if( $('.ata_posts_slider_loader').length ){
		$('.ata_posts_slider_loader').owlCarousel({
			loop:true,
			margin:0,
			nav:true,
			dots:true,
			navText: [ '<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>' ],
			responsive:{
				0:{
					items:1
				},
				600:{
					items:1
				},
				1000:{
					items:1
				}
			}
		});
	}
	if( $(".news_mag_plugins_masonry_grid").length){
		$('.news_mag_plugins_masonry_grid').masonry({
		  // set itemSelector so .grid-sizer is not used in layout
		  itemSelector: '.ata_grid-item',
		  // use element for option
		  columnWidth: '.ata_grid-sizer',
		  percentPosition: true
		});
	}
	/*var timer = !1;
	var _Ticker = $(".ata_tickernews").newsTicker();
	
	_Ticker.on("mouseenter",function(){
		var __self = this;
		timer = setTimeout(function(){
			__self.pauseTicker();
		},200);
	});
	_Ticker.on("mouseleave",function(){
		clearTimeout(timer);
		if(!timer) return !1;
		this.startTicker();
	});*/
  });
})(jQuery)
