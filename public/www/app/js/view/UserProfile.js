
/* global Main, Ns */

Ns.view.UserProfile = {

    appUser: null, //set after authenication 

    /**
     * holds list of user info against the user_id
     * e.g
     * //object structure
     * {
     *  user_id_1 : {user_id:..., full_name:..., registered_phone_no:..., photo:..., profile_status:..., last_modified:..., contacts:[...], groups_belong :[...array of group name....], groups_in_common:[......], tournaments_belong:[....], }
     *  user_id_2 : {user_id:..., full_name:..., registered_phone_no:..., photo:..., profile_status:..., last_modified:..., contacts:[...], groups_belong :[...array of group name....], groups_in_common:[......], tournaments_belong:[....], }
     *  user_id_3 : {user_id:..., full_name:..., registered_phone_no:..., photo:..., profile_status:..., last_modified:..., contacts:[...], groups_belong :[...array of group name....], groups_in_common:[......], tournaments_belong:[....], }
     *  user_id_4 : {user_id:..., full_name:..., registered_phone_no:..., photo:..., profile_status:..., last_modified:..., contacts:[...], groups_belong :[...array of group name....], groups_in_common:[......], tournaments_belong:[....], }
     *  user_id_5 : {user_id:..., full_name:..., registered_phone_no:..., photo:..., profile_status:..., last_modified:..., contacts:[...], groups_belong :[...array of group name....], groups_in_common:[......], tournaments_belong:[....], }
     * }
     * @type type
     */
    userList: {},

    constructor: function () {

        var obj = {
            user: 'info/User',
            //more may go below
        };

        Main.rcall.live(obj);

    },

    /**
     * Gets an array of group in common between the specified user and the app user
     * @returns {undefined}
     */
    getGroupsInCommon: function (other_user_id, callback) {

        var other_user_info = this.userList[other_user_id];

        if (!other_user_info) {
            Main.rcall.live(function () {
                Main.ro.group.getUserGroupsInfoList(other_user_id)
                        .get(function (group_info_arr) {
                            //first save the groups info in memory
                            for (var i = 0; i < group_info_arr.length; i++) {
                                Ns.view.Group.groupList[group_info_arr[i].name] = group_info_arr[i];
                            }
                            //get the groups in common
                            var c = whatsCommon(group_info_arr);
                            callback(c);
                        })
                        .error(function () {
                            //TODO
                        });
            });
        } else {
            var c = whatsCommon(other_user_info.groups_belong);
            callback(c);
        }

        var me = this;

        function whatsCommon(groups) {

            if (!groups) {
                return [];
            }

            var app_user_id = Ns.view.UserProfile.appUser.id;

            var app_user_groups_belong = Ns.view.UserProfile.appUser.groups_belong;

            if (!app_user_groups_belong) {
                //check the user list
                if (me.userList[app_user_id]) {
                    app_user_groups_belong = me.userList[app_user_id].groups_belong;
                } else {
                    return [];
                }
            }


            var cm_groups = [];

            for (var i = 0; i < groups.length; i++) {
                var gn = groups[i];
                if (!Main.util.isString(gn)) {
                    gn = gn.name; // access the group name from the object
                }
                for (var k = 0; k < app_user_groups_belong.length; k++) {
                    var app_gn = app_user_groups_belong[k];
                    if (!Main.util.isString(app_gn)) {
                        app_gn = app_gn.name; // access the group name from the object
                    }

                    if (app_gn === gn) {
                        cm_groups.push(gn);
                        break;
                    }
                }
            }

            return cm_groups;

        }

    },

    content: function () {

    },
    //more goes below
};