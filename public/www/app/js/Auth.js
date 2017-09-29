
/* global Ns, Main */

Ns.Auth = {

    constructor: function () {

        Main.eventio.on('session_user_id', this.onSessionIDRequest);
    },

    login: function () {

        try {
            var user_info_str = window.localStorage.getItem(Ns.Const.AUTH_USER_KEY);
            var user_info = JSON.parse(user_info_str);

        } catch (e) {
            console.warn(e);
        }

        if (user_info && user_info.user_id) {//comment if not testing!!
        //if (!user_info && user_info.user_id) {//uncomment if testing!!!
            return;//leave
        }
        Main.page.show({
            url: Ns.GameHome.GAME_LOGIN_HTML,
            effect: "fade",
            duration: 500,
            hasBackAction : false,//disable back button action
            onBeforeShow: onLoginFormShow
        });

        function onLoginFormShow() {

            $('#game-login-btn-login').on('click', function () {
                
                var errEl = document.getElementById('game-login-error');
                var uEl = document.getElementById('game-login-user-id');
                var pEl = document.getElementById('game-login-password');
                
                var user_id = uEl.value;
                var password = pEl.value;
                                
                errEl.innerHTML = '';//clear
                uEl.value = '';//clear
                pEl.value = '';//clear

                var obj = {
                    user: 'info/User'
                };

                Main.rcall.live(obj, function () {
                    Main.ro.user.login(user_id, password)
                            .get(function (user_info) {
                                Ns.view.UserProfile.appUser = user_info;
                                window.localStorage.setItem(Ns.Const.AUTH_USER_KEY, JSON.stringify(user_info));
                                Main.page.home();
                            })
                            .error(function (err) {
                                errEl.innerHTML = err;
                            });
                });

            });

            $('#game-login-btn-signup').on('click', function () {
                alert('TOD0 -  show signup page');
            });


            $('#game-login-forgot-password').on('click', function () {
                alert('TOD0 -  show forgot-password page');
            });

        }


    },

    onSessionIDRequest: function (evt) {
        var app_user = Ns.view.UserProfile.appUser;
        if (!app_user || !app_user.user_id) {
            return;
        }
        evt.socket.emit('session_user_id', app_user.user_id);
    }

};


