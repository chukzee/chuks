
Ext.define('GameApp.view.main.GameList', {
    extend: 'Ext.List',
    xtype: 'game-list',
    fullscreen: true,
    singleSelect: true,  
    
    requires: [
        'GameApp.view.game.GameLiveFriendlies',
        'GameApp.view.game.GameLiveGroups',
        'GameApp.view.game.GameLiveTournaments',
        'GameApp.view.game.GameView',
        'GameApp.view.game.GameWatch',
        
        'GameApp.view.chess.ChessHome',
        'GameApp.view.draft.DraftHome',
        'GameApp.view.ludo.LudoHome',
        'GameApp.view.solitaire.SolitaireHome',
        'GameApp.view.whot.WhotHome' 
    ],

    //store: store,

    itemTpl: '<div class="the_list_item_class"><img src= "{gameIcon}"></img><span>{game}</span></div>',
    data: [
        {game: 'Chess',gameIcon:"chess_icon_file_goes_here.png"},
        {game: 'Draft',gameIcon:"draft_icon_file_goes_here.png"},
        {game: 'Ludo',gameIcon:"ludo_icon_file_goes_here.png"},
        {game: 'Solitaire',gameIcon:"solitaire_icon_file_goes_here.png"},
        {game: 'Whot',gameIcon:"whot_icon_file_goes_here.png"}
    ],

    items: [{
            xtype: 'button',
            scrollDock: 'top',
            docked: 'top',
            html: '<div>Select a game.</div>'
        }],
    listeners: {
        itemtap: function (list, index, item, record, senchaEvent) {
            
            //NOTE THE COMMENT BELOW - VERY IMPORTANT!!!
            //senchaEvent.event.target.nodeName is used to check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.
            
            console.log(record.get("game"));
            console.log(senchaEvent.event.target.nodeName);//check the element tapped e.g span , img - used to track the element actually click on the listitem. e.g to know if the user profile image was click so as to take a specific action.
     
            var view = this.up('app-main');
            
            if(record.get("game") === "Chess"){
                var nextView = Ext.create('GameApp.view.chess.ChessHome');
                view.push(nextView);
            }else if(record.get("game") === "Draft"){
                var nextView = Ext.create('GameApp.view.draft.DraftHome');
                view.push(nextView);
            }else if(record.get("game") === "Ludo"){
                var nextView = Ext.create('GameApp.view.ludo.LudoHome');
                view.push(nextView);
            }else if(record.get("game") === "Solitaire"){
                var nextView = Ext.create('GameApp.view.solitaire.SolitaireHome');
                view.push(nextView);
            }else if(record.get("game") === "Whot"){
                var nextView = Ext.create('GameApp.view.whot.WhotHome');
                view.push(nextView);
            }
        
        }
    }

});


