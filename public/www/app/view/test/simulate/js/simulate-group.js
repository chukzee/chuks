

/* global Main */

Main.on("pagecreate", function (arg) {


    var obj = {
        group: 'info/Group',
    };

    Main.rcall.live(obj);

    Main.eventio.on('group_join_request', onGroupJionRequest)
    var authorization_token;
    function onGroupJionRequest(obj) {
        alert('onGroupJionRequest');
        alert(obj);
        console.log(obj);
        authorization_token = obj.data.authorization_token;
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
     <input type="file" id="create-group-icon-file" name="group_icon"/>
     <button id="btn-create-group" style="margin: 5px;">Create group</button>
     <button id="btn-edit-group" style="margin: 5px;">edit group</button>
     <button id="btn-send-group-join-request" style="margin: 5px;">Send group join request</button>
     <button id="btn-accept-group-join-request" style="margin: 5px;">Accept group join request</button>
     <button id="btn-make-admin" style="margin: 5px;">Make admin</button>
     <button id="btn-remove-admin-position" style="margin: 5px;">Remove admin position</button>
     <button id="btn-remove-member" style="margin: 5px;">Remove member</button>
     <button id="btn-get-group-info" style="margin: 5px;">Get group info</button>
     <button id="btn-get-groups-info-list" style="margin: 5px;">Get groups info list</button>
     <button id="btn-get-user-groups-info-list" style="margin: 5px;">Get user groups info list</button>
     
     */

    $('#btn-create-group').on('click', function () {

        var user_id = prompt('user_id', '');
        var group_name = prompt('group_name', '');
        var status_message = prompt('status_message', '');

        var file_input = document.getElementById('create-group-icon-file');

        Main.ro.group.createGroup(user_id, group_name, status_message)
                .attach([file_input])
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

        var user_id = prompt('user_id', '');
        var group_name = prompt('group_name', '');
        var status_message = prompt('status_message', '');
        var file_input = document.getElementById('create-group-icon-file');

        Main.ro.group.editGroup(user_id, group_name, status_message)
                .attach([file_input])
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

        var from_user_id = prompt('from_user_id', '');
        var to_user_id = prompt('to_user_id', '');
        var group_name = prompt('group_name', '');

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

        var authorization_token = prompt('authorization_token', '');

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

        var user_id = prompt('user_id', '');
        var new_admin_user_id = prompt('new_admin_user_id', '');
        var group_name = prompt('group_name', '');

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

        var user_id = prompt('user_id', '');
        var demoted_admin_user_id = prompt('demoted_admin_user_id', '');
        var group_name = prompt('group_name', '');

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

        var user_id = prompt('user_id', '');
        var exist_by = prompt('exist_by', '');
        var group_name = prompt('group_name', '');
        var reason = prompt('reason', '');

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

        var group_name = prompt('group_name', '');

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

        var group_name_arr = prompt('enter group name separated by comma', '');
        if (!group_name_arr) {
            group_name_arr = '';
        }
        group_name_arr = group_name_arr.split(',');

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

        var user_id = prompt('user_id', '');

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