

/* global Main */

var homeObj = {
    match: 'game/MatchLive',
    //more may go below
};

Main.rcall.live(homeObj);


Main.controller.GameHome = {

    GAME_VIEW_HTML: 'game-view-sd.html',
    GAME_WATCH_HTML: 'game-watch-sd.html',
    
    contactsMatchKey: function () {
        return Main.controller.auth.appUser.id + ":" + "CONTACTS_MATCH_KEY";
    },
    groupMatchKey: function (group_name) {
        return Main.controller.auth.appUser.id + ":" + "GROUP_MATCH_KEY_PREFIX" + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Main.controller.auth.appUser.id + ":" + "TOURNAMENT_MATCH_KEY_PREFIX" + ":" + tournament;
    },
    Content: function (data) {
        Main.controller.UI.init(data);
    },
    showGameView : function(match_data){
        Main.page.show({
                        url: Main.controller.GameHome.GAME_VIEW_HTML,
                        effect: "slideleft",
                        duration: 500,
                        onBeforeShow: Main.controller.GameView.Content,
                        data: match_data});
    },
    showGameWatch : function(match_data){
         Main.page.show({
                        url: Main.controller.GameHome.GAME_WATCH_HTML,
                        effect: "slideleft",
                        duration: 500,
                        onBeforeShow: Main.controller.GameWatch.Content,
                        data: match_data});
    }
};