


//Sample tournament document object
var tourn = {

    name: 'tournament_name',
    type: 'round-robin', //round-robin and single-elimination 
    sets_count: 3, // number of times two player will play each other before a winner is determined - max is 5
    game: 'game',
    user_id: 'user_id',
    status_message: 'status_message',
    photo_url: 'photo_url',

    officials: [
        {}, //info
        {}, //info
        {}, //info
        {}//info
    ],
    registered_players: [
        {}, //info
        {}, //info
        {}, //info
        {}//info
    ],
    seasons: [
        {
            sn: 1, //season number
            start_time: '01/10/2017 08:45',
            end_time: '01/10/2017 08:45', //will be set automatically when the final game of the season is concluded or when the seanson is cancelled
            winner: 'player_id_2', //will be set automatically when the final game of the season is concluded.
            status: 'before-start', //before-start, start, end, cancel
            rules: {//game rules - each season will have its own rules

            },
            rounds: [
                {
                    sn: 1, //first round
                    fixtures: [
                        {
                            game_id: 'game_id', //important
                            start_time: 'start_time',
                            end_time: 'end_time',
                            player_1: {
                                slot: 'player_1_slot_number', // used to represent a dummy player when no player is set.
                                id: 'player_1_user_id',
                                score: 0 //game score - a won set increase the value by 1 and a draw leave
                                        // as same - NOTE this is not piont score which is 3-1-0 scoring system.
                            },

                            player_2: {
                                slot: 'player_2_slot_number', // used to represent a dummy player when no player is set.
                                id: 'player_2_user_id',
                                score: 0 //game score - a won set increase the value by 1 and a draw leave
                                        // as same - NOTE this is not piont score which is 3-1-0 scoring system.
                            },

                            sets: [// 'sets'  store the number of games to make a complete match  
                                {
                                    points: [0, 0], //initialize the two point scores of the players to zero - NOTE: we are user 3-1-0 scoring as in football, also used in chess.
                                },
                                {
                                    //... sets array element
                                }
                            ]
                        },
                        {
                            //... fixtures array element
                        }
                    ]
                },
                {

                }
            ],
            slots: [//NOTE: any modification of the player_id in any slot here will require a corresponding update in the season fixtures - see above
                {
                    sn: 1, //first slot
                    player_id: 'player_id_1', // empty by default.
                    total_points: 0,
                    total_wins: 0,
                    total_losses: 0,
                    total_draws: 0,
                    total_played: 0
                },
                {
                    //... slots array element
                },
                {
                    //... slots array element
                },
                {
                    //... slots array element
                }
            ]
        },
        {
            //... seasons array element
        },
        {
            //... seasons array element
        }
    ]
}