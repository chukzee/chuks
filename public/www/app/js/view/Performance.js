/* global Main, Ns */

Ns.view.Performance = {

    standingsList: [],

    constructor: function () {
        try {
            var list = window.localStorage.clear();//COMMENT OUT LATER
            
            var list = window.localStorage.getItem(Ns.Const.PERFORMANCE_STANDINGS_LIST_KEY);
            list = JSON.parse(list);
            if (Main.util.isArray(list)) {
                Ns.view.Performance.standingsList = list;
            }
        } catch (e) {
            console.warn(e);
        }
    },

    content: function (data) {
        var tournament = data.tournament;
        var season_number = data.season_number;

        /*
         "performance-view-tournament-name"
         "performance-view-back-btn"
         "performance-view-season-number"
         "performance-view-season-date"
         "performance-view-season-previous"
         "performance-view-season-next"
         "performance-view-table-body"
         */

        var season_index = season_number - 1;

        if (season_index === 0) {
            //disable the 'previous' button
            $('#performance-view-season-previous').addClass('game9ja-disabled');
        }

        if (season_index === tournament.seasons.length - 1) {
            //disable the 'next' button
            $('#performance-view-season-next').addClass('game9ja-disabled');
        }

        var current_season = tournament.seasons[season_index];

        document.getElementById("performance-view-tournament-name").innerHTML = tournament.name;

        displaySeason(tournament, current_season);

        $("#performance-view-back-btn").off('click');
        $("#performance-view-back-btn").on('click', function () {
            alert('TODO performance-view-back-btn');
        });

        $("#performance-view-season-previous").off('click');
        $("#performance-view-season-previous").on('click', function () {

            //enable the 'next' button
            if ($('#performance-view-season-next').hasClass('game9ja-disabled')) {
                $('#performance-view-season-next').removeClass('game9ja-disabled');
            }

            if (season_index > 0) {
                season_index--;
                displaySeason(tournament, tournament.seasons[season_index]);

                if (season_index === 0) {
                    //disable the 'previous' button
                    $('#performance-view-season-previous').addClass('game9ja-disabled');
                }
            }
        });

        $("#performance-view-season-next").off('click');
        $("#performance-view-season-next").on('click', function () {

            //enable the 'previous' button
            if ($('#performance-view-season-previous').hasClass('game9ja-disabled')) {
                $('#performance-view-season-previous').removeClass('game9ja-disabled');
            }

            if (season_index < tournament.seasons.length - 1) {
                season_index++;
                displaySeason(tournament, tournament.seasons[season_index]);

                if (season_index === tournament.seasons.length - 1) {
                    //disable the 'next' button 
                    $('#performance-view-season-next').addClass('game9ja-disabled');
                }
            }
        });


        function displaySeason(tournament, season) {

            //enable the 'performance-view-stage-next' button
            if ($('#performance-view-stage-next').hasClass('game9ja-disabled')) {
                $('#performance-view-stage-next').removeClass('game9ja-disabled');
            }

            //enable the 'performance-view-stage-previous' button also
            if ($('#performance-view-stage-previous').hasClass('game9ja-disabled')) {
                $('#performance-view-stage-previous').removeClass('game9ja-disabled');
            }

            document.getElementById("performance-view-season-number").innerHTML = season ? season.sn : '';
            document.getElementById("performance-view-season-date").innerHTML = season.start_time;

            //Display performance table
            var list = Ns.view.Performance.standingsList;
            for (var i = 0; i < list.length; i++) {
                if (list[i].tournament_name === tournament.name
                        && list[i].season_number === season.sn) {
                    showSeasonStandings(tournament, list[i].standings);
                    break;
                }
            }


            Main.ro.tourn.seasonTableStandings(tournament.name, season.sn)
                    .get(function (data) {
                        Ns.view.Performance.save(data);
                        var trn_season = tournament.seasons[season_index];
                        if (trn_season
                                && trn_season.sn === data.season_number
                                && tournament.name === data.tournament_name) {//making sure the result from the asynchronous process in synchronized with the actual season expected to show after the 'next' or 'previous' button is clicked
                            showSeasonStandings(tournament, data.standings);
                        }
                    })
                    .error(function (err) {
                        //alert(err);
                        console.log(err);
                    });
        }

        function showSeasonStandings(tournament, standings) {


            /*
             <tr>
             <td>1</td>
             <td><div><img  onerror="Main.helper.loadDefaultTournamentPhoto(event)" src="../app/images/black_player.jpg" alt=""/></div></td>
             <td>Chuks Alimele Alimele Alimele Alimele</td>
             <td>33</td>
             <td>22</td>
             <td>44</td>
             <td>55</td>
             <td>10000000</td>
             </tr>
             */

            var el = document.getElementById("performance-view-table-body");
            el.innerHTML = '';//clear
            
            for (var i = 0; i < standings.length; i++) {
                var full_name = '...';
                var photo_url = '...';
                var player;
                for (var k = 0; k < tournament.registered_players.length; k++) {
                    player = tournament.registered_players[k];
                    if (player.user_id === standings[i].user_id) {
                        full_name = player.full_name;
                        photo_url = player.photo_url;
                        break;
                    }
                }
                var tr = document.createElement('tr');

                var sn_td = document.createElement('td');
                sn_td.innerHTML = i + 1;
                tr.appendChild(sn_td);

                var photo_div = document.createElement('div');
                var photo_img = document.createElement('img');
                photo_img.src = photo_url;
                photo_img.addEventListener('click', Ns.view.Performance.expandPhoto.bind({user: player}));

                var photo_td = document.createElement('td');

                photo_div.appendChild(photo_img);
                photo_td.appendChild(photo_div);
                tr.appendChild(photo_td);

                var full_name_td = document.createElement('td');
                full_name_td.innerHTML = full_name;
                tr.appendChild(full_name_td);

                var PL_td = document.createElement('td');
                PL_td.innerHTML = standings[i].total_played;
                tr.appendChild(PL_td);

                var W_td = document.createElement('td');
                W_td.innerHTML = standings[i].total_wins;
                tr.appendChild(W_td);

                var D_td = document.createElement('td');
                D_td.innerHTML = standings[i].total_draws;
                tr.appendChild(D_td);

                var L_td = document.createElement('td');
                L_td.innerHTML = standings[i].total_losses;
                tr.appendChild(L_td);

                var Pts_td = document.createElement('td');
                Pts_td.innerHTML = standings[i].total_points;
                tr.appendChild(Pts_td);

                el.appendChild(tr);
            }


        }
    },

    expandPhoto: function () {
        var user = this.user;
        Ns.ui.UI.expandPhoto(user, 'user');
    },

    save: function (obj) {

        if (Ns.view.Performance.standingsList.length > Ns.Const.MAX_LIST_SIZE) {
            var excess = Ns.view.Performance.standingsList.length - Ns.Const.MAX_LIST_SIZE;
            Ns.view.Performance.standingsList.splice(0, excess); //cut off the excess from the top
        }

        var found = false;
        var standings = Ns.view.Performance.standingsList;
        for (var i = 0; i < standings.length; i++) {
            if (standings[i].tournament_name === obj.tournament_name
                    && standings[i].season_number === obj.season_number) {
                standings[i] = obj;//already exist so replace
                found = true;
                break;
            }
        }

        if (!found) {
            Ns.view.Performance.standingsList.push(obj);
        }
        var list = Ns.view.Performance.standingsList;

        if (Main.util.isArray(list)) {
            window.localStorage.setItem(Ns.Const.PERFORMANCE_STANDINGS_LIST_KEY, JSON.stringify(list));
        }

    }

    //more goes below
};