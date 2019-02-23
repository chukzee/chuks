
/* global Promise */

"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Group extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    async _lock(group_name) {
        //console.log('here 1');
        if (this._is_lock) {
            if (this._group_name_lock !== group_name) {
                throw new Error('Cannot lock more than one groups.');
            }
            return true;
        }
        //console.log('here 2');
        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);

            //console.log('group_name', group_name);
            //console.log(await c.findOne({name: group_name}));//TESTING!!!

            var r = await c.updateOne({name: group_name}, {
                $set: {
                    _lock: true
                }});

            //console.log('r.result.nModified', r.result.nModified);
            //console.log('r.result', r.result);

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
        //console.log('here 3');

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

            /*var adminQuery = {
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
             */

            var group = await c.findOne({name: group_name}, {_id: 0});
            if (!group) {
                return this.error(`Unknown group name - ${group_name}`);
            }
            var admin;
            for (var i = 0; i < group.members.length; i++) {
                var member = group.members[i];
                if (member.user_id === from_user_id
                        && member.is_admin
                        && member.committed) {
                    admin = member;
                    break;
                }
            }

            if (!admin) {
                return "Not authorize to send this request. Must be a group admin.";
            }

            var authorization_token = this.sObj.UniqueNumber;

            var data = {
                group_name: group_name,
                authorization_token: authorization_token,
                admin_user_id: from_user_id,
                requested_user_id: to_user_id,
                status_message: group.status_message,
                small_photo_url: group.small_photo_url,
                large_photo_url: group.large_photo_url,
                created_by: group.created_by,
                notification_type: 'group_join_request',
                notification_time: new Date()
            };

            var req_col = this.sObj.db.collection(this.sObj.col.group_join_requests);
            await req_col.insertOne(data); //await the asynchronous process

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

    async adddBulkAdmins(user_id, group_name, user_ids) {

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
                return this.error("Not authorized to make another user an admin.");
            }

        } catch (e) {

            console.log(e);

            return this.error("Failed operation!");
        }

        var group = await this._addToGroup(user_ids, group_name, true);
        if (this.lastError) {
            return this.error(this.lastError);
        }
        return group;
    }

    async adddBulkMembers(user_id, group_name, user_ids) {

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
                return this.error("Not authorized to make another user an admin.");
            }

        } catch (e) {

            console.log(e);

            return this.error("Failed operation!");
        }

        var group = await this._addToGroup(user_ids, group_name, false);
        if (this.lastError) {
            return this.error(this.lastError);
        }
        return group;
    }
    /**
     * Reject a group join request and adds the user to the group
     * 
     * @param {type} authorization_token - this is the autorization sent by the admin to rhe user -  the server must confirm this token before adding the user to the group
     * @returns {undefined}
     */
    async rejectGroupJoinRequest(authorization_token) {

        var req_col = this.sObj.db.collection(this.sObj.col.group_join_requests);
        try {
            var r = await req_col.deleteOne({authorization_token: authorization_token}, {w: 'majority'});
            if (r.result.n === 0) {
                return 'No group join request!';
            }
        } catch (e) {

            console.log(e);

            return this.error("Failed to decline group join request!");
        }


        return 'Succesfully declined request';
    }

    /**
     * Get a list of group join requests
     * 
     * @param {type} user_id
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async getGroupJoinRequests(user_id, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            skip = arguments[0].skip;
            limit = arguments[0].limit;
        }

        if (skip !== undefined && limit !== undefined) {
            skip = skip - 0;
            limit = limit - 0;
        } else {
            skip = 0;
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.group_join_requests);


        var query = {
            requested_user_id: user_id
        };

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            group_join_requests: []
        };

        if (!total) {
            return data;
        }


        data.group_join_requests = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    _groupMemberObj(user_id, is_admin, commit) {
        return  {
            user_id: user_id,
            is_admin: !is_admin ? false : true,
            date_joined: new Date(),
            committed: !commit ? false : true
        };
    }

    async _addToGroup(user_ids, group_name, is_admin) {

        if (!Array.isArray(user_ids)) {
            user_ids = [user_ids];
        }

        //acquire lock with the specified number of trials
        var lock_result = await this._tryWith(this._lock, 3, 0, group_name);

        console.log('lock_result', lock_result);

        if (!lock_result) {
            return this.error('Server busy!'); //failed to acquire lock after the specifed number of trials
        }

        var group_col = this.sObj.db.collection(this.sObj.col.groups);
        var me = this;
        var memberObjs = [];
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

                    for (var i = 0; i < user_ids.length; i++) {
                        memberObjs[i] = me._groupMemberObj(user_ids[i], is_admin, false);
                    }

                    //we will commit the update if all 
                    //operation is successful - the variable we help us detect if
                    //the member addition is inconsistent so that we call remove it
                    // when iterating members of a group and detected that the value is false.
                    //This is our simple implementation of two phase commit or rollback 
                    //recommended by MongoDB as an alternative for RDBMS like transaction

                    for (var i = 0; i < memberObjs.length; i++) {
                        var mem = memberObjs[i];
                        var found = false;
                        for (var k = 0; k < group.members.length; k++) {
                            if (group.members[k].user_id === mem.user_id) {
                                mem.date_joined = group.members[k].date_joined; // retain the date jioned
                                group.members[k] = mem;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            group.members.push(mem);
                        }
                    }

                    group_members = group.members; // set the group memeber - 
                    //will be needed down below for committing this operation

                    return  group_col.update({name: group_name}, {$set: {members: group.members}}, {w: 'majority'});
                })
                .then(function ()
                {
                    var user_col = me.sObj.db.collection(me.sObj.col.users);
                    var query = {$or: []};
                    for (var i = 0; i < user_ids.length; i++) {
                        query.$or.push({
                            user_id: user_ids[i]
                        });
                    }
                    return  user_col.updateMany(query, {$addToSet: {groups_belong: group_name}}, {w: 'majority'});
                })
                .then(function () {
                    //now commit the changes
                    for (var i = 0; i < memberObjs.length; i++) {
                        memberObjs[i].committed = true;
                    }
                    return group_col.findOneAndUpdate({name: group_name}, {$set: {members: group_members}},
                            {
                                projection: {_id: 0},
                                returnOriginal: false, //return the updated document
                                w: 'majority'
                            });
                })
                .then(async function (r) {
                    var group = r.value;
                    var groups = await  me._normalizeGroupsInfo(group);
                    if (me.lastError) {
                        return Promise.reject(me.lastError);
                    }

                    group = groups[0];//we know it is only one group

                    return group;
                });

    }

    async createGroup(user_id, group_name, status_message) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
            status_message = arguments[0].status_message;
        }

        if (!group_name) {
            return this.error('Empty group name');
        }

        if (typeof group_name !== 'string') {
            return this.error('Invalid tournament name.');
        }

        if (!status_message) {
            status_message = '';
        }

        try {
            if (this.files && this.files.group_icon) {

                //send to imageservice to resize the icon image
                var rs = await this.sObj.resizeImage({
                    id: group_name,
                    type: 'group',
                    filename: this.files.group_icon.path
                });
            }
        } catch (e) {
            console.log(e);
            return this.error('Something went wrong!');
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var member = this._groupMemberObj(user_id, true, true);
        var group = {
            name: group_name,
            status_message: status_message,
            created_by: user_id,
            date_created: member.date_joined ? member.date_joined : new Date(),
            members: []
        };

        if (rs) {
            group.small_photo_url = rs.small_image_path;
            group.large_photo_url = rs.large_image_path;
        }

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
            group = await this._addToGroup(user_id, group_name, true); // add the member to the group and other neccessary things
        } catch (e) {

            //Now attempt to delete the group since it was not properly created

            c.deleteOne({name: group_name}, {w: 'majority'})
                    .then(function (r) {
                        //ok good
                    })
                    .catch(function (err) {
                        console.log(`ATTENTION!!! failed to delete group with name '${group_name}' which was not properly created. This need urgent attention and should be deleted manually.`);
                        console.log(err);
                    });

            console.log(e);//DO NOT DO THIS IN PRODUCTION

            return this.error('Could not perform operaton!');
        }

        return group;
    }

    async editGroup(user_id, group_name, status_message) {
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            group_name = arguments[0].group_name;
            status_message = arguments[0].status_message;
        }

        if (!status_message) {
            return this.error('Empty group description');
        }

        //first check if the user is authorize to edit the group

        var c = this.sObj.db.collection(this.sObj.col.groups);
        var group = await c.findOne(
                {
                    name: group_name,
                    'members.user_id': user_id
                });


        if (!group) {
            return this.error(`Group not found - ${group_name}`);
        }

        if (Array.isArray(group.members)) {
            var foundMember;
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i].user_id === user_id) {
                    foundMember = group.members[i];
                    if (!group.members[i].is_admin) {
                        return this.error('Not authorized!');
                    }
                    break;
                }
            }
            if (!foundMember) {
                return this.error(`Not a group member - ${user_id}`);
            }
        } else {
            return this.error('No member!');
        }

        try {
            if (this.files && this.files.group_icon) {

                //send to imageservice to resize the icon image
                var rs = await this.sObj.resizeImage({
                    id: group_name,
                    type: 'group',
                    filename: this.files.group_icon.path
                });
            }
        } catch (e) {
            console.log(e);
            return this.error('Something went wrong!');
        }


        var setObj = {};
        if (status_message) {
            setObj.status_message = status_message;
        }

        if (rs) {
            var tm = new Date().getTime();
            setObj.small_photo_url = rs.small_image_path + '?' + tm;//force refresh by appending the new time query string
            setObj.large_photo_url = rs.large_image_path + '?' + tm;//force refresh by appending the new time query string
        }

        var c = this.sObj.db.collection(this.sObj.col.groups);
        try {
            var r = await c.findOneAndUpdate({name: group_name}, {$set: setObj}, {
                projection: {_id: 0},
                returnOriginal: false, //return the updated document
                w: 'majority'
            });
        } catch (e) {
            console.log(e);
            return this.error('Could not edit group.');
        }

        group = r.value;

        var groups = await  this._normalizeGroupsInfo(group);
        if (this.lastError) {
            return this.error(this.lastError);
        }

        group = groups[0];//we know it is only one group
        
        var member_user_ids = [];
        for(var i=0; i< group.members.length; i++){
            member_user_ids.push(group.members[i].user_id);
        }
        //broadcast to all group members
        this.broadcast(this.evt.group_edited, group, member_user_ids);

        return group;
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
                return this.error("Not authorized to make another user an admin.");
            }

            var group = await c.findOne({name: group_name}, {_id: 0});

            if (!group) {
                return this.error('Not a group');
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
                        return this.error("Member is already an admin");
                    }
                    group.members[i].is_admin = true;
                    found_member = group.members[i];
                }
            }

            if (!found_member) {
                return this.error(`Admin member not found - ${new_admin_user_id}`);
            }

            await c.updateOne({name: group_name}, {$set: {members: group.members}});

            //console.log(await c.findOne({name: group_name}, {_id: 0}));//TESTING!!!

            if (group.members.length === 0) {
                return this.error('No member');
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
                return this.error('Not a group');
            }
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i].committed
                        && group.members[i].user_id === user_id
                        && !group.members[i].is_admin) {
                    return this.error("Not authorized to make another user an admin.");
                }
            }

            //also the creator of the group cannot be demoted
            if (group.created_by === demoted_admin_user_id) {
                return this.error("Cannot demote the group creator!");
            }


            var group = await c.findOne({name: group_name}, {_id: 0});

            if (!group) {
                return this.error('Not a group');
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
                        return this.error("Member is not an admin!");
                    }
                    group.members[i].is_admin = false;
                    found_member = group.members[i];
                }
            }

            if (!found_member) {
                return this.error(`Admin member not found - ${demoted_admin_user_id}`);
            }

            await c.updateOne({name: group_name}, {$set: {members: group.members}});

            //console.log(await c.findOne({name: group_name}, {_id: 0}));//TESTING!!!

            if (group.members.length === 0) {
                return this.error('No member');
            }

            return "Removed admin role succesfully.";

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

                    //console.log('group.exited_members', group.exited_members);

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

        try {
            var c = this.sObj.db.collection(this.sObj.col.groups);
            var group = await c.findOne({name: group_name}, {_id: 0});
            if (!group) {
                return this.error(`Unknown group name - ${group_name}`);
            }

            var groups = await  this._normalizeGroupsInfo(group);
            if (this.lastError) {
                return this.error(this.lastError);
            }

            group = groups[0];//we know it is only one group

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

        groups = await  this._normalizeGroupsInfo(groups);
        if (this.lastError) {
            return this.error(this.lastError);
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

    async _normalizeGroupsInfo(groups) {

        if (!groups) {
            this.error('No group provided.');
            return;
        }

        if (!Array.isArray(groups)) {
            groups = [groups];
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
            this.error('Could not get users info');
            return;
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

}

module.exports = Group;
