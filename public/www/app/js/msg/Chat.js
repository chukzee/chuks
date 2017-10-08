
Ns.msg.Chat = {

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        var obj = {
            chat: 'game/Chat',
            //more may go below
        };

        Main.rcall.live(obj);

        Main.eventio.on('game_chat', this.onGameChat);
        Main.eventio.on('group_chat', this.onGroupChat);
        Main.eventio.on('tournament_inhouse_chat', this.onTournamentInhouseChat);
        Main.eventio.on('tournament_general_chat', this.onTournamentGeneralChat);

    },
    content: function () {
        var data = this.data;
        var chat_content_id = 'game-view-chat-content';

        this.lefPanelBody.innerHTML = "<div class='game9ja-chat'>"
                + "<div id='" + chat_content_id + "' class='game9ja-chat-body'></div>"
                + Ns.ui.UI.inputMsgHtml()
                + "</div>";

        var me = this;

        //TODO: show loading indicator

        Main.rcall.live(function () {

            Main.ro.chat.getChats(data.gameId)
                    .get(function (res) {
                        //TODO: hide loading indicator

                        var contentHtml = '';
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].white_id === data.white_id ||
                                    res[i].black_id === data.black_id) {
                                //own messaage

                                var time_html = div(res[i].time);
                                var msg_html = div(res[i].msg);
                                var status_html = '<img src="the status file"/>';//TODO- USE src image file
                                contentHtml += div(msg_html + time_html + status_html, "game9ja-chat-sent");
                            } else {
                                //a reply

                                var time_html = div(res[i].time);
                                var msg_html = div(res[i].msg);
                                contentHtml += div(msg_html + time_html, "game9ja-chat-received");

                            }
                        }

                        document.getElementById(chat_content_id).innerHTML = contentHtml;

                    })
                    .error(function (err) {
                        //TODO: hide loading indicator
                    });
        });


        function div(content, clazz) {
            if (clazz) {
                return '<div class="' + clazz + '">' + content + '</div>';
            }
            return '<div>' + content + '</div>';
        }
    },

    onGameChat: function(obj){
        console.log(obj);
    },

    onGroupChat: function(obj){
        console.log(obj);
    },

    onTournamentInhouseChat: function(obj){
        console.log(obj);
    },

    onTournamentGeneralChat: function(obj){
        console.log(obj);
    }

};


