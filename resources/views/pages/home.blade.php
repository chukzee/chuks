
@extends('layouts.default')

@section('top')
@include('includes.carousel')    
@endsection

@section('content')

<div class="row" style="padding: 20px;"> 
    <p style="padding-left: 20px;">This is my body content.</p>

    <div class="col-md-4 col-sm-6 col-xs-12">
        <div class="icon-wrapper wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s" style="visibility: visible; animation-duration: 1s; animation-delay: 0.2s; animation-name: fadeIn;">
            <i class="flaticon-server global-radius effect-1 alignleft"></i>
            <h3>Buy ticket via USSD</h3>
            <p>todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo ! <small class="readmore"><a href="#">Read more</a></small></p>
        </div><!-- end icon-wrapper -->
    </div><!-- end col -->

    <div class="col-md-4 col-sm-6 col-xs-12">
        <div class="icon-wrapper wow fadeIn" data-wow-duration="1s" data-wow-delay="0.6s" style="visibility: visible; animation-duration: 1s; animation-delay: 0.6s; animation-name: fadeIn;">
            <i class="flaticon-cloud-computing-1 global-radius effect-1 alignleft"></i>
            <h3>Buy ticket online</h3>
            <p>todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo !<small class="readmore"><a href="#">Read more</a></small></p>
        </div><!-- end icon-wrapper -->
    </div><!-- end col -->

    <div class="col-md-4 col-sm-6 col-xs-12">
        <div class="icon-wrapper wow fadeIn" data-wow-duration="1s" data-wow-delay="0.4s" style="visibility: visible; animation-duration: 1s; animation-delay: 0.4s; animation-name: fadeIn;">
            <i class="flaticon-world-wide-web global-radius effect-1 alignleft"></i>
            <h3>Open Services</h3>
            <p>todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo ! <small class="readmore"><a href="#">Read more</a></small></p>
        </div><!-- end icon-wrapper -->
    </div><!-- end col -->
</div>



@endsection


