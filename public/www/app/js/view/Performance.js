
Ns.view.Performance = {

    constructor: function () {


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

        var current_season = tournament.seasons[season_index];

        document.getElementById("performance-view-tournament-name").innerHTML = tournament.name;

        displaySeason(current_season);

        $("#performance-view-back-btn").on('click', function () {
            alert('TODO performance-view-back-btn');
        });

        $("#performance-view-season-previous").on('click', function () {

            //enable the 'next' button
            if ($('#performance-view-season-next').hasClass('game9ja-disabled')) {
                $('#performance-view-season-next').removeClass('game9ja-disabled');
            }

            if (season_index > 0) {
                season_index--;
                displaySeason(tournament.seasons[season_index]);

                if (season_index === 0) {
                    //disable the 'previous' button
                    $('#performance-view-season-previous').addClass('game9ja-disabled');
                }
            }
        });

        $("#performance-view-season-next").on('click', function () {

            //enable the 'previous' button
            if ($('#performance-view-season-previous').hasClass('game9ja-disabled')) {
                $('#performance-view-season-previous').removeClass('game9ja-disabled');
            }

            if (season_index < tournament.seasons.length - 1) {
                season_index++;
                displaySeason(tournament.seasons[season_index]);

                if (season_index === tournament.seasons.length - 1) {
                    //disable the 'next' button 
                    $('#performance-view-season-next').addClass('game9ja-disabled');
                }
            }
        });


        function displaySeason(season) {

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
            

        }
    },

    //more goes below
};