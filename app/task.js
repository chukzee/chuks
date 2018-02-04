
var PlayRequest = require('./game/play-request');
var Tournament = require('./info/tournament');
var Match = require('./game/match');

class Task {

    async constructor(sObj, util, evt) {
        this.sObj = sObj;
        this.util = util;
        this.evt = evt;
        this.list = await loadTasks();

        for (var n in this.list) {
            if (list[n].repeat) {
                this.interval(list[n].cmd, list[n].delay, list[n].param);
            } else {
                this.later(list[n].cmd, list[n].delay, list[n].param);
            }
        }
    }

    interval(cmd, delay, param) {
        var obj = {
            cmd: cmd,
            task_id: this.sObj.UniqueNumber,
            delay: delay,
            nextTime: new Date().getTime() + delay,
            repeat: true,
            param: param
        };
        this.saveTask(obj);
        setInterval(this.interval.bind(this), delay, obj);
    }

    later(cmd, delay, param) {
        var obj = {
            cmd: cmd,
            task_id: this.sObj.UniqueNumber,
            delay: delay,
            nextTime: new Date().getTime() + delay,
            repeat: false,
            param: param
        };
        this.saveTask(obj);
        setTimeout(this.timeout.bind(this), delay, obj);
    }

    loadTasks() {
        this.list = [];
        //TODO - Load the task synchronizely
        

        //after loading the task remove expired tasks
        var now = new Date().getTime();

        for (var i = 0; i < this.list.length; i++) {
            if (!this.list[i].repeat && this.list[i].nextTime > now) {
                this.list.splice(i, 1);//remove expired tasks
            }
        }

        var str_task = JSON.stringify(this.list);

        //delete the old file - important
       /* 
        fs.closeSync(fd);//close the file
        fs.unlinkSync(file);//delete the file
        
        //create new file with the validated tasks.
        fd = fs.openSync(file, 'a+'); //create and open the file
        fs.writeSync(fd, str_task);//write
        
        */
       
       
        return this.list;
    }

    saveTask(obj) {

        this.list.push(obj);

        /* fs.appendFile(file, str, function (err) {
         if (err) {
         console.log(err);
         return;
         }
         //DO NOT initialize priceCollections[symbol][tf] here - DON'T EVER - causes unexpectedly strange result
         });*/

    }

    interval(obj) {
        switch (obj.cmd) {

            case '':
                return;
            default:

                break;
        }

        obj.nextTime += obj.delay;
    }

    timeout(obj) {

        switch (obj.cmd) {
            case 'EXPIRE_PLAY_REQUEST':
                var game_id = obj.param;
                new PlayRequest(this.sObj, this.util, this.evt)._expire(game_id);
                return;
            case 'START_TOURNAMENT_SEASON':
                new Tournament(this.sObj, this.util, this.evt)._startSeason(obj.param);
                return;
            case 'START_TOURNAMENT_MATCH':
                var game_id = obj.param;
                new Match(this.sObj, this.util, this.evt).start(game_id, 'match-fixture');
                return;
            case 'REMIND_TOURNAMENT_MATCH':
                var game_id = obj.param;
                new Tournament(this.sObj, this.util, this.evt)._notifyUpcomingMatch(game_id);
                return;

            default:

                break;
        }
    }

}


module.exports = Task;