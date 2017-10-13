
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

        var obj = {
            group: 'info/Group'
        };

        Main.rcall.live(obj);

        Main.eventio.on('group_join_request', this.onGroupJionRequest);

    },

    content: function () {

    },

    getUserGroupsInfo: function (callback) {
        
        Main.rcall.live(function () {
            Main.ro.group.getGroupsInfoList(Ns.view.UserProfile.appUser.groups_belong)
                    .get(function (groups) {
                        if (groups.length === 0) {
                            return;
                        }
                        Ns.view.Group.groupList = groups;

                        callback(groups);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },

    onGroupJionRequest: function (obj) {
        console.log(obj);
    }
    //more goes below
};