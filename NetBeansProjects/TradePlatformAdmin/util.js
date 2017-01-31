
var util = function (sObj) {

    var hasPriv = function (user, priv) {
        return user.privileges.split(',').indexOf(priv) > -1;
    };
    this.canFundTraderAccount = function (user) {
        return hasPriv(user, sObj.privileges.FUND_TRADER_ACCOUNT);
    };

    this.canWithdrawTraderFund = function (user) {
        return hasPriv(user, sObj.privileges.FUND_TRADER_ACCOUNT);
    };

    this.canRegisterBroker = function (user) {
        return hasPriv(user, sObj.privileges.REGISTER_BROKER);
    };

    this.canCreateAdminUser = function (user) {
        return hasPriv(user, sObj.privileges.CREATE_ADMIN_USER);
    };

    this.canDeleteAdminUser = function (user) {
        return hasPriv(user, sObj.privileges.DELETE_ADMIN_USER);
    };

    this.canRegisterTrader = function (user) {
        return hasPriv(user, sObj.privileges.REGISTER_TRADER);
    };


    /**
     * Brokers privileges is everything except creating a broker
     * @returns {String}
     */
    this.joinBrokerPrivileges = function () {
        var priv = "";

        for (p in sObj.privileges) {
            if (p !== sObj.privileges.REGISTER_BROKER) {
                priv += p + ",";
            }
        }
        if (priv.length > 1) {
            priv = priv.substring(0, priv.length - 1);//remove trailing comma
        }

        return priv;
    };


    this.remoteRequest = function (res, host, path, content) {
        if (!host || host === "") {
            sObj.sendError(res, "No remote host provided!");
            return;
        }

        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        var callback = function (response) {
            var str = '';
            if (response.statusCode < 200 || response.statusCode > 299) {
                sObj.sendError(res, "Failed to communicate with host, " + host + ". Responded with status code: " + response.statusCode);

            }
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                try {
                    if(!str){
                       sObj.sendError(res, "Nothing returned!");
                       return;
                    }
                    var json = JSON.parse(str);
                    
                    if (json.success) {
                        sObj.sendSuccess(res, "Success" ,json);
                    } else {
                        sObj.sendError(res, json.msg);
                    }
                } catch (e) {
                    sObj.sendError(res, "Oops!!! Something went wrong.");
                    console.log(e);
                }

            });
        };

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
            path: path, // IMPORTANT NOTE! path must be prefixed with '/' e.g '/access/create/admin_user' and not 'access/create/admin_user' otherwise you get 'socket hang up' error which i suppose is Node bug!

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(content ? content : "")
            },
            method: 'POST',
            //key: sObj.httpsOptions.key,//TODO - UNCOMMENT TO ABLE SECURITY - COME BACK ABEG O!!!
            //cert: sObj.httpsOptions.cert,//TODO - UNCOMMENT TO ABLE SECURITY - COME BACK ABEG O!!!
            rejectUnauthorized: false//TODO - NOT SECURE! COMMENT OUT TO ENABLE SECURITY - COME BACK ABEG O!!!
        };

        //make the https request
        var req = sObj.https.request(options, callback);
        if (content) {
            req.write(content);
        }
        req.end();
        //handle connection errors of request
        req.on('error', function (err) {
            sObj.sendError(res, "Could not connect to host - " + host);
        });
    };


    return this;
};

module.exports = util;
