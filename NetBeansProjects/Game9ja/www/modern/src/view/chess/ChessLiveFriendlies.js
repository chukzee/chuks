
var store = Ext.create('GameApp.store.ChessLiveFriendliesStore');

Ext.define('GameApp.view.chess.ChessLiveFriendlies', {
    extend: 'GameApp.view.game.GameLiveFriendlies',
    xtype: 'chess-live-friendlies',

    store: store,

    listeners: {
        itemtap: function (list, index, item, record, senchaEvent) {

            //NOTE THE COMMENT BELOW - VERY IMPORTANT!!!
            //senchaEvent.event.target.nodeName is used to check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.

            //console.log(record.get("white_player_name"));
            //console.log(senchaEvent.event.target.nodeName);//check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.
            console.log(senchaEvent.event.target.name);
            console.log(senchaEvent.event.target.tagName);

            var view = this.up('app-main');

            var element = senchaEvent.event.target;

            if (element.name === "white_player_profile_pic"
                    || element.name === "black_player_profile_pic") {
                var src = element.name === "white_player_profile_pic" ?
                        record.get("white_player_large_pic")
                        : record.get("black_player_large_pic");
                        
                console.log(src);
                
                var nextView = Ext.create('GameApp.view.quickview.UserLargePicsView');
                nextView.setHtml("<div name='my_imgae'>the image is here</div>");
                //nextView.getHtml();
                console.log(nextView.getHtml());
                
                view.push(nextView);
                
                console.log(nextView.getID());
            } else {
                var nextView = Ext.create('GameApp.view.chess.ChessWatch');
                view.push(nextView);
            }



        }
    }

});