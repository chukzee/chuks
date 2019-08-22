
$(document).ready(function () {

    $('#account_loading_content').hide();


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


    $('#account_main').click(function () {
        $('#account_loading_content').show();
        $.get(window.location + '/main',
                {
                },
                function (data, status) {
                    $('#account_content').html(data);
                    $('#account_loading_content').hide();
                });
    });


    $('#account_view').click(function () {
        $('#account_loading_content').show();
        $.get(window.location + '/view',
                {
                },
                function (data, status) {
                    $('#account_content').html(data);
                    $('#account_loading_content').hide();
                });
    });


    $('#account_edit').click(function () {
        $('#account_loading_content').show();
        $.get(window.location + '/edit',
                {
                },
                function (data, status) {
                    $('#account_content').html(data);
                    $('#account_loading_content').hide();
                });
    });


    $('#account_settings').click(function () {
        $('#account_loading_content').show();
        $.get(window.location + '/settings',
                {
                },
                function (data, status) {
                    $('#account_content').html(data);
                    $('#account_loading_content').hide();
                });
    });


    $('#account_help').click(function () {
        $('#account_loading_content').show();
        $.get(window.location + '/help',
                {
                },
                function (data, status) {
                    $('#account_content').html(data);
                    $('#account_loading_content').hide();
                });
    });

});
