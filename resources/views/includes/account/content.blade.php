
            <div data-el= "account_content" class="ui segment" >

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