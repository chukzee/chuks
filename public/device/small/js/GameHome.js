

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

        Main.menu.create({
            width: 150,
            target: "#home-menu",
            items: [
                'Play notifications',
                'Invite players',
                'Contacts',
                'Create group',
                'Create tournament',
                'Profile',
                'Settings',
                'Help'
            ],
            onSelect: function (evt) {
                var item = this.item;
                
                //finally hide the menu
                this.hide();
            }
        });


        Main.menu.create({
            width: 200,
            target: "#home-groups-live-show-groups",
            header:'Jump to group',
            items: [
                '<img /><span> Grace</span>',
                '<img /><span> Favour group</span>',
                '<img /><span> Chess omega</span>'
            ],
            onSelect: function (evt) {
                var item = this.item;
                
                //finally hide the menu
                this.hide();
            }
        });
        

        Main.menu.create({
            width: 200,
            height: 200,
            target: "#home-tournaments-live-show-tournaments",
            header:'Search tournaments',
            items: [
                '<input type="text" placeholder="find by name...">',
                '<div>Warri Championship</span>',
                '<div>Sapele Championship</span>',
                'Text Only',
            ],
            onSelect: function (evt) {
                var item = this.item;
                var items = this.getItems();
                //finally hide the menu
                //this.hide();
                
                this.addItem('chuks');
                /*this.appendItem();
                this.prependItem();
                this.removeItemAt();
                this.clearItems();
                this.clear();
                this.setHeader();
                this.setFooter();*/
            },
            onShow: function () {
                
                this.addItem('<input type="button" value="addItem"/>');
                this.appendItem('<input type="button" value="appendItem"/>');
                this.prependItem('<input type="button" value="prependItem"/>');
                //this.removeItemAt(1);
                //this.clearItems();
                //this.clear();
                this.setHeader('setHeader');
                this.setFooter('setFooter');
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