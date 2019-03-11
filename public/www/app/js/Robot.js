
/* global Ns, localforage, Main */

Ns.Robot = {

    matchOfGame: {},

    showGame: function () {
        var game = Ns.ui.UI.selectedGame;
        if (!Ns.Robot.matchOfGame[game]) {
            localforage.getItem(Ns.Const.ROBOT_MATCH_KEY, function (err, match) {
                if (err) {
                    console.log(err);
                }

                if (!match) {
                    //Robot is by default the black player. 
                    //The user can switch positon in the game options view before the first move of the game.
                    //but after the first move the user can no longer switch.
                    match = Ns.Match.newRobotMatchObject(false);
                }
                Ns.Robot.matchOfGame[game] = match;
                showMatch();
            });

        }else{
            showMatch();
        }

        function showMatch() {
            //show the match
            Ns.GameHome.showGameViewB(Ns.Robot.matchOfGame[game]);
        }
    },
    cancelGame: function () {
        var game = Ns.ui.UI.selectedGame;
        delete Ns.Robot.matchOfGame[game];
        localforage.setItem(Ns.Const.ROBOT_MATCH_KEY, '', function (err) {
            if (err) {
                console.log(err);
            }
        });
    },

    save: function (match) {
        var game = Ns.ui.UI.selectedGame;
        if (match && match.robot === true) {
            Ns.Robot.matchOfGame[game] = match;
        }
        localforage.setItem(Ns.Const.ROBOT_MATCH_KEY, Ns.Robot.matchOfGame[game], function (err) {
            if (err) {
                console.log(err);
            }
        });
    },
    
    createID: function(){
        return 'robot_id_' + Main.util.serilaNo + '_' + new Date().getTime();
    }

};