
Ns.ui.Dialog = {

    selectContactList: function (options, callback) {
        var contacts = Ns.view.Contacts.contactList;
       _selList('tpl/simple-list-b-tpl.html', contacts, options, callback);
    },

    selectList: function (options, items_arr, callback) {
       _selList(options.url, items_arr, options, callback);
    },

    selectSimpleList: function (options, items_arr, callback) {
         _selList('tpl/simple-list-a-tpl.html', items_arr, options, callback);
    },

    _selList: function (url, items_arr, options, callback) {
        var selected_items = [];
        var multi_select = options.multiSelect === true || options.singleSelect === false;

        var btns = [];
        if (multi_select) {
            btns = options.bottons || ['CANCEL', 'OK'];
        }

        Main.dialog.show({
            title: options.title,
            //content: '<div id="' + container_id + '"></div>',
            width: options.width,
            height: options.height,
            maxWidth: options.maxWidth || 400,
            maxHeight: options.maxHeight || 600,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: btns,
            action: function (btn, value) {
                if(options.action){
                    options.action.bind(this)(btn, value, selected_items);
                    return;
                }
                if (value === 'OK') {
                    callback(selected_items);
                }
                this.hide();

            },
            onShow: function () {
                //access ui component here

                Ns.ui.Dialog._addListview({
                    dialog: this,
                    url: url,
                    items: items_arr,
                    selected_items: selected_items,
                    multi_select: multi_select
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

        Main.listview.create({
            container: obj.dialog.getBody(),
            scrollContainer: obj.dialog.getBody(),
            tplUrl: obj.url,
            wrapItem: false,
            onSelect: function (evt, data) {
                var index = obj.selected_items.indexOf(data);
                if (index === -1) {
                    obj.selected_items.push(data);
                    this.setSelectionColor(true);
                } else {
                    obj.selected_items.splice(index, 1);//deselect
                    this.setSelectionColor(false);
                }
                if (!obj.multi_select) {//single selection
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