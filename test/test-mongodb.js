
var mongo = require('mongodb').MongoClient;


function insertStuff(db) {

    db.collection('inventory').insertMany([
        {
            item: "journal",
            instock: [
                {wharehouse: 'A', qty: 5},
                {wharehouse: 'C', qty: 15}
            ]
        },
        {
            item: "notebook",
            instock: [
                {wharehouse: 'C', qty: 5}
            ]
        }, {
            item: "paper",
            instock: [
                {wharehouse: 'A', qty: 60},
                {wharehouse: 'B', qty: 15}
            ]
        }, {
            item: "postcard",
            instock: [
                {wharehouse: 'B', qty: 15},
                {wharehouse: 'C', qty: 35}
            ]
        }
    ])
            .then(function (result) {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            });
}

function query1(db) {
    db.collection('inventory').find({
        $and :[{item:'postcard'},{"instock": {$elemMatch: {wharehouse: 'B', qty: 15}}}]
    })
            .toArray()
            .then(function (value) {
                for (var i = 0; i < value.length; i++) {
                    console.dir(value[i]);
                }
            })
            .catch(function (err) {
                console.log(err);
            });


}

(async function () {
    var mongo_url = 'mongodb://' + "localhost" + ':' + 27017 + '/' + "chuks_test";
    try {
        db = await mongo.connect(mongo_url, {
            poolSize: 50
                    //,ssl: true //TODO
                    //and many more optionS TODO - see doc at http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/
        });
        console.log('Connected to mongo server at : ' + mongo_url);

        query1(db);

    } catch (e) {
        console.error(e);
        console.log("Server cannot start!");
        process.exit(1);
    }
}());