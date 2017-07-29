
/* global Main */

Main.controller.Comment = {
    
    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor : function(){
                
        var obj = {
            comment: 'game/Comment'
                    //more may go below
        };

        Main.rcall.live(obj);
      
    },
    
    content: function () {
        var data = this.data;
        //this.lefPanelBody - TODO
        var comment_content_id = 'game-view-comment-content';

        this.lefPanelBody.innerHTML = "<div class='game9ja-comment'>"
                + "<div  id='" + comment_content_id + "'  class='game9ja-comment-body'>"
                + "</div>"
                + Main.controller.UI.inputMsgHtml()
                + "</div>";

        var me = this;

        Main.rcall.live(function () {

            Main.ro.comment.getHistory(data.gameId)
                    .get(function (res) {
                        var contentHtml = '';

                        for (var i = 0; i < res.length; i++) {

                            /*<img  src="images/white_player.jpg" alt=" "/>
                             <span>Chuks Alimele</span>
                             <span>4 min ago</span>
                             <div>This content is here</div>
                             <span class="fa fa-reply"></span>
                             <span class="fa fa-thumbs-up">89,345,324</span>
                             <span class="fa fa-thumbs-down">33,564,353</span>
                             */
                            var time_ago = res[i].time; //TODO
                            var msg = res[i].msg;
                            if (res[i].content_type === 'voice') {
                                //a reply
                                msg = Main.controller.UI.voiceMessageHtml(res[i].vioce_data_url, res[i].vioce_data_byte_size);
                            }

                            if (res[i].reply_user_id) {
                                //a reply
                                msg = '<strong> to ' + res[i].reply_full_name + '</strong><br/>' + msg;
                            }
                            var html = '';
                            html += '<img onerror="Main.helper.loadDefaultGroupPhoto(event)" src="' + res[i].profile_photo_url + '" alt="" />';
                            html += '<span>' + res[i].full_name + '</span>';
                            html += '<span>' + time_ago + '</span>';
                            html += '<div>' + msg + '</div>';
                            html += '<span class="fa fa-reply"></span>';
                            html += '<span class="fa fa-thumbs-up">' + res[i].likes + '</span>';
                            html += '<span class="fa fa-thumbs-down">' + res[i].dislikes + '</span>';

                            contentHtml += '<div class="game9ja-comment-item">' + html + '</div>';
                        }
                        if (contentHtml) {
                            contentHtml = '<div class="game9ja-section-container">' + contentHtml + '</div>';
                            document.getElementById(comment_content_id).innerHTML = contentHtml;
                        }
                    })
                    .error(function (err) {

                    });
        });
    }

};


