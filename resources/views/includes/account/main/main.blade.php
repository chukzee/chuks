
<div>

    <div class="ui info message" data-el="resend_verify_email_msg">
        <p>Fill out the form to buy ticket.</p>
    </div>

    <!--Buy ticket form-->

    <form data-el='frm_pre_buy_ticket'  method="POST" class="ui form">
        @csrf
        <div class="ui stackable grid">
            <div class="eight wide column">
                <div class="field">
                    <label>Ticket Type</label>
                    <select name="type"  class="big ui @error('type') red @enderror">
                        
                        <?php
                        $types = App\Util::getTicketTypes();
                        echo '<option value="">Select Ticket Type</option>';
                        foreach ($types as $t) {
                            if (!empty($type) && $t == $type) {
                                echo '<option selected value="' . $t . '">' . $t . '</option>';
                            } else {
                                echo '<option value="' . $t . '">' . $t . '</option>';
                            }
                        }
                        ?>
                    </select>
                    @error('type')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>Ticket Amount</label>
                    <input value="{{ @!empty($amount) ? $amount : '' }}" type="number" name="amount" class="big ui input @error('amount') red @enderror" required placeholder="Amount">

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
                        <?php
                        $states = App\Util::getNigerianStates();
                        echo '<option value="">Select State</option>';
                        foreach ($states as $s) {
                            if (!empty($state) && $s ==$state) {
                                echo '<option selected value="' . $s . '">' . $s . '</option>';
                            } else {
                                echo '<option value="' . $s . '">' . $s . '</option>';
                            }
                        }
                        ?>
                    </select>
                    @error('state')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>LGA</label>                    
                    <input value="{{ @!empty($lga) ? $lga : '' }}" type="text" name="lga" class="big ui input @error('lga') red @enderror" required placeholder="LGA">

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
                <button data-url="{{ url('/') }}/account/pre_buy_ticket" data-el='btn_pre_buy_ticket'  data-target="#buy_ticket_modal" class="alignright green large ui circular button" style="min-width: 200px;" type="button">
                    Buy Ticket
                </button>
            </div>
            <div class="four wide column">
                <button data-el='btn_clear_pre_buy_ticket' class="alignright basic green large ui circular button" style="min-width: 100px;">
                    Clear
                </button>
            </div>
            <div class="four wide column">
                <button data-url="{{ url('/') }}/account/restore_pre_buy_ticket" data-el='btn_restore_pre_buy_ticket' class="alignright basic green large ui circular button" style="min-width: 100px;" type="button">
                    Restore
                </button>
            </div>
        </div>
    </form>



    <!-- Ticket orders history-->
    <div data-el="ticket_order_history_container" class="ui green segment">
        @include('includes.account.main.ticket_order_history')
    </div>
</div>
