
<div>

    <div class="ui info message" id="resend_verify_email_msg">
        <p>Some introductory info goes here</p>
    </div>

    <!--Buy ticket form-->

    <form id='frm_pre_buy_ticket'  method="POST" class="ui form">
        @csrf
        <div class="ui stackable grid">
            <div class="eight wide column">
                <div class="field">
                    <label>Ticket Type</label>
                    <select name="type"  class="big ui @error('type') red @enderror">
                        <option value="">Select Ticket Type</option>
                        <option value="keke">KeKe</option>
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="nurtw">NURTW</option>
                    </select>
                    @error('type')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>Ticket Amount</label>
                    <input type="number" name="amount" class="big ui input @error('amount') red @enderror" required placeholder="Amount">

                    @error('amount')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

            </div>

            <div class="eight wide column">
                <div class="field">
                    <label>State</label>
                    <select name="state"  class="big ui @error('state') red @enderror">
                        <option value="">Select State</option>
                        <option value="Delta">Delta</option>
                        <option value="Edo">Edo</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Plateau">Plateau</option>
                    </select>
                    @error('state')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>LGA</label>
                    <input type="text" name="lga" class="big ui input @error('lga') red @enderror" required placeholder="LGA">

                    @error('lga')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

            </div>

        </div>
        <div class="ui stackable grid">
            <div class="eight wide column">
                <button data-url="{{ url('/') }}/account/pre_buy_ticket" id='btn_pre_buy_ticket'  data-target="#buy_ticket_modal" class="alignright green large ui circular button" style="min-width: 200px;" type="button">
                    Buy Ticket
                </button>
            </div>
            <div class="four wide column">
                <button id='btn_clear_pre_buy_ticket' class="alignright basic green large ui circular button" style="min-width: 100px;" type="reset">
                    Clear
                </button>
            </div>
            <div class="four wide column">
                <button id='btn_restore_pre_buy_ticket' class="alignright basic green large ui circular button" style="min-width: 100px;" type="button">
                    Restore
                </button>
            </div>
        </div>
    </form>



    <!-- Ticket orders history-->
    <div id="ticket_order_history_container" class="ui green segment">
        @include('includes.account.main.ticket_order_history')
    </div>
</div>
