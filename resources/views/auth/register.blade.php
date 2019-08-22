
@extends('layouts.default')

@section('top')
{{--Display Nothing--}}    
@endsection

@section('content')

<h1 class="ui block header">Registration</h1>

<div class="ui stackable grid">
    <div class="five wide column"></div>
    <div class="six wide column">

        <form method="post" action="register" class="ui form" style="margin: 0 auto; ; padding: 20px;">
            @csrf
            <div class="field">
                <label>Email</label>
                <input type="email" name="email" placeholder="Email">

                @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <div class="field">
                <label>Password</label>
                <input type="password"  name="password" class="form-control @error('password') is-invalid @enderror" required autocomplete="new-password" placeholder="Password">

                @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <div class="field">
                <label>Confirm password</label>
                <input  type="password" name="password_confirmation" class="form-control" required autocomplete="new-password" placeholder="Confirm password">
            </div>
            <div class="field">
                <label>First name</label>
                <input type="text" name="first_name" placeholder="First name">

                @error('first_name')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <div class="field">
                <label>Last name</label>
                <input type="text" name="last_name" placeholder="Last name">

                @error('last_name')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <div class="field">
                <label>Phone number</label>
                <input type="text" name="phone_no" placeholder="Phone number">
                
                @error('phone_no')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <div class="field">
                <label>Vehicle plate number</label>
                <input type="text" name="vehicle_plate_no" placeholder="Vehicle plate number">

                @error('vehicle_plate_no')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <div class="field">
                <label>Vehicle registration number</label>
                <input type="text" name="vehicle_reg_no" placeholder="Vehicle registration number">

                @error('vehicle_reg_no')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
                @enderror
            </div>
            <button class="primary ui button" type="submit">I'm Done</button>
        </form>
    </div>
    <div class="five wide column"></div>
</div>


@endsection


