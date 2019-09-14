
@extends('layouts.default')

@section('top')
{{--Display Nothing--}}    
@endsection

@section('content')

<div style="min-height: 100%; padding: 20px;">

    <div class="ui stackable grid">
        <div class="four wide column">

            <div class="ui link cards">
                <div class="card">
                    <div class="image">
                        <img src="{{  url('/') }}{{ !empty(Auth::user()->photo_url) &&  Auth::user()->photo_url ? Auth::user()->photo_url: '/uploads/matthew.png'}}">
                    </div>
                    <div class="content">
                        <div class="header">
                            @auth
                            <span>
                                <?php
                                echo Auth::user()->first_name . ' ' . Auth::user()->last_name;
                                ?>
                            </span>
                            @endauth
                        </div>
                        <div class="meta">
                            Last account activity: {{ App\Util::timeAgo(Auth::user()->visited_at)}}
                        </div>
                        <div class="description">
                            {{ !empty(Auth::user()->status_message) &&  Auth::user()->status_message ? Auth::user()->status_message: 'Say something about yourself...'}}
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="right floated">
                            Joined in {{ App\Util::appDayDate(Auth::user()->created_at) }}
                        </span>
                        <span>
                            <i class="users icon"></i>
                            <?php
                            $count = App\User::count();
                            $cnt = $count > 1 ? $count . ' Users' : $count . ' User';
                            echo $cnt;
                            ?>

                        </span>
                    </div>
                </div>
            </div>

        </div>

        <div class="twelve wide column">
            <!--Menu-->
            <div class="ui stackable  pointing  menu">                
                <a data-url='{{ url('/') }}/account/main' class="{{!empty($content) && $content == 'main'? 'active ': ''}} item acct_mnu_btn" id="account_main"><i class="home icon"></i>Main</a>
                <a data-url='{{ url('/') }}/account/view' class="{{!empty($content) && $content == 'view'? 'active ': ''}} item acct_mnu_btn" id="account_view"><i class="user icon"></i>View</a>
                <a data-url='{{ url('/') }}/account/edit' class="{{!empty($content) && $content == 'edit'? 'active ': ''}} item acct_mnu_btn" id="account_edit"><i class="edit icon"></i> Edit</a>
                <div class="right menu">
                    <a data-url='{{ url('/') }}/account/register_keke' class="{{!empty($content) && $content == 'register_keke'? 'active ': ''}} item acct_mnu_btn" id="account_register_keke"><i class="registered icon"></i> Register Keke</a>
                    <a data-url='{{ url('/') }}/account/settings' class="{{!empty($content) && $content == 'settings'? 'active ': ''}} item acct_mnu_btn" id="account_settings"><i class="setting icon"></i> Settings</a>
                    <a data-url='{{ url('/') }}/account/help' class="{{!empty($content) && $content == 'help'? 'active ': ''}} item acct_mnu_btn" id="account_help"><i class="question icon"></i> Help</a>
                    <div class="ui icon input">
                        <i id='icn_acct_ticket_owner' class="search icon"></i>
                        <input id='txt_acct_ticket_owner' type="text" data-url = '{{ url("/") }}/account/find_ticket_owner' placeholder="Enter owner's ticket">
                    </div >
                </div>
            </div>
            <div id= "account_content" class="ui segment" >

                <!--Content of the My Account Page-->

                @if (!empty($content) && $content == 'main')
                @include('includes.account.main.main')
                @elseif (!empty($content) && $content == 'edit')
                @include('includes.account.edit.edit')
                @elseif (!empty($content) && $content == 'view')
                @include('includes.account.view.view')
                @elseif (!empty($content) && $content == 'register_keke')
                @include('includes.account.register_keke.register_keke')
                @elseif (!empty($content) && $content == 'settings')
                @include('includes.account.settings')
                @elseif (!empty($content) && $content == 'help')
                @include('includes.account.help.help')
                @elseif (!empty($content) && $content == 'find_ticket_owner')
                @include('includes.account.ticket_owner')
                @else

                @endif

            </div>
        </div>
    </div>


</div>

@endsection


