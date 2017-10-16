
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

            var admins_html = '';
            for (var i = 0; i < group.admins.length; i++) {
                var set_exit_group = group.members[i].user_id === app_user_id;
                admins_html += Ns.view.Group.memberHmtl(group.admins[i], set_exit_group);
            }
            document.getElementById("group-details-admins").innerHTML = admins_html;

            var members_html = '';
            var app_user_id = Ns.view.UserProfile.appUser.user_id;
            for (var i = 0; i < group.members.length; i++) {
                var set_exit_group = group.members[i].user_id === app_user_id;
                members_html += Ns.view.Group.memberHmtl(group.members[i], set_exit_group);
            }
            document.getElementById("group-details-members").innerHTML = members_html;

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
                        if (Main.util.isFunc(groups)) {
                            callback(groups);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },
    memberHmtl: function (memObj, set_exit_group) {
        var action_value = 'Lets play';
        var action_clazz = '';
        if (set_exit_group) {
            action_value = 'Exit Group';
            action_clazz = 'class="game9ja-exit-group-btn"';
        }
        var click_handler = 'Ns.view.Group.onClickMember("'+memObj.user_id+'")';
        if(memObj.is_admin){
            clickEvt = 'Ns.view.Group.onClickAdmin("'+memObj.user_id+'")';
        }

        //var id_prefix = 'game-group-' + Main.util.serilaNo() + '-';

        return '<ul onclick="'+click_handler+'" class="game9ja-user-show-list">'

                + '  <li><img  src="' + memObj.photo_url + '" onerror="Main.helper.loadDefaultProfilePhoto(event)"  alt=""/></li>'
                + '   <li>'
                + '       ' + memObj.full_name 
                + '   </li>'
                + '    <li>'
                + '        ' + memObj.user_id 
                + '    </li>'

                + '    <li>'
                + '        <input ' + action_clazz + ' type="button" value="' + action_value + '"/>'
                + '    </li>'
                + '    <li>show date joined group'
                + '         ' + memObj.date_joined 
                + '     </li>'
                + ' </ul>';
    },

    onClickMember : function(user_id){
        alert(user_id);
    },

    onClickAdmin : function(user_id){
        alert(user_id);
    },
    
    onGroupJionRequest: function (obj) {
        console.log(obj);
    }
//more goes below
};