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
        Schema::create('material', function (Blueprint $table) {
            $table->id();
            $table->string('namaMaterial');
            $table->string('merekMaterial');
            $table->string('kodeMaterial')->unique();
            $table->enum('satuan', [
                'pcs',
                'box',
                'liter',
                'set',
                'roll',
                'unit'
            ]);
            $table->integer('harga');
            $table->integer('stok');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material');
    }
};
