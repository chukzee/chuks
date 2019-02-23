
"use strict";

var User = require('../info/user');
var WebApplication = require('../web-application');

class Tournament extends WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }
    /**
     * Get a list of up coming matces
     * 
     * @param {type} user_id
     * @param {type} game_name
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async getUpcomingMatches(user_id, game_name, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            game_name = arguments[0].game_name;
            skip = arguments[0].skip;
            limit = arguments[0].limit;
        }

        if (skip !== undefined && limit !== undefined) {
            skip = skip - 0;
            limit = limit - 0;
        } else {
            skip = 0;
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.upcoming_matches);


        var query = {
            $and: [
                {
                    game_name: game_name,
                    'players.user_id': user_id
                }
            ]
        };

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            upcoming_matches: []
        };

        if (!total) {
            return data;
        }


        data.upcoming_matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;
    }

    _isTournamentOfficial(tourn, user_id) {
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === user_id) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 
     * @param {type} user_id
     * @param {type} tournament_name
     * @param {type} players_count
     * @param {type} start_time
     * @returns {Tournament@call;error|nm$_tournament.Tournament.seasonNew@call;_singleEleminationRounds|nm$_tournament.Tournament.seasonNew@call;_roundRobinRounds|Tournament.seasonNew.rounds|String}
     */
    async seasonNew(user_id, tournament_name, players_count, start_time) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            players_count = arguments[0].players_count;
            start_time = arguments[0].start_time;
        }

        players_count = players_count - 0;

        if (!user_id) {
            return this.error('No username');
        }

        if (!tournament_name) {
            return this.error('No tournament name');
        }

        players_count = players_count - 0;
        if (isNaN(players_count) || players_count < 1) {
            return this.error('Invalid number of players - must be a number greater than 0');
        }

        if (players_count > this.sObj.MAX_TOURNAMENT_PLAYERS) {
            return this.error(`Number of players cannot exceed max. of ${this.sObj.MAX_TOURNAMENT_PLAYERS}`);
        }

        if (players_count < this.sObj.MIN_TOURNAMENT_PLAYERS) {
            return this.error(`Number of players must be at least ${this.sObj.MIN_TOURNAMENT_PLAYERS}`);
        }

        var begin_time = new Date(start_time);
        if (isNaN(begin_time.getTime())) {
            return this.error(`Invalid season start time - ${start_time}`);
        }
        var now = new Date().getTime();
        if (begin_time.getTime() < now) {
            return this.error(`Season start time can not be in the past .`);
        }

        var _15_mins = 15 * 60 * 1000;

        if (true) {//TESTING! REMOVE LATER ABEG O!!!
            console.log('TESTING! REMOVE LATER ABEG O!!!');
            _15_mins = 20 * 1000; //TESTING! REMOVE LATER ABEG O!!!
        }

        if (begin_time.getTime() <= now + _15_mins) {
            return this.error(`Season start time too close to current time.`);
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }


        var last_season = tourn.seasons[tourn.seasons.length - 1];
        if (last_season) {

            //check if the last season has ended - a new season can be created only if
            //the last season has ended

            if (last_season.status !== 'end' && last_season.status !== 'cancel') {
                return this.error("Can not create new season when the last season has not yet ended!");
            }

            var last_end_time = new Date(last_season.end_time).getTime();

            if (isNaN(last_end_time)) {
                console.log(`WARNING!!! This should not be - ${tournament_name} tournament 
                                last season (seanson ${last_season.sn}) end time is invalid.`);

                return this.error(`Invalid last season end time - ${last_end_time}`);
            }

            if (!this._validateSeasonStartTime(last_season.end_time, start_time)) {
                return;
            }

        }

        var season_number = tourn.seasons.length + 1;

        var new_season = {
            sn: season_number, //next season number
            start_time: start_time,
            end_time: '', //will be set automatically when the final game of the season is concluded or when the seanson is cancelled
            winner: '', //will be set automatically when the final game of the season is concluded.
            status: 'before-start', //before-start, start, end, cancel
            rounds: [],
            slots: []
        };

        //Create the dummy rounds of the season. By dummy we mean all the
        //rounds fixtures will be created with empty player id which can also be
        //modified eventually by official.
        var rounds;
        if (tourn.type === this.sObj.ROUND_ROBIN) {
            rounds = this._roundRobinRounds(players_count, tourn.sets_count);
        } else if (tourn.type === this.sObj.SINGLE_ELIMINATION) {
            rounds = this._singleEleminationRounds(players_count, tourn.sets_count);
        } else {
            return this.error(`Unknown type of tournament - ${tourn.type}`);
        }

        if (!Array.isArray(rounds)) {
            return;
        }

        new_season.rounds = rounds;

        //Create the empty slots of the season
        for (var i = 0; i < players_count; i++) {
            new_season.slots[i] = {
                sn: i + 1,
                player_id: '',
                total_points: 0,
                total_wins: 0,
                total_losses: 0,
                total_draws: 0,
                total_played: 0
            };
        }


        //update the tournament

        await c.updateOne({name: tournament_name}, {$push: {seasons: new_season}});

        var delay = new Date(start_time).getTime() - new Date().getTime();

        this.sObj.task.later(delay, 'info/Tournament/_startSeason', {
            tournament_name: tournament_name,
            season_number: season_number
        });

        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);

        }

        return {
            tournament: tourn,
            msg: 'New season created successfully'
        };
    }

    _validateSeasonStartTime(last_season_end_time, new_season_start_time) {
        //check if the start time is valid - must be after the last season's end time
        var _24_hour = 24 * 60 * 60 * 1000;
        if (new Date(new_season_start_time).getTime() < new Date(last_season_end_time).getTime() + _24_hour) {
            return this.error(`Invalid season start time - must be at least 24 hours after the last seanson ended`);
        }
        return true;
    }

    /**
     * Create the default structure object of the tournament season fixture
     * 
     * @param {type} slot_1 used to represent a dummy player when no player is set - like a container met to hold a particular thing
     * @param {type} slot_2 used to represent a dummy player when no player is set - like a container met to hold a particular thing
     * @param {type} sets_count represent the number of games to make a complete match
     * @returns {nm$_tournament.Tournament._fixturesStruct.fixture}
     */
    _fixturesStruct(slot_1, slot_2, sets_count) {

        var fixture = {
            start_time: '', //will be set dynamically
            end_time: '', //will be set dynamically
            game_id: this.sObj.UniqueNumber, //assign unique number to the game id
            player_1: {
                slot: slot_1, // used to represent a dummy player when no player is set.
                id: '', //initially empty - will be updated dynamically
                score: 0 //game score - a won set increases the value by 1 and a draw leave
                        // as same - NOTE this is not piont score which is 3-1-0 scoring system.
            },
            player_2: {
                slot: slot_2, // used to represent a dummy player when no player is set.
                id: '', //initially empty - will be updated dynamically
                score: 0 //game score - a won set increases the value by 1 and a draw leave
                        // as same - NOTE this is not piont score which is 3-1-0 scoring system.
            },
            sets: []
        };

        // 'sets_count'  represent the number of games to make a complete match  
        for (var i = 0; i < sets_count; i++) {

            fixture.sets[i] = {
                points: [0, 0] //initialize the two point scores of the 
                        //players to zero - NOTE: we are user 3-1-0 scoring system
                        //as in football, also used in chess.
            };
        }

        return fixture;

    }

    /**
     * Constructs the round robin round matches. 
     * This uses the tournament round robin scheduling algorithm
     * to create the fixture for all possible rounds given a specified
     * number of players. The algorithm is expected to work for both even and
     * odd number of players. 
     * 
     * @param {type} players_count
     * @param {type} sets_count sets_count represent the number of games to make a complete match
     * @returns {Array|Tournament._roundRobinRounds.rounds|nm$_tournament.Tournament._roundRobinRounds.rounds}
     */
    _roundRobinRounds(players_count, sets_count) {

        //--- WORKS FOR EVEN AND ODD NUMBER OF PLAYERS-------

        var rounds = [];
        var is_even = players_count % 2 === 0;
        var half = players_count / 2;
        if (!is_even) {
            half = (players_count + 1) / 2;
        }

        var slot_1s = [];
        var slot_2s = [];
        for (var i = 1; i < half + 1; i++) {
            slot_1s[i - 1] = i;
            slot_2s[i - 1] = i + half;
        }

        var EMPTY = '-';

        if (!is_even) {// if old number of players then add a dummy player
            slot_2s[slot_2s.length - 1] = EMPTY;//DUMMY - ANY PLAYER PAIRED
            // WITH THIS DUMMY WILL BE IDLE  ON
            // THAT ROUND - ie will get a bye see https://en.wikipedia.org/wiki/Bye_%28sports%29
        }

        var total_rounds = slot_1s.length + slot_1s.length - 1;

        for (var i = 0; i < total_rounds; i++) {
            var ls1 = slot_1s[slot_1s.length - 1];
            var ls2 = slot_2s[0];
            for (var k = 0; k < half; k++) {
                if (k < half - 1) {
                    slot_1s[half - k - 1] = slot_1s[half - k - 2];
                    slot_2s[k] = slot_2s[k + 1];
                } else {
                    slot_1s[1] = ls2; //yes index 1.  Set the 2nd index which is index 1 to the initial first index of the other half array
                    slot_2s[k] = ls1;
                }
            }

            //after one complete rotation - ie a new round of matches created.

            var match_count = half; // number of matches on this round
            rounds[i] = {
                sn: i + 1, //round number
                stage: 'Round ' + (i + 1),
                fixtures: []
            };
            var f_index = -1;//important
            for (var n = 0; n < match_count; n++) {

                if (slot_1s[n] === EMPTY || slot_2s[n] === EMPTY) {//in the case of odd number of players
                    continue;//skip - the player will be idle in this 
                    //round - gets a bye. see https://en.wikipedia.org/wiki/Bye_%28sports%29
                }
                f_index++;
                rounds[i].fixtures[f_index] = this._fixturesStruct(slot_1s[n], slot_2s[n], sets_count);

            }


        }

        return rounds;

    }

    /**
     * Constructs the single elimination round matches.
     * Only the first round is assign slot numbers initially, since it is impossible
     * to know the slot numbers of the matches on the next round before the previous round
     * matches are completed. 
     * So the system will automatically assign slot numbers to the next round upon completion
     * of current round.
     * 
     * @param {type} players_count  allowed number of players are 4, 8, 16, 32, 64
     * @param {type} sets_count sets_count represent the number of games to make a complete match
     * @returns {String}
     */
    _singleEleminationRounds(players_count, sets_count) {

        if (players_count !== 4
                && players_count !== 8
                && players_count !== 16
                && players_count !== 32
                && players_count !== 64) {

            return this.error('Invalid number of players of singel elimination tournament - expected 4, 8, 16, 32, 64');
        }

        var rounds = [];
        var size = players_count / 2;

        var slot_1 = 1;
        var slot_2 = 2;
        var is_first_round = true;
        var i = 0;
        var stage = '';
        while (size >= 1) {

            var match_count = size; // number of matches on this round

            if (size === 1) {
                stage = this.sObj.FINAL;
            } else if (size === 2 && players_count > 4) {
                //By our policy if the number of players are 4, the first round of 
                //matches will not be called Semi final but Round 1 which makes better sense

                stage = this.sObj.SEMI_FINAL;
            } else if (size === 4 && players_count > 8) {
                //By our policy if the number of players are 8, the first round of 
                //matches will not be called Quater final but Round 1 which makes better sense

                stage = this.sObj.QUATER_FINAL;
            } else {
                stage = 'Round ' + (i + 1);
            }

            rounds[i] = {
                sn: i + 1, //round number
                stage: stage,
                fixtures: []
            };
            for (var n = 0; n < match_count; n++) {

                rounds[i].fixtures[n] = this._fixturesStruct(slot_1, slot_2, sets_count);

                if (is_first_round) {//for now only the first round will have
                    // slot numbers - after the first round matches
                    // the  server should automatically set slot numbers
                    //  based on the winner of the previous round
                    slot_1 += 2;
                    slot_2 += 2;
                }

            }

            is_first_round = false;
            slot_1 = '';
            slot_2 = '';
            size /= 2;
            i++;
        }

        return rounds;
    }

    /**
     * Get the given season table standings of a round-robin tournament
     * 
     * @param {type} tournament_name
     * @param {type} season_number
     * @returns {Tournament@call;error|nm$_tournament.Tournament.seasonTableStandings.standings|nm$_tournament.exports.seasonTableStandingsRR.standings}
     */
    async seasonTableStandings(tournament_name, season_number) {

        if (arguments.length === 1) {
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
        }

        season_number = season_number - 0;


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


        //get the particular season
        var season_index = season_number - 1;
        var season = tourn.seasons[season_index];


        if (!season) {
            return this.error(`Season ${season_number} not found.`);
        }

        var players_ids = [];
        for (var i = 0; i < season.slots.length; i++) {
            var player_id = season.slots[i].player_id;
            if (player_id) {
                players_ids.push(player_id);
            }
        }

        var user = new User(this.sObj, this.util, this.evt);

        //include  contacts and groups_belong in the required_fields - important! see their use below for broadcasting to related users
        var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
        var standings = await user.getInfoList(players_ids, required_fields);

        //check if the player info list is complete - ie match  the number requested for
        var missing = this.util.findMissing(players_ids, standings, function (p_id, p_info) {
            return p_id === p_info.user_id;
        });

        if (missing) {
            //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
            return this.error('Could not find player with user id - ' + missing);
        }

        var slots = season.slots;

        for (var i = 0; i < standings.length; i++) {

            for (var j = 0; j < slots.length; j++) {
                if (standings[i].user_id === slots[j].player_id) {
                    standings[i].total_points = slots[j].total_points;
                    standings[i].total_wins = slots[j].total_wins;
                    standings[i].total_losses = slots[j].total_losses;
                    standings[i].total_draws = slots[j].total_draws;
                    standings[i].total_played = slots[j].total_played;
                    break;
                }
            }

        }

        //sort the positions in desending order according to thier general performance
        standings = this._resultStandings(standings);

        return {
            tournament_name: tournament_name,
            season_number: season_number,
            standings: standings
        };
    }

    //tricky - note to also modify the corresponding rounds of the season.
    async seasonAddPlayer(user_id, tournament_name, season_number, player_id, slot_number) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
            player_id = arguments[0].player_id;
            slot_number = arguments[0].slot_number;
        }

        season_number = season_number - 0;
        slot_number = slot_number - 0;

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }

        //get the particular season
        var season_index = season_number - 1;
        var season = tourn.seasons[season_index];


        if (!season) {
            return this.error(`Season ${season_number} not found.`);
        }

        switch (season.status) {
            //case 'start' //not required any more for some good reasons - instead, we will check the specific match fixture and avoid displacing players whose matches have already started
            case 'end' :
                return this.error(`Can not add player - season ${season_number} already ended.`);
            case 'cancel' :
                return this.error(`Can not add player - season ${season_number} is cancelled.`);
        }

        var found;
        for (var i = 0; i < tourn.registered_players.length; i++) {
            if (tourn.registered_players[i].user_id === player_id) {
                found = true;
                break;
            }
        }

        if (!found) {
            return this.error(`Can not added player! Please register ${player_id} in ${tournament_name} tournament before adding the player.`);
        }

        var editObj = {};

        var slot;
        for (var i = 0; i < season.slots.length; i++) {
            if (season.slots[i].sn === slot_number) {
                slot = season.slots[i];
                //slot.player_id = player_id;
                editObj[`seasons.${season_index}.slots.${i}.player_id`] = player_id;
                break;
            }
        }

        if (!slot) {
            return this.error(`Slot ${slot_number} not found.`);
        }

        var nowTime = new Date().getTime();
        var rounds = season.rounds;
        for (var i = 0; i < rounds.length; i++) {
            var fixtures = rounds[i].fixtures;
            for (var k = 0; k < fixtures.length; k++) {

                //check if the fixture kickoff time is set and close by
                if ((slot_number === fixtures[k].player_1.slot
                        || slot_number === fixtures[k].player_2.slot)
                        && fixtures[k].start_time) {
                    var _15_mins = 15 * 60 * 1000;
                    var diff = new Date(fixtures[k].start_time).getTime() - nowTime;
                    if (diff <= 0) {
                        return this.error(`Not allowed! Cannot replace another player whose match has already started at ${fixtures[k].start_time}.`);
                    } else if (diff <= _15_mins) {
                        return this.error(`Not allowed! Cannot replace another player whose match kickoff time of ${fixtures[k].start_time} is close by.`);
                    }
                }

                //modify the corresponding rounds fixtures
                if (fixtures[k].player_1.slot === slot_number) {
                    //fixtures[k].player_1.id = player_id;
                    editObj[`seasons.${season_index}.rounds.${i}.fixtures.${k}.player_1.id`] = player_id;
                }
                if (fixtures[k].player_2.slot === slot_number) {
                    //fixtures[k].player_2.id = player_id;
                    editObj[`seasons.${season_index}.rounds.${i}.fixtures.${k}.player_2.id`] = player_id;
                }
            }
        }


        //update the tournament

        var r = await c.updateOne({name: tournament_name, 'seasons.sn': season_number}, {$set: editObj});

        if (r.result.nModified > 0) {

            //return the newly modified tournament
            var c = this.sObj.db.collection(this.sObj.col.tournaments);
            var tourn = await c.findOne({name: tournament_name});
            if (!tourn) {
                return this.error(`Tournament does not exist - ${tournament_name}`);

            }

            return {
                tournament: tourn,
                msg: 'Added player successfully.'
            };

        } else if (r.result.n > 0 && r.result.nModified === 0) {
            return this.error('Nothing changed. Possibly, player already addded.');
        } else {
            return this.error('Condition not met!');
        }

    }

    //tricky - note to also modify the corresponding rounds of the season.
    async seasonRemovePlayer(user_id, tournament_name, season_number, player_id) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
            player_id = arguments[0].player_id;
        }

        season_number = season_number - 0;

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }

        //get the particular season
        var season;
        var season_index = season_number - 1;
        var season = tourn.seasons[season_index];

        if (!season) {
            return this.error(`Season ${season_number} not found.`);
        }


        switch (season.status) {
            //case 'start' //not required any more for some good reasons - instead, we will check the specific match fixture and avoid displacing players whose matches have already started
            case 'end' :
                return this.error(`Can not remove player - season ${season_number} already ended.`);
            case 'cancel' :
                return this.error(`Can not remove player - season ${season_number} is cancelled.`);
        }

        var editObj = {};

        for (var i = 0; i < season.slots.length; i++) {
            if (season.slots[i].player_id === player_id) {
                //season.slots[i].player_id = '';
                editObj[`seasons.${season_index}.slots.${i}.player_id`] = '';
                break;
            }
        }


        var nowTime = new Date().getTime();
        var rounds = season.rounds;
        for (var i = 0; i < rounds.length; i++) {
            var fixtures = rounds[i].fixtures;
            for (var k = 0; k < fixtures.length; k++) {

                //check if the fixture kickoff time is set and close by
                if ((player_id === fixtures[k].player_1.id
                        || player_id === fixtures[k].player_2.id)
                        && fixtures[k].start_time) {

                    var _15_mins = 15 * 60 * 1000;
                    var diff = new Date(fixtures[k].start_time).getTime() - nowTime;
                    if (diff <= 0) {
                        return this.error(`Not allowed! Cannot remove a player whose match has already started at ${fixtures[k].start_time}.`);
                    } else if (diff <= _15_mins) {
                        return this.error(`Not allowed! Cannot remove a player whose match kickoff time of ${fixtures[k].start_time} is close by.`);
                    }
                }

                //modify the corresponding rounds fixtures
                if (fixtures[k].player_1.id === player_id) {
                    //fixtures[k].player_1.id = '';
                    editObj[`seasons.${season_index}.rounds.${i}.fixtures.${k}.player_1.id`] = '';
                }
                if (fixtures[k].player_2.id === player_id) {
                    //fixtures[k].player_2.id = '';
                    editObj[`seasons.${season_index}.rounds.${i}.fixtures.${k}.player_2.id`] = '';
                }
            }
        }

        //update the tournament
        if (Object.keys(editObj).length === 0) {
            return 'No player to remove';
        }

        var r = await c.updateOne({name: tournament_name, 'seasons.sn': season_number}, {$set: editObj});

        if (r.result.nModified > 0) {

            //return the newly modified tournament
            var c = this.sObj.db.collection(this.sObj.col.tournaments);
            var tourn = await c.findOne({name: tournament_name});
            if (!tourn) {
                return this.error(`Tournament does not exist - ${tournament_name}`);

            }

            return {
                tournament: tourn,
                msg: 'Removed player successfully.'
            };

        } else if (r.result.n > 0 && r.result.nModified === 0) {
            return 'Nothing changed. Possibly, player not found.';
        } else {
            return 'Condition not met!';
        }

    }

    async seasonGetPlayers(tournament_name, season_number) {

        if (arguments.length === 1) {
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
        }

        season_number = season_number - 0;

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }


        //get the particular season
        var season;
        for (var i = 0; i < tourn.seasons.length; i++) {
            if (tourn.seasons[i].sn === season_number) {
                season = tourn.seasons[i];
                break;
            }
        }

        if (!season) {
            return this.error(`Season ${season_number} not found.`);
        }

        var players_ids = [];
        for (var i = 0; i < season.slots.length; i++) {
            var player_id = season.slots[i].player_id;
            if (player_id) {
                players_ids.push(player_id);
            }
        }

        var user = new User(this.sObj, this.util, this.evt);

        //include  contacts and groups_belong in the required_fields - important! see their use below for broadcasting to related users
        var required_fields = ['contacts', 'groups_belong', 'user_id', 'rating', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
        var players = await user.getInfoList(players_ids, required_fields);

        //check if the player info list is complete - ie match  the number requested for
        var missing = this.util.findMissing(players_ids, players, function (p_id, p_info) {
            return p_id === p_info.user_id;
        });

        if (missing) {
            //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
            return this.error('Could not find player with user id - ' + missing);
        }

        //attach the slot number of the player in this case 
        for (var i = 0; i < season.slots.length; i++) {
            var player_id = season.slots[i].player_id;
            for (var k = 0; k < players.length; k++) {
                if (players[k].user_id === player_id) {
                    //dynamically setting the the slot number - javascript being what it is!
                    players[k].slot_number = season.slots[i].sn;
                    break;
                }
            }
        }

        return players;
    }

    //tricky - note to also re-structure the rounds of the season.
    async seasonGetSlots(user_id, tournament_name, season_number) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
        }

        season_number = season_number - 0;

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }


        //get the particular season
        var season;
        for (var i = 0; i < tourn.seasons.length; i++) {
            if (tourn.seasons[i].sn === season_number) {
                season = tourn.seasons[i];
                break;
            }
        }

        if (!season) {
            return this.error(`Season ${season_number} not found.`);
        }

        return season.slots;
    }

    /**
     * 
     * @param {type} user_id
     * @param {type} tournament_name
     * @param {type} game_id
     * @param {type} kickoff_time
     * @returns {Tournament@call;error|String}
     */
    async seasonMatchKickOff(user_id, tournament_name, game_id, kickoff_time) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            game_id = arguments[0].game_id;
            kickoff_time = arguments[0].kickoff_time;
        }

        var begin_time = new Date(kickoff_time);
        if (isNaN(begin_time.getTime())) {
            return this.error(`Invalid kickoff time value- ${kickoff_time}`);
        }

        var now = new Date().getTime();
        if (begin_time.getTime() < now) {
            return this.error(`Kickoff time can not be in the past.`);
        }

        var _15_mins = 15 * 60 * 1000;

        if (true) {//TESTING! REMOVE LATER ABEG O!!!
            console.log('TESTING! REMOVE LATER ABEG O!!!');
            _15_mins = 20 * 1000; //TESTING! REMOVE LATER ABEG O!!!
        }

        if (begin_time.getTime() <= now + _15_mins) {
            return this.error(`Kickoff time too close to current time.`);
        }

        var tc = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await tc.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }

        var seasons = tourn.seasons;
        if (seasons.length === 0) {
            return this.error(`No season found.`);
        }
        var last_season_number = seasons.length;
        var last_season_index = last_season_number - 1;
        var current_season = seasons[last_season_index];

        if (current_season.status === 'cancel') {
            return this.error(`Cannot set kickoff time - season ${seasons.length} is cancelled.`);
        }

        if (current_season.status === 'end') {
            return this.error(`Cannot set kickoff time - season ${seasons.length} has ended.`);
        }
        var season_start_time = new Date(current_season.start_time);
        if (begin_time.getTime() < season_start_time.getTime()) {
            return this.error(`Kickoff time, ${begin_time} must be at least at or after the current season start time which is ${season_start_time}`);
        }

        var _reminder_mins = this.sObj.KICKOFF_TIME_REMINDER;


        if (true) {//TESTING! REMOVE THIS 'IF' BLOCK LATER ABEG O!!!
            console.log('TESTING! REMOVE LATER ABEG O!!!');
            _reminder_mins = 10 * 1000; //TESTING! REMOVE LATER ABEG O!!!
        }

        //find the match fixture with the give game id

        var match_fixture;
        var has_kickoff_time = false;
        var rounds = current_season.rounds;
        var players_ids = [];
        var round_skip;
        var fixture_skip;
        var last_fixt;
        var last_round_match;
        var current_round;
        var round_index;
        var match_fixt_index;
        var nowTime = new Date().getTime();


        var found_game_id = false;

        //Check if the game id exists
        outer0: for (var i = 0; i < rounds.length; i++) {
            var fixtures = rounds[i].fixtures;
            for (var j = 0; j < fixtures.length; j++) {
                if (fixtures[j].game_id === game_id) {
                    found_game_id = true;
                    break outer0;
                }
            }
        }

        if (!found_game_id) {
            return 'Game id not found.';
        }

        outer: for (var i = 0; i < rounds.length; i++) {
            var fixtures = rounds[i].fixtures;
            var unfinish_match;
            for (var j = 0; j < fixtures.length; j++) {
                round_index = i;
                match_fixt_index = j;
                var current_fixt = fixtures[match_fixt_index];

                if (!current_fixt.end_time) {
                    unfinish_match = current_fixt;
                }

                if (j > 0) {
                    last_fixt = fixtures[j - 1];
                    if (!last_fixt.start_time) {
                        // last match of current round
                        round_skip = i + 1;//current round
                        fixture_skip = j;//last match
                        break outer;
                    }
                }

                if (i > 0 && j === 0) {
                    var prev_fixtures = rounds[i - 1].fixtures;
                    last_fixt = prev_fixtures[prev_fixtures.length - 1];
                    last_round_match = last_fixt;
                    if (!last_fixt.start_time) {
                        // last match of previous round
                        round_skip = i; //previous round
                        fixture_skip = prev_fixtures.length; //last match (but of the previous round)
                        break outer;
                    }
                }


                if (current_fixt.game_id === game_id) {
                    match_fixture = current_fixt;//hold   
                    current_round = i + 1;
                    if (match_fixture.start_time) {
                        var time_remain = new Date(match_fixture.start_time).getTime() - nowTime;
                        if (time_remain <= 0) {
                            return this.error(`Cannot modify kickoff time of a match already started at ${match_fixture.start_time}.`);
                        } else if (time_remain <= _reminder_mins) {
                            var time_span = time_remain >= 60000 ? Math.round(time_remain / 60000) : Math.round(time_remain / 1000); //in minutes and seconds
                            var tm_str = time_remain >= 60000 ? (time_span > 1 ? 'minutes' : 'minute') : (time_span > 1 ? 'seconds' : 'second');
                            return this.error(`Cannot modify kickoff time of a match set to begin in about ${time_span} ${tm_str} time at ${match_fixture.start_time}.`);
                        }

                        has_kickoff_time = true;
                    }
                    if (match_fixture.player_1.id && match_fixture.player_2.id) {
                        players_ids.push(match_fixture.player_1.id);
                        players_ids.push(match_fixture.player_2.id);
                    }
                    break outer;
                }

            }

            if (unfinish_match) {//NOT YET TESTED - COME BACK ABEG O!!!
                return this.error(`All matches in round ${rounds[i].sn} must be concluded before setting kickoff time for those in round ${rounds[i].sn + 1}.`);
            }
        }



        if (round_skip > 0) {
            return this.error(`You cannot skip fixtures! Please set kickoff time for match ${fixture_skip} on round ${round_skip}. Kickoff time must be set in order, one after the other.`);
        }

        if (last_fixt && begin_time.getTime() < new Date(last_fixt.start_time).getTime()) {
            return this.error(`Kickoff time must be at least at or after the last kickoff time set for match ${fixture_skip} on round ${round_skip} which is  ${last_fixt.start_time}.`);
        }

        if (!match_fixture) {
            return this.error(`Cannot set kickoff time - match fixture not found.`);
        }

        if (players_ids.length === 0) {
            return this.error(`Cannot set kickoff time - one or more player has no match fixture. Make sure all slots are filled`);
        }


        var mfc = this.sObj.db.collection(this.sObj.col.match_fixtures);

        if (has_kickoff_time) {
            //find and delete the match fixture since we have to replace it!
            try {
                var r = await mfc.findOneAndDelete({game_id: game_id}, {projection: {_id: 0}});
            } catch (e) {
                console.log(e);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS
                return this.error('Oop! Something is wrong.');
            }

            if (!r.value) {
                //O.k check in the matches collection if the match has already start, which is most
                //probably the reason it was not found in match_fixtures collection.
                //So check the matches collection now
                var ms = this.sObj.db.collection(this.sObj.col.matches);
                try {
                    var match = await ms.findOne({game_id: game_id});
                } catch (e) {
                    console.log(e);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS
                    return this.error('Oop! Something is not OK.');
                }

                if (match) {
                    //that's right! the match has already started
                    return 'Could not modify kickoff time - match already started.';
                }
            }
        }

        var required_fields = ['user_id', 'rating', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
        var user = new User(this.sObj, this.util, this.evt);
        var players = await user.getInfoList(players_ids, required_fields);

        if (user.lastError) {
            return this.error('Could not set kickoff. Something went wrong.');
        }

        if (!Array.isArray(players)) {
            console.log('This should not happen! user info list must return an array if no error was caught!');
            return this.error('Could not set kickoff. Something is wrong.');
        }

        //check if the player info list is complete - ie match  the number requested for

        var missing = this.util.findMissing(players_ids, players, function (p_id, p_info) {
            return p_id === p_info.user_id;
        });

        if (missing) {
            //we know that length of players_ids cannot be less than that of players so 'missing' is definitely a string
            return this.error('Could not find player with user id - ' + missing);
        }

        var matchObj = {
            start_time: begin_time.getTime(), //important
            tournament_name: tourn.name,
            competition_rating: tourn.rating,
            game_id: game_id,
            game_name: tourn.game,
            sets_count: tourn.sets_count,
            rules: current_season.rules,
            players: players
        };

        try {
            var r = await mfc.insertOne(matchObj);
        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS
            return this.error('Oop! Something is not right.');
        }

        if (r.result.n !== 1) {
            return this.error('Could not set kickoff. Something is not right. ');
        }

        //update the tournament

        var editObj = {};

        //now set the start time, our interest
        //match_fixture.start_time = kickoff_time;

        var prop = `seasons.${last_season_index}.rounds.${round_index}.fixtures.${match_fixt_index}.start_time`;
        editObj[prop] = kickoff_time; // using the dot operator to access the index of the array

        try {
            await tc.updateOne({name: tournament_name, 'seasons.sn': last_season_number}, {$set: editObj});
        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION - INSTEAD LOG TO ANOTHER PROCESS
            return this.error('Oop! Something went wrong.');
        }


        var k_time = new Date(kickoff_time).getTime();
        var now = new Date().getTime();

        var delay = k_time - now - _reminder_mins;

        this.sObj.task.later(delay, 'info/Tournament/_notifyUpcomingMatch', game_id);//will send match reminder to the players

        var delay = k_time - now;

        this.sObj.task.later(delay, 'game/Match/start', game_id);//will automatically start the match at kickoff time


        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        return {
            tournament: tourn,
            msg: 'Kickoff time set successfully.'
        };

    }

    async seasonStart(user_id, tournament_name, season_number, start_time) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
            start_time = arguments[0].start_time;
        }

        season_number = season_number - 0;

        var season_begin_time = new Date(start_time);
        if (isNaN(season_begin_time.getTime())) {
            return this.error(`Invalid start time value- ${start_time}`);
        }

        if (season_begin_time.getTime() < new Date().getTime()) {
            return this.error(`Season start time can not be in the past.`);
        }


        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }

        var seasons = tourn.seasons;
        var current_season = seasons[season_number - 1];
        if (!current_season) {
            return this.error(`Season ${season_number} not found.`);
        }


        if (season_number < seasons.length - 1) {
            return this.error(`Not allowed - cannot start previous season.`);
        }


        switch (current_season.status) {
            case 'start' :
                return this.error(`Season ${season_number} already started.`);
            case 'end' :
                return this.error(`Season ${season_number} already ended.`);
            case 'cancel' :
                return this.error(`Season ${season_number} is cancelled.`);
        }


        var prev_season = seasons[season_number - 2];//season befor the current season

        if (prev_season && !this._validateSeasonStartTime(prev_season.end_time, start_time)) {
            return;
        }


        var editObj = {};
        var season_index = season_number - 1;

        //current_season.start_time = season_begin_time;

        editObj[`seasons.${season_index}.start_time`] = season_begin_time;

        await c.updateOne({name: tournament_name, 'seasons.sn': season_number}, {$set: editObj});

        var delay = new Date(start_time).getTime() - new Date().getTime();

        this.sObj.task.later(delay, 'info/Tournament/_startSeason', {
            tournament_name: tournament_name,
            season_number: season_number
        });


        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        return {
            tournament: tourn,
            msg: `Season ${season_number} starts ${start_time}`
        };

    }

    /**
     * Prematurely ends the season and stop every further activities on that season.
     * The season is therefore marked 'cancel'.
     * 
     * NOTE: This is an extreme operation in the sense that system must ensure the
     * official is concious of the operation. So client side must provided a way to ensure
     * the official is aware of his action before carrying it out. One way is to provide
     * an input field where the official must type in the reason why he is cancelling
     * the season. 
     * 
     * @param {type} user_id
     * @param {type} tournament_name
     * @param {type} season_number
     * @param {type} reason very important to avoid acidental actions
     * @returns {Tournament@call;error}
     */
    async seasonCancel(user_id, tournament_name, season_number, reason) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
            reason = arguments[0].reason;
        }

        season_number = season_number - 0;

        if (!reason) {
            return this.error('Extreme action requires a reason!');
        }

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }

        var seasons = tourn.seasons;
        var current_season = seasons[season_number - 1];
        if (!current_season) {
            return this.error(`Season ${season_number} not found.`);
        }


        var last = seasons.length - 1;
        if (season_number < last) {
            return this.error(`Not allowed - cannot delete previous season.`);
        }

        //current_season.status = 'cancel'; //mark the season as 'cancel'
        //current_season.end_time = new Date();

        //update the tournament

        var season_index = season_number - 1;

        var editObj = {};
        //editObj['seasons.' + season_index] = current_season; // using the dot operator to access the index of the array
        editObj[`seasons.${season_index}.status`] = 'cancel';
        editObj[`seasons.${season_index}.end_time`] = new Date();

        var r = await c.updateOne({name: tournament_name, 'seasons.sn': season_number}, {$set: editObj});

        if (r.result.nModified > 0) {

            //also send the newly modified tournament
            var c = this.sObj.db.collection(this.sObj.col.tournaments);
            var tourn = await c.findOne({name: tournament_name});
            if (!tourn) {
                return this.error(`Tournament does not exist - ${tournament_name}`);
            }

            //notify all relevant users - registered players and officials
            var data = {
                official_id: user_id, // the id official that cancel the season
                tournament: tourn,
                season_number: current_season.sn,
                reason: reason //tournament comment room should also show this message
            };

            this._broadcastInHouse(tourn, this.evt.season_cancel, data);

        } else if (r.result.n > 0 && r.result.nModified === 0) {
            return this.error(`Nothing changed. Possibly, season ${current_season.sn} is already cancelled.`);
        } else {
            return this.error('Condition not met!');
        }


    }

    /**
     * Deletes the season completely from the list of seasons of the given tournament.
     * 
     * NOTE: This is an extreme operation in the sense that system must ensure the
     * official is concious of the operation. So client side must provided a way to ensure
     * the official is aware of his action before carrying it out. One way is to provide
     * an input field where the official must type in the reason why he is deleting
     * the season. 
     * 
     * @param {type} user_id
     * @param {type} tournament_name
     * @param {type} season_number
     * @param {type} reason very important to avoid acidental actions
     * @returns {Tournament@call;error}
     */
    async seasonDelete(user_id, tournament_name, season_number, reason) {

        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            season_number = arguments[0].season_number;
            reason = arguments[0].reason;
        }

        season_number = season_number - 0;

        if (!reason) {
            return this.error('Extreme action requires a reason!');
        }

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }

        var seasons = tourn.seasons;
        var current_season = seasons[season_number - 1];
        if (!current_season) {
            return this.error(`Season ${season_number} not found.`);
        }

        var last = seasons.length - 1;
        if (season_number < seasons.length) {
            return this.error(`Not allowed - cannot delete previous season. Please start from season ${seasons.length}.`);
        }

        seasons.splice(last, 1);//delete the season from the array

        //update the tournament
        await c.updateOne({name: tournament_name}, {$set: {seasons: seasons}});

        //notify all relevant users - registered players and officials

        //also send the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        var data = {
            official_id: user_id,
            tournament: tourn,
            season_number: current_season.sn,
            reason: reason //tournament comment room should also show this message
        };

        this._broadcastInHouse(tourn, this.evt.season_delete, data);

    }

    async seasonCount(tournament_name) {

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        return tourn.seasons.length;
    }

    /**
     * Returns the seasons in descending order. ie with the  latest being
     * on top
     * 
     * @param {type} tournament_name
     * @returns {Tournament@call;error}
     */
    async getSeasons(tournament_name) {

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        return tourn.seasons;
    }

    _startSeason(obj) {

        var me = this;

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        c.findOne({name: obj.tournament_name})
                .then(function (tourn) {

                    if (!tourn) {
                        return; //tournament no longer exist!
                    }
                    var season_index = obj.season_number - 1;
                    var season = tourn.seasons[obj.season_number - 1];
                    if (!season) {
                        return;//season not found
                    }

                    var editObj = {};
                    editObj[`seasons.${season_index}.status`] = 'start';// change the status fromm 'before-start' to 'start'

                    //update the tournament
                    return c.findOneAndUpdate({name: obj.tournament_name}, {$set: editObj}, {
                        projection: {_id: 0},
                        returnOriginal: false, //return the updated document
                        w: 'majority'
                    })
                            .then(function (r) {
                                var tourn = r.value;
                                //notify all relevant users - registered players and officials
                                var data = {
                                    tournament: tourn,
                                    season_number: season.sn,
                                    start_time: season.start_time
                                };

                                me._broadcastInHouse(tourn, me.evt.season_start, data);

                            });

                })
                .catch(function (err) {
                    console.log(err);//DO NOT DO THIS IN PRODUCTION
                });
        ;



    }

    _broadcastInHouse(tournObj, event, data) {

        var relevant_user_ids = [];

        if (Array.isArray(tournObj.officials)) {
            for (var i = 0; i < tournObj.officials.length; i++) {
                relevant_user_ids[relevant_user_ids.length] = tournObj.officials[i].user_id;
            }
        }

        if (Array.isArray(tournObj.registered_players)) {
            for (var i = 0; i < tournObj.registered_players.length; i++) {
                relevant_user_ids[relevant_user_ids.length] = tournObj.registered_players[i].user_id;
            }
        }

        this.broadcast(event, data, relevant_user_ids);
    }

    /**
     
     * This method is automatically called after the end of every tournament match
     * for purpose such as:
     * 
     * - to promote winners at the end one round to the next in single-elimination tournaments
     * 
     * - to check if the last match of the season has ended so as to take appropriate
     *     action of signalling the end of the season.
     * 
     * @param {type} match
     * @returns {undefined}
     */
    _onTournamentMatchEnd(match) {

        var me = this;

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        c.findOne({name: match.tournament_name})
                .then(function (tourn) {
                    if (!tourn) {
                        return; //tournament no longer exist!
                    }

                    if (tourn.type === me.sObj.SINGLE_ELIMINATION) {
                        me._promoteToNextRound(c, tourn, match);
                    }

                    me._checkSeasonEnd(c, tourn, match);

                })
                .catch(function (err) {
                    console.log(err);//DO NOT DO THIS IN PRODUCTION
                });
    }

    /**
     * Automatically called after the end of every last game set of single elimination
     * tournament match (complete sets) to promeote the winner to the next round.
     *  
     * If the match ends in a draw after all sets, the default immplementation
     * is that one of the players will be randomly picked by the server. 
     * However future implementation may use more appropriate way of separating
     * the players such as comparing the value of their board (as in chess), the 
     * number of points accumulated since the start of the tournament and so on.
     * But when nothing after all can not separate the players then the server will
     * fall back to random picking of the winner (the lucky player).
     * 
     * @param {type} c
     * @param {type} tourn
     * @param {type} match
     * @returns {undefined}
     */
    async _promoteToNextRound(c, tourn, match) {

        //first determine the winner of the sets
        var is_player_1_winner = false;

        var winner = this._determineWinner(tourn, match);
        if (winner === match.players[0].user_id) {
            is_player_1_winner = true;
        }

        var season_index = tourn.seasons.length - 1;
        var current_season = tourn.seasons[season_index];

        if (!current_season) {
            console.log(`Season ${tourn.seasons.length} not found in ${tourn.name} tournament - this should not happen at this point.`);
            return;
        }

        var editObj = {};

        var rounds = current_season.rounds;

        var to = rounds.length - 1; //skip the last round

        for (var i = 0; i < to; i++) {
            var fixtures = rounds[i].fixtures;
            for (var j = 0; j < fixtures.length; j++) {
                if (fixtures[j].game_id === match.game_id) {
                    var n = j % 2 === 0 ? j : (j - 1);
                    var n_nxt = n / 2; //required index of fixtures in next round to be promoted to
                    var nxt_rd_index = i + 1;
                    var next_round = rounds[nxt_rd_index];
                    var next_fixture = next_round.fixtures[n_nxt];

                    if (is_player_1_winner) {
                        if (!next_fixture.player_1.id) {

                            var prop1 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_1.id`;
                            var prop2 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_1.slot`;
                            editObj[prop1] = fixtures[j].player_1.id;
                            editObj[prop2] = fixtures[j].player_1.slot;

                        } else {

                            var prop1 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_2.id`;
                            var prop2 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_2.slot`;
                            editObj[prop1] = fixtures[j].player_1.id;
                            editObj[prop2] = fixtures[j].player_1.slot;


                        }
                    } else {
                        if (!next_fixture.player_1.id) {

                            var prop1 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_1.id`;
                            var prop2 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_1.slot`;
                            editObj[prop1] = fixtures[j].player_2.id;
                            editObj[prop2] = fixtures[j].player_2.slot;

                        } else {

                            var prop1 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_2.id`;
                            var prop2 = `seasons.${season_index}.rounds.${nxt_rd_index}.fixtures.${n_nxt}.player_2.slot`;
                            editObj[prop1] = fixtures[j].player_2.id;
                            editObj[prop2] = fixtures[j].player_2.slot;

                        }
                    }


                    //update the tournament

                    if (Object.keys(editObj).length === 0) {
                        return;
                    }

                    try {
                        await c.updateOne({name: tourn.name}, {$set: editObj});
                    } catch (e) {
                        console.log(e);//DO NOT DO THIS IN PRODUCTION -  INSTEAD LOG TO ANOTHER PROCESS
                    }

                    return; //done

                }
            }
        }

    }

    /**
     * Automatically called after the end of every tournament match to update
     * the score and points of the players on the tournament collection
     * 
     * @param {type} match
     * @param {type} winner_user_id
     * @returns {Tournament@call;error}
     */
    async _updateScores(match, winner_user_id) {

        var c = this.sObj.db.collection(this.sObj.col.tournaments);

        var tourn = await c.findOne({name: match.tournament_name});

        if (!tourn) {
            return this.error(`Tournament does not exist - ${match.tournament_name}`);
        }
        var season_index = tourn.seasons.length - 1;
        var current_season = tourn.seasons[tourn.seasons.length - 1];
        if (!current_season) {
            return this.error(`Season does not exist - ${tourn.seasons.length}`);
        }

        var editObj = {};

        //find the fixture with the game id and set the scores
        var rounds = current_season.rounds;

        for (var i = 0; i < rounds.length; i++) {
            var fixtures = rounds[i].fixtures;
            for (var j = 0; j < fixtures.length; j++) {

                if (fixtures[j].game_id === match.game_id) {

                    if (match.end_time) {
                        var prop0 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.end_time`;
                        editObj[prop0] = match.end_time;
                    }

                    var set_index = match.current_set - 1;

                    if (fixtures[j].player_1.id === winner_user_id) {

                        var prop1 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.player_1.score`;
                        var prop2 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.sets.${set_index}.points.${0}`;
                        editObj[prop1] = fixtures[j].player_1.score + 1;
                        editObj[prop2] = fixtures[j].sets[set_index].points[0] + this.sObj.WIN_POINT;//the winner get 3 point for win - note we are using 3-1-0 scoring system

                        var p1_slot_index = fixtures[j].player_1.slot - 1;
                        var p2_slot_index = fixtures[j].player_2.slot - 1;
                        var incEdit = {};
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_points`] = this.sObj.WIN_POINT;
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_played`] = 1;
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_wins`] = 1;

                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_played`] = 1;
                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_losses`] = 1;//loss

                    }

                    if (fixtures[j].player_2.id === winner_user_id) {

                        var prop1 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.player_2.score`;
                        var prop2 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.sets.${set_index}.points.${1}`;
                        editObj[prop1] = fixtures[j].player_2.score + 1;
                        editObj[prop2] = fixtures[j].sets[set_index].points[1] + this.sObj.WIN_POINT;//the winner get 3 point for win - note we are using 3-1-0 scoring system

                        var p2_slot_index = fixtures[j].player_2.slot - 1;
                        var p1_slot_index = fixtures[j].player_1.slot - 1;
                        var incEdit = {};
                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_points`] = this.sObj.WIN_POINT;
                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_played`] = 1;
                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_wins`] = 1;

                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_played`] = 1;
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_losses`] = 1;//loss
                    }

                    if (!winner_user_id) {//is draw

                        var prop1 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.sets.${set_index}.points.${0}`;
                        var prop2 = `seasons.${season_index}.rounds.${i}.fixtures.${j}.sets.${set_index}.points.${1}`;
                        editObj[prop1] = fixtures[j].sets[set_index].points[0] + this.sObj.DRAW_POINT;//all players get 1 point for draw - note we are using 3-1-0 scoring system
                        editObj[prop2] = fixtures[j].sets[set_index].points[1] + this.sObj.DRAW_POINT;//all players get 1 point for draw - note we are using 3-1-0 scoring system

                        var p1_slot_index = fixtures[j].player_1.slot - 1;
                        var p2_slot_index = fixtures[j].player_2.slot - 1;
                        var incEdit = {};
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_points`] = this.sObj.DRAW_POINT;
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_played`] = 1;
                        incEdit[`seasons.${season_index}.slots.${p1_slot_index}.total_draws`] = 1;

                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_points`] = this.sObj.DRAW_POINT;
                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_played`] = 1;
                        incEdit[`seasons.${season_index}.slots.${p2_slot_index}.total_draws`] = 1;
                    }
                }
            }
        }


        if (Object.keys(editObj).length === 0) {
            return;
        }

        try {
            await c.updateOne({name: match.tournament_name}, {$inc: incEdit, $set: editObj});
        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION -  INSTEAD LOG TO ANOTHER PROCESS
        }

    }

    /**
     * Ends the season if the match is the last match of the tournament season.
     * 
     * 
     * @param {type} c
     * @param {type} tourn
     * @param {type} match
     * @returns {undefined}
     */
    async _checkSeasonEnd(c, tourn, match) {

        var me = this;
        //check if the final match of the season was played

        var last_season_index = tourn.seasons.length - 1;
        var last_season = tourn.seasons[last_season_index];
        var last_round_index = last_season.rounds.length - 1;
        var last_round = last_season.rounds[last_round_index];
        var last_fixtures = last_round.fixtures;
        var last_fixt_index = last_fixtures.length - 1;
        var last_fixt = last_fixtures[last_fixt_index];
        var last_set = last_fixt.sets[last_fixt.sets.length - 1];

        if (last_fixt.game_id !== match.game_id
                || match.current_set < match.sets.length) {
            return;// leave - not the final match
        }

        //At this point the final match of the season just completed

        var winner = this._determineWinner(tourn, match);

        var rating = await this._computeTournamentRating(tourn);

        var prop1 = `seasons.${last_season_index}.rounds.${last_round_index}.fixtures.${last_fixt_index}.end_time`;
        var prop2 = `seasons.${last_season_index}.status`;
        var prop3 = `seasons.${last_season_index}.end_time`;
        var prop4 = `seasons.${last_season_index}.winner`;
        var prop5 = `rating`;

        var editObj = {};
        editObj[prop1] = match.end_time;
        editObj[prop2] = 'end';
        editObj[prop3] = match.end_time;
        editObj[prop4] = winner;
        editObj[prop5] = rating;



        //update the tournament
        c.findOneAndUpdate({name: match.tournament_name}, {$set: editObj}, {
            projection: {_id: 0},
            returnOriginal: false, //return the updated document
            w: 'majority'
        })
                .then(function (r) {
                    var tourn = r.value;
                    //notify all relevant users - registered players and officials
                    var data = {
                        tournament: tourn,
                        season_number: last_season.sn,
                        end_time: match.end_time
                    };

                    me._broadcastInHouse(tourn, me.evt.season_end, data);

                })
                .catch(function (err) {
                    console.log(err); //DO NOT DO THIS IN PRODUCTION. INSTEAD LOG TO ANOTHER PROCCESS
                });


    }

    /**
     * The rating of tournament is based on the average rating of the players 
     * in the current season provided the current season has started with all
     * slots filled otherwise the last season with all slots filled will be used.
     * Note: cancel seasons will not be used
     *  
     * @param {type} tourn
     * @returns {nm$_tournament.Tournament.sObj.DEFAULT_RATING}
     */
    async _computeTournamentRating(tourn) {

        var seasons = tourn.seasons;
        if (!seasons || !seasons.length) {
            return this.sObj.DEFAULT_RATING;
        }

        //find seasons with all slots filled and not cancelled
        var valid_season;
        var players_ids = [];
        for (var i = 0; i < seasons.length; i++) {
            var filled = true;
            players_ids = [];
            for (var k = 0; k < seasons[i].slots.length; k++) {
                if (!seasons[i].slots[k].player_id) {
                    filled = false;
                    break;
                }
                players_ids.push(seasons[i].slots[k].player_id);
            }

            if (filled && seasons[i].status !== 'cancel') {
                valid_season = seasons[i];
            }

        }

        if (!valid_season) {
            return this.sObj.DEFAULT_RATING;
        }

        //at this piont we have a valid season

        var user = new User(this.sObj, this.util, this.evt);

        var required_fields = ['rating'];
        var players_ratings = await user.getInfoList(players_ids, required_fields);

        var avg = this.sObj.DEFAULT_RATING;//default just in case players_ratings is empty
        var sum;
        for (var i = 0; i < players_ratings.length; i++) {
            sum += players_ratings[i].rating;
            avg = sum / players_ratings.length;
        }

        return avg;
    }

    _betterPlayer(season, player_1_id, player_2_id) {
        var slot_1, slot_2;
        for (var i = 0; i < season.slots.length; i++) {
            if (season.slots[i].player_id === player_1_id) {
                slot_1 = season.slots[i];
                if (slot_2) {
                    break;
                }
            }
            if (season.slots[i].player_id === player_2_id) {
                slot_2 = season.slots[i];
                if (slot_1) {
                    break;
                }
            }
        }

        var compare = this._resultsCompare(slot_1, slot_2);
        if (compare < 0) {
            return slot_1.player_id;
        } else if (compare > 0) {
            return slot_2.player_id;
        } else {
            return;
        }
    }
    /**
     * Uses the following three paramenters to compare results listed
     * in order of their importance below:
     * 
     * 1. total_points  (most important)
     * 2. total_wins
     * 3. total_draws (least important)
     * 
     * @param {type} a
     * @param {type} b
     * @returns {Number}
     */
    _resultsCompare(a, b) {
        if (b.total_points === a.total_points && b.total_wins === a.total_wins)
            return b.total_draws - a.total_draws;//important

        if (b.total_points === a.total_points)
            return b.total_wins - a.total_wins;//important

        return b.total_points - a.total_points;//important
    }
    /**
     * Sort the positions in desending order according to thier general performance
     * using the following three paramenters to determine thier positions listed
     * in order of their importance below:
     * 
     * 1. total_points  (most important)
     * 2. total_wins
     * 3. total_draws (least important)
     * 
     * @param {type} results
     * @returns {unresolved}
     */
    _resultStandings(results) {
        return results.sort(this._resultsCompare);
    }

    _determineWinner(tourn, match) {
        var season = tourn.seasons[tourn.seasons.length - 1];

        if (tourn.type === this.sObj.SINGLE_ELIMINATION) {
            if (match.scores[0] > match.scores[1]) {// player_1 wins
                return match.players[0].user_id;
            } else if (match.scores[0] < match.scores[1]) {// player_2 wins
                return match.players[1].user_id;
            } else {//draw

                //In the case of draw the server will compare their general performances 
                //since the start of the season to determine who goes through. Where this does
                //not still separate them, the server will just randomly pick a winner - like penalty in soccer

                //In the future we may add more implementions separating
                //the players such as comparing the value of their board (as in chess).

                var better_player = this._betterPlayer(season, match.players[0].user_id, match.players[1].user_id);
                if (better_player) {
                    //console.log('better_player', better_player);
                    match.win_factor = 0.75; // this will multiply to the 3 pionts of the winner when computing player ranking
                    return better_player;
                } else {
                    //randomly pick a player
                    var index = Math.floor(Math.random() * 2);
                    index = index > 1 ? 1 : index;//just to be sure the random number is not greater than 1
                    match.win_factor = 0.6; // this will multiply to the 3 pionts of the winner when computing player ranking
                    return match.players[index].user_id;
                }
            }

        }


        if (tourn.type === this.sObj.ROUND_ROBIN) {
            var standings = this._resultStandings(season.slots);
            return standings[0].player_id;// the player at the summit.
        }


    }

    _notifyUpcomingMatch(game_id) {
        var me = this;

        var c = this.sObj.db.collection(this.sObj.col.match_fixtures);
        c.findOne({game_id: game_id})
                .then(function (match) {
                    if (!match) {
                        return; //match fixture no longer exist!
                    }

                    match.reminder_time = new Date();
                    notification_type: 'upcoming_tournament_match',
                            match.notification_time = match.reminder_time;//same

                    //store the upcoming match
                    var ccm = this.sObj.db.collection(this.sObj.col.upcoming_matches);
                    ccm.insertOne(match)
                            .then(function (result) {
                                //DO NOTHING
                            })
                            .catch(function (err) {
                                console.log(err); //DO NOT DO THIS IN PRODUCTION. INSTEAD LOG TO ANOTHER PROCCESS
                            });

                    //notify the players of their upcoming match
                    var players_ids = [];
                    players_ids.push(match.players[0].user_id);
                    players_ids.push(match.players[1].user_id);

                    var _mins = me.sObj.KICKOFF_TIME_REMINDER * 1000;
                    me.broadcast(me.evt.notify_upcoming_match, match, players_ids, true, _mins);

                })
                .catch(function (err) {
                    console.log(err);//DO NOT DO THIS IN PRODUCTION
                });
    }
    /**
     * 
     * 
     * 
     * 
     * 
     * @param {type} user_id
     * @param {type} tournament_name
     * @param {type} game
     * @param {type} variant
     * @param {type} type
     * @param {type} sets_count
     * @param {type} status_message
     * @returns {Tournament@call;error|String}
     */
    async createTournament(user_id, tournament_name, game, variant, type, sets_count, status_message) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            game = arguments[0].game;
            variant = arguments[0].variant;
            type = arguments[0].type;
            sets_count = arguments[0].sets_count;
            status_message = arguments[0].status_message;
        }

        if (type !== this.sObj.ROUND_ROBIN && type !== this.sObj.SINGLE_ELIMINATION) {
            return this.error(`Tournament type must be ${this.sObj.ROUND_ROBIN} or ${this.sObj.SINGLE_ELIMINATION}.`);
        }

        if (!tournament_name) {
            return this.error('No tournament name.');
        }

        if (typeof tournament_name !== 'string') {
            return this.error('Invalid tournament name.');
        }


        if (!game) {
            return this.error('No game name.');
        }

        if (typeof game !== 'string') {
            return this.error('Invalid game name.');
        }


        if (!sets_count || sets_count < 1) {
            return this.error('Number of sets must be at least 1.');
        }

        if (sets_count > this.sObj.MAX_GAME_SETS) {
            return this.error(`Number of sets must not be greater than ${this.sObj.MAX_GAME_SETS}`);
        }

        if (!status_message) {
            status_message = '';
        }

        try {

            var c = this.sObj.db.collection(this.sObj.col.tournaments);
            var tourn = await c.findOne({name: tournament_name});

            if (tourn) {
                return this.error('Tournament name already exist!');
            }

            //rating is not included because it changes
            var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
            var user = new User(this.sObj, this.util, this.evt);
            var officialInfo = await user.getInfo(user_id, required_fields);

            if (user.lastError) {
                return this.error('Could not create tournament.');
            }
            if (!officialInfo) {
                return this.error('Unknown user.');
            }


            try {
                if (this.files && this.files.tournament_icon) {

                    //send to imageservice to resize the icon image
                    var rs = await this.sObj.resizeImage({
                        id: tournament_name,
                        type: 'tournament',
                        filename: this.files.tournament_icon.path
                    });
                }
            } catch (e) {
                console.log(e);
                return this.error('Something went wrong!');
            }


            var tournObj = {
                name: tournament_name,
                game: game,
                created_by: officialInfo,
                date_created: new Date(),
                type: type, //round-robin and single-elimination 
                sets_count: sets_count, // number of times two player will play each other before a winner is determined - max is 5
                status_message: status_message,
                officials: [officialInfo], // automatic official
                registered_players: [],
                seasons: []
            };

            if (rs) {
                tournObj.small_photo_url = rs.small_image_path;
                tournObj.large_photo_url = rs.large_image_path;
            }


            var r = await c.insertOne(tournObj);
            if (r.result.n === 1) {
                return tournObj;
            } else if (r.result.n > 1) {
                console.log('This should not happen! inserting more than one specified document when creating tournament!');
                return tournObj;
            } else {
                return this.error('Tournament was not creadted!');
            }
        } catch (e) {
            console.log(e);
            return this.error('Could not create tournament!');
        }

    }

    async editTournament(user_id, tournament_name) {
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
        }

        //first check if the user is authorize to edit the tournament

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne(
                {
                    name: tournament_name
                });

        if (!tourn) {
            return this.error(`Tournament not found - ${tournament_name}`);
        }

        if (!this._isTournamentOfficial(tourn, user_id)) {
            return this.error('Not authorized!');
        }


        try {
            if (this.files && this.files.tournament_icon) {

                //send to imageservice to resize the icon image
                var rs = await this.sObj.resizeImage({
                    id: tournament_name,
                    type: 'tournament',
                    filename: this.files.tournament_icon.path
                });
            }
        } catch (e) {
            console.log(e);
            return this.error('Something went wrong!');
        }

        var setObj = {};

        if (rs) {
            var tm = new Date().getTime();
            setObj.small_photo_url = rs.small_image_path + '?' + tm;//force refresh by appending the new time query string
            setObj.large_photo_url = rs.large_image_path + '?' + tm;//force refresh by appending the new time query string
        }

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        try {
            var r = await c.findOneAndUpdate({name: tournament_name}, {$set: setObj}, {
                projection: {_id: 0},
                returnOriginal: false, //return the updated document
                w: 'majority'
            });
        } catch (e) {
            console.log(e);
            return this.error('Could not edit tournament.');
        }

        tourn = r.value;


        this._broadcastInHouse(tourn, this.evt.tournament_edited, tourn);

        return tourn;
    }

    async addOfficial(user_id, tournament_name, new_official_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            new_official_user_id = arguments[0].new_official_user_id;
        }


        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error('Tournament not found - ' + tournament_name);
        }

        var is_official = false;


        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === new_official_user_id) {
                    return this.error('Already an official!');
                }
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        } else {
            tourn.officials = [];
        }

        //check if the user is authized
        if (!is_official) {
            return this.error('Not authorized!');
        }

        //check if the maximum official the tournament can have has exceeded
        if (tourn.officials.length > this.sObj.MAX_TOURNAMENT_OFFICIALS) {
            return this.error('Cannot add more official! Maximum exceeded - ' + this.sObj.MAX_TOURNAMENT_OFFICIALS);
        }

        //at this point the user is authorized

        //rating is not included because it changes
        var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
        var user = new User(this.sObj, this.util, this.evt);
        var officialInfo = await user.getInfo(new_official_user_id, required_fields);

        if (user.lastError) {
            return this.error('Could not add official.');
        }
        if (!officialInfo) {
            return this.error('Unknown user.');
        }

        tourn.officials.push(officialInfo);

        //update the officials
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {officials: tourn.officials}});

        //set tournament belong of new official
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: new_official_user_id}, {$addToSet: {tournaments_belong: tournament_name}}, {w: 'majority'});

        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        this._broadcastInHouse(tourn, this.evt.tournament_official_added, tourn);

        return tourn;

    }

    async removeOfficial(user_id, tournament_name, official_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            official_user_id = arguments[0].official_user_id;
        }

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error('Tournament not found - ' + tournament_name);
        }

        if (tourn.created_by.user_id === official_user_id) {
            return this.error('Invalid action - the tournament creator is a permanent official and so cannot be removed!');
        }
        console.log(tourn.officials);
        var is_official = false;
        var index_found = -1;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === official_user_id) {
                    index_found = i;
                }
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        } else {
            tourn.officials = [];
        }

        //check if the user is authized
        if (!is_official) {
            return this.error('Not authorized!');
        }

        if (index_found === -1) {
            return this.error('Official not found!');
        }

        //now remove
        tourn.officials.splice(index_found, 1);

        //update the officials
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {officials: tourn.officials}});

        //remove from tournament belong of the official
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: official_user_id}, {$pull: {tournaments_belong: tournament_name}}, {w: 'majority'});


        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        this._broadcastInHouse(tourn, this.evt.tournament_official_removed, tourn);
        
        return tourn;
    }

    async registerPlayer(user_id, tournament_name, player_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            player_user_id = arguments[0].player_user_id;
        }


        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error('Tournament not found - ' + tournament_name);
        }

        var is_official = false;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        }

        if (!is_official) {
            return this.error('Not authorized');
        }

        var is_player = false;
        if (Array.isArray(tourn.registered_players)) {
            for (var i = 0; i < tourn.registered_players.length; i++) {
                if (tourn.registered_players[i].user_id === player_user_id) {
                    is_player = true;
                }
            }
        } else {
            tourn.registered_players = [];
        }

        if (is_player) {
            return this.error('Already a player in this tournament.');
        }

        if (tourn.registered_players.length > this.sObj.MAX_TOURNAMENT_PLAYERS) {
            return this.error('Cannot add more players! Maximum exceeded - ' + this.sObj.MAX_TOURNAMENT_PLAYERS);
        }

        //rating is not included because is changes
        var required_fields = ['user_id', 'first_name', 'last_name', 'email', 'small_photo_url', 'large_photo_url'];
        var user = new User(this.sObj, this.util, this.evt);
        var playerInfo = await user.getInfo(player_user_id, required_fields);

        if (user.lastError) {
            return this.error('Could not register player.');
        }
        if (!playerInfo) {
            return this.error('Unknown user.');
        }

        tourn.registered_players.push(playerInfo);

        //update the registered_players
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {registered_players: tourn.registered_players}});

        //set tournament belong of new player
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: player_user_id}, {$addToSet: {tournaments_belong: tournament_name}}, {w: 'majority'});

        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        this._broadcastInHouse(tourn, this.evt.tournament_player_registered, tourn);

        return tourn;

    }

    async registerBulkPlayers(user_id, tournament_name, player_user_ids) {

        var results = [];
        for (var i = 0; i < player_user_ids.length; i++) {
            var r = await this.registerPlayer(user_id, tournament_name, player_user_ids[i]);
            var msgObj = {
                success: true,
                msg: player_user_ids[i] + ' -> Added successfully',
                user_id: player_user_ids[i]
            };
            if (!r) {
                msgObj.success = false;
                msgObj.msg = player_user_ids[i] + ' -> ' + this.lastError;
            }
            results.push(msgObj);
        }

        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        this._broadcastInHouse(tourn, this.evt.tournament_bulk_players_registered, tourn);
        
        return {
            tournament: tourn,
            msg: results
        };

        return results;
    }

    async removeRegisteredPlayer(user_id, tournament_name, player_user_id) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            user_id = arguments[0].user_id;
            tournament_name = arguments[0].tournament_name;
            player_user_id = arguments[0].player_user_id;
        }


        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});

        if (!tourn) {
            return this.error('Tournament not found - ' + tournament_name);
        }

        var is_official = false;
        if (Array.isArray(tourn.officials)) {
            for (var i = 0; i < tourn.officials.length; i++) {
                if (tourn.officials[i].user_id === user_id) {
                    is_official = true;
                }
            }
        }

        if (!is_official) {
            return this.error('Not authorized');
        }

        var index_found = -1;
        if (Array.isArray(tourn.registered_players)) {
            for (var i = 0; i < tourn.registered_players.length; i++) {
                if (tourn.registered_players[i].user_id === player_user_id) {
                    index_found = i;
                }
            }
        } else {
            tourn.registered_players = [];
        }

        if (index_found === -1) {
            return this.error('Player not found!');
        }


        //remove the player
        tourn.registered_players.splice(index_found, 1);

        //update the registered_players
        var tourn = await c.updateOne(
                {name: tournament_name},
                {$set: {registered_players: tourn.registered_players}});

        //remove from tournament belong of the player
        var user_col = this.sObj.db.collection(this.sObj.col.users);
        user_col.updateOne({user_id: player_user_id}, {$pull: {tournaments_belong: tournament_name}}, {w: 'majority'});

        //return the newly modified tournament
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name});
        if (!tourn) {
            return this.error(`Tournament does not exist - ${tournament_name}`);
        }

        this._broadcastInHouse(tourn, this.evt.tournament_registered_player_removed, tourn);
        
        return tourn;

    }

    /**
     * Get tournaments related one way or the other to the user.
     * 
     * The policy for getting the related tournaments is as follows:
     * 
     * 1) get all the tournaments belong to by the contacts of the user.
     * 2) get all the tournaments belong to by the members of the user groups
     * 
     * @param {type} user
     * @returns {Array|nm$_tournament.Tournament._relatedTournaments.tourns|nm$_tournament.exports._relatedTournaments.tourns}
     */
    async _relatedTournaments(user) {


        var related_user_ids = user.contacts || [];

        var c_grp = this.sObj.db.collection(this.sObj.col.groups);


        var oredArr = [];
        var groups_belong = user.groups_belong;
        for (var i = 0; i < groups_belong.length; i++) {
            oredArr.push({
                name: groups_belong[i]
            });
        }

        var res = await c_grp.findOne({$or: oredArr}, {_id: 0, members: 1});

        for (var i = 0; i < res.length; i++) {
            var group_members = res[i].members;
            for (var k = 0; k < group_members.length; k++) {//committed
                if (group_members[k].committed === false) {
                    continue;//skip member not yet committed
                }
                if (related_user_ids.indexOf(group_members[k].user_id) > -1) {
                    continue;//skip to avoid duplicate
                }
                related_user_ids.push(group_members[k].user_id);
            }
        }


        var oredArr = [];
        for (var i = 0; i < related_user_ids.length; i++) {
            oredArr.push({
                user_id: related_user_ids[i]
            });
        }

        if (related_user_ids.length === 0) {
            return [];
        }

        var c_usr = this.sObj.db.collection(this.sObj.col.users);


        var result = await c_usr.findOne({$or: oredArr}, {_id: 0, tournaments_belong: 1});

        c_usr.updateOne({user_id: user.user_id}, {$set: {rel_tourns_update_time: new Date()}})
                .then(function (r) {
                    //do nothing
                })
                .catch(function (err) {
                    console.log(err);
                });

        var tourns = [];

        //collect the tournaments names making sure no duplicate exist

        for (var i = 0; i < result.length; i++) {
            var tournaments_belong = result[i].tournaments_belong;
            for (var k = 0; k < tournaments_belong.length; k++) {
                if (tourns.indexOf(tournaments_belong[k]) > -1) {
                    continue;//skip to avoid duplicate
                }
                tourns.push(tournaments_belong[k]);
            }
        }

        return tourns;
    }

    async getTournamentInfo(tournament_name) {

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var tourn = await c.findOne({name: tournament_name}, {_id: 0});

        if (!tourn) {
            return this.error(`Tournament not found -  ${tournament_name}`);
        }

        return tourn;
    }

    async getTournamentsInfoList(tournament_names_arr) {

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        var query = {$or: []};
        for (var i = 0; i < tournament_names_arr.length; i++) {
            query.$or.push({name: tournament_names_arr[i]});
        }
        var tourns = await c.find(query, {_id: 0}).toArray();

        if (!tourns || !tourns.length) {
            return [];
        }

        return tourns;
    }

    /**
     * Get the list of tournaments belong to by this user. The list consist of 
     * the tournament info.
     * 
     * @param {type} user_id - id of the user
     * @returns {Array|nm$_tournament.Tournament|Tournament.getTournamentsInfoList.tourns|nm$_tournament.Tournament.getTournamentsInfoList.tourns}
     */
    async getUserTournamentsInfoList(user_id) {
        try {

            var c = this.sObj.db.collection(this.sObj.col.users);
            var user = await c.findOne({user_id: user_id}, {_id: 0});
            if (!user) {
                return [];
            }

            var user_trns = [];

            if (user.tournaments_belong) {
                for (var i = 0; i < user.tournaments_belong.length; i++) {
                    if (user_trns.indexOf(user.tournaments_belong[i]) > -1) {
                        continue;
                    }
                    user_trns.push(user.tournaments_belong[i]);
                }
            }

            if (!user.rel_tourns_update_time) {
                user.rel_tourns_update_time = '1970-01-01';
            }

            var elapse = new Date().getTime() - new Date(user.rel_tourns_update_time).getTime();
            var _24_Hours = 86400000;
            if (elapse >= _24_Hours) {
                user.related_tournaments = await this._relatedTournaments(user);
            }

            if (user.related_tournaments) {
                for (var i = 0; i < user.related_tournaments.length; i++) {
                    if (user_trns.indexOf(user.related_tournaments[i]) > -1) {
                        continue;
                    }
                    user_trns.push(user.related_tournaments[i]);
                }
            }

            if (user.favourite_tournaments) {

                for (var i = 0; i < user.favourite_tournaments.length; i++) {
                    if (user_trns.indexOf(user.favourite_tournaments[i]) > -1) {
                        continue;
                    }
                    user_trns.push(user.favourite_tournaments[i]);
                }
            }

            if (user_trns.length === 0) {
                return await this.randomTournamentsInfoList(this.sObj.MIN_TOURNAMENT_LIST);
            }


            var list = this.getTournamentsInfoList(user_trns);

            if (list.length < this.sObj.MIN_TOURNAMENT_LIST) {
                var size = this.sObj.MIN_TOURNAMENT_LIST - list.length;
                var rand_list = await this.randomTournamentsInfoList(size);
                for (var i = 0; i < rand_list.length; i++) {
                    list.push(rand_list[i]);
                }
            }

            return list;

        } catch (e) {
            console.log(e);//DO NOT DO THIS IN PRODUCTION

            this.error('Could not get user Tournaments info');
            return this;
        }
    }

    /**
     * Search for tournaments whose name begins with the specified
     * input string. The search is case-insensitive
     * 
     * @param {type} str_search - search string
     * @param {type} limit - max record to return
     * @returns {Array|Tournament.searchTournamentsInfoList.tourns|nm$_tournament.Tournament.searchTournamentsInfoList.tourns}
     */
    async searchTournamentsInfoList(str_search, limit) {

        //NOTE: ideally the limit should not be more than 10 in many cases
        //in the client app

        if (limit > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            limit = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        //check if the user is already an official
        var c = this.sObj.db.collection(this.sObj.col.tournaments);

        var tourns = await c.find({name: {$regex: '^' + str_search, $options: 'i'}}, {_id: 0})
                .limit(limit)
                .toArray();

        if (!tourns || !tourns.length) {
            return [];
        }

        return tourns;
    }

    /**
     * Randomly selects the given number of tournament docs 
     * from the tournaments collection
     * 
     * @param {type} size - the number of tournaments to selects
     * @returns {Array|nm$_tournament.Tournament.getRandomTournamentsInfoList.tourns|Tournament.getRandomTournamentsInfoList.tourns}
     */
    async randomTournamentsInfoList(size) {

        if (size > this.sObj.MAX_ALLOW_QUERY_SIZE) {
            size = this.sObj.MAX_ALLOW_QUERY_SIZE;
        }

        var c = this.sObj.db.collection(this.sObj.col.tournaments);
        //NOTE: according to mongodb doc, the sample can return duplicate docs
        //occasionaly. However we do not care about that at this time anyway.
        var tourns = await c.aggregate([{$sample: {size: size}}]).toArray();

        if (!tourns || !tourns.length) {
            return [];
        }

        return tourns;
    }

}

module.exports = Tournament;
