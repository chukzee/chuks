
"use strict";

var WebApplication = require('../web-application');


class Stats extends   WebApplication {

    constructor(sObj, util, evt) {
        super(sObj, util, evt);
    }

    /**
     * Note this method is also used internally in this server
     * 
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @returns {nm$_stats.Stats._getWDL.wdlObj|undefined|nm$_stats.Stats._getWDL.obj}
     */
    async getContactWDL(player_1_id, player_2_id) {
        return this._getWDL(player_1_id, player_2_id, 'contact');
    }

    /**
     * Note this method is also used internally in this server
     * 
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @param {type} group_name
     * @returns {nm$_stats.Stats._getWDL.wdlObj|undefined|nm$_stats.Stats._getWDL.obj}
     */
    async getGroupWDL(player_1_id, player_2_id, group_name) {
        return this._getWDL(player_1_id, player_2_id, 'group', group_name);
    }

    /**
     * Note this method is also used internally in this server
     * 
     * @param {type} player_1_id
     * @param {type} player_2_id
     * @param {type} tournament_name
     * @returns {nm$_stats.Stats._getWDL.wdlObj|undefined|nm$_stats.Stats._getWDL.obj}
     */
    async getTournamentWDL(player_1_id, player_2_id, tournament_name) {
        return this._getWDL(player_1_id, player_2_id, 'tournament', tournament_name);
    }

