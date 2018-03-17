
/* global Ns */

Ns.ui.Dialog = {

    selectContactList: function (obj) {
        var contacts = Ns.view.Contacts.contactList;
        obj.url = 'tpl/simple-list-b-tpl.html';
        obj.items = contacts;
      Ns.ui.Dialog._selList(obj);
    },

    selectList: function (obj) {
       Ns.ui.Dialog._selList(obj);
    },

    selectSimpleList: function (obj) {
        obj.url = 'tpl/simple-list-a-tpl.html';
         Ns.ui.Dialog._selList(obj);
    },

    _selList: function (obj) {
        var selected_items = [];
        var multi_select = obj.multiSelect === true || obj.singleSelect === false;

        var btns = [];
        if (multi_select) {
            btns = obj.bottons || ['CANCEL', 'OK'];
        }

        Main.dialog.show({
            title: obj.title,
            //content: '<div id="' + container_id + '"></div>',
            width: obj.width,
            height: obj.height,
            maxWidth: obj.maxWidth || 400,
            maxHeight: obj.maxHeight || 600,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: btns,
            action: function (btn, value) {
                if(obj.action){
                    obj.action.bind(this)(btn, value, selected_items);
                    return;
                }
                if (value === 'OK') {
                    obj.onSelect(selected_items);
                }
                this.hide();

            },
            onShow: function () {
                //access ui component here

                Ns.ui.Dialog._addListview({
                    dialog: this,
                    url: obj.url,
                    items: obj.items,
                    selected_items: selected_items,
                    multi_select: multi_select,
                    onRender: obj.onRender,
                    onSelect: obj.onSelect//for single selection
                });
            }
        });
    },

    _addListview: function (obj) {
        var initial_title = obj.dialog.getTitle();//initial title
        
        var indicatorHeader = function(selection_count){
            var new_title = '<span>'+selection_count+'</span><span>|</span><span>'+initial_title+'</span>';
            obj.dialog.setTitle(new_title);
        };
        
        if (obj.multi_select) {//multi selection
            indicatorHeader(obj.dialog, 0);
        }
        var container = obj.dialog.getBody();
        var container_id = 'listview-dialog-'+new Date().getTime();
        
        container.id = container_id;
        Main.listview.create({
            container: '#'+container_id,
            scrollContainer: '#'+container_id,
            tplUrl: obj.url,
            wrapItem: false,
            onSelect: function (evt, data) {
                console.dir(this);
                
                var index = obj.selected_items.indexOf(data);
                if (index === -1) {
                    obj.selected_items.push(data);
                    this.setSelectionColor(true);
                } else {
                    obj.selected_items.splice(index, 1);//deselect
                    this.setSelectionColor(false);
                }
                if (!obj.multi_select) {//single selection
                    obj.onSelect(data);
                    obj.dialog.hide();
                    return;
                }
                
                indicatorHeader(obj.selected_items.length);

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