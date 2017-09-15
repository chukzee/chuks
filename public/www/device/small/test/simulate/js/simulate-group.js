



Main.on("pagecreate", function (arg) {


    var obj = {
        group: 'info/Group',
    };

    Main.rcall.live(obj);
    
    Main.eventio.on('group_join_request', onGroupJionRequest)

    function onGroupJionRequest(obj){
        alert('onGroupJionRequest');
        alert(obj);
        console.log(obj);
    }

    $('#test-simulate-page').on('click', function () {
        //alert('#btn-page1-next');

        Main.page.show({
            url: 'test/simulate/simulate-test-1.html',
            effect: "slideleft",
            duration: 3000,
            data: {game: "testgame"}
        });
    });

/*
        <button id="btn-create-group" style="margin: 5px;">Create group</button>
        <button id="btn-edit-group" style="margin: 5px;">edit group</button>
        <button id="btn-send-group-join-request" style="margin: 5px;">Send group join request</button>
        <button id="btn-accept-group-join-request" style="margin: 5px;">Accept group join request</button>
        <button id="btn-make-admin" style="margin: 5px;">Make admin</button>
        <button id="btn-remove-member" style="margin: 5px;">Remove member</button>
        <button id="btn-get-group-info" style="margin: 5px;">Get group info</button>
        <button id="btn-get-groups-info-list" style="margin: 5px;">Get groups info list</button>
        <button id="btn-get-user-groups-info-list" style="margin: 5px;">Get user groups info list</button>

 */

    $('#btn-create-group').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.group.createGroup(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    
    $('#btn-edit-group').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The great group';
        var photo_url = 'group_url_again_1';

        Main.ro.group.editGroup(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
        
    $('#btn-send-group-join-request').on('click', function () {

        var from_user_id = '07032710628';
        var to_user_id = '07023232323';
        var group_name = 'Group1';

        Main.ro.group.sendGroupJoinRequest(from_user_id, to_user_id, group_name)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    
    
    $('#btn-accept-group-join-request').on('click', function () {

        var authorization_token = 'ryyyrtrgt5';

        Main.ro.group.acceptGroupJoinRequest(authorization_token)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    
    
    $('#btn-make-admin').on('click', function () {

        var user_id = '07032710628';
        var new_admin_user_id = '07023232323';
        var group_name = 'Group1';

        Main.ro.group.makeAdmin(user_id, new_admin_user_id, group_name)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    
    $('#btn-remove-admin-position').on('click', function () {

        var user_id = '07032710628';
        var demoted_admin_user_id = '07023232323';
        var group_name = 'Group1';

        Main.ro.group.removeAdminPosition(user_id, demoted_admin_user_id, group_name)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    
    $('#btn-remove-member').on('click', function () {

        var user_id = '07032710628';
        var exist_by = '07023232323';
        var group_name = 'Group1';
        var reason = 'a good reason';

        Main.ro.group.removeMember(user_id, exist_by, group_name, reason)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-get-group-info').on('click', function () {

        var group_name = 'Group1';

        Main.ro.group.getGroupInfo(group_name)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    
    $('#btn-get-groups-info-list').on('click', function () {

        var group_name_arr = ['Group1'];

        Main.ro.group.getGroupsInfoList(group_name_arr)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    
    $('#btn-get-user-groups-info-list').on('click', function () {

        var user_id = '07032710628';
        
        Main.ro.group.getUserGroupsInfoList(user_id)
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