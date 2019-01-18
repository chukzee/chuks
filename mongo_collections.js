
//list of mongodb collections used in this app
var collections = ['users',
    'admins',
    'groups',
    'group_join_requests',
    'tournaments',
    'matches', //store only live and paused matches
    'match_fixtures', //stores matches schedules to begin in specified time - usually in tournaments - but can be done by group member too
    'match_history', //store abandon , cancelled and finnished match
    'play_requests', //stores play requests - this expires after certain period of time. See 'play-request.js' where it is epired (deleted) 
    'upcoming_matches',//stores upcomming tournament matches - expires when the match starts - so create an index to take care of that
    'spectators', //expires every certain period - say 24 hours - so create an index to take care of that
    'comments', //
    'chats',
    'news',
    'wdl',//stores the numbers of wins , draws and losses between two players tournament, group and contact matches
    'video_calls',
    'voice_calls'
];


module.exports = function () {
    var col = {};

    var ensureIndexes = function (sObj) {
        var db = sObj.db;
        var uinqueObj = {unique: true};
        var callback = function (err, result) {
            if (err) {
                console.error(err);
            }
        };


        //users
        db.collection(col.users).ensureIndex({
            user_id: 1
        }
        , uinqueObj, callback);

        db.collection(col.users).ensureIndex({
            first_name: 1,
            last_name: 1,
            player_ranking: 1
        }
        , callback);

        //admins
        db.collection(col.admins).ensureIndex({
            admin_id: 1
        }
        , uinqueObj, callback);


        //groups
        db.collection(col.groups).ensureIndex({
            name: 1,
            'members.user_id': 1// come back to check for correctness
        }
        , uinqueObj, callback);

        db.collection(col.groups).ensureIndex({
            created_by: 1
        }
        , callback);

        //group_join_requests
        db.collection(col.group_join_requests).ensureIndex({
            authorization_token: 1
        }
        , uinqueObj, callback);

        //tournaments
        db.collection(col.tournaments).ensureIndex({
            name: 1,
            'officials.user_id': 1// come back to check for correctness
            //'registered_players.user_id': 1// DON'T PLEASE : to avoid the error:  mongodb cannot index parallel arrays
        }
        , uinqueObj, callback);
        
        db.collection(col.tournaments).ensureIndex({
            created_by: 1,
            date_created: 1,
            officials: 1
        }
        , callback);


        //matches
        db.collection(col.matches).ensureIndex({
            game_id: 1
        }
        , uinqueObj, callback);

        db.collection(col.matches).ensureIndex({
            players: 1,
            'players.user_id': 1, // come back to check for correctness
            game_name: 1,
            game_status: 1
        }
        , callback);

        //match_fixtures        
        db.collection(col.match_fixtures).ensureIndex({
            game_id: 1
        }
        , uinqueObj, callback);

        db.collection(col.match_fixtures).ensureIndex({
            players: 1,
            'players.user_id': 1, // come back to check for correctness
            game_name: 1,
            game_start_time: 1
        }
        , callback);

        //match_history
        db.collection(col.match_history).ensureIndex({
            game_id: 1
        }
        , uinqueObj, callback);

        db.collection(col.match_history).ensureIndex({
            players: 1,
            'players.user_id': 1, // come back to check for correctness
            game_name: 1,
            game_status: 1
        }
        , callback);

        //play_requests
        db.collection(col.play_requests).ensureIndex({
            game_id: 1
        }
        , uinqueObj, callback);

        db.collection(col.play_requests).ensureIndex({
            players: 1,
            'players.user_id': 1, // come back to check for correctness
            game_name: 1,
            request_time: 1
        }
        , callback);



        //spectators
        db.collection(col.spectators).ensureIndex({
            game_id: 1,
            user_id: 1
        }
        , callback);
        
        //upcoming_matches
        db.collection(col.upcoming_matches).ensureIndex({
           reminder_time: 1 //this will be be used to expire the document
        }
        , {expireAfterSeconds: sObj.KICKOFF_TIME_REMINDER}, callback);


        db.collection(col.upcoming_matches).ensureIndex({
            game_name: 1,
            'players.user_id': 1
        }
        , callback);
        
                
        //wdl - wins, draws, losses
        db.collection(col.wdl).ensureIndex({
            'first.player_id': 1,
            'second.player_id': 1
        }
        , callback);
        
        
        db.collection(col.chats).ensureIndex({
            user_id: 1,
            game_id: 1,
            group_name: 1,
            tournament_name: 1,
            delete_for: 1,
            chat_type: 1
        }
        , callback);
        
        db.collection(col.comments).ensureIndex({
            user_id: 1,
            game_id: 1,
            group_name: 1,
            tournament_name: 1,
            delete_for: 1
        }
        , callback);

    };

    this.init = function (sObj) {
        for (var i = 0; i < collections.length; i++) {
            var prop = collections[i];
            col[prop] = prop;
        }

        ensureIndexes(sObj);
        return this;
    };

    this.geCollections = function () {
        return col;
    };
    return this;
};



