
/* global Main, Ns */

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

        try {
            var list = window.localStorage.getItem(Ns.Const.GROUP_LIST_KEY);
            list = JSON.parse(list);
            if (Main.util.isArray(list)) {
                Ns.view.Group.groupList = list;
            }
        } catch (e) {
            console.warn(e);
        }

        var obj = {
            group: 'info/Group'
        };
        Main.rcall.live(obj);
        Main.eventio.on('group_join_request', this.onGroupJionRequest);
    },
    content: function (group_name) {

        //find the group
        Ns.view.Group.getInfo(group_name, function (group) {
            setContent(group);
        });
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
            document.getElementById("group-details-group-name").innerHTML = group.name;
            document.getElementById("group-details-photo-url").src = group.photo_url;
            document.getElementById("group-details-status-message").innerHTML = group.status_message;
            document.getElementById("group-details-created-by").innerHTML = group.created_by;
            document.getElementById("group-details-date-created").innerHTML = group.date_created;
            document.getElementById("group-details-members-count").innerHTML = group.total_members;
            document.getElementById("group-details-admins-count").innerHTML = group.total_admins;

            /*<ul class="game9ja-user-show-list">
             
             <li><img  src="images/white_player.jpg" alt=" "/></li>
             <li>
             Chuks Alimele
             </li>
             <li>
             07083924582
             </li>
             
             <li>
             <input type="button" value="Lets play"/>
             </li>
             <li>show date joined group
             22/01/2016
             </li>
             </ul>*/

            /* 
            var admins_html = '';
            var app_user_id = Ns.view.UserProfile.appUser.user_id;
            for (var i = 0; i < group.admins.length; i++) {
                var set_exit_group = group.admins[i].user_id === app_user_id;
                admins_html += Ns.view.Group.memberHtml(group.name, group.admins[i], set_exit_group);
            }
            document.getElementById("group-details-admins").innerHTML = admins_html;

            var members_html = '';

            for (var i = 0; i < group.members.length; i++) {
                var set_exit_group = group.members[i].user_id === app_user_id;
                members_html += Ns.view.Group.memberHtml(group.name, group.members[i], set_exit_group);
            }
            document.getElementById("group-details-members").innerHTML = members_html;
            */
           
            var admins_container = '#group-details-admins';

            Main.listview.create({
                container: admins_container,
                scrollContainer: admins_container,
                tplUrl: 'group-admins-tpl.html',
                wrapItem: false,
                //itemClass: "game9ja-live-games-list",
                onSelect: function (evt, match_data) {


                },
                onRender: function (tpl_var, data) {


                },
                onReady: function () {

                    for (var i = 0; i < group.admins.length; i++) {
                        this.appendItem(group.admins[i]);
                    }

                }
            });
         
                       
            var members_container = '#group-details-members';

            Main.listview.create({
                container: members_container,
                scrollContainer: members_container,
                tplUrl: 'group-members-tpl.html',
                wrapItem: false,
                //itemClass: "game9ja-live-games-list",
                onSelect: function (evt, match_data) {


                },
                onRender: function (tpl_var, data) {


                },
                onReady: function () {

                    for (var i = 0; i < group.members.length; i++) {
                        this.appendItem(group.members[i]);
                    }

                }
            });
            
        }


        /*
         $('#group-details-back-btn').on('click', function () {
         Main.card.back({
         container: '#home-main',
         });
         });
         */
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
    save: function () {
        var list = Ns.view.Group.groupList;
        if (Main.util.isArray(list)) {
            window.localStorage.setItem(Ns.Const.GROUP_LIST_KEY, JSON.stringify(list));
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
/*
    memberHtml: function (group_name, memObj, set_exit_group) {
        var action_value = 'Lets play';
        var action_clazz = '';
        if (set_exit_group) {
            action_value = 'Exit Group';
            action_clazz = 'class="game9ja-exit-group-btn"';
        }
        var onclick_action = 'onclick = \'Ns.view.Group.onClickMember(event, "' + group_name + '","' + memObj.user_id + '")\'';


        //var id_prefix = 'game-group-' + Main.util.serilaNo() + '-';

        return '<ul ' + onclick_action + ' class="game9ja-user-show-list">'

                + '  <li><img name="member_photo"  src="' + memObj.photo_url + '" onerror="Main.helper.loadDefaultProfilePhoto(event)"  alt=" "/></li>'
                + '   <li>'
                + '       ' + memObj.full_name
                + '   </li>'
                + '    <li>'
                + '        ' + memObj.user_id
                + '    </li>'

                + '    <li>'
                + '        <input  name="action"  ' + action_clazz + ' type="button" value="' + action_value + '"/>'
                + '    </li>'
                + '    <li>'
                + '         ' + memObj.date_joined
                + '     </li>'
                + ' </ul>';
    },
*/
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
                Ns.view.Group.onClickMemberPhoto(group, member);
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

    onClickMemberPhoto: function (group, member) {
        alert('onClickMemberPhoto');
    },

    onClickLetsPlay: function (group, member) {
        Ns.game.PlayRequest.openPlayDialog(member, group.name);
    },

    onClickExitGroup: function (group, member) {
        alert('onClickExitGroup');
    },

    onGroupJionRequest: function (obj) {
        console.log(obj);
    }
//more goes below
};