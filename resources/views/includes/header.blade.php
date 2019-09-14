

<nav class="megamenu navbar navbar-default">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="{{ url('/') }}"><img src="{{ url('/') }}/images/apple-touch-icon.png" alt="image"></a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="app-menu-link {{ !empty($page) && $page == 'home' ? 'active app-menu-link-active' : ''}}"><a class="" href="{{ url('/') }}"><i class="home icon"></i> Home</a></li>
                <li class="app-menu-link {{ !empty($page) && $page == 'account' ? 'active app-menu-link-active' : ''}}"><a class="" href="{{ url('/') }}/account">My Account</a></li>
                <li class="app-menu-link {{ !empty($page) && $page == 'about' ? 'active app-menu-link-active' : ''}}"><a class="" href="{{ url('/') }}/about">About</a></li>
                <li class="app-menu-link {{ !empty($page) && $page == 'faq' ? 'active app-menu-link-active' : ''}}"><a class="" href="{{ url('/') }}/faq">FAQ</a></li>
                <li class="app-menu-link {{ !empty($page) && $page == 'contact' ? 'active app-menu-link-active' : ''}}"><a class="" href="{{ url('/') }}/contact">Contact</a></li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
                <!---<li><a class="btn-light btn-radius btn-brd log" href="#" data-toggle="modal" data-target="#login"><i class="flaticon-padlock"></i> Login</a></li>-->
                @guest
                <li>
                    <a class=" app-login-link" href="{{ url('/') }}/login"><i class="icon unlock alternate"></i> Login</a>
                </li>
                @else

                <li>

                    <a class="app-login-link" href="{{ url('/') }}/logout" onclick="event.preventDefault();
                            document.getElementById('logout-form').submit();">
                        <i class="icon lock"></i> LOGOUT</a>
                </li>                

                <form id="logout-form" action="{{ url('/') }}/logout" method="POST" style="display: none;">
                    @csrf
                </form>
                @endguest
            </ul>

            @auth
            <span class="nav navbar-nav navbar-right">
                <a  href="{{ url('/') }}/account"  style="font-size: 14px; margin-right: 20px; color: #4F7942 !important;">
                    <?php
                    echo 'Hi, ' . Auth::user()->first_name . ' ' . Auth::user()->last_name;
                    ?>
                </a>
            </span>
            @endauth

        </div>
    </div>
</nav>
