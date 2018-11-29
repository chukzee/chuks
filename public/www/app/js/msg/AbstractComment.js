

/* global Main, Ns */

Ns.msg.AbstractComment = {
    comment_view: null,
    comment_view_body: null,
    commentList: [],
        content: function (data) {
        
        var me = this;
        this.initContent(data);
        this.set(this.commentList);
        
        this.comment_view = document.getElementById(this.getViewID());
        if (!this.comment_view) {
            throw Error('unknown id for comment view - ' + this.getViewID());
        }
        
        this.comment_view_body = document.getElementById(this.getViewBodyID());
        if (!this.comment_view_body) {
            throw Error('unknown id for comment view body - ' + this.getViewBodyID());
        }

        //TODO: show loading indicator

        Main.rcall.live(function () {
            
            me.rcallGetComments(data)
                    .get(function (res) {
                        me.set(res);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });


    },
    
    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getViewID: function(){ 
    },
    
    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getViewBodyID: function(){
    },
    _validate: function () {
        if (!this.comment_view_body) {
            throw Error('Invalid setup - comment body cannot be null. ensure to set comment view body id.');
        }

        if (!this.comment_view) {
            throw Error('Invalid setup - comment view cannot be null. ensure to set comment view id.');
        }


        return true;

    },

    /**
     * replace the existing comments messages with new ones
     * 
     * @param {type} comments
     * @returns {undefined}
     */
    set: function (comments) {
        if (!this._validate()) {
            return;
        }

        this.commentList = comments;

        
        var me = this;
        
        
        Main.tpl.template({
            tplUrl: 'comment-tpl.html',
            afterReplace: function(html, data){
                //clear comment
                var comment_body = $(html).find('div[data-comment="body"]')[0];
                $(comment_body).html(''); // come back to test for correctness

                Ns.msg.AbstractComment._addContent(html, comments);

                var btn_send = $(html).find('i[data-comment="send"]')[0];
                var txt_input = $(html).find('textarea[data-comment="input-content"]')[0];
                var emoji = $(html).find('div[data-comment="emoji"]')[0];

                $(btn_send).on('click', {txt_input: txt_input}, Ns.msg.AbstractComment._sendCommentMessage);

                $(emoji).on('click', Ns.msg.AbstractComment._showEmojis);
            }
        });

    },
    /**
     * Add one or an array of comment messages
     * 
     * @param {type} comment
     * @returns {undefined}
     */
    add: function (comment) {
        if (!this._validate()) {
            return;
        }


        if (!Main.util.isArray(comment)) {
            comment = [comment];
        }

        for (var i = 0; i < comment.length; i++) {
            this.commentList.push(comment[i]);
        }



        Main.tpl.template({
            tplUrl: 'comment-tpl.html',
            afterReplace: function (html, data) {
                Ns.msg.AbstractComment._addContent(html, comment);
            }
        });
        
    },
    
    _addContent: function(html, comments){
        
    },
    
    _sendCommentMessage: function (argu) {
        var txt_input = argu.data.txt_input;
        var content = txt_input.innerHTML; //textarea
        var me = this;
        Main.rcall.live(function () {
            me.rcallSendMessage(content)
                    .get(function (data) {

                    })
                    .error(function (err) {

                    });
        });

    },

    /**
     * Subclass must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.sendGameComment(); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function () {
    },

    /**
     * Remove one comment message at the specified index
     * 
     * @param {type} index
     * @returns {undefined}
     */
    remove: function (index) {
        if (!this._validate()) {
            return;
        }


    },
    /**
     * Find the search string on the comment view and scroll to the
     * first search result
     * 
     * @param {type} search_str
     * @returns {undefined}
     */
    find: function (search_str) {
        if (!this._validate()) {
            return;
        }



    },

    /**
     * Scroll to the next search result in the current search operation
     * 
     * @returns {undefined}
     */
    findNext: function () {
        if (!this._validate()) {
            return;
        }


    },

    /**
     * Scroll to the previous search result in the current search operation
     * 
     * @returns {undefined}
     */
    findPrevious: function () {
        if (!this._validate()) {
            return;
        }

    },

    /**
     * Show a collections of emojis
     * 
     * @returns {undefined}
     */
    _showEmojis: function () {
        if (!this._validate()) {
            return;
        }

        alert('TODO: _showEmojis');

    }




};
