
/* global Main, Ns, localforage */

Ns.view.Group = {

    /**
     * list of groups info
     * @type Array
     */
    groupList: [],
    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        localforage.getItem(Ns.Const.GROUP_LIST_KEY, function (err, list) {
            if (err) {
                console.log(err);
            }

            if (!list) {
                list = [];
            }

            if (Main.util.isArray(list)) {
                Ns.view.Group.groupList = list;
            }
        });

        var obj = {
            group: 'info/Group'
        };
        Main.rcall.live(obj);

    },
    content: function (group) {

        var me = this;

        $('#group-details').find('.group-admins-only').each(function () {
            $(this).hide();
        });


        if (Main.util.isString(group)) {
            var group_name = group;
            //find the group
            Ns.view.Group.getInfo(group_name, function (group) {
                setContent(group);
            });
        } else {
            setContent(group);
        }


        function setContent(group) {

            /*
             *"group-details-group-name"
             *"group-details-photo-url"
             "group-details-status-message"
             "group-details-back-btn"
             "group-details-edit"
             "group-details-menu"        
             "group-details-created-by"        
             "group-details-date-created"
             "group-details-members-count"
             "group-details-members"
             "group-details-admins-count"
             "group-details-admins"
             "group-details-members"
             */

            if (!group) {
                return;
            }

            group.admins = group.admins || [];

            var created_by_user;
            for (var i = 0; i < group.admins.length; i++) {
                if (group.admins[i].user_id === group.created_by) {
                    created_by_user = group.admins[i];
                    break;
                }
            }

            document.getElementById("group-details-group-name").innerHTML = group.name;
            document.getElementById("group-details-photo-url").src = group.large_photo_url;
            document.getElementById("group-details-status-message").innerHTML = group.status_message;
            document.getElementById("group-details-created-by").innerHTML = created_by_user ? created_by_user.full_name : group.created_by;
            document.getElementById("group-details-date-created").innerHTML = Ns.Util.formatDate(group.date_created);
            document.getElementById("group-details-members-count").innerHTML = group.total_members > 1
                    ? group.total_members + ' Members'
                    : group.total_members + ' Member';
            document.getElementById("group-details-admins-count").innerHTML = group.total_admins > 1
                    ? group.total_admins + ' Group admins'
                    : group.total_admins + ' Group admin';


            var user = Ns.view.UserProfile.appUser;
            var foundAdmin = group.admins.find(function (u) {
                return user.user_id === u.user_id;
            });

            if (foundAdmin) {

                $('#group-details').find('.group-admins-only').each(function () {
                    $(this).show();
                });

            }


            Main.click("group-details-comment", group, Ns.view.Group._onClickGroupChat);




            $('#group-details-edit').off('click');
            $('#group-details-edit').on('click', function () {
                Ns.GameHome.showEditGroup(group);
            });

            $('#group-details-admins-add').off('click');
            $('#group-details-admins-add').on('click', function () {
                Ns.view.Group._onClickAdminsAdd(group);
            });


            $('#group-details-members-add').off('click');
            $('#group-details-members-add').on('click', function () {
                Ns.view.Group._onClickMembersAdd(group);
            });

            me.adminList(group);
            me.memberList(group);

        }

    },

    onRenderMember: function (tpl_var, data) {

        var app_user_id = Ns.view.UserProfile.appUser.user_id;
        var set_exit_group = data.user_id === app_user_id;

        if (tpl_var === 'date_joined') {
            return Ns.Util.formatTime(data[tpl_var]);
        }
        if (tpl_var === 'action_value') {
            if (set_exit_group) {
                return 'Exit Group';
            } else {
                return 'Lets Play';
            }
        }


        if (tpl_var === 'action_clazz') {
            if (set_exit_group) {
                return 'game9ja-exit-group-btn';
            } else {
                return '';
            }
        }
    },

    adminList: function (group) {

        var admins_container = '#group-details-admins';

        Main.listview.create({
            container: admins_container,
            scrollContainer: admins_container,
            tplUrl: 'group-admins-tpl.html',
            wrapItem: false,
            //itemClass: "game9ja-live-games-list",
            onSelect: function (evt, group_admin) {

                Ns.view.Group.onClickMember(evt, group.name, group_admin.user_id);

            },
            onRender: function (tpl_var, data) {

                return Ns.view.Group.onRenderMember(tpl_var, data);

            },
            onReady: function () {

                for (var i = 0; i < group.admins.length; i++) {
                    this.appendItem(group.admins[i]);
                }

            }
        });
    },

    memberList: function (group) {
        var members_container = '#group-details-members';

        Main.listview.create({
            container: members_container,
            scrollContainer: members_container,
            tplUrl: 'group-members-tpl.html',
            wrapItem: false,
            //itemClass: "game9ja-live-games-list",
            onSelect: function (evt, group_member) {

                Ns.view.Group.onClickMember(evt, group.name, group_member.user_id);

            },
            onRender: function (tpl_var, data) {

                return Ns.view.Group.onRenderMember(tpl_var, data);

            },
            onReady: function () {

                for (var i = 0; i < group.members.length; i++) {
                    this.appendItem(group.members[i]);
                }

            }
        });
    },

    _onClickGroupChat: function (evt, group) {
        Ns.GameHome.showGroupChat(group);
    },

    _onClickAdminsAdd: function (group) {

        var me = this;

        Ns.ui.Dialog.selectContactList({
            title: 'Add admins',
            multiSelect: true,
            onSelect: function (contants) {
                if (!contants || contants.length === 0) {
                    return;
                }
                var user_ids = [];
                for (var i = 0; i < contants.length; i++) {
                    user_ids[i] = contants[i].user_id;
                }
                var app_user_id = Ns.view.UserProfile.appUser.user_id;
                Main.ro.group.adddBulkAdmins(app_user_id, group.name, user_ids)
                        .get(function (data) {

                            Ns.view.Group.update(data.group);

                            var results = data.msg;
                            var msg_str = '';
                            for (var i = 0; i < results.length; i++) {
                                msg_str += results[i].msg + '<br/>';
                            }

                            Main.alert(msg_str, 'Message', Main.const.INFO);

                            Ns.view.Group._renderAdminsAdded.call(me, data.group);

                        })
                        .error(function (err) {
                            console.log(err);
                        });
            }
        });
    },

    _onClickMembersAdd: function (group) {

        var me = this;

        Ns.ui.Dialog.selectContactList({
            title: 'Add members',
            multiSelect: true,
            onSelect: function (contants) {
                
                if (!contants || contants.length === 0) {
                    return;
                }
                
                var user_ids = [];
                
                for (var i = 0; i < contants.length; i++) {
                    user_ids[i] = contants[i].user_id;
                }
                
                var app_user_id = Ns.view.UserProfile.appUser.user_id;
                Main.ro.group.adddBulkMembers(app_user_id, group.name, user_ids)
                        .get(function (data) {

                            Ns.view.Group.update(data.group);

                            var results = data.msg;
                            var msg_str = '';
                            for (var i = 0; i < results.length; i++) {
                                msg_str += results[i].msg + '<br/>';
                            }

                            Main.alert(msg_str, 'Message', Main.const.INFO);

                            Ns.view.Group._renderMembersAdded.call(me, data.group);

                        })
                        .error(function (err) {
                            console.log(err);
                        });
                        
            }
        });
    },

    _renderAdminsAdded: function (group) {

        this.adminList(group);

    },

    _renderMembersAdded: function (group) {

        this.memberList(group);

    },

    isLocalGroupMember: function (user_id) {

        for (var i = 0; i < Ns.view.Group.groupList.length; i++) {
            var members = Ns.view.Group.groupList[i].members;
            for (var k = 0; k < members.length; k++) {
                if (members[k].user_id === user_id) {
                    return true;
                }
            }
        }

        return false;
    },

    getInfo: function (group_name, callback, refresh) {
        var group;
        for (var i = 0; i < Ns.view.Group.groupList.length; i++) {
            if (group_name === Ns.view.Group.groupList[i].name) {
                group = Ns.view.Group.groupList[i];
                callback(group);
                if (!refresh) {
                    return;
                }
            }
        }


        Main.rcall.live(function () {
            Main.ro.group.getGroupInfo(group_name)
                    .get(function (group) {
                        if (group && group.name) {
                            Ns.view.Group.merge(group);
                            callback(group);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },
    set: function (groups) {

        if (!Main.util.isArray(groups)) {
            groups = [groups];
        }
        Ns.view.Group.groupList = groups;
        Ns.view.Group.save();
    },
    merge: function (groups) {

        if (!Main.util.isArray(groups)) {
            groups = [groups];
        }
        if (!Main.util.isArray(Ns.view.Group.groupList)) {
            Ns.view.Group.groupList = [];
        }
        var old_len = Ns.view.Group.groupList.length;
        for (var i = 0; i < groups.length; i++) {
            var found = false;
            for (var k = 0; k < old_len; k++) {
                var grps = Ns.view.Group.groupList[k];
                if (grps.name === groups[i].name) {
                    grps = groups[i]; //replace
                    found = true;
                    break;
                }
            }

            if (!found) {
                Ns.view.Group.groupList.push(groups[i]);
            }
        }

        if (Ns.view.Group.groupList.length > Ns.Const.MAX_LIST_SIZE) {
            var excess = Ns.view.Group.groupList.length - Ns.Const.MAX_LIST_SIZE;
            Ns.view.Group.groupList.splice(0, excess); //cut off the excess from the top
        }

        Ns.view.Group.save();
    },
    save: function (groups) {

        var list = Ns.view.Group.groupList;

        if (groups) {
            if (!Main.util.isArray()) {
                groups = [groups];
            }
            for (var i = 0; i < groups.length; i++) {
                for (var k = 0; k < list.length; k++) {
                    if (list[k].name === groups[i].name) {
                        list[k] = groups[i];
                    }
                }
            }
        }

        if (Main.util.isArray(list)) {
            localforage.setItem(Ns.Const.GROUP_LIST_KEY, list, function(err){
                if (err) {
                    console.log(err);
                }
            });
        }
    },
    getGroupsInfo: function (user, callback) {
        var grps = [];
        //first check locally
        var belong = user.groups_belong;
        if (belong) {//so hopefully an object
            for (var i = 0; i < belong.length; i++) {
                for (var k = 0; k < Ns.view.Group.groupList.length; k++) {
                    if (Ns.view.Group.groupList[k].name === belong[i]) {
                        grps.push(Ns.view.Group.groupList[k]);
                    }
                }
            }

            if (grps.length === belong.length) {//all was found locally
                if (Main.util.isFunc(callback)) {
                    callback(grps);
                }
                return;//so leave
            }
        }

        //get remotely

        Main.rcall.live(function () {
            var id = user;
            if (user && user.user_id) {
                id = user.user_id;
            }
            Main.ro.group.getUserGroupsInfoList(id)
                    .get(function (groups) {
                        if (!Main.util.isArray(groups)) {//just in case
                            callback([]);
                            return;
                        }
                        Ns.view.Group.merge(groups);
                        if (Main.util.isFunc(callback)) {
                            callback(groups);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },

    onClickMember: function (evt, group_name, user_id) {

        Ns.view.Group.getInfo(group_name, function (group) {
            var member;
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i].user_id === user_id) {
                    member = group.members[i];
                    break;
                }
            }

            if (evt.target.name === 'member_photo') {
                Ns.view.Group.onClickMemberPhoto(member);
            }


            if (evt.target.name === 'action') {
                if (evt.target.value.toLowerCase() === 'lets play') {
                    Ns.view.Group.onClickLetsPlay(group, member);
                }
                if (evt.target.value.toLowerCase() === 'exit group') {
                    Ns.view.Group.onClickExitGroup(group, member);
                }
            }

        });

    },

    onClickMemberPhoto: function (member) {
        Ns.ui.Photo.show(member);
    },

    onClickLetsPlay: function (group, member) {
        Ns.PlayRequest.openPlayDialog(member, group.name);
    },

    onClickExitGroup: function (group, member) {
        alert('onClickExitGroup');
    },

//more goes below
};