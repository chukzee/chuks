
"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Group extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    async _lock(group_name) {
        console.log('here 1');
        if (this._is_lock) {
            if (this._group_name_lock !== group_name) {
                throw new Error('Cannot lock more than one groups.');
            }
            return true;
        }
        console.log('here 2');
        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);

            console.log('group_name', group_name);
            console.log(await c.findOne({name: group_name}));//TESTING!!!

            var r = await c.updateOne({name: group_name}, {
                $set: {
                    _lock: true
                }});

            console.log('r.result.nModified', r.result.nModified);
            console.log('r.result', r.result);

            if (r.result.nModified === 0) {
                return false;
            }

            r = await c.updateOne({name: group_name}, {
                $set: {
                    _lock_time: new Date(),
                    _lock_process_ns: this.sObj.PROCESS_NS
                }});

        } catch (e) {

            console.log(e);

            return false;
        }

        this._group_name_lock = group_name;

        this._is_lock = true;
        console.log('here 3');
        return this._is_lock;
    }

    async _unlock() {
        if (!this._is_lock) {
            return;
        }

        console.log('_unlock called');//TESTING!!!

        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);

            await c.updateOne({name: this._group_name_lock}, {
                $set: {
                    _lock: false,
                    _lock_time: new Date(),
                    _lock_process_ns: this.sObj.PROCESS_NS
                }});

        } catch (e) {
            console.log(e);
        }

    }

    _onFinish() {
        this._unlock();
    }

    set _group_name_lock(name) {
        this._grp_name_lock = name;
    }

    get _group_name_lock() {
        return this._grp_name_lock;
    }
    set _is_lock(b) {
        this._islock = b;
    }

    get _is_lock() {
        return this._islock;
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

        var c = this.sObj.db.collection(this.sObj.col.groups);

        try {

            var adminQuery = {
                $and: [
                    {
                        name: group_name
                    },
                    {
                        'members.user_id': from_user_id
                    },
                    {
                        'members.is_admin': true
                    },
                    {
                        'members.committed': true
                    }
                ]
            };

            //first check if the user is an admin
            var admin = await c.findOne(adminQuery, {_id: 0});

            if (!admin) {
                return "Not authorize to send this request. Must be a group admin.";
            }

            var authorization_token = this.sObj.UniqueNumber;

            var gjDoc = {
                authorization_token: authorization_token,
                admin_user_id: from_user_id,
                requested_user_id: to_user_id,
                group_name: group_name
            };

            var req_col = this.sObj.db.collection(this.sObj.col.group_join_requests);
            await req_col.insertOne(gjDoc); //await the asynchronous process

            var data = {
                group_name: group_name,
                authorization_token: authorization_token
            };

            this.send(this.evt.group_join_request, data, to_user_id, true);

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
    async acceptGroupJoinRequest(authorization_token) {

        var req_col = this.sObj.db.collection(this.sObj.col.group_join_requests);
        try {
            var request = await req_col.findOne({authorization_token: authorization_token}, {_id: 0});
        } catch (e) {

            console.log(e);

            return this.error("Failed to accept group join request!");
        }


        if (!request) {
            return this.error("Unknown group join authoriztion token.");
        }


        return this._addToGroup(request.requested_user_id, request.group_name, false);
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

        //acquire lock with the specified number of trials
        var lock_result = await this._tryWith(this._lock, 3, 0, group_name);

        console.log('lock_result', lock_result);

        if (!lock_result) {
            return 'Server busy!'; //failed to acquire lock after the specifed number of trials
        }

        var group_col = this.sObj.db.collection(this.sObj.col.groups);
        var me = this;
        var memberObj = {};
        var group_members = [];

        return group_col.findOne({name: group_name}, {_id: 0})
                .then(function (group) {
                    if (!group) {
                        return Promise.reject('Not a group');
                    }

                    if (!Array.isArray(group.members)) {
                        group.members = [];
                    }

                    if (group.members.length >= me.sObj.MAX_GROUP_MEMBERS) {
                        return Promise.reject("Maximum group members exceeded! Limit allowed is " + me.sObj.MAX_GROUP_MEMBERS + ".");
                    }

                    memberObj = me._groupMemberObj(user_id, is_admin, false);
                    //we will commit the update if all 
                    //operation is successful - the variable we help us detect if
                    //the member addition is inconsistent so that we call remove it
                    // when iterating members of a group and detected that the value is false.
                    //This is our simple implementation of two phase commit or rollback 
                    //recommended by MongoDB as an alternative for RDBMS like transaction

                    //check if the member already exist
                    for (var i = 0; i < group.members.length; i++) {
                        if (group.members[i].user_id === user_id) {
                            return Promise.reject(`User already exist in the group - ${user_id}`);
                        }
                    }

                    group.members.push(memberObj);

                    group_members = group.members; // set the group memeber - 
                    //will be needed down below for committing this operation

                    return  group_col.update({name: group_name}, {$set: {members: group.members}}, {w: 'majority'});
                })
                .then(function () {
                    var user_col = me.sObj.db.collection(me.sObj.col.users);
                    return  user_col.updateOne({user_id: user_id}, {$addToSet: {groups_belong: group_name}}, {w: 'majority'});
                })
                .then(function () {
                    //now commit the change
                    memberObj.committed = true;
                    return group_col.updateOne({name: group_name}, {$set: {members: group_members}}, {w: 'majority'});
                })
                .then(function () {
                    return "User added to group successfully.";
                });

    }

    async createGroup(user_id, group_name, status_message, photo_url) {


        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
            status_message = arguments[0].status_message;
            photo_url = arguments[0].photo_url;
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var member = this._groupMemberObj(user_id, true, true);
        var group = {
            name: group_name,
            status_message: status_message,
            photo_url: photo_url,
            created_by: user_id,
            date_created: member.date_joined ? member.date_joined : new Date(),
            members:[]
        };

        try {
            await c.insertOne(group, {w: 'majority'});//create the group
        } catch (e) {

            //check if the reason is because the group already exist
            try {
                var g = await c.findOne({name: group.name}, {_id: 0});
            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION
            }

            if (g) {
                return this.error('Group \'' + group.name + '\' already exist!');
            } else {
                return this.error('Could not perform operaton!');
            }
        }

        try {
            await this._addToGroup(user_id, group_name, true); // add the member to the group and other neccessary things
        } catch (e) {

            console.log(e);//DO NOT DO THIS IN PRODUCTION

            return this.error('Could not perform operaton!');

        }

        return 'Created successfully.';
    }

    async editGroup(user_id, group_name, status_message, photo_url) {
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
            status_message = arguments[0].status_message;
            photo_url = arguments[0].photo_url;
        }

        //first check if the user is authorize to edit the group

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var group = await c.findOne(
                {
                    name: group_name,
                    'members.user_id': user_id
                });


        if (!group) {
            return 'Not a memer or group!';
        }

        if (Array.isArray(group.members)) {
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i].user_id === user_id) {
                    if (!group.members[i].is_admin) {
                        return 'Not authorized';
                    }
                    break;
                }
            }
        } else {
            return 'No member!';
        }

        var setObj = {};
        if (status_message) {
            setObj.status_message = status_message;
        }

        if (photo_url) {
            setObj.photo_url = photo_url;
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);
        try {
            await c.updateOne({name: group_name}, {$set: setObj}, {w: 'majority'});
        } catch (e) {
            console.log(e);
            this.error('Could not edit group.');
            return this;
        }

        return true;//a default success message will be sent
    }

    async makeAdmin(user_id, new_admin_user_id, group_name) {

        try {
            //find check if the user to do this is authorized - ie an admin - only admins can make another user admin
            var c = this.sObj.db.collection(this.sObj.col.groups);

            var adminQuery = {
                $and: [
                    {
                        name: group_name
                    },
                    {
                        'members.user_id': user_id//query does not require positional $ operator to access the field
                    },
                    {
                        'members.is_admin': true//query does not require positional $ operator to access the field
                    },
                    {
                        'members.committed': true
                    }
                ]
            };

            //first check if the user is an admin
            var admin = await c.findOne(adminQuery, {_id: 0});



            if (!admin) {
                return "Not authorized to make another user an admin.";
            }

            //ok you are free to make one of your members an admin
            /**
             *
             * @deprecated NOT WORKING AS EXPECTED IF UNCOMMITTED ENTRIES ARE INSIDE
             *
             var newAdminQuery = {
             $and: [
             {
             name: group_name
             },
             {
             'members.user_id': new_admin_user_id
             },
             {
             'members.is_admin': false
             },
             {
             'members.committed': true
             }
             ]
             };
             
             
             //var rs = await c.update(newAdminQuery, {$set: {'members.$.is_admin': true}}, { w: 'majority'});//NOT WORKING PROPERLY IF UNCOMMITTED ENTRIES IN INSIDE
             
             */


            var group = await c.findOne({name: group_name}, {_id: 0});

            if (!group) {
                return 'Not a group';
            }

            if (!Array.isArray(group.members)) {
                group.members = [];
            }

            var found_member;
            for (var i = 0; i < group.members.length; i++) {
                if (!group.members[i].committed) {
                    group.members.splice(i, 1);
                    i--;
                    continue;
                }
                if (group.members[i].user_id === new_admin_user_id) {
                    if (group.members[i].is_admin) {
                        return "member is already an admin";
                    }
                    group.members[i].is_admin = true;
                    found_member = group.members[i];
                }
            }

            if (!found_member) {
                return `Admin member not found - ${new_admin_user_id}`;
            }

            await c.updateOne({name: group_name}, {$set: {members: group.members}});

            console.log(await c.findOne({name: group_name}, {_id: 0}));//TESTING!!!

            if (group.members.length === 0) {
                return 'No member';
            }

            return "Created admin succesfully.";

        } catch (e) {
            console.log(e);
            this.error('Could not perform operaton.');
            return this;
        }

        return true;//a default success message will be sent
    }

    async removeAdminPosition(user_id, demoted_admin_user_id, group_name) {

        try {
            //find check if the user to do this is authorized - ie an admin - only admins can make another user admin
            var c = this.sObj.db.collection(this.sObj.col.groups);


            //first check if the user is an admin
            var group = await c.findOne({name: group_name}, {_id: 0});
            if (!group) {
                return 'Not a group';
            }
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i].committed
                        && group.members[i].user_id === user_id
                        && !group.members[i].is_admin) {
                    return "Not authorized to make another user an admin.";
                }
            }

            //also the creator of the group cannot be demoted
            if (group.created_by === demoted_admin_user_id) {
                return "Cannot demote the group creator!";
            }

            /**
             * @deprecated NOT WORKING AS EXPECTED IF UNCOMMITTED ENTRIES ARE INSIDE
             //ok you are free to make one of your members an admin
             var demotedAdminQuery = {
             $and: [
             {
             name: group_name
             },
             {
             'members.user_id': demoted_admin_user_id
             },
             {
             'members.is_admin': true
             },
             {
             'members.committed': true
             }
             ]
             };
             
             //using positional $ operator and dot '.' to access the user_id and set update the value
             
             //do not use updateOne here but rather use update - since there is possibility of duplicates of uncommitted entries
             //which will affect the result
             var rs = await c.update(demotedAdminQuery, {$set: {'members.$.is_admin': false}}, {w: 'majority'});
             
             var result = rs.result;
             
             if (result.n > 0 && result.nModified > 0) {
             return "demoted user succesfully.";
             } else if (result.n > 0 && result.nModified === 0) {
             return "member is already not an admin";
             }
             */


            var group = await c.findOne({name: group_name}, {_id: 0});

            if (!group) {
                return 'Not a group';
            }

            if (!Array.isArray(group.members)) {
                group.members = [];
            }

            var found_member;

            for (var i = 0; i < group.members.length; i++) {
                if (!group.members[i].committed) {
                    group.members.splice(i, 1);
                    i--;
                    continue;
                }
                if (group.members[i].user_id === demoted_admin_user_id) {
                    if (!group.members[i].is_admin) {
                        return "member was not an admin!";
                    }
                    group.members[i].is_admin = false;
                    found_member = group.members[i];
                }
            }

            if (!found_member) {
                return `Admin member not found - ${demoted_admin_user_id}`;
            }

            await c.updateOne({name: group_name}, {$set: {members: group.members}});

            console.log(await c.findOne({name: group_name}, {_id: 0}));//TESTING!!!

            if (group.members.length === 0) {
                return 'No member';
            }

            return "removed admin role succesfully.";

        } catch (e) {
            console.log(e);
            this.error('Could not perform operaton.');
            return this;
        }

        return true;//a default success message will be sent
    }

    /**
     * Used to exist  or remove member from a group
     * 
     * @param {type} target_user_id - user being exited
     * @param {type} exit_by user who authorized the exit -  must be either the user existing or the group admin
     * @param {type} group_name - roup name
     * @param {type} reason - reason for the exit 
     * @returns {undefined}
     */
    async removeMember(target_user_id, exit_by, group_name, reason) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            target_user_id = arguments[0].user_id;
            exit_by = arguments[0].exit_by;
            group_name = arguments[0].group_name;
            reason = arguments[0].reason;
        }

        var group_col = this.sObj.db.collection(this.sObj.col.groups);
        var me = this;

        return group_col.findOne({name: group_name}, {_id: 0})
                .then(function (group) {
                    if (!group) {
                        return Promise.reject('Not a group');
                    }
                    if (!Array.isArray(group.members)) {
                        group.members = [];
                    }
                    var isExitByAdmin = false;
                    var found_member;
                    for (var i = 0; i < group.members.length; i++) {
                        if (!group.members[i].committed) {
                            group.members.splice(i, 1);//remove the uncommitted member
                            i--;
                            continue;
                        }
                        if (group.members[i].user_id === exit_by) {//check if the exit_by is an admin
                            isExitByAdmin = group.members[i].is_admin;
                        }

                        if (group.members[i].user_id === target_user_id) {
                            found_member = group.members[i];
                            group.members.splice(i, 1);//remove the member temporarily
                            i--;
                            continue;
                        }
                    }

                    if (!found_member) {
                        return Promise.reject(`Member not found - ${target_user_id}`);
                    }


                    if (!isExitByAdmin && target_user_id !== exit_by) {
                        return Promise.reject("Unauthorized operation! You must either be the group admin or the user being removed!");
                    }

                    //also the group creator cannot remove himself because with him ther is no group
                    if (target_user_id === group.created_by) {
                        return Promise.reject("A user cannot exit a group he created!");
                    }

                    //effect the removal
                    if (!Array.isArray(group.exited_members)) {
                        group.exited_members = [];
                    }
                    var exitedMemberObj = {};
                    exitedMemberObj.user_id = target_user_id;
                    exitedMemberObj.reason = reason;
                    exitedMemberObj.exit_by = exit_by;
                    exitedMemberObj.exit_date = new Date();

                    console.log('group.exited_members', group.exited_members);

                    group.exited_members.push(exitedMemberObj);
                    //but first remove the group name from the 'groups_belong' field 
                    //array of the users collection
                    var user_col = me.sObj.db.collection(me.sObj.col.users);
                    return user_col.updateOne({user_id: target_user_id},
                            {$pull: {
                                    groups_belong: group_name
                                }}, {w: 'majority'})
                            .then(function () {
                                return group_col.updateOne({name: group_name},
                                        {$set: {
                                                members: group.members,
                                                exited_members: group.exited_members
                                            }}, {w: 'majority'});
                            });
                })
                .then(function (group) {
                    return 'removed successfully.';
                });
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
            var group = await c.findOne({name: group_name}, {_id: 0});
            if (!group) {
                return this.error(`Unknown group name - ${group_name}`);
            }
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
                this.error('Could not get groups info');
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

            group.admins = Array.isArray(group.members) ? group.members.filter(function (member) {
                return member.is_admin;
            }) : [];

            group.total_members = this.util.length(group.members);
            group.total_admins = this.util.length(group.admins);


            //this.sObj.db.close();//not neccessary - the driver does the connection pooling automatically
        } catch (e) {
            console.log(e);
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

        if (!Array.isArray(group_names_arr)) {
            group_names_arr = [group_names_arr]; //convert to array
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);

        for (var i = 0; i < group_names_arr.length; i++) {
            c.findOne({name: group_names_arr[i]})
                    .then(function (group) {
                        var group_name = group.name;
                        if (Array.isArray(group.members)
                                || group.members.length === 0) {
                            return;
                        }
                        for (var k = 0; k < group.members.length; k++) {
                            if (!group.members[i].committed) {
                                group.members.splice(k, 1);
                                k--;
                                continue;
                            }
                        }

                        c.updateOne({name: group_name}, {$set: {members: group.members}});
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
        }

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

        if (group_names_arr.length === 0) {
            return [];
        }

        var oredArr = [];
        for (var i = 0; i < group_names_arr.length; i++) {
            oredArr.push({name: group_names_arr[i]});
        }

        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);
            var groups = await c.find({$or: oredArr}, {_id: 0}).toArray();
            if (groups.length === 0) {
                return [];
            }
        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION
            this.error("Could not get groups info.");
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
        if (!Array.isArray(users_list) || users_list.length === 0) {
            this.error('Could not get groups info');
            return this;
        }

        //at this point the users info was gotten correctly
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            group.admins = Array.isArray(group.members) ? group.members.filter(function (member) {
                return member.is_admin;
            }) : [];

            group.total_members = this.util.length(group.members);
            group.total_admins = this.util.length(group.admins);


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
            var user = await c.findOne({user_id: user_id}, {_id: 0});
            if (!user || !user.groups_belong) {
                return [];
            }
            return this.getGroupsInfoList(user.groups_belong);

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION

            this.error('Could not get user groups info');
            return this;
        }
    }

}

module.exports = Group;
