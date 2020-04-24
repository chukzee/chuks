
$(document).ready(function () {

    //NOTE: access via id since in home page
    $('#btn_find_ticket_owner').on('click', function (event) {
        if (!$('#txt_find_ticket_owner').val()) {
            return;
        }
        var url = $('#cnt_find_ticket_owner').attr('data-url');
        window.location = url + '?ticket=' + $('#txt_find_ticket_owner').val();
    });

    var acctAllDeviceSelector = '.computer.only.grid, .tablet.only.grid, .mobile.only.grid';

    $(acctAllDeviceSelector).on('change', 'form[data-el], input[data-el], textarea[data-el], select[data-el]', function (event) {

        var me = this;

        $(acctAllDeviceSelector)
                .find('[data-el="' + $(this).attr('data-el') + '"]').each(function () {

            console.log($(this).attr('data-el'));
            var orig;
            var target;
            if (me.tagName.toLowerCase() === 'form') {
                orig = me.querySelectorAll('[name]');
                target = this.querySelectorAll('[name]');
            } else {
                orig = [me];
                target = [this];
            }
            bindOriginToTarget(orig, target);

            function bindOriginToTarget(origs, targets) {
                for (var i = 0; i < origs.length; i++) {
                    for (var k = 0; k < targets.length; k++) {
                        if ($(origs[i]).attr('data-el')
                                && $(origs[i]).attr('data-el') === $(targets[k]).attr('data-el')) {
                            setTo(origs[i], targets[k]);
                        } else if ($(origs[i]).attr('name')
                                && $(origs[i]).attr('name') === $(targets[k]).attr('name')) {
                            if ($(origs[i]).attr('type') === $(targets[k]).attr('type')) {
                                setTo(origs[i], targets[k]);
                            }
                        }
                    }

                }
            }

            function setTo(o, t) {

                if (o.tagName.toLowerCase() === 'select' && o.tagName === t.tagName) {
                    if (('value' in o) && ('value' in t)) {
                        t.value = o.value;
                    }
                }

                if (o.tagName.toLowerCase() === 'input' && o.tagName === t.tagName) {
                    if (('value' in o) && ('value' in t)) {
                        t.value = o.value;
                    }
                    if (o.type === 'checkbox' || o.type === 'radio') {
                        if (('checked' in o) && ('checked' in t)) {
                            t.checked = o.checked;
                        }
                    }
                }

                if (o.tagName.toLowerCase() === 'textarea' && o.tagName === t.tagName) {

                    if ('value' in o) {
                        t.value = o.value;
                    }

                    if ('innerHTML' in o) {
                        t.innerHTML = o.innerHTML;
                    }

                    if ('innerText' in o) {
                        t.innerText = o.innerText;
                    }
                }
            }


        });

        return false;
    });


    $('[data-el="mobile_account_menu"]')
            .popup({
                position: 'bottom right',
                boundary: 'body, html',
                popup: $('[data-el="mobile_account_menu_list"]'),
                on: 'click'
            });


    $('[data-el="mobile_account_menu_list"]').on('click', function () {
        $('[data-el="mobile_account_menu"]')
                .popup('hide all');

    });



    function printTicket() {

    }

    function reloadPageOnExpiry(status) {
        if (status === 419 || status === 'unknown status') {
            window.location = window.location.href;
        }
    }

    function moveProgressBar(selector, percent, finished, error) {
        $(acctAllDeviceSelector).find(selector).each(function () {
            var width = percent;
            this.style.width = width + '%';
            this.innerHTML = width * 1 + '%';
            this.style.background = 'grey';
            if (finished) {
                this.style.background = '#4BB543';
            }
            if (error) {
                this.style.background = '#ED4337';
                if (typeof error === 'string') {
                    this.innerHTML = error;
                }
            }

        });
    }

    //$('[data-el="rangestart"]').calendar();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });



    $('.small_profile_photo').on('click', function () {

        var account_profile_view = document.querySelector('[data-el="account_profile_view"]');

        $('.tablet.only.grid, .mobile.only.grid').find('[data-el="account_content"]').each(function () {
            this.innerHTML = account_profile_view.outerHTML;
        });


    });

    $('.acct_mnu_btn').click(function () {
        $('.acct_mnu_btn').removeClass('active');
        $(this).addClass('active');
    });


    $('[data-el="account_main"]').on('click', function () {
        $('[data-el="account_content"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });


    $('[data-el="account_view"]').on('click', function () {
        $('[data-el="account_content"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });


    $('[data-el="account_edit"]').on('click', function () {
        $('[data-el="account_content"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });


    $('[data-el="account_register_keke"]').on('click', function () {
        $('[data-el="account_content"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });

    $('[data-el="account_settings"]').on('click', function () {
        $('[data-el="account_content"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });

    $('[data-el="account_help"]').on('click', function () {
        $('[data-el="account_content"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });


    //Find ticket owner
    $('[data-el="txt_acct_ticket_owner"]').on('keypress', function (event) {
        if (!$('[data-el="txt_acct_ticket_owner"]').val()) {
            return;
        }
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode !== 13) {
            return;//leave since not enter key
        }
        $('[data-el="account_content"]').addClass('loading');
        var url = $('[data-el="txt_acct_ticket_owner"]').attr('data-url');
        $.post(url,
                {
                    ticket: $('[data-el="txt_acct_ticket_owner"]').val()
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });

    $('[data-el="icn_acct_ticket_owner"]').on('click', function (event) {
        if (!$('[data-el="txt_acct_ticket_owner"]').val()) {
            return;
        }
        $('[data-el="account_content"]').addClass('loading');
        var url = $('[data-el="txt_acct_ticket_owner"]').attr('data-url');
        $.post(url,
                {
                    ticket: $('[data-el="txt_acct_ticket_owner"]').val()
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="account_content"]').html(data);
                    $('[data-el="account_content"]').removeClass('loading');
                });
    });

    $('[data-el="txt_find_ticket_owner"]').on('keypress', function (event) {
        if (!$('[data-el="txt_find_ticket_owner"]').val()) {
            return;
        }
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode !== 13) {
            return;//leave since not enter key
        }
        var url = $('[data-el="cnt_find_ticket_owner"]').attr('data-url');
        window.location = url + '?ticket=' + $('[data-el="txt_find_ticket_owner"]').val();
    });

    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_next"]', function () {
        $('[data-el="ticket_order_history_container"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('[data-el="ticket_order_history_container"]').html(data);
                    }
                    $('[data-el="ticket_order_history_container"]').removeClass('loading');

                });
    });

    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_prev"]', function () {
        $('[data-el="ticket_order_history_container"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('[data-el="ticket_order_history_container"]').html(data);
                    }
                    $('[data-el="ticket_order_history_container"]').removeClass('loading');
                });
    });


    //Edit Profile
    $('[data-el="account_content"]').on('click', '[data-el="btn_edit_profile_save_change"]', function () {
        $('[data-el="btn_edit_profile_save_change"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('[data-el="frm_edit_profile"]').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_edit_profile_save_change"]').removeClass('loading');
                });
    });


    //Register Keke
    $('[data-el="account_content"]').on('click', '[data-el="btn_register_keke"]', function () {
        $('[data-el="btn_register_keke"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('[data-el="frm_register_keke"]').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_register_keke"]').removeClass('loading');
                });
    });


    //Pre Buy Ticket
    $('[data-el="account_content"]').on('click', '[data-el="btn_pre_buy_ticket"]', function () {
        $('[data-el="btn_pre_buy_ticket"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('[data-el="frm_pre_buy_ticket"]').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_pre_buy_ticket"]').removeClass('loading');
                    $('[data-el="account_content"]').html(data);
                });
    });

    $('[data-el="account_content"]').on('click', '[data-el="btn_restore_pre_buy_ticket"]', function () {
        $('[data-el="btn_restore_pre_buy_ticket"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {},
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_restore_pre_buy_ticket"]').removeClass('loading');
                    $('[data-el="account_content"]').html(data);
                });
    });



    //Confirm Buy Ticket Proceed
    $('[data-el="account_content"]').on('click', '[data-el="btn_confirm_buy_ticket_proceed"]', function () {
        $('[data-el="btn_confirm_buy_ticket_proceed"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('[data-el="confirm_buy_ticket_form"]').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_confirm_buy_ticket_proceed"]').removeClass('loading');
                    $('[data-el="account_content"]').html(data);
                });
    });


    //Confirm Buy Ticket Back
    $('[data-el="account_content"]').on('click', '[data-el="btn_confirm_buy_ticket_back"]', function () {
        $('[data-el="btn_confirm_buy_ticket_back"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {},
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_confirm_buy_ticket_back"]').removeClass('loading');
                    $('[data-el="account_content"]').html(data);
                });
    });

    //Result buy ticket back
    $('[data-el="account_content"]').on('click', '[data-el="btn_result_buy_ticket_back"]', function () {
        $('[data-el="btn_result_buy_ticket_back"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {},
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('[data-el="btn_result_buy_ticket_back"]').removeClass('loading');
                    $('[data-el="account_content"]').html(data);
                });
    });

    //Print ticket
    $('[data-el="account_content"]').on('click', '[data-el="btn_result_buy_ticket_print"]', function () {
        $('[data-el="btn_result_buy_ticket_print"]').addClass('loading');
        printTicket();
        $('[data-el="btn_result_buy_ticket_print"]').removeClass('loading');

    });

    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_print"]', function () {
        $('[data-el="ticket_order_history_print"]').addClass('loading');
        printTicket();
        $('[data-el="ticket_order_history_print"]').removeClass('loading');

    });


    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_show"]', function () {
        $('[data-el="ticket_order_history_container"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('[data-el="ticket_order_history_container"]').html(data);
                    }
                    $('[data-el="ticket_order_history_container"]').removeClass('loading');

                });
    });



    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_delete"]', function () {
        var record_ids = [];
        $('[data-el="ticket_order_history_table"]').find('.ticket_history_selection').each(function () {
            if (this.checked) {
                record_ids.push($(this).attr('data-record-id'));
            }
        });

        if (record_ids.length === 0) {
            return;
        }

        $('[data-el="ticket_order_history_container"]').addClass('loading');
        var url = $(this).attr('data-url');

        $.post(url,
                {
                    page: $('[data-el="ticket_order_history_table"]').attr('data-page-no'),
                    record_ids: record_ids
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('[data-el="ticket_order_history_container"]').html(data);
                    }
                    $('[data-el="ticket_order_history_container"]').removeClass('loading');

                });

    });


    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_trash"]', function () {
        $('[data-el="ticket_order_history_container"]').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('[data-el="ticket_order_history_container"]').html(data);
                    }
                    $('[data-el="ticket_order_history_container"]').removeClass('loading');

                });
    });



    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_restore"]', function () {
        var record_ids = [];
        $('[data-el="ticket_order_history_table"]').find('.ticket_history_selection').each(function () {
            if (this.checked) {
                record_ids.push($(this).attr('data-record-id'));
            }
        });

        if (record_ids.length === 0) {
            return;
        }

        $('[data-el="ticket_order_history_container"]').addClass('loading');
        var url = $(this).attr('data-url');

        $.post(url,
                {
                    page: $('[data-el="ticket_order_history_table"]').attr('data-page-no'),
                    record_ids: record_ids
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('[data-el="ticket_order_history_container"]').html(data);
                    }
                    $('[data-el="ticket_order_history_container"]').removeClass('loading');

                });

    });



    $('[data-el="account_content"]').on('click', '[data-el="btn_clear_pre_buy_ticket"]', function () {

        $('[data-el="frm_pre_buy_ticket"]').find('input').each(function () {
            this.value = '';
        });

        $('[data-el="frm_pre_buy_ticket"]').find('select').each(function () {
            this.value = '';
        });
    });

    $('[data-el="account_content"]').on('click', '[data-el="ticket_order_history_select_all"]', function () {
        var me = this;
        $('[data-el="ticket_order_history_table"]').find('.ticket_history_selection').each(function () {
            this.checked = $(me).is(':checked');
        });

    });

    
    $('[data-el="account_content"]').on('click', '[data-el="profile_upload"]', function () {
        document.querySelector('[data-el="profile_upload_file"]').click();
    });
    
    $('[data-el="account_content"]').on('change', '[data-el="profile_upload_file"]', function () {
        var percent = 0;
        var progress_bar_selector = '[data-el="profile_upload_progress"]';
        var me = this;
        //show the progress bar
        $(acctAllDeviceSelector).find('.app-progress-bar').each(function () {
            if($(this).hasClass('hidden')){
               $(this).removeClass('hidden'); 
            }
        });
        
        moveProgressBar(progress_bar_selector, 0);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (xhr.status) {

                if (xhr.status === 200 && (xhr.readyState === 4)) {
                    //To do tasks if any, when upload is completed
                    var data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        moveProgressBar(progress_bar_selector, percent, true);
                        $(acctAllDeviceSelector).find('[data-el="account_profile_card_photo"]').each(function(){
                            this.src = $(me).attr('data-base-url') + data.photo_url;
                        }); 
                        $(acctAllDeviceSelector).find('[data-el="profile_edit_photo"]').each(function(){
                            this.src =  $(me).attr('data-base-url') + data.photo_url;
                        });
                        $(acctAllDeviceSelector).find('[data-el="mobile_profile_photo"]').each(function(){
                            this.src =  $(me).attr('data-base-url') + data.photo_url;
                        });
                        $(acctAllDeviceSelector).find('[data-el="tablet_profile_photo"]').each(function(){
                            this.src =  $(me).attr('data-base-url') + data.photo_url;
                        });
                    } else {
                        moveProgressBar(progress_bar_selector, percent, false, data.err_msg);
                    }
                } else if (xhr.status > 200) {
                    moveProgressBar(progress_bar_selector, percent, false, 'An error occured!');
                }
            }
        };
        xhr.upload.addEventListener("progress", function (event) {

            percent = (event.loaded / event.total) * 100;
            //**percent** variable can be used for modifying the length of your progress bar.
            console.log(percent);
            moveProgressBar(progress_bar_selector, percent);

        });

        var meta = document.querySelector('meta[name="csrf-token"]');

        xhr.open("POST", $(this).attr('data-url'), true);
        var fd = new FormData();
        fd.append('profile_image', this.files[0]);
        fd.append('_token', $(meta).attr('content'));

        xhr.send(fd);

        this.value = '';
    });


});
