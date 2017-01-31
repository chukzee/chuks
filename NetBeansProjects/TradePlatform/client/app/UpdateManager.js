/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TradeApp.UpdateManager', {
    singleton: true,
    queue: [],
    strategizer: {
        /**
         * This defines the update strategies of the trade platform.
         * The main purpose is to prevent sluggish or hanging platform.
         */
        StrategyList: [
            //[0, 0, 0, 0, 0],//DO NOT USE THIS. IT CAN CAUSE HANGING
            //[1, 0, 0, 0, 0],//DO NOT USE THIS. IT CAN CAUSE HANGING ALSO
            [1, 0, 1, 0, 0],//EVENLY DISTRIBUTE THE TWO 1s BETTER PERFORMANCE.
            [1, 0, 1, 0, 1],//EVENLY DISTRIBUTE THE THREE 1s BETTER PERFORMANCE.
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [2, 1, 1, 1, 1],
            [2, 2, 1, 1, 1],
            [2, 2, 2, 1, 1],
            [2, 2, 2, 2, 1],
            [2, 2, 2, 2, 2],
            [3, 2, 2, 2, 2],
            [3, 3, 2, 2, 2],
            [3, 3, 3, 2, 2],
            [3, 3, 3, 3, 2],
            [3, 3, 3, 3, 3],
            [4, 3, 3, 3, 3],
            [4, 4, 4, 3, 3],
            [4, 4, 4, 4, 3],
            [4, 4, 4, 4, 4],
            [5, 4, 4, 4, 4],
            [5, 5, 4, 4, 4],
            [5, 5, 5, 4, 4],
            [5, 5, 5, 5, 4],
            [5, 5, 5, 5, 5]
        ],
        strategy: [],
        strategyIndex: 0,
        avgTime: 0,
        cursor: -1,
        pickStragey: function (timeTaken) {
            if (timeTaken < this.avgTime) {

                this.strategyIndex--;
                if (this.strategyIndex < 0) {
                    this.strategyIndex = 0;
                }
                this.strategy = this.StrategyList[this.strategyIndex];
                return;
            }
            this.strategyIndex++;
            if (this.strategyIndex > this.StrategyList.length - 1) {
                this.strategyIndex--;
            }

            this.strategy = this.StrategyList[this.strategyIndex];
            var sum = 0;
            for (var i = 0; i < this.strategy.length; i++) {
                sum += this.strategy[i];
            }
            this.avgTime = (sum / this.strategy.length) * 1000;

            console.log('this.strategyIndex ' + this.strategyIndex); // uncomment for observation
        },
        next: function (timeTaken) {
            this.pickStragey(timeTaken);
            this.cursor++;
            if (this.cursor > this.strategy.length - 1) {
                this.cursor = 0;
            }

            return this.strategy[this.cursor] * 1000;
        }
    },
    update: function (callback, param, queueID, compare) {

        if (!this.nextUpdateTime) {
            this.nextUpdateTime = new Date().getTime();
        }

        this.queue[queueID] = {
            callback: callback,
            param: param,
            compare: compare
        };
        var beforeUpdateTime = new Date().getTime();
        if (beforeUpdateTime < this.nextUpdateTime) {
            //console.log("updated " + queueID + " " + compare);// uncomment for observation
            return;
        }

        for (var i in this.queue) {
            var q = this.queue[i];
            if (typeof q.callback === "function") {
                if (q.compare && q.compare !== q.old_compare) {
                    q.callback(q.param);
                    q.old_compare = q.compare;
                } else {
                    //do nothing - just print for deduging and observation purposes
                    //console.log("skip " + i + " " + q.compare);// uncomment for observation
                }
            }
        }

        var afterUpdateTime = new Date().getTime();
        var timeTaken = afterUpdateTime - beforeUpdateTime;

        this.nextUpdateTime = afterUpdateTime + this.strategizer.next(timeTaken);
    }

});


