
/* global Ns, Main */

Ns.view.EditTournament = {

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
    content: function (tournament) {


        document.getElementById('edit-tournament-photo-file').src = tournament.small_photo_url;

        if (Ns.ui.UI.selectedGame === 'chess') {
            document.getElementById('edit-tournament-view-title').innerHTML = 'Edit Chess Tournament';
        } else if (Ns.ui.UI.selectedGame === 'draughts') {
            document.getElementById('edit-tournament-view-title').innerHTML = 'Edit Draughts Tournament';
        }

        Main.click('edit-tournament-select-photo', this._onClickSelectPhoto.bind(this));
        Main.click('edit-tournament-btn', tournament, this._onClickEdit.bind(this));
        Main.dom.addListener('edit-tournament-photo-file', 'change', this._onChangePhotoFile.bind(this));
    },

    _onChangePhotoFile: function (evt) {
        var el = evt.target;
        var tmpfile = (window.URL || window.webkitURL).createObjectURL(el.files[0]);
        document.getElementById('edit-tournament-photo').src = tmpfile;
    },

    _onClickSelectPhoto: function () {
        document.getElementById('edit-tournament-photo-file').click();
    },

    _onClickEdit: function (evt, tournament) {

        var user_id = Ns.view.UserProfile.appUser.user_id;

        var photo_file_input = document.getElementById('edit-tournament-photo-file');

        Main.ro.tourn.editTournament(user_id, tournament.name)
                .attach([photo_file_input])
                .get(function (tournament) {
                    Ns.view.Tournament.save(tournament);
                    Main.toast.show('Edited successfully');
                    Ns.GameHome.back({
                        data: tournament,
                        onShow: Ns.GameTournament.Content
                    });
                })
                .error(function (err, err_code, connect_err) {
                    Main.toast.show(err);
                });
    },
};