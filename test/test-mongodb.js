

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

async function query0(db) {
    try {
        var arr = await db.collection('inventory').find({}, {_id: 0}).toArray();

        for (var i = 0; i < arr.length; i++) {
            console.dir(arr[i]);
        }
    } catch (e) {
        console.error(e);
    }
}

async function query3(db) {
    try {
        
        var c = db.collection('inventory');
        //NOTE: according to mongodb doc, the sample can return duplicate docs
        //occasionaly. However we do not care about that at this time anyway.
        var tourns = await c.aggregate([{$sample: {size: 3}}]).toArray();
        
        console.log(tourns);
    } catch (e) {
        console.log(e);
    }

    
}
async function query1(db) {
    try {
        var arr = await db.collection('inventory').find({
            $and: [{item: 'postcard'}, {"instock": {$elemMatch: {wharehouse: 'B', qty: 15}}}]
        }, {_id: 0}).toArray();

        for (var i = 0; i < arr.length; i++) {
            console.dir(arr[i]);
        }
    } catch (e) {
        console.error(e);
    }
}

async function query2(db) {
    try {
        var arr = await db.collection('inventory').find({
            $or: [{'instock.qty': 5}, {'instock.qty': 60}]
        }, {_id: 0}).toArray();

        for (var i = 0; i < arr.length; i++) {
            console.dir(arr[i]);
        }
    } catch (e) {
        console.error(e);
    }
}

async function update1(db) {
    try {
        var result = await db.collection('inventory').updateOne({
            $and: [{item: 'postcard'}, {'instock.qty':98}]
        },
        {$set :{'instock.$.qty': 98}});

        console.log('found = ',result.result.n);
        console.log('modified = ',result.result.nModified);
        console.log(result.result);
    } catch (e) {
        console.error(e);
    }
}


async function insert1(db) {
    try {
        var obj = {
            item: "new_insert",
            instock: [
                {wharehouse: 'J', qty: 150},
                {wharehouse: 'K', qty: 350}
            ]
        };
        var result = await db.collection('inventory').insertOne(obj);

        console.log(obj);
        console.log('----------------');
        console.log(result);

    } catch (e) {
        console.error(e);
    }
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

        
        //query1(db);
        //query2(db);
        //update1(db);
        //query0(db);
         query3(db);
        //insert1(db);

    } catch (e) {
        console.error(e);
        console.log("Server cannot start!");
        process.exit(1);
    }
}());