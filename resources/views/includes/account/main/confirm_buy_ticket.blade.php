<div class="ui stackable centered grid">
    <div class="twelve wide column">
        <h1  class="ui block header">Please confirm  the follow entries</h1>
        <form data-el="confirm_buy_ticket_form" method="POST" class="ui form">
            @csrf
            <input type="hidden" name="via" value="website">
            <div class="ui stackable grid">
                <div class="eight wide column">
                    <div class="field"><input type="hidden" name="type" value="{{ $type }}"><label>Ticket Type</label> <span>{{ $type }}</span></div>
                    <div class="field"><input type="hidden" name="amount" value="{{ $amount }}"><label>Amount</label> <span>{{ $amount }}</span></div>
                </div>
                <div class="eight wide column">
                    <div class="field"><input type="hidden" name="state" value="{{ $state }}"><label>State</label> <span>{{ $state }}</span></div>
                    <div class="field"><input type="hidden" name="lga" value="{{ $lga }}"><label>LGA</label> <span>{{ $lga }}</span></div>
                </div>
            </div>

            <div class="ui green segment">
                <h3>Bank Details</h3>

                <div class="field">
                    <label>Bank</label>
                    <select name="bank_name" >
                        <?php
                        $banks = App\Util::getNigerianBanks();

                        echo '<option value="">Select State</option>';
                        foreach ($banks as $bank) {
                            if ($bank == $bank_name) {
                                echo '<option selected value="' . $bank . '">' . $bank . '</option>';
                            } else {
                                echo '<option value="' . $bank . '">' . $bank . '</option>';
                            }
                        }
                        ?>
                    </select>
                    @error('bank_name')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>Account Name</label>
                    <input type="text" name="bank_account_name" value="{{ $bank_account_name }}" class="big ui input @error('bank_account_name') is-invalid @enderror" required placeholder="Account name">

                    @error('bank_account_name')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>Account No.</label>
                    <input type="number" name="bank_account_no" value="{{ $bank_account_no }}" class="big ui input @error('bank_account_no') is-invalid @enderror" required placeholder="Account no.">

                    @error('bank_account_no')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

                <div class="field">
                    <label>Transaction details</label>
                    <input type="text" name="bank_transaction_details" value="{{ $bank_transaction_details }}" class="big ui input @error('bank_transaction_details') is-invalid @enderror" required placeholder="Transaction details">

                    @error('bank_transaction_details')
                    <div class="ui pointing red basic label">
                        {{ $message }}
                    </div>
                    @enderror
                </div>

            </div>

            <div class="ui stackable two column grid">
                <div class="column">
                    <button data-el="btn_confirm_buy_ticket_back" data-url="{{ url('/') }}/account/main"  class="basic green large ui circular button alignright" style="min-width: 200px;" type="button"><i class="icon arrow left"></i>Back</button>
                </div>
                <div class="column">
                    <button data-el="btn_confirm_buy_ticket_proceed" data-url="{{ url('/') }}/account/buy_ticket" class="green large ui circular button alignleft" style="min-width: 200px;" type="button">Proceed<i class="icon arrow right"></i></button>
                </div>
            </div>

        </form>     

    </div>              
</div>