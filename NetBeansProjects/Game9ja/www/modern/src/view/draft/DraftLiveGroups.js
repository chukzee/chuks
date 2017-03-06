
var tree_store = Ext.create('GameApp.store.DraftLiveGroupsStore');

Ext.define('GameApp.view.draft.DraftLiveGroups', {
    extend: 'GameApp.view.game.GameLiveGroups',
    xtype: 'draft-live-groups',

    store: tree_store,

    listeners: {
        itemtap: function (list, index, item, record, senchaEvent) {

            //NOTE THE COMMENT BELOW - VERY IMPORTANT!!!
            //senchaEvent.event.target.nodeName is used to check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.

            //console.log(record.get("white_player_name"));
            //console.log(senchaEvent.event.target.nodeName);//check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.

            //var view = this.up('app-main');
            //var nextView = Ext.create('GameApp.view.draft.DraftView');
            //view.push(nextView);


        }
    }

});