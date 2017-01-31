
var mailer = require('nodemailer');

var sObj = null;

var poolSmtpConfig = {//REMIND :A BEG O!!! - SMTP CONFIG!!!
    pool: true, //a must for us ABEG O!!!
    host: 'smtp.gmail.com', //REMIND: preferably use mailgun - do not use gmail. It has issues. I found reason somewhere - research it later!
    port: 465,
    secure: true, // use SSL 
    auth: {
        user: 'user@gmail.com',
        pass: 'pass'
    }
};

var RegisterationHtml = function (username, password) {
    return html = "<p>Dear Customer,</p>"

            + "<p>Thanks for registering a demo account. Your demo login details are as follows:</p>"

            + "Username: " + username + "</br>"
            + "Password: " + password + "</br>"

            + "<p>Open a <a href=" + sObj.config.LIVE_ACCOUNT_LINK + ">LIVE</a> account now!</p>"

            + "<p>If you have questions or need assistance, please do not hesitate to contact us.</p>"

            + "<p>Best Regards,</p>"

            + "<p>The Flatbook Team</p>";
};

var SpotFxDemoOrderDetailsHtml = function (order) {

    var eh = new EmaiHtml();

    eh.header("<p>Dear Customer,</p>"
            + "<p>Your Spot FX demo order details executed on "
            + order.time
            + " are as follows:</p>");

    eh.add("Countdown: ", "00:00:00");
    eh.add("Time: ", order.time);
    eh.add("Order: ", order.order_ticket);
    eh.add("Type: ", order.type);
    eh.add("Direction: ", order.direction);
    eh.add("Symbol: ", order.symbol);
    eh.add("Open: ", order.open);
    eh.add("S/L: ", order.stop_loss);
    eh.add("T/P: ", order.take_profit);
    eh.add("Close: ", order.close);


    eh.footer("<p>Your account balance has been updated accordingly.</p>"
            + "<p>Open a <a href=" + sObj.config.LIVE_ACCOUNT_LINK + ">LIVE</a> account now!</p>"
            + "<p>If you have questions or need assistance, please do not hesitate to contact us.</p>"
            + "<p>Best Regards,</p>"
            + "<p>The Flatbook Team</p>"
            );

    return eh.html();
};

var SpotFxDemoOrderSettledHtml = function (order) {

    var eh = new EmaiHtml();


    eh.header("<p>Dear Customer,</p>"
            + "<p>Your Spot FX demo order has settled on "
            + order.time
            + " and the details are as follows:</p>");

    eh.add("Countdown: ", "00:00:00");
    eh.add("Time: ", order.time);
    eh.add("Order: ", order.order_ticket);
    eh.add("Type: ", order.type);
    eh.add("Direction: ", order.direction);
    eh.add("Symbol: ", order.symbol);
    eh.add("Open: ", order.open);
    eh.add("S/L: ", order.stop_loss);
    eh.add("T/P: ", order.take_profit);
    eh.add("Close: ", order.close);
    eh.add("Result: ", order.result);
    eh.add("Commission: ", order.commission);
    eh.add("Profit/Loss: ", order.profit_and_loss);



    eh.footer("<p>Your account balance has been updated accordingly.</p>"
            + "<p>Open a <a href=" + sObj.config.LIVE_ACCOUNT_LINK + ">LIVE</a> account now!</p>"
            + "<p>If you have questions or need assistance, please do not hesitate to contact us.</p>"
            + "<p>Best Regards,</p>"
            + "<p>The Flatbook Team</p>"
            );

    return eh.html();
};

var OptionsDemoOrderDetailsdHtml = function (order) {

    var eh = new EmaiHtml();


    eh.header("<p>Dear Customer,</p>"
            + "<p>Your Options demo order details executed on "
            + order.time
            + " are as follows:</p>");

    eh.add("Countdown: ", "00:00:00");
    eh.add("Time: ", order.time);
    eh.add("Order: ", order.order_ticket);
    eh.add("Type: ", order.type);
    eh.add("Product: ", order.product);
    eh.add("Symbol: ", order.symbol);
    eh.add("Open: ", order.open);
    eh.add("Strike: ", order.strike);
    eh.add("Barrier: ", order.barrier);
    eh.add("Price (%): ", order.price);
    eh.add("Premium(%): ", order.premium);
    eh.add("Expiry: ", order.expiry);
    eh.add("Close: ", order.close);


    eh.footer("<p>Your account balance has been updated accordingly.</p>"
            + "<p>Open a <a href=" + sObj.config.LIVE_ACCOUNT_LINK + ">LIVE</a> account now!</p>"
            + "<p>If you have questions or need assistance, please do not hesitate to contact us.</p>"
            + "<p>Best Regards,</p>"
            + "<p>The Flatbook Team</p>"
            );

    return eh.html();
};

var OptionsDemoOrderSettledHtml = function (order) {

    var eh = new EmaiHtml();

    eh.header("<p>Dear Customer,</p>"
            + "<p>Your Options demo order has settled on "
            + order.time
            + " and the details are as follows:</p>");

    eh.add("Countdown: ", "00:00:00");
    eh.add("Time: ", order.time);
    eh.add("Order: ", order.order_ticket);
    eh.add("Type: ", order.type);
    eh.add("Product: ", order.product);
    eh.add("Symbol: ", order.symbol);
    eh.add("Open: ", order.open);
    eh.add("Strike: ", order.strike);
    eh.add("Barrier: ", order.barrier);
    eh.add("Price (%): ", order.price);
    eh.add("Premium(%): ", order.premium);
    eh.add("Expiry: ", order.expiry);
    eh.add("Close: ", order.close);
    eh.add("Result: ", order.result);
    eh.add("Commission: ", order.commission);
    eh.add("Payout/Loss: ", order.profit_and_loss);


    eh.footer("<p>Your account balance has been updated accordingly.</p>"
            + "<p>Open a <a href=" + sObj.config.LIVE_ACCOUNT_LINK + ">LIVE</a> account now!</p>"
            + "<p>If you have questions or need assistance, please do not hesitate to contact us.</p>"
            + "<p>Best Regards,</p>"
            + "<p>The Flatbook Team</p>"
            );

    return eh.html();
};

var EmaiHtml = function () {
    this.table = {};
    this.head = null;
    this.foot = null;
    /**
     * Add trade data
     * @param {type} name
     * @param {type} value
     * @returns {undefined}
     */
    this.add = function (name, value) {
        this.table[name] = value;
    };
    /**
     * 
     * @param {type} html
     * @returns {undefined}
     */
    this.header = function (html) {
        this.head = html;
    };
    this.footer = function (html) {
        this.foot = html;
    };
    this.html = function () {
        var body = "<table>";
        for (var b in this.table) {
            body += "<tr><th>" + b + "</th><td>" + this.table[b] + "</td></tr>";
        }
        body + "</table>";
        var full = this.head ? this.head + body : body;
        full = this.foot ? full + this.foot : full;
        return full;
    };
};


module.exports =  function (_sObj) {
   sObj = _sObj;
   this.emailOpenTrade = function(user, order){
       
   };
   this.emailCloseTrade = function(user, order){
       
   };
   this.emailRegisteredUser = function(user){
       
   };
   this.emailRecoverPassword = function(user){
       
       console.log('emailRecoverPassword NOT YET IMPLEMENTED');
   };
   
   return this;
};