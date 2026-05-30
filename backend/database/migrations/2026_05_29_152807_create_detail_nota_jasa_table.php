<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_nota_jasa', function (Blueprint $table) {

            $table->id();

            $table->foreignId('WOID')
                ->constrained('work_order')
                ->onDelete('cascade');

            $table->string('namaJasa');

            $table->decimal('hargaJasa', 15, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_nota_jasa');
    }
};
