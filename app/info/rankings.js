"use strict";

var WebApplication = require('../web-application');

class Rankings extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * 
     * @param {type} match_type contact, group or tournament match
     * @param {type} competition_rating for group and cotact match it is equal to 1 and greater than 1 for tournament match
     * @param {type} opponent_rating the opponent rating 
     * @param {type} match_result the points earn from the match
     * @returns {Number|Rankings._ratingScore.rating_score}
     */
    _ratingScore(match_type, competition_rating, opponent_rating, match_result) {

        var match_importance = match_type * competition_rating ? competition_rating : 1;
        var rating_score = opponent_rating * match_importance * match_result;
        return rating_score;
    }

    async updateRanking(match, winner_id) {


        var c = this.sObj.db.collection(this.sObj.col.player_rankings);
        var max_rating_score = this._ratingScore(
                this.sObj.MT_SCORE_TOURNAMENT,
                this.sObj.MAX_RATING,
                this.sObj.MAX_RATING,
                this.sObj.WIN_POINT);

        var players_ratings = []; // TODO - get the previous players ratings

        for (var i = 0; i < match.players.length; i++) {
            //var rating = await this._computeRanking(players[i].user_id, winner_id, win_factor);
            var match_type_score;
            var competition_rating;
            var opponent_rating;
            var match_result;
            var count;
            var sum_ratings = 0;
            for (var k = 0; k < players_ratings.length; k++) {
                //average opponent rating
                if (players_ratings[k].user_id === match.players[i].user_id) {
                    continue;//skip same player
                }
                count++;
                sum_ratings += players_ratings[k].rating;
                opponent_rating = sum_ratings / count;
            }

            if (match.tournament_name) {
                match_type_score = this.sObj.MT_SCORE_TOURNAMENT;
                competition_rating = match.competition_rating ?
                        match.competition_rating : this.sObj.DEFAULT_RATING;
            } else if (match.group_name) {
                match_type_score = this.sObj.MT_SCORE_GROUP;
            } else {//contact match
                match_type_score = this.sObj.MT_SCORE_CONTACT;
            }

            if (match.players[i].user_id === winner_id) {
                if (!match.win_factor) {
                    match.win_factor = 1; //default 
                }
                match_result = match.win_factor * this.sObj.WIN_POINT;
            }

            var rating_score = this._ratingScore(
                    match_type_score,
                    competition_rating,
                    opponent_rating,
                    match_result);

            var percent_score = rating_score / max_rating_score;

            //TODO

        }


    }

}

module.exports = Rankings;