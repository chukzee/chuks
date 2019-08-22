
<div>
    <form  method="POST" action="buy_ticket" class="ui form">
        @csrf
        <div class="ui horizontal segments" style="padding: 10px;">

            <div class="ui segment">
                <h3>Basic Info</h3>

                <div class="field">
                    <label>First Name</label>
                    <input type="text" name="first_name" class="form-control @error('first_name') is-invalid @enderror" required placeholder="First name">

                    @error('first_name')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{$message}}</strong>
                    </span>
                    @enderror
                </div>

                <div class="field">
                    <label>Last Name</label>
                    <input type="text" name="last_name" class="form-control @error('last_name') is-invalid @enderror" required placeholder="Last name">

                    @error('last_name')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{$message}}</strong>
                    </span>
                    @enderror
                </div>

                <div class="field">
                    <label>Date Of Birth</label>
                    <div class="ui calendar" id="rangestart">
                        <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <input type="text" name="bod" class="form-control @error('bod') is-invalid @enderror" required placeholder="Date of birth">
                        </div>
                    </div>
                    @error('bod')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{$message}}</strong>
                    </span>
                    @enderror
                </div>

            </div>

            <div class="ui segment">
                <h3>Bank Details</h3>

                <div class="field">
                    <label>Bank</label>
                    <select name="type" >
                        <option value="">Select Bank</option>
                        <option value="first_bank">First Bank</option>
                        <option value="fedelity_bank">Fedelity Bank</option>
                        <option value="unioun_bank">Unioun Bank</option>
                        <option value="fcmb">FCMB</option>
                    </select>
                    @error('bank')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="field">
                    <label>Account Name</label>
                    <input type="text" name="account_name" class="form-control @error('account_name') is-invalid @enderror" required placeholder="Account name">

                    @error('last_name')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{$message}}</strong>
                    </span>
                    @enderror
                </div>

                <div class="field">
                    <label>Account No.</label>
                    <input type="number" name="account_no" class="form-control @error('account_no') is-invalid @enderror" required placeholder="Account no.">

                    @error('account_no')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{$message}}</strong>
                    </span>
                    @enderror
                </div>

                <div class="field">
                    <label>Transaction details</label>
                    <input type="tet" name="transaction_details" class="form-control @error('account_no') is-invalid @enderror" required placeholder="Transaction details">

                    @error('transaction_details')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{$message}}</strong>
                    </span>
                    @enderror
                </div>

            </div>
        </div>
        <div class="ui stackable grid">
            <div class="three wide column centered">
                <button class="primary ui button" style="width: 100%;" type="submit">Save changes</button>
            </div>
        </div>
    </form>
</div>