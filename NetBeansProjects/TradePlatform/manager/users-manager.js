

var usersManager = function (sObj, emailer) {

    this.setJWT = function (jwt) {
        this.jwt = jwt;
    };


    this.setSecret = function (secret) {
        this.secret = secret;
    };
    this.setAdminSecret = function (admin_secret) {
        this.admin_secret = admin_secret;
    };

    this.authAdmin = function (req, res, next) {
        authenticate("admin:", this.admin_secret, req, res, next);
    };

    this.authTrader = function (req, res, next) {
        authenticate("user:", this.secret, req, res, next);
    };

    var authenticate = function (PREFIX, auth_secret, req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.access_token || req.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, auth_secret, function (err, decoded) {
                if (err) {
                    sObj.sendAuthFail(res, sObj.MSG_INVALID_AUTH_TOKEN);
                    return;
                } else {
                    var username = typeof decoded === "object" ?
                            decoded.username//may we store the username in an object. using 'object' payload
                            : decoded;//ok here we used 'string' payload

                    sObj.redis.get(PREFIX + username)
                            .then(function (result) {
                                if (!result) {
                                    sObj.sendAuthFail(res, "Session not available!");
                                    return;
                                }
                                // if everything is good, save the user to request object for use in other routes
                                req.user = JSON.parse(result);
                                next();//to next middleware or route
                            })
                            .catch(function (err) {
                                sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                                //TODO: DO NOT LOG TO CONSOLE IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE REASON
                                console.log("could not cache user info in redis: ");
                                console.log(err);
                            });

                }
            });

        } else {

            // if there is no token
            // return an error
            return sObj.sendAuthFail(res, sObj.MSG_NO_AUTH_TOKEN);

        }
    };


    this.login = function (input, res) {

        this.getUserFromDB(input.username, input.password)//Yes from db because the password of the user is not included in the cache in redis
                .then(function (user) {

                    if (!user) {
                        sObj.sendError(res, 'Invalid username or password');
                    } else {
                        //we will just sign the username of the user
                        var token = this.jwt.sign(user.username, this.secret /*, {
                         expiresInMinutes: loginExpiryInMinutes //TODO LATER AFTER COMPREHENSIVE STUDY 
                         }*/);

                        //save the user in redis with his token attached
                        user.token = token; //attach the token

                        sObj.redis.set("user:" + input.username, JSON.stringify(user))
                                .then(function () {
                                    sObj.sendSuccess(res, {token: token, user: user});//send the token to the client from storage - to sent for evey request that requires authentication
                                })
                                .catch(function (err) {
                                    sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                                    //TODO: DO NOT LOG TO CONSOLE IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE REASON
                                    console.log("could not cache user info in redis: ");
                                    console.log(err);
                                });


                    }

                })
                .catch(function (err) {
                    sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                    //TODO: DO NOT LOG TO CONSOLE IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE REASON
                    console.log("could not cache user info in redis: ");
                    console.log(err);
                });

    };

    this.register = function (input, res) {
        //no need to check if the user already exist since the username and exchange id column
        //in the database are defined as unique. That alone will prevent duplicate entry and will throw 
        //error. we shall just catch the error and notify the user of the failed operation. Then the
        //user should just try again. 

        getUserExchangeId(input)
                .then(function (user_exchande_id) {
                    if (input.initial_deposit < 0) {
                        sObj.sendError(res, "Invalid initial deposit! Must not be less than zero.");
                        return;
                    }
                    var column_map = {
                        EXCHANGE_ID: user_exchande_id,
                        USERNAME: input.username,
                        LIVE: input.live ? 1 : 0, //All accounts create be a trader himself is demo. Brokers create live accounst for traders
                        PASSWORD: sObj.db.raw("SHA('" + input.password + "')"),
                        FIRST_NAME: input.first_name,
                        LAST_NAME: input.last_name,
                        EMAIL: input.email,
                        COUNTRY: input.country ? input.country : '',
                        ACCOUNT_BALANCE: input.initial_deposit,
                        REGISTERED_BY: input.registered_by,
                        DATE_REGISTERED: sObj.now()
                    };

                    var user = userObject(column_map);

                    sObj.db.transaction(function (trx) {
                        trx.insert(column_map)
                                .into('users')
                                .then(function (result) {
                                    //record the initial deposit
                                    return trx.insert({
                                        USERNAME: input.username, TRAN_TYPE: "DEPOSIT", TRAN_DATE: sObj.now(), TRAN_DETAILS: "INITIAL DEPOSIT UPON ACCCOUNT OPENING.", AMOUNT: input.initial_deposit
                                    }).into('account_tran');
                                })
                                .then(function (result) {
                                    //now insert the user into redis - cache
                                    return sObj.redis.set("user:" + input.username, JSON.stringify(user));
                                })
                                .then(function (result) {
                                    trx.commit();
                                    sObj.sendSuccess(res, 'Registered successfully.');
                                })
                                .catch(function (err1) {//first catch
                                    trx.rollback();
                                    this.checkUserExist(input.username)
                                            .then(function (exist) {
                                                if (exist) {
                                                    sObj.sendError(res, 'User already exist.');
                                                    console.log('User already exist.');
                                                } else {
                                                    sObj.sendError(res, 'Could not register! Please try again later.');
                                                    //TODO - in production log to another process for performance sake	
                                                    console.log(err1); // first 
                                                }

                                            })
                                            .catch(function (err2) {//second catch
                                                //TODO - in production log to another process for performance sake 
                                                console.log(err1); // first 
                                                console.log(err2); // second
                                            });

                                });
                    }).catch(function (err) {
                        if (err) {//TODO - in production log to another process for performance sake 
                            console.log(err);
                        }
                    });

                })
                .catch(function (err) {
                    sObj.sendError(res, 'Could not register! Please try again.');
                    if (err) {//TODO - in production log to another process for performance sake 
                        console.log("Possible Exchange id conflict detected and prevented. Please review application logic in this respect!");
                        console.log(err);
                    }
                });
    };


    this.startUpInfo = function (user, res) {

        if (!user) {
            res.end();
            return;
        }

        var startup = {};

        startup.time = new Date().getTime();//important! DO NOT SEND sObj.now() - let the client convert to utc - abeg o!!!
        startup.symbols_attr = sObj.config.SYMBOLS_ATTR;

        /*COMMENTED OUT BECAUSE OF THE DIFFULTY OF UPDATING EXTJS COMBOBOX
         * 
         startup.symbols = [];//initialize array to store supported platform symbols
         startup.symbols = startup.symbols.concat(sObj.config.SPOT_SYMBOLS);
         startup.symbols = startup.symbols.concat(sObj.config.FUTURES_SYMBOLS);
         startup.symbols = startup.symbols.concat(sObj.config.COMMODITIES_SYMBOLS);
         startup.symbols = startup.symbols.concat(sObj.config.OIL_AND_GAS_SYMBOLS);
         */

        sObj.db('users')
                .select('ACCOUNT_BALANCE')
                .where('USERNAME', user.username)
                .andWhere('LIVE', user.live)
                .then(function (rows) {
                    if (rows.length > 0) {
                        startup.account_balance = rows[0].ACCOUNT_BALANCE;
                        startup.version = sObj.config.VERSION;
                    }
                    sObj.sendSuccess(res, "Success", startup);
                })
                .catch(function (err) {
                    console.log(err);
                });
    };


    var getUserExchangeId = function (input) {
        if (input.exchange_id) {
            return sObj.promise.resolve(input.exchange_id);
        }
        return sObj.db('users')
                .max('SN  as max')
                .then(function (rows) {
                    var sn = 0;
                    if (rows.length > 0) {
                        sn = rows[0].max;
                    }
                    var str = new String(sn);
                    var l = str.length;
                    var MIN_CHAR = 4;
                    var r = l < MIN_CHAR ? MIN_CHAR - l : 0;
                    var zeros = "";
                    for (var i = 0; i < r; i++) {
                        zeros += "0";
                    }
                    str = zeros + str;
                    var rand = Math.random() * 97;
                    rand = Math.floor(rand);
                    rand = rand < 30 ? (rand + 30) : rand;
                    var id = sObj.EXD_PREFIX + str + rand;
                    return id;
                });
    };

    this.checkUserExist = function (username) {
        return sObj.db('users').select('USERNAME')
                .whereRaw("BINARY USERNAME='" + username + "'")
                .then(function (rows) {
                    return rows.length > 0;//actually a Promise  since it is called from this thenable function
                });
    };

    this.forgotPassword = function (input, res) {
        sObj.db('users').select('FIRST_NAME', 'LAST_NAME', 'EMAIL')
                .whereRaw("BINARY USERNAME='" + input.username + "'")
                .then(function (rows) {

                    if (rows.length > 0) {
                        var email_addr = rows[0].EMAIL;
                        emailer.emailRecoverPassword({
                            first_name: rows[0].FIRST_NAME,
                            last_name: rows[0].LAST_NAME,
                            email: email_addr
                        });

                        sObj.sendSuccess(res, 'Please check your email.<br/>An email has been sent to ' + email_addr);
                    } else {
                        sObj.sendError(res, 'Unknown username!');
                    }
                })
                .catch(function (err) {
                    sObj.sendError(res, 'Oops! Something went wrong. Please try again later.');
                    if (err) {
                        console.log(err);//TODO - in production log to another process for performance sake 
                    }
                });
    };

    /**
     *E.g password - NOTE: never change username. it can lead to inconsitent user info because of different places users are store
     * @param {type} user
     * @param {type} input
     * @param {type} res
     * @returns {undefined}
     */
    this.changePassword = function (user, input, res) {

    };

    this.deleteUser = function (user, input, res) {

    };

    this.blockUser = function (user, input, res) {

    };

    this.getAllUsers = function () {
        //TODO - FIRST GET FROM REDIS - NOT YET IMPLEMENTED
        return sObj.db('users').select()
                .then(function (rows) {
                    var users = [];

                    for (var i = 0; i < rows.length; i++) {
                        users[i] = userObject(rows[i]);
                    }

                    return users;//actually a Promise  since it is called from this thenable function
                });
    };

    this.getUserByExchangeID = function (exchange_id) {
        return sObj.db('users').select()
                .whereRaw("BINARY EXCHANGE_ID='" + exchange_id + "'")
                .then(function (rows) {
                    var user = userObject(rows[0]);
                    return user;//actually a Promise  since it is called from this thenable function
                });
    };

    this.getUser = function (username) {
        //first get from redis
        return sObj.redis.get("user:" + username)
                .then(function (str_user) {
                    if (!str_user || str_user === '') {
                        //get from the database
                        return sObj.db('users').select()
                                .whereRaw("BINARY USERNAME='" + username + "'")
                                .then(function (rows) {
                                    if (rows.length > 0) {
                                        return userObject(rows[0]);//actually a Promise  since it is called from this thenable function
                                    }
                                    return;//actually a Promise  since it is called from this thenable function
                                });

                    } else {
                        return JSON.parse(str_user);//actually a Promise  since it is called from this thenable function
                    }

                });


    };

    this.getUserByAdmin = function (_user, input, res) {
        this.getUser(input.username)
                .then(function (user) {
                    if (user) {
                        sObj.sendSuccess(res, "Success", {user: user});
                    } else {
                        sObj.sendError(res, 'User not found!');
                    }
                })
                .catch(function (err) {
                    if (err) {
                        sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                        console.log(err);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS!
                        return;
                    } else {
                        res.end();
                    }
                });


    };


    this.tryGetUser = function (username, foundUser, notFoundUser) {
        this.getUser(username)
                .then(function (user) {
                    if (user) {
                        foundUser(user);
                    } else {
                        notFoundUser();
                    }
                })
                .catch(function (err) {
                    notFoundUser();
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS!
                    }
                });


    };

    this.getUserFromDB = function (username, password) {
        return sObj.db('users').select()//"SHA('" + input.password + "')"
                .whereRaw("BINARY USERNAME='" + username + "' AND BINARY PASSWORD = SHA('" + password + "')")
                .then(function (rows) {
                    var user = userObject(rows[0]);
                    return user;//actually a Promise  since it is called from this thenable function
                });
    };

    this.searchUsers = function (user_search_str) {

    };

    var userObject = function (row) {
        if (!row) {
            return null;
        }

        return {
            username: row.USERNAME,
            live: row.LIVE, //WHETER LIVE OR DEMO ACCOUNT
            exchangeId: row.EXCHANGE_ID,
            firstName: row.FIRST_NAME,
            lastName: row.LAST_NAME,
            sex: row.SEX,
            email: row.EMAIL,
            dob: row.DOB,
            address: row.ADDRESS,
            country: row.COUNTRY,
            state: row.STATE,
            company: row.COMPANY
        };
    };


    return this;
};

module.exports = usersManager;
