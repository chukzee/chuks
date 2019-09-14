<div class="ui stackable centered grid">
    <div class="eight wide column">

        <div class="ui green segment aligncenter">

            @if(empty($ticket_owner))
            <center><h1>Ticket Owner Not Found</h1></center>
            @else
            <center>
                <h1>Ticket Owner</h1>
                <h3>{{ $ticket_owner["ticket"] }}</h3>
                <div>Ordered {{ App\Util::appDayDate($ticket_owner["order_time"]) }}</div>
            </center>
            <hr>
            <div class="ui link cards centered">
                <div class="card">
                    <div class="image">
                        <img src="{{  url('/') }}{{ $ticket_owner["photo_url"] ? $ticket_owner["photo_url"] : '/uploads/matthew.png'}}">
                    </div>
                    <div class="content">
                        <div class="header">
                            {{ $ticket_owner["full_name"] }}
                        </div>

                        <div class="description">
                            {{ $ticket_owner["status_message"] }}
                        </div>
                    </div>

                </div>
            </div>
            @endif
        </div>

    </div>      
</div>
