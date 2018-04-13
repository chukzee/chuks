
/* global Ns */

Ns.view.Contacts = {

    /**
     * list of contacts info
     * @type Array
     */
    contactList: [],
    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        try {
            var list = window.localStorage.getItem(Ns.Const.CONTACT_LIST_KEY);
            list = JSON.parse(list);
            if (Main.util.isArray(list)) {
                Ns.view.Contacts.contactList = list;
            }
        } catch (e) {
            console.warn(e);
        }

        var obj = {
            contact: 'info/Contact'
        };
        Main.rcall.live(obj);
    },
    content: function () {

        var contacts = Ns.view.UserProfile.appUser.contacts;
        var tempInfos = [];
        for (var i = 0; i < contacts.length; i++) {
            var obj = {
                user_id: contacts[i],
                photo_url: '',
                full_name: ''
            };
            tempInfos.push(obj);
        }

        contactsContent(tempInfos);

        Ns.view.UserProfile.getUsersInfo(contacts, function (infos) {
            if (Main.util.isArray(infos)) {
                Ns.view.Contacts.contactList = infos;
                Ns.view.Contacts.save();
            }
            contactsContent(infos);
        });


        function contactsContent(infos) {
            /*var contacts_html = '';
             for (var i = 0; i < infos.length; i++) {
             contacts_html += Ns.view.Contacts.contactHtml(infos[i]);
             }
             document.getElementById("game-contacts-list").innerHTML = contacts_html;
             
             */

            document.getElementById("game-contacts-count").innerHTML = infos.length;

            var container = '#game-contacts-list';

            Main.listview.create({
                container: container,
                scrollContainer: container,
                tplUrl: 'contacts-list-tpl.html',
                wrapItem: false,
                //itemClass: "game9ja-live-games-list",
                onSelect: function (evt, info) {

                    Ns.view.Contacts.onClickContact(evt, info.user_id);

                },
                onRender: function (tpl_var, data) {

                    if (tpl_var === 'action_value') {
                        return 'Lets play';
                    }
                },
                onReady: function () {

                    for (var i = 0; i < infos.length; i++) {
                        this.appendItem(infos[i]);
                    }

                }
            });

        }

    },
    /*
     contactHtml: function (contactObj) {
     var action_value = 'Lets play';
     
     var onclick_action = 'onclick = \'Ns.view.Contacts.onClickContact(event,"' + contactObj.user_id + '")\'';
     
     return '<ul ' + onclick_action + ' class="game9ja-user-show-list">'
     
     + '  <li><img name="user_photo"  src="' + contactObj.photo_url + '" onerror="Main.helper.loadDefaultProfilePhoto(event)"  alt=" "/></li>'
     + '   <li>'
     + '       ' + contactObj.full_name
     + '   </li>'
     + '    <li>'
     + '        ' + contactObj.user_id
     + '    </li>'
     
     + '    <li>'
     + '        <input  name="action"  type="button" value="' + action_value + '"/>'
     + '    </li>'
     + '    <li>'
     + '         ' //Nothing!
     + '     </li>'
     + ' </ul>';
     },
     */
    isLocalContact: function (user_id) {
        var contacts = Ns.view.Contacts.contactList;
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].user_id === user_id) {
                return true;
            }
        }
        return false;
    },
    onClickContact: function (evt, user_id) {

        Ns.view.UserProfile.getInfo(user_id, function (contact) {

            if (evt.target.name === 'user_photo') {
                Ns.view.Contacts.onClickContactPhoto(contact);
            }


            if (evt.target.name === 'action') {
                if (evt.target.value.toLowerCase() === 'lets play') {
                    Ns.view.Contacts.onClickLetsPlay(contact);
                }
            }

        });

    },

    onClickContactPhoto: function (contact) {
        alert('onClickContactPhoto');
    },

    onClickLetsPlay: function (contact) {
        Ns.PlayRequest.openPlayDialog(contact);
    },

    save: function () {
        var list = Ns.view.Contacts.contactList;
        if (Main.util.isArray(list)) {
            window.localStorage.setItem(Ns.Const.CONTACT_LIST_KEY, JSON.stringify(list));
        }
    }
};