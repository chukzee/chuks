



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
    Main.chuks.onSessionIDRequest = Main.chuks.onSessionIDRequest || function (evt){
        alert(evt.type);
        //for simplicity of test we will assume all the users in coming from one connection
        evt.socket.emit('session_user_id', '07032710628');
        evt.socket.emit('session_user_id', '07023232323');//testing!!! assuming all the users is coming from one connection for simplicity
        evt.socket.emit('session_user_id', '07024242424');//testing!!! assuming all the users is coming from one connection for simplicity
        
    };
    
    Main.eventio.on('session_user_id',Main.chuks.onSessionIDRequest);
    


    $('#btn-login').on('click', function () {

        Main.ro.user.login('07032710628', 'chukspass')
                .get(function (data) {
                    alert(data);
                    console.log(data);
                    
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

        Main.ro.user.login('07023232323', 'perponspass1')
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

        Main.ro.user.login('07024242424', 'perponspass2')
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
            
    $('#btn-register').on('click', function () {
        
        //------register (1) --- 07032710628
        var obj = {
            phone_no:'07032710628',
            password:'chukspass',
            email:'chuksalimele@gmail.com',
            country:'Nigeria',
        }
        Main.ro.user.register(obj)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });
                
       
        //------register (2) --- 07023232323
        var obj = {
            phone_no:'07023232323',
            password:'perponspass1',
            email:'person1@gmail.com',
            country:'Nigeria',
        }
        Main.ro.user.register(obj)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });
                         
                
       
        //------register (3) --- 07024242424
        var obj = {
            phone_no:'07024242424',
            password:'perponspass2',
            email:'person2@gmail.com',
            country:'Nigeria',
        }
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
        var user_id = '07032710628';
        var additional_phone_no = '08153272599';
        
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
        var user_id = '07032710628';
        var first_name = 'Chuks';
        var last_name = 'Alimele';
        var additional_phone_no = '08034829424';
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
        
        Main.ro.user.getInfo('07032710628')
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
        
        var user_id_arr = ['07032710628', '07023232323', '07024242424'];
        
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

        Main.ro.user.getGroupsBelong('07032710628')
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
        
        Main.ro.user.getTournamentsBelong('07032710628')
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