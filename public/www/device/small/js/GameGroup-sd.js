

/* global Main, Ns */


Ns.GameGroup = {


    Content: function (group) {
        Ns.view.Group.content(group);
        
        $('#group-details-back-btn').off('click');
        $('#group-details-back-btn').on('click', function () {
            Main.page.back();
        });
    },
   
};