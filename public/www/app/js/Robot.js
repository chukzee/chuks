
/* global Ns */

Ns.Robot = {

    currentMatch: null,

    showGame: function () {
        if (!Ns.Robot.currentMatch) {
            var match;
            try {
                var str = window.localStorage.getItem(Ns.Const.ROBOT_MATCH_KEY);
                match = JSON.parse(str);
            } catch (e) {
            }
            if (!match) {
                //Robot is by default the black player. 
                //The user can switch positon in the game options view before the first move of the game.
                //but after the first move the user can no longer switch.
                match = Ns.Match.newRobotMatchObject(false);
            }
            Ns.Robot.currentMatch = match;
        }

        //show the match
        Ns.GameHome.showGameViewB(Ns.Robot.currentMatch);
    },
    cancelGame: function () {
        Ns.Robot.currentMatch = null;
        window.localStorage.setItem(Ns.Const.ROBOT_MATCH_KEY, '');
    },

    save: function (match) {
        if (match && match.robot === true) {
            Ns.Robot.currentMatch = match;
        }
        window.localStorage.setItem(Ns.Const.ROBOT_MATCH_KEY, JSON.stringify(Ns.Robot.currentMatch));
    }

};