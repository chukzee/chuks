
/* global Ns */

Ns.Robot = {

    matchOfGame: {},

    showGame: function () {
        var game = Ns.ui.UI.selectedGame;
        if (!Ns.Robot.matchOfGame[game]) {
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
            Ns.Robot.matchOfGame[game] = match;
        }

        //show the match
        Ns.GameHome.showGameViewB(Ns.Robot.matchOfGame[game]);
    },
    cancelGame: function () {
        var game = Ns.ui.UI.selectedGame;
        delete Ns.Robot.matchOfGame[game];
        window.localStorage.setItem(Ns.Const.ROBOT_MATCH_KEY, '');
    },

    save: function (match) {
        var game = Ns.ui.UI.selectedGame;
        if (match && match.robot === true) {
            Ns.Robot.matchOfGame[game] = match;
        }
        window.localStorage.setItem(Ns.Const.ROBOT_MATCH_KEY, JSON.stringify(Ns.Robot.matchOfGame[game]));
    }

};