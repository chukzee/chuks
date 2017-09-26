
"use strict";

var WebApplication = require('../web-application');


class Stats extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Get head to head of two players in all competition
     * 
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @param {type} is_include_abandoned_matches - whether to include abandoned matches
     * in the search. The default is false
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async hToh(player_1_id, player_2_id, is_include_abandoned_matches, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            player_1_id = arguments[0].player_1_id;
            player_2_id = arguments[0].player_2_id;
            is_include_abandoned_matches = arguments[0].is_include_abandoned_matches;
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

        var c = this.sObj.db.collection(this.sObj.col.match_history);

        /*var query = {$and:[
         {game_status :'finish'},
         {$or:[{'players.0.user_id': player_1_id},{'players.0.user_id': player_2_id}]},
         {$or:[{'players.1.user_id': player_1_id},{'players.1.user_id': player_2_id}]}
         ]};*/

        var query = {$and: [
         {game_status: 'finish'},
         {$or: [{'players.0.user_id': player_1_id, 'players.1.user_id': player_2_id}
         , {'players.0.user_id': player_2_id, 'players.1.user_id': player_1_id}]}
         ]};

        /*var query = {$and: [
         {game_status: 'finish'},
         {'players.0.user_id': player_1_id, 'players.1.user_id': player_2_id}
         ]}; */

        /*var query = {$and: [
                {game_status: 'finish'},
                {'players.0.user_id': player_1_id},
                {'players.1.user_id': player_2_id}
            ]};*/

        if (is_include_abandoned_matches === true) {
            query.game_status = 'abandon';
        }

        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;

    }

    /**
     * Get head to head of two players of games played via contact
     * 
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @param {type} is_include_abandoned_matches - whether to include abandoned matches
     * in the search. The default is false
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async hTohContact(player_1_id, player_2_id, is_include_abandoned_matches, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            player_1_id = arguments[0].player_1_id;
            player_2_id = arguments[0].player_2_id;
            is_include_abandoned_matches = arguments[0].is_include_abandoned_matches;
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

        var c = this.sObj.db.collection(this.sObj.col.match_history);

        var query = {$and: [
                {game_status: 'finish'},
                {group_name: ''},
                {tournament_name: ''},
                {$or: [{'players.0.user_id': player_1_id}, {'players.0.user_id': player_2_id}]},
                {$or: [{'players.1.user_id': player_1_id}, {'players.1.user_id': player_2_id}]}
            ]};


        if (is_include_abandoned_matches === true) {
            query.game_status = 'abandon';
        }


        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;

    }

    /**
     * Get head to head of two players in the specified group
     * 
     * @param {type} group_name
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @param {type} is_include_abandoned_matches - whether to include abandoned matches
     * in the search. The default is false
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async hTohGroup(group_name, player_1_id, player_2_id, is_include_abandoned_matches, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            group_name = arguments[0].group_name;
            player_1_id = arguments[0].player_1_id;
            player_2_id = arguments[0].player_2_id;
            is_include_abandoned_matches = arguments[0].is_include_abandoned_matches;
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

        var c = this.sObj.db.collection(this.sObj.col.match_history);

        var query = {$and: [
                {game_status: 'finish'},
                {group_name: group_name},
                {$or: [{'players.0.user_id': player_1_id}, {'players.0.user_id': player_2_id}]},
                {$or: [{'players.1.user_id': player_1_id}, {'players.1.user_id': player_2_id}]}
            ]};

        if (is_include_abandoned_matches === true) {
            query.game_status = 'abandon';
        }


        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;

    }

    /**
     * Get head to head of two players in the specified tournament
     * 
     * @param {type} tournament_name
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @param {type} is_include_abandoned_matches - whether to include abandoned matches
     * in the search. The default is false
     * @param {type} skip
     * @param {type} limit
     * @returns {undefined}
     */
    async hTohTournament(tournament_name, player_1_id, player_2_id, is_include_abandoned_matches, skip, limit) {

        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            tournament_name = arguments[0].tournament_name;
            player_1_id = arguments[0].player_1_id;
            player_2_id = arguments[0].player_2_id;
            is_include_abandoned_matches = arguments[0].is_include_abandoned_matches;
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

        var c = this.sObj.db.collection(this.sObj.col.match_history);

        var query = {$and: [
                {game_status: 'finish'},
                {tournament_name: tournament_name},
                {$or: [{'players.0.user_id': player_1_id}, {'players.0.user_id': player_2_id}]},
                {$or: [{'players.1.user_id': player_1_id}, {'players.1.user_id': player_2_id}]}
            ]};

        if (is_include_abandoned_matches === true) {
            query.game_status = 'abandon';
        }


        var total = await c.count(query);

        var data = {
            skip: skip,
            limit: limit,
            total: total,
            matches: []
        };

        if (!total) {
            return data;
        }


        data.matches = await c.find(query, {_id: 0})
                .limit(limit)
                .skip(skip)
                .toArray();

        return data;

    }

}



module.exports = Stats;
