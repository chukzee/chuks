
/* global Ns, Main */

Ns.ui.Photo = {

    show: function (data, type) {
        if (type === 'tournament') {
            Ns.ui.Photo._showTournament(data);
        } else if (type === 'group') {
            Ns.ui.Photo._showGroup(data);
        } else {
            Ns.ui.Photo._showUser(data);
        }
    },

    _showUser: function (data) {
        Main.fullscreen.show({
            url: 'user-photo-view.html',
            onShow: function (el) {
                
                Ns.ui.Photo._autoScreenClear("user-photo-view",
                        "user-photo-view-header-transparent-layer",
                        "user-photo-view-header",
                        "user-photo-view-footer-transparent-layer",
                        "user-photo-view-footer");

                var name_el = document.getElementById('user-photo-view-name');
                name_el.innerHTML = data.full_name;
                                        
                var me = this;
                var back_btn = document.getElementById('user-photo-view-back-btn');
                $(back_btn).on('click', function () {
                    me.hide();
                });

                var expand_btn = document.getElementById('user-photo-view-expand');
                data.el = document.getElementById('user-photo-view-image');
                $(expand_btn).on('click', data, Ns.ui.Photo._expandPhotoSize);

                var open_btn = document.getElementById('user-photo-view-profile');
                $(open_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showUserProfile(data);
                });

                var comment_btn = document.getElementById('user-photo-view-comment');
                $(comment_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showContactChat(data);
                });
                
                var share_btn = document.getElementById('user-photo-view-share');
                $(share_btn).on('click', data, Ns.ui._sharePhoto);

            }
        });
    },

    _showGroup: function (data) {
        Main.fullscreen.show({
            url: 'group-photo-view.html',
            onShow: function (el) {
                
                Ns.ui.Photo._autoScreenClear("group-photo-view",
                        "group-photo-view-header-transparent-layer",
                        "group-photo-view-header",
                        "group-photo-view-footer-transparent-layer",
                        "group-photo-view-footer");

                var name_el = document.getElementById('group-photo-view-name');
                name_el.innerHTML = data.name;
                                        
                var me = this;
                var back_btn = document.getElementById('group-photo-view-back-btn');
                $(back_btn).on('click', function () {
                    me.hide();
                });

                var expand_btn = document.getElementById('group-photo-view-expand');
                data.el = document.getElementById('group-photo-view-image');
                $(expand_btn).on('click', data, Ns.ui.Photo._expandPhotoSize);

                var open_btn = document.getElementById('group-photo-view-profile');
                $(open_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showGroupDetails(data);
                });

                var comment_btn = document.getElementById('group-photo-view-comment');
                $(comment_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showGroupChat(data);
                });

                var share_btn = document.getElementById('group-photo-view-share');
                $(share_btn).on('click', data, Ns.ui._sharePhoto);

            }
        });
    },

    _showTournament: function (data) {
        Main.fullscreen.show({
            url: 'tournament-photo-view.html',
            onShow: function (el) {
                
                Ns.ui.Photo._autoScreenClear("tournament-photo-view",
                        "tournament-photo-view-header-transparent-layer",
                        "tournament-photo-view-header",
                        "tournament-photo-view-footer-transparent-layer",
                        "tournament-photo-view-footer");
                
                var name_el = document.getElementById('tournament-photo-view-name');
                name_el.innerHTML = data.name;
                
                var me = this;
                var back_btn = document.getElementById('tournament-photo-view-back-btn');
                $(back_btn).on('click', function () {
                    me.hide();
                });

                var expand_btn = document.getElementById('tournament-photo-view-expand');
                data.el = document.getElementById('tournament-photo-view-image');
                $(expand_btn).on('click', data, Ns.ui.Photo._expandPhotoSize);

                var open_btn = document.getElementById('tournament-photo-view-profile');
                $(open_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showTournamentDetails(data);
                });

                var general_comment_btn = document.getElementById('tournament-photo-view-comment-general');
                $(general_comment_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showTournamentGeneralChat(data);
                });

                var inhouse_comment_btn = document.getElementById('tournament-photo-view-comment-inhouse');
                $(inhouse_comment_btn).on('click', function () {
                    me.hide();
                    Ns.GameHome.showTournamentInhouseChat(data);
                });
                
                var share_btn = document.getElementById('tournament-photo-view-share');
                $(share_btn).on('click', data, Ns.ui._sharePhoto);

            }
        });
    },

    _sharePhoto: function (data) {

    },

    _expandPhotoSize: function (param) {
        var img_el = param.data.el;
        img_el.src = param.data.large_photo_url; //get the large size

        var container = img_el.parentNode;

        //TODO - increase the dimension of the image container
    },

    _autoScreenClear: function (container_id, up_id_1, up_id_2, down_id_1, down_id_2) {
        container_id = container_id.charAt(0) === '#' ? container_id.substring(1) : container_id;
        up_id_1 = up_id_1.charAt(0) === '#' ? up_id_1.substring(1) : up_id_1;
        up_id_2 = up_id_2.charAt(0) === '#' ? up_id_2.substring(1) : up_id_2;
        down_id_1 = down_id_1.charAt(0) === '#' ? down_id_1.substring(1) : down_id_1;
        down_id_2 = down_id_2.charAt(0) === '#' ? down_id_2.substring(1) : down_id_2;

        Main.dom.addListener(container_id, "touchstart", doIt);
        Main.dom.addListener(container_id, "click", doIt);
        Main.dom.addListener(container_id, "mouseover", doIt);
        Main.dom.addListener(container_id, "mousemove", doIt);

        var timeout_id;
        function doIt() {
            if (!$('#'+up_id_1).hasClass("game9ja-fly-down-translucent")) {
                $('#'+up_id_1).addClass("game9ja-fly-down-translucent");
            }
            if (!$('#'+up_id_2).hasClass("game9ja-fly-down")) {
                $('#'+up_id_2).addClass("game9ja-fly-down");
            }

            if (!$('#'+down_id_1).hasClass("game9ja-fly-up-translucent")) {
                $('#'+down_id_1).addClass("game9ja-fly-up-translucent");
            }

            if (!$('#'+down_id_2).hasClass("game9ja-fly-up")) {
                $('#'+down_id_2).addClass("game9ja-fly-up");
            }

            clearTimeout(timeout_id);

            timeout_id = setTimeout(function () {
                $('#'+up_id_1).removeClass("game9ja-fly-down-translucent");
                $('#'+up_id_2).removeClass("game9ja-fly-down");

                $('#'+down_id_1).removeClass("game9ja-fly-up-translucent");
                $('#'+down_id_2).removeClass("game9ja-fly-up");
            }, 5000);

        }
    }
};