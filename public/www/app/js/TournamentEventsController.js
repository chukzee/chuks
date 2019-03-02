
/* global Ns, Main */

Ns.TournamentEventsController = {

    constructor: function () {

        Main.eventio.on('season_start', this.onSeasonStart.bind(this));
        Main.eventio.on('season_cancel', this.onSeasonCancel.bind(this));
        Main.eventio.on('season_delete', this.onSeasonDelete.bind(this));
        Main.eventio.on('season_end', this.onSeasonEnd.bind(this));
        Main.eventio.on('tournament_edited', this.onTournamentEdited.bind(this));
        Main.eventio.on('tournament_official_added', this.onTournamentOfficialAdded.bind(this));
        Main.eventio.on('tournament_official_removed', this.onTournamentOfficialRemoved.bind(this));
        Main.eventio.on('tournament_player_registered', this.onTournamentPlayerRegistered.bind(this));
        Main.eventio.on('tournament_bulk_players_registered', this.onTournamentBulkPlayersRegistered.bind(this));
        Main.eventio.on('tournament_registered_player_removed', this.onTournamentRegisteredPlayerRemoved.bind(this));


    },

    onSeasonStart: function (obj) {
        console.log(obj);

        var tournament = obj.data.tournament;
        var season_number  = obj.data.season_number; //TODO
        var start_time = obj.data.start_time;//TODO
        
        Ns.view.Tournament.save(tournament);
    },

    onSeasonCancel: function (obj) {
        console.log(obj);

        var tournament = obj.data.tournament;
        var official_id = obj.data.official_id;//TODO
        var season_number  = obj.data.season_number; //TODO
        var reason  = obj.data.reason; //TODO
        
        Ns.view.Tournament.save(tournament);
    },

    onSeasonDelete: function (obj) {
        console.log(obj);
        
        var tournament = obj.data.tournament;
        var official_id = obj.data.official_id;//TODO
        var season_number  = obj.data.season_number; //TODO
        var reason  = obj.data.reason; //TODO
        
        Ns.view.Tournament.save(tournament);
    },

    onSeasonEnd: function (obj) {
        console.log(obj);
        
        var tournament = obj.data.tournament;
        var season_number  = obj.data.season_number; //TODO
        var end_time  = obj.data.end_time; //TODO
        
        Ns.view.Tournament.save(tournament);
    },

    onTournamentEdited: function (obj) {

        console.log(obj);
        
        var tournament = obj.data;
        Ns.view.Tournament.save(tournament);
    },

    onTournamentOfficialAdded: function (obj) {
        console.log(obj);
        
        var tournament = obj.data;
        Ns.view.Tournament.save(tournament);
    },

    onTournamentOfficialRemoved: function (obj) {
        console.log(obj);
        
        var tournament = obj.data;
        Ns.view.Tournament.save(tournament);
    },

    onTournamentPlayerRegistered: function (obj) {
        console.log(obj);
        
        var tournament = obj.data;
        Ns.view.Tournament.save(tournament);
    },

    onTournamentBulkPlayersRegistered: function (obj) {
        console.log(obj);
        
        var tournament = obj.data;
        Ns.view.Tournament.save(tournament);
    },

    onTournamentRegisteredPlayerRemoved: function (obj) {
        console.log(obj);
        
        var tournament = obj.data;
        Ns.view.Tournament.save(tournament);
    }

};