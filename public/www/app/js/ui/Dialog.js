
Ns.ui.Dialog = {

    selectContactList: function (options, callback) {
        var selection = [];
        var multi_select = options.multiSelect === true || options.singleSelect === false;
        var container_id = 'bluetooth-dialog-continer';
        var btns = [];
        if (multi_select) {
            btns = ['CANCEL', 'OK'];
        }

        var contacts = Ns.view.Contacts.contactList;

        Main.dialog.show({
            title: options.title ? options.title : '',
            //content: '<div id="' + container_id + '"></div>',
            width: window.innerWidth * 0.7,
            height: window.innerHeight * 0.5,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: btns,
            action: function (btn, value) {
                if (value === 'OK') {
                    callback(selection);
                }
                this.hide();

            },
            onShow: function () {
                //access ui component here

                Ns.ui.Dialog._addListview({
                    dialog: this,
                    url: 'tpl/simple-list-b-tpl.html',
                    items: contacts,
                    selection: selection,
                    multi_select: multi_select
                });
            }
        });
    },

    selectList: function (options, callback) {

    },

    selectSimpleList: function (options, arr, callback) {

    },

    _addListview: function (obj) {

        Main.listview.create({
            container: container,
            scrollContainer: container,
            tplUrl: obj.url,
            wrapItem: false,
            onSelect: function (evt, data) {
                var index = obj.selection.indexOf(data);
                if (index === -1) {
                    obj.selection.push(data);
                    this.setSelectionColor(true);
                } else {
                    obj.selection.splice(index, 1);//deselect
                    this.setSelectionColor(false);
                }
                if (!obj.multi_select) {//single selection
                    obj.dialog.hide();
                }

            },
            onRender: function (tpl_var, data) {
                if (obj.onRender) {
                    return obj.onRender(tpl_var, data);
                }
            },
            onReady: function () {
                for (var i = 0; i < obj.items.length; i++) {
                    this.appendItem(obj.items[i]);
                }
            }
        });

    }

};