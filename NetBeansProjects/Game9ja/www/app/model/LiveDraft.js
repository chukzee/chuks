
Ext.define('GameApp.model.LiveDraft', {
    extend: 'Ext.data.Model',    
    alias: 'model.live-draft',
    
    fields: [
        'white_player_name', 'white_player_username', 'white_player_pic',
        'white_player_rating', 'black_player_name', 'black_player_username',
        'black_player_pic', 'black_player_rating',  'game_elapse_time', 'game_views_count',
        'score', 'game_position',
    ],

});

