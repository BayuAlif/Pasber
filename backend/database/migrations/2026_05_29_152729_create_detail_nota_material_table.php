<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_nota_material', function (Blueprint $table) {

            $table->id();

            $table->foreignId('WOID')
                ->constrained('work_order')
                ->onDelete('cascade');

            $table->foreignId('materialID')
                ->constrained('material')
                ->onDelete('cascade');

            $table->integer('qty');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_nota_material');
    }
};
