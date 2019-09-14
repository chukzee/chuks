
$(document).ready(function () {

    window.setInterval(nextSlide, 5000);

    function nextSlide() {
        var e = document.getElementById('slide-next-btn');
        if (e) {
            e.click();
        }
    }
});
