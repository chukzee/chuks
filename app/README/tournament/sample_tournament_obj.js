


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
        'official_user_id_1',
        'official_user_id_2',
        'official_user_id_3',
        'official_user_id_4'
    ],
    registered_players: [
        'registered_player_user_id_1',
        'registered_player_user_id_2',
        'registered_player_user_id_3',
        'registered_player_user_id_4'
    ],
    seasons: [
        {
            sn: 1, //season number
            start_time: '01/10/2017 08:45',
            end_time: '01/10/2017 08:45',//will be set automatically when the final game of the season is concluded or when the seanson is cancelled
            winner: 'player_id_2',//will be set automatically when the final game of the season is concluded.
            status: 'before-start', //before-start, start, end, cancel
            rounds: [
                {
                    sn: 1, //first round
                    fixtures: [
                        {
                            player_id_1: 'player_id_1',
                            player_id_2: 'player_id_2',
                            sets: [
                                {
                                    start_time: 'start_time',
                                    end_time: 'end_time',
                                    player_1_score: 0,
                                    player_2_score: 1,
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
            slots: [
                {
                    sn: 1, //first slot
                    player_id: 'player_id_1'// empty by default.
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