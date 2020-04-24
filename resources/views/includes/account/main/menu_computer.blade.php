
<div class="ui stackable pointing  menu">           
    <a data-url='{{ url('/') }}/account/main' class="{{!empty($content) && $content == 'main'? 'active ': ''}} item acct_mnu_btn" data-el="account_main"><i class="home icon"></i>Main</a>
    <a data-url='{{ url('/') }}/account/view' class="{{!empty($content) && $content == 'view'? 'active ': ''}} item acct_mnu_btn" data-el="account_view"><i class="user icon"></i>View</a>
    <a data-url='{{ url('/') }}/account/edit' class="{{!empty($content) && $content == 'edit'? 'active ': ''}} item acct_mnu_btn" data-el="account_edit"><i class="edit icon"></i>Edit</a>

    <a data-url='{{ url('/') }}/account/register_keke' class="{{!empty($content) && $content == 'register_keke'? 'active ': ''}} item acct_mnu_btn" data-el="account_register_keke"><i class="registered icon"></i>Register Keke</a>
    <a data-url='{{ url('/') }}/account/settings' class="{{!empty($content) && $content == 'settings'? 'active ': ''}} item acct_mnu_btn" data-el="account_settings"><i class="setting icon"></i>Settings</a>
    <a data-url='{{ url('/') }}/account/help' class="{{!empty($content) && $content == 'help'? 'active ': ''}} item acct_mnu_btn" data-el="account_help"><i class="question icon"></i>Help</a>
    
    <!--<div class="ui icon input" style="width: 100%;">
        <i data-el='icn_acct_ticket_owner' class="search icon"></i>
        <input style="width: 100%;" data-el='txt_acct_ticket_owner' type="text" data-url = '{{ url("/") }}/account/find_ticket_owner' placeholder="Enter owner's ticket">
    </div >-->
    
    <iconSearch class="ui right aligned search"  style="width: 100%;">
        <div class="ui icon input"  style="width: 100%;" >
            <input class="prompt"  style="width: 100%;" data-el='txt_acct_ticket_owner' type="text" data-url = '{{ url("/") }}/account/find_ticket_owner' placeholder="Enter owner's ticket">
            <i  data-el='icn_acct_ticket_owner' class="search icon"></i>
        </div>
        <!--<div class="results"></div>-->
    </iconSearch>

</div>