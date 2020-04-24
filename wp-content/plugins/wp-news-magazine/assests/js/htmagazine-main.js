(function ($) {
"use strict";

    /*--
    Custom Scroll
    -----------------------------------*/
    $(".customScroll").niceScroll();

    /*============= News Ticker ==============*/
    var WidgetNewsTrickerHandler = function ($scope, $) {
        var newstricker_elem = $scope.find('.breaking-news-ticker').eq(0);
        if ( newstricker_elem.length > 0 ) {
            var newstickeropt = newstricker_elem.data('newstrickeropt');
            $( newstickeropt.activeid ).newsTicker({
                row_height: newstickeropt.rowheight,
                max_rows: newstickeropt.maxrows,
                speed: newstickeropt.speed,
                duration: newstickeropt.duration,
                autostart: newstickeropt.autostart,
                direction: newstickeropt.direction,
                pauseOnHover: newstickeropt.pauseonhover,
                prevButton: $( newstickeropt.unicidprev ),
                nextButton: $( newstickeropt.unicidnext ),
            });
        }
    }

    /*============= Carousel =================*/
    var WidgetCarouselHandler = function ($scope, $) {

        var carousel_elem = $scope.find( '.htmagazine-post-carousel' ).eq(0);

        if ( carousel_elem.length > 0 ) {

            var settings = carousel_elem.data('settings');
            var arrows = settings['arrows'];
            var arrow_prev_txt = settings['arrow_prev_txt'];
            var arrow_next_txt = settings['arrow_next_txt'];
            var dots = settings['dots'];
            var autoplay = settings['autoplay'];
            var autoplay_speed = parseInt(settings['autoplay_speed']) || 3000;
            var animation_speed = parseInt(settings['animation_speed']) || 300;
            var pause_on_hover = settings['pause_on_hover'];
            var center_mode = settings['center_mode'];
            var center_padding = settings['center_padding'] ? settings['center_padding'] : '50px';
            var display_columns = parseInt(settings['display_columns']) || 1;
            var sliderrow = parseInt(settings['sliderrow']) || 1;
            var scroll_columns = parseInt(settings['scroll_columns']) || 1;
            var tablet_width = parseInt(settings['tablet_width']) || 800;
            var tablet_display_columns = parseInt(settings['tablet_display_columns']) || 1;
            var tablet_scroll_columns = parseInt(settings['tablet_scroll_columns']) || 1;
            var mobile_width = parseInt(settings['mobile_width']) || 480;
            var mobile_display_columns = parseInt(settings['mobile_display_columns']) || 1;
            var mobile_scroll_columns = parseInt(settings['mobile_scroll_columns']) || 1;
            var carousel_style_ck = parseInt( settings['carousel_style_ck'] ) || 1;
            
            carousel_elem.slick({
                arrows: arrows,
                prevArrow: '<button type="button" class="slick-prev"><i class="'+arrow_prev_txt+'"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="'+arrow_next_txt+'"></i></button>',
                dots: dots,
                infinite: true,
                autoplay: autoplay,
                autoplaySpeed: autoplay_speed,
                speed: animation_speed,
                fade: false,
                pauseOnHover: pause_on_hover,
                slidesToShow: display_columns,
                rows: sliderrow,
                slidesToScroll: scroll_columns,
                centerMode: center_mode,
                centerPadding: center_padding,
                responsive: [
                    {
                        breakpoint: tablet_width,
                        settings: {
                            slidesToShow: tablet_display_columns,
                            slidesToScroll: tablet_scroll_columns
                        }
                    },
                    {
                        breakpoint: mobile_width,
                        settings: {
                            slidesToShow: mobile_display_columns,
                            slidesToScroll: mobile_scroll_columns
                        }
                    }
                ]
                
            });

        }
    }

    var WidgetYoutubePlayerHandler = function ($scope, $) {

        var player_elem = $scope.find( '.htmega-youtube' ).eq(0);
        var settings = player_elem.data('settings');

        var api_key = settings['youtubeapi'];
        $('.RYPP').rypp( api_key, {
            autoplay: true,
        });
        
    }

    // Run this code under Elementor.
    $(window).on('elementor/frontend/init', function () {

        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-newsticker-addons.default', WidgetNewsTrickerHandler);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-addon-newsgrid.default', WidgetCarouselHandler);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-newscarousel.default', WidgetCarouselHandler);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-addonsinstagram.default', WidgetCarouselHandler);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-newsblock.default', WidgetCarouselHandler);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-addonsname.default', WidgetYoutubePlayerHandler);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/htmagazine-youtubeplayer.default', WidgetYoutubePlayerHandler);
        
    });

})(jQuery); 