"use strict";

var WebApplication = require('../web-application');

class PlayerRank extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    computeRank(match_count, match_wins) {
        return (100 * match_wins / match_count) + this.RANK_FACTOR * match_count;
    }

    updateRanking(players, winner_user_id) {
        var is_draw = winner_user_id ? false : true;

        var c = this.sObj.db.collection(this.sObj.col.player_rankings);

        for (var i = 0; i < players.length; i++) {
            if (!players[i].available) {
                continue;
            }
            var player_id = players[i].user_id;
            for (var k = 0; k < players.length; k++) {
                if (k === i) {
                    continue;//skip same player
                }
                var opponent = {
                    user_id: players[k].user_id,
                    rank_score: players[k].rank_score,
                    outcome: is_draw ? 'draw' : (winner_user_id === player_id ? 'win' : 'loss')
                };

                c.updateOne({user_id: players[i].user_id}, {$push: {opponents: opponent}});
            }
        }


    }

    async getWeeklyRankList() {

    }

    async getMonthlyRankList() {


    }

    async getYearlyRankList() {

    }
}

module.exports = PlayerRank;