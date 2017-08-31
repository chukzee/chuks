
"use strict";

var Result = require('../result');
var User = require('../info/user');

class Group extends Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;
    }

    async createGroup(obj) {

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var group = {
            name: obj.group_name,
            status_message: obj.status_message,
            photo_url: obj.photo_url,
            created_by: obj.created_by,
            members: [obj.members],
            admins: [obj.admins],
            date_created: new Date()//come back to confirm
        };

        try {
            await c.insertOne(group, {w: 'majority'});
        } catch (e) {

            //chec if the reason is because the group already exist
            try {
                var g = await c.findOne({name: group.name});
            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION
            }

            if (g) {
                this.error('group \'' + group.name + '\' name already exist!');
            } else {
                this.error('could not create group!');
            }
            return this;
        }

        return 'Created successfully.';
    }

    async editGroup(obj) {
        var editObj = {};
        var fields = ['status_message', 'photo_url'];
        this.util.copy(obj, editObj, fields);

        try {
            await c.updateOne({name: obj.group_name}, {$set: editObj}, {w: 'majority'});
        } catch (e) {
            this.error('could not edit group.');
            return this;
        }

        return true;//a default success message will be sent
    }

    async addAdmin(user_id, group_name) {
        return new User(this.Obj, this.util).addToGroup(user_id, group_name, true);
    }

    async addMember(user_id, group_name) {
        return new User(this.Obj, this.util).addToGroup(user_id, group_name, false);
    }

    async removeMember(user_id, exit_by, group_name, reason) {
        return new User(this.Obj, this.util).exitGroup(user_id, exit_by, group_name, reason);
    }

    /**
     * Gets the group info of the specified group name
     * 
     * 
     * @param {type} group_name - the group name 
     * @returns {undefined}
     */
    async getGroupInfo(group_name) {

        //simulateGroupDetails(group_name);//TESTING!!!
        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);
            var group = await c.findOne({name: group_name});

            //get the group members info

            var failed_commit_members = [];
            var members_ids = [];
            var group_members = group.members;
            if (!Array.isArray(group_members)) {
                group_members = [];
            }
            for (var k = 0; k < group_members.length; k++) {
                if (!group_members[k].committed) {
                    var uncommitObj = {
                        group_name: group.name,
                        member_id: group_members[k].user_id
                    };
                    failed_commit_members.push(uncommitObj);
                    group_members.splice(k, 1);//delete from the list.
                    k--;//go back one step
                    continue;//skip - obviously the group member was not properly added - we will correct that
                }
                members_ids.push(group_members[k].user_id);
            }


            if (failed_commit_members.length) {//remove 'fauked commit' members
                this._removeFailedCommitMembers(failed_commit_members);
            }

            var users_list = await new User(this.sObj, this.util).getInfoList(members_ids);
            //we expect an array of user info
            if (!Array.isArray(users_list)) {
                this.error('could not get groups info');
                return this;
            }

            //at this point the users info was gotten correctly

            if (!Array.isArray(group.members)) {
                group.members = [];//initialize
            }
            var group_members = group.members;
            for (var k = 0; k < group_members.length; k++) {
                for (var n = 0; n < users_list.length; n++) {
                    if (users_list[n].user_id === group_members[k].user_id) {
                        //copy (merging) the object users_list[n] to group_members[k] to
                        // complete the user object info related to the group
                        this.util.merge(users_list[n], group_members[k]);
                        break;
                    }
                }
            }

            group.admins = Array.isArray(group.members) ? Array.filter(function (member) {
                return member.is_admin;
            }) : [];

            group.total_members = this.util.length(group.members);
            group.total_admin = this.util.length(group.admins);


            //this.sObj.db.close();//not neccessary - the driver does the connection pooling automatically
        } catch (e) {
            this.error("Could not get group info!");
            return this;
        }

        return group;
    }

    /**
     * This is used to remove member from the group that was not properly
     * added due to error. 
     * the flag 'committed' is used to track this error using the two phase
     * commit or rollback technique for MongoDB. If the 'committed' flag is false
     * that means the member was not successfully added to the group and must be 
     * removed using this method
     * 
     * @param {type} argu1
     * @param {type} argu2
     * @returns {undefined}
     */
    _removeFailedCommitMembers(argu1, argu2) {
        var arr = [];
        if (arguments.length > 1) {
            arr[0] = {group_name: argu1, member_id: argu2};
        }
        if (arguments.length > 1) {
            if (Array.isArray(argu1)) {
                arr = argu1;
            } else {
                arr[0] = argu1;
            }
        } else {
            return;
        }

        var oredArr = [];
        for (var i = 0; i < arr.length; i++) {
            oredArr[i] = arr[i].group_name;
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);
        c.find({$or: oredArr}).toArray(function (err, groups) {
            if (err) {
                console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                return;
            }
            var batch = c.initializeUnorderedBulkOp();
            for (var i in groups) {
                var members = groups[i].members;
                if (!Array.isArray(members)) {
                    continue;
                }

                for (var k = 0; k < members.length; k++) {
                    if (members[k].committed === false) {
                        members.splice(k, 1);//removed the 'failed commit' member
                        k--;
                    }
                }

                batch.update({name: groups[i].name}, {$set: {members: members}});
            }
            
            batch.execute()
                    .then(function (result) {
                        //do nothing
                    })
                    .catch(function (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                    });

        });

    }

    /**
     * Gets the group info of the groups array specified
     *      
     * @param {type} group_names_arr - expected a user id or a function callback
     * @returns {undefined}
     */
    async getGroupsInfoList(group_names_arr) {

        if(!Array.isArray(group_names_arr)){
            return [];
        }

        //simulateUserGroupsInfo(group_names_arr);//TESTING!!!
        var oredArr = [];
        for (var i = 0; i < group_names_arr.length; i++) {
            oredArr = {name: group_names_arr[i]};
        }
        var c = this.sObj.db.collection(this.sObj.col.groups);

        var groups = await c.find({$or: oredArr}).toArray();
        var members_ids = [];
        var failed_commit_members = [];
        for (var i = 0; i < groups.length; i++) {

            if (!Array.isArray(groups[i].members)) {
                groups[i].members = [];
                continue;
            }
            var group_members = groups[i].members;

            for (var k = 0; k < group_members.length; k++) {
                if (!group_members[k].committed) {
                    var uncommitObj = {
                        group_name: groups[i].name,
                        member_id: group_members[k].user_id
                    };
                    failed_commit_members.push(uncommitObj);
                    group_members.splice(k, 1);//delete from the list.
                    k--;//go back one step
                    continue;//skip - obviously the group member was not properly added - we will correct that
                }
                members_ids.push(group_members[k].user_id);
            }
        }

        if (failed_commit_members.length) {//remove 'fauked commit' members
            this._removeFailedCommitMembers(failed_commit_members);
        }

        var users_list = await new User(this.sObj, this.util).getInfoList(members_ids);
        //we expect an array of user info
        if (!Array.isArray(users_list)) {
            this.error('could not get groups info');
            return this;
        }

        //at this point the users info was gotten correctly
        for (var i = 0; i < groups.length; i++) {

            if (!Array.isArray(groups[i].members)) {
                groups[i].members = [];//initialize
                continue;
            }
            var group_members = groups[i].members;

            for (var k = 0; k < group_members.length; k++) {
                for (var n = 0; n < users_list.length; n++) {
                    if (users_list[n].user_id === group_members[k].user_id) {
                        //copy (merging) the object users_list[n] to group_members[k] to
                        // complete the user object info related to the group
                        this.util.merge(users_list[n], group_members[k]);
                        break;
                    }
                }
            }
        }

        return groups;
    }
    /**
     * Get the list of groups belong to by this user. The list consist of 
     * the group info.
     * 
     * @param {type} user_id
     * @returns {nm$_group.Group.getGroupsInfoList.groups|Group.getGroupsInfoList.groups|Array|undefined|nm$_group.Group}
     */
    async getUserGroupsInfoList(user_id){
        try {
            
            var c = this.sObj.db.collection(this.sObj.col.users);
            var user = await c.findOne({user_id: user_id});
            
            return this.getGroupsInfoList(user.groups_belong);
            
        } catch (e) {
            this.error('could not get user groups info');
            return this;
        } 
    }

}

module.exports = Group;
