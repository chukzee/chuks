
/* global Main, Ns */

Ns.Spectators = {

    currentWatchGameId: null,
    gamesSpecators: {},
    refIndex: 0,

    constructor: function () {


        var obj = {
            spectator: 'game/Spectator'
        };

        Main.rcall.live(obj);

    },

    content: function (match, id_obj) {

        if (!Ns.Spectators.gamesSpecators[match.game_id]) {
            Ns.Spectators.gamesSpecators[match.game_id] = [];
        }

        Main.listview.create({
            container: '#' + id_obj.view_body_id,
            scrollContainer: '#' + id_obj.view_body_id,
            tplUrl: 'simple-list-c-tpl.html',
            wrapItem: false,
            data: Ns.Spectators.gamesSpecators[match.game_id],
            //itemClass: "game9ja-live-games-list",
            onSelect: function (evt, spectator) {


            },
            onRender: function (tpl_var, data) {

                if (tpl_var === 'data_a') {
                    return data.small_photo_url;
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

                var ref_index = ++Ns.Spectators.refIndex;

                Main.ro.spectator.get(match.game_id)
                        .get(function (data) {
                            if (ref_index !== Ns.Spectators.refIndex) {//ensuring the asynchronous operation does not corrupt the view
                                return;
                            }
                            var spectators = data.spectators;

                            var gm_spects = Ns.Spectators.gamesSpecators[match.game_id];
                            for (var i = 0; i < spectators.length; i++) {

                                var index = gm_spects.findIndex(function (spect) {
                                    return spect.user_id === spectators[i].user_id;
                                });

                                if (index === -1) {
                                    gm_spects.push(spectators[i]);
                                }
                            }

                            for (var i = 0; i < gm_spects.length; i++) {
                                list.prependItem(gm_spects[i]);
                            }

                        })
                        .error(function (err, err_code, connect_err) {

                        });



            }
        });


    }
}