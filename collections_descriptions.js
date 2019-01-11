`
Structure of 'matches' collection documents

{
            game_name : ...,
            game_id : :...,
            group_name:..., //available only if it is a match between players of same group . ie group match
            tournament_name:..., //available only if it is a match between players in a tournament . ie tournament match
            players : [ // can be more than two player unlike chess e.g ludo , whot
                {
                    type : ...,//e.g white in the case of chess and draughts - may be something else in other games
                    user_id : ...,
                    name : ....,
                    pic : ....,
                    large_pic : ....,
                    activity : ...., e.g thinking...
                    countdown : .... e.g 5:42
                    wdl : ....., e.g W '3, L 2, D 5'
                },
                {
                    type : ...,//e.g black in the case of chess and draughts - may be something else in other games
                    user_id : ...,
                    name : ....,
                    pic : ....,
                    large_pic : ....,
                    activity : ...., e.g thinking...
                    countdown : .... e.g 5:42
                    wdl : ....., e.g W '3, L 2, D 5',
                }
            ];
            game_id :.....,
            game_elapse_time: ...., e.g 2 days 
            game_views_count: ....,
            game_score: ....,
            game_status : ....,  live and pause state only
            game_position: ....., 
            game_duration: .....,
            game_end_time: .....,;// this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
            game_pause_time: ..... // this will expire the item in the local storage of the client end after 24 hours or less (depending on the design decision)
}




Structure of 'player_rankings' collection documents

{
    user_id: ...., //player user id
    rank_score:...,e.g 424, 521, 832,
    opponents:[ //an array of opponents
                  {
                    user_id:..., //opponent user id
                    rank_score:...,e.g 424, 521, 832,
                    outcome:..., e.g draw, win or loss
                  },  
                  {
                    user_id:..., //opponent user id
                    rank_score:...,e.g 524, 221, 854,
                    outcome:..., e.g draw, win or loss
                  },  
                  {
                    user_id:..., //opponent user id
                    rank_score:...,e.g 124, 321, 424,
                    outcome:..., e.g draw, win or loss
                  },

                  ... and so on
               
               ] 
                             

}

TODO

`
