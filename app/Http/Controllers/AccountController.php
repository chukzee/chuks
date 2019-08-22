<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AccountController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function userAccount($content = null) {
        
        if ($content == null) {
            return view('pages.account', ['page' => 'account']);
        } else if ($content == 'main') {
            return view('includes.account.main');
        } else if ($content == 'view') {
            return view('includes.account.view');
        } else if ($content == 'edit') {
            return view('includes.account.edit');
        } else if ($content == 'settings') {
            return view('includes.account.settings');
        } else if ($content == 'help') {
            return view('includes.account.help');
        }
        
        
    }

}
