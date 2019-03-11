
/* global Main, Ns, localforage */

Ns.view.UserProfile = {

    appUser: null, //set after authenication 

    userList: [],

    constructor: function () {

        localforage.getItem(Ns.Const.USER_LIST_KEY, function (err, list) {
            if (err) {
                console.log(err);
            }
            if (Main.util.isArray(list)) {
                Ns.view.UserProfile.userList = list;
            }
        });

        var obj = {
            user: 'info/User',
            //more may go below
        };

        Main.rcall.live(obj);

    },

    isOnline: function (user_id, callback) {
        Main.rcall.live(function () {
            Main.ro.user.isOnline(user_id)
                    .get(function (data) {
                        callback(data);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },

    /**
     * Gets an array of group in common between the specified user and the app user
     * @returns {undefined}
     */
    getGroupsInCommon: function (other_user_id, callback) {
        var other_user_info;
        for (var i = 0; i < Ns.view.UserProfile.userList.length; i++) {
            if (other_user_id === Ns.view.UserProfile.userList[i].user_id) {
                other_user_info = Ns.view.UserProfile.userList[i];
                break;
            }
        }

        if (!other_user_info) {
            Ns.view.Group.getUserGroupsInfo(function (groups) {
                //get the groups in common
                var c = whatsCommon(groups);
                callback(c);
            })
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

    content: function (u) {

        if (Main.util.isString(u)) {
            var user_id = u.user_id;

            //find the USER
            Ns.view.UserProfile.getInfo(user_id, function (user) {
                setContent(user);
            });
        } else {
            setContent(u);
        }


        function setContent(user) {
            /*
             "user-profile-photo-url"
             "user-profile-full-name"
             "user-profile-status-message"
             "user-profile-phone-no"
             "user-profile-last-modified"
             "user-profile-back-btn"
             "user-profile-edit"
             "user-profile-other-phone-nos"            
             "user-profile-ranking-position"            
             "user-profile-ranking-date"            
             "user-profile-ranking-score"                    
             "user-profile-groups-belong-count"            
             "user-profile-groups-belong"            
             "user-profile-groups-in-common-count"            
             "user-profile-groups-in-common"            
             "user-profile-tournaments-belong-count"            
             "user-profile-tournaments-belong"
             */


            if (!user) {
                return;
            }

            document.getElementById("user-profile-photo-url").src = user.large_photo_url;
            document.getElementById("user-profile-full-name").innerHTML = user.full_name;
            document.getElementById("user-profile-status-message").innerHTML = user.status_message;
            document.getElementById("user-profile-phone-no").innerHTML = user.user_id;
            document.getElementById("user-profile-last-modified").innerHTML = Ns.Util.formatDate(user.date_last_modified);
            document.getElementById("user-profile-ranking-position").innerHTML = user.player_ranking;
            document.getElementById("user-profile-ranking-date").innerHTML = Ns.Util.formatDate(user.rank_date);
            document.getElementById("user-profile-ranking-score").innerHTML = user.rank_score;
            document.getElementById("user-profile-groups-belong-count").innerHTML = user.groups_belong ? user.groups_belong.length : 0;
            //document.getElementById("user-profile-groups-in-common-count").innerHTML = groups_in_common_count;
            document.getElementById("user-profile-tournaments-belong-count").innerHTML = user.tournaments_belong ? user.tournaments_belong.length : 0;

            //document.getElementById("user-profile-groups-belong").innerHTML = user.blablablah;
            //document.getElementById("user-profile-groups-in-common").innerHTML = user.blablablah;
            //document.getElementById("user-profile-tournaments-belong").innerHTML = user.blablablah;

            Main.click("user-profile-comment", user, Ns.view.UserProfile._onClickContactChat);

        }

    },

    _onClickContactChat: function (evt, contact) {
        Ns.GameHome.showContactChat(contact);
    },

    getInfo: function (user_id, callback, refresh) {
        var user;
        for (var i = 0; i < Ns.view.UserProfile.userList.length; i++) {
            if (user_id === Ns.view.UserProfile.userList[i].user_id) {
                user = Ns.view.UserProfile.userList[i];
                callback(user);
                if (!refresh) {
                    return;
                }
            }
        }

        Main.rcall.live(function () {
            Main.ro.user.getInfo(user_id)
                    .get(function (user) {
                        if (user && user.user_id) {
                            Ns.view.UserProfile.merge(user);
                            callback(user);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });


    },

    merge: function (users) {

        if (!Main.util.isArray(users)) {
            users = [users];
        }
        if (!Main.util.isArray(Ns.view.UserProfile.userList)) {
            Ns.view.UserProfile.userList = [];
        }
        var old_len = Ns.view.UserProfile.userList.length;

        for (var i = 0; i < users.length; i++) {
            var found = false;
            for (var k = 0; k < old_len; k++) {
                var user = Ns.view.UserProfile.userList[k];
                if (user.user_id === users[i].user_id) {
                    user = users[i];//replace
                    found = true;
                    break;
                }
            }

            if (!found) {
                Ns.view.UserProfile.userList.push(users[i]);
            }
        }

        if (Ns.view.UserProfile.userList.length > Ns.Const.MAX_LIST_SIZE) {
            var excess = Ns.view.UserProfile.userList.length - Ns.Const.MAX_LIST_SIZE;
            Ns.view.UserProfile.userList.splice(0, excess);//cut off the excess from the top
        }

        Ns.view.UserProfile.save();
    },

    save: function () {
        var list = Ns.view.UserProfile.userList;
        if (Main.util.isArray(list)) {
            localforage.setItem(Ns.Const.USER_LIST_KEY, list, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    },

    getUsersInfo: function (user_id_arr, callback) {

        var local_users = [];
        for (var i = 0; i < Ns.view.UserProfile.userList.length; i++) {
            for (var k = 0; k < user_id_arr.length; k++) {
                if (user_id_arr[k] === Ns.view.UserProfile.userList[i].user_id) {
                    var u = Ns.view.UserProfile.userList[i];
                    local_users.push(u);
                    user_id_arr.splice(k, 1);
                    k--;
                    continue;
                }
            }
        }

        if (user_id_arr.length === 0) {
            if (Main.util.isFunc(callback)) {
                callback(local_users);
            }
            return;
        }


        Main.rcall.live(function () {

            Main.ro.user.getInfoList(user_id_arr)
                    .get(function (users) {
                        if (!Main.util.isArray(users)) {//just in case
                            callback([]);
                            return;
                        }
                        Ns.view.UserProfile.merge(users);
                        if (Main.util.isFunc(callback)) {
                            users = local_users.concat(users);
                            callback(users);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });

        });


    },

    //more goes below
};