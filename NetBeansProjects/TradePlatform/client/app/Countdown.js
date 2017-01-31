/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.Countdown', {
    singleton: true,
    get: function (order_ticket) {
        if (this.cdowns && order_ticket && this.cdowns[order_ticket]) {
            return this.cdowns[order_ticket];
        }
        return "00:00:00";
    },
    start: function (fn, order_ticket, seconds) {

        if (!this.cdowns) {
            this.cdowns = [];
        }

        var t = {
            fn: fn,
            order_ticket: order_ticket,
            seconds: seconds,
            secs_remaining: seconds,
            startTime: new Date().getTime()
        };
        
        
        
        if (!this.tasks) {
            this.tasks = [];
            this.countDownTimerId = null;
        }
        this.tasks.push(t);
        var me = this;
        var run = function () {
            if (me.tasks.length === 0) {
                window.clearInterval(me.countDownTimerId);//yes commented out
                me.countDownTimerId = null;
                return;
            }
            for (var i = 0; i < me.tasks.length; i++) {

                var task = me.tasks[i];
                try {

                    var rem = task.secs_remaining;
                    var h = rem / 3600;
                    var h = Math.floor(h);
                    var rs = rem - (h * 3600);
                    var m = rs / 60;
                    var m = Math.floor(m);
                    var s = rs - (m * 60);
                    var hh = h < 10 ? "0" + h : h;
                    var mm = m < 10 ? "0" + m : m;
                    var ss = s < 10 ? "0" + s : s;
                    var cd_format = hh + ":" + mm + ":" + ss;
                    task.fn(cd_format, rem);

                    me.cdowns[task.order_ticket] = cd_format;

                } catch (e) {
                    console.log(e);
                }
                //task.secs_remaining--;
                task.secs_remaining = Math.floor(task.seconds - (new Date().getTime() - task.startTime) / 1000);

                if (task.secs_remaining < 0) {
                    me.cdowns[task.order_ticket] = "00:00:00";//force to show 00:00:00
                    me.tasks.splice(i, 1); //remove task
                }

            }
        };

        if (!this.countDownTimerId) {
            this.countDownTimerId = window.setInterval(run, 1000);
        }

    }

});


