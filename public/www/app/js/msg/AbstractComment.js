

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
    setViewBodyID: function (comment_view_body_id) {
        this.comment_view_body = document.getElementById(comment_view_body_id);
        if (!this.comment_view_body) {
            throw Error('unknown id for comment view body - ' + comment_view_body_id);
        }
    },

    setViewID: function (view_id) {
        this.comment_view = document.getElementById(view_id);
        if (!this.comment_view) {
            throw Error('unknown id for comment view - ' + view_id);
        }
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
                var comment_body = $(html).find('[data-comment="body"]')[0];
                $(comment_body).html(''); // come back to test for correctness
                
                Ns.msg.AbstractComment._addContent(html, comments);
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
    showEmojis: function () {
        if (!this._validate()) {
            return;
        }


    }




};
