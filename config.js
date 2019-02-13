

var fs = require('fs');

var web_root = 'C:/Users/HP-PC/Documents/NetBeansProjects/Game9ja/public/www';
//check whether the web root exist
try {

    var stats = fs.statSync(web_root);

    if (!stats.isDirectory()) {
        throw Error('Web root is not a directory: '+ web_root);
    }
} catch (e) {
    console.log('Web root does not exist: '+ web_root);
    throw Error(e);
}


module.exports = {

    WEB_ROOT: web_root,

    SMALL_IMAGE_DIR: web_root + '/uploads/images/small',

    LARGE_IMAGE_DIR: web_root + '/uploads/images/large',

    IMAGE_TYPE: '.png',

    SMALL_IMAGE_SIZE: 60,

    LARGE_IMAGE_SIZE: 800,
    
    TEMP_DIR : web_root + '/temp',

    /**
     * Server https port used in production
     * @type Number
     */
    //HTTPS_PORT: 443,//disabled since we now use ngnix as reverse proxy
    /**
     * Server http port used in production
     * @type Number
     */
    //HTTP_PORT: 80,
    HTTP_PORT: 300, //we now use ngnix as reverse proxy
    /**
     * Server http host used in production
     * @type Number
     */
    HOST: "localhost", //we now use ngnix as reverse proxy
    /**
     * monogo host
     * @type String
     */
    MONGO_HOST: "localhost",

    /**
     * monogo port
     * @type Number
     */
    MONGO_PORT: 27017,

    /**
     * image service host
     * @type String
     */
    IMAGE_SERVICE_HOST: "localhost",
    /**
     * image service port
     * @type Number
     */
    IMAGE_SERVICE_PORT: 500,

    IMAGE_SERVICE_PROTOCOL: 'http',
    /**
     * monogo database name
     * @type String
     */
    MONGO_DB_NAME: 'game9jadb',
    /**
     * 
     * @type String
     */
    TASKS_FILE: __dirname + '/tasks_persist_dir/tasks_saved.json',
    /**
     * The maximum number of session a single user can have at a time.
     * It is possible for a single user to have more than one session
     * if connected from different device. But we have to limit the
     * number by disconnnecting the oldest after each new one causes
     * his number of sessions to go beyound our acceptable limit.
     * 
     * @type Number
     */
    MAX_SESSION_PER_SAME_USERNAME: 10,

    /**
     * Json Web Token (JWT) secret - PLEASE DO NOT MODIFY THIS SECRET EXCEPT WHEN ABSOLUTELY NEEDED.
     * 
     * NOTE : IF THIS SECRET IS MODIFID IT WILL INVALIDATE THE ENTIRE USERS CONNECTIONS AND THE 
     * ENTIRE REDIS CACHE MAY NEED TO BE DROPED. SO MODIFY WITH CAUTION
     * 
     * @type String
     */
    jwtSecret: "bfa633968fb6ddd251178f68a1f0c9e3060d5f859f084061b0dc93db198d35afeced835091bc1a1fd54f495971dedfe09c7aac0936ff5eac1184210e786ca205",
    jwtImageServiceSecret: "f0c9e3060d5f859f0840615091bc1a1fd540e786ca205dedfe09c7aac0936ff5eac118421b0dcbfa633968fb6ddd25f495971ced831178f68a193db198d35afe"
};


