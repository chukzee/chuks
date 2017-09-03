`
Structure of 'matches' collection documents

{
            game_name : ...,
            game_id : :...,
            group_name:..., //available only if it is a match between players of same group . ie group match
            tournament_name:..., //available only if it is a match between players in a tournament . ie tournament match
            players : [ // can be more than two player unlike chess e.g ludo , whot
                {
                    type : ...,//e.g white in the case of chess and draft - may be something else in other games
                    user_id : ...,
                    name : ....,
                    pic : ....,
                    large_pic : ....,
                    activity : ...., e.g thinking...
                    countdown : .... e.g 5:42
                    wld : ....., e.g W '3, L 2, D 5'
                },
                {
                    type : ...,//e.g black in the case of chess and draft - may be something else in other games
                    user_id : ...,
                    name : ....,
                    pic : ....,
                    large_pic : ....,
                    activity : ...., e.g thinking...
                    countdown : .... e.g 5:42
                    wld : ....., e.g W '3, L 2, D 5',
                }
            ];
            game_id :.....,
            game_elapse_time: ...., e.g 2 days 
            game_views_count: ....,
            game_score: ....,
            game_status : ...., e.g  request, fixture, live , pause, end - these are the 5 differend status of the game
            game_position: ....., 
            game_duration: .....,
            game_end_time: .....,;// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            game_pause_time: ..... // this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
}




Structure of 'groups' collection documents

TODO

`
