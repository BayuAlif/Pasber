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
        Schema::create('nota', function (Blueprint $table) {

            $table->id();

            $table->foreignId('WOID')
                ->constrained('work_order')
                ->onDelete('cascade');

            $table->date('tanggal');

            $table->decimal('totalHarga', 15, 2)
                ->default(0);

            $table->enum('status', [
                'pending',
                'belum_lunas',
                'lunas'
            ])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nota');
    }
};
