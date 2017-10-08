
Ns.view.Group = {

    /**
     * holds array of group names the app user belong to
     * e.g
     * //structure
     * 
     * ['group_name_1','group_name_2','group_name_3','group_name_4']
     * 
     * @type type
     */
    groupsBelong: [],

    /**
     * holds list of group info against the group name
     * e.g
     * //object structure
     * {
     *  group_name_1 : {name:..., photo:...,date_created:..., created_by: members : [...array of member user_id....] etc.}
     *  group_name_2 : {name:..., photo:...,date_created:..., created_by: members : [...array of member user_id....] etc.}
     *  group_name_3 : {name:..., photo:...,date_created:..., created_by: members : [...array of member user_id....] etc.}
     *  group_name_4 : {name:..., photo:...,date_created:..., created_by: members : [...array of member user_id....] etc.}
     *  group_name_5 : {name:..., photo:...,date_created:..., created_by: members : [...array of member user_id....] etc.}
     * }
     * @type type
     */
    groupList: {},

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        var obj = {
            group: 'info/Group',
            //more may go below
        };

        Main.rcall.live(obj);

        Main.eventio.on('group_join_request', this.onGroupJionRequest)

    },

    content: function () {

    },

    onGroupJionRequest: function (obj) {
        console.log(obj);
    }
    //more goes below
};