
var sObj = null;

module.exports = function (_sObj) {
    sObj = _sObj;
    this.anlyzeOrder = function (order) {
        //set the respective seller and buyer properties of commission ,  payout, profit/loss and result
        
        console.log('order.pip_value '+order.pip_value);
        
        if (order.product_type === "spotfx") {


            if (order.seller_result === "WIN") {

                var amt = order.size * order.pip_value * order.tp / 100;

                order.seller_commission = order.size * sObj.config.COMMISSION / 100;
                order.seller_profit_and_loss = amt - order.seller_commission;

                order.buyer_commission = 0;
                order.buyer_profit_and_loss = -amt;

            } else if (order.seller_result === "LOSS") {

                var amt = order.size * order.pip_value  * Math.abs(order.sl / 100);

                order.buyer_commission = order.size * sObj.config.COMMISSION / 100;
                order.buyer_profit_and_loss = amt - order.buyer_commission;

                order.seller_commission = 0;
                order.seller_profit_and_loss = -amt;

            } else {//BOTH ARE BREAK EVEN - For Spotfx this may happen if a 
                //trade which is not already activated is nullified (rejected by the server) 
                //for reason such as when the server expectedly  shuts down
                //and comed back up when the trade countdown is already over. In case the trade 
                //is rendered useless

                //seller
                order.seller_commission = 0;
                order.seller_profit_and_loss = 0;

                //buyer
                order.buyer_commission = 0;
                order.buyer_profit_and_loss = 0;

            }

        } else if (order.product_type === "options") {
            
            //NOTE: according to onyeka, options does not need pip value consideration
            
            order.seller_premium = order.premium;
            order.seller_price = order.price;
            order.buyer_premium = order.price;//opposite
            order.buyer_price = order.premium;//opposite

            if (order.seller_result === "WIN") {

                //winner -seller
                order.seller_commission = order.size * sObj.config.COMMISSION / 100;
                order.seller_profit_and_loss = (order.size * order.seller_price / 100) - order.seller_commission;

                //losser - buyer
                order.buyer_commission = 0;
                order.buyer_profit_and_loss = -(order.size * order.buyer_premium / 100);


            } else if (order.seller_result === "LOSS") {

                //winner -buyer
                order.buyer_commission = order.size * sObj.config.COMMISSION / 100;
                order.buyer_profit_and_loss = (order.size * order.buyer_price / 100) - order.buyer_commission;

                //losser - seller
                order.seller_commission = 0;
                order.seller_profit_and_loss = -(order.size * order.seller_premium / 100);
                
            } else {//BOTH ARE BREAK EVEN. This could happen if a 
                //trade which is not already activated is nullified (rejected by the server) 
                //for reason such as when the server expectedly  shuts down
                //and comed back up when the trade countdown is already over. In case the trade 
                //is rendered useless

                //seller
                order.seller_commission = 0;
                order.seller_profit_and_loss = 0;

                //buyer
                order.buyer_commission = 0;
                order.buyer_profit_and_loss = 0;

            }

        }

        return order;
    };

    this.checkSufficientFund = function (obj) {
        
        if (obj.product_type === "options") {
            //NOTE: according to onyeka, options does not need pip value consideration
            
            //obj.seller_losable_amt = obj.size * obj.price / 100;
            //obj.buyer_losable_amt = obj.size * obj.premium / 100;
            obj.seller_losable_amt = obj.size;//according to onyeka, the size is what he requires here instead!
            obj.buyer_losable_amt = obj.size;//according to onyeka, the size is what he requires here instead!
        } else if (obj.product_type === "spotfx") {
            
            //obj.seller_losable_amt = obj.size * obj.pip_value  * obj.stop_loss / 100;
            //obj.buyer_losable_amt = obj.size * obj.pip_value  * obj.take_profit / 100;
            obj.seller_losable_amt = obj.size * obj.pip_value ;//according to onyeka, the size is what he requires here instead!
            obj.buyer_losable_amt = obj.size * obj.pip_value ;//according to onyeka, the size is what he requires here instead!
            
            
        } else {
            throw new Error("Invalid  product type - mut be options or spotfx");
        }

        var losable_amt = 0;
        if (obj.exchanger_type === "SELLER") {
            losable_amt = obj.seller_losable_amt;
        } else if (obj.exchanger_type === "BUYER") {
            losable_amt = obj.buyer_losable_amt;
        } else {
            throw new Error("Invalid  exchanger type - mut be BUYER or SELLER");
        }

        if (!obj.exchange_id) {
            throw new Error("Must have exchange id!");
        }
        var callStoredProcSql = "CALL checkEquity('" + obj.exchanger_type
                + "','" + obj.exchange_id + "',"
                + losable_amt + ",'" + sObj.now() + "')";

        return sObj.db.raw(callStoredProcSql)
                .then(function (result) {
                    if (result[0] && result[0][0] && result[0][0][0]) {
                        var equity = result[0][0][0]['equity'];
                        obj.isValid = equity > 0;
                        return obj;
                    } else {
                        console.log('unexpected result return by knex!');
                    }
                });

    };

    return this;
};



