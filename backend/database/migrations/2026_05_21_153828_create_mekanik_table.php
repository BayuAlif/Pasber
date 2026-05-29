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
        Schema::create('mekanik', function (Blueprint $table) {
            $table->id();
            $table->string('kodeMekanik')->nullable();

            $table->foreignId('bengkel_id')
                ->constrained('bengkel')
                ->onDelete('cascade');

            $table->string('nama');
            $table->string('email')->unique();

            $table->string('telepon')->nullable();

            $table->string('spesialisasi')->nullable();

            $table->string('foto')->nullable();
            $table->enum('status', [
                'available',
                'unavailable',
            ])->default('available');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mekanik');
    }
};
