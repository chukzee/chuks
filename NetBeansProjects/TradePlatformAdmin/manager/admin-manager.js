

var adminManager = function (sObj) {

    this.setJWT = function (jwt) {
        this.jwt = jwt;
    };


    this.setSecret = function (secret) {
        this.secret = secret;
    };

    this.authenticate = function (req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.access_token || req.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, this.secret, function (err, decoded) {
                if (err) {
                    sObj.sendAuthFail(res, sObj.MSG_INVALID_AUTH_TOKEN);
                    return;
                } else {
                    var username = typeof decoded === "object" ?
                            decoded.username//may we store the username in an object. using 'object' payload
                            : decoded;//ok here we used 'string' payload

                    sObj.redis.get("admin:" + username)
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
                                console.log("could not cache admin user info in redis: ");
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

        this.getAdminFromDB(input.username, input.password)//Yes from db because the password of the user is not included in the cache in redis
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

                        sObj.redis.set("admin:" + input.username, JSON.stringify(user))
                                .then(function () {

                                    sObj.sendSuccess(res, {token: token, user: user});//send the token to the client from storage - to sent for evey request that requires authentication
                                })
                                .catch(function (err) {

                                    sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                                    //TODO: DO NOT LOG TO CONSOLE IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE REASON
                                    console.log("could not cache admin user info in redis: ");
                                    console.log(err);
                                });


                    }

                })
                .catch(function (err) {
                    sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                    //TODO: DO NOT LOG TO CONSOLE IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE REASON
                    console.log("could not cache admin user info in redis: ");
                    console.log(err);
                });

    };
    var remoteCreateBrokerAdminUser = function (user, input, res) {



        return new sObj.promise(function (resolve, reject) {
            
            if (!input.broker_admin_host_name) {
                sObj.sendError(res, "Broker's admin host not set!");
                reject(null);
                return;
            }
            
            var callback = function (response) {
                var str = '';
                if (response.statusCode < 200 || response.statusCode > 299) {
                    sObj.sendError(res, "Failed to communicate with broker's host. Responded with status code: " + response.statusCode);
                    reject(null);
                }
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    try {
                        var json = JSON.parse(str);
                        if (json.success) {
                            resolve(true);
                        } else {
                            sObj.sendError(res, json.msg);
                            reject(null);
                        }
                    } catch (e) {
                        sObj.sendError(res, "Oops!!! Something went wrong.");
                        console.log(e);
                    }

                });
            };

            console.log("input.privileges = " + input.privileges);

            var content = "access_token=" + input.access_token
                    + "&username=" + input.username
                    + "&password=" + input.password
                    + "&company=" + input.company
                    + "&email=" + input.email
                    + "&privileges=" + input.privileges
                    + "&broker_admin_host_name=" + input.broker_admin_host_name
                    + "&trade_platform_host_name=" + input.trade_platform_host_name;

            var host = input.broker_admin_host_name;
            var split = host.split(':');
            var port;

            if (split[1] && !isNaN(split[1])) {
                host = split[0];
                port = split[1] - 0;
            }
            if (split[2] && !isNaN(split[2])) {
                host = split[1];
                port = split[2] - 0;
            }
            if (host === "localhost") {
                host = "127.0.0.1";// for unknown reason localhost does not work! i do not know why.
            }
            var options = {
                host: host,
                port: port ? port : 443,
                path: '/access/create/admin_user', // IMPORTANT NOTE! path must be prefixed with '/' e.g '/access/create/admin_user' and not 'access/create/admin_user' otherwise you get 'socket hang up' error which i suppose is Node bug!
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(content)
                },
                method: 'POST',
                //key: sObj.httpsOptions.key,//TODO - UNCOMMENT TO ABLE SECURITY - COME BACK ABEG O!!!
                //cert: sObj.httpsOptions.cert,//TODO - UNCOMMENT TO ABLE SECURITY - COME BACK ABEG O!!!
                rejectUnauthorized: false//TODO - NOT SECURE! COMMENT OUT TO ENABLE SECURITY - COME BACK ABEG O!!!
            };

            //make the https request
            var req = sObj.https.request(options, callback);
            req.write(content);
            req.end();
            //handle connection errors of request
            req.on('error', function (err) {
                sObj.sendError(res, "Could not connect to broker's admin host - " + input.broker_admin_host_name);
                reject(err);
            });
        });
    };

    var remoteRegisterTrader = function (user, input, res) {
        
        return new sObj.promise(function (resolve, reject) {

            if (!input.trade_platform_host_name) {
                sObj.sendError(res, "Trade platform host not set!");
                reject(null);
                return;
            }
            
            var callback = function (response) {
                var str = '';
                if (response.statusCode < 200 || response.statusCode > 299) {
                    sObj.sendError(res, "Failed to communicate with trade platform host. Responded with status code: " + response.statusCode);
                    reject(null);
                }
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    try {
                        var json = JSON.parse(str);
                        if (json.success) {
                            resolve(true);
                        } else {
                            sObj.sendError(res, json.msg);
                            reject(null);
                        }
                    } catch (e) {
                        sObj.sendError(res, "Oops!!! Something went wrong.");
                        console.log(e);
                    }

                });
            };

            var content = "access_token=" + input.access_token
                    + "&live=1"//live trader
                    + "&username=" + input.username
                    + "&password=" + input.password
                    + "&first_name=" + input.first_name
                    + "&last_name=" + input.last_name
                    + "&exchange_id=" + input.exchange_id
                    + "&initial_deposit=" + input.initial_deposit
                    + "&email=" + input.email
                    + "&registered_by=" + user.username;

            var host = input.trade_platform_host_name;
            var split = host.split(':');
            var port;

            if (split[1] && !isNaN(split[1])) {
                host = split[0];
                port = split[1] - 0;
            }
            if (split[2] && !isNaN(split[2])) {
                host = split[1];
                port = split[2] - 0;
            }
            if (host === "localhost") {
                host = "127.0.0.1";// for unknown reason localhost does not work! i do not know why.
            }

            var options = {
                host: host,
                port: port ? port : 443,
                path: '/register', // IMPORTANT NOTE! path must be prefixed with '/' e.g '/access/create/admin_user' and not 'access/create/admin_user' otherwise you get 'socket hang up' error which i suppose is Node bug!
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(content)
                },
                method: 'POST',
                //key: sObj.httpsOptions.key,//TODO - UNCOMMENT TO ABLE SECURITY - COME BACK ABEG O!!!
                //cert: sObj.httpsOptions.cert,//TODO - UNCOMMENT TO ABLE SECURITY - COME BACK ABEG O!!!
                rejectUnauthorized: false//TODO - NOT SECURE! COMMENT OUT TO ENABLE SECURITY - COME BACK ABEG O!!!
            };

            //make the https request
            var req = sObj.https.request(options, callback);
            req.write(content);
            req.end();
            //handle connection errors of request
            req.on('error', function (err) {
                sObj.sendError(res, "Could not connect to trade platform host - " + input.trade_platform_host_name);
                reject(err);
            });
        });
    };


    var doCreateAdminUser = function (user, input) {

        return sObj.db.insert({
            USERNAME: input.username,
            PASSWORD: sObj.db.raw("SHA('" + input.password + "')"),
            FIRST_NAME: input.first_name ? input.first_name : input.company, //considering broker
            LAST_NAME: input.last_name,
            EMAIL: input.email,
            PRIVILEGES: input.privileges,
            BROKER_ADMIN_HOST_NAME: input.broker_admin_host_name ? input.broker_admin_host_name : user.broker_admin_host_name,
            TRADE_PLATFORM_HOST_NAME: input.trade_platform_host_name ? input.trade_platform_host_name : user.trade_platform_host_name,
            CREATED_BY: user.username,
            DATE_CREATED: sObj.now()
        }).into('admin');
    };

    this.createAdminUser = function (user, input, res) {

        if (!sObj.util.canCreateAdminUser(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

        checkAssignedPrivileges(input);

        doCreateAdminUser(user, input)
                .then(function () {
                    sObj.sendSuccess(res, "Created admin user successfully!");
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION
                    }
                    sObj.sendError(res, sObj.MSG_SOMETHING_WENT_WRONG);
                });
    };

    var checkAssignedPrivileges = function (input) {

        if (input.privileges) {
            return;//already has privileges set in input
        }

        var privileges = [];

        if (input.register_broker) {
            privileges.push(sObj.privileges.REGISTER_BROKER);
        }

        if (input.create_admin_user) {
            privileges.push(sObj.privileges.CREATE_ADMIN_USER);
        }

        if (input.delete_admin) {
            privileges.push(sObj.privileges.DELETE_ADMIN_USER);
        }

        if (input.register_trader) {
            privileges.push(sObj.privileges.REGISTER_TRADER);
        }

        if (input.fund_trader_account) {
            privileges.push(sObj.privileges.FUND_TRADER_ACCOUNT);
        }

        if (input.withdraw_trader_fund) {
            privileges.push(sObj.privileges.TRADER_FUND_WITHDRAWAL);
        }

        input.privileges = "";
        for (var i = 0; i < privileges.length; i++) {
            input.privileges += privileges[i] + (i < privileges.length - 1 ? "," : "");
        }

    };


    this.deleteAdminUser = function (user, input, res) {
        if (!sObj.util.canDeleteAdminUser(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

        sObj.db.transaction(function (trx) {

            trx.db.delete()
                    .whereRaw("BINARY USERNAME = '" + input.username + "'")
                    .from('admin')
                    .then(function (result) {
                        if (result === 0) {
                            sObj.sendIgnore(res, "Nothing deleted. Make sure the admin user exists!");
                            return sObj.promise.reject(null);
                        }
                        //delete the user in the redis
                        return sObj.redis.del('admin:' + input.username);
                    })
                    .then(function (result) {
                        trx.commit();
                        sObj.sendSuccess(res, "Successfully deleted.");
                    })
                    .catch(function (err) {
                        if (err) {
                            console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                        }
                        trx.rollback();
                    });


        }).catch(function (err) {
            if (err) {
                console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
            }
        });

    };

    this.registerTrader = function (user, input, res) {
        if (!sObj.util.canRegisterTrader(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

        sObj.db('admin')
                .select('TRADE_PLATFORM_HOST_NAME')
                .whereRaw("BINARY USERNAME = '" + user.username + "'")
                .then(function (rows) {
                    if (rows.length === 0) {
                        sObj.sendError(res, "Unknown broker!.");
                        return sObj.promise.reject(null);
                    }
                    input.trade_platform_host_name = rows[0].TRADE_PLATFORM_HOST_NAME;

                    return remoteRegisterTrader(user, input, res);//actually a Promise  since it is called from this thenable function
                })
                .then(function () {
                    sObj.sendSuccess(res, "Registered successfully.");
                })
                .catch(function (err) {
                    if (err) {
                        sObj.sendError(res, "Oops!!! Something went wrong.");
                        console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                    }
                });

    };

    this.registerBroker = function (user, input, res) {
        if (!sObj.util.canRegisterBroker(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

        this.checkBrokerExist(input.username, input.website, input.email)
                .then(function (exists) {
                    if (exists) {
                        sObj.sendError(res, "Broker already exists! username, website or email was found.");
                        return sObj.promise.reject(null);
                    }
                    return checkBrokerageRelevantHostnames(input.username, input.website, input.email);
                })
                .then(function (obj) {
                    if (obj.exists) {
                        sObj.sendError(res, obj.errorMsg);
                        return sObj.promise.reject(null);
                    }

                    sObj.db.transaction(function (trx) {
                        trx.insert({
                            USERNAME: input.username,
                            PASSWORD: sObj.db.raw("SHA('" + input.password + "')"),
                            COMPANY: input.company,
                            WEBSITE: input.website,
                            EMAIL: input.email,
                            BROKER_ADMIN_HOST_NAME: input.broker_admin_host_name,
                            TRADE_PLATFORM_HOST_NAME: input.trade_platform_host_name,
                            REGISTERED_BY: user.username,
                            DATE_REGISTERED: sObj.now()
                        })
                                .into('brokers')
                                .then(function (result) {
                                    input.privileges = sObj.util.joinBrokerPrivileges();
                                    return remoteCreateBrokerAdminUser(user, input, res);
                                })
                                .then(trx.commit)
                                .then(function () {
                                    sObj.sendSuccess(res, "Registered successfully.");
                                })
                                .catch(function (err) {
                                    if (err) {
                                        console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                                    }
                                    trx.rollback();
                                });
                    }).catch(function (err) {
                        if (err) {
                            console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                        }
                    });
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);//DO NOT DO THIS IN PRODUCTION - LOG TO ANOTHER PROCESS INSTEAD
                    }
                });

    };

    this.deleteBroker = function (user, input, res) {
        //NOTE: THIS DOES NOT DELETE THE ADMINS CREATED BY THE BROKER
        sObj.db.delete()
                .where("BINARY USERNAME ='" + input.username + "'")
                .from('brokers')
                .then(function (result) {
                    if (result === 0) {
                        sObj.sendIgnore(res, "Nothing deleted. Make sure the  broker exists!");
                        return sObj.promise.reject(null);
                    }
                    sObj.sendSuccess(res, "Successfully deleted.");
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);// TODO: DON'T DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS FOR PERFORMANCE SAKE
                    }
                });


    };

    this.startUpInfo = function (user, res) {

    };

    var checkBrokerageRelevantHostnames = function (input) {
        return sObj.db('brokers')
                .select('BROKER_ADMIN_HOST_NAME', 'TRADE_PLATFORM_HOST_NAME')
                .whereRaw("BROKER_ADMIN_HOST_NAME='" + input.broker_admin_host_name + "'")
                .orWhereRaw("TRADE_PLATFORM_HOST_NAME='" + input.trade_platform_host_name + "'")
                .then(function (rows) {
                    var obj = {};
                    obj.exists = false;
                    if (rows.length === 0) {
                        return obj;
                    }
                    var row = rows[0];
                    obj.exists = true;
                    if (row.BROKER_ADMIN_HOST_NAME === input.broker_admin_host_name) {
                        obj.errorMsg = "Broker's host name already exists!";
                    } else {
                        obj.errorMsg = "Trade platform host name already exists!";
                    }
                    return obj;//actually a Promise  since it is called from this thenable function
                });
    };

    this.checkBrokerExist = function (username, website, email) {
        return sObj.db('brokers').select('USERNAME')
                .whereRaw("BINARY USERNAME='" + username + "'")
                .orWhereRaw("WEBSITE='" + website + "'")//BINARY not neccessary here
                .orWhereRaw("BINARY EMAIL='" + email + "'")
                .then(function (rows) {
                    return rows.length > 0;//actually a Promise  since it is called from this thenable function
                });
    };

    this.checkAdminExist = function (username) {
        return sObj.db('admin').select('USERNAME')
                .whereRaw("BINARY USERNAME='" + username + "'")
                .then(function (rows) {
                    return rows.length > 0;//actually a Promise  since it is called from this thenable function
                });
    };

    this.forgotPassword = function (user, input, res) {

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


    this.getAllBrokers = function () {
        //TODO - FIRST GET FROM REDIS - NOT YET IMPLEMENTED
        return sObj.db('brokers').select()
                .then(function (rows) {
                    var users = [];

                    for (var i = 0; i < rows.length; i++) {
                        users[i] = brokerObject(rows[i]);
                    }

                    return users;//actually a Promise  since it is called from this thenable function
                });
    };

    this.getAllAdmins = function () {
        //TODO - FIRST GET FROM REDIS - NOT YET IMPLEMENTED
        return sObj.db('admin').select()
                .then(function (rows) {
                    var users = [];

                    for (var i = 0; i < rows.length; i++) {
                        users[i] = adminObject(rows[i]);
                    }

                    return users;//actually a Promise  since it is called from this thenable function
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
                                    var user = adminObject(rows[0]);
                                    return user;//actually a Promise  since it is called from this thenable function
                                });
                    }

                    return JSON.parse(str_user);//actually a Promise  since it is called from this thenable function
                });


    };

    this.getAdminFromDB = function (username, password) {
        return sObj.db('admin').select()//"SHA('" + input.password + "')"
                .whereRaw("BINARY USERNAME='" + username + "' AND BINARY PASSWORD = SHA('" + password + "')")
                .then(function (rows) {
                    var user = adminObject(rows[0]);
                    return user;//actually a Promise  since it is called from this thenable function
                });
    };

    this.getBrokerFromDB = function (username, password) {
        return sObj.db('brokers').select()//"SHA('" + input.password + "')"
                .whereRaw("BINARY USERNAME='" + username + "' AND BINARY PASSWORD = SHA('" + password + "')")
                .then(function (rows) {
                    var user = brokerObject(rows[0]);
                    return user;//actually a Promise  since it is called from this thenable function
                });
    };

    var adminObject = function (row) {
        if (!row) {
            return null;
        }

        return {
            username: row.USERNAME,
            firstName: row.FIRST_NAME,
            lastName: row.LAST_NAME,
            email: row.EMAIL,
            broker_admin_host_name: row.BROKER_ADMIN_HOST_NAME,
            trade_platform_host_name: row.TRADE_PLATFORM_HOST_NAME,
            privileges: row.PRIVILEGES
        };
    };

    var brokerObject = function (row) {
        if (!row) {
            return null;
        }

        return {
            username: row.USERNAME,
            company: row.COMPANY,
            websit: row.WEBSITE,
            email: row.EMAIL,
            broker_admin_host_name: row.BROKER_ADMIN_HOST_NAME,
            trade_platform_host_name: row.TRADE_PLATFORM_HOST_NAME
        };
    };


    return this;
};

module.exports = adminManager;
