/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ChurchApp = new function () {
    this.AccountantFeatures = [];
    this.AccountantFeatures[0] = ["Bank Statement", true];
    this.AccountantFeatures[1] = ["Budget", true];
    this.AccountantFeatures[2] = ["Cash Book", true];
    this.AccountantFeatures[3] = ["Cheques", true];
    this.AccountantFeatures[4] = ["Child Dedication", true];
    this.AccountantFeatures[5] = ["Daily Acitivite Schedule", true];
    this.AccountantFeatures[6] = ["Fund Request", true];
    this.AccountantFeatures[7] = ["Fund Tranfer", true];
    this.AccountantFeatures[8] = ["Home Fellowship", true];
    this.AccountantFeatures[9] = ["Inflow", true];
    this.AccountantFeatures[10] = ["Membership", true];
    this.AccountantFeatures[11] = ["Monthly Spiritual Growth", true];
    this.AccountantFeatures[12] = ["Service Income", true];
    this.AccountantFeatures[13] = ["Home Fellowship", true];

    this.AdminFeatures = [];
    this.AdminFeatures[0] = ["Bank", true];
    this.AdminFeatures[1] = ["Birthday", true];
    this.AdminFeatures[2] = ["Child Dedication", true];
    this.AdminFeatures[3] = ["Church Structure", true];
    this.AdminFeatures[4] = ["Authorization", true];
    this.AdminFeatures[5] = ["Daily Activities Schedule", true];
    this.AdminFeatures[6] = ["Daily Income", true];
    this.AdminFeatures[7] = ["Denomination", true];
    this.AdminFeatures[8] = ["Department", true];
    this.AdminFeatures[9] = ["Designation", true];
    this.AdminFeatures[10] = ["Digging Deep", true];
    this.AdminFeatures[11] = ["Events", true];
    this.AdminFeatures[12] = ["Expense Category", true];
    this.AdminFeatures[13] = ["Faith Clinic", true];
    this.AdminFeatures[14] = ["General Thanksgiving", true];
    this.AdminFeatures[15] = ["Home Fellowship", true];
    this.AdminFeatures[16] = ["Member Thanksgiving", true];
    this.AdminFeatures[17] = ["Membership", true];
    this.AdminFeatures[18] = ["News Post", true];
    this.AdminFeatures[19] = ["Rehearsals", true];
    this.AdminFeatures[20] = ["Service Income", true];
    this.AdminFeatures[21] = ["Service", true];
    this.AdminFeatures[22] = ["Service Income Category", true];
    this.AdminFeatures[23] = ["Wedding", true];
    this.AdminFeatures[24] = ["Home", true];

    this.PastorFeatures = [];//TODO

    this.WorkerFeatures = [];//TODO

    this.MenExcoFeatures = [];//TODO

    this.WomenExcoFeatures = [];//TODO

    this.YouthExcoFeatures = [];//TODO

    this.MemberFeatures = [];//TODO

    this.ChildrenFeatures = [];//TODO

    this.failed_auth = 0;
    this.attempts_update = 0;
    this.attempts_delete = 0;
    this.attempts_delete_msg_append = " attempts delete in current session";
    this.attempts_update_msg_append = " attempts update in current session";
    this.failed_auth_msg_append = " failed authentications";

    this.TablePageObject = function () {
        this.tableData = "";
        this.tableColumns = "";
        this.tableTitle = "";
        this.style = ChurchApp.DisplayStyle.A;
        this.pageId = "";
        this.pageTitle = "";
        this.headerTitle = "";
        this.updateUrl = "#";//the server script file
        this.deleteUrl = "#";//the server script file
        this.inactivityTimeout = 180;//in seconds - usually retrived from user settings
        //more fields may go below

        this.validationRules = {};
    };
    /**
     * Stop the specified event.
     * 
     * @param {type} evt
     * @returns {undefined}
     */
    this.preventDefault = function (evt) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false; //IE especially IE8 wahala!!!
        }
    };

    this.Util = new function () {

        this.isInternalPage = function (page_url) {
            var strUrl = new String(page_url);
            for (var i = strUrl.length - 1; i > -1; i--) {
                if (strUrl.charAt(i) === '\\'
                        || strUrl.charAt(i) === '/'
                        || strUrl.charAt(i) === ':') {
                    return false;
                }
                if (strUrl.charAt(i) === '#' && i < strUrl.length - 1) {
                    return true;
                }
            }

            return false;
        };

        this.getInternalPageName = function (page_url) {
            var strUrl = new String(page_url);
            for (var i = strUrl.length - 1; i > -1; i--) {
                if (strUrl.charAt(i) === '\\'
                        || strUrl.charAt(i) === '/'
                        || strUrl.charAt(i) === ':') {
                    return false;
                }
                if (strUrl.charAt(i) === '#' && i < strUrl.length - 1) {
                    return strUrl.substring(i + 1);
                }
            }

            return false;
        };

        this.endsWithStr = function (container_str, search_str) {

            //check if they are both string
            if (typeof container_str !== "string" ||
                    typeof search_str !== "string") {
                return false;
            }

            var b_len = container_str.length;
            var s_len = search_str.length;

            if (b_len < s_len)
                return false;

            var b = b_len;
            for (var i = s_len - 1; i > -1; i--) {
                --b;
                if (container_str.charAt(b) !== search_str.charAt(i)) {
                    return false;
                }
            }

            return true;
        };

        this.replaceAllChar = function (str, oldChar, newChar) {
            var new_str = "";
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (c === oldChar) {
                    c = newChar;
                }

                new_str += c;
            }

            return new_str;
        };

    };

    this.setScrollFixedNavTop = function (className, num) {
        //number of pixels before modifying styles        
        $(document).on("scroll", function () {
            if ($(this).scrollTop() > num) {
                $("." + className).addClass("fixed-nav-top");
            } else {
                $("." + className).removeClass("fixed-nav-top");
            }
        });
    };

    /**The contract for populating internal page using external file content
     *  in this app is as follows:<br/><br/>
     * 
     * The external content file must be of html extension.<br/>
     * 
     * The file name of the external content file must be the 
     * same as the internal page div id.<br/>
     * 
     * The external content file must have an outer div (div just before the body tag)
     * with a id of this format: load-internal-internal_page_div_id , where
     * internal_page_div_id is the div of the internal page whose content
     * will be replaced (actually populated) by the content of the external file.<br/><br/>
     * 
     * NOTE: The external page outer div must not have any sibling and must have ONLY
     * one attribute and that is the id whose format must be that specified above.
     * 
     * 
     * 
     * @param {type} pageUrl
     * @returns {Boolean}
     */
    this.loadInternalPage = function (pageUrl) {

        //first get the internal page id
        var pageId = this.Util.getInternalPageName(pageUrl);
        if (!pageId) {
            return false;
        }

        $("#" + pageId).load(pageId + ".html #load-internal-" + pageId, function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "success") {
                $("#" + pageId).html($("#load-internal-" + pageId).html());
                $("#" + pageId).trigger('create');
                handleDynamicPageLoad($("#" + pageId));

            }
            if (statusTxt === "error") {
                //alert("Error: " + xhr.status + ": " + xhr.statusText);
            }

        });
    };


    this.loadHomePageByPriviledge = function (obj) {
        var homePage = "";
        switch (obj.priviledgeGroup) {
            case "Admin":
                homePage = "home-page-admin.html";
                break;
            case "Accountant":
                homePage = "home-page-accountant.html";
                break;
            case "Pastor":
                homePage = "home-page-pastor.html";
                break;
            case "Worker":
                homePage = "home-page-worker.html";
                break;
            case "Men Exco":
                homePage = "home-page-men-exco.html";
                break;
            case "Women Exco":
                homePage = "home-page-women-exco.html";
                break;
            case "Youth Exco":
                homePage = "home-page-youth-exco.html";
                break;
            case "Member":
                homePage = "home-page-member.html";
                break;
            case "Children":
                homePage = "home-page-children.html";
                break;

        }

        //ChurchApp.loadInternalPage(homePage);
        $(":mobile-pagecontainer").pagecontainer("change", homePage, {
            transition: 'slide',
            //changeHash: false,
            // reverse: true,
            showLoadMsg: true
        });

        $(":mobile-pagecontainer").on("pagecontainershow", function (event, ui) {
            //alert("This page was just hidden: " + ui.toPage);//dataUrl
            //alert("absUrl " + ui.absUrl);//dataUrl
            
            var s = $(document).find('[data-name="churchapp-news-content"]');//come back - could have more that one elements

            $(s).each(function (index, element) {

                if ($.trim(element.innerHTML).length === 0) {

                    var carousel_html = createCarouselHTML(obj);
                    var news_html = ChurchApp.createNewsHtml(obj.newsContent, ChurchApp.DisplayStyle.A);

                    element.innerHTML = carousel_html + news_html;
                    $(this).trigger('create');
                    initializeSlick(obj);
                }
            });


        });

        //More code may go below like enabling and disabling feature based on user priviledge role

    };

    initializeSlick = function (obj) {
        var show = 3;
        if (obj.carouselImages.length === 2) {
            show = 2;
        } else if (obj.carouselImages.length === 1) {
            show = 1;
        }
        $('.home-page-carousel').slick({
            dots: true,
            infinite: true,
            //centerMode: true,
            //centerPadding: '60px',
            slidesToShow: show,
            lazyLoad: 'ondemand',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        //centerMode: true,
                        //centerPadding: '40px',
                        slidesToShow: show
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        //centerMode: true,
                        //centerPadding: '40px',
                        slidesToShow: 1//yes 1 in this case
                    }
                }
            ]
        });

    };

    this.post = function (url, data, doneCallback, failureCallback) {

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: url, // the url where we want to POST
            data: data, // our data object
            //dataType: 'json' // what type of data do we expect back from the server
        })
                // using the done promise callback
                .done(function (data) {
                    if (typeof doneCallback === "function") {
                        doneCallback(data);
                    }
                })
                // using the fail promise callback
                .fail(function (data, r, error) {
                    if (typeof failureCallback === "function") {
                        failureCallback(data, r, error);
                    }
                });
    };

    this.postForm = function (form, doneCallback, failureCallback) {

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: form.action, // the url where we want to POST
            data: $(form).serialize(), // our data object
            //dataType: 'json' // what type of data do we expect back from the server
        })
                // using the done promise callback
                .done(function (data) {
                    if (typeof doneCallback === "function") {
                        doneCallback(data);
                    }
                })
                // using the fail promise callback
                .fail(function (data, r, error) {
                    if (typeof failureCallback === "function") {
                        failureCallback(data, r, error);
                    }
                });
    };

    this.dynamicPageLoadCallback = {};

    /**This function is called when a page is loaded dynamically.
     * This method is the preferred place to code for processing 
     * dynamic pages (such as click events or any event) in this 
     * ChurcApp by passing function to it which will be called 
     * back whenever a dynamic page is loaded.
     * 
     * @param {type} callback
     * @returns {undefined}
     */
    this.onDynamicPageLoaded = function (callbackFunc) {
        this.dynamicPageLoadCallback = callbackFunc;
    };

    handleDynamicPageLoad = function (selector) {
        if (typeof ChurchApp.dynamicPageLoadCallback === "function") {
            ChurchApp.dynamicPageLoadCallback(selector);
        }
    };

    this.cdMin = 3;
    this.cdSec = 0;
    this.cdTimerId = 0;
    this.countDownAuthFinished = false;
    this.inactivit_timeout_msg = "Sorry, your inactivity has timeout.<br/>Operation disabled!";
    this.inactivit_timeout_browser_msg = "Sorry, your inactivity has timeout.Operation disabled!";

    initCountDownToAuth = function (inactivityTimeout) {
        if (!ChurchApp.countDownAuthFinished) {
            calculateCountDownTimeout(inactivityTimeout);
        }
    };

    calculateCountDownTimeout = function (inactivityTimeout) {
        var timeout = Number(inactivityTimeout);
        if (!isNaN(timeout)) {
            ChurchApp.cdMin = parseInt(timeout / 60);
            ChurchApp.cdSec = timeout - ChurchApp.cdMin * 60;
        }
    };

    startCountDownToAuth = function (selector, inactivityTimeout) {
        //first clear previous timer
        if (ChurchApp.cdTimerId !== 0) {
            window.clearInterval(ChurchApp.cdTimerId);
        }

        calculateCountDownTimeout(inactivityTimeout);
        ChurchApp.cdTimerId = 0;
        ChurchApp.countDownAuthFinished = false;
        var countdown = selector.find("[name=countdown_to_auth]");
        ChurchApp.cdTimerId = window.setInterval(function () {
            countdown.html(ChurchApp.cdMin + ":" + (ChurchApp.cdSec < 10 ? "0" : "") + ChurchApp.cdSec);
            if (ChurchApp.cdMin <= 0 && ChurchApp.cdSec <= 0) {
                ChurchApp.countDownAuthFinished = true;
                countdown.attr({style: "color:red;"});
                window.clearInterval(ChurchApp.cdTimerId);
                var obj = $(selector).find("[name=display_msg]");
                obj.html(ChurchApp.inactivit_timeout_msg);
                obj.attr({style: "color:red;"});
                //$(selector).find("[type=submit]").attr("disabled",true);//come back for you later!!!
                return;
            }
            if (ChurchApp.cdSec > 0 && ChurchApp.cdMin >= 0) {
                ChurchApp.cdSec--;
            } else if (ChurchApp.cdSec === 0 && ChurchApp.cdMin > 0) {
                ChurchApp.cdSec = 59;
                ChurchApp.cdMin--;
            }
        }, 1000);
    };

    this.alertResponse = function (json, use_default_msg) {

        if (use_default_msg && json.msg !== '' && json.msg !== 'null') {
            alert(json.msg);
            return;
        }

        if (json.status === "success") {
            alert("The operation was successful.");
        } else if (json.status === "warning") {
            alert("Messsage recieved from the server with warning.");
        } else if (json.status === "ignore") {
            alert("The operation was ignored.");
        } else if (json.status === "error") {
            alert("An error occur!");
        } else if (json.status === "session_not_available") {
            alert("Your session is no longer available.<br/>You may have to login again.");
        }
    };

    this.comboxPopulate = function (id, arr) {
        var d = document.getElementById(id);
        for (var i = 1; i < d.length; i++) {//from from index 1 by default
            d.remove(i);
        }

        for (var i = 0; i < arr.length; i++) {
            var opt = document.createElement("option");
            opt.text = arr[i];
            opt.value = arr[i];//come back

            d.add(opt);
        }
    };

    tableActionOptionMenuPopup = function (tablePageObj, index) {

        var markup = '<div data-role="popup" data-theme="b">'
                + '<ul data-role="listview" data-inset="true" style="min-width:13.125em;">'
                + '<li data-role="list-divider">Choose an action</li>'
                + '<li><a href="#">View Only</a></li>'
                + '<li><a href="#">Edit</a></li>'
                + '<li><a href="#">Delete</a></li>'
                + '</ul>'
                + '</div>';

        var pup = $(markup)
                .appendTo($.mobile.activePage)
                .popup();

        $(pup).trigger('create');

        var selecetOpt = {name: ""};

        $(pup).on("popupafterclose", function () {
            //alert("pop up remove to manage DOM size");//may be not removing
            $(this).remove();

            setTimeout(function () {//workaround recommended by jQM to open popup from another popup
                if (selecetOpt.name === 'View Only') {
                    tableViewOnlyPopup(tablePageObj, index);
                } else if (selecetOpt.name === 'Edit') {
                    tableAuthPopup('Edit', tablePageObj, index);
                } else if (selecetOpt.name === 'Delete') {
                    tableAuthPopup('Delete', tablePageObj, index);
                }
            }, 100);

        });

        $(pup).on('click', 'li a', function () {
            selecetOpt.name = $(this).html();
            $(pup).popup("close");
        });

        $(pup).popup("open");

    };

    tableEditPopup = function (tablePageObj, index) {
        //alert("pop  edit");
        var fieldValues = tablePageObj.tableData[index];
        //alert(json.data.table_data[index]);
        var form_html = creatFormFieldHTML(tablePageObj.tableColumns, fieldValues, tablePageObj.updateUrl);
        var popup_title = "Edit record";//come back later
        var closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
                header = '<div data-role="header"><div name="countdown_to_auth">-:--</div><h2>' + popup_title + '</h2></div>',
                popup = '<div data-role="popup" data-overlay-theme="b" data-tolerance="15"></div>',
                footer = '<div data-role="footer"><div class="ui-content" style="font-size:0.75em;"><div name="attempts_update">'
                + ChurchApp.attempts_update + ChurchApp.attempts_update_msg_append + '</div><div name="failed_auth">'
                + ChurchApp.failed_auth + ChurchApp.failed_auth_msg_append + '</div></div></div>';

        // Create the popup.
        var popup = $(popup)
                .appendTo($.mobile.activePage)
                .popup();

        $(header)
                .appendTo(popup)
                .toolbar()
                .before(closebtn)
                .after(form_html);

        $(footer)
                .appendTo(popup)
                .toolbar();

        $(popup).trigger('create');


        $(popup).on("popupafteropen", function () {//confirm later
            startCountDownToAuth($(popup), tablePageObj.inactivityTimeout);
        });

        $(popup).on("popupafterclose", function () {//confirm later
            $(this).remove();
            clearInterval(ChurchApp.cdTimerId);
        });

        $(popup).on('keyup', function (evt) {
            initCountDownToAuth(tablePageObj.inactivityTimeout);
        });

        $(popup).on('mousemove', function (evt) {
            initCountDownToAuth(tablePageObj.inactivityTimeout);
        });

        $(popup).find("form").validate({
            //validation rules
            rules: tablePageObj.validationRules,
            //custom validation message
            messages: tablePageObj.validationMessages,
            submitHandler: function (form) {
                if (ChurchApp.countDownAuthFinished) {
                    alert(ChurchApp.inactivit_timeout_browser_msg);
                    return;//do nothing!
                }

                ChurchApp.attempts_update++;

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail
                            alert("error");//testing!!!
                        });

                $(popup).find("[name=attempts_update]").html(ChurchApp.attempts_update + ChurchApp.attempts_update_msg_append);
            }

        });

        $(popup).popup("open");

    };

    tableDeletePopup = function (tablePageObj, index) {

        var fieldValues = tablePageObj.tableData[index];
        var html = createUnEditedFieldHTML(tablePageObj.tableColumns, fieldValues, tablePageObj.deleteUrl);
        var popup_title = "Delete record";//come back later
        var closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
                header = '<div data-role="header"><div name="countdown_to_auth">-:--</div><h2>' + popup_title + '</h2></div>',
                popup = '<div data-role="popup" data-overlay-theme="b" data-tolerance="15"></div>',
                footer = '<div data-role="footer"><div class="ui-content" style="font-size:0.75em;"><div name="attempts_delete">'
                + ChurchApp.attempts_delete + ChurchApp.attempts_delete_msg_append + '</div><div name="failed_auth">'
                + ChurchApp.failed_auth + ChurchApp.failed_auth_msg_append + '</div></div></div>';

        // Create the popup.
        var popup = $(popup)
                .appendTo($.mobile.activePage)
                .popup();


        $(header)
                .appendTo(popup)
                .toolbar()
                .before(closebtn)
                .after(html);

        $(footer)
                .appendTo(popup)
                .toolbar();

        $(popup).trigger('create');

        $(popup).on("popupafteropen", function () {//confirm later
            startCountDownToAuth($(popup), tablePageObj.inactivityTimeout);
        });

        $(popup).on('keyup', function (evt) {
            initCountDownToAuth(tablePageObj.inactivityTimeout);
        });

        $(popup).on('mousemove', function (evt) {
            initCountDownToAuth(tablePageObj.inactivityTimeout);
        });

        $(popup).on("popupafterclose", function () {//confirm later
            $(this).remove();
            clearInterval(ChurchApp.cdTimerId);
        });

        $(popup).on('submit', 'form', function (evt) {
            evt.preventDefault();
            if (ChurchApp.countDownAuthFinished) {
                alert(ChurchApp.inactivit_timeout_browser_msg);
                return;//do nothing!
            }

            ChurchApp.attempts_delete++;

            ChurchApp.postForm($(this),
                    function (data) {//done
                        alert(data);
                    },
                    function (data, r, error) {//fail
                        alert("error");//testing!!!
                    });

            $(popup).find("[name=attempts_delete]").html(ChurchApp.attempts_delete + ChurchApp.attempts_delete_msg_append);
            alert("submit");
        });

        $(popup).popup("open");
    };

    tableViewOnlyPopup = function (tablePageObj, index) {
        var fieldValues = tablePageObj.tableData[index];
        var html = createUnEditedFieldHTML(tablePageObj.tableColumns, fieldValues, '');
        var popup_title = "View Only";//come back later
        var closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
                header = '<div data-role="header"><h2>' + popup_title + '</h2></div>',
                popup = '<div data-role="popup" data-overlay-theme="b" data-tolerance="15"></div>';

        // Create the popup.
        var popup = $(popup)
                .appendTo($.mobile.activePage)
                .popup();

        $(header)
                .appendTo(popup)
                .toolbar()
                .before(closebtn)
                .after(html);

        $(popup).trigger('create');

        $(popup).on("popupafterclose", function () {//confirm later
            alert("pop up remove to manage DOM size");//may be not removing
            $(this).remove();
        });

        $(popup).popup("open");

    };

    tableAuthPopup = function (action, tablePageObj, index) {

        var auth_form_html = '<div data-role="popup" data-theme="a" class="ui-corner-all">'
                + '<form action="php/AuthRecordsModify.php">'
                + '<div style="padding:10px 20px;">'
                + '<h3>Authentication</h3>'
                + '<p>' + action + ' operation requires authentication...</p>'
                + '<label for="record_modify_username" class="ui-hidden-accessible">Username:</label>'
                + '<input type="text" name="record_modify_username" value="" placeholder="username" data-theme="a" />'
                + '<label for="record_modify_password" class="ui-hidden-accessible">Password:</label>'
                + '<input type="password" name="record_modify_password" value="" placeholder="password" data-theme="a" />'
                + '<p name="auth_feedback" style="color:red;"></p>'
                + '<button type="submit" data-theme="b">OK</button>'
                + '</div>'
                + '</form>'
                + '</div>';

        var popup = $(auth_form_html)
                .appendTo($.mobile.activePage)
                .popup();

        $(popup).trigger('create');
        $(popup).popup("open");

        var result = {
            success: false,
            action: action
        };

        $(popup).on('submit', 'form', function (evt) {
            evt.preventDefault();
            //alert(evt.target);
            ChurchApp.postForm(evt.target,
                    function (data) {
                        var json = JSON.parse(data);
                        if (json.status === "success") {
                            result.success = true;
                            $(popup).popup("close");
                        } else if (json.status === "error") {
                            $('[name=auth_feedback]').html(json.msg);
                            ChurchApp.failed_auth++;
                        } else if (json.status === "session_not_available") {
                            $('[name=auth_feedback]').html("Your session is no longer available!<br/>You may have to login again.");
                            ChurchApp.failed_auth++;
                        } else {
                            ChurchApp.failed_auth++;
                            ChurchApp.alertResponse(json);
                        }

                    },
                    function (data, r, error) {
                        //alert(data);
                    });
        });

        $(popup).on("popupafterclose", function () {
            //alert("pop up remove to manage DOM size");//may be not removing
            $(this).remove();

            if (result.success) {
                setTimeout(function () {//workaround recommended by jQM to open popup from another popup
                    if (result.action === 'Edit') {
                        tableEditPopup(tablePageObj, index);
                    } else if (result.action === 'Delete') {
                        tableDeletePopup(tablePageObj, index);
                    }
                }, 100);
            }

        });

    };

    this.renderTablePage = function (tablePageObj) {
        //data-church-table-name="table-view-page"
        $("#" + tablePageObj.pageId)
                .find("[data-church-table-name=table-view-page]").html(tablePageObj.headerTitle);

        $("#" + tablePageObj.pageId).attr("data-title", tablePageObj.pageTitle);//not working

        $('div[data-role="page"]').bind("pageshow", function () {
            if ($.mobile.activePage.attr("id") === tablePageObj.pageId) {
                document.title = tablePageObj.pageTitle;
            }
        });

        var table_html = ChurchApp.createTableHtml(tablePageObj.tableTitle, tablePageObj.tableColumns, tablePageObj.tableData, tablePageObj.style);
        $("#" + tablePageObj.pageId + " .ui-content").html(table_html);
        $("#" + tablePageObj.pageId).trigger('create');
        ChurchApp.handleTableAction(tablePageObj);
    };

    this.handleTableAction = function (tablePageObj) {

        $("#" + tablePageObj.pageId).on('dblclick', 'tr', function () {
            tableAction(tablePageObj, $(this), $("#" + tablePageObj.pageId + " tbody"));
        });

        $("#" + tablePageObj.pageId).on('taphold', 'tr', function () {
            tableAction(tablePageObj, $(this), $("#" + tablePageObj.pageId + " tbody"));
        });

    };

    tableAction = function (tablePageObj, row_wrapper, tbody) {

        var selected_row = $(row_wrapper)[0];

        $(tbody).find("tr").each(function (index, element) {
            if (selected_row === element) {
                tableActionOptionMenuPopup(tablePageObj, index);
            }
        });

    };

    creatFormFieldHTML = function (fieldLabels, fieldValues, formAction) {
        var html = '<div data-role="main" class="ui-content">'
                + '<h3 name="display_msg">You may edit the selected record.<h3>'
                + '<form action="' + formAction + '">';

        for (var i = 0; i < fieldLabels.length; i++) {
            html += '<label for="' + fieldLabels[i] + '" >'
                    + toSentenceCase(fieldLabels[i]) +
                    '</label><input data-clear-btn="true" name="'
                    + fieldLabels[i] + '" value="' + fieldValues[i] + '" type="text"/>';
        }
        html += '<input type="submit" value="Update"/></form></div>';
        return html;
    };

    createUnEditedFieldHTML = function (fieldLabels, fieldValues, formAction) {
        var html = '<div data-role="main" class="ui-content">';
        if (formAction !== '') {
            html += "<h3 name='display_msg'>Confirm the record you have selected to delete.<h3>";
            html += "<form action='" + formAction + "'>";
        }
        for (var i = 0; i < fieldLabels.length; i++) {
            html += '<label for="' + fieldLabels[i] + '" >'
                    + toSentenceCase(fieldLabels[i]) +
                    '</label><input name="'
                    + fieldLabels[i] + '" value="' + fieldValues[i] + '" readonly type="text"/>';

        }
        if (formAction !== '') {
            html += '<input type="submit" value="Delete"/></form>';
        }
        html += '</div>';
        return html;
    };

    toSentenceCase = function (str) {
        var s = new String(str).toLowerCase();
        s = ChurchApp.Util.replaceAllChar(s, '_', ' ');
        s = s.substring(0, 1).toUpperCase() + s.substring(1);
        return s;
    };

    normalizeTableColumn = function (str) {
        var s = new String(str).toUpperCase();
        s = ChurchApp.Util.replaceAllChar(s, '_', ' ');
        return s;
    };

    this.assignParishToUser = function (obj) {
        $(":mobile-pagecontainer").pagecontainer("change", "#answer-parish-question-page", {
            transition: 'slide',
            //changeHash: false,
            // reverse: true,
            showLoadMsg: true
        });

        $(document).find("[data-name='hi-user-full-name']").each(function () {
            $(this).html(obj.fullName);
        });

        var s = $(document).find("[data-name='steps-away-from-sign-up-completion']");
        $(s).each(function (index, element) {
            $(this).show();
            if (obj.stepsAwayFromCompleteSignup === null) {
                $(this).hide();
            } else {
                $(this).html(obj.stepsAwayFromCompleteSignup);
            }
        });
    };

    this.renderAccountReconcile = function (obj) {

        if (typeof obj.reconcileTransactionButton === "string") {
            obj.reconcileTransactionButton = $("#" + obj.reconcileTransactionButton);
        }
        if (typeof obj.missingTransactionButton === "string") {
            obj.missingTransactionButton = $("#" + obj.missingTransactionButton);
        }
        if (typeof obj.unknownTransactionButton === "string") {
            obj.unknownTransactionButton = $("#" + obj.unknownTransactionButton);
        }
        if (typeof obj.conflictingTransactionButton === "string") {
            obj.conflictingTransactionButton = $("#" + obj.conflictingTransactionButton);
        }

        if (typeof obj.dataRenderDiv === "string") {
            obj.dataRenderDiv = $("#" + obj.conflictingTransactionButton);
        }

        var info_html = accountInfoHTML(obj);

        var main_html = "";

        if (obj.reconcileTransactionButton.is(":checked")) {
            main_html = reconcileTransactionHTML(obj);
        } else if (obj.missingTransactionButton.is(":checked")) {
            main_html = missingTransactionHTML(obj);
        } else if (obj.unknownTransactionButton.is(":checked")) {
            main_html = unknownTransactionHTML(obj);
        } else if (obj.conflictingTransactionButton.is(":checked")) {
            main_html = conflictingTransactionHTML(obj);
        }

        renderAccountReconcileView(obj.dataRenderDiv, info_html, main_html);

        obj.reconcileTransactionButton.on("click", function () {
            main_html = reconcileTransactionHTML(obj);
            renderAccountReconcileView(obj.dataRenderDiv, info_html, main_html);
        });

        obj.missingTransactionButton.on("click", function () {
            main_html = missingTransactionHTML(obj);
            renderAccountReconcileView(obj.dataRenderDiv, info_html, main_html);
        });

        obj.unknownTransactionButton.on("click", function () {
            main_html = unknownTransactionHTML(obj);
            renderAccountReconcileView(obj.dataRenderDiv, info_html, main_html);
        });

        obj.conflictingTransactionButton.on("click", function () {
            main_html = conflictingTransactionHTML(obj);
            renderAccountReconcileView(obj.dataRenderDiv, info_html, main_html);
        });

    };

    renderAccountReconcileView = function (container, info, main) {
        container.html(info + main);
        container.trigger('create');//enhance the view
    };

    accountInfoHTML = function (obj) {
        if (obj.bankName === null
                && obj.accountName === null
                && obj.accountNo === null
                && obj.statementPeriod === null) {
            return "";
        }

        return  '<div class="ui-grid-a">'
                + '<div class="ui-block-a">'
                + '<div class="ui-grid-b">'
                + '<div class="ui-block-a" style="font-family: fantasy; font-size: 12px; font-weight: bold; ">'
                //the bank name
                + obj.bankName
                + '</div>'
                + '<div class="ui-block-b" style="font-size: 12px; font-weight: 400;">'
                //the acc name
                + obj.accountName
                + '</div>'
                + '<div class="ui-block-c" style="font-size: 12px; font-weight: 700;">'
                //the acc no.
                + obj.accountNo
                + '</div>'
                + '</div>'

                + '</div>'
                + '<div class="ui-block-b" style="text-align: center;">'
                //the statement peroid
                + obj.statementPeriod
                + '</div>'
                + '</div>';
    };

    CrDrHTML = function (credit, dedit) {
        return "<div>" + "<span style='color:green; margin-top:0.5em; margin-bottom:0.5em;'>" + credit + "</span>(CR) , "
                + "<span style='color:red; margin-top:0.5em; margin-bottom:0.5em;'>" + dedit + "</span>(DR)" + "</div>";
    };

    twoColumnsGridHTML = function (html1, html2) {
        return '<div class="ui-grid-a ui-responsive">'
                + '<div class="ui-block-a">'
                + html1
                + '</div>'
                + '<div class="ui-block-b">'
                + html2
                + '</div>'
                + '</div>';
    };

    reconcileTransactionHTML = function (obj) {


    };

    missingTransactionHTML = function (obj) {

        //transaction in the banstatement but not in cash book

        var html = '<table data-role="table" data-mode="reflow" class="ui-responsive  table-report-view">';

        html += tableHeadHTML(obj.bankStatementColumns);

        html += "<tbody>";
        var t_cr = 0;
        var t_dr = 0;

        for (var i = 0; i < obj.bankStatementData.length; i++) {

            var bnk_code = obj.bankStatementData[i][1];
            var bnk_dr = obj.bankStatementData[i][3];
            var bnk_cr = obj.bankStatementData[i][4];
            var cb_dr = 0;
            var cb_cr = 0;
            var found = false;
            for (var k = 0; k < obj.cashBookData.length; k++) {
                var cb_code = obj.cashBookData[k][1];

                if (bnk_code === cb_code) {
                    cb_dr = obj.cashBookData[k][3];
                    cb_cr = obj.cashBookData[k][4];
                    found = true;
                    break;
                }
            }

            if (found) {
                t_cr += bnk_cr;
                t_dr += bnk_dr;
                html += tableRowsHTML(obj.bankStatementData[i]);
            }

        }

        html += "</tbody></table>";

        return CrDrHTML(t_cr, t_dr) + html;
    };

    unknownTransactionHTML = function (obj) {

        //transaction in the cash book but not in bank statement

        var html = '<table data-role="table" data-mode="reflow" class="ui-responsive  table-report-view">';

        html += tableHeadHTML(obj.cashBookColumns);

        html += "<tbody>";

        var t_cr = 0;
        var t_dr = 0;

        for (var i = 0; i < obj.cashBookData.length; i++) {

            var cb_code = obj.cashBookData[i][1];
            var cb_dr = obj.cashBookData[i][3];
            var cb_cr = obj.cashBookData[i][4];
            var bnk_dr = 0;
            var bnk_cr = 0;
            var found = false;

            for (var k = 0; k < obj.bankStatementData.length; k++) {

                var bnk_code = obj.bankStatementData[k][1];

                if (bnk_code === cb_code) {
                    bnk_dr = obj.bankStatementData[k][3];
                    bnk_cr = obj.bankStatementData[k][4];
                    found = true;
                    break;
                }
            }

            if (found) {
                t_cr += cb_dr;// t_cr is credit on the bank but debit in cash book - correct!
                t_dr += cb_cr;// t_dr is debit on the bank but credit in cash book - correct!
                html += tableRowsHTML(obj.cashBookData[i]);
            }
        }

        html += "</tbody></table>";

        return CrDrHTML(t_cr, t_dr) + html;
    };

    conflictingTransactionHTML = function (obj) {

        //transaction in the cash book whose tran code matchs one the the bank
        //statement but the figure in the credit/debit column of the cash book 
        //is not equal to the corresponding debit/credit column of the bank statement.

        var cb_html = '<table data-role="table" data-mode="reflow" class="ui-responsive  table-report-view">';
        cb_html += tableHeadHTML(obj.cashBookColumns);
        cb_html += "<tbody>";

        var bk_html = '<table data-role="table" data-mode="reflow" class="ui-responsive  table-report-view">';
        bk_html += tableHeadHTML(obj.bankStatementColumns);
        bk_html += "<tbody>";


        var t_cr = 0;
        var t_dr = 0;

        for (var i = 0; i < obj.bankStatementData.length; i++) {

            var bnk_code = obj.bankStatementData[i][1];
            var bnk_dr = obj.bankStatementData[i][3];
            var bnk_cr = obj.bankStatementData[i][4];

            for (var k = 0; k < obj.cashBookData.length; k++) {
                var cb_code = obj.cashBookData[k][1];
                var cb_dr = obj.cashBookData[k][3];
                var cb_cr = obj.cashBookData[k][4];

                if (bnk_code === cb_code && bnk_dr !== cb_cr) {
                    t_dr += cb_cr;
                    t_cr += cb_dr;
                    cb_html += tableRowsHTML(obj.cashBookData[k]);
                }

                //important
                if (bnk_code === cb_code && bnk_cr !== cb_dr) {
                    t_dr += cb_cr;
                    t_cr += cb_dr;
                    bk_html += tableRowsHTML(obj.bankStatementData[i]);
                }
            }

        }

        cb_html += "</tbody></table>";
        bk_html += "</tbody></table>";

        return CrDrHTML(t_cr, t_dr) + twoColumnsGridHTML(cb_html, bk_html);

    };

    this.DisplayStyle = {A: 1, B: 2, C: 3, D: 4, E: 5};

    this.createTableHtml = function (tableTitle, tableColumns, tableData, display_style, table_id) {
        switch (display_style) {
            case this.DisplayStyle.A:
                return create_Style_A_Table_Html(tableTitle, tableColumns, tableData, table_id);
            case this.DisplayStyle.B:
                return create_Style_B_Table_Html(tableTitle, tableColumns, tableData, table_id);
            case this.DisplayStyle.C:
                return create_Style_C_Table_Html(tableTitle, tableColumns, tableData, table_id);
            case this.DisplayStyle.D:
                return create_Style_D_Table_Html(tableTitle, tableColumns, tableData, table_id);
            case this.DisplayStyle.E:
                return create_Style_E_Table_Html(tableTitle, tableColumns, tableData, table_id);

            default :
                return create_Style_A_Table_Html(tableTitle, tableColumns, tableData, table_id);
        }

        return "";
    };

    function tableHeadHTML(columns) {
        var th = "";
        for (var i = 0; i < columns.length; i++) {
            th += "<th data-priority='" + (i + 1) + "'>" + normalizeTableColumn(columns[i]) + "</th>";
        }

        if (th !== "") {
            return "<thead><tr>" + th + "</tr></thead>";
        }
        return "";
    }

    function tableRowsHTML(row) {
        var tr = "";
        for (var k = 0; k < row.length; k++) {
            tr += "<td>" + row[k] + "</td>";
        }
    }

    function create_Style_A_Table_Html(tableTitle, tableColumns, tableData, table_id) {
        var id_attr = "";
        if (table_id !== "" && table_id !== null) {//TODO: confirm later
            id_attr = 'id="' + table_id + '"';

        }
        var table_html = '<table data-role="table" ' + id_attr + ' data-mode="reflow" class="ui-responsive  table-report-view">';

        var caption = "";
        var thead = "";
        var tbody = "";

        if (tableTitle !== "") {
            caption = "<caption>" + tableTitle + "</caption>";
        }

        var columns = tableColumns;
        var th = "";
        for (var i = 0; i < columns.length; i++) {
            th += "<th data-priority='" + (i + 1) + "'>" + normalizeTableColumn(columns[i]) + "</th>";
        }

        if (th !== "") {
            thead = "<thead><tr>" + th + "</tr></thead>";
        }

        var rows = tableData;

        for (var i = 0; i < rows.length; i++) {
            var td = "";
            for (var k = 0; k < rows[i].length; k++) {
                td += "<td>" + rows[i][k] + "</td>";
            }
            if (td !== "") {
                tbody += "<tr>" + td + "</tr>";
            }
            if (i === rows.length - 1) {
                tbody = "<tbody>" + tbody + "</tbody>";
            }
        }

        if (thead === "" && tbody === "")
            return "";//no columns and data 

        table_html += caption + thead + tbody + "</table>";

        return table_html;
    }

    function create_Style_B_Table_Html(tableTitle, tableColumns, tableData, table_id) {

        //TODO
    }

    function create_Style_C_Table_Html(tableTitle, tableColumns, tableData, table_id) {
        //TODO

    }

    function create_Style_D_Table_Html(tableTitle, tableColumns, tableData, table_id) {
        //TODO

    }

    function create_Style_E_Table_Html(tableTitle, tableColumns, tableData, table_id) {
        //TODO

    }


    /**
     * The generalNewsObject is a json object (or any javascript object) which holds the list of news group in a json array.<br/>
     * The element of the json array is a news grpup.<br/>
     * The news group is a json array of related news items.<br/>
     * Each news item consist of one or more of the following properties listed below:<br/><br/>
     * 
     * newsId - an id that identifies the news.<br/>
     * newsDate  - the date recorded when the new was posted. e.g Tuesday, October 5, 2010 <br/>
     * newsTime  - the time recorded when the new was posted e.g 12 PM.<br/>
     * newsTitle - the title of the news.<br/>
     * newsImages - a number of image urls seperated by comma. 
     *              if the image is more than one the implemetation may display them in slide. <br/>
     * newsIntro - The news introduction that should be emphasized after title(header)<br/>
     * newsBody - the main news content.<br/>
     * newsLength - Length of the news intro plus news body. Usually used to determine 
     *              if the news body should be followed by a "More>>" link<br/>
     * 
     * @param {type} newsJson
     * @param {type} display_style - the new format style: e.g A,B,C,D,E
     * @returns {string}
     */
    this.createNewsHtml = function (newsJson, display_style) {
        switch (display_style) {
            case this.DisplayStyle.A:
                return create_Style_A_News_Html(newsJson);
            case this.DisplayStyle.B:
                return create_Style_B_News_Html(newsJson);
            case this.DisplayStyle.C:
                return create_Style_C_News_Html(newsJson);
            case this.DisplayStyle.D:
                return create_Style_D_News_Html(newsJson);
            case this.DisplayStyle.E:
                return create_Style_E_News_Html(newsJson);
        }

        return "";
    };

    create_Style_A_News_Html = function (newsObj) {
        var newsGroupList = newsObj.newsGroupList;//array of news group objects
        var news_html = '<ul data-role="listview" data-inset="true">';
        for (var i = 0; i < newsGroupList.length; i++) {
            var news_group = newsGroupList[i];
            var title_html = "";
            var time_html = "";
            var body_html = "";
            var image_html = "";
            var intro_html = "";

            for (var k = 0; k < news_group.length; k++) {
                var news_item = news_group[k];
                if (k === 0) {
                    var date_header_html = '<li data-role="list-divider">' + news_item.newsDate + ' <span class="ui-li-count">' + news_group.length + '</span></li>';
                    news_html += date_header_html;
                }

                title_html = '<h2>' + news_item.newsTitle + '</h2>';
                time_html = '<p class="ui-li-aside"><strong>' + news_item.newsTime + '</strong>' + news_item.newsTimeAMPM + '</p>';
                body_html = '<div style="white-space: normal; font-size: 12px;">' + news_item.newsBody + '</div>';

                image_html = '';

                if (news_item.newsImages.length > 0) {
                    var news_image = news_item.newsImages[0];// for now use the first image. come back for slide approach where all the image will be used for slide.
                    image_html = '<img src=' + news_image + ' width="300" height="300" alt="N/A"/>';
                }

                intro_html = "";

                if (news_item.newsIntro !== "") {
                    intro_html = '<p style="white-space: normal;"><strong>' + news_item.newsIntro + '</strong></p>';
                }

                news_html += '<li style="padding: 10px;">';
                news_html += title_html + time_html + image_html + intro_html + body_html;
                news_html += '</li>';
            }


        }

        news_html += '</ul>';

        return news_html;
    };


    function create_Style_B_News_Html(newsJson) {
        //TODO

    }


    function create_Style_C_News_Html(newsJson) {
        //TODO

    }

    function create_Style_D_News_Html(newsJson) {
        //TODO

    }

    function create_Style_E_News_Html(newsJson) {
        //TODO

    }

    function createCarouselHTML(obj) {
        var width = 400;
        if (obj.carouselImages.length === 2) {
            width = 600;
        } else if (obj.carouselImages.length === 1) {
            width = 1200;
        }

        var html = "";
        for (var i = 0; i < obj.carouselImages.length; i++) {
            var img_url = obj.carouselImages[i];
            html += '<div><img src="' + img_url + '" width="' + width + '" height="300" ></img></div>';
        }

        if (html !== "") {
            html = "<div class='home-page-carousel'>" + html + "</div>";
        }

        return html;
    }

    this.inherit = function (proto) {
        function Foo() {
        }
        Foo.prototype = proto;
        return new Foo;
    };

    this.Member = function () {
        this.first_name = "";
        this.last_name = "";
        this.sex = "";
        this.age_range = "";
        this.birthday = "";
        this.address = "";
        this.phone_nos = "";
        this.occupation = "";
        this.nationality = "";
    };

    this.ChurchWorker = function () {
        this.prototype = this.inherit(new this.Member());
    };

//Paid worker
    this.ChurchStaff = function () {
        this.prototype = this.inherit(new this.ChurchWorker());
    };

    this.Admin = function () {
        this.prototype = this.inherit(new this.Member());

    };

    this.Exco = function () {
        this.prototype = this.inherit(new this.ChurchWorker());
    };

    this.MenExco = function () {
        this.prototype = this.inherit(new this.Exco());
    };

    this.WomenExco = function () {
        this.prototype = this.inherit(new this.Exco());
    };

    this.YouthExco = function () {
        this.prototype = this.inherit(new this.Exco());
    };

    this.Accountant = function () {
        this.prototype = this.inherit(new this.ChurchWorker());
    };

    this.Pastor = function () {
        this.prototype = this.inherit(new this.ChurchWorker());
    };

    this.AssociatePastor = function () {
        this.prototype = this.inherit(new this.Pastor());
    };

    this.AssistancePastor = function () {
        this.prototype = this.inherit(new this.Pastor());
    };

    this.ResidentPastor = function () {
        this.prototype = this.inherit(new this.Pastor());
    };

    this.VicePresident = function () {
        this.prototype = this.inherit(new this.Pastor());
    };

    this.President = function () {
        this.prototype = this.inherit(new this.Pastor());
    };

};


