
/* global Main, Ns */

Ns.Spectators = {

    currentWatchGameId: null,
    gamesSpecators: {},

    constructor: function () {


        var obj = {
            spectator: 'game/Spectator'
        };

        Main.rcall.live(obj);

    },

    content: function (container, match) {
        
        if (!Ns.Spectators.gamesSpecators[match.game_id]) {
            Ns.Spectators.gamesSpecators[match.game_id] = [];
        }

        Main.listview.create({
            container: container,
            scrollContainer: container,
            tplUrl: 'simple-list-c-tpl',
            wrapItem: false,
            data: Ns.Spectators.gamesSpecators[match.game_id],
            //itemClass: "game9ja-live-games-list",
            onSelect: function (evt, spectator) {


            },
            onRender: function (tpl_var, data) {

                if (tpl_var === 'data_a') {
                    return data.photo_url;
                }

                if (tpl_var === 'data_b') {
                    return data.full_name;
                }

                if (tpl_var === 'data_c') {
                    return Ns.Util.formatTime(data.joined_time);
                }

            },
            onReady: function () {

                var list = this;

                Main.ro.spectator.get(match.game_id)
                        .get(function (data) {
                            var spectators = data.spectators;

                            var gm_spects = Ns.Spectators.gamesSpecators[match.game_id];
                            var new_spects = [];//new spectators
                            for (var i = 0; i < spectators.length; i++) {

                                var index = gm_spects.findIndex(function (spect) {
                                    return spect.user_id === spectators[i].user_id;
                                });

                                if (index === -1) {
                                    new_spects.push(spectators[i]);
                                    gm_spects.push(spectators[i]);
                                }
                            }
                            
                            for (var i = 0; i < new_spects.length; i++) {
                                list.prependItem(new_spects[i]);                                
                            }                           

                        })
                        .error(function (err, err_code, connect_err) {

                        });



            }
        });


    }
}