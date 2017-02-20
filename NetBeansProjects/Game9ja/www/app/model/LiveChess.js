
Ext.define('GameApp.model.LiveChess', {
    extend: 'Ext.data.Model',
    
    alias: 'model.live-chess',
    
    fields: [
        'white_player_name', 'white_player_username', 'white_player_pic',
        'white_player_rating', 'black_player_name', 'black_player_username',
        'black_player_pic', 'black_player_rating', 'game_duration',
        'score', 'game_position',
    ],

});