    async _getWDL(player_1_id, player_2_id, category, name) {
        //where one object is passed a paramenter then get the needed
        //properties from the object
        if (arguments.length === 1) {
            player_1_id = arguments[0].player_1_id;
            player_2_id = arguments[0].player_2_id;
            category = arguments[0].category;
            name = arguments[0].name;
        }

        var c = this.sObj.db.collection(this.sObj.col.wdl);

        try {
            var queryObj = {$or: [
                    {'white.player_id': player_1_id, 'black.player_id': player_2_id},
                    {'white.player_id': player_2_id, 'black.player_id': player_1_id}
                ]};

            var wdl = await c.findOne(queryObj);

            var obj = {//default

                white: {//white
                    player_id: player_1_id,
                    specific: {
                        wdl: 'W 0 D 0 L 0',
                        wins: 0,
                        draws: 0,
                        losses: 0
                    },
                    overall: {
                        wdl: 'W 0 D 0 L 0',
                        wins: 0,
                        draws: 0,
                        losses: 0
                    }
                },
                black: {//black
                    player_id: player_2_id,
                    specific: {
                        wdl: 'W 0 D 0 L 0',
                        wins: 0,
                        draws: 0,
                        losses: 0
                    },
                    overall: {
                        wdl: 'W 0 D 0 L 0',
                        wins: 0,
                        draws: 0,
                        losses: 0
                    }
                }
            };

            if (!wdl) {
                return obj;
            }


            obj.white.player_id = wdl.white.player_id;
            obj.black.player_id = wdl.black.player_id;

            if (category === 'contact') {//specific
                //white player
                obj.white.specific.wins = wdl.white.contact.wins;
                obj.white.specific.draws = wdl.white.contact.draws;
                obj.white.specific.losses = wdl.white.contact.losses;
                obj.white.specific.wdl = `W ${wdl.white.contact.wins} D ${wdl.white.contact.draws} L ${wdl.white.contact.losses}`;

                //black player
                obj.black.specific.wins = wdl.black.contact.wins;
                obj.black.specific.draws = wdl.black.contact.draws;
                obj.black.specific.losses = wdl.black.contact.losses;
                obj.black.specific.wdl = `W ${wdl.black.contact.wins} D ${wdl.black.contact.draws} L ${wdl.black.contact.losses}`;
            }


            //white player
            obj.white.overall.wins = wdl.white.contact.wins;
            obj.white.overall.draws = wdl.white.contact.draws;
            obj.white.overall.losses = wdl.white.contact.losses;

            for (var i = 0; i < wdl.white.groups.length; i++) {
                obj.white.overall.wins += wdl.white.groups[i].wins;
                obj.white.overall.draws += wdl.white.groups[i].draws;
                obj.white.overall.losses += wdl.white.groups[i].losses;

                if (category === 'group' && name === wdl.white.groups[i].name) {//specific
                    obj.white.specific.wins = wdl.white.groups[i].wins;
                    obj.white.specific.draws = wdl.white.groups[i].draws;
                    obj.white.specific.losses = wdl.white.groups[i].losses;
                    obj.white.specific.wdl = `W ${wdl.white.groups[i].wins} D ${wdl.white.groups[i].draws} L ${wdl.white.groups[i].losses}`;
                }
            }

            for (var i = 0; i < wdl.white.tournaments.length; i++) {
                obj.white.overall.wins += wdl.white.tournaments[i].wins;
                obj.white.overall.draws += wdl.white.tournaments[i].draws;
                obj.white.overall.losses += wdl.white.tournaments[i].losses;

                if (category === 'tournament' && name === wdl.white.tournaments[i].name) {//specific
                    obj.white.specific.wins = wdl.white.tournaments[i].wins;
                    obj.white.specific.draws = wdl.white.tournaments[i].draws;
                    obj.white.specific.losses = wdl.white.tournaments[i].losses;
                    obj.white.specific.wdl = `W ${wdl.white.tournaments[i].wins} D ${wdl.white.tournaments[i].draws} L ${wdl.white.tournaments[i].losses}`;
                }
            }

            obj.white.overall.wdl = `W ${obj.white.overall.wins} D ${obj.white.overall.draws} L ${obj.white.overall.losses}`;

            //black player
            obj.black.overall.wins = wdl.black.contact.wins;
            obj.black.overall.draws = wdl.black.contact.draws;
            obj.black.overall.losses = wdl.black.contact.losses;

            for (var i = 0; i < wdl.black.groups.length; i++) {
                obj.black.overall.wins += wdl.black.groups[i].wins;
                obj.black.overall.draws += wdl.black.groups[i].draws;
                obj.black.overall.losses += wdl.black.groups[i].losses;

                if (category === 'group' && name === wdl.black.groups[i].name) {//specific
                    obj.black.specific.wins = wdl.black.groups[i].wins;
                    obj.black.specific.draws = wdl.black.groups[i].draws;
                    obj.black.specific.losses = wdl.black.groups[i].losses;
                    obj.black.specific.wdl = `W ${wdl.black.groups[i].wins} D ${wdl.black.groups[i].draws} L ${wdl.black.groups[i].losses}`;
                }
            }

            for (var i = 0; i < wdl.black.tournaments.length; i++) {
                obj.black.overall.wins += wdl.black.tournaments[i].wins;
                obj.black.overall.draws += wdl.black.tournaments[i].draws;
                obj.black.overall.losses += wdl.black.tournaments[i].losses;

                if (category === 'tournament' && name === wdl.black.tournaments[i].name) {//specific
                    obj.black.specific.wins = wdl.black.tournaments[i].wins;
                    obj.black.specific.draws = wdl.black.tournaments[i].draws;
                    obj.black.specific.losses = wdl.black.tournaments[i].losses;
                    obj.black.specific.wdl = `W ${wdl.black.tournaments[i].wins} D ${wdl.black.tournaments[i].draws} L ${wdl.black.tournaments[i].losses}`;
                }
            }

            obj.black.overall.wdl = `W ${obj.black.overall.wins} D ${obj.black.overall.draws} L ${obj.black.overall.losses}`;

            //we want to return the result in the order the player ids were passed to this method
            var wdlObj = {};

            if (obj.white.player_id === player_1_id) {//same order so return as it is
                wdlObj.white = obj.white;
                wdlObj.black = obj.black;
            } else {//opposite order so swap to reflect 
                //the order the player ids were passed to this method
                wdlObj.white = obj.black;
                wdlObj.black = obj.white;
            }


        } catch (e) {
            console.log(e);//DO NOT DO THIS IS PRODUCTION
            return;//return nothing
        }

        return wdlObj;
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
