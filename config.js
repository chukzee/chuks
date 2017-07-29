

module.exports = {

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
    HTTP_PORT: 300,//we now use ngnix as reverse proxy
    /**
     * Server http host used in production
     * @type Number
     */
    HOST: "localhost",//we now use ngnix as reverse proxy
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
     * monogo database name
     * @type Number
     */
    MONGO_DB_NAME: 'game9jadb',
};



