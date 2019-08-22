
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
                        <img src="{{ url('/') }}/uploads/parallax_11.jpg">
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
                            Last Seen 2 days ago
                        </div>
                        <div class="description">
                            Say something about yourself
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="right floated">
                            Created in Sep 2014
                        </span>
                        <span>
                            <i class="users icon"></i>
                            75 Users
                        </span>
                    </div>
                </div>
            </div>

        </div>

        <div class="twelve wide column">
            <!--Menu-->
            <div class="ui stackable  pointing  menu">                
                <a class="active item acct_mnu_btn" id="account_main">Main</a>
                <a class="item acct_mnu_btn" id="account_view">View</a>
                <a class="item acct_mnu_btn" id="account_edit"><i class="edit icon"></i> Edit</a>
                <div class="right menu">
                    <a class="item acct_mnu_btn" id="account_settings"><i class="setting icon"></i> Settings</a>
                    <a class="item acct_mnu_btn" id="account_help"><i class="question icon"></i> Help</a>
                </div>
            </div>
            <div  class="ui segment" >
                
                <div id="account_content">
                    <!--Content of the My Account Page-->
                    <!-- Initial content is main menu content which is replaceable-->
                    @include('includes.account.main')    
                </div>

                <!---Will be initially hidden by javascript-->
                <div id="account_loading_content" class="ui active inverted dimmer">
                    <div class="ui large text loader">Please wait...</div>
                </div>
                
            </div>
        </div>
    </div>


</div>

@endsection


