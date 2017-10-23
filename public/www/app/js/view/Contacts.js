
/* global Ns */

Ns.view.Contacts = {

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
            contactsContent(infos);
        });


        function contactsContent(infos) {
            var contacts_html = '';
            for (var i = 0; i < infos.length; i++) {
                contacts_html += Ns.view.Contacts.contactHtml(infos[i]);
            }
            
            document.getElementById("game-contacts-count").innerHTML = infos.length;
            document.getElementById("game-contacts-list").innerHTML = contacts_html;

        }

    },

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
        Ns.game.PlayRequest.openPlayDialog(contact);
    },

};