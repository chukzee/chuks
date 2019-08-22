
@extends('layouts.default')

@section('top')
{{--Display Nothing--}}    
@endsection

@section('content')

<div class="ui stackable grid" style="min-height: 80%">
    <div class="five wide column"></div>
    <div class="six wide column">
        <div style="padding: 20px;">
            <h4>Don't have an account?<a href="registration"> <a href="register"><button class="primary ui button">Click To Register</button></a></h4>
            <h1>Login</h1>

            <form  method="POST" action="login" class="ui form">
                @csrf

                <div class="field">
                    <!--<label>First Name</label>-->
                    <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" required placeholder="Email">

                    @error('email')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror

                </div>
                <div class="field">
                    <!---<label>Last Name</label>-->
                    <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" required placeholder="Password">

                    @error('password')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>
                <div class="field">
                    <div class="ui checkbox">
                        <input type="checkbox" id="remember" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                        <label for="remember">Remember me</label>
                    </div>
                </div>
                <button class="primary ui button" type="submit">Login <div class="ui active tiny inline loader"></div></button>
                @if (Route::has('password.request'))
                <button class="ui button"><a href="{{ route('password.request') }}">Forgot password?</a></button>
                @endif
            </form>
        </div>
    </div>
    <div class="five wide column"></div>
</div>



@endsection


