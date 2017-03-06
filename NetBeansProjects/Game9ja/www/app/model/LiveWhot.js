
Ext.define('GameApp.model.LiveWhot', {
    extend: 'Ext.data.Model',

    alias: 'model.live-whot',

    fields: [
        'white_player_name', 'white_player_username', 'white_player_small_pic','white_player_large_pic',
        'white_player_rating', 'black_player_name', 'black_player_username',
        'black_player_small_pic','black_player_large_pic', 'black_player_rating', 'game_elapse_time',
        'game_views_count', 'status', 'status_style', 'score', 'game_position'
    ]

});

