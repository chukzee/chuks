/* global Main, Ns */

Ns.view.Rankings = {

    rankingsList: [],

    constructor: function () {
        try {
            var list = window.localStorage.clear();//COMMENT OUT LATER
            
            var list = window.localStorage.getItem(Ns.Const.RANKINGS_LIST_KEY);
            list = JSON.parse(list);
            if (Main.util.isArray(list)) {
                Ns.view.Rankings.rankingsList = list;
            }
        } catch (e) {
            console.warn(e);
        }
    },

    content: function (data) {
        var game_name = data.game_name;

        /*
         "rankings-game-name"
         "rankings-back-btn"
         "rankings-search"
         "rankings-range"
         "rankings-page-previous"
         "rankings-page-next"
         "rankings-table-body"
         */

        var season_index = season_number - 1;

        if (season_index === 0) {
            //disable the 'previous' button
            $('#rankings-season-previous').addClass('game9ja-disabled');
        }

        if (season_index === tournament.seasons.length - 1) {
            //disable the 'next' button
            $('#rankings-season-next').addClass('game9ja-disabled');
        }

        var current_season = tournament.seasons[season_index];

        document.getElementById("rankings-tournament-name").innerHTML = tournament.name;

        displayRankings(tournament, current_season);

        $("#rankings-back-btn").off('click');
        $("#rankings-back-btn").on('click', function () {
            alert('TODO rankings-back-btn');
        });

        $("#rankings-season-previous").off('click');
        $("#rankings-season-previous").on('click', function () {

            //enable the 'next' button
            if ($('#rankings-season-next').hasClass('game9ja-disabled')) {
                $('#rankings-season-next').removeClass('game9ja-disabled');
            }

            if (season_index > 0) {
                season_index--;
                displayRankings(tournament, tournament.seasons[season_index]);

                if (season_index === 0) {
                    //disable the 'previous' button
                    $('#rankings-season-previous').addClass('game9ja-disabled');
                }
            }
        });

        $("#rankings-season-next").off('click');
        $("#rankings-season-next").on('click', function () {

            //enable the 'previous' button
            if ($('#rankings-season-previous').hasClass('game9ja-disabled')) {
                $('#rankings-season-previous').removeClass('game9ja-disabled');
            }

            if (season_index < tournament.seasons.length - 1) {
                season_index++;
                displayRankings(tournament, tournament.seasons[season_index]);

                if (season_index === tournament.seasons.length - 1) {
                    //disable the 'next' button 
                    $('#rankings-season-next').addClass('game9ja-disabled');
                }
            }
        });


        function displayRankings(tournament, season) {

            //enable the 'rankings-page-next' button
            if ($('#rankings-page-next').hasClass('game9ja-disabled')) {
                $('#rankings-page-next').removeClass('game9ja-disabled');
            }

            //enable the 'rankings-page-previous' button also
            if ($('#rankings-page-previous').hasClass('game9ja-disabled')) {
                $('#rankings-page-previous').removeClass('game9ja-disabled');
            }

            document.getElementById("rankings-range").innerHTML = season ? season.sn : '';

            //Display rankings table
            var list = Ns.view.Rankings.rankingsList;
            for (var i = 0; i < list.length; i++) {
                if (list[i].tournament_name === tournament.name
                        && list[i].season_number === season.sn) {
                    showRankings(tournament, list[i].standings);
                    break;
                }
            }


            Main.ro.rank.seasonTableStandings(tournament.name, season.sn)
                    .get(function (data) {
                        Ns.view.Rankings.save(data);
                        var trn_season = tournament.seasons[season_index];
                        if (trn_season
                                && trn_season.sn === data.season_number
                                && tournament.name === data.tournament_name) {//making sure the result from the asynchronous process in synchronized with the actual season expected to show after the 'next' or 'previous' button is clicked
                            showRankings(tournament, data.standings);
                        }
                    })
                    .error(function (err) {
                        //alert(err);
                        console.log(err);
                    });
        }

        function showRankings(tournament, standings) {


            /*
             <tr>
             <td>1</td>
             <td><div><img  onerror="Main.helper.loadDefaultTournamentPhoto(event)" src="../app/images/black_player.jpg" alt=""/></div></td>
             <td>Chuks Alimele Alimele Alimele Alimele</td>
             <td>Rating</td>
             <td>10000000</td>
             </tr>
             */

            var el = document.getElementById("rankings-table-body");
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
                photo_img.addEventListener('click', Ns.view.Rankings.expandPhoto.bind({user: player}));

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

        var list = Ns.view.Rankings.rankingsList;

        if (Main.util.isArray(list)) {
            window.localStorage.setItem(Ns.Const.RANKINGS_LIST_KEY, JSON.stringify(list));
        }

    }

    //more goes below
};