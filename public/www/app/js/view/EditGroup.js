
/* global Ns, Main */

Ns.view.EditGroup = {

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

    content: function (group) {

        document.getElementById("edit-group-description").innerHTML = group.status_message;
        document.getElementById("edit-group-photo-file").src = group.small_photo_url;

        Main.click('edit-group-select-photo', this._onClickSelectPhoto.bind(this));
        Main.click('edit-group-btn', group, this._onClickCreate.bind(this));
        Main.dom.addListener('edit-group-photo-file', 'change', this._onChangePhotoFile.bind(this));
    },

    _onChangePhotoFile: function (evt) {
        var el = evt.target;
        var tmpfile = (window.URL || window.webkitURL).createObjectURL(el.files[0]);
        document.getElementById('edit-group-photo').src = tmpfile;
    },

    _onClickSelectPhoto: function () {
        document.getElementById('edit-group-photo-file').click();
    },

    _onClickCreate: function (evt, group) {

        var user_id = Ns.view.UserProfile.appUser.user_id;
        var desc = document.getElementById('edit-group-description').value;

        var photo_file_input = document.getElementById('edit-group-photo-file');

        Main.ro.group.editGroup(user_id, group.name, desc)
                .attach([photo_file_input])
                .get(function (group) {
                    Ns.view.Group.save(group);
                    Main.toast.show('Edited successfully');
                    Ns.GameHome.back({
                        data: group,
                        onShow: Ns.GameGroup.Content
                    });
                })
                .error(function (err, err_code, connect_err) {
                    Main.toast.show(err);
                });
    },
};