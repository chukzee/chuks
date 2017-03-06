Ext.define('GameApp.store.ChessLiveFriendliesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.chess-live-friendlies',
    requires: ['GameApp.model.LiveChess'
    ],
    model: 'GameApp.model.LiveChess',
    autoLoad: true,
    proxy: {
        //type: 'ajax',// UNCOMENT AFTER TESTING
        type: 'memory', //COMMENT OUT THIS LINE AFTER TESTING
        url: 'access/chess/query/friends_live_matches',
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total'
        }
    },

    //REMIND - COMMENT OUT THE data PROPERTY AFTER TESTING

    data: {data: [
            {
                white_player_name: "Chuks1 Alimele1", white_player_username: "chukzee1",
                white_player_small_pic: "chuks-small-pic.png", white_player_large_pic: "chuks-large-pic.png",
                white_player_rating: "5", black_player_name: "Amo1s Akpor1", black_player_username: "amosco1",                
                black_player_small_pic: "amos-small-pic.png", black_player_large_pic: "amos-large-pic.png",
                black_player_rating: "5", game_elapse_time: "1 hours",
                game_views_count: "2,111 views", status: "Live", status_style:"color:green;", score: "1-0", game_position: "", },
            
            
            {
                white_player_name: "Chuks Alimele2", white_player_username: "chukzee2",
                white_player_small_pic: "chuks-small-pic.png", white_player_large_pic: "chuks-large-pic.png",
                white_player_rating: "5", black_player_name: "Amos Akpor2", black_player_username: "amosco2",                                
                black_player_small_pic: "amos-small-pic.png", black_player_large_pic: "amos-large-pic.png",
                black_player_rating: "5", game_elapse_time: "2 hours",
                game_views_count: "2,222 views", status: "Paused", status_style:"color:red;", score: "2-0", game_position: "", },
            
            
            {
                white_player_name: "Chuks Alimele3", white_player_username: "chukzee3",
                white_player_small_pic: "chuks-small-pic.png", white_player_large_pic: "chuks-large-pic.png",
                white_player_rating: "5", black_player_name: "Amos Akpor3", black_player_username: "amosco3",                                    
                black_player_small_pic: "amos-small-pic.png", black_player_large_pic: "amos-large-pic.png",
                black_player_rating: "5", game_elapse_time: "3 hours",
                game_views_count: "2,333 views", status: "End", status_style:"color:red;", score: "3-0", game_position: "", },
        ]}

});


