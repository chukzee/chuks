

Ext.define('GameApp.view.game.GameLiveFriendlies', {
    extend: 'Ext.List',
    xtype: 'game-live-friendlies',
    fullscreen: true,
    singleSelect: true,
    
    itemTpl: '<div class="game9ja_live_games_list">'+
            '<div>'+
                '<img name="white_player_profile_pic" src="{white_player_small_pic}" alt="" onerror="this.onerror=null; this.src=\'resources/images/default_person.png\';"/>'+
            '</div>'+
            '<div>'+
                '<div>'+
                    '<div>'+
                        '{white_player_name}'+
                    '</div>'+
                    '<div>'+
                        '{game_elapse_time}'+
                    '</div>'+
                '</div>'+
                '<div>'+
                    '<div>'+
                        '{score}'+
                    '</div>'+
                    '<div style="{status_style}">'+
                        '{status}'+//whether Live or Paused or End                
                    '</div>'+
                '</div>'+
                '<div>'+
                    '<div>'+
                        '{game_views_count}'+
                    '</div>'+
                    '<div>'+
                        '{black_player_name}'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div>'+
                '<img name="black_player_profile_pic"   src="{black_player_small_pic}" alt="" onerror="this.onerror=null; this.src=\'resources/images/default_person.png\';"/>'+
            '</div>'+
        '</div>',

    items: [{
            xtype: 'button',
            scrollDock: 'bottom',
            docked: 'bottom',
            html: '<div>Show more...</div>'
        }],
    

});


