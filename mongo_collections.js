
//list of mongodb collections used in this app
var collections = ['users',
    'admins',
    'groups',
    'group_join_requests',
    'tournaments',
    'matches',
    'spectators', //expires every certain period - say 24 hours - so create an index to take care of that
    'comments', //
    'chats',
    'video_calls',
    'voice_calls'
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
            name: 1
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
            name: 1
        }
        , uinqueObj, callback);

        db.collection(col.tournaments).ensureIndex({
            created_by: 1
        }
        , callback);


        //spectators
        db.collection(col.spectators).ensureIndex({
            game_start_time: 1 //this will be be used to expire the document
        }
        , {expireAfterSeconds: 24 * 60 * 60}, callback);

    };

    this.init = function (db) {
        for (var i = 0; i < collections.length; i++) {
            var prop = col[i];
            col[prop] = prop;
        }

        ensureIndexes(db);

    };

    this.geCollections = function () {
        return col;
    };

};



