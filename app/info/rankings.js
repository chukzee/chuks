"use strict";

var WebApplication = require('../web-application');
var User = require('../info/user');

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

    _avgRating(old_avg_player_rating, player_match_rating, old_match_count) {
        return ((old_avg_player_rating * old_match_count)
                + player_match_rating) / (old_match_count + 1);
    }

    async updateRanking(match, winner_id) {

        var is_draw = winner_id ? false : true;

        var c = this.sObj.db.collection(this.sObj.col.users); //yes the ranking will be on the users collection
        
        
        var max_rating_score = this._ratingScore(
                this.sObj.MT_SCORE_TOURNAMENT,
                this.sObj.MAX_RATING,
                this.sObj.MAX_RATING,
                this.sObj.WIN_POINT);
                
        var players_ids = [];        
        for (var i = 0; i < match.players.length; i++) {
            players_ids[i] = match.players[i].user_id;
        }        
        
        var user = new User(this.sObj, this.util, this.evt);
        //NOTE IN THE FUTURE rating_scores AND match_count FIELDS MAY BE USED
        //TO CHANGE THE COMPUTATION OF PLAYER RATING. IT IS FOR THIS REASON 
        //THEY ARE INCLUDED HERE
        var required_fields = ['user_id',  'rating_scores', 'rating', 'match_count'];
        var players_ratings = await user.getInfoList(players_ids, required_fields);        
        
        for (var i = 0; i < match.players.length; i++) {
            var match_type_score = 0;
            var competition_rating = 0;
            var opponent_rating = 0;
            var match_result = 0;
            var rated_opponent_count = 0;
            var ratings_sum = 0;
            var old_avg_player_rating = 0;
            var old_match_count = 0;
            var unrated_opponent_count = 0;

            for (var k = 0; k < players_ratings.length; k++) {
                //average opponent rating
                if (players_ratings[k].user_id === match.players[i].user_id) {
                    old_avg_player_rating = players_ratings[k].rating;
                    old_match_count = players_ratings[k].rating_scores.length;
                    continue;
                }
                //at this point it is the opponent
                rated_opponent_count++;
                ratings_sum += players_ratings[k].rating;
            }
            
            if(rated_opponent_count === match.players.length - 1){//all the opponents are rated
                opponent_rating = ratings_sum / rated_opponent_count;
            }else{//not all the opponents are rated so add default rating
                var oppn_count = match.players.length - 1; //opponent count
                unrated_opponent_count = oppn_count - rated_opponent_count;
                default_ratings_sum = unrated_opponent_count * this.sObj.DEFAULT_RATING;
                opponent_rating = default_ratings_sum / rated_opponent_count;
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

            var rating_score = this._ratingScore(//will be zero for loss since match_result is zero
                    match_type_score,
                    competition_rating,
                    opponent_rating,
                    match_result);

            var percent_score = rating_score / max_rating_score; //will be zero for loss 

            var player_match_rating;
            var player_average_rating;
            if (match.players[i].user_id === winner_id || is_draw) {//win or draw
                player_match_rating = old_avg_player_rating + percent_score;
                player_average_rating = this._avgRating(old_avg_player_rating,
                        player_match_rating,
                        old_match_count);
                //make sure it is not greater than the maximum rating     
                if (player_average_rating > this.sObj.MAX_RATING) {
                    player_average_rating = this.sObj.MAX_RATING;
                }
            } else {//loss
                player_match_rating = old_avg_player_rating - percent_score; // percent_score is zero anyway so the minus may not be neccessary but here just for readability (clarity) sake 
                player_average_rating = this._avgRating(old_avg_player_rating,
                        player_match_rating,
                        old_match_count);
                //make sure it is not less than the minimum rating 
                if (player_average_rating < this.sObj.MIN_RATING) {
                    player_average_rating = this.sObj.MIN_RATING;
                }
            }

            //update the the collection
            
            //NOTE IN THE FUTURE rating_scores AND match_count FIELDS MAY BE USED
            //TO CHANGE THE COMPUTATION OF PLAYER RATING. IT IS FOR THIS REASON 
            //THEY ARE INCLUDED HERE
            
            var pushObj = {rating_scores: rating_score};
            var intObj = {match_count: 1};//increment by 1
            var setObj = {rating: player_average_rating};

            c.updateOne({user_id: match.players[i].user_id}, {$set: setObj, $push: pushObj, $inc: intObj})
                    .then(function (result) {
                        //DO NOTHING
                    })
                    .catch(function (err) {
                        console.log(err); //DO NOT DO THIS IN PRODUCTION. INSTEAD LOG TO ANOTHER PROCCESS
                    });
        }


    }

}

module.exports = Rankings;