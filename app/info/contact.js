

"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

class Contact extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Adds the specified contact to the user contacts.
     * It also avoids duplicate.
     * 
     * @param {type} user_id - user id
     * @param {type} contact_user_id - the user contact (phone number)
     * @returns {Contact@call;error|String}
     */
    async add(user_id, contact_user_id) {
        if (user_id === contact_user_id) {
            return 'Nothing added! Contact is the user own phone number.';
        }
        try {
            if (typeof contact_user_id !== 'string') {
                return error('invalid contact');
            }

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = await c.updateOne(
                    {user_id: user_id},
                    {$addToSet: {contacts: contact_user_id}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No new contact added.';
            }
        } catch (e) {

            console.log(e);

            return this.error('Could not add contact');
        }

        return 'Contact added successfully.';
    }

    /**
     * Adds the specified contacts in the array to the user contacts
     * It also avoids duplicate.
     * 
     * @param {type} user_id - user id
     * @param {type} contacts_user_ids_arr - the array of contacts (phone numbers)
     * @returns {Contact@call;error|String}
     */
    async addBulk(user_id, contacts_user_ids_arr) {
        if (!Array.isArray(contacts_user_ids_arr)) {
            return error('invalid input');
        }

        //remove the user own phone number
        for (var i = 0; i < contacts_user_ids_arr.length; i++) {
            if (contacts_user_ids_arr[i] === user_id) {
                contacts_user_ids_arr.splice(i, 1);
                i--;
                continue;
            }
        }
        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = await c.updateOne(
                    {user_id: user_id},
                    {$addToSet: {contacts: {$each: contacts_user_ids_arr}}}, //mongodb docs says $pushAll is deprecated
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No new contact added.';
            }
        } catch (e) {

            console.log(e);

            return this.error('Could not add contacts');
        }

        return 'Contacts added successfully.';
    }

    /**
     * Remove the user contact that match the given cotact
     * 
     * @param {type} user_id - user id
     * @param {type} contact_user_id - contact to remove (phone number)
     * @returns {Contact@call;error|String}
     */
    async remove(user_id, contact_user_id) {

        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = await c.updateOne(
                    {user_id: user_id},
                    {$pull: {contacts: contact_user_id}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No contact removed.';
            }
        } catch (e) {

            console.log(e);

            return this.error('Could not remove contact');
        }

        return 'Contact removed successfully.';
    }

    /**
     * Remove the user contacts that match the cotacts in the given array
     * 
     * @param {type} user_id - user id
     * @param {type} contacts_user_ids_arr - the array of contacts (phone numbers)
     * @returns {Contact@call;error|String}
     */
    async removeBulk(user_id, contacts_user_ids_arr) {

        if (!Array.isArray(contacts_user_ids_arr)) {
            return error('invalid input');
        }
        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = await c.updateOne(
                    {user_id: user_id},
                    {$pullAll: {contacts: contacts_user_ids_arr}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No contact removed.';
            }
        } catch (e) {

            console.log(e);

            return this.error('Could not remove contact(s)');
        }

        return 'Contacts removed successfully.';
    }

    /**
     * Replace the entire user contacts with the new array of
     * contacts. Also avoid duplicate in the process
     * 
     * @param {type} user_id - user id
     * @param {type} contacts_user_ids_arr - the array of contacts (phone numbers)
     * @returns {Contact@call;error|String}
     */
    async set(user_id, contacts_user_ids_arr) {

        if (!Array.isArray(contacts_user_ids_arr)) {
            return error('invalid input');
        }

        //remove the user own phone number
        for (var i = 0; i < contacts_user_ids_arr.length; i++) {
            if (contacts_user_ids_arr[i] === user_id) {
                contacts_user_ids_arr.splice(i, 1);
                i--;
                continue;
            }
        }

        //remove any duplicate        
        this.util.toSet(contacts_user_ids_arr);

        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = await c.updateOne(
                    {user_id: user_id},
                    {$set: {contacts: contacts_user_ids_arr}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No contact added.';
            }
        } catch (e) {

            console.log(e);

            return this.error('Could not save contacts');
        }

        return 'Contacts saved successfully.';
    }

    /**
     * Get array of the user contacts (phone numbers) saved in the server
     * 
     * 
     * @param {type} user_id - user id
     * @returns {Contact@call;error|String}
     */
    async getContactsPhoneNos(user_id) {

        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var doc = await c.findOne({user_id: user_id}, {_id: 0, contacts: 1});


        } catch (e) {

            console.log(e);

            return this.error('Could not get contacts');
        }

        return doc ? (doc.contacts ? doc.contacts : []) : [];
    }

    /**
     * Get array of the user contacts infos.
     * These are contacts who are registered with us
     * 
     * @param {type} user_id - user id
     * @returns {Contact@call;error|String}
     */
    async getContactsInfoList(user_id) {

        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var doc = await c.findOne({user_id: user_id}, {_id: 0, contacts: 1});
            if(!doc){
                return [];
            }
            var user = await new User(this.sObj, this.util);
            var required_fields = ['first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
            var list = user.getInfoList(doc.contacts, required_fields);
            if (list.lastError) {
                return this.error('Could not get users contact info');
            }

        } catch (e) {
            console.log(e);
            return this.error('Could not get contacts');
        }

        return list;
    }

}


module.exports = Contact;