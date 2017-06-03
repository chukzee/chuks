

/*var homeObj = {
 contacts_live: 'game/LiveContactsMatch',
 groups_live: 'game/LiveGroupsMatch',
 tournaments_live: 'game/LiveTournamentsMatch'
 //more may go below
 };
 
 
 Main.rcall.live(homeObj);
 */

Main.controller.GameHome = {

    onBeforeShow: function (data) {

        var game_name;

        switch (data.game) {
            case 'chess':
                {
                    game_name = 'Chess';
                }
                break;
            case 'draft':
                {
                    game_name = 'Draft';
                }
                break;
            case 'ludo':
                {
                    game_name = 'Ludo';
                }
                break;
            case 'solitaire':
                {
                    game_name = 'Solitaire';
                }
                break;
            case 'whot':
                {
                    game_name = 'Whot';
                }
                break;

        }

        document.getElementById("home-game-name").innerHTML = game_name;

        Main.tab({
            container: document.getElementById("home-tab-container"),
            onShow: {
                "#home-contacts-matches": myContactsMatchLeist,
                "#home-groups-matches": myGroupsMatchList,
                "#home-tournaments-matches": tournamentsMatchList
            }
        });


        function myContactsMatchLeist() {


        }

        function myGroupsMatchList() {

        }

        function tournamentsMatchList() {


        }


    }


};