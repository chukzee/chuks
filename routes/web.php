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

Route::post('/account/save_profile', 'AccountController@saveProfile');
Route::post('/account/store_registered_keke', 'AccountController@storeRegisteredKeke');
Route::post('/account/pre_buy_ticket', 'AccountController@preBuyTicket');
Route::post('/account/restore_pre_buy_ticket', 'AccountController@restorePreBuyTicket');
Route::post('/account/buy_ticket', 'AccountController@buyTicket');
Route::post('/account/find_ticket_owner', 'AccountController@findTicketOwner');
Route::post('/account/delete_order_history', 'AccountController@deleteOrder');
Route::post('/account/permanent_delete_order_history', 'AccountController@permanentDeleteOrder');
Route::post('/account/restore_deleted_order_history', 'AccountController@restoreDeletedOrder');
Route::post('/account/trashed_order_history', 'AccountController@showTrashedOrder');
Route::post('/account/show_order_history', 'AccountController@showOrderHistory');
Route::post('/account/upload_profile_photo', 'AccountController@uploadProilePhoto');

Route::get('/account/{content?}', 'AccountController@showGet');
Route::post('/account/{content?}', 'AccountController@showPost');


Route::get('/contact', function () {
    return view('pages.contact', ['page'=>'contact']);
});

Auth::routes(['verify' => true]); // include email verification -> ['verify' => true]

Route::get('/home', 'HomeController@index')->name('home');
