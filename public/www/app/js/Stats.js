
/* global Ns, Main */

Ns.Stats = {
    content: function (match, id_obj) {

        var html = 'game-stats-specific-tpl.html';
        var user_id = Ns.view.UserProfile.appUser.user_id;

        if (match.players[0].user_id === user_id || match.players[1].user_id) {
            html = 'game-stats-tpl.html';
        }

        Main.tpl.template({
            tplUrl: html,
            data: match,
            onReplace: function (tpl_var, match) {

                if (tpl_var === 'specific_name') {
                    if(match.tournament_name){
                        return match.tournament_name;
                    }else if(match.group_name){
                        return match.group_name;
                    }else{
                        return 'Contact';
                    }
                }
                
                var wdl = match.wdl;
                //white
                if (tpl_var === 'specific_white_wins') {
                    return wdl.white.specific.wins;
                }
                if (tpl_var === 'specific_white_draws') {
                    return wdl.white.specific.draws;
                }
                if (tpl_var === 'specific_white_losses') {
                    return wdl.white.specific.losses;
                }
                if (tpl_var === 'overall_white_wins') {
                    return wdl.white.overall.wins;
                }
                if (tpl_var === 'overall_white_draws') {
                    return wdl.white.overall.draws;
                }
                if (tpl_var === 'overall_white_losses') {
                    return wdl.white.overall.losses;
                }

                //black
                if (tpl_var === 'specific_black_wins') {
                    return wdl.black.specific.wins;
                }
                if (tpl_var === 'specific_black_draws') {
                    return wdl.black.specific.draws;
                }
                if (tpl_var === 'specific_black_losses') {
                    return wdl.black.specific.losses;
                }
                if (tpl_var === 'overall_black_wins') {
                    return wdl.black.overall.wins;
                }
                if (tpl_var === 'overall_black_draws') {
                    return wdl.black.overall.draws;
                }
                if (tpl_var === 'overall_black_losses') {
                    return wdl.black.overall.losses;
                }


            },
            afterReplace: function (el, data) {
                document.getElementById(id_obj.view_body_id).innerHTML = el.outerHTML;
                
            }
        });
    }
};


