

var accountManager = function (sObj) {



    this.fundAccount = function (user, input, res) {
        if (!sObj.util.canFundTraderAccount(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }        
        
        var content = "access_token=" + input.access_token
                + (input.username ? "&username=" + input.username : "")
                + (input.amount ?  "&amount=" + input.amount : "");

        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/account/fund', content);

    };

    this.withdrawFund = function (user, input, res) {
        if (!sObj.util.canWithdrawTraderFund(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

        var content = "access_token=" + input.access_token
                + (input.username ? "&username=" + input.username : "")
                + (input.amount ?  "&amount=" + input.amount : "");    
        
        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/account/withdraw', content);

    };

    this.setWithdrawPaymentMethod = function (user, input, res) {
        if (!sObj.util.canWithdrawTraderFund(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

        var content = "access_token=" + input.access_token
                + (input.serial_nos ? "&serial_nos=" + input.serial_nos : "")
                + (input.payment_method ?  "&payment_method=" + input.payment_method : "");    
        
        sObj.util.remoteRequest(res, user.trade_platform_host_name, '/admin/account/withdrawal/payment_method', content);

    };


    this.deleteFund = function (user, input, res) {
        if (!sObj.util.canFundTraderAccount(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }

    };

    this.deleteWithdrawal = function (user, input, res) {
        if (!sObj.util.canWithdrawTraderFund(user)) {
            sObj.sendError(res, "Operation denied! Privilege not granted.");
            return;
        }
        

    };


    return this;
};

module.exports = accountManager;
