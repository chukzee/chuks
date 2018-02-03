
var Tournament = require('../app/info/tournament');
var util = require('../util/util');
var evt = require('../app/evt');
var crypto = require('crypto');
var initial_unique;
var unique_count = 0;
class ServerObject {

    constructor(db, redis, evt) {

        initial_unique = crypto.randomBytes(48)//secure random number
                .toString('base64')//to base64
                .replace(/\+/g, '-')//this line and the two below makes the return value url and filename enconding safe
                .replace(/\//g, '_')
                .replace(/\=/g, '');

        var delimiter = ':';//important - must be a non-base6- valid character see base64 table in wikipedia

        this._proess_namespace = crypto.randomBytes(24)
                .toString('base64')//to base64
                .replace(/\+/g, '-')//this line and the two below makes the return value url and filename enconding safe
                .replace(/\//g, '_')
                .replace(/\=/g, '')
                + delimiter;//important!
    }

    get UniqueNumber() {
        return ++unique_count + "_ID_" + initial_unique; //jsut append the increment to make the call universally unique
    }

}

function promoteToNextRound(c, tourn, match) {

    //first determine the winner of the sets
    var is_player_1_winner;
    if (match.scores[0] > match.scores[1]) {// player_1 wins
        is_player_1_winner = 1; //means true
    } else if (match.scores[0] < match.scores[1]) {// player_1 losses
        is_player_1_winner = 0;//means false
    } else {//draw

        //In the future we may implement a more appropriate way of separating
        //the players such as comparing the value of their board (as in chess), the 
        //number of points accumulated since the start of the tournament and so on.
        //But for now we go for just random picking a lucky winner.

        is_player_1_winner = Math.floor(Math.random() * 2); // randomly get 0 and 1
    }
    
    var season_index = tourn.seasons.length - 1;
    var current_season = tourn.seasons[season_index];

    if (!current_season) {
        console.log(`Season ${tourn.seasons.length} not found in ${tourn.name} tournamet - this should not happen at this point.`);
        return;
    }

    var rounds = current_season.rounds;
    var to = rounds.length - 1; //skip the last round
    for (var i = 0; i < to; i++) {
        var fixtures = rounds[i].fixtures;
        for (var j = 0; j < fixtures.length; j++) {
            if (fixtures[j].game_id === match.game_id) {
                var n = j % 2 === 0 ? j : (j - 1);
                var n_nxt = n / 2; //required index of fixtures in next round to be promoted to
                var next_round = rounds[i + 1];
                var next_fixture = next_round.fixtures[n_nxt];
                if (is_player_1_winner) {
                    if (!next_fixture.player_1.id) {
                        next_fixture.player_1.id = fixtures[j].player_1.id;
                        next_fixture.player_1.slot = fixtures[j].player_1.slot;
                    } else {
                        next_fixture.player_2.id = fixtures[j].player_1.id;
                        next_fixture.player_2.slot = fixtures[j].player_1.slot;
                    }
                } else {
                    if (!next_fixture.player_1.id) {
                        next_fixture.player_1.id = fixtures[j].player_2.id;
                        next_fixture.player_1.slot = fixtures[j].player_2.slot;
                    } else {
                        next_fixture.player_2.id = fixtures[j].player_2.id;
                        next_fixture.player_2.slot = fixtures[j].player_2.slot;
                    }
                }


                //update the tournament

                /*var editObj = {};
                 editObj['seasons.' + season_index] = current_season; // using the dot operator to access the index of the array
                 
                 await c.updateOne({name: tourn.name}, {$set: editObj});
                 */

                break;
            }
        }
    }

}

var t = new Tournament(new ServerObject(), util, evt);

/*
 var rounds = t._roundRobinRounds(7, 3);
 for (var i = 0; i < rounds.length; i++) {
 
 console.dir('------------------');
 for (var k = 0; k < rounds[i].fixtures.length; k++) {
 console.dir(rounds[i].fixtures[k]);
 }
 }*/

var rounds = t._singleEleminationRounds(16, 3);
var id = -1;
var p = 0;
for (var i = 0; i < rounds.length; i++) {
    for (var k = 0; k < rounds[i].fixtures.length; k++) {
        rounds[i].fixtures[k].game_id = ++id;
        if (i === 0) {
            p++;
            rounds[i].fixtures[k].player_1.id = 'user_id_' + p;
            p++;
            rounds[i].fixtures[k].player_2.id = 'user_id_' + p;
        }
    }
}
var tourn = {
    seasons: [
        {
            sn: 1, //season number
            rounds: rounds
        }]
};
var match = {
    tournament_name: 'Sapele champs',
    game_id: 0,
    scores: [1, 1],
    start_time: new Date(),
    current_set: 1, //first set - important!
    sets: [{points: [0, 0]}, {points: [0, 0]}, {points: [0, 1]}],
    players: [{user_id: 'player_1'}, {user_id: 'player_2'}]
};
var c;
promoteToNextRound(c, tourn, match);


match.game_id = 1;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 2;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 3;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 4;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 5;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 6;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 7;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

//-------quater final round promotion------

match.game_id = 8;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 9;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 10;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 11;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

//-------semi final round promotion------

match.game_id = 12;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

match.game_id = 13;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

//-------final round promotion------

match.game_id = 14;
match.scores = [1, 1];
promoteToNextRound(c, tourn, match);

for (var i = 0; i < rounds.length; i++) {

    console.dir('------------------');
    //console.dir(rounds[i]);
    for (var k = 0; k < rounds[i].fixtures.length; k++) {
        console.dir(rounds[i].fixtures[k]);
    }
}
