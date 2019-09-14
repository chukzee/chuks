
<?php
$max_records = 7;
$is_trash = false;
if (!empty($trash)) {
    $is_trash = true;
    $orders = App\Order::onlyTrashed()->get()->paginate($max_records);
} else {
    $is_trash = false;
    $orders = App\Order::paginate($max_records);
}

$orders->withPath(url('/') . '/account/main'); // e.g http://example.com/account/main?page=N --
?>

<table class="ui striped celled padded table" id="ticket_order_history_table" data-page-no="{{ $orders->currentPage() }} " >
    <caption>
        <div class="ui  stackable right  menu">
            <a class="icon item"><h3>{{ $is_trash? 'Trashed Records' : 'Ticket Order History' }}</h3></a>
            <div class="right menu">
                
                <a  style="{{ !$is_trash? 'display: none;' : '' }}" class="item" id="ticket_order_history_show" data-url="{{ url('/') . '/account/show_order_history' }}">
                    <i class="left arrow icon"></i> Back to history
                </a>
                <a class="item" id="ticket_order_history_print">
                    <i class="print icon" ></i> Print
                </a>
                <a class="item" id="ticket_order_history_delete" data-url="{{ url('/')}}/account/{{ $is_trash? 'permanent_delete_order_history' : 'delete_order_history' }}">
                    <i class="delete icon"></i> Delete
                </a>
                <a class="item" id="ticket_order_history_trash" data-url="{{ url('/') . '/account/trashed_order_history' }}">
                    <i class="trash icon"></i>Show trash
                </a>
                <a style="{{ !$is_trash? 'display: none;' : '' }}" class="item" id="ticket_order_history_restore" data-url="{{ url('/') . '/account/restore_deleted_order_history' }}">
                    <i class="reveal icon"></i> Restore
                </a>
            </div>
        </div>
    </caption>
    <thead>

        <tr>
            <th><input type="checkbox" /> <span> All</span></th>
            <th class="single line">Date</th>
            <th>Type</th>
            <th>Station</th>
            <th>Amount</th>
            <th>Ticket</th>
            <th>Via</th>
        </tr>
    </thead>
    <tbody style="{{ $is_trash? 'color: red;' : '' }}">

        @foreach ($orders as $order)
        <tr>
            <th><input type="checkbox" class="ticket_history_selection" data-record-id ="{{ $order->id }}"/></th>
            <td class="single line">{{ App\Util::appDayDate($order->created_at) }}</td>
            <td>{{ $order->type }}</td>
            <td>{{ $order->station }}</td>
            <td>{{ $order->amount }}</td>
            <td>{{ $order->ticket }}</td>
            <td>{{ $order->via }}</td>
        </tr>
        @endforeach

    </tbody>
    <tfoot>
        <tr>
            <th colspan="7">
                <div class="ui right floated pagination menu">
                    <a id="ticket_order_history_prev"  class="icon item {{ $orders->onFirstPage() ? 'hidden ' : ''}}" data-url="{{ $orders->previousPageUrl() }}">
                        <i class="left chevron icon"></i>
                    </a>
                    <!--<a class="item">1</a>
                    <a class="item">2</a>
                    <a class="item">3</a>
                    <a class="item">4</a>-->
                    <a id="ticket_order_history_next" class="icon item {{ !$orders->hasMorePages() ? 'hidden ' : ''}}" data-url="{{ $orders->nextPageUrl() }}">
                        <i class="right chevron icon"></i>
                    </a>

                </div>
            </th>

        </tr>
    </tfoot>
</table>
