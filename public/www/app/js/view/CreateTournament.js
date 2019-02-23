
/* global Ns, Main */

Ns.view.CreateTournament = {

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        var obj = {
            tourn: 'info/Tournament'
        };
        Main.rcall.live(obj);
    },
    content: function () {

        $('#create-tournament').find('.draughts-only').each(function () {
            $(this).hide();
        });

        if (Ns.ui.UI.selectedGame === 'chess') {
            document.getElementById('create-tournament-view-title').innerHTML = 'New Chess Tournament';
        } else if (Ns.ui.UI.selectedGame === 'draughts') {
            document.getElementById('create-tournament-view-title').innerHTML = 'New Draughts Tournament';

            $('#create-tournament').find('.draughts-only').each(function () {
                $(this).show();
            });
        }

        Main.click('create-tournament-select-photo', this._onClickSelectPhoto.bind(this));
        Main.click('create-tournament-btn', this._onClickCreate.bind(this));
        Main.dom.addListener('create-tournament-photo-file', 'change', this._onChangePhotoFile.bind(this));
    },

    _onChangePhotoFile: function (evt) {
        var el = evt.target;
        var tmpfile = (window.URL || window.webkitURL).createObjectURL(el.files[0]);
        document.getElementById('create-tournament-photo').src = tmpfile;
    },

    _onClickSelectPhoto: function () {
        document.getElementById('create-tournament-photo-file').click();
    },

    _onClickCreate: function () {

        var user_id = Ns.view.UserProfile.appUser.user_id;
        var tournament_name = document.getElementById('create-tournament-name').value;
        var game = document.getElementById('create-tournament-game').value;
        var variant = document.getElementById('create-tournament-variant').value;
        var type = document.getElementById('create-tournament-type').value;
        var sets_count = document.getElementById('create-tournament-sets-count').value;
        var desc = document.getElementById('create-tournament-description').value;


        var photo_file_input = document.getElementById('create-tournament-photo-file');

        Main.ro.tourn.createTournament(user_id, tournament_name, game, variant, type, sets_count, desc)
                .attach([photo_file_input])
                .get(function (tournament) {
                    //tournaments_belong
                    
                     if(!Ns.view.UserProfile.appUser.tournaments_belong){
                        Ns.view.UserProfile.appUser.tournaments_belong = []; 
                     }
                    
                    if(Ns.view.UserProfile.appUser.tournaments_belong.indexOf(tournament.name) === -1){
                       Ns.view.UserProfile.appUser.tournaments_belong.push(tournament.name); //added to tournaments belong
                    }
                    
                    Ns.GameHome.removeAndShowTournamentDetails(tournament);
                })
                .error(function (err, err_code, connect_err) {
                    Main.toast.show(err);
                });
    },
};