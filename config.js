

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
     * @type String
     */
    MONGO_DB_NAME: 'game9jadb',
    /**
     * 
     * @type String
     */
    TASKS_FILE: __dirname + '/tasks_dir/tasks_save.tsk',
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
};



