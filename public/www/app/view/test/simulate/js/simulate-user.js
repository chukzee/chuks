



Main.on("pagecreate", function (arg) {


    var obj = {
        match: 'game/Match',
        user: 'info/User',
        //more may go below
    };

    Main.rcall.live(obj);

    $('#test-simulate-page').on('click', function () {
        //alert('#btn-page1-next');

        Main.page.show({
            url: 'test/simulate/simulate-test-1.html',
            effect: "slideleft",
            duration: 3000,
            data: {game: "testgame"}
        });
    });

    Main.chuks = Main.chuks || {};
    
    Main.chuks.onSessionIDRequest = Main.chuks.onSessionIDRequest || function (evt) {
       // alert(evt.type);
        //for simplicity of test we will assume all the users in coming from one connection
        socket = evt.socket;
        
        evt.socket.emit('session_user_id', Main.chuks.user_id);
        

    };

    Main.eventio.on('session_user_id', Main.chuks.onSessionIDRequest);

    $('#btn-login').on('click', function () {
        user_id = prompt('user_id', '');
        var password = prompt('password', '');

        Main.ro.user.login(user_id, password)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                    Main.chuks.user_id = data.user_id;
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });


    });


    $('#btn-register').on('click', function () {

        //------register (1) --- 07032710628
        var obj = {
            phone_no: prompt('phone', ''),
            password: prompt('password', ''),
            email: prompt('email', ''),
            country: prompt('country', '')
        };
        
        Main.ro.user.register(obj)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });


    });


    $('#btn-add-phone-number').on('click', function () {
        var user_id = prompt('user_id', '');
        var additional_phone_no = prompt('additional_phone_no', '');

        Main.ro.user.addPhoneNumber(user_id, additional_phone_no)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-user-info').on('click', function () {
        /*var obj = {
         phone_no:'07032710628',
         password:'chukspass',
         email:'chuksalimele@gmail.com',
         country:'Nigeria',
         }*/
        var user_id = prompt('user_id', '');
        var first_name = prompt('first_name', '');
        var last_name = prompt('last_name', '');
        var additional_phone_no = prompt('additional_phone_no', '');
        var dob = new Date().getTime();

        Main.ro.user.editInfo(user_id, first_name, last_name, additional_phone_no, dob)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-info').on('click', function () {

        var user_id = prompt('user_id', '');

        Main.ro.user.getInfo(user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-info-list').on('click', function () {

        var user_id_arr = prompt('enter user id separated by comma', '');
        if (!user_id_arr) {
            user_id_arr = '';
        }
        user_id_arr = user_id_arr.split(',');

        Main.ro.user.getInfoList(user_id_arr)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-groups-belong').on('click', function () {

        var user_id = prompt('user_id', '');

        Main.ro.user.getGroupsBelong(user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });


    $('#btn-get-tournaments-belong').on('click', function () {

        var user_id = prompt('user_id', '');

        Main.ro.user.getTournamentsBelong(user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

});