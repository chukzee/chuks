
/* global Ns, Main */

Ns.view.CreateGroup = {

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        var obj = {
            group: 'info/Group'
        };
        Main.rcall.live(obj);
    },

    content: function () {

        Main.click('create-group-select-photo', this._onClickSelectPhoto.bind(this));
        Main.click('create-group-btn', this._onClickCreate.bind(this));
        Main.dom.addListener('create-group-photo-file', 'change', this._onChangePhotoFile.bind(this));
    },

    _onChangePhotoFile: function (evt) {
        var el = evt.target;
        var tmpfile = (window.URL || window.webkitURL).createObjectURL(el.files[0]);
        document.getElementById('create-group-photo').src = tmpfile;
    },

    _onClickSelectPhoto: function () {
        document.getElementById('create-group-photo-file').click();
    },

    _onClickCreate: function () {

        var user_id = Ns.view.UserProfile.appUser.user_id;
        var group_name = document.getElementById('create-group-name').value;
        var desc = document.getElementById('create-group-description').value;

        var photo_file_input = document.getElementById('create-group-photo-file');

        Main.ro.group.createGroup(user_id, group_name, desc)
                .attach([photo_file_input])
                .get(function (group) {

                    if (!Ns.view.UserProfile.appUser.groups_belong) {
                        Ns.view.UserProfile.appUser.groups_belong = [];
                    }

                    if (Ns.view.UserProfile.appUser.groups_belong.indexOf(group.name) === -1) {
                        Ns.view.UserProfile.appUser.groups_belong.push(group.name); //added to group belong
                    }

                    Ns.ui.UI.groupPageCounter(group);

                    Ns.GameHome.removeAndShowGroupDetails(group);
                    
                })
                .error(function (err, err_code, connect_err) {
                    Main.toast.show(err);
                });
    },
};