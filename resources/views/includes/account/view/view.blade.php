<div class="ui stackable grid">
    <div class="eight wide column">

        <div class="ui green segment">
            <center>
                <h3>Personal Information</h3>

                <div class="field">
                    <a class="ui label">
                        <img src="{{  url('/') }}{{ !empty(Auth::user()->photo_url) &&  Auth::user()->photo_url ? Auth::user()->photo_url: '/uploads/matthew.png'}}">
                        <span></span>
                    </a>
                </div>
            </center>
            <hr>
            <div class="ui two column stackable grid" style="padding-left: 10px; padding-right: 10px;">
                <div class="row">
                    <label class="column">First Name</label>
                    <div class="column"> {{ Auth::user()->first_name}}</div>
                </div>

                <div class="row">
                    <label class="column">Last Name</label>
                    <div class="column"> {{ Auth::user()->last_name}}</div>
                </div>

                <div class="row">
                    <label class="column">Date Of Birth</label>
                    <div class="column"> {{ Auth::user()->dob}}</div>
                </div>

                <div class="row">
                    <label class="column">Resident Address</label>
                    <div class="column"> {{ Auth::user()->resident_address}}</div>
                </div>

                <div class="row">
                    <label class="column">Say something about yourself</label>
                    <div class="column"> {{ Auth::user()->status_message}}</div>
                </div>

            </div>

            <hr>
            
            <h3>Operational Location</h3>
            <div class="ui two column stackable grid" style="padding-left: 10px; padding-right: 10px;"> 
                <div class="row">
                    <label class="column">State</label>
                    <span class="column"> {{ Auth::user()->state}}</span>
                </div>

                <div class="row">
                    <label class="column">LGA</label>
                    <span class="column"> {{ Auth::user()->lga}}</span>
                </div>
            </div>

        </div>

    </div>    
    <div class="eight wide column">

        <div class="ui green segment">
            <center><h3>Bank Details</h3></center>
            <hr>
            <div class="ui two column stackable grid" style="padding-left: 10px; padding-right: 10px;"> 
                <div class="row">
                    <label class="column">Bank</label>
                    <span class="column"> {{ Auth::user()->bank_name}}</span>
                </div>

                <div class="row">
                    <label class="column">Account Name</label>
                    <span class="column"> {{ Auth::user()->bank_account_name}}</span>
                </div>

                <div class="row">
                    <label class="column">Account No.</label>
                    <span class="column"> {{ Auth::user()->bank_account_no}}</span>
                </div>

                <div class="row">
                    <label class="column">Transaction details</label>
                    <span class="column"> {{ Auth::user()->bank_transaction_details}}</span>
                </div>
            </div>
        </div>
    </div>    
</div>
