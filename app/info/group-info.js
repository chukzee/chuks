
"use strict";

var Base = require('../base');

class GroupInfo extends Base{

    constructor(sObj) {
        super(sObj);
        this._groupName;
        this._groupMembers = new Set();

    }

    get groupName() {
        return _groupName;
    }

    set groupName(groupName) {
        this._groupName = groupName;
    }

    get groupMembers() {
        return _groupMembers;
    }

    set groupMembers(groupMembers) {
        this._groupMembers = groupMembers;
    }

    addMember(username) {
        this._groupMembers.add(username);
        
        this.replySuccess(username);//TESTING!!!
        console.log('addMember(username) ', username);//TESTING!!!
    }

    removeMember(username) {
        this._groupMembers.remove(username);
    }

}

module.exports = GroupInfo;
