
$(document).ready(function () {

    function printTicket() {

    }

    function reloadPageOnExpiry(status) {
        if (status === 419 || status === 'unknown status') {
            window.location = window.location.href;
        }
    }

    //$('#rangestart').calendar();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('.acct_mnu_btn').click(function () {
        $('.acct_mnu_btn').removeClass('active');
        $(this).addClass('active');
    });


    $('#account_main').on('click', function () {
        $('#account_content').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });


    $('#account_view').on('click', function () {
        $('#account_content').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });


    $('#account_edit').on('click', function () {
        $('#account_content').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });


    $('#account_register_keke').on('click', function () {
        $('#account_content').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });

    $('#account_settings').on('click', function () {
        $('#account_content').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });

    $('#account_help').on('click', function () {
        $('#account_content').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });


    //Find ticket owner
    $('#txt_acct_ticket_owner').on('keypress', function (event) {
        if (!$('#txt_acct_ticket_owner').val()) {
            return;
        }
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode !== 13) {
            return;//leave since not enter key
        }
        $('#account_content').addClass('loading');
        var url = $('#txt_acct_ticket_owner').attr('data-url');
        $.post(url,
                {
                    ticket: $('#txt_acct_ticket_owner').val()
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });

    $('#icn_acct_ticket_owner').on('click', function (event) {
        if (!$('#txt_acct_ticket_owner').val()) {
            return;
        }
        $('#account_content').addClass('loading');
        var url = $('#txt_acct_ticket_owner').attr('data-url');
        $.post(url,
                {
                    ticket: $('#txt_acct_ticket_owner').val()
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#account_content').html(data);
                    $('#account_content').removeClass('loading');
                });
    });

    $('#txt_find_ticket_owner').on('keypress', function (event) {
        if (!$('#txt_find_ticket_owner').val()) {
            return;
        }
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode !== 13) {
            return;//leave since not enter key
        }
        var url = $('#cnt_find_ticket_owner').attr('data-url');
        window.location = url + '?ticket=' + $('#txt_find_ticket_owner').val();
    });


    $('#btn_find_ticket_owner').on('click', function (event) {
        if (!$('#txt_find_ticket_owner').val()) {
            return;
        }
        var url = $('#cnt_find_ticket_owner').attr('data-url');
        window.location = url + '?ticket=' + $('#txt_find_ticket_owner').val();
    });


    $('#account_content').on('click', '#ticket_order_history_next', function () {
        $('#ticket_order_history_container').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('#ticket_order_history_container').html(data);
                    }
                    $('#ticket_order_history_container').removeClass('loading');

                });
    });

    $('#account_content').on('click', '#ticket_order_history_prev', function () {
        $('#ticket_order_history_container').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('#ticket_order_history_container').html(data);
                    }
                    $('#ticket_order_history_container').removeClass('loading');
                });
    });


    //Edit Profile
    $('#account_content').on('click', '#btn_edit_profile_save_change', function () {
        $('#btn_edit_profile_save_change').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('#frm_edit_profile').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#btn_edit_profile_save_change').removeClass('loading');
                });
    });


    //Register Keke
    $('#account_content').on('click', '#btn_register_keke', function () {
        $('#btn_register_keke').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('#frm_register_keke').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#btn_register_keke').removeClass('loading');
                });
    });


    //Pre Buy Ticket
    $('#account_content').on('click', '#btn_pre_buy_ticket', function () {
        $('#btn_pre_buy_ticket').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('#frm_pre_buy_ticket').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#btn_pre_buy_ticket').removeClass('loading');
                    $('#account_content').html(data);
                });
    });


    //Confirm Buy Ticket Proceed
    $('#account_content').on('click', '#btn_confirm_buy_ticket_proceed', function () {
        $('#btn_confirm_buy_ticket_proceed').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                $('#confirm_buy_ticket_form').serialize(),
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#btn_confirm_buy_ticket_proceed').removeClass('loading');
                    $('#account_content').html(data);
                });
    });


    //Confirm Buy Ticket Back
    $('#account_content').on('click', '#btn_confirm_buy_ticket_back', function () {
        $('#btn_confirm_buy_ticket_back').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {},
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#btn_confirm_buy_ticket_back').removeClass('loading');
                    $('#account_content').html(data);
                });
    });

    //Result buy ticket back
    $('#account_content').on('click', '#btn_result_buy_ticket_back', function () {
        $('#btn_result_buy_ticket_back').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {},
                function (data, status) {
                    reloadPageOnExpiry(status);
                    $('#btn_result_buy_ticket_back').removeClass('loading');
                    $('#account_content').html(data);
                });
    });

    //Print ticket
    $('#account_content').on('click', '#btn_result_buy_ticket_print', function () {
        $('#btn_result_buy_ticket_print').addClass('loading');
        printTicket();
        $('#btn_result_buy_ticket_print').removeClass('loading');

    });

    $('#account_content').on('click', '#ticket_order_history_print', function () {
        $('#ticket_order_history_print').addClass('loading');
        printTicket();
        $('#ticket_order_history_print').removeClass('loading');

    });


    $('#account_content').on('click', '#ticket_order_history_delete', function () {
        var record_ids = [];
        $('#ticket_order_history_table').find('.ticket_history_selection').each(function () {
            if(this.checked){
                record_ids.push($(this).attr('data-record-id'));
            }
        });
        
        if(record_ids.length === 0){
            return;
        }
        
        
        return;

        $('#ticket_order_history_container').addClass('loading');
        var url = $(this).attr('data-url');
        
        $.post(url,
                {
                    page: $('#ticket_order_history_table').attr('data-page-no'),
                    record_ids: record_ids
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('#ticket_order_history_container').html(data);
                    }
                    $('#ticket_order_history_container').removeClass('loading');

                });

    });


    $('#account_content').on('click', '#ticket_order_history_trash', function () {
        $('#ticket_order_history_container').addClass('loading');
        var url = $(this).attr('data-url');
        $.post(url,
                {
                },
                function (data, status) {
                    reloadPageOnExpiry(status);
                    if (data) {
                        $('#ticket_order_history_container').html(data);
                    }
                    $('#ticket_order_history_container').removeClass('loading');

                });
    });


});
