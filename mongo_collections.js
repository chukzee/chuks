
//list of mongodb collections used in this app
var collections = ['users',
    'admins',
    'groups',
    'group_join_requests',
    'tournaments',
    'matches', //store only live and paused matches
    'match_fixtures', //stores matches schedules to begin in specified time - usually in tournaments - but can be done by group member too
    'match_history', //store abandon , cancelled and finnished match
    'play_requests', //stores play requests - this expires after certain period of time
    'spectators', //expires every certain period - say 24 hours - so create an index to take care of that
    'comments', //
    'chats',
    'video_calls',
    'voice_calls',
    'player_rankings'
];


module.exports = function () {
    var col = {};

    var ensureIndexes = function (db) {
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
            'officials.user_id': 1,// come back to check for correctness
            'players.user_id': 1// come back to check for correctness
        }
        , uinqueObj, callback);

        db.collection(col.tournaments).ensureIndex({
            created_by: 1,
            officials: 1
        }
        , callback);


        //matches
        db.collection(col.matches).ensureIndex({
            game_id: 1,
            'moves.serial_no': 1// come back to check for correctness
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
            game_start_time: 1 //this will be be used to expire the document
        }
        , {expireAfterSeconds: 24 * 60 * 60}, callback);


        db.collection(col.spectators).ensureIndex({
            game_id: 1,
            user_id: 1
        }
        , callback);

    };

    this.init = function (db) {
        for (var i = 0; i < collections.length; i++) {
            var prop = collections[i];
            col[prop] = prop;
        }

        ensureIndexes(db);
        return this;
    };

    this.geCollections = function () {
        return col;
    };
    return this;
};



