
<h1 class="ui block header">Keke Registration</h1>

<div class="ui stackable grid">
    <div class="five wide column"></div>
    <div class="six wide column">

        <form data-el='frm_register_keke' method="post" class="ui form" style="margin: 0 auto; ; padding: 20px;">
            @csrf
            <div class="field">
                <label>Keke plate number</label>
                <input type="text" name="keke_plate_no" class="big ui input @error('keke_plate_no') is-invalid @enderror" placeholder="Keke plate number">

                @error('keke_plate_no')
                <div class="ui pointing red basic label">
                        {{ $message }}
                </div>
                @enderror
            </div>
            <div class="field">
                <label>Keke registration number</label>
                <input type="text" name="keke_reg_no" class="big ui input @error('keke_reg_no') is-invalid @enderror" placeholder="Keke registration number">

                @error('keke_reg_no')
                <div class="ui pointing red basic label">
                        {{ $message }}
                </div>
                @enderror
            </div>
            <button data-url="{{ url('/') }}/account/store_registered_keke" data-el='btn_register_keke' class="green large circular ui button" style="min-width: 200px;" type="button">Register</button>
        </form>
    </div>
    <div class="five wide column"></div>
</div>

