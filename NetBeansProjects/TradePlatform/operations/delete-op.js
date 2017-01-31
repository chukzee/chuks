/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var deleteOp = function (sObj) {

    //No actual delete will take place. Just mark as deleted - that is all
    this.deleteExchangeSpotFx = function (user, input, res) {
        markAsDeleted("exchange_spotfx", user, input, res);
    };


    //No actual delete will take place. Just mark as deleted - that is all
    this.deleteExchangeOptions = function (user, input, res) {
        markAsDeleted("exchange_options", user, input, res);
    };


    //No actual delete will take place. Just mark as deleted - that is all
    this.deleteHistorySpotFx = function (user, input, res) {
        markAsDeleted("history_trades_spotfx", user, input, res);
    };

    //No actual delete will take place. Just mark as deleted - that is all
    this.deleteHistoryOptions = function (user, input, res) {
        markAsDeleted("history_trades_options", user, input, res);
    };

    var markAsDeleted = function (table, user, input, res) {

        var order_ticket_arr = new String(input.order_ticket_list).split(",");
        
        //first try seller id
        sObj.db(table)
                .where("SELLER_ID", user.exchangeId)
                .andWhere("ORDER_TICKET", "in", order_ticket_arr)//array of order tickets as sent from the exchange room in client side
                .update({
                    DEL_BY_SELLER_ID: user.exchangeId
                })
                .then(function (result) {
                    if (result > 0) {
                        //success
                        sObj.sendSuccess(res, "Deleted successfully.");
                        return sObj.promise.reject(null);  // we are done
                    }
                    return sObj.db(table)//try buyer id
                            .where("BUYER_ID", user.exchangeId)
                            .andWhere("ORDER_TICKET", "in", order_ticket_arr)//array of order tickets as sent from the exchange room in client side
                            .update({
                                DEL_BY_BUYER_ID: user.exchangeId
                            });
                })
                .then(function (result) {
                    if (result > 0) {
                        //success
                        sObj.sendSuccess(res, "Deleted successfully.");
                    } else {
                        //well, success but nothing deleted anyway
                        sObj.sendSuccess(res, "Nothing deleted. Not found!");
                    }
                })
                .catch(function (err) {
                    if (err === null) {
                        return; //not an error by our design
                    }
                    console.log(err);//DO NOT DO THIS IN PRODUCTION - RATHER LOG TO ANOTHER PROCESS
                    
                    sObj.sendError(res, 'Could not perform the delete operation.');
                });
    };


    return this;
};

module.exports = deleteOp;

