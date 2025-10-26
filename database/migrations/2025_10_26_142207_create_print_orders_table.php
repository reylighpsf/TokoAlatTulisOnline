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
        Schema::create('print_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_url')->nullable();
            $table->enum('print_type', ['color', 'bw', 'photo']);
            $table->enum('paper_size', ['A4', 'A3', 'Letter', '4x6', '5x7', '8x10']);
            $table->integer('copies');
            $table->integer('total_pages');
            $table->decimal('price_per_page', 8, 2);
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_method', ['cod', 'bank_transfer']);
            $table->enum('payment_status', ['pending', 'paid', 'failed']);
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('print_orders');
    }
};
