

/* global Main, Ns */


Ns.GameEditGroup = {

    Content: function (data) {
        Ns.view.EditGroup.content(data);
        
        $('#edit-group-back-btn').off('click');
        $('#edit-group-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};