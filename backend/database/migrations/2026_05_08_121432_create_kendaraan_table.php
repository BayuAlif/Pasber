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
       Schema::create('kendaraan', function (Blueprint $table) {

            $table->id('kendaraanID');

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->enum('jenisKendaraan', ['motor', 'mobil']);

            $table->string('merek');

            $table->string('model');

            $table->string('nomorPolisi')->unique();

            $table->year('tahun');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
