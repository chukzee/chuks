<!DOCTYPE html>

<html>
    <head>
        @include('includes.head')
    </head>

    <body class="host_version"> 

        <!-- Modal -->
        <div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            @include('includes.modal')
        </div>

        <!-- LOADER -->
        <div id="preloader">
            @include('includes.loader')
        </div>
        <!-- END LOADER -->

        <header class="header header_style_01" >
            @include('includes.header')        
        </header>

        @yield('top')

        @yield('content')

        
        @include('includes.footer')
        
        <!-- end footer -->

        <div class="copyrights">
           @include('includes.copyrights')
        </div>

        
        <!-- ALL JS FILES -->
        <script src="{{ url('/') }}/js/all.js"></script>
        <!-- ALL PLUGINS -->
        <script src="{{ url('/') }}/js/custom.js"></script>


        <!-- JQUERY-->
        <!--<script src="{{ url('/') }}/jquery/jquery.min.js"></script>--><!--not compatible with the templte-->
        
        <!-- Sematic JS-->
        <script src="{{ url('/') }}/semantic/semantic.min.js"></script>

        <!-- Sematic calender modulteS-->
        <script src="{{ url('/') }}/semantic/calendar.min.js"></script>

        
        <!-- CrptoJS-->
        <script src="{{ url('/') }}/CryptoJS v3.1.2/components/core-min.js"></script>
        <script src="{{ url('/') }}/CryptoJS v3.1.2/components/md5-min.js"></script>

        
        <!-- App JS-->
        <script src="{{ url('/') }}/app/js/account.js"></script>
        <script src="{{ url('/') }}/app/js/combine.js"></script>


    </body>
</html>
