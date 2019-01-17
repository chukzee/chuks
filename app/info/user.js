
"use strict";

var WebApplication = require('../web-application');
var crypto = require('crypto');

class User extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
        this.crypto = crypto;
    }

    async isOnline(user_id) {
        return this.sObj.redis.get('online_status:' + user_id)
                .then(function (status) {

                    console.log('status ', status);

                    return status === "online";
                });
    }

    async _setPlaying(user_id) {

        try {
            var c = this.sObj.db.collection(this.sObj.col.users);

            var r = await c.findOneAndUpdate({user_id: user_id},
                    {$set: {
                            playing: true,
                            play_begin_time: new Date().getTime() //must be long type - the last play start or resume time
                        }},
                    {
                        projection: {_id: 0, playing: 1, play_begin_time: 1},
                        returnOriginal: false //return the updated document
                    }
            );
        } catch (e) {
            console.log(e);
            return this.error('Could not modify playing status');
        }

        var doc = r.value;
        //must return object of this properties - do not change!
        return {
            playing: true,
            play_begin_time: doc.play_begin_time
        };
    }

    async _unsetPlaying(user_id) {
        var c = this.sObj.db.collection(this.sObj.col.users);
        try {
            var r = await c.updateOne({user_id: user_id},
                    {$set: {//NOTE: does not require setting play begin time
                            playing: false
                        }
                    });
        } catch (e) {
            console.log(e);
            return this.error('Could not modify playing status');
        }

        return true;
    }

    async login(phone_no, password) {
        try {
            if (!phone_no) {
                return this.error('No user id!');
            }

            if (!password) {
                return this.error('No user password!');
            }

            var c = this.sObj.db.collection(this.sObj.col.users);
            
            var user = await c.findOne({user_id: phone_no}, {_id: 0});
            if (!user) {
                
                return this.error('Invalid username or password');
            }
            var protected_pass = await this._protectedPassword(password, user.password.salt, user.password.iterations);

            if (user.password.hash.buffer.toString()//the saved hash is in binary type so we will access the buffer property of the binary object
                    !== protected_pass.hash.toString()) {
                
                return this.error('Invalid username or password');
            }

            this._normalizeInfo(user);

        } catch (e) {
            console.log(e);
            return this.error('Could not login');
        }

        return user;
    }

    /**
     * Registers a new user. The phone number is the user id used my our system
     * to identiify a user. So popular alphanumeric usernames is not valid in 
     * our system. So the client must verify the phone number of the user 
     * 
     * 
     * @param {type} phone_no - user id of the user is the phone number the user
     * used upon registration
     * @param {type} password - password of the user
     * @param {type} email - must be a verified email of the user
     * @param {type} country - the country of the user - important for determining
     * the zip code used for prefixing the user phone numbers
     * @returns {nm$_user.User|String}
     */
    async register(phone_no, password, email, country) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            phone_no = arguments[0].phone_no;
            password = arguments[0].password;
            email = arguments[0].email;
            country = arguments[0].country; // one main use for this is to obtain the zip code
        }

        if (!phone_no) {
            return 'No user id (phone number) provided!';
        }

        if (!password) {
            return 'No password!';
        }

        if (!email) {
            return 'Must provide email address!';
        }

        if (!country) {
            return 'Must specify your country!';
        }

        try {
            var user_id = phone_no;// the phone number is the user id
            var phone_numbers = [phone_no];
            var userObj = {
                user_id: user_id,
                password: await this._protectedPassword(password),
                email: email,
                full_name: email.substring(0, email.indexOf('@')), //default  full name of the user
                country: country,
                phone_numbers: phone_numbers,
                player_ranking: 0, //set the player ranking
                contacts:[],
                groups_belong: [],
                tournaments_belong: [],
                related_tournaments: [],
                favourite_tournaments: [],
                rel_tourn_update_time: new Date('1970-01-01 00:00:00')// last time the related_tournaments field was updated
            };


            var c = this.sObj.db.collection(this.sObj.col.users);
            //more fields
            await c.insertOne(userObj, {w: 'majority'});

        } catch (e) {

            //chec if the reason is because the user id already exist
            try {
                var user = await c.findOne({user_id: userObj.user_id}, {_id: 0});
            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION
            }

            if (user) {
                this.error('User \'' + user.user_id + '\' already exist!');
            } else {
                this.error('Could not register user!');
            }
            return this;
        }

        return 'Registered successfully.';
    }

    async _protectedPassword(password, _salt, _iterations) {
        var salt = _salt || this.crypto.randomBytes(48).toString('base64');
        var iterations = _iterations || 1000;
        var me = this;
        var hash = await new Promise(function (resolve, reject) {
            me.crypto.pbkdf2(password, salt, iterations, 512, 'sha512', function (err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });

        return {
            salt: salt,
            hash: hash,
            iterations: iterations
        };
    }

    /**
     * Edits the user informataion. This is useful after registration (ie keeping
     * the registration as brief as possible after which the user can added
     * additional info of himself)
     * 
     * If the first or last name of the user is provided the user full name is
     * determined from either or both.
     * 
     * PLEASE NOTE: If additional phone number of the user is provided 
     * the client must be make sure the phone number is verified before call
     * this method remotely or sending the phone number to the server
     * 
     * @param {type} user_id - must be the user phone number he used in signing up
     * @param {type} first_name - (optional) first name of the user
     * @param {type} last_name - (optional) last name of the userr
     * @param {type} additional_phone_no - (optional) the additional phone number
     * of the user to save in the server. Note that the client must verify the 
     * phone before saving it to the server
     * @param {type} dob - (optional) date of birth of the user - this will be
     * useful for sending our users birthday greetings
     * @returns {User@call;error|String}
     */
    async editInfo(user_id, first_name, last_name, additional_phone_no, dob) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            first_name = arguments[0].first_name;
            last_name = arguments[0].last_name;
            additional_phone_no = arguments[0].additional_phone_no;
            dob = arguments[0].dob; // one main use for this is to obtain the zip code
        }

        var editObj = {};

        if (first_name) {
            editObj.first_name = first_name;
        }

        if (last_name) {
            editObj.last_name = last_name;
        }

        if (!isNaN(new Date(dob).getTime())) {
            editObj.dob = dob;
        }

        var c = this.sObj.db.collection(this.sObj.col.users);
        var user = await c.findOne({user_id: user_id});
        if (!user) {
            return this.error('User not found!');
        }

        if (additional_phone_no
                && user.phone_numbers.indexOf(additional_phone_no) === -1) {
            user.phone_numbers.push(additional_phone_no);
        }

        editObj.phone_numbers = user.phone_numbers;

        var user = await c.updateOne({user_id: user_id}, {$set: editObj});

        return 'Updated successfully.';
    }

    async addPhoneNumber(user_id, additional_phone_no) {
        if (!additional_phone_no) {
            return 'Nothing updated - no phone number provided.';
        }
        var c = this.sObj.db.collection(this.sObj.col.users);
        var user = await c.findOne({user_id: user_id});
        if (!user) {
            return this.error('User not found!');
        }
        var editObj = {};
        if (additional_phone_no
                && user.phone_numbers.indexOf(additional_phone_no) === -1) {
            user.phone_numbers.push(additional_phone_no);
        } else {
            return 'Nothing updated';
        }

        editObj.phone_numbers = user.phone_numbers;

        var user = await c.updateOne({user_id: user_id}, {$set: editObj});

        return 'Updated successfully.';
    }

    _normalizeInfo(user) {
        if (!user) {
            return;
        }
        delete user.password; //delete this property - it must not pass through the wire.

        user.full_name = '';

        if (user.first_name || user.last_name) {
            if (user.first_name && !user.last_name) {
                user.full_name = user.first_name;
            } else if (!user.first_name && user.last_name) {
                user.full_name = user.last_name;
            } else {
                user.full_name = user.first_name + " " + user.last_name;
            }
        } else if (user.email && typeof user.email === 'string') {
            //instead set the email username as the full name
            var index = user.email.indexOf('@');
            if (index > -1) {
                user.full_name = user.email.substring(0, index);
            }
        }
        
        if(!user.groups_belong){
            user.groups_belong = [];
        }
        
        if(!user.tournaments_belong){
            user.tournaments_belong = [];
        }
    }

    async getInfo(user_id, required_fields) {
        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var project = {};
            project._id = 0; //hide this field
            if (Array.isArray(required_fields)) {
                var field_name;
                for (var i = 0; i < required_fields.length; i++) {
                    field_name = required_fields[i];
                    project[field_name] = 1; //show this field
                }
            }
            var user = await c.findOne({user_id: user_id}, project);
            this._normalizeInfo(user);

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION -  INSTEAD LOG TO ANOTHER PROCESS
            return this.error('Could not get user info!');
            ;
        }

        return user;
    }

    async getInfoList(user_id_arr, required_fields) {

        try {

            if (!Array.isArray(user_id_arr)) {
                return [];
            }

            if (user_id_arr.length === 0) {
                return [];
            }

            var project = {};
            project._id = 0; //hide this field
            if (Array.isArray(required_fields)) {
                var field_name;
                for (var i = 0; i < required_fields.length; i++) {
                    field_name = required_fields[i];
                    project[field_name] = 1; //show this field
                }
            }
            var oredArr = [];
            for (var i = 0; i < user_id_arr.length; i++) {
                oredArr.push({user_id: user_id_arr[i]});
            }
            var c = this.sObj.db.collection(this.sObj.col.users);

            var users = await c.find({$or: oredArr}, project).toArray();

            for (var i = 0; i < users.length; i++) {
                this._normalizeInfo(users[i]);
            }

        } catch (e) {
            console.log(e);
            this.error('Could not get users.');
            return this;
        }

        return users;
    }

    async getGroupsBelong(user_id) {

        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var user = await c.findOne({user_id: user_id}, {_id: 0});
            if (!user) {
                return [];
            }
        } catch (e) {
            console.log(e);
            return this.error('Could not get groups belong');
        }

        return user.groups_belong ? user.groups_belong : [];
    }

    async getTournamentsBelong(user_id) {

        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var user = await c.findOne({user_id: user_id}, {_id: 0});
            if (!user) {
                return [];
            }
        } catch (e) {
            console.log(e);
            return this.error('Could not get tournaments belong');
        }

        return user.tournaments_belong ? user.tournaments_belong : [];
    }

}

module.exports = User;