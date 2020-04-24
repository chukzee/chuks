
<div class="ui stackable pointing  menu">        
    <a class="small_profile_photo item ui label">
        <img data-el="tablet_profile_photo" src="{{  url('/') }}{{ !empty(Auth::user()->photo_url) &&  Auth::user()->photo_url ? Auth::user()->photo_url: '/uploads/matthew.png'}}">
    </a>
    <div class="menu right"> 
        <a data-url='{{ url('/') }}/account/main' class="{{!empty($content) && $content == 'main'? 'active ': ''}} item acct_mnu_btn" data-el="account_main"><i class="home icon"></i></a>
        <a data-url='{{ url('/') }}/account/view' class="{{!empty($content) && $content == 'view'? 'active ': ''}} item acct_mnu_btn" data-el="account_view"><i class="user icon"></i></a>
        <a data-url='{{ url('/') }}/account/edit' class="{{!empty($content) && $content == 'edit'? 'active ': ''}} item acct_mnu_btn" data-el="account_edit"><i class="edit icon"></i> </a>

        <a data-url='{{ url('/') }}/account/register_keke' class="{{!empty($content) && $content == 'register_keke'? 'active ': ''}} item acct_mnu_btn" data-el="account_register_keke"><i class="registered icon"></i></a>
        <a data-url='{{ url('/') }}/account/settings' class="{{!empty($content) && $content == 'settings'? 'active ': ''}} item acct_mnu_btn" data-el="account_settings"><i class="setting icon"></i></a>
        <a data-url='{{ url('/') }}/account/help' class="{{!empty($content) && $content == 'help'? 'active ': ''}} item acct_mnu_btn" data-el="account_help"><i class="question icon"></i></a>
        
        <!--<div class="ui icon input"  style="width: 100%;">
            <i data-el='icn_acct_ticket_owner' class="search icon"></i>
            <input  style="width: 100%;" data-el='txt_acct_ticket_owner' type="text" data-url = '{{ url("/") }}/account/find_ticket_owner' placeholder="Enter owner's ticket">
        </div >-->
        
        <iconSearch class="ui right aligned search"  style="width: 100%;">
            <div class="ui icon input">
                <input class="prompt"  style="width: 100%;" data-el='txt_acct_ticket_owner' type="text" data-url = '{{ url("/") }}/account/find_ticket_owner' placeholder="Enter owner's ticket">
                <i  data-el='icn_acct_ticket_owner' class="search icon"></i>
            </div>
            <!--<div class="results"></div>-->
        </iconSearch>
    </div>
</div>