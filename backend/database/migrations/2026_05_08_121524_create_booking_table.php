<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking', function (Blueprint $table) {

            $table->id('BookingID');

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('kendaraanID')
                ->constrained('kendaraan', 'kendaraanID')
                ->onDelete('cascade');

            $table->foreignId('bengkel_id')
                ->constrained('bengkel')
                ->onDelete('cascade');

            $table->date('tanggalBooking');

            $table->text('Keluhan');

            $table->string('status');

            $table->dateTime('jadwalService');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};
