
var store = Ext.create('GameApp.store.GroupLiveChessStore');

Ext.define('GameApp.view.chess.GroupLiveChessList', {
    extend: 'Ext.NestedList',
    xtype: 'group-live-chess-list',
    fullscreen: true,
    singleSelect: true,

    itemTpl: '<div class="the chess live list">'+
            '<img src= "{white_player_pic}"></img>'+
            '<div>{white_player_name}</div>'+
            '<div>{black_player_name}</div>'+
            '<div>{score}</div>'+
            '<div>{game_duration}</div>'+
            '<img src= "{black_player_pic}"></img>'+
            '</div>',
    /*data: [
        {white_player_name: 'Alimele C.',white_player_username: '08048239423', white_player_pic: "alimele_pic.png", white_player_rating: "4 star", black_player_name: 'Okoro M.', black_player_name: '09087324723', black_player_pic: "okoro_pic.png", black_player_rating: "4 star", game_duration: "2 hours", score: "1 - 0", game_position: "The game position goes here"},
    ],*/
    store:store,

    items: [{
            xtype: 'button',
            scrollDock: 'bottom',
            docked: 'bottom',
            html: '<div>Show more...</div>'
        }],
    listeners: {
        itemtap: function (list, index, item, record, senchaEvent) {

            //NOTE THE COMMENT BELOW - VERY IMPORTANT!!!
            //senchaEvent.event.target.nodeName is used to check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.

            //console.log(record.get("white_player_name"));
            //console.log(senchaEvent.event.target.nodeName);//check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.

            //var view = this.up('app-main');
            //var nextView = Ext.create('GameApp.view.chess.ChessView');
            //view.push(nextView);


        }
    }

});