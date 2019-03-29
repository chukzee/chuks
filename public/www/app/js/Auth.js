
/* global Ns, Main, localforage */

Ns.Auth = {

    isAuth: false,

    constructor: function () {

        Main.eventio.on('session_user_id', this.onSessionIDRequest);
    },

    login: function () {


        localforage.getItem(Ns.Const.AUTH_USER_KEY, storageUserInfo);

        function storageUserInfo(err, user_info) {
            if (err) {
                console.log(err);
            }

            if (false) {//ccmment out this 'if' block later later!!!    
                return;//leave
            }

            /*UNCOMMENT THIS 'IF' BLOCK LATER
             
             if (user_info && user_info.user_id) {
             Ns.Auth.isAuth = true;
             Ns.Auth.afterAuth();
             return;//leave
             }
             
             */

            Main.page.show({
                url: Ns.GameHome.GAME_LOGIN_HTML,
                effect: "fade",
                duration: 300,
                hasBackAction: false, //disable back button action
                onBeforeShow: onLoginFormShow
            });

        }

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
                                Ns.Auth.isAuth = true;
                                Ns.view.UserProfile.appUser = user_info;
                                localforage.setItem(Ns.Const.AUTH_USER_KEY, user_info, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    Ns.Auth.afterAuth();
                                });

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

    afterAuth: function () {
        Ns.GameHome.show();
    },

    onSessionIDRequest: function (evt) {
        var app_user = Ns.view.UserProfile.appUser;
        if (!app_user || !app_user.user_id) {
            return;
        }
        evt.socket.emit('session_user_id', app_user.user_id);
    }

};


