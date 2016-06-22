/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * The recommend method process dynamic pages. validations,
 * and all necessary events should be handled here if the 
 * page was dynamically loaded.
 * @param {type} param
 */
ChurchApp.onDynamicPageLoaded(function (selector) {

    //we will have to remove all inline pages markup from the selector
    //and then append them to the body. this is because the content of this
    //selector is in another page and so that will render the inline pages
    //useless. we need to relocate them.
    var d = $(selector).find("[data-role='page']");//find the inline pages

    $(d).each(function () {
        var p = $(this);
        $(p).remove();//remove the intended inline page from this current page.
        $("body").append($(p));//append this intended inline page to the body so will can access it.
    });

    /*$("#test_table_click").on("click", function () {
     
     alert(selector.html());
     alert($("body").html());
     alert("test_table_click");
     
     });*/

});


$(document).ready(function () {

    $("#btn_next_parish_question").on("click", function () {

        if (document.getElementById('radio-choice-v-2a').checked
                || document.getElementById('radio-choice-v-2b').checked
                || document.getElementById('radio-choice-v-2c').checked
                || document.getElementById('radio-choice-v-2d').checked
                || document.getElementById('radio-choice-v-2e').checked
                || document.getElementById('radio-choice-v-2f').checked) {

            document.getElementById("next_parish_question_error").style.display = "none";

            document.getElementById("assign-to-parish-note").innerHTML = "If your selections above are correct your parish will be enlisted in the dropdown list below. Otherwise your parish is not yet registered with our service, so please check back later.";

            $("#assign-to-parish-explain").show();

            $("#assign-to-parish-under-national-cont").show();
            $("#assign-to-parish-under-region-cont").show();
            $("#assign-to-parish-under-province-cont").show();
            $("#assign-to-parish-under-zone-cont").show();
            $("#assign-to-parish-under-area-cont").show();

            ChurchApp.enableFindParishes = false;//disable for now - we don't want unnecessary requests sent to the server. 

            ChurchApp.comboBoxClear("assign-to-parish-under-national");
            ChurchApp.comboBoxClear("assign-to-parish-under-region");
            ChurchApp.comboBoxClear("assign-to-parish-under-province");
            ChurchApp.comboBoxClear("assign-to-parish-under-zone");
            ChurchApp.comboBoxClear("assign-to-parish-under-area");
            ChurchApp.comboBoxClear("assign-to-parish-name");

            if (document.getElementById('radio-choice-v-2a').checked) {

                document.getElementById("assign-to-parish-note").innerHTML = "If your selection above is correct your parish will be enlisted in the drop-down list below. Otherwise your parish is not yet registered with our service, so please check back later.";

                $("#assign-to-parish-under-region-cont").hide();
                $("#assign-to-parish-under-province-cont").hide();
                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-area-cont").hide();

            } else if (document.getElementById('radio-choice-v-2b').checked) {

                $("#assign-to-parish-under-province-cont").hide();
                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-area-cont").hide();

            } else if (document.getElementById('radio-choice-v-2c').checked) {

                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-area-cont").hide();

            } else if (document.getElementById('radio-choice-v-2d').checked) {
                $("#assign-to-parish-under-area-cont").hide();
            } else if (document.getElementById('radio-choice-v-2e').checked) {
                //do nothing.
            } else if (document.getElementById('radio-choice-v-2f').checked) {
                //do nothing also.
            }

            $(":mobile-pagecontainer").pagecontainer("change", "#assign-to-parish-question-page", {
                transition: 'slide',
                //changeHash: false,
                // reverse: true,
                showLoadMsg: true
            });

            ChurchApp.post("php/Divisions.php", "",
                    function (data) {
                        alert(data);
                        var json = JSON.parse(data);

                        if (json.status === "success") {
                            ChurchApp.enableFindParishes = true; //enable
                            ChurchApp.comboBoxPopulate("assign-to-parish-under-national", json.data.national);
                            ChurchApp.comboBoxPopulate("assign-to-parish-under-region", json.data.region);
                            ChurchApp.comboBoxPopulate("assign-to-parish-under-province", json.data.province);
                            ChurchApp.comboBoxPopulate("assign-to-parish-under-zone", json.data.zone);
                            ChurchApp.comboBoxPopulate("assign-to-parish-under-area", json.data.area);
                        } else {
                            ChurchApp.alertResponse(json);
                        }
                    },
                    function (data, r, error) {

                    });

        } else {
            document.getElementById("next_parish_question_error").style.display = "block";
        }
    });


    $("#assign-to-parish-under-national").on("change", function () {
        ChurchApp.parishesOnDivisionChange();
    });

    $("#assign-to-parish-under-region").on("change", function () {
        ChurchApp.parishesOnDivisionChange();
    });

    $("#assign-to-parish-under-province").on("change", function () {
        ChurchApp.parishesOnDivisionChange();
    });

    $("#assign-to-parish-under-zone").on("change", function () {
        ChurchApp.parishesOnDivisionChange();
    });

    $("#assign-to-parish-under-area").on("change", function () {
        ChurchApp.parishesOnDivisionChange();
    });


    $(document).on("pagecontainerbeforeshow", function (event, ui) {

        if (ChurchApp.Util.endsWithStr(ui.toPage[0].baseURI, "/authorization.html")) {
            
            if (ChurchApp.userPivilegeFeatures === null) {
                
                $.mobile.loading("show", {
                    text: "Retrieving users privileges. Please wait... ",
                    textVisible: true,
                    theme: "a",
                    textonly: false,
                    html: ""
                });
                
                ChurchApp.post("php/GetPrivilegeHomePages.php", {},
                        function (data) {
         
                            var json = JSON.parse(data);
                            if (json.status === "success") {
                                ChurchApp.createUserPrivilegeFeatures(json.data);
                                $.mobile.loading("hide");
                            } else if (json.status === "error") {
                                $.mobile.loading("hide");
                                ChurchApp.alertResponse(json, true);
                            } else {
                                $.mobile.loading("hide");
                                ChurchApp.alertResponse(json);
                            }
                        },
                        function (data, r, error) {
                            $.mobile.loading("hide");
                        })
            }
        }
    });

    /**
     * Use this method to process events for the case of pages
     *  that are not dynamically created.
     *  
     *  WARNING!!! DO NOT USE THIS METHOD TO PROCESS EVENTS IF THE
     *  PAGE CONTENT WAS CREATED DYNAMICALLY. USE onDynamicPageLoaded(callbackFunc) 
     *  FUNCTION OF THE ChurchApp INSTEAD.
     *  
     */
    $(document).bind("pagecreate", function (e, data) {

        // $("#home-page-admin-content").html("see the news content");

        ChurchApp.adminVerifyCode.init();

        //custom validation to enter fields that are visible and require entry.
        jQuery.validator.addMethod("enterFieldShowing", function (value, element) {
            return !($(element).is(":visible") && value === "");
        }, 'Please enter this field.');

        jQuery.validator.addMethod("checkVerificationCode", function (value, element) {
            return ChurchApp.adminVerifyCode.code === value && value !== "";
        }, 'Invalid Verification Code.');

        jQuery.validator.addMethod("checkUsernameVerificationCodePair", function (value, element) {
            return (ChurchApp.adminVerifyCode.username === value
                    && value !== "")
                    || ChurchApp.adminVerifyCode.username === "";
        }, 'Invalid Username/Verificaton-Code pair');

        jQuery.validator.addMethod("checkEmailVerificationCodePair", function (value, element) {
            return (ChurchApp.adminVerifyCode.email === value
                    && value !== "")
                    || ChurchApp.adminVerifyCode.email === "";
        }, 'Invalid Email/Verificaton-Code pair');

        jQuery.validator.addMethod("workaroundComboboxValidateEmpty", function (value, element) {
            //alert($("#"+$(element).attr("id")).val());
            return $("#" + $(element).attr("id")).val() !== "";
        }, 'Please select an item.');

        $("#btn-register-parish-admin-verify-email").on("click", function (evt) {

            if ($("#register-parish-admin-email").val() === "") {
                alert("Please enter email.");
                return;
            }

            if ($("#register-parish-admin-username").val() === "") {
                alert("Please enter username.");
                return;
            }

            if ($("#register-parish-admin-first-name").val() === "") {
                alert("Please enter first name.");
                return;
            }

            if ($("#register-parish-admin-last-name").val() === "") {
                alert("Please enter last name.");
                return;
            }

            //disable to prevent another operation until we receive feedback from the server
            $("#btn-register-parish-admin-verify-email").attr("disabled", true);

            $("#register-parish-admin-email-feedback").html("");



            $.mobile.loading("show", {
                text: "Sending verification code. Please wait... ",
                textVisible: true,
                theme: "a",
                textonly: false,
                html: ""
            });

            ChurchApp.post("php/SendAdminEmailVerify.php",
                    {
                        firstName: $("#register-parish-admin-first-name").val(),
                        lastName: $("#register-parish-admin-last-name").val(),
                        username: $("#register-parish-admin-username").val(),
                        email: $("#register-parish-admin-email").val(),
                    },
                    function (data) {//done

                        //alert(data);

                        //enable the operation
                        $("#btn-register-parish-admin-verify-email").attr("disabled", false);

                        $.mobile.loading("hide");
                        var json = JSON.parse(data);

                        if (json.status === "success") {

                            ChurchApp.adminVerifyCode.username = json.data.username;
                            ChurchApp.adminVerifyCode.email = json.data.email;
                            ChurchApp.adminVerifyCode.code = json.data.verificationCode;

                            document.getElementById("register-parish-admin-email-feedback").style.color = "black";
                            $("#register-parish-admin-email-feedback").html("Verification code  has been sent to your email!<br/>" +
                                    "Please enter in feild above.");
                        } else if (json.status === "error") {
                            document.getElementById("register-parish-admin-email-feedback").style.color = "red";
                            $("#register-parish-admin-email-feedback").html("Failed to send verification code!");
                        } else {
                            ChurchApp.alertResponse(json);
                        }

                    },
                    function (data, r, error) {//fail
                        $.mobile.loading("hide");
                        //enable the operation
                        $("#btn-register-parish-admin-verify-email").attr("disabled", false);

                    });
        });

        $("#authoriazation-search-user-next").on("click", function (evt) {
            var search_name = $("#authoriazation-search-user").val();
            ChurchApp.authorizeFindUser.findUser("next", search_name, 5);
        });

        $("#authoriazation-search-user-previous").on("click", function (evt) {
            var search_name = $("#authoriazation-search-user").val();
            ChurchApp.authorizeFindUser.findUser("previous", search_name, 5);
        });

        $("#authoriazation-search-user").on("keyup", function (evt) {
            var search_name = $("#authoriazation-search-user").val();
            ChurchApp.authorizeFindUser.findUser("", search_name, 5);
        });

        $("#authoriazation_save_changes").on("click", function () {
            if ($.trim($("#authorization_username").val()).length === 0)
            {
                alert("No user!");
                return;
            }
            var form = document.getElementById("authoriazation_form");
            ChurchApp.postForm(form,
                    function (data) {//done
                        alert(data);
                    },
                    function (data, r, error) {//fail

                    });
        });


        $("#monetary-add-bank-account-bank").on("click", function () {

            ChurchApp.post("php/get-bank-list.php",
                    {
                    },
                    function (data) {//done
                        var json = JSON.parse(data);
                        if (json.status === "success") {
                            ChurchApp.comboBoxPopulate("monetary-add-bank-account-bank", json.data);
                        }
                    },
                    function (data, r, error) {//fail

                    });
        });

        //assign to parish validation
        $("#assign-to-parish-form").validate({
            //validation rules
            rules: {
                "assign-to-parish-name": "required",
                "assign-to-parish-under-national": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "assign-to-parish-under-region": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "assign-to-parish-under-province": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "assign-to-parish-under-zone": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "assign-to-parish-under-area": {
                    enterFieldShowing: true, //custom validation method name - see above
                }
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.post(form.action,
                        {
                            parish_sn: $("#assign-to-parish-name").val(),
                            username: ChurchApp.SignUpInfo.username,
                            first_name: ChurchApp.SignUpInfo.firstName,
                            last_name: ChurchApp.SignUpInfo.lastName,
                            email: ChurchApp.SignUpInfo.email,
                        },
                        function (data) {//done

                            alert(data);

                            var json = JSON.parse(data);

                            if (json.status === "success") {
                                ChurchApp.verifyUserEmail(json.data);
                            } else {
                                ChurchApp.alertResponse(json, true);
                            }

                        },
                        function (data, r, error) {//fail

                        });
            }

        });

        //add bank validation
        $("#monetary-add-bank-form").validate({
            //validation rules
            rules: {
                "monetary-add-bank": "required"
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });

        //add bank account validation
        $("#monetary-add-bank-account-form").validate({
            //validation rules
            rules: {
                "monetary-add-bank-account-name": "required",
                "monetary-add-bank-account-no": "required",
                "monetary-add-bank-account-bank": "required",
                /*"monetary-add-bank-account-bank":{
                 workaroundComboboxValidateEmpty :true,  
                 }*/
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });

        //add denomination validation
        $("#monetary-add-denomination-form").validate({
            //validation rules
            rules: {
                "monetary-add-denomination": "required"
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });

        //add service income category validation
        $("#monetary-add-service-income-category-form").validate({
            //validation rules
            rules: {
                "monetary-add-service-income-category": "required"
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });


        //add income category validation
        $("#monetary-add-income-category-form").validate({
            //validation rules
            rules: {
                "monetary-add-income-category": "required"
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });

        //add expense category validation
        $("#monetary-add-expense-category-form").validate({
            //validation rules
            rules: {
                "monetary-add-expense-category": "required"
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });

        //parish register validation
        $("#register-parish-form").validate({
            //validation rules
            rules: {
                "register-parish-name": "required",
                "register-parish-address": "required",
                "register-parish-country": "required",
                "register-parish-admin-first-name": "required",
                "register-parish-admin-last-name": "required",
                "register-parish-admin-username": {
                    required: true,
                    minlength: 3,
                    checkUsernameVerificationCodePair: true, //custom validation method name - see above
                    remote: {
                        url: "php/check-username.php",
                        type: "post",
                        data: {
                            txt_sign_up_username: function () {
                                return $("#register-parish-admin-username").val();
                            }
                        }
                    }
                },
                "register-parish-admin-password": {
                    required: true,
                    minlength: 6
                },
                "register-parish-admin-email": {
                    required: true,
                    email: true,
                    checkEmailVerificationCodePair: true, //custom validation method name - see above
                },
                "register-parish-admin-password-again": {
                    required: true,
                    equalTo: "#register-parish-admin-password"
                },
                "register-parish-admin-email-verification-code": {
                    required: true,
                    checkVerificationCode: true, //custom validation method name - see above
                },
                "register-parish-division-name": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "register-parish-under-area": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "register-parish-under-zone": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "register-parish-under-province": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "register-parish-under-region": {
                    enterFieldShowing: true, //custom validation method name - see above
                },
                "register-parish-under-national": {
                    enterFieldShowing: true, //custom validation method name - see above
                }
            },
            //custom validation message
            messages: {
                "register-parish-admin-password-again": "Passwords did not match!",
                "register-parish-admin-username": {
                    remote: "Username already taken!"
                },
                "register-parish-admin-email": {
                    email: "Invalid email address - e.g name@domain.com"
                }
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            ChurchApp.adminVerifyCode.init();

                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });


        //cash book validation
        $("#cash-book-entry-form").validate({
            //validation rules
            rules: {
                cash_book_date: "required",
                cash_book_bank: "required",
                cash_book_account_name: "required",
                cash_book_description: "required",
                cash_book_account_no: "required",
                cash_book_tran_code: "required",
                cash_book_tran_type: "required",
                cash_book_amount: {
                    required: true,
                    min: 0
                },
            },
            //custom validation message
            messages: {
            },
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                        },
                        function (data, r, error) {//fail

                        });
            }

        });


        //sign up form validation
        $("#sign_up_form").validate({
            //validation rules
            rules: {
                txt_sign_up_first_name: "required",
                txt_sign_up_last_name: "required",
                txt_sign_up_username: {
                    required: true,
                    minlength: 3,
                    remote: {
                        url: "php/check-username.php",
                        type: "post",
                        data: {
                            txt_sign_up_username: function () {
                                return $("#txt_sign_up_username").val();
                            }
                        }
                    }
                },
                txt_sign_up_password: {
                    required: true,
                    minlength: 6
                },
                txt_sign_up_email: {
                    required: true,
                    email: true
                },
                txt_sign_up_password_again: {
                    required: true,
                    equalTo: "#txt_sign_up_password"
                }

            },
            //custom validation message
            messages: {
                txt_sign_up_password_again: "Passwords did not match!",
                txt_sign_up_username: {
                    remote: "Username already taken!"
                },
                txt_sign_up_email: {
                    email: "Invalid email address - e.g name@domain.com"
                }
            },
            //submit sign up form
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            var json = JSON.parse(data);
                            if (json.status === "success") {
                                ChurchApp.assignParishToUser({
                                    username: json.data.username,
                                    firstName: json.data.firstName,
                                    lastName: json.data.lastName,
                                    email: json.data.email,
                                    stepsAwayFromCompleteSignup: "Thank you! You are few steps alway from completing your signup process.",
                                });
                            } else {
                                ChurchApp.alertResponse(json, true);
                            }
                        },
                        function (data, r, error) {//fail

                        });
            }
        });


        //login validation
        $("#login_form").validate({
            //validation rules
            rules: {
                txt_login_username: "required",
                txt_login_password: "required"
            },
            //custom validation message
            messages: {
                txt_login_username: "Your username is required!",
                txt_login_password: "Your password is required!"
            },
            //submit login form
            submitHandler: function (form) {
                alert($(form).serialize());
                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
                            var json = JSON.parse(data);

                            if (json.status === "success") {
                                ChurchApp.loginByPriviledge(json.data);
                            } else {
                                ChurchApp.alertResponse(json, true);

                                ChurchApp.loginByPriviledge(//TESTING!!!
                                        {
                                            user: {group: "Admin", role: "super"}, //TESTING!!!
                                            carouselImages: ["img/images0.jpg", "img/images1.jpg", "img/images2.jpg", "img/images3.jpg", "img/images4.jpg", "img/images5.jpg"], //images                                          
                                            newsContent: newsContentTest()//TESTING!!!
                                        });
                            }

                        },
                        function (data, r, error) {//fail

                        });
            }

        });


    });
});
function newsContentTest() {
    return{
        newsGroupList: [[newsItemTest(1), newsItemTest(2), newsItemTest(3)],
            [newsItemTest(1), newsItemTest(2)]]
    };
}

function newsItemTest(n) {
    return{
        newsTitle: "The News Title " + n,
        newsImages: [""], //list of new images
        newsDate: "July 5, 2016",
        newsTime: "2:33",
        newsTimeAMPM: "PM",
        newsIntro: "The sun shall soon shine!",
        newsBody: "This is news content body - It says glorious days are ahead of us.This is news content body - It says glorious days are ahead of us.This is news content body - It says glorious days are ahead of us.",
    };
}
