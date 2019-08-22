

<div>
    <!--Buy ticket form-->
    <div class="ui stackable grid">
        <div class="eight wide column centered">
            <form  method="POST" action="buy_ticket" class="ui form">
                @csrf

                <div class="field">
                    <label>Ticket Type</label>
                    <select name="type" >
                        <option value="">Select Ticket Type</option>
                        <option value="keke">KeKe</option>
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="nurtw">NURTW</option>
                    </select>
                    @error('type')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>

                <div class="field">
                    <label>Ticket Amount</label>
                    <input type="number" name="amount" class="form-control @error('amount') is-invalid @enderror" required placeholder="Amount">

                    @error('amount')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>
                <button class="primary ui button" type="submit">Buy Ticket</div></button>

            </form>
        </div>

    </div>

    <!-- Ticket orders history-->
    <h3>Ticket Order History</h3>
    <table class="ui striped celled padded table">
        <thead>
            <tr><th class="single line">Date</th>
                <th>Type</th>
                <th>Vechile Reg No.</th>
                <th>Amount</th>
                <th>Ticket</th>
                <th>Via</th>
            </tr></thead>
        <tbody>
            <tr>
                <td>Today, Fri. 24/08/2019</td>
                <td class="single line">Bus</td>
                <td>Y3682J4H5</td>
                <td class="right aligned">100</td>
                <td>JIPE4J30-474-J355-4KF8</td>
                <td>USSD</td>
            </tr>
            <tr>
                <td>Yesterday, Thur. 24/08/2019</td>
                <td class="single line">Bus</td>
                <td>FGE482J4H</td>
                <td class="right aligned">100</td>
                <td>JIPE4J30-474-J355-4KF8</td>
                <td>Website</td>
            </tr>
        </tbody>
        <tfoot>
            <tr><th colspan="6">
                    <div class="ui right floated pagination menu">
                        <a class="icon item">
                            <i class="left chevron icon"></i>
                        </a>
                        <a class="item">1</a>
                        <a class="item">2</a>
                        <a class="item">3</a>
                        <a class="item">4</a>
                        <a class="icon item">
                            <i class="right chevron icon"></i>
                        </a>
                    </div>
                </th>
            </tr>
        </tfoot>
    </table>

</div>