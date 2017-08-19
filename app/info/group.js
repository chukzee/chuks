
"use strict";

var Base = require('../base');

class Group extends Base {

    constructor(sObj) {
        super(sObj);

    }

    async addMember(username) {
    }

    async removeMember(username) {

    }

    /**
     * Gets the group names of all the groups the user of the specified
     * 
     * If a function callback is passed a parameter then a reponse is not sent
     * but rather the function is called when done.
     * 
     * @param {type} param - expected a user id or a function callback
     * @returns {undefined}
     */
    async getUserGroupNames(param) {

        simulateUserGroupNames(param);//TESTING!!!

    }

    /**
     * Gets the group info of the specified group name
     * 
     * 
     * @param {type} group_name - the group name 
     * @returns {undefined}
     */
    async getGroupDetails(group_name) {

        simulateGroupDetails(group_name);//TESTING!!!

    }
    
    /**
     * Gets the group info of all the groups the user of the specified
     * 
     * If a function callback is passed a parameter then a reponse is not sent
     * but rather the function is called when done.
     * 
     * @param {type} param - expected a user id or a function callback
     * @returns {undefined}
     */
    async getUserGroupsInfo(param) {

        simulateUserGroupsInfo(param);//TESTING!!!

    }

    simulateUserGroupsInfo(param) {

        var arr = [];
        for (var i = 0; i < 5; i++) {
            var group = {
                name: 'group_' + i,
                status_message: 'status_message_' + i,
                photo: 'photo_' + i,
                created_by: 'created_by_' + i,
                date_created: 'date_created_' + i,
                total_members: 67,
                total_admins: 3,
                admin_users: simulateGroupMembers(3), //yes admin users are group member
                members: simulateGroupMembers(67),

            };

            arr.push(group);
        }

        if (this.isFunc(param)) {
            param();
        } else {
            this.replySuccess(arr);
        }
        
        function simulateGroupMembers(n) {
            var members = [];
            for (var i = 0; i < n; i++) {
                members[i] = {
                    user_id: i === 0 ? '07038428492' : 'user_id_' + i,
                    full_name: i === 0 ? 'Chuks Alimele' : 'Firstname_' + i + ' Lastname_' + i,
                    phone_no: i === 0 ? '07038428492' : '070' + i + '3' + '44' + '20' + i,
                    date_joined: new Date().getTime() - 24 * i * 60 * 60 * 1000
                };
            }
        }
        ;

    }

}

module.exports = Group;
