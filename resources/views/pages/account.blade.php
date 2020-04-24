
@extends('layouts.default')

@section('top')
{{--Display Nothing--}}    
@endsection

@section('content')

<div style="min-height: 100%; padding: 20px;">

    <!--Computer only-->
    <div class="ui stackable computer only grid">
        <div class="four wide column">
            @include('includes.account.main.profile_card')
        </div>
        <div class="twelve wide column">
            @include('includes.account.main.menu_computer')
            @include('includes.account.content')
        </div>
    </div>

    <!--tablet only-->
    <div class="ui stackable tablet only grid">

        <div class="sixteen wide column">
            @include('includes.account.main.menu_tablet')
            @include('includes.account.content')
        </div>
    </div>

    <!--tablet only-->
    <div class="ui stackable mobile only grid">

        <div class="sixteen wide column">
            @include('includes.account.main.menu_mobile')
            @include('includes.account.content')
        </div>
    </div>


</div>

@endsection


