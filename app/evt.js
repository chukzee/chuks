

class Evt{
    
    get season_start(){
        return 'season_start';
    }
    
    get season_cancel(){
        return 'season_cancel';
    }
    
    get season_delete(){
        return 'season_delete';
    }

    get season_end(){
        return 'season_end';
    }
    
    get notify_upcoming_match(){
        return 'notify_upcoming_match';
    }
        
    get game_move(){
        return 'game_move';
    }
    
    get game_move_sent(){
        return 'game_move_sent';
    }
    
    get play_request(){
        return 'play_request';
    }
    
    get play_request_rejected (){
        return 'play_request_rejected';
    }
    
    get play_request_expired(){
        return 'play_request_expired';
    }
    
    get group_join_request(){
        return 'group_join_request';
    }
    
    get game_start(){
        return 'game_start';
    }
    
    get watch_game_start(){
        return 'watch_game_start';
    }
    
    get game_resume(){
        return 'game_resume';
    }

    get watch_game_resume(){
        return 'watch_game_resume';
    }
        
    get game_pause(){
        return 'game_pause';
    }
    
    get game_finish(){
        return 'game_finish';
    }
    
    get game_abandon(){
        return 'game_abandon';
    }
    
    get tournament_general_chat(){
        return 'tournament_general_chat';
    }
    
    get tournament_inhouse_chat(){
        return 'tournament_inhouse_chat';
    }
    
    get group_chat(){
        return 'group_chat';
    }
    
    get game_chat(){
        return 'game_chat';
    }
    
    get comment(){
        return 'comment';
    }
}

var evt = new Evt();

module.exports = evt;