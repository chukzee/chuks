
"use strict";

var Result = require('../result'); 
var User = require('../info/user');

class Group extends Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;
    }

    /**
     * Send group join request to a user. Only group admin can
     * send this request.
     * 
     * @param {type} from_user_id -  must be a group admin. Only groups can send group join request- This honestly makes better sense. The only ideal of any user sending group join request to a group admin is incorrect!
     * @param {type} to_user_id - user id of user to whom the group join request by a group admin
     * @param {type} group_name
     * * @returns {String}
     */
    async sendGroupJoinRequest(from_user_id, to_user_id, group_name) {

        var req_col = this.sObj.db.collection(this.sObj.col.group_join_requests);

        try {

            var adminQuery = {
                $and: [
                    {
                        group_name: group_name
                    },
                    {
                        'memmbers.user_id': from_user_id
                    },
                    {
                        'memmbers.is_admin': true
                    }
                ]
            };

            //first check if the user is an admin
            var admin = await req_col.findOne(adminQuery, {_id : 0});

            if (!admin) {
                this.error("Not authorize to send this request. Must be a group admin.");
                return this;
            }

            var authorization_token; //TODO - A uuid like string

            var gjDoc = {
                authorization_token: authorization_token,
                admin_user_id: from_user_id,
                requested_user_id: to_user_id,
                group_name: group_name
            };

            await req_col.insertOne(gjDoc); //await the asynchronous process

            var data = {
                group_name: group_name,
                authorization_token: authorization_token,
                acknowledge_received_by: to_user_id, //this will make the client send feedback to the server that it receive the data
                acknowledge_received_action: ""//action to take by the serve if the acknowledgement
            };

            this.sObj.redis.publish(this.sObj.PUBSUB_SEND_GROUP_JOIN_REQUEST, data);

        } catch (e) {

            console.log(e);

            return this.error("Failed to send request!");
        }


        return "Requset sent successfully.";
    }

    /**
     * Accept a group join request and adds the user to the group
     * 
     * @param {type} authorization_token - this is the autorization sent by the admin to rhe user -  the server must confirm this token before adding the user to the group
     * @returns {undefined}
     */
    async acceptGroupJionRequest(authorization_token) {

        var req_col = this.sObj.db.collection(this.sObj.col.group_join_requests);
        try {
            var request = await req_col.findOne({authorization_token: authorization_token}, {_id : 0});
        } catch (e) {

            console.log(e);

            return this.error("Failed to accept group join request!");
        }


        if (request) {
            return this._addToGroup(request.requested_user_id, request.group_name, false);
        }

        this.error("Unknown group join authoriztion token.");
        return this;
    }

    _groupMemberObj(user_id, is_admin, commit) {
        return  {
            user_id: user_id,
            is_admin: !is_admin ? false : true,
            date_joined: new Date(),
            committed: !commit ? false : true
        };
    }

    async _addToGroup(user_id, group_name, is_admin) {

        var group_col = this.sObj.db.collection(this.sObj.col.groups);
        var me = this;
        var memberObj = {};
        var group_members = [];

        return group_col.findOne({name: group_name}, {_id : 0})
                .then(function (group) {
                    if (!Array.isArray(group.members)) {
                        group.members = [];
                    }

                    if (group.members.length >= me.sObj.MAX_GROUP_MEMBERS) {
                        me.error("Maximum group members exceeded! Limit allowed is " + me.sObj.MAX_GROUP_MEMBERS + ".");
                        return Promise.reject(me);
                    }

                    memberObj = me._groupMemberObj(user_id, is_admin, false);
                    //we will commit the update if all 
                    //operation is successful - the variable we help us detect if
                    //the member addition is inconsistent so that we call remove it
                    // when iterating members of a group and detected that the value is false.
                    //This is our simple implementation of two phase commit or rollback 
                    //recommended by MongoDB as an alternative for RDBMS like transaction

                    group.members.push(memberObj);

                    group_members = group.members; // set the group memeber - 
                    //will be needed dow below for committing this operation

                    return  group_col.update({name: group_name}, {$set: {members: group.members}}, {w: 'majority'});
                })
                .then(function () {
                    var user_col = this.sObj.db.collection(this.sObj.col.users);
                    return user_col.findOne({user_id: user_id}, {_id : 0})
                            .then(function (user) {
                                if (!Array.isArray(user.groups_belong)) {
                                    user.groups_belong = [];
                                }
                                user.groups_belong.push(group_name);
                                return  user_col.update({user_id: user_id}, {$set: {groups_belong: user.groups_belong}}, {w: 'majority'});
                            });
                })
                .then(function () {
                    //now commit the change
                    memberObj.committed = true;
                    return group_col.update({name: group_name}, {$set: {members: group_members}}, {w: 'majority'});
                })
                .then(function () {
                    return "User added to group successfully.";
                });

    }

    async createGroup(obj) {

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var member = _groupMemberObj(obj.created_by, true, true);
        var group = {
            name: obj.group_name,
            status_message: obj.status_message,
            photo_url: obj.photo_url,
            created_by: obj.created_by,
            members: [member],
            admins: [member],
            date_created: member.date_joined ? member.date_joined : new Date()
        };

        try {
            await c.insertOne(group, {w: 'majority'});
        } catch (e) {

            //check if the reason is because the group already exist
            try {
                var g = await c.findOne({name: group.name}, {_id : 0});
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
        var c = this.sObj.db.collection(this.sObj.col.groups);
        try {
            await c.updateOne({name: obj.group_name}, {$set: editObj}, {w: 'majority'});
        } catch (e) {
            this.error('could not edit group.');
            return this;
        }

        return true;//a default success message will be sent
    }

    async makeAdmin(user_id, new_admin_user_id, group_name) {

        try {
            //find check if the user to do this is authorized
            var c = this.sObj.db.collection(this.sObj.col.groups);

            var adminQuery = {
                $and: [
                    {
                        group_name: group_name
                    },
                    {
                        'memmbers.user_id': user_id//query does not require positional $ operator to access the field
                    },
                    {
                        'memmbers.is_admin': true//query does not require positional $ operator to access the field
                    }
                ]
            };

            //first check if the user is an admin
            var admin = await c.findOne(adminQuery, {_id : 0});

            if (!admin) {
                this.error("Not authorize to make another user an admin.");
                return this;
            }
            
            //ok you a free to make one of you member an admin
            var newAdmin = {
                $and: [
                    {
                        group_name: group_name
                    },
                    {
                        'memmbers.$.user_id': new_admin_user_id //using positional $ operator and dot '.' to access the user_id and set update the value
                    },
                    {
                        'memmbers.$.is_admin': true //using positional $ operator and dot '.' to access the is_admin and set update the value
                    }
                ]
            };
                
            var result  = await c.updateOne({name: obj.group_name}, {$set: newAdmin}, {w: 'majority'});
        } catch (e) {
            this.error('could not edit group.');
            return this;
        }

        return true;//a default success message will be sent
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
            var group = await c.findOne({name: group_name}, {_id : 0});

            //get the group members info

            //var failed_commit_members = [];
            var hasFailedUncommitMember = false;
            var members_ids = [];
            var group_members = group.members;
            if (!Array.isArray(group_members)) {
                group_members = [];
            }
            for (var k = 0; k < group_members.length; k++) {
                if (!group_members[k].committed) {
                    hasFailedUncommitMember = true;
                    /*
                     * 
                     var uncommitObj = {
                     group_name: group.name,
                     member_id: group_members[k].user_id
                     };
                     failed_commit_members.push(uncommitObj);
                     */
                    group_members.splice(k, 1);//delete from the list.
                    k--;//go back one step
                    continue;//skip - obviously the group member was not properly added - we will correct that
                }
                members_ids.push(group_members[k].user_id);
            }


            if (hasFailedUncommitMember) {//remove 'fauked commit' members
                this._removeFailedCommitMembers(group_name);
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
     * @param {type} group_names_arr
     * @returns {undefined}
     */
    _removeFailedCommitMembers(group_names_arr) {

        if (!isArray(group_names_arr)) {
            group_names_arr = [group_names_arr]; //convert to array
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var objFailedCommit = {};

        var field = this.sObj.col.groups + '.members.committed';

        objFailedCommit[field] = false;

        //using $in operator to pick the docs to update and
        //using the $pull operator remove the elements from the array of members not committed
        c.update({name: {$in: group_names_arr}}, {$pull: objFailedCommit}, function (err, groups) {
            if (err) {
                console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                return;
            }

        });

    }

    /**
     * Gets the group info of the groups array specified
     *      
     * @param {type} group_names_arr - expected a user id or a function callback
     * @returns {undefined}
     */
    async getGroupsInfoList(group_names_arr) {


        if (!Array.isArray(group_names_arr)) {
            return [];
        }

        //simulateUserGroupsInfo(group_names_arr);//TESTING!!!
        var oredArr = [];
        for (var i = 0; i < group_names_arr.length; i++) {
            oredArr = {name: group_names_arr[i]};
        }

        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);
            var groups = await c.find({$or: oredArr}, {_id : 0}).toArray();

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION
            this.error("could not get groups info.");
            return this;
        }
        var members_ids = [];
        //var failed_commit_members = [];
        var hasFailedUncommitMember = false;
        var fail_groups = [];
        for (var i = 0; i < groups.length; i++) {

            if (!Array.isArray(groups[i].members)) {
                groups[i].members = [];
                continue;
            }
            var group_members = groups[i].members;
            var found_failed_commit = false;
            for (var k = 0; k < group_members.length; k++) {
                if (!group_members[k].committed) {
                    hasFailedUncommitMember = true;
                    found_failed_commit = true;
                    /*@deprecated not neccessary
                     * var uncommitObj = {
                     group_name: groups[i].name,
                     member_id: group_members[k].user_id
                     };
                     failed_commit_members.push(uncommitObj);
                     */

                    group_members.splice(k, 1);//delete from the list.
                    k--;//go back one step
                    continue;//skip - obviously the group member was not properly added - we will correct that
                }
                members_ids.push(group_members[k].user_id);
            }

            if (found_failed_commit) {
                fail_groups.push(groups[i].name);
            }
        }

        if (hasFailedUncommitMember) {//remove 'failed commit' members
            this._removeFailedCommitMembers(fail_groups);
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
    async getUserGroupsInfoList(user_id) {
        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var user = await c.findOne({user_id: user_id}, {_id : 0});

            return this.getGroupsInfoList(user.groups_belong);

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION

            this.error('could not get user groups info');
            return this;
        }
    }

}

module.exports = Group;
