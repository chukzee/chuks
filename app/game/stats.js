
"use strict";

var WebApplication = require('../web-application');


class Stats extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }
	
	async getWDL(player_1_id, player_2_id, category){
		//where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            player_1_id = arguments[0].player_1_id;
            player_2_id = arguments[0].player_2_id;
            category = arguments[0].category;			
        }
		
		var c = this.sObj.db.collection(this.sObj.col.wdl);
		
		try {
            var queryObj = {$or: [
                    {'first.player_id': player_1_id, 'second.player_id': player_2_id},
                    {'first.player_id': player_2_id, 'second.player_id': player_1_id}
                ]};

            var wdl = await c.findOne(queryObj);
			
			var obj = {
				
				first:{
					player_id : player_1_id
					specific :{
						notation:'W 0 D 0 L 0',
						wins:0,
						draws:0,
						losses: 0
					},
					overall:{
						notation:'W 0 D 0 L 0',
						wins:0,
						draws:0,
						losses: 0
					}
				},
				second:{
					player_id : player_2_id	
					specific :{
						notation:'W 0 D 0 L 0',
						wins:0,
						draws:0,
						losses: 0
					},
					overall:{
						notation:'W 0 D 0 L 0',
						wins:0,
						draws:0,
						losses: 0
					}
				}
			}

            if (!wdl) {
				return obj;
			}
			
			//Specific
			
			//first player
			obj.first.player_id = wdl.first.player_id;
			obj.first.specific.wins = wdl.first.wins;
			obj.first.specific.draws = wdl.first.draws;
			obj.first.specific.losses = wdl.first.losses;
			obj.first.specific.notation = `W ${wdl.first.wins} D ${wdl.first.draws} L ${wdl.first.losses}`;
			
			//second player
			obj.second.player_id = wdl.second.player_id;
			obj.second.specific.wins = wdl.second.wins;
			obj.second.specific.draws = wdl.second.draws;
			obj.second.specific.losses = wdl.second.losses;
			obj.second.specific.notation = `W ${wdl.second.wins} D ${wdl.second.draws} L ${wdl.second.losses}`;
			
			//overall
			//TODO
			
			//first player
			obj.first.overall.wins = wdl.first.contact.wins;
			obj.first.overall.draws = wdl.first.contact.draws;
			obj.first.overall.losses = wdl.first.contact.losses;
			
			for(var i=0; i<wdl.first.groups.length; i++){
				obj.first.overall.wins += wdl.first.groups[i].wins;
				obj.first.overall.draws += wdl.first.groups[i].draws;
				obj.first.overall.losses += wdl.first.groups[i].losses;
				
			}
			
			for(var i=0; i<wdl.first.tournaments.length; i++){
				obj.first.overall.wins += wdl.first.tournaments[i].wins;
				obj.first.overall.draws += wdl.first.tournaments[i].draws;
				obj.first.overall.losses += wdl.first.tournaments[i].losses;
			}
			
			obj.first.overall.notation = `W ${obj.first.overall.wins} D ${obj.first.overall.draws} L ${obj.first.overall.losses}`;
			
			//second player
			obj.second.overall.wins = wdl.second.contact.wins;
			obj.second.overall.draws = wdl.second.contact.draws;
			obj.second.overall.losses = wdl.second.contact.losses;
			
			for(var i=0; i<wdl.second.groups.length; i++){
				obj.second.overall.wins += wdl.second.groups[i].wins;
				obj.second.overall.draws += wdl.second.groups[i].draws;
				obj.second.overall.losses += wdl.second.groups[i].losses;
				
			}
			
			for(var i=0; i<wdl.second.tournaments.length; i++){
				obj.second.overall.wins += wdl.second.tournaments[i].wins;
				obj.second.overall.draws += wdl.second.tournaments[i].draws;
				obj.second.overall.losses += wdl.second.tournaments[i].losses;
			}
			
			obj.second.overall.notation = `W ${obj.second.overall.wins} D ${obj.second.overall.draws} L ${obj.second.overall.losses}`;
			
			
			
			
		} catch (e) {
            console.log(e);//DO NOT DO THIS IS PRODUCTION
            return;//return nothing
        }
	
		return obj;
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

        var query = {$and: [
                {game_status: 'finish'},
                {$or: [{'players.0.user_id': player_1_id, 'players.1.user_id': player_2_id},
                        {'players.0.user_id': player_2_id, 'players.1.user_id': player_1_id}]}
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
                {$or: [{'players.0.user_id': player_1_id, 'players.1.user_id': player_2_id},
                        {'players.0.user_id': player_2_id, 'players.1.user_id': player_1_id}]}
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
                {$or: [{'players.0.user_id': player_1_id, 'players.1.user_id': player_2_id},
                        {'players.0.user_id': player_2_id, 'players.1.user_id': player_1_id}]}
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
                {$or: [{'players.0.user_id': player_1_id, 'players.1.user_id': player_2_id},
                        {'players.0.user_id': player_2_id, 'players.1.user_id': player_1_id}]}
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
