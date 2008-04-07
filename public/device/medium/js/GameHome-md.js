

/* global Main */

var homeObj = {
    match: 'game/MatchLive',
    //more may go below
};

Main.rcall.live(homeObj);


Main.controller.GameHome = {
    
    GAME_VIEW_HTML: 'game-view-md.html',
    GAME_WATCH_HTML: 'game-watch-md.html',
    isCurrentViewGamePane: false,
    contactsMatchKey: function () {
        return Main.controller.auth.appUser.id + ":" + "CONTACTS_MATCH_KEY";
    },
    groupMatchKey: function (group_name) {
        return Main.controller.auth.appUser.id + ":" + "GROUP_MATCH_KEY_PREFIX" + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Main.controller.auth.appUser.id + ":" + "TOURNAMENT_MATCH_KEY_PREFIX" + ":" + tournament;
    },
    isLandscape: function () {
        return window.screen.width > window.screen.height;
    },
    home: function () {
        if (!Main.controller.GameHome.isLandscape()) {
            Main.controller.GameHome.isCurrentViewGamePanel = false;
            Main.controller.GameHome.portraitView(true);
        }
    },
    portraitView: function (fade_in) {
        var left_panel = document.getElementById('home-main');
        var right_panel = document.getElementById('home-game-panel');
        if (fade_in) {
            if (!Main.controller.GameHome.isCurrentViewGamePanel) {
                right_panel.style.display = 'none';

                left_panel.style.display = 'block';
                left_panel.style.opacity = 0;
                left_panel.style.width = '100%';
                Main.anim.to('home-main', 500, {opacity: 1});
            } else {
                left_panel.style.display = 'none';

                right_panel.style.display = 'block';
                right_panel.style.left = 0;
                right_panel.style.opacity = 0;
                right_panel.style.width = '100%';
                Main.anim.to('home-game-panel', 500, {opacity: 1});
            }
        } else {
            if (!Main.controller.GameHome.isCurrentViewGamePanel) {
                left_panel.style.width = '100%';
                right_panel.style.display = 'none';
            } else {
                right_panel.style.left = 0;
                right_panel.style.width = '100%';
                left_panel.style.display = 'none';
            }
        }
    },
    showGameView: function (match_data) {
        Main.controller.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameViewHtml;
        if (Main.controller.GameHome.isLandscape()) {
            Main.controller.GameView.Content(match_data);
        } else {
            Main.controller.GameHome.portraitView(true);
            Main.controller.GameView.Content(match_data);
        }
    },
    showGameWatch: function (match_data) {
        Main.controller.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameWatchHtml;
        if (Main.controller.GameHome.isLandscape()) {
            Main.controller.GameWatch.Content(match_data);
        } else {
            Main.controller.GameHome.portraitView(true);
            Main.controller.GameWatch.Content(match_data);
        }
    },
    Content: function (data) {

        Main.controller.UI.init(data);

        checkOrientation();

        function checkOrientation() {
            var left_panel = document.getElementById('home-main');
            var right_panel = document.getElementById('home-game-panel');

            layoutHome();
            Main.dom.removeListener(window, 'orientationchange', layoutHome);
            Main.dom.addListener(window, 'orientationchange', layoutHome);

            function layoutHome() {


                right_panel.style.position = 'absolute';
                right_panel.style.top = 0;
                right_panel.style.bottom = 0;

                if (Main.controller.GameHome.isLandscape()) {//landscape
                    left_panel.style.width = '40%';
                    left_panel.style.display = 'block';

                    right_panel.style.width = '60%';
                    right_panel.style.left = left_panel.style.width;
                    right_panel.style.display = 'block';

                } else {//portrait
                    Main.controller.GameHome.portraitView(false);
                }
            }
        }

/*
        function contactsMatchList() {

            var stored_matches = window.localStorage.getItem(Main.controller.GameHome.contactsMatchKey());

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the contacts live match list
                    liveMatchList('#home-contacts-live-games', stored_matches);
                }
            } catch (e) {
                console.warn(e);
            }

            refreshMyContactsMatchList();

        }

        function refreshMyContactsMatchList() {
            var now = new Date().getTime();
            var oldTime = lastContactsMatchRequestTime;
            if (oldTime && now < oldTime + REQUEST_RATE_INTERVAL * 1000) {
                return;
            }

            lastContactsMatchRequestTime = now;


            Main.rcall.live(function () {

                Main.ro.match.getContantsMatchList()
                        .get(function (data) {
                            var matches = data;

                            if (matches.length) {

                                liveMatchList('#home-contacts-live-games', matches);
                                var key = Main.controller.GameHome.contactsMatchKey();
                                window.localStorage.setItem(key, JSON.stringify(matches));

                            } else {
                                //TODO - display no match found or something similar

                            }
                        })
                        .error(function (err) {
                            lastContactsMatchRequestTime = oldTime;

                            //TODO - display error

                        });

            });

        }

        function groupMatchList(group) {
            var group_index;
            var group_count;
            if (!group) {
                group_index = 0;
                group = Main.controller.auth.appUser.groupsBelong[group_index];//first group in the list
                group_count = Main.controller.auth.appUser.groupsBelong.length;
                if (!group) {
                    return;
                }
            }

            //show the first group live match list


            var stored_matches = window.localStorage.getItem(Main.controller.GameHome.groupMatchKey(group.name));

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the group live match list
                    liveMatchList('#home-group-live-games', stored_matches);

                }
            } catch (e) {
                console.warn(e);
            }

            //display group header info
            document.getElementById('home-group-pic').src = group.photo;
            document.getElementById('home-group-name').innerHTML = group.name;
            document.getElementById('home-group-status-message').innerHTML = group.status_message;
            document.getElementById('home-group-page-number').innerHTML = (group_index + 1) + " of " + group_count;

            refreshMyGroupsMatchList(group.name);

            //create the group drop down menu.

            //the groupt items of the dropdown menu.
            var groupItems = function (groups) {
                var arr = [];
                for (var n in groups) {
                    arr.push('<img onerror="Main.helper.loadDefaultGroupPhoto(event)" src = "' + groups[n].photo + '" style="width:30px; height:30px;" /><span>' + groups[n].name + '</span>');
                }
                return arr;
            };

            //the dropdown menu
            Main.menu.create({
                width: 200,
                target: "#home-group-dropdown-menu",
                header: 'Jump to group',
                items: groupItems(Main.controller.auth.appUser.groupsBelong),
                onSelect: function (evt) {
                    var item = this.item;

                    //finally hide the menu
                    this.hide();
                }
            });

        }

        function refreshMyGroupsMatchList(group_name) {
            var now = new Date().getTime();
            
            var oldTime = lastGroupMatchRequestTime[group_name];
            if (oldTime && now < oldTime + REQUEST_RATE_INTERVAL * 1000) {
                return;
            }

            lastGroupMatchRequestTime[group_name] = now;

            Main.rcall.live(function () {
                Main.ro.match.getGroupMatchList(group_name)
                        .get(function (data) {
                            var matches = data;
                            if (matches.length) {
                                liveMatchList('#home-group-live-games', matches);
                                var key = Main.controller.GameHome.groupMatchKey(matches[0].group_name);
                                window.localStorage.setItem(key, JSON.stringify(matches));
                            } else {
                                //TODO - display no match found or something similar

                            }
                        })
                        .error(function (err) {
                            lastGroupMatchRequestTime[group_name] = oldTime;
                            //TODO - display error

                        });

            });

        }

        function tournamentMatchList(tournament) {
            if (!tournament) {
                if (Main.util.isArray(Main.controller.auth.appUser.tournamentList)) {
                    tournament = Main.controller.auth.appUser.tournamentList[0];
                }
                if (!tournament) {
                    return;
                }
            }
            //show the first tournaments live match list
            var stored_matches = window.localStorage.getItem(Main.controller.GameHome.tournamentMatchKey(tournament.name));

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the tournaments live match list
                    liveMatchList('#home-tournaments-live-games', stored_matches);
                }
            } catch (e) {
                console.warn(e);
            }

            //display tournament header info
            document.getElementById('home-tournament-pic').src = tournament.photo;
            document.getElementById('home-tournament-name').innerHTML = tournament.name;
            document.getElementById('home-tournament-duration').innerHTML = tournament.duration;

            refreshTournamentsMatchList(tournament);

            //create the tournament drop down menu.

            Main.menu.create({
                width: 200,
                height: 0.6 * window.screen.height,
                target: "#home-tournaments-live-games",
                header: 'Search tournaments',
                items: [
                    '<input type="text" placeholder="find by name..." style="width: 100%;">'
                ],
                onSelect: function (evt) {
                    var item = this.item;
                    //var items = this.getItems();

                },
                onShow: function () {


                }
            });

        }

        function refreshTournamentsMatchList(tornamenent_name) {

            var now = new Date().getTime();
            
            var oldTime = lastTournamentMatchRequestTime[tornamenent_name];
            if (oldTime && now < oldTime + REQUEST_RATE_INTERVAL * 1000) {
                return;
            }

            lastTournamentMatchRequestTime[tornamenent_name] = now;

            Main.rcall.live(function () {

                Main.ro.match.getTournamentMatchList(tornamenent_name)
                        .get(function (data) {
                            var matches = data;
                            if (matches.length) {
                                liveMatchList('#home-tournaments-live-games', matches);
                                var key = Main.controller.GameHome.tournamentMatchKey(matches[0].tournament_name);
                                window.localStorage.setItem(key, JSON.stringify(matches));
                            } else {
                                //TODO - display no match found or something similar

                            }
                        })
                        .error(function (err) {
                            lastTournamentMatchRequestTime[tornamenent_name] = oldTime;
                            //TODO - display error

                        });

            });

        }

*/
    }
};