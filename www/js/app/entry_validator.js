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

            $("#assign-to-parish-select").show();

            if (document.getElementById('radio-choice-v-2a').checked) {

                $("#assign-to-parish-select").hide();

                document.getElementById("assign-to-parish-note").innerHTML = "If your parish is not enlisted in the drop-down list below then it is not yet registered with our service, so please check back later.";

                $("#assign-to-parish-under-national-cont").hide();
                $("#assign-to-parish-under-national").val("");

                $("#assign-to-parish-under-region-cont").hide();
                $("#assign-to-parish-under-region").val("");

                $("#assign-to-parish-under-province-cont").hide();
                $("#assign-to-parish-under-province").val("");

                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-zone").val("");

                $("#assign-to-parish-under-area-cont").hide();
                $("#assign-to-parish-under-area").val("");

            } else if (document.getElementById('radio-choice-v-2b').checked) {

                document.getElementById("assign-to-parish-note").innerHTML = "If your selection above is correct your parish will be enlisted in the drop-down list below. Otherwise your parish is not yet registered with our service, so please check back later.";

                $("#assign-to-parish-under-national-cont").show();

                $("#assign-to-parish-under-region-cont").hide();
                $("#assign-to-parish-under-region").val("");

                $("#assign-to-parish-under-province-cont").hide();
                $("#assign-to-parish-under-province").val("");

                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-zone").val("");

                $("#assign-to-parish-under-area-cont").hide();
                $("#assign-to-parish-under-area").val("");

            } else if (document.getElementById('radio-choice-v-2c').checked) {
                $("#assign-to-parish-under-national-cont").show();
                $("#assign-to-parish-under-region-cont").show();

                $("#assign-to-parish-under-province-cont").hide();
                $("#assign-to-parish-under-province").val("");

                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-zone").val("");

                $("#assign-to-parish-under-area-cont").hide();
                $("#assign-to-parish-under-area").val("");

            } else if (document.getElementById('radio-choice-v-2d').checked) {
                $("#assign-to-parish-under-national-cont").show();
                $("#assign-to-parish-under-region-cont").show();
                $("#assign-to-parish-under-province-cont").show();

                $("#assign-to-parish-under-zone-cont").hide();
                $("#assign-to-parish-under-zone").val("");

                $("#assign-to-parish-under-area-cont").hide();
                $("#assign-to-parish-under-area").val("");

            } else if (document.getElementById('radio-choice-v-2e').checked) {
                $("#assign-to-parish-under-national-cont").show();
                $("#assign-to-parish-under-region-cont").show();
                $("#assign-to-parish-under-province-cont").show();
                $("#assign-to-parish-under-zone-cont").show();

                $("#assign-to-parish-under-area-cont").hide();
                $("#assign-to-parish-under-area").val("");

            } else if (document.getElementById('radio-choice-v-2f').checked) {
                $("#assign-to-parish-under-national-cont").show();
                $("#assign-to-parish-under-region-cont").show();
                $("#assign-to-parish-under-province-cont").show();
                $("#assign-to-parish-under-zone-cont").show();
                $("#assign-to-parish-under-area-cont").show();
            }

            $(":mobile-pagecontainer").pagecontainer("change", "#assign-to-parish-question-page", {
                transition: 'slide',
                //changeHash: false,
                // reverse: true,
                showLoadMsg: true
            });

            ChurchApp.post("php/Divisions.php", "",
                    function (data) {
                        var json = JSON.parse(data);
                        if (json.status === "success") {
                            ChurchApp.comboxPopulate("assign-to-parish-under-national", json.data.national);
                            ChurchApp.comboxPopulate("assign-to-parish-under-region", json.data.region);
                            ChurchApp.comboxPopulate("assign-to-parish-under-province", json.data.province);
                            ChurchApp.comboxPopulate("assign-to-parish-under-zone", json.data.zone);
                            ChurchApp.comboxPopulate("assign-to-parish-under-area", json.data.area);
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
        
        var data = $("#assign-to-parish-form").serialize();
        ChurchApp.post("php/FindParishs.php",data,
                function (data) {

                },
                function (data, r, error) {

                });
    });

    $("#assign-to-parish-under-region").on("change", function () {

    });

    $("#assign-to-parish-under-province").on("change", function () {

    });

    $("#assign-to-parish-under-zone").on("change", function () {

    });

    $("#assign-to-parish-under-area").on("change", function () {

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

        //custom validation to enter fields that are visible and require entry.
        jQuery.validator.addMethod("enterFieldShowing", function (value, element) {
            return !($(element).is(":visible") && value === "");
        }, 'Please enter this field.');


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

                ChurchApp.postForm(form,
                        function (data) {//done
                            alert(data);
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
                "monetary-add-bank-account-bank": "required",
                "monetary-add-bank-account-name": "required",
                "monetary-add-bank-account-no": "required"
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
                var full_name = $("#txt_sign_up_first_name").val() + " " + $("#txt_sign_up_last_name").val();
                ChurchApp.postForm(form,
                        function (data) {//done
                            var json = JSON.parse(data);
                            if (json.status === "success") {
                                ChurchApp.assignParishToUser(
                                        {
                                            fullName: full_name,
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

                ChurchApp.postForm(form,
                        function (data) {//done
                            //priviledgeGroup
                            if (data.status === "success") {
                                ChurchApp.loadHomePageByPriviledge(data);
                            } else {
                                ChurchApp.alertResponse(data, true);

                                ChurchApp.loadHomePageByPriviledge(//TESTING!!!
                                        {
                                            priviledgeGroup: "Admin", //TESTING!!!
                                            carouselImages: ["img/Chrysanthemum.jpg", "img/Desert.jpg"], //images                                          
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
