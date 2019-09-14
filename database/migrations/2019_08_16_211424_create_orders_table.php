<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            
            $table->bigIncrements('id');
            $table->string('email')->nullable();
            $table->string('type')->nullable(); //whether keke, car, bus, nurtw e.t.s
            $table->string('ticket')->unique();
            $table->string('station')->nullable();
            $table->string('via')->nullable();// via website or ussd
            $table->integer('amount')->nullable();  
            $table->string('bank_account_info')->nullable();          
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
