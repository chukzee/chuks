
<div>

    <div class="ui info message" data-el="resend_verify_email_msg">
        <p>Fill out the form below</p>
    </div>

    <form  data-el='frm_edit_profile' method="POST" class="ui form">
        @csrf
        <div class="ui stackable grid">

            <div class="eight wide column">

                <div class="ui green segment">
                    <h3>Personal Information</h3>
                    <div class="field">
                        <div class="ui stackable two column grid">
                            <div class="column">
                                <a class="ui label" data-el="profile_upload" >
                                    <img  data-el="profile_edit_photo" src="{{  url('/') }}{{ !empty(Auth::user()->photo_url) &&  Auth::user()->photo_url ? Auth::user()->photo_url: '/uploads/matthew.png'}}">
                                    <span>Change profile picture</span>
                                </a>
                                <input type="file" class="hidden"  data-el="profile_upload_file" data-base-url="{{  url('/') }}" data-url="{{  url('/') }}/account/upload_profile_photo" />
                            </div>
                            <div class="column" style="margin: 5px;">
                                <div class="app-progress-bar hidden">
                                    <div data-el="profile_upload_progress">0%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label>First Name</label>
                        <input type="text" value="{{ Auth::user()->first_name}}" name="first_name" class="big ui input @error('first_name') is-invalid @enderror" required placeholder="First name">

                        @error('first_name')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Last Name</label>
                        <input type="text" value="{{ Auth::user()->last_name}}" name="last_name" class="big ui input @error('last_name') is-invalid @enderror" required placeholder="Last name">

                        @error('last_name')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Date Of Birth</label>
                        <div class="ui calendar" data-el="rangestart">
                            <div class="ui input left icon">
                                <i class="calendar icon"></i>
                                <input type="text" value="{{ Auth::user()->dob}}" name="bod" class="big ui input @error('bod') is-invalid @enderror" required placeholder="Date of birth">
                            </div>
                        </div>
                        @error('bod')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Resident Address</label>
                        <textarea rows="2" name="resident_address" style="text-align: left;" class="@error('resident_address') is-invalid @enderror" required placeholder="Resident Address">{{ Auth::user()->resident_address}}</textarea>

                        @error('resident_address')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Say something about yourself</label>
                        <textarea rows="2" name="status_message" style="text-align: left;" class="@error('resident_address') is-invalid @enderror" required placeholder="Status message">{{ Auth::user()->status_message}}</textarea>

                        @error('status_message')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>


                    <div class="ui green segment">
                        <h3>Operational Location</h3>
                        <div class="field">
                            <label>State</label>
                            <select   name="state"  class="big ui @error('state') red @enderror">
                                <?php
                                $states = App\Util::getNigerianStates();

                                echo '<option value="">Select State</option>';
                                foreach ($states as $state) {
                                    if ($state == Auth::user()->state) {
                                        echo '<option selected value="' . $state . '">' . $state . '</option>';
                                    } else {
                                        echo '<option value="' . $state . '">' . $state . '</option>';
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
                            <label>LGA</label>
                            <input type="text"  value="{{ Auth::user()->lga}}" name="lga" class="big ui input @error('lga') red @enderror" required placeholder="LGA">

                            @error('lga')
                            <div class="ui pointing red basic label">
                                {{ $message }}
                            </div>
                            @enderror
                        </div>

                    </div>

                </div>

            </div>

            <div class="eight wide column">

                <div class="ui green segment">
                    <h3>Bank Details</h3>

                    <div class="field">
                        <label>Bank</label>
                        <select name="bank_name" value="{{ Auth::user()->bank_name}}" >

                            <?php
                            $banks = App\Util::getNigerianBanks();
                            ;

                            echo '<option value="">Select State</option>';
                            foreach ($banks as $bank) {
                                if ($bank == Auth::user()->bank_name) {
                                    echo '<option selected value="' . $bank . '">' . $bank . '</option>';
                                } else {
                                    echo '<option value="' . $bank . '">' . $bank . '</option>';
                                }
                            }
                            ?>
                        </select>
                        @error('bank')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Account Name</label>
                        <input type="text" value="{{ Auth::user()->bank_account_name}}" name="bank_account_name" class="big ui input @error('account_name') is-invalid @enderror" required placeholder="Account name">

                        @error('last_name')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Account No.</label>
                        <input type="number" value="{{ Auth::user()->bank_account_no}}" name="bank_account_no" class="big ui input @error('account_no') is-invalid @enderror" required placeholder="Account no.">

                        @error('account_no')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                    <div class="field">
                        <label>Transaction details</label>
                        <input type="text" value="{{ Auth::user()->bank_transaction_details}}" name="bank_transaction_details" class="big ui input @error('transaction_details') is-invalid @enderror" required placeholder="Transaction details">

                        @error('transaction_details')
                        <div class="ui pointing red basic label">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>

                </div>
            </div>

        </div>
        <div class="ui stackable grid">
            <div class="three wide column centered">
                <button  data-url="{{ url('/') }}/account/save_profile" data-el='btn_edit_profile_save_change' class="green large circular ui button" style="min-width: 200px;" type="button" >Save changes</button>
            </div>
        </div>

    </form>    
</div>
