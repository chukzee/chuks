
@extends('layouts.default')

@section('top')
@include('includes.carousel')    
@endsection

@section('content')



<div id="verify_ticket_header" style="max-width: 800px; margin: 0 auto;  padding-top: 40px;">
    <center>
        <p style="font-size: 36px; color:  #444;">Find Ticket Owner</p>
        <div class="large ui action input" id='cnt_find_ticket_owner' data-url = '{{ url("/") }}/account/find_ticket_owner' style="width: 100%;">
                <input type="text" id='txt_find_ticket_owner' placeholder="Enter ticket of owner">
                <button class="ui button" id='btn_find_ticket_owner'>Find</button>
         </div >
    </center>
</div>


<div style="max-width: 800px; margin: 0 auto; font-size: 36px; padding: 20px; color: #777">
    <center>
        <p>Love a smart way of buying and selling tickets? We do also!
            This platform provides a convenient way to buy and sell various kinds of tickets.</p>
        <button class="green large circular ui button"  style="min-width: 200px;" type="button">Learn More >></button>
    </center>
</div>

<div class="row" style="padding: 20px;"> 
    <div class="ui stackable centered grid">
        <div class="five wide column">

            <div id='buy_ticket_via_ussd_header' class="fa fa-phone-square" style="font-size: 48px; text-align: center; width: 100%;"></div>
            <h3 style="text-align: center;">Buy ticket via USSD</h3>
            <p style="font-size: 16px;">Straight from you mobile device you can buy tickets the smart way via USSD application. 
                Simply dial the USSD code corresponding to the ticketing category of your choice!
                <small class="readmore"><a href="#">Read more</a></small></p>

        </div>
        <div class="five wide column">

            <div class="fa fa-globe" style="font-size: 48px; text-align: center; width: 100%"></div>
            <h3 style="text-align: center;">Buy ticket online</h3>
            <p style="font-size: 16px;">
                Alternatively you can buy ticket directly from this website. 
                Ensure to <a href='{{ url("/") }}/register'>sign up for free</a> 
                with  us in order to be able to use the service online.
                Once you finish registering the rest is a breeze. Simply login to your account and enjoy! 
                <small class="readmore"><a href="#">Read more</a></small>

            </p>
            <button class="green large circular ui button"  style="min-width: 200px;" onclick="window.location = '{{ url("/") }}/account'">Buy Ticket Online</button>

        </div>
        <div class="five wide column">

            <div class="fa fa-group" style="font-size: 48px; text-align: center; width: 100%"></div>
            <h3 style="text-align: center;">Open Services</h3>
            <p style="font-size: 16px;">todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo ! <small class="readmore"><a href="#">Read more</a></small></p>


        </div>
    </div>
</div>


<div class="row" style="padding: 20px;"> 
    <div class="ui stackable centered grid">
        <div class="eight wide column">
            <center>
                <h4>Don’t have an account with us yet?</h4>
                <p>Sign up. It's absolutely free!</p>
                <button class="green large circular ui button" style="min-width: 200px;" onclick="window.location = '{{ url("/") }}/register'">Sign Up</button>
            </center>
        </div>
    </div>
</div>
@endsection


