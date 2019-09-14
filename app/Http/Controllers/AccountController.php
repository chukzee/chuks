<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Order;
use App\KekeRegister;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
    public function showGet(Request $request, $content = null) {

        if ($content == null || $content == 'main') {
            return view('pages.account', ['page' => 'account', 'content' => 'main']);
        } else if ($content == 'view') {
            return view('pages.account', ['page' => 'account', 'content' => 'view']);
        } else if ($content == 'edit') {
            return view('pages.account', ['page' => 'account', 'content' => 'edit']);
        } else if ($content == 'register_keke') {
            return view('pages.account', ['page' => 'account', 'content' => 'register_keke']);
        } else if ($content == 'settings') {
            return view('pages.account', ['page' => 'account', 'content' => 'settings']);
        } else if ($content == 'help') {
            return view('pages.account', ['page' => 'account', 'content' => 'help']);
        } else if ($content == 'find_ticket_owner') {
            $ticketOwner = $this->getTicketOwner($request->ticket);
            return view('pages.account', ['page' => 'account', 'content' => 'find_ticket_owner', 'ticket_owner' => $ticketOwner]);
        }
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function showPost(Request $request, $content = null) {

        if ($content == 'main') {
            if (empty($request->page)) {
                return view('includes.account.main.main');
            } else {
                return view('includes.account.main.ticket_order_history');
            }
        } else if ($content == 'view') {
            return view('includes.account.view.view');
        } else if ($content == 'edit') {
            return view('includes.account.edit.edit');
        } else if ($content == 'register_keke') {
            return view('includes.account.register_keke.register_keke');
        } else if ($content == 'settings') {
            return view('includes.account.settings.settings');
        } else if ($content == 'help') {
            return view('includes.account.help.help');
        }
    }

    /**
     * 
     *
     * @param  Request  $request
     * @return Response
     */
    public function saveProfile(Request $request) {

        $user = Auth::user();

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->resident_address = $request->resident_address;
        $user->dob = $request->dob;
        $user->status_message = $request->status_message;
        $user->state = $request->state;
        $user->lga = $request->lga;
        $user->bank_name = $request->bank_name;
        $user->bank_account_name = $request->bank_account_name;
        $user->bank_account_no = $request->bank_account_no;
        $user->bank_transaction_details = $request->bank_transaction_details;

        $user->save();
    }

    /**
     * 
     *
     * @param  Request  $request
     * @return Response
     */
    public function storeRegisteredKeke(Request $request) {

        $request->validate([
            'keke_plate_no' => 'required|string',
            'keke_reg_no' => 'required|string',
        ]);

        $registerKeke = new KekeRegister;

        $registerKeke->email = Auth::user()->email;
        $registerKeke->plate_no = $request->keke_plate_no;
        $registerKeke->reg_no = $request->keke_reg_no;

        $registerKeke->save();
    }

    /**
     *
     * @param  Request  $request
     * @return Response
     */
    public function preBuyTicket(Request $request) {

        $validator = Validator::make($request->all(), [
                    'type' => 'required|string',
                    'amount' => 'required|integer|min:1',
                    'state' => 'required|string',
                    'lga' => 'required|string',
        ]);


        if ($validator->fails()) {
            return view('includes.account.main.main')
                            ->withErrors($validator);
        }

        $data = $this->buyTicketData($request);
        return view('includes.account.main.confirm_buy_ticket', $data);
    }

    public function buyTicketData(Request $request) {
        $user = Auth::user();

        $data = [
            'bank_name' => $user->bank_name,
            'bank_account_name' => $user->bank_account_name,
            'bank_account_no' => $user->bank_account_no,
            'bank_transaction_details' => $user->bank_transaction_details,
            'type' => $request->type,
            'amount' => $request->amount,
            'state' => $request->state,
            'lga' => $request->lga,
        ];

        return $data;
    }

    /**
     *
     * @param  Request  $request
     * @return Response
     */
    public function buyTicket(Request $request) {

        $validator = Validator::make($request->all(), [
                    'type' => 'required|string',
                    'amount' => 'required|integer|min:1',
                    'state' => 'required|string',
                    'lga' => 'required|string',
                    'bank_name' => 'required|string',
                    'bank_account_name' => 'required|string',
                    'bank_account_no' => 'required|integer',
                    'bank_transaction_details' => 'required|string',
        ]);

        if ($validator->fails()) {
            $data = $this->buyTicketData($request);
            return view('includes.account.main.confirm_buy_ticket', $data)
                            ->withErrors($validator);
        }

        //TODO - send request via bank api to the bank 
        //next - if successful store the result in the database

        $user = Auth::user();

        $order = new Order;

        $order->email = $user->email;

        $order->amount = $request->amount;
        $order->station = $request->state . ', ' . $request->lga;
        $order->type = $request->type;
        $order->via = $request->via; // set in hidden field in the client
        $order->ticket = $this->generateTicket();

        $order->bank_account_info = $request->bank_name
                . ', ' . $request->bank_account_name
                . ', ' . $request->bank_account_no
                . ', (' . $request->bank_transaction_details . ')';


        $order->save();

        return view('includes.account.main.result_buy_ticket', $order);
    }

    public function generateTicket() {
        $bytes = random_bytes(8);
        $str = bin2hex($bytes); // to get twice the length
        $array = str_split($str);
        $i = 0;
        $s = '';
        $n = -1;
        $len = count($array);
        foreach ($array as $char) {
            $i++;
            $n++;
            $s .= $char;
            if ($i == 4 && $n < $len - 1) {
                $s .= '-';
                $i = 0;
            }
        }
        return $s;
    }

    function findTicketOwner(Request $request) {
        $ticketOwner = $this->getTicketOwner($request->ticket);
        return view('includes.account.ticket_owner', ['ticket_owner' => $ticketOwner]);
    }

    function getTicketOwner(string $ticket) {

        $order = Order::where('ticket', $ticket)->first();
        if (!$order || !$order->email) {
            return null;
        }

        $user = User::where('email', $order->email)->first();
        if (!$user || !$user->email) {
            return null;
        }

        $ticket_owner = [
            'email' => $user->email,
            'ticket' => $order->ticket,
            'order_time' => $order->created_at,
            'full_name' => $user->first_name . ' ' . $user->last_name,
            'photo_url' => $user->photo_url,
            'status_message' => $user->status_message,
        ];

        return $ticket_owner;
    }

    function deleteOrder(Request $request){
        
        //delete orders
        Order::destroy($request->record_ids);
        
        return view('includes.account.main.ticket_order_history');
    }
    
    function showOrderHistory(Request $request){
        
        return view('includes.account.main.ticket_order_history');
    }
    
    function permanentDeleteOrder(Request $request){
        
        //permanently delete orders
        Order::onlyTrashed()
                ->whereIn('id', $request->record_ids)
                ->get()
                ->forceDelete();
        
        return view('includes.account.main.ticket_order_history', ['trash'=> 'true']);
    }
    
    function restoreDeletedOrder(Request $request){
        
        //permanently delete orders
        Order::onlyTrashed()
                ->whereIn('id', $request->record_ids)
                ->get()
                ->restore();
        
        return view('includes.account.main.ticket_order_history', ['trash'=> 'true']);
    }
    
    function showTrashedOrder(Request $request){
        
        //show trashed orders
        
        return view('includes.account.main.ticket_order_history', ['trash'=> 'true']);
    }
    
}
