/* global Main, Ns, localforage */

Ns.view.Rankings = {

    rankingsList: [],

    constructor: function () {
         
            localforage.getItem(Ns.Const.RANKINGS_LIST_KEY, function (err, list) {
            if (err) {
                console.log(err);
            }
            if (Main.util.isArray(list)) {
                Ns.view.Rankings.rankingsList = list;
            }
        });
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
                   <div  class="game9ja-rankings-body-row">
                        <div>1</div>
                        <div><img  onerror="Main.helper.loadDefaultTournamentPhoto(event)" src="../app/images/black_player.jpg" alt=""/></div>
                        <div>Chuks Alimele Dadadadada</div>
                        <div>*****</div>
                        <div>3400000</div>
                        <div>12000000</div>
                    </div>
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
                        photo_url = player.small_photo_url;
                        break;
                    }
                }
                var rowDiv = document.createElement('div');

                var sn_div = document.createElement('div');
                sn_div.innerHTML = i + 1;
                rowDiv.appendChild(sn_div);

                var photo_img = document.createElement('img');
                photo_img.src = photo_url;
                photo_img.addEventListener('click', Ns.view.Rankings.expandPhoto.bind({user: player}));

                var photo_div = document.createElement('div');

                photo_div.appendChild(photo_img);
                rowDiv.appendChild(photo_div);

                var full_name_div = document.createElement('div');
                full_name_div.innerHTML = full_name;
                rowDiv.appendChild(full_name_div);

                var Rating_div = document.createElement('div');
                //Rating_div.innerHTML = standings[i].total_wins;//come back
                rowDiv.appendChild(Rating_div);

                var PL_div = document.createElement('div');
                //PL_div.innerHTML = standings[i].total_played;//come back
                rowDiv.appendChild(PL_div);

                var Pts_div = document.createElement('div');
                //Pts_div.innerHTML = standings[i].total_points;//come back
                rowDiv.appendChild(Pts_div);

                el.appendChild(rowDiv);
            }


        }
    },

    expandPhoto: function () {
        var user = this.user;
        Ns.ui.Photo.show(user);
    },

    save: function (obj) {

        var list = Ns.view.Rankings.rankingsList;

        if (Main.util.isArray(list)) {
            localforage.setItem(Ns.Const.RANKINGS_LIST_KEY,  list, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }

    }

    //more goes below
};