<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('dob')->nullable();
            $table->string('phone_no')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('keke_plate_no')->nullable();
            $table->string('keke_reg_no')->nullable();
            $table->boolean('newsletter_subcriber')->nullable();
            $table->text('status_message')->nullable();
            $table->text('resident_address')->nullable();
            $table->string('state')->nullable();
            $table->string('lga')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->bigInteger('bank_account_no')->nullable();
            $table->text('bank_transaction_details')->nullable();
            $table->rememberToken();
            $table->timestamp('visited_at')->nullable();
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
        Schema::dropIfExists('users');
    }
}
