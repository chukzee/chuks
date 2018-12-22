
/* global Main, Ns */

Ns.msg.AbstractPeerToPeerChat = {

    extend: 'Ns.msg.AbstractChat',

    onPrepareReceivedMsgTpl: function (tpl_var, data) {

        if (tpl_var === 'time') {
            return data[tpl_var] ? Ns.Util.formatTime(data[tpl_var]) : '';
        }

        if (tpl_var === 'full_name') {
            return '';//do not display the full name
        }

        if (tpl_var === 'content') {
            return data.content ? data.content : data.msg;
        }
    },

    sendSeenStatus: function (msg_id, sender_id, recipient_id) {
        Main.ro.chat.seenFeedback(msg_id, sender_id, recipient_id)
                .get(function () {
                    //do nothing
                })
                .error(function (err) {
                    console.log(err);
                });
    },

    sendDeliveryStatus: function (msg_id, sender_id, recipient_id) {
        Main.ro.chat.deliveryFeedback(msg_id, sender_id, recipient_id)
                .get(function () {
                    //do nothing
                })
                .error(function (err) {
                    console.log(err);
                });
    },

    onChat: function (evtObj) {
        this.add(evtObj.data);
    },

    onChatMsgStatus: function (evtObj) {

        console.log(evtObj);

        var obj = evtObj.data;
        var status = obj.status;
        var msg_ids = obj.msg_ids;
        var sender_id = obj.sender_id;
        var list = this.getMsgList();
        for (var i = 0; i < list.length; i++) {
            var l = list[i];
            for (var k = 0; k < msg_ids.length; k++) {
                if (l.msg_id === msg_ids[k]) {
                    l.status = status;
                    break;
                }
            }
        }

        this._localSaveMessages();

        if (!this.isShowing()) {
            return;//do not modify the dom since the chat view is not showing
        }

        var user_id = Ns.view.UserProfile.appUser.user_id;

        if (sender_id !== user_id) {
            return;//the recipient does not need to update the ui
        }

        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        if (!msg_body) {
            return;
        }
        var children = msg_body.children;
        for (var index = children.length - 1; index > -1; index--) {
            var child = children[index];
            var el_id = this.view_body.id;
            var dom_extra_field = this.domExtraFieldPrefix(el_id);

            for (var k = 0; k < msg_ids.length; k++) {
                if (child[dom_extra_field].msg_id === msg_ids[k]) {

                    if (status === 'delivered') {
                        var el = child.querySelector(this.getMsgStatusIndicatorSelector());
                        el.className = this.getDeliveredIndicatorClassName();
                    }
                    if (status === 'seen') {
                        var el = child.querySelector(this.getMsgStatusIndicatorSelector());
                        el.className = this.getSeenIndicatorClassName();
                    }
                    break;
                }
            }
        }


    }

};