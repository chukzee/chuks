

/* global Main, Ns */


Ns.GameCreateGroup = {

    Content: function (data) {
        Ns.view.CreateGroup.content(data);
        
        $('#create-group-back-btn').off('click');
        $('#create-group-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};