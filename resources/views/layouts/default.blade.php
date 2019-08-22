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

        <header class="header header_style_01">
            @include('includes.header')        
        </header>

        @yield('top')

        @yield('content')

        <footer class="footer">
            @include('includes.footer')
        </footer><!-- end footer -->

        <div class="copyrights">
            @include('includes.copyrights')
        </div>

        <a href="#" id="scroll-to-top" class="dmtop global-radius">@include('includes.scroll_to_top')</a>

        <!-- ALL JS FILES -->
        <script src="{{ url('/') }}/js/all.js"></script>
        <!-- ALL PLUGINS -->
        <script src="{{ url('/') }}/js/custom.js"></script>

    </body>
</html>
