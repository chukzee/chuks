<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@index');

Route::get('/about', function () {
    return view('pages.about', ['page'=>'about']);
});

Route::get('/faq', function () {
    return view('pages.faq', ['page'=>'faq']);
});

Route::get('/account/{content?}', 'AccountController@userAccount');

Route::get('/contact', function () {
    return view('pages.contact', ['page'=>'contact']);
});

Auth::routes(['verify' => true]); // include email verification -> ['verify' => true]

Route::get('/home', 'HomeController@index')->name('home');
