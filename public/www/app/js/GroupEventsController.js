
/* global Ns, Main */

Ns.GroupEventsController = {

    constructor: function () {

        Main.eventio.on('group_join_request', this.onGroupJionRequest.bind(this));
        Main.eventio.on('group_edited', this.onGroupEdited.bind(this));

    },

    onGroupJionRequest: function (obj) {
        
        console.log(obj);
    },
    
    onGroupEdited: function (obj) {
        console.log(obj);
              
        var group = obj.data;
        Ns.view.Group.save(group);
    }
};