
//list of mongodb collections used in this app
var collections = ['users',
    'admins',
    'groups',
    'tournaments',
    'matches',
    'comments',
    'chats',
    'video_calls',
    'voice_calls'
];


module.exports = function () {
    var col = {};

    var ensureIndexes = function (d) {
        var uinqueObj = {unique:true};
        var callback = function (err, result){
            if(err){
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
        ,callback);
        
        //tournaments
        db.collection(col.tournaments).ensureIndex({
            name: 1
        }
        , uinqueObj, callback);
        
        db.collection(col.tournaments).ensureIndex({
            created_by: 1
        }
        ,callback);
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



