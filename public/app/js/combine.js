
$(document).ready(function () {

    window.setInterval(nextSlide, 5000);

    function nextSlide() {
        var e = document.getElementById('slide-next-btn');
        if (e) {
            e.click();
        }
    }

    
    $('a[data-scroll-to^="#"]').on('click', function () {
        var id = $(this).attr('data-scroll-to');
        $('html, body').animate({
            scrollTop: $(id).offset().top - 90
        }, 1000);
    });


});



