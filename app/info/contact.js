

"use strict";

var WebApplication = require('../web-application');

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

        try {
            if (typeof contact_user_id !== 'string') {
                return error('invalid contact');
            }

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = c.updateOne(
                    {user_id: user_id},
                    {$addToSet: {contacts: contact_user_id}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No new contact added.';
            }
        } catch (e) {

            console.log(e);

            return this.error('could not add contact');
        }

        return 'contact added successfully.';
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
        try {
            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = c.updateOne(
                    {user_id: user_id},
                    {$addToSet: {contacts: {$each: contacts_user_ids_arr}}}, //mongodb docs says $pushAll is deprecated
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No new contact added.';
            }
        } catch (e) {

            console.log(e);

            return this.error('could not add contacts');
        }

        return 'contacts added successfully.';
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
            var r = c.updateOne(
                    {user_id: user_id},
                    {$pull: {contacts: contact_user_id}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No contact removed.';
            }
        } catch (e) {

            console.log(e);

            return this.error('could not remove contact');
        }

        return 'contact removed successfully.';
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
            var r = c.updateOne(
                    {user_id: user_id},
                    {$pullAll: {contacts: contacts_user_ids_arr}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No contact removed.';
            }
        } catch (e) {

            console.log(e);

            return this.error('could not remove contact(s)');
        }

        return 'contacts removed successfully.';
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

        //remove any duplicate        
        this.util.toSet(contacts_user_ids_arr);

        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var r = c.updateOne(
                    {user_id: user_id},
                    {$set: {contacts: contacts_user_ids_arr}},
                    {w: 'majority'});
            if (r.result.n === 0) {
                return 'No contact added.';
            }
        } catch (e) {

            console.log(e);

            return this.error('could not save contacts');
        }

        return 'contacts saved successfully.';
    }

}