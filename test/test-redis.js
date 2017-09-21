
var Redis = require('ioredis');

redis = new Redis();

/*redis.rpush("test_chuks:my_rem", "chuks_3")
        .then(function (arr) {
            console.log(arr);
        })
        .catch(function (err) {
            console.log(err);
        })
        
*/
redis.lrange("test_chuks:my_rem", 0, -1)
        .then(function (arr) {
            console.log(arr);
        })
        .catch(function (err) {
            console.log(err);
        })
        

redis.lrem("test_chuks:my_rem", 0 ,"chuks_2")
        .then(function (arr) {
            console.log(arr);
        })
        .catch(function (err) {
            console.log(err);
        })
       
                        