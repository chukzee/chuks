
var Test = {}
if(!window.Test){
    window.Test = Test;
}

Test.set = function(v){
    alert('set');
    document.getElementById('txt_click_me').value = v;
};

$(document).ready(function(){
    
    $('btn_click_me').on('click', function(){
        Test.set('chuks is here');
    });

});

function setIt(){
    alert('setIt');
}
