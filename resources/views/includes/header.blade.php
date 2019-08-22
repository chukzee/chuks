

<nav class="megamenu navbar navbar-default">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="{{ url('/') }}/home"><img src="{{ url('/') }}/images/apple-touch-icon.png" alt="image"></a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li><a class="{{ !empty($page) && $page == 'home' ? 'active' : ''}}" href="{{ url('/') }}/home">Home</a></li>
                <li><a class="{{ !empty($page) && $page == 'account' ? 'active' : ''}}" href="{{ url('/') }}/account">My Account</a></li>
                <li><a class="{{ !empty($page) && $page == 'about' ? 'active' : ''}}" href="{{ url('/') }}/about">About</a></li>
                <li><a class="{{ !empty($page) && $page == 'faq' ? 'active' : ''}}" href="{{ url('/') }}/faq">FAQ</a></li>
                <li><a class="{{ !empty($page) && $page == 'contact' ? 'active' : ''}}" href="{{ url('/') }}/contact">Contact</a></li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
                <!---<li><a class="btn-light btn-radius btn-brd log" href="#" data-toggle="modal" data-target="#login"><i class="flaticon-padlock"></i> Login</a></li>-->
                @guest
                <li>
                    <a class="btn-light btn-radius btn-brd log" href="{{ url('/') }}/login"><i class="flaticon-padlock"></i> Login</a>
                </li>
                @else

                <li>

                    <a class="btn-light btn-radius btn-brd log" href="{{ url('/') }}/logout" onclick="event.preventDefault();
                            document.getElementById('logout-form').submit();">
                        <i class="flaticon-padlock"></i> LOGOUT</a>
                </li>                

                <form id="logout-form" action="{{ url('/') }}/logout" method="POST" style="display: none;">
                    @csrf
                </form>
                @endguest
            </ul>

            @auth
            <span class="nav navbar-nav navbar-right" style="font-size: 14px; margin-right: 20px;">
                <a  href="{{ url('/') }}/account">
                    <?php
                    echo 'Hi, ' . Auth::user()->first_name . ' ' . Auth::user()->last_name;
                    ?>
                </a>
            </span>
            @endauth

        </div>
    </div>
</nav>
