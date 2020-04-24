<div class="ui link cards" data-el="account_profile_view"  style="margin: 0 auto;">
    <div class="card"  style="margin: 0 auto;">
        <div class="image">
            <img style="max-width: 300px; max-height: 300px;" data-el="account_profile_card_photo" src="{{  url('/') }}{{ !empty(Auth::user()->photo_url) &&  Auth::user()->photo_url ? Auth::user()->photo_url: '/uploads/matthew.png'}}">
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
