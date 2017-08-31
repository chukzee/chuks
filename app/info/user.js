
"use strict";

var Result = require('../result');

class User extends Result {

    constructor(sObj, util) {
        super();
        this.sObj = sObj;
        this.util = util;
    }

    async auth() {

    }

    async login() {

    }

    async register(obj) {
        var c = this.sObj.db.collection(this.sObj.col.users);
        var fields = ['user_id', 'phone_numbers', 'dob', 'address', 'email', 'country', 'zip_code'];
        var userObj = {};
        this.util.copy(obj, userObj, fields);
        //more fields
        userObj.player_ranking = 0;
        try {

            await c.insertOne(userObj, {w: 'majority'});

        } catch (e) {
            //chec if the reason is because the user id already exist
            try {
                var user = await c.findOne({user_id: userObj.user_id});
            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION
            }

            if (user) {
                this.error('user \'' + user.user_id + '\' already exist!');
            } else {
                this.error('could not register user!');
            }
            return this;
        }

        return 'Registered successfully.';
    }

    async getInfo(user_id) {
        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var info = await c.findOne({user_id: user_id});
            //this.sObj.db.close();

        } catch (e) {
            this.error('could not get user info!');
            console.log(e);//DO NOT DO THIS IN PRODUCTION -  INSTEAD LOG TO ANOTHER PROCESS
            return this;
        }

        return info;
    }

    async getInfoList(user_id_arr) {
        var oredArr = [];
        for (var i = 0; i < user_id_arr.length; i++) {
            oredArr = {user_id: user_id_arr[i]};
        }
        var c = this.sObj.db.collection(this.sObj.col.users);

        try {
            var users = await c.find({$or: oredArr}).toArray();
            
        } catch (e) {
            this.error('could not get users.');
            return this;
        }

        return users;
    }

    async editUserProfile(obj) {
        try {
            var setObj = {};
            var fields = ['phone_number', 'dob', 'status', 'player_rank'];
            this.util.copy(obj, setObj, fields);

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = await c.findOneAndUpdate({user_id: obj.user_id, $set: setObj});
            //this.sObj.db.close();

        } catch (e) {
            this.error('could not update user profile!');
            console.log(e);//DO NOT DO THIS IN PRODUCTION -  INSTEAD LOG TO ANOTHER PROCESS
            return this;
        }
        return "The operation was successful ";
    }

    async addToGroup(user_id, group_name, is_admin) {

        var group_col = this.sObj.db.collection(this.sObj.col.groups);
        var me = this;
        var memberObj = {};
        var group_members = [];

        return group_col.findOne({name: group_name})
                .then(function (group) {
                    if (!Array.isArray(group.members)) {
                        group.members = [];
                    }

                    if (group.members.length >= me.sObj.MAX_GROUP_MEMBERS) {
                        me.error("Maximum group members exceeded! Limit allowed is " + me.sObj.MAX_GROUP_MEMBERS + ".");
                        return Promise.reject(me);
                    }


                    memberObj.user_id = user_id;
                    memberObj.is_admin = is_admin;
                    memberObj.date_joined = new Date();
                    memberObj.committed = false;//we will commit the update if all 
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
                    return user_col.findOne({user_id: user_id})
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

    /**
     * Used to exist user from a group
     * 
     * @param {type} user_id - user being exited
     * @param {type} exit_by user who authorized the exit -  must be either the user existing or the group admin
     * @param {type} group_name - roup name
     * @param {type} reason - reason for the exit 
     * @returns {undefined}
     */
    async exitGroup(user_id, exit_by, group_name, reason) {
        var group_col = this.sObj.db.collection(this.sObj.col.groups);
        var me = this;

        return group_col.findOne({name: group_name})
                .then(function (group) {
                    if(!Array.isArray(group.members)){
                        group.members = [];
                    }
                    var isAdmin = false;
                    if (user_id !== exit_by) {//check if the exit_by is an admin
                        for (var i in group.members) {
                            if (group.members[i] === exit_by) {
                                isAdmin = group.members[i].is_admin;
                                break;
                            }
                        }
                    }

                    if (!isAdmin && user_id !== exit_by) {
                        me.error("Unauthorized operation! You must either the group admin or the user being removed!");
                        return Promise.reject(me);
                    }

                    for (var i =0; i < group.members.length; i++) {

                        if (user_id === group.members[i].user_id) {
                            group.members[i].splice(i, 1);//remove the member
                            i--;
                        }
                    }

                    return group_col.update({name: group_name}, {$set: {members: group.members}}, {w: 'majority'});
                }).then(function (group) {
            if (!Array.isArray(group.exited_members)) {
                group.exited_members = [];
            }
            var exitedMemberObj = {};
            exitedMemberObj.user_id = user_id;
            exitedMemberObj.reason = reason;
            exitedMemberObj.exit_by = exit_by;
            exitedMemberObj.exit_date = new Date();


            return group_col.update({name: group_name}, {$set: {exited_members: group.exited_members}}, {w: 'majority'});
        });
    }

    async addToTournament(obj) {

    }

    async getGroupsBelong(param) {


    }

    async getTournamentsBelong(user_id) {

    }

}

module.exports = User;