

/* global Main, Ns */


Ns.GameUserProfile = {


    Content: function (data) {
        Ns.view.UserProfile.content(data);
        
        $('#user-profile-back-btn').off('click');
        $('#user-profile-back-btn').on('click', function () {
            Main.page.back();
        });        
    },
   
};