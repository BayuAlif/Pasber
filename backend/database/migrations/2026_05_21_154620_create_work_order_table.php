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
       Schema::create('work_order', function (Blueprint $table) {

            $table->id();

            $table->foreignId('booking_id')
                ->constrained('booking')
                ->onDelete('cascade');

            $table->foreignId('mekanik_id')
                ->nullable()
                ->constrained('mekanik')
                ->onDelete('cascade');

            $table->enum('statusWO', [
                'approved',
                'assigned',
                'running',
                'qc',
                'done',
                'paid'
            ])->default('approved');

            $table->integer('estimasiWaktu')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_order');
    }
};
