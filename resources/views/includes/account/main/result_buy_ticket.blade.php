<div class="ui stackable two column centered grid">
    <div class="column">
        <div class="ui green segment">
            <center><h3>Ticket ordered successfully</h3></center>
            <hr>
            <div class="ui two column stackable grid" style="padding-left: 10px; padding-right: 10px;"> 
                <div class="row">
                    <label class="column">Generated Ticket </label>
                    <span class="column">{{ $ticket }}</span>
                </div>

                <div class="row">              
                    <label class="column">Amount </label>
                    <span class="column">{{ $amount }}</span>

                </div>

                <div class="row">          
                    <label class="column">Bank Account Info </label>
                    <span class="column">{{ $bank_account_info }}</span>
                </div>

            </div>

        </div>
    </div>

    <div class="four column centered row">
        <div class="column">
            <button data-el="btn_result_buy_ticket_back" data-url="{{ url('/') }}/account/main"  class="green large ui circular button alignright" style="min-width: 200px;" type="button"><i class="icon arrow left"></i>Back</button>
        </div>
        <div class="column">
            <button data-el="btn_result_buy_ticket_print" class="green large ui circular button alignleft" style="min-width: 200px;" type="button"><i class="icon print"></i>Print Ticket</button>
        </div>
    </div>
</div>