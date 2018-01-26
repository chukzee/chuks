

var tourn = {

    name: 'tournament_name',
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
            sn: 1,//season number
            begin_time: '01/10/2017 08:45',
            end_time: '01/10/2017 08:45',
            winner: 'player_id_2',
            status: 'before_live', //before_live, live, end
            slots:[
                {
                    sn:1,
                    player_id:'player_id_1'
                },
                {
                    sn:2,
                    player_id:'player_id_2'
                },
                {
                    sn:3,
                    player_id:'player_id_3'
                },
                {
                    sn:4,
                    player_id:'player_id_4'
                }   
            ]
        },
        {
            sn: 2,//season number
            begin_time: '01/10/2017 08:45',
            end_time: '01/10/2017 08:45',
            winner: 'player_id_2',
            status: 'before_live', //before_live, live, end
            slots:[
                {
                    sn:1,
                    player_id:'player_id_1'
                },
                {
                    sn:2,
                    player_id:'player_id_2'
                },
                {
                    sn:3,
                    player_id:'player_id_3'
                },
                {
                    sn:4,
                    player_id:'player_id_4'
                }   
            ]
        },
        {
            sn: 3,//season number
            begin_time: '01/10/2017 08:45',
            end_time: '01/10/2017 08:45',
            winner: 'player_id_2',
            status: 'before_live', //before_live, live, end
            slots:[
                {
                    sn:1,
                    player_id:'player_id_1'
                },
                {
                    sn:2,
                    player_id:'player_id_2'
                },
                {
                    sn:3,
                    player_id:'player_id_3'
                },
                {
                    sn:4,
                    player_id:'player_id_4'
                }   
            ]
        }
    ]
}